<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { marked } from 'marked';
import IdCard from "./components/IdCard.vue";
import SinForm from "./components/SinForm.vue";
import {
  ShadowrunNationality,
  // type ShadowrunNationalityType, // Unused
} from "./components/shadowrun-flags.ts";
// import type { ShadowrunMetatypeType } from "./components/shadowrun-metatypes.ts"; // Unused
import type { ProfileData } from "./@types/profile"; // Import the new ProfileData type

// SinData interface is no longer needed as ProfileData will be used throughout.

const currentView = ref<"landing" | "sin-check" | "create-sin">("landing");

// Refs for "Write to Tag" button state
const isWriting = ref(false);
const writeStatusMessage = ref("");
const writeStatusMessageType = ref<"success" | "error" | "">("");

// New reactive variables for scan status and message
type ScanStatusApp = "idle" | "scanning" | "success" | "error";
const currentScanStatus = ref<ScanStatusApp>("idle");
const currentScanResultMessage = ref("");

// Initialize currentProfileData as a minimal empty object.
// IdCard.vue's withDefaults will handle showing its own default "standby" data.
const currentProfileData = ref<ProfileData>({} as ProfileData);

const readTag = async () => {
  currentScanStatus.value = "idle";
  currentScanResultMessage.value = "";

  if (!("NDEFReader" in window)) {
    currentScanStatus.value = "error";
    currentScanResultMessage.value =
      "Web NFC is not available. Please use a compatible browser (e.g., Chrome on Android) and ensure it's enabled.";
    return;
  }
  try {
    // @ts-ignore
    const ndef = new NDEFReader();
    await ndef.scan();
    currentScanStatus.value = "scanning";
    currentScanResultMessage.value = "Bring a tag closer to read. Scanning...";

    ndef.onreading = (event: any) => {
      let sinDataFound = false;
      currentScanResultMessage.value = "Tag detected! Processing..."; // Update message

      for (const record of event.message.records) {
        if (record.recordType === "mime") {
          let jsonData = "";
          try {
            // We only support gzip now
            if (record.mediaType === "application/vnd.shadowrun.sin+gzip") {
              if (!record.data) throw new Error("Record data is undefined.");
              const compressedData = new Uint8Array(record.data); // NDEF record.data is an ArrayBuffer
              const decompressedData = gunzipSync(compressedData);
              // strFromU8 is not needed here if TextDecoder is used,
              // TextDecoder can decode Uint8Array directly.
              jsonData = new TextDecoder().decode(decompressedData);
              currentScanResultMessage.value = "Decompressed (GZip) and processing SIN data...";
            } else {
              // Not a SIN record we can handle or unknown/old format
              console.log("Skipping record with mediaType:", record.mediaType);
              continue;
            }

            const parsedProfileData: ProfileData = JSON.parse(jsonData);
            sinDataFound = true;
            currentScanStatus.value = "success";
            currentScanResultMessage.value = "SIN data found and parsed.";

            // Tag data is expected to be complete. App.vue only sets systemId.
            currentProfileData.value = {
              ...parsedProfileData,
              systemId: "#ACTIVE#", // Mark as active system from scan
              // All other fields (sinId, sinQuality, Basic, Identity, etc.)
              // are expected to come directly and completely from parsedProfileData.
              
            };
            break; // Found and processed a SIN record
          } catch (e: any) {
            currentScanStatus.value = "error";
            currentScanResultMessage.value = `Error processing SIN data: ${e.message}`;
            console.error("Error processing SIN data:", e);
            // If one record fails, we might want to continue to check other records
            // or break if this was the intended record. For now, let's break.
            break;
          }
        }
      }
      if (!sinDataFound && currentScanStatus.value !== 'error') {
        currentScanStatus.value = "error";
        currentScanResultMessage.value = "No Shadowrun SIN data found on this tag, or data is corrupted/unreadable.";
      }
      // Message for IdCard overlay will be handled by IdCard based on sinId change or status
    };

    ndef.onreadingerror = (event: any) => { // Changed from `event: any` to `event: NDEFReadingErrorEvent` if type available
      currentScanStatus.value = "error";
      currentScanResultMessage.value = `Error reading tag: ${event.message || 'Unknown read error'}`;
      console.error("NDEFReader.onreadingerror", event);
    };
  } catch (error: any) {
    currentScanStatus.value = "error";
    currentScanResultMessage.value = `Error starting scan: ${error.message || 'Failed to start NDEFReader'}`;
    console.error("Error starting NDEFReader scan:", error);
  }
};

