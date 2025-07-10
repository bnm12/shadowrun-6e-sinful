<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import IdCard from "./components/IdCard.vue";
import SinForm from "./components/SinForm.vue";
import {
  ShadowrunNationality,
  type ShadowrunNationalityType,
} from "./components/shadowrun-flags.ts";
import type { ShadowrunMetatypeType } from "./components/shadowrun-metatypes.ts";
import { type SinQualityValue, SinQuality } from "./components/sin-quality";

interface SinData {
  sinId?: string;
  name: string;
  gender: "Male" | "Female" | "Diverse";
  nationality: ShadowrunNationalityType;
  metatype: ShadowrunMetatypeType;
  imageUrl: string;
  sinQuality: SinQualityValue;
  licenses?: Record<string, SinQualityValue>;
}

const currentView = ref<"landing" | "sin-check" | "create-sin">("landing");

// Refs for "Write to Tag" button state
const isWriting = ref(false);
const writeStatusMessage = ref("");
const writeStatusMessageType = ref<"success" | "error" | "">("");

// New reactive variables for scan status and message
type ScanStatusApp = "idle" | "scanning" | "success" | "error";
const currentScanStatus = ref<ScanStatusApp>("idle");
const currentScanResultMessage = ref("");

const currentProfileData = ref<any>({
  // To hold data for IdCard - initialized to a minimal/empty state
  nationality: ShadowrunNationality.UNKNOWN, // Minimal necessary defaults
  gender: "N/A",
  metatype: "N/A",
  photo: "/blank-profile-picture.svg", // Default photo can remain
  sinQuality: SinQuality.LEVEL_1, // Corrected: Default to lowest valid quality
  licenses: {},
});

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
      const decoder = new TextDecoder();
      let sinDataFound = false;
      currentScanResultMessage.value = "Tag detected! Processing..."; // Update message

      for (const record of event.message.records) {
        if (
          record.recordType === "mime" &&
          record.mediaType === "application/vnd.shadowrun.sin"
        ) {
          try {
            const jsonData = decoder.decode(record.data);
            const parsedSinData: SinData = JSON.parse(jsonData);
            sinDataFound = true;
            currentScanStatus.value = "success"; // Set status to success
            currentScanResultMessage.value = "SIN data found and parsed."; // Generic success message

            // Update IdCard data
            currentProfileData.value = {
              name: parsedSinData.name,
              nationality: parsedSinData.nationality,
              gender: parsedSinData.gender,
              metatype: parsedSinData.metatype,
              photo: parsedSinData.imageUrl || "/blank-profile-picture.svg",
              sinQuality: parsedSinData.sinQuality || SinQuality.LEVEL_1,
              licenses: parsedSinData.licenses || {},
              sinId: parsedSinData.sinId || uuidv4(), // Ensure sinId is present
              systemId: "#ACTIVE#",
              idc: `R-${Date.now().toString().slice(-9)} - ${Math.random()
                .toString()
                .slice(2, 11)} - ${Math.random().toString().slice(2, 11)} - 01`,
              additionalCode: `<<< ${parsedSinData.nationality}/${parsedSinData.metatype} >>> SIN ID VERIFIED`,

              // Sample data for new fields
              address: "123 Main St, Apt 4B",
              city: "Seattle",
              country: "UCAS",
              birthdate: "2050-08-15",
              birthplace: "Seattle General Hospital",
              size: "Average",
              height: "1.75m",
              weight: "70kg",
              skin: "Pale",
              hair: "Brown",
              eyes: "Blue",
              bloodType: "O+",
              fingerprints: "On File",
              eyeScan: "Retinal Scan Verified",
              medicalRecord: "No major conditions on file. Last checkup: 2077-03-10.",
              profession: "System Administrator",
              employer: "Ares Macrotechnology",
              employerAddress: "456 Tech Ave, Bellevue, UCAS",
              verifiedDataLinks: {
                civil: "UCAS Civil Registry ID: 789012",
                bank: "Eurobank Account: ****-****-1234",
                personal: "Personal Commlink: +1-206-555-0100",
              },
              dnaFingerprintPattern: "ACGTAGCATCGATCG...",
            };
            // IdCard overlay will show "SIN Scanned successfully" due to sinId change
            break;
          } catch (e: any) {
            currentScanStatus.value = "error";
            currentScanResultMessage.value = `Error parsing SIN data: ${e.message}`;
            console.error("Error parsing SIN data:", e);
          }
        }
      }
      if (!sinDataFound && currentScanStatus.value !== 'error') { // Don't overwrite parse error
        currentScanStatus.value = "error"; // Or perhaps a different status like 'nodata'
        currentScanResultMessage.value = "No Shadowrun SIN data found on this tag.";
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

// Handler for SIN form submission
const handleSinFormSubmit = async (sinData: SinData) => {
  isWriting.value = true;
  writeStatusMessage.value = "";
  writeStatusMessageType.value = "";
  sinData.sinId = uuidv4(); // Add sinId to the data

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
    const sinDataString = JSON.stringify(sinData);
    const encoder = new TextEncoder();

    await ndef.write({
      records: [
        {
          recordType: "mime",
          mediaType: "application/vnd.shadowrun.sin",
          data: encoder.encode(sinDataString),
        },
        // Optional: Add a standard NDEF text record for basic info or URL
        {
          recordType: "text",
          data: `SIN Holder: ${sinData.name}`,
        },
      ],
    });
    // message.value = `Successfully wrote SIN data for ${sinData.name} to tag.`; // Replaced
    writeStatusMessage.value = `Successfully wrote SIN data for ${sinData.name} to tag.`;
    writeStatusMessageType.value = "success";
  } catch (error) {
    console.error("Error writing SIN data to tag:", error);
    // message.value = `Error writing SIN data: ${error}`; // Replaced
    writeStatusMessage.value = `Error writing SIN data: ${error}`;
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
    currentProfileData.value = {
      nationality: ShadowrunNationality.UNKNOWN,
      gender: "N/A",
      metatype: "N/A",
      photo: "/blank-profile-picture.svg",
      systemId: "#STANDBY#",
      sinQuality: SinQuality.LEVEL_1, // Corrected: Default to lowest valid quality
      licenses: {},
    };
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
</script>

<template>
  <div class="app-container">
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
  </div>
</template>

<style scoped>
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
