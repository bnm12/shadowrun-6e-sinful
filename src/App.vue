<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import FancyBackground from "./components/FancyBackground.vue"; // Import the new component
import IdCard from "./components/IdCard.vue";
import SinForm from "./components/SinForm.vue";
import ReadmeInfoModal from "./components/ReadmeInfoModal.vue"; // Import the new component
import type { ProfileData } from "./proto/profile.pb";
import { useNfc } from "./composables/useNfc";
import { useReadme } from "./composables/useReadme"; // Restore import

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

const { toggleReadmeModal } = useReadme(); // Restore for the button's click handler

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

onMounted(() => {
  handleHashChange();
  window.addEventListener("hashchange", handleHashChange);
  // initializeBackground(); // Logic moved to FancyBackground.vue
  // Initial README load can be triggered here if desired, or on first click via toggleReadmeModal
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", handleHashChange);
});
</script>

<template>
  <div class="app-container">
    <FancyBackground :count="45" />
    <!-- Readme Info Modal and its Trigger Button -->
    <ReadmeInfoModal />

    <!-- Landing View -->
    <div v-if="currentView === 'landing'" class="landing-view main-content">
      <!-- Info Button for Landing View -->
      <div class="info-button-container">
        <div class="info-button" @click="toggleReadmeModal">
          <span class="glitch-text" data-text="i">i</span>
        </div>
      </div>
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
.info-button-container {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 100; /* Ensure it's above other landing page content */
}

.info-button {
  border: 1px solid #ff1493;
  color: #ff1493;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  /* Torn/damaged edge effect */
  clip-path: polygon(
    0% 0%,
    80% 0%,
    100% 20%,
    90% 40%,
    100% 60%,
    85% 80%,
    100% 100%,
    0% 100%,
    10% 80%,
    0% 60%,
    15% 40%,
    0% 20%
  );
}

.info-button:hover {
  background-color: #ff1493;
  color: #10012c;
  box-shadow: 0 0 20px rgba(255, 20, 147, 0.5);
  transform: scale(1.1);
}

.info-button > span {
  font-family: monospace;
}

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