import { v4 as uuidv4 } from "uuid"; // Ensure uuid is imported
import { gzipSync, gunzipSync, strToU8 } from 'fflate';

// Handler for SIN form submission
// Parameter is now ProfileData, as SinForm.vue emits ProfileData directly
const handleSinFormSubmit = async (profileDataFromForm: ProfileData) => {
  isWriting.value = true;
  writeStatusMessage.value = "";
  writeStatusMessageType.value = "";

  // SinForm.vue is expected to provide complete ProfileData.
  // App.vue only ensures essential system-generated/override fields.
  const profileDataToWrite: ProfileData = {
    ...profileDataFromForm, // Spread the data from the form
    sinId: profileDataFromForm.sinId || uuidv4(), // Ensure sinId is present, generate if new
    systemId: "#ACTIVE#", // Always set to #ACTIVE# for a written SIN
    // Generate idc and additionalCode if not provided by the form, or use form's values
    idc: profileDataFromForm.idc || `R-${Date.now().toString().slice(-9)} - ${Math.random().toString().slice(2,11)} - ${Math.random().toString().slice(2,11)} - 01`,
    additionalCode: profileDataFromForm.additionalCode || `<<< ${profileDataFromForm.Basic?.nationality || ShadowrunNationality.UNKNOWN}/${profileDataFromForm.Basic?.metatype || 'UNKNOWN'} >>> SIN ID VERIFIED`,
    // All other fields (sinQuality, licenses, Basic, Identity, etc.)
    // are expected to come directly and completely from profileDataFromForm.
  };

  if (!("NDEFReader" in window)) {
    writeStatusMessage.value =
      "Web NFC is not available. Please use a compatible browser (e.g., Chrome on Android) and ensure it's enabled.";
    writeStatusMessageType.value = "error";
    isWriting.value = false;
    return;
  }

  try {
    // @ts-ignore
    const ndef = new NDEFReader();
    const profileDataString = JSON.stringify(profileDataToWrite);
    // fflate's strToU8 can convert string to Uint8Array (UTF-8)
    const encodedData = strToU8(profileDataString);

    // Compress the data using GZip
    const compressedData = gzipSync(encodedData);

    await ndef.write({
      records: [
        {
          recordType: "mime",
          mediaType: "application/vnd.shadowrun.sin+gzip", // Switched to GZip MIME type
          data: compressedData, // Use GZipped data
        },
        // Optional: Add a standard NDEF text record for basic info or URL
        {
          recordType: "text",
          data: `SIN Holder: ${profileDataToWrite.Basic.name}`,
        },
      ],
    });
    writeStatusMessage.value = `Successfully wrote compressed SIN data for ${profileDataToWrite.Basic.name} to tag.`;
    writeStatusMessageType.value = "success";
  } catch (error: any) {
    console.error("Error writing compressed SIN data to tag:", error);
    writeStatusMessage.value = `Error writing SIN data: ${error.message || error}`;
    writeStatusMessageType.value = "error";
  } finally {
    isWriting.value = false;
    setTimeout(() => {
      writeStatusMessage.value = "";
      writeStatusMessageType.value = "";
    }, 5000); // Clear message after 5 seconds
  }
};

const setView = (viewName: "landing" | "sin-check" | "create-sin") => {
  currentView.value = viewName;
  window.location.hash = viewName;
  if (viewName === "sin-check") {
    // Reset currentProfileData to an empty object.
    // IdCard.vue's withDefaults will handle showing its "standby" data.
    currentProfileData.value = {} as ProfileData;
    currentScanStatus.value = "idle"; // Reset scan status
    currentScanResultMessage.value = "";
    readTag(); // Initiate scanning when switching to sin-check view
  }
};

