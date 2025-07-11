<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import IdCard from "./components/IdCard.vue";
import SinForm from "./components/SinForm.vue";
import ReadmeInfoModal from "./components/ReadmeInfoModal.vue"; // Import the new component
import type { ProfileData } from "./proto/profile.pb";
import { useNfc } from "./composables/useNfc";
// import { useReadme } from "./composables/useReadme"; // No longer needed here

const currentView = ref<"landing" | "sin-check" | "create-sin">("landing");

const {
  isWriting,
  writeStatusMessage,
  writeStatusMessageType,
  currentScanStatus,
  currentScanResultMessage,
  scannedProfileData,
  readTag,
  writeTag,
} = useNfc();

// const {
//   showReadmeModal,
//   readmeHtmlContent,
//   toggleReadmeModal,
// } = useReadme(); // This instance is no longer used by App.vue template

// Initialize currentProfileData as a minimal empty object.
// IdCard.vue's withDefaults will handle showing its own default "standby" data.
const currentProfileData = ref<ProfileData>({} as ProfileData);

// Watch for changes in scannedProfileData from the composable and update local currentProfileData
watch(scannedProfileData, (newData) => {
  if (newData && newData.sinId) {
    currentProfileData.value = newData;
  }
});

const setView = (viewName: "landing" | "sin-check" | "create-sin") => {
  currentView.value = viewName;
  history.replaceState(null, "", `#${viewName}`);
  if (viewName === "sin-check") {
    currentProfileData.value = {} as ProfileData; // Reset before scan
    readTag();
  }
};

