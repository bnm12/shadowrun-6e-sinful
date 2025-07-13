<template>
  <transition name="fade">
    <div v-if="visible" class="status-overlay">
      <div class="overlay-content" :class="statusClass">
        <p class="overlay-message">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

type StatusType = "reading" | "writing" | "success" | "error" | "";

interface Props {
  message: string;
  visible: boolean;
  status: StatusType;
}

const props = withDefaults(defineProps<Props>(), {
  message: "",
  visible: false,
  status: "",
});

const statusClass = computed(() =>
  props.status ? `status-${props.status}` : ""
);
</script>

<style scoped>
.status-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  border-radius: 8px;
}

.overlay-content {
  text-align: center;
  padding: 20px;
  background-color: rgba(26, 35, 50, 0.85);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
  border: 2px solid rgba(0, 255, 255, 0.7);
}

.overlay-message {
  color: #00ffff;
  font-size: 1.6em;
  font-family: "Doctor Glitch", monospace;
  margin: 0;
  text-transform: uppercase;
}

.status-reading .overlay-message,
.status-writing .overlay-message {
  color: #ffff00;
}

.status-success {
  border-color: rgba(0, 255, 0, 0.7);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
}

.status-success .overlay-message {
  color: #00ff00;
}

.status-error {
  border-color: rgba(255, 0, 0, 0.7);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
}

.status-error .overlay-message {
  color: #ff0000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