const handleHashChange = () => {
  const hash = window.location.hash.replace(/^#/, "") as
    | "landing"
    | "sin-check"
    | "create-sin";
  if (["landing", "sin-check", "create-sin"].includes(hash)) {
    currentView.value = hash;
    if (hash === "sin-check") {
      readTag();
    }
  } else {
    // Default to landing if hash is invalid or not present
    currentView.value = "landing";
    window.location.hash = "landing"; // Optionally update hash to a valid default
  }
};

onMounted(() => {
  handleHashChange(); // Set initial view based on hash
  window.addEventListener("hashchange", handleHashChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", handleHashChange);
});

// README Modal
const showReadmeModal = ref(false);
const readmeHtmlContent = ref('');

const loadReadme = async () => {
  if (readmeHtmlContent.value) return; // Already loaded

  try {
    const response = await fetch('/info.md');
    if (!response.ok) {
      throw new Error(`Failed to fetch info.md: ${response.statusText}`);
    }
    const markdownText = await response.text();
    // Adjust image paths: replace 'public/' with './' or '/'
    // Marked by default will resolve relative paths from the HTML page's location.
    // If images are in 'public/img.png' and README refers to 'public/img.png',
    // and the app serves 'public' as root, then '/img.png' should work.
    // Or, if README uses 'img.png' and images are in 'public', we might need to prepend '/' if not served from root.
    // For this project, files in `public` are served from the root.
    // So, `public/sin-check-logo.png` in Markdown should become `/sin-check-logo.png` or `sin-check-logo.png` in HTML.
    // `marked` should handle relative paths correctly if the image `src` in markdown is like `sin-check-logo.png`
    // but the README uses `public/sin-check-logo.png`.
    // Let's replace `public/` with `/` to ensure they are treated as root-relative.
    const adjustedMarkdownText = markdownText.replace(/public\//g, '/');
    readmeHtmlContent.value = marked(adjustedMarkdownText) as string;
  } catch (error) {
    console.error("Error loading README:", error);
    readmeHtmlContent.value = "<p>Error loading README. Please try again later.</p>";
  }
};

const toggleReadmeModal = () => {
  showReadmeModal.value = !showReadmeModal.value;
  if (showReadmeModal.value && !readmeHtmlContent.value) {
    loadReadme();
  }
};

onMounted(() => {
  // Optional: Preload README if desired, or load on first click (current behavior)
  // loadReadme();
});

</script>

<template>
  <div class="app-container">
    <!-- Info Button for Landing View -->
    <div v-if="currentView === 'landing'" class="info-button-container">
      <button @click="toggleReadmeModal" class="info-button glitch-text" data-text="(i)">(i)</button>
    </div>

    <!-- Landing View -->
    <div v-if="currentView === 'landing'" class="landing-view main-content">
      <h1 class="landing-headline glitch-text" data-text="SINful">SINful</h1>
      <div class="logo"></div>
      <div class="navigation-buttons">
        <div @click="setView('sin-check')" class="navigation-button">
          <div class="glitch-text" data-text="SIN Check">SIN Check</div>
        </div>
        <div @click="setView('create-sin')" class="navigation-button">
          <div class="glitch-text" data-text="Create SIN">Create SIN</div>
        </div>
      </div>
    </div>

    <!-- SIN Check View -->
    <div
      v-else-if="currentView === 'sin-check'"
      class="sin-check-view main-content"
    >
      <div class="id-card-container">
        <IdCard
          :profileData="currentProfileData"
          :scanStatus="currentScanStatus"
          :scanResultMessage="currentScanResultMessage"
        />
      </div>
      <div class="navigation-buttons">
        <div @click="setView('landing')" class="navigation-button">
          <div class="glitch-text" data-text="Back to Home">Back to Home</div>
        </div>
      </div>
    </div>

    <!-- Create SIN View -->
    <div
      v-else-if="currentView === 'create-sin'"
      class="create-sin-view main-content"
    >
      <div class="create-sin-heading glitch-text" data-text="Create your SIN">
        Create your SIN
      </div>
      <div class="sin-form-section">
        <SinForm
          @submitSinData="handleSinFormSubmit"
          :isWriting="isWriting"
          :writeStatusMessage="writeStatusMessage"
          :writeStatusMessageType="writeStatusMessageType"
        />
      </div>
      <div class="navigation-buttons">
        <div @click="setView('landing')" class="navigation-button">
          <div class="glitch-text" data-text="Back to Home">Back to Home</div>
        </div>
      </div>
    </div>

    <!-- README Modal -->
    <div v-if="showReadmeModal" class="readme-modal-overlay" @click.self="toggleReadmeModal">
      <div class="readme-modal-content">
        <button @click="toggleReadmeModal" class="close-readme-button glitch-text" data-text="X">X</button>
        <div v-html="readmeHtmlContent" class="readme-html-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-button-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100; /* Ensure it's above other landing page content */
}

.info-button {
  background-color: #10012c;
  border: 1px solid #ff1493;
  color: #ff1493;
  padding: 10px 15px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
  /* Inherit glitch-text styles if needed, or apply specific ones */
}

.info-button:hover {
  background-color: #ff1493;
  color: #10012c;
}


.readme-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* High z-index to be on top */
}

.readme-modal-content {
  background-color: #1a2332;
  color: #00ffff;
  padding: 30px;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  height: 80%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid #ff1493;
  box-shadow: 0 0 20px #ff1493;
}

.close-readme-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: 1px solid #ff1493;
  color: #ff1493;
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
}

