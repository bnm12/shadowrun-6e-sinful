<script setup lang="ts">
import { ref } from "vue";
import IdCard from "./components/IdCard.vue";
import { ShadowrunNationality } from "./components/shadowrun-flags";

const message = ref("");

const readTag = async () => {
  if (!("NDEFReader" in window)) {
    message.value =
      "Web NFC is not available. Please use a compatible browser (e.g., Chrome on Android) and ensure it's enabled.";
    return;
  }
  try {
    // TODO: Fix: Property 'NDEFReader' does not exist on type 'Window & typeof globalThis'.
    // @ts-ignore
    const ndef = new NDEFReader();
    await ndef.scan();
    message.value = "Bring a tag closer to read.";

    ndef.onreading = (event: any) => {
      const decoder = new TextDecoder();
      for (const record of event.message.records) {
        message.value = `Record type: ${record.recordType}\n`;
        message.value += `MIME type: ${record.mediaType}\n`;
        message.value += `Data: ${decoder.decode(record.data)}\n`;
      }
    };
  } catch (error) {
    message.value = `Error reading tag: ${error}`;
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
</script>

<template>
  <IdCard
    :profileData="{
      name: 'Jane Smith',
      nationality: ShadowrunNationality.AUSTRIA,
      gender: 'Female',
      metatype: 'Elf',
      photo: 'https://via.placeholder.com/120x150/333/fff?text=Photo',
      systemId: '#Active#',
      idc: 'R-123456789 - 987654321 - 456789123 - 01',
      additionalCode: '<<< 12345678/DEU/33456 >>> SIN ID',
    }"
  />
  <div class="nfc-controls">
    <button type="button" @click="readTag">Read Tag</button>
    <button type="button" @click="writeTag">Write Tag</button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.nfc-controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
