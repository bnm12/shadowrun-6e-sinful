<template>
  <transition name="fade">
    <div v-if="visible" class="id-card-overlay">
      <div class="overlay-content" :class="resultClass">
        <p class="overlay-message">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { sincheckresult } from "../utils/sin-check-helpers";

interface Props {
  message: string;
  visible: boolean;
  resultType?: sincheckresult;
}

const props = withDefaults(defineProps<Props>(), {
  message: "",
  visible: false,
  resultType: undefined,
});

const resultClass = computed(() =>
  props.resultType ? `result-${props.resultType}` : ""
);
</script>

<style scoped>
.id-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  backdrop-filter: blur(10px); /* Blur effect */
  -webkit-backdrop-filter: blur(10px); /* For Safari */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's on top */
  border-radius: 8px; /* Match IdCard border-radius */
  padding: 20px;
}

.overlay-content {
  text-align: center;
  padding: 20px;
  background-color: rgba(
    26,
    35,
    50,
    0.8
  ); /* Darker, slightly transparent background for content */
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  border: 2px solid rgba(0, 255, 255, 0.5);
}

.overlay-message {
  color: #00ffff; /* Cyan text color */
  font-size: 1.5em; /* Larger font size */
  font-family: "Courier New", monospace; /* Consistent font */
  margin: 0;
}

.result-success {
  border-color: rgba(0, 255, 0, 0.5);
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
}

.result-success .overlay-message {
  color: #00ff00;
}

.result-blip {
  border-color: rgba(255, 255, 0, 0.5);
  box-shadow: 0 0 15px rgba(255, 255, 0, 0.5);
}

.result-blip .overlay-message {
  color: #ffff00;
}

.result-flagged {
  border-color: rgba(255, 105, 180, 0.5);
  box-shadow: 0 0 15px rgba(255, 105, 180, 0.5);
}

.result-flagged .overlay-message {
  color: #ff69b4;
}

.result-burned {
  border-color: rgba(255, 0, 0, 0.5);
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
}

.result-burned .overlay-message {
  color: #ff0000;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