.close-readme-button:hover {
  background-color: #ff1493;
  color: #10012c;
}

.readme-html-container {
  margin-top: 20px; /* Space below the close button */
}

/* Basic styling for content generated by marked */
.readme-html-container :deep(h1),
.readme-html-container :deep(h2),
.readme-html-container :deep(h3) {
  color: #ff1493;
  margin-top: 1em;
  margin-bottom: 0.5em;
}
.readme-html-container :deep(h1) { font-size: 2em; }
.readme-html-container :deep(h2) { font-size: 1.75em; }
.readme-html-container :deep(h3) { font-size: 1.5em; }

.readme-html-container :deep(p) {
  line-height: 1.6;
  margin-bottom: 1em;
  color: #c0c0c0; /* Lighter text for readability */
}

.readme-html-container :deep(ul),
.readme-html-container :deep(ol) {
  margin-left: 20px;
  margin-bottom: 1em;
  color: #c0c0c0;
}

.readme-html-container :deep(li) {
  margin-bottom: 0.5em;
}

.readme-html-container :deep(a) {
  color: #6ab7ff;
  text-decoration: none;
}

.readme-html-container :deep(a:hover) {
  text-decoration: underline;
}

.readme-html-container :deep(code) {
  background-color: #10012c;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
  color: #00ffff;
}

.readme-html-container :deep(pre) {
  background-color: #10012c;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
}

.readme-html-container :deep(pre code) {
  padding: 0;
  background: none;
}

.readme-html-container :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100dvh; /* Full viewport height */
  width: 100dvw; /* Full viewport width */
  background-color: #1a2332; /* Consistent background */
  color: #00ffff; /* Default text color */
  overflow-y: auto;
  padding: 10px;
}

.main-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Center content vertically */
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  text-align: center; /* Center text elements like h1 */
}

.landing-view .landing-headline {
  font-size: 5em;
}

.glitch-text {
  color: rgba(202, 25, 115, 1);
  background: linear-gradient(180deg, #ff1493 0%, #8a2be2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-family: "Doctor Glitch";
  position: relative;
  z-index: 3;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.glitch-text::before {
  color: rgba(202, 25, 115, 0.6);
  background: rgba(202, 25, 115, 0.3);
  background-clip: text;
  -webkit-background-clip: text;
  animation: subtle-glitch 4s infinite;
}

.glitch-text::after {
  color: rgba(138, 43, 226, 0.4);
  background: rgba(138, 43, 226, 0.2);
  background-clip: text;
  -webkit-background-clip: text;
  animation: subtle-glitch-2 4s infinite;
}

@keyframes subtle-glitch {
  0%,
  85%,
  100% {
    transform: translate(0);
  }
  5% {
    transform: translate(-3px, 1px);
  }
  10% {
    transform: translate(2px, -2px);
  }
  15% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 1px);
  }
  25% {
    transform: translate(0);
  }
}

@keyframes subtle-glitch-2 {
  0%,
  85%,
  100% {
    transform: translate(0);
  }
  7% {
    transform: translate(3px, -1px);
  }
  12% {
    transform: translate(-2px, 2px);
  }
  17% {
    transform: translate(0);
  }
  22% {
    transform: translate(2px, -1px);
  }
  27% {
    transform: translate(0);
  }
}

.logo {
  background-image: url("/sin-check-logo.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 50dvh;
  flex-grow: 1;
}

.navigation-buttons {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  width: 100%;
  height: 5dvh;
}

.navigation-buttons .navigation-button {
  padding: 0px 10px;
  font-size: 1em;
  background: #10012c;
  border: 1px solid #ff1493;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.navigation-buttons .navigation-button:hover {
  background-color: #6ab7ff;
}

/* SIN Check View Specific Styles */
.sin-check-view .id-card-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  aspect-ratio: 4/2;
}

@media (orientation: landscape) {
  .sin-check-view .id-card-container {
    height: 100%;
  }
}

@media (orientation: portrait) {
  .sin-check-view .id-card-container {
    height: calc(95dvh - 5dvh - 10px * 2);
    max-width: 100%;
  }
}

.create-sin-view .create-sin-heading {
  font-size: 2em;
}

/* Create SIN View Specific Styles */
.create-sin-view .sin-form-section {
  width: 100%;
  height: 100%;
  flex-shrink: 1;
  max-width: 600px; /* Max width for the form */
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border: 1px solid #4a9eff;
  border-radius: 8px;
}
</style>
