<template>
  <div v-if="visible" class="overlay-container" @click.self="$emit('close')">
    <div class="overlay-content">
      <h2 class="glitch-text" data-text="Settings">Settings</h2>
      <div class="setting-item">
        <input
          type="checkbox"
          id="validate-on-scan-checkbox"
          :checked="validateOnScan"
          @change="$emit('update:validateOnScan', ($event.target as HTMLInputElement).checked)"
        />
        <label for="validate-on-scan-checkbox">Validate on scan</label>
      </div>
      <button @click="$emit('close')" class="close-button">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SettingsOverlayProps {
  visible: boolean;
  validateOnScan: boolean;
}

defineProps<SettingsOverlayProps>();
defineEmits(["close", "update:validateOnScan"]);
</script>

<style scoped>
.overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: linear-gradient(135deg, #0a0a2e, #1a2332, #16213e);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ff1493;
  box-shadow: 0 0 20px rgba(255, 20, 147, 0.5);
  color: #00ffff;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.close-button {
  background-color: #ff1493;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: #c71585;
}
</style>
