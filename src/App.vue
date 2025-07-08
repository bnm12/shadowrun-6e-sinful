<script setup lang="ts">
import { ref } from "vue";
import IdCard from "./components/IdCard.vue";
import SinForm from "./components/SinForm.vue"; // Import SinForm
import { ShadowrunNationality } from "./components/shadowrun-flags";
import type { ShadowrunMetatypeType } from "./components/shadowrun-metatypes"; // Import Metatype type

// Define SINData interface
interface SinData {
  name: string;
  gender: "Male" | "Female" | "Diverse";
  nationality: ShadowrunNationality;
  metatype: ShadowrunMetatypeType;
  imageUrl: string;
}

const message = ref("");
const showSinForm = ref(true); // Control visibility of SIN Form
const currentProfileData = ref<any>({
  // To hold data for IdCard
  name: "Jane Smith", // Default
  nationality: ShadowrunNationality.UCAS,
  gender: "Female",
  metatype: "Elf",
  photo: "https://via.placeholder.com/120x150/333/fff?text=Photo",
  systemId: "#STANDBY#",
  idc: "R-000000000 - 000000000 - 000000000 - 00",
  additionalCode: "<<< WAITING FOR SCAN >>>",
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
              photo:
                parsedSinData.imageUrl ||
                "https://via.placeholder.com/120x150/333/fff?text=No+Photo",
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

const writeTag = async () => {
  if (!("NDEFReader" in window)) {
    message.value =
      "Web NFC is not available. Please use a compatible browser (e.g., Chrome on Android) and ensure it's enabled.";
    return;
  }
  try {
    // TODO: Fix: Property 'NDEFReader' does not exist on type 'Window & typeof globalThis'.
    // @ts-ignore
    const ndef = new NDEFReader();
    await ndef.write({
      records: [{ recordType: "text", data: "hello world" }],
    });
    message.value = 'Wrote "hello world" to tag.';
  } catch (error) {
    message.value = `Error writing to tag: ${error}`;
  }
};

// Handler for SIN form submission
const handleSinFormSubmit = async (sinData: SinData) => {
  message.value = "Attempting to write SIN data to tag...";
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
      <IdCard :profileData="currentProfileData" />
      <div class="nfc-controls">
        <button type="button" @click="readTag">Read Tag</button>
        <!-- Toggle button for showing SIN Form -->
        <button type="button" @click="showSinForm = !showSinForm">
          {{ showSinForm ? "Hide SIN Form" : "Show SIN Form" }}
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
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.sin-form-section {
  width: 100%;
  max-width: 500px; /* Match ID card width or adjust as needed */
}

.nfc-controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
