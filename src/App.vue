<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue"; // Added onBeforeUnmount
import IdCard from "./components/IdCard.vue";
import SinForm from "./components/SinForm.vue";
import {
  ShadowrunNationality,
  type ShadowrunNationalityType,
} from "./components/shadowrun-flags.ts";
import type { ShadowrunMetatypeType } from "./components/shadowrun-metatypes.ts"; // Import Metatype type
// Import SinQualityValue type and SinQuality value
import { type SinQualityValue, SinQuality } from "./components/sin-quality";

// Define SINData interface
interface SinData {
  sinId?: string; // Optional: UUID for the SIN
  name: string;
  gender: "Male" | "Female" | "Diverse";
  nationality: ShadowrunNationalityType;
  metatype: ShadowrunMetatypeType;
  imageUrl: string;
  sinQuality: SinQualityValue; // Use the new SinQualityValue type
  licenses?: Record<string, SinQualityValue>; // Optional licenses
}

const message = ref("");
const currentView = ref<"landing" | "sin-check" | "create-sin">("landing");

// Refs for "Write to Tag" button state
const isWriting = ref(false);
const writeStatusMessage = ref("");
const writeStatusMessageType = ref<"success" | "error" | "">("");

const currentProfileData = ref<any>({
  // To hold data for IdCard
  sinId: uuidv4(),
  name: "Jane Smith", // Default
  nationality: ShadowrunNationality.UNKNOWN,
  gender: "Female",
  metatype: "Elf",
  photo: "/blank-profile-picture.svg",
  systemId: "#STANDBY#",
  idc: "R-000000000 - 000000000 - 000000000 - 00",
  additionalCode: "<<< WAITING FOR SCAN >>>",
  sinQuality: SinQuality.LEVEL_3, // Default SinQuality.LEVEL_3
  licenses: {}, // Initialize licenses
});

const readTag = async () => {
  if (!("NDEFReader" in window)) {
    message.value =
      "Web NFC is not available. Please use a compatible browser (e.g., Chrome on Android) and ensure it's enabled.";
    return;
  }
  try {
    // @ts-ignore
    const ndef = new NDEFReader();
    await ndef.scan();
    message.value = "Bring a tag closer to read. Scanning...";

    ndef.onreading = (event: any) => {
      message.value = "Tag detected!\n";
      const decoder = new TextDecoder();
      let sinDataFound = false;

      for (const record of event.message.records) {
        message.value += `Record type: ${record.recordType}, MIME type: ${record.mediaType}\n`;

        if (
          record.recordType === "mime" &&
          record.mediaType === "application/vnd.shadowrun.sin"
        ) {
          try {
            const jsonData = decoder.decode(record.data);
            const parsedSinData: SinData = JSON.parse(jsonData);
            sinDataFound = true;

            // Update IdCard data
            currentProfileData.value = {
              name: parsedSinData.name,
              nationality: parsedSinData.nationality,
              gender: parsedSinData.gender,
              metatype: parsedSinData.metatype,
              photo: parsedSinData.imageUrl || "/blank-profile-picture.svg",
              sinQuality: parsedSinData.sinQuality || SinQuality.LEVEL_1, // Use parsed or default
              licenses: parsedSinData.licenses || {}, // Parse licenses
              sinId: parsedSinData.sinId, // Pass the sinId
              systemId: "#ACTIVE#", // Indicate active scan
              idc: `R-${Date.now().toString().slice(-9)} - ${Math.random()
                .toString()
                .slice(2, 11)} - ${Math.random().toString().slice(2, 11)} - 01`, // Dummy IDC
              additionalCode: `<<< ${parsedSinData.nationality}/${parsedSinData.metatype} >>> SIN ID VERIFIED`,
            };
            message.value += `SIN Data: ${JSON.stringify(
              parsedSinData,
              null,
              2
            )}\n`;
            break; // Found SIN data, no need to process other records for this purpose
          } catch (e) {
            message.value += `Error parsing SIN data: ${e}\n`;
            console.error("Error parsing SIN data:", e);
          }
        } else if (record.recordType === "text") {
          message.value += `Text Data: ${decoder.decode(record.data)}\n`;
        } else {
          // Handle other record types if necessary
        }
      }
      if (!sinDataFound) {
        message.value += "No Shadowrun SIN data found on this tag.";
      } else {
        // Clear the message after a delay if SIN data was found
        setTimeout(() => {
          message.value = "";
        }, 5000); // Clear after 5 seconds
      }
    };

    ndef.onreadingerror = (event: any) => {
      message.value = `Error reading tag: ${event.message}`;
      console.error("NDEFReader.onreadingerror", event);
    };
  } catch (error) {
    message.value = `Error starting scan: ${error}`;
    console.error("Error starting NDEFReader scan:", error);
  }
};

import { v4 as uuidv4 } from "uuid";

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

// Watch for changes in message and clear it after a delay if it's a reading message
watch(message, (newMessage) => {
  if (
    newMessage &&
    !writeStatusMessage.value // Don't clear if it's a write status message
  ) {
    setTimeout(() => {
      message.value = "";
    }, 5000); // Clear after 5 seconds
  }
});

const setView = (viewName: "landing" | "sin-check" | "create-sin") => {
  currentView.value = viewName;
  window.location.hash = viewName;
  if (viewName === "sin-check") {
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
  // readTag(); // Removed from here, will be called conditionally by setView/handleHashChange
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
      <img src="/sin-check-logo.png" alt="SIN Check Logo" class="logo" />
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
        <IdCard :profileData="currentProfileData" />
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
  width: auto;
  height: 50dvh;
  flex-grow: 1;
}

.landing-view h1 {
  font-size: 2em;
  color: #4a9eff;
  margin-bottom: 30px;
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
  height: calc(95dvh - 5dvh - 10px * 2);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
