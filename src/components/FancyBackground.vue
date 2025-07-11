<template>
  <div class="background-container">
    <div class="floating-particles">
      <template v-for="particle in particles">
        <div
          class="particle"
          :style="{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDuration: `${particle.animationDuration}s`,
          }"
        ></div>
      </template>
    </div>
    <div class="grid-overlay"></div>
    <div class="glow-effect"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  count: number;
}>();

const particles = computed(() => {
  const generatedParticles: {
    size: number;
    left: number;
    top: number;
    animationDuration: number;
  }[] = [];
  for (let i = 0; i < props.count; i++) {
    generatedParticles.push({
      // Random size between 2-8px
      size: Math.random() * 6 + 2,

      // Random position
      left: Math.random() * 100,
      top: Math.random() * 100,

      // Random animation duration
      animationDuration: Math.random() * 4 + 5,
    });
  }
  return generatedParticles;
});

// TODO: Move mousemove logic here if it's tightly coupled with the background

let cleanupMouseMove: (() => void) | null = null;

const initializeBackground = () => {
  // Add subtle mouse movement effect
  const handleMouseMove = (e: MouseEvent) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    // Query within the component's scope if possible, or ensure it runs after DOM is ready.
    // Since this is in FancyBackground's script setup, document.querySelector should be fine
    // once the component is mounted.
    const glow = document.querySelector(".glow-effect") as HTMLElement;
    if (glow) {
      glow.style.transform = `translate(-50%, -50%) translate(${mouseX * 30}px, ${mouseY * 30}px)`;
    }
  };

  document.addEventListener("mousemove", handleMouseMove);

  // Store the cleanup function
  cleanupMouseMove = () => {
    document.removeEventListener("mousemove", handleMouseMove);
  };
};

onMounted(() => {
  initializeBackground();
});

onBeforeUnmount(() => {
  if (cleanupMouseMove) {
    cleanupMouseMove();
  }
});
</script>

<style scoped>
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Ensure it's behind other content */
  pointer-events: none; /* Allow clicks to pass through */
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(255, 20, 147, 0.4);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.particle:nth-child(2n) {
  background: rgba(106, 183, 255, 0.3);
  animation-delay: -2s;
}

.particle:nth-child(3n) {
  background: rgba(0, 255, 255, 0.2);
  animation-delay: -4s;
}

.particle:nth-child(4n) {
  background: rgba(138, 43, 226, 0.25);
  animation-delay: -1s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
    opacity: 1;
  }
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255, 20, 147, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 20, 147, 0.1) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.4;
  animation: gridMove 15s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(60px, 60px);
  }
}

.glow-effect {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(255, 20, 147, 0.08) 0%,
    transparent 70%
  );
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: glow 4s ease-in-out infinite alternate;
}

@keyframes glow {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.6;
  }
}
</style>
