<template>
  <transition name="fade">
    <div v-if="visible" class="id-card-overlay">
      <div class="overlay-content">
        <p class="overlay-message">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  visible: boolean;
}

withDefaults(defineProps<Props>(), {
  message: "",
  visible: false,
});
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
}

.overlay-message {
  color: #00ffff; /* Cyan text color */
  font-size: 1.5em; /* Larger font size */
  font-family: "Courier New", monospace; /* Consistent font */
  margin: 0;
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
