<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import IdCard from "./components/IdCard.vue";
import SinForm from "./components/SinForm.vue";
import type { ProfileData } from "./proto/profile.pb";
import { useNfc } from "./composables/useNfc";
import { useReadme } from "./composables/useReadme";

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

const {
  showReadmeModal,
  readmeHtmlContent,
  // loadReadme, // loadReadme is called internally by toggleReadmeModal
  toggleReadmeModal,
} = useReadme();

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
  // Initial README load can be triggered here if desired, or on first click via toggleReadmeModal
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", handleHashChange);
});
</script>

<template>
  <div class="app-container">
    <!-- Info Button for Landing View -->
    <div v-if="currentView === 'landing'" class="info-button-container">
      <button
        @click="toggleReadmeModal"
        class="info-button glitch-text"
        data-text="(i)"
      >
        (i)
      </button>
    </div>

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

    <!-- README Modal -->
    <div
      v-if="showReadmeModal"
      class="readme-modal-overlay"
      @click.self="toggleReadmeModal"
    >
      <div class="readme-modal-content">
        <button
          @click="toggleReadmeModal"
          class="close-readme-button glitch-text"
          data-text="X"
        >
          X
        </button>
        <div v-html="readmeHtmlContent" class="readme-html-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-button-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100; /* Ensure it's above other landing page content */
}

.info-button {
  background-color: #10012c;
  border: 1px solid #ff1493;
  color: #ff1493;
  padding: 10px 15px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
  /* Inherit glitch-text styles if needed, or apply specific ones */
}

.info-button:hover {
  background-color: #ff1493;
  color: #10012c;
}

.readme-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* High z-index to be on top */
}

.readme-modal-content {
  background-color: #1a2332;
  color: #00ffff;
  padding: 30px;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  height: 80%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid #ff1493;
  box-shadow: 0 0 20px #ff1493;
}

.close-readme-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: 1px solid #ff1493;
  color: #ff1493;
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
}

.close-readme-button:hover {
  background-color: #ff1493;
  color: #10012c;
}

.readme-html-container {
  margin-top: 20px; /* Space below the close button */
}

/* Basic styling for content generated by marked */
.readme-html-container :deep(h1),
.readme-html-container :deep(h2),
.readme-html-container :deep(h3) {
  color: #ff1493;
  margin-top: 1em;
  margin-bottom: 0.5em;
}
.readme-html-container :deep(h1) {
  font-size: 2em;
}
.readme-html-container :deep(h2) {
  font-size: 1.75em;
}
.readme-html-container :deep(h3) {
  font-size: 1.5em;
}

.readme-html-container :deep(p) {
  line-height: 1.6;
  margin-bottom: 1em;
  color: #c0c0c0; /* Lighter text for readability */
}

.readme-html-container :deep(ul),
.readme-html-container :deep(ol) {
  margin-left: 20px;
  margin-bottom: 1em;
  color: #c0c0c0;
}

.readme-html-container :deep(li) {
  margin-bottom: 0.5em;
}

.readme-html-container :deep(a) {
  color: #6ab7ff;
  text-decoration: none;
}

.readme-html-container :deep(a:hover) {
  text-decoration: underline;
}

.readme-html-container :deep(code) {
  background-color: #10012c;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
  color: #00ffff;
}

.readme-html-container :deep(pre) {
  background-color: #10012c;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
}

.readme-html-container :deep(pre code) {
  padding: 0;
  background: none;
}

.readme-html-container :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100dvh; /* Full viewport height */
  width: 100dvw; /* Full viewport width */
  background-color: #1a2332; /* Consistent background */
  color: #00ffff; /* Default text color */
  overflow-y: auto;
  padding: 10px;
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
}

.landing-view .landing-headline {
  font-size: 5em;
}

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
  0%, 98%, 100% {
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
  0%, 98%, 100% {
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
    0%, 99%, 100% {
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

.logo {
  background-image: url("/sin-check-logo.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 50dvh;
  flex-grow: 1;
}

.navigation-buttons {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  width: 100%;
  height: 5dvh;
}

.navigation-buttons .navigation-button {
  padding: 0px 10px;
  font-size: 1em;
  background: #10012c;
  border: 1px solid #ff1493;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.navigation-buttons .navigation-button:hover {
  background-color: #6ab7ff;
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
    height: calc(95dvh - 5dvh - 10px * 2);
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
}
</style>
