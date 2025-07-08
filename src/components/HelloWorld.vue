<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
const message = ref('')

const readTag = async () => {
  if ('NDEFReader' in window) {
    try {
      const ndef = new NDEFReader()
      await ndef.scan()
      message.value = 'Bring a tag closer to read.'

      ndef.onreading = event => {
        const decoder = new TextDecoder()
        for (const record of event.message.records) {
          message.value = `Record type: ${record.recordType}\n`
          message.value += `MIME type: ${record.mediaType}\n`
          message.value += `Data: ${decoder.decode(record.data)}\n`
        }
      }
    } catch (error) {
      message.value = `Error: ${error}`
    }
  } else {
    message.value = 'Web NFC is not supported on this browser.'
  }
}

const writeTag = async () => {
  if ('NDEFReader' in window) {
    try {
      const ndef = new NDEFReader()
      await ndef.write({
        records: [{ recordType: 'text', data: 'hello world' }]
      })
      message.value = 'Wrote "hello world" to tag.'
    } catch (error) {
      message.value = `Error: ${error}`
    }
  } else {
    message.value = 'Web NFC is not supported on this browser.'
  }
}
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