const handleHashChange = () => {
  const hash = window.location.hash.replace(/^#/, "") as
    | "landing"
    | "sin-check"
    | "create-sin";
  if (["landing", "sin-check", "create-sin"].includes(hash)) {
    currentView.value = hash;
    if (hash === "sin-check") {
      currentProfileData.value = {} as ProfileData; // Reset before scan
      readTag();
    }
  } else {
    currentView.value = "landing";
    window.location.hash = "landing";
  }
};

const particles = computed(() => {
  const particleCount = 25;
  const generatedParticles: {
    size: number;
    left: number;
    top: number;
    animationDuration: number;
  }[] = [];
  for (let i = 0; i < particleCount; i++) {
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

const initializeBackground = () => {
  // Add subtle mouse movement effect
  const handleMouseMove = (e: MouseEvent) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const glow = document.querySelector(".glow-effect") as HTMLElement;
    if (glow) {
      glow.style.transform = `translate(-50%, -50%) translate(${mouseX * 30}px, ${mouseY * 30}px)`;
    }
  };

  document.addEventListener("mousemove", handleMouseMove);

  // Store the cleanup function
  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
  };
};

onMounted(() => {
  handleHashChange();
  window.addEventListener("hashchange", handleHashChange);
  initializeBackground();
  // Initial README load can be triggered here if desired, or on first click via toggleReadmeModal
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", handleHashChange);
});
</script>

<template>
  <div class="app-container">
    <!-- Animated Background -->
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

    <!-- Readme Info Modal and its Trigger Button -->
    <ReadmeInfoModal :currentView="currentView" />

    <!-- Landing View -->
    <div v-if="currentView === 'landing'" class="landing-view main-content">
      <h1 class="landing-headline glitch-text" data-text="SINful">SINful</h1>
      <div class="logo"></div>
      <div class="navigation-buttons">
        <div @click="setView('sin-check')" class="navigation-button">
          <div class="glitch-text" data-text="SIN Check">SIN Check</div>
        </div>
        <div @click="setView('create-sin')" class="navigation-button">
          <div class="glitch-text" data-text="Create SIN">Create SIN</div>
        </div>
      </div>
    </div>

    <!-- SIN Check View -->
    <div
      v-else-if="currentView === 'sin-check'"
      class="sin-check-view main-content"
    >
      <div class="id-card-container">
        <IdCard
          :profileData="currentProfileData"
          :scanStatus="currentScanStatus"
          :scanResultMessage="currentScanResultMessage"
        />
      </div>
      <div class="navigation-buttons">
        <div @click="setView('landing')" class="navigation-button">
          <div class="glitch-text" data-text="Back to Home">Back to Home</div>
        </div>
      </div>
    </div>

    <!-- Create SIN View -->
    <div
      v-else-if="currentView === 'create-sin'"
      class="create-sin-view main-content"
    >
      <div class="create-sin-heading glitch-text" data-text="Create your SIN">
        Create your SIN
      </div>
      <div class="sin-form-section">
        <SinForm
          @submitSinData="writeTag"
          :isWriting="isWriting"
          :writeStatusMessage="writeStatusMessage"
          :writeStatusMessageType="writeStatusMessageType"
        />
      </div>
      <div class="navigation-buttons">
        <div @click="setView('landing')" class="navigation-button">
          <div class="glitch-text" data-text="Back to Home">Back to Home</div>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
/* Global styles for glitch text - moved from scoped to global */
.glitch-text {
  color: rgba(202, 25, 115, 1);
  background: linear-gradient(180deg, #ff1493 0%, #8a2be2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-family: "Doctor Glitch";
  position: relative;
  z-index: 3;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.glitch-text::before {
  color: rgba(255, 0, 0, 0.8);
  background: rgba(255, 0, 0, 0.4);
  background-clip: text;
  -webkit-background-clip: text;
  animation: enhanced-glitch-1 20s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch-text::after {
  color: rgba(0, 255, 255, 0.8);
  background: rgba(0, 255, 255, 0.4);
  background-clip: text;
  -webkit-background-clip: text;
  animation: enhanced-glitch-2 20s infinite;
  clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
}

@keyframes enhanced-glitch-1 {
  0%,
  98%,
  100% {
    transform: translate(0);
    opacity: 0;
  }
  10% {
    transform: translate(-8px, 2px);
    opacity: 0.9;
  }
  10.5% {
    transform: translate(-6px, -3px);
    opacity: 0.8;
  }
  11% {
    transform: translate(0);
    opacity: 0;
  }
  60% {
    transform: translate(0);
    opacity: 0;
  }
  60.5% {
    transform: translate(-7px, 3px);
    opacity: 1;
  }
  61% {
    transform: translate(0);
    opacity: 0;
  }
}

@keyframes enhanced-glitch-2 {
  0%,
  98%,
  100% {
    transform: translate(0);
    opacity: 0;
  }
  10.2% {
    transform: translate(6px, -2px);
    opacity: 0.9;
  }
  10.7% {
    transform: translate(8px, 4px);
    opacity: 0.7;
  }
  11.2% {
    transform: translate(0);
    opacity: 0;
  }
  60.2% {
    transform: translate(0);
    opacity: 0;
  }
  60.7% {
    transform: translate(7px, -1px);
    opacity: 1;
  }
  61.2% {
    transform: translate(0);
    opacity: 0;
  }
}

/* Add a subtle screen-tear effect for extra cyberpunk feel */
@media (prefers-reduced-motion: no-preference) {
  .glitch-text {
    animation: screen-tear 20s infinite;
  }

  @keyframes screen-tear {
    0%,
    99%,
    100% {
      filter: none;
    }
    10.1% {
      filter: blur(0.5px) brightness(1.2);
    }
    10.3% {
      filter: none;
    }
    60.1% {
      filter: none;
    }
    60.3% {
      filter: blur(0.3px) contrast(1.1);
    }
    60.5% {
      filter: none;
    }
  }
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100svh; /* Full viewport height */
  width: 100svw; /* Full viewport width */
  background: linear-gradient(135deg, #0a0a2e, #1a2332, #16213e);
  color: #00ffff; /* Default text color */
  overflow-y: auto;
  padding: 10px;
  position: relative;
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
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

.main-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Center content vertically */
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  text-align: center; /* Center text elements like h1 */
  position: relative;
  z-index: 10;
}

.landing-view .landing-headline {
  font-size: 5em;
}

.logo {
  background-image: url("/sin-check-logo.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 50svh;
  flex-grow: 1;
}

.navigation-buttons {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  width: 100%;
  height: 5svh;
}

.navigation-buttons .navigation-button {
  padding: 0px 10px;
  font-size: 1em;
  background: rgba(16, 1, 44, 0.8);
  border: 1px solid #ff1493;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
}

.navigation-buttons .navigation-button:hover {
  background-color: rgba(106, 183, 255, 0.8);
  box-shadow: 0 0 15px rgba(106, 183, 255, 0.4);
}

/* SIN Check View Specific Styles */
.sin-check-view .id-card-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  aspect-ratio: 4/2;
}

@media (orientation: landscape) {
  .sin-check-view .id-card-container {
    height: 100%;
  }
}

@media (orientation: portrait) {
  .sin-check-view .id-card-container {
    height: calc(95svh - 5svh - 10px * 2);
    max-width: 100%;
  }
}

.create-sin-view .create-sin-heading {
  font-size: 2em;
}

/* Create SIN View Specific Styles */
.create-sin-view .sin-form-section {
  width: 100%;
  height: 100%;
  flex-shrink: 1;
  max-width: 600px; /* Max width for the form */
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border: 1px solid #4a9eff;
  border-radius: 8px;
  background: rgba(26, 35, 50, 0.7);
  backdrop-filter: blur(10px);
}
</style>
