<script setup lang="ts">
import { ref } from "vue";
import IdCard from "./components/IdCard.vue";
import SinForm from "./components/SinForm.vue";
import {
  ShadowrunNationality,
  type ShadowrunNationalityType,
} from "./components/shadowrun-flags";
import type { ShadowrunMetatypeType } from "./components/shadowrun-metatypes"; // Import Metatype type
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
const showSinForm = ref(false); // Control visibility of SIN Form
const currentProfileData = ref<any>({
  // To hold data for IdCard
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
  message.value = "Attempting to write SIN data to tag...";
  sinData.sinId = uuidv4(); // Add sinId to the data
  if (!("NDEFReader" in window)) {
    message.value =
      "Web NFC is not available. Please use a compatible browser (e.g., Chrome on Android) and ensure it's enabled.";
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
    message.value = `Successfully wrote SIN data for ${sinData.name} to tag.`;
  } catch (error) {
    console.error("Error writing SIN data to tag:", error);
    message.value = `Error writing SIN data: ${error}`;
  }
};
</script>

<template>
  <div class="app-container">
    <div class="main-content">
      <div class="id-card-container">
        <IdCard :profileData="currentProfileData" />
      </div>
      <div class="nfc-controls">
        <button type="button" @click="readTag">Read Tag</button>
        <!-- Toggle button for showing SIN Form -->
        <button type="button" @click="showSinForm = !showSinForm">
          {{ showSinForm ? "Hide SIN Form" : "Create new SIN" }}
        </button>
        <!-- Original writeTag button can be removed or repurposed later -->
        <!-- <button type="button" @click="writeTag">Write Generic Tag</button> -->
        <p v-if="message">{{ message }}</p>
      </div>
    </div>

    <div v-if="showSinForm" class="sin-form-section">
      <SinForm @submitSinData="handleSinFormSubmit" />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column; /* Stack card area and controls vertically */
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.main-content {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center IdCard horizontally */
  align-items: center; /* Center IdCard vertically */
  width: 100%;
  position: relative; /* For potential absolute positioning of children if needed */
}

/* IdCard itself will be handled by its own styles for rotation and sizing */
.id-card-container {
  height: 80vh;
  max-height: 80vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.sin-form-section {
  width: 100%;
  max-width: 90vw; /* Make form responsive */
  margin-top: 20px; /* Space above the form if it's visible */
}

.nfc-controls {
  margin-top: 20px; /* Space between card area and controls */
  display: flex;
  flex-direction: row; /* Lay out buttons side-by-side */
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
  justify-content: center; /* Center buttons */
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: rgba(
    0,
    0,
    0,
    0.3
  ); /* Optional: slight background for controls */
  border-radius: 8px;
  width: auto; /* Fit content */
  max-width: 90vw; /* Ensure controls don't get too wide */
}

.nfc-controls button {
  flex-grow: 1; /* Allow buttons to share space */
  min-width: 120px; /* Minimum width for readability */
}

.nfc-controls p {
  width: 100%; /* Message takes full width of controls area */
  text-align: center;
  margin-top: 10px;
  font-size: 0.9em;
  word-break: break-word;
}
</style>
