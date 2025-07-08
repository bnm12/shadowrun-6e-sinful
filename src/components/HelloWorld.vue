<script setup lang="ts">
// IMPORTANT: Web NFC API Requirements
// 1. HTTPS: The page must be served over HTTPS (localhost is usually an exception for development).
// 2. Compatible Browser: Use a browser that supports Web NFC (e.g., Chrome on Android).
// 3. User Gesture: NFC operations must be initiated by a user gesture (e.g., a button click).
// 4. Permissions: The browser may ask for user permission to use NFC.
// 5. Experimental Flags (Sometimes): Depending on the browser version, you might need to enable
//    experimental web platform features or specific flags (e.g., in chrome://flags).

import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);
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
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <button type="button" @click="readTag">Read Tag</button>
    <button type="button" @click="writeTag">Write Tag</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p v-if="message">{{ message }}</p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
