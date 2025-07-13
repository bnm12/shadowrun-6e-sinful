<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import FancyBackground from "./components/FancyBackground.vue";
import IdCard from "./components/IdCard.vue";
import SinForm from "./components/SinForm.vue";
import ReadmeInfoModal from "./components/ReadmeInfoModal.vue";
import SettingsOverlay from "./components/SettingsOverlay.vue";
import { useNfc } from "./composables/useNfc";
import { useReadme } from "./composables/useReadme";
import {
  SinQuality,
  type SinQuality as SinQualityType,
} from "./proto/profile.pb";

const currentView = ref<"landing" | "sin-check" | "create-sin">("landing");
const { toggleReadmeModal } = useReadme();
const { abortScan } = useNfc(); // Import abortScan from useNfc

const idCardRef = ref<InstanceType<typeof IdCard> | null>(null);
const sinFormRef = ref<InstanceType<typeof SinForm> | null>(null);
const selectedScanLevel = ref<SinQualityType>(SinQuality.SIN_QUALITY_LEVEL_3);
const showScanLevelDropdown = ref(false);
const showSettingsOverlay = ref(false);
const validateOnScan = ref(false);

const setView = (viewName: "landing" | "sin-check" | "create-sin") => {
  currentView.value = viewName;
  history.replaceState(null, "", `#${viewName}`);
};

const handleHashChange = () => {
  const hash =
    (window.location.hash.replace(/^#/, "") as
      | "landing"
      | "sin-check"
      | "create-sin") || "landing";

  if (["landing", "sin-check", "create-sin"].includes(hash)) {
    // Abort any ongoing NFC scan when the view changes
    abortScan();
    currentView.value = hash;
  } else {
    currentView.value = "landing";
    window.location.hash = "landing";
  }
};

onMounted(() => {
  handleHashChange();
  window.addEventListener("hashchange", handleHashChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", handleHashChange);
});
</script>

<template>
  <div class="app-container">
    <FancyBackground :count="25" />
    <!-- Readme Info Modal and its Trigger Button -->
    <ReadmeInfoModal />
    <SettingsOverlay
      :visible="showSettingsOverlay"
      v-model:validate-on-scan="validateOnScan"
      @close="showSettingsOverlay = false"
    />

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
          ref="idCardRef"
          v-model:scanLevel="selectedScanLevel"
          v-model:validate-on-scan="validateOnScan"
          @check-sin="idCardRef?.performSinCheck()"
        />
      </div>
      <div class="navigation-buttons">
        <div class="navigation-button-group rotated-90">
          <div
            @click="showScanLevelDropdown = !showScanLevelDropdown"
            class="navigation-button"
          >
            <div
              class="glitch-text"
              :data-text="SinQuality._toInt(selectedScanLevel)"
            >
              {{ SinQuality._toInt(selectedScanLevel) }}
            </div>
            <div v-if="showScanLevelDropdown" class="dropdown-menu">
              <div
                v-for="value in Object.values(SinQuality).filter(
                  (value) =>
                    typeof value === 'string' &&
                    value !== SinQuality.SIN_QUALITY_UNSPECIFIED
                ) as SinQualityType[]"
                :key="value"
                @click="selectedScanLevel = value"
                class="dropdown-item navigation-button"
                :data-text="SinQuality._toInt(value)"
              >
                {{ SinQuality._toInt(value) }}
              </div>
            </div>
          </div>
          <div
            v-if="!validateOnScan"
            @click="idCardRef?.performSinCheck()"
            class="navigation-button"
          >
            <div class="glitch-text" data-text="✔️">✔️</div>
          </div>
        </div>
        <div @click="setView('landing')" class="navigation-button rotated-90">
          <div class="glitch-text" data-text="🏚️">🏚️</div>
        </div>
        <div
          @click="showSettingsOverlay = true"
          class="navigation-button rotated-90"
        >
          <div class="glitch-text" data-text="⚙️">⚙️</div>
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
        <SinForm ref="sinFormRef" />
      </div>
      <div class="navigation-buttons">
        <div @click="sinFormRef?.readTag(false)" class="navigation-button">
          <div class="glitch-text" data-text="Read Tag">Read Tag</div>
        </div>
        <div @click="setView('landing')" class="navigation-button">
          <div class="glitch-text" data-text="🏚️">🏚️</div>
        </div>
        <div
          @click="sinFormRef?.writeTag(sinFormRef.formData)"
          class="navigation-button"
        >
          <div class="glitch-text" data-text="Write Tag">Write Tag</div>
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
  animation-delay: 5s;
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
  animation-delay: 5s;
  transform: translate(0);
  opacity: 0;
}

.glitch-text::before {
  color: rgba(255, 0, 0, 0.8);
  background: rgba(255, 0, 0, 0.4);
  background-clip: text;
  -webkit-background-clip: text;
  animation: enhanced-glitch-1 20s infinite 5s;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch-text::after {
  color: rgba(0, 255, 255, 0.8);
  background: rgba(0, 255, 255, 0.4);
  background-clip: text;
  -webkit-background-clip: text;
  animation: enhanced-glitch-2 20s infinite 5s;
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
    animation: screen-tear 20s infinite 5s;
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
.dropdown-menu {
  position: absolute;
  background-color: rgba(16, 1, 44, 0.9);
  border: 1px solid #ff1493;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  width: 600%;
  left: -600%;
  height: 100%;
}

.dropdown-item {
  width: 100%;
  height: 100%;
}

.info-button-container {
  position: absolute;
  top: 0;
  right: 0;
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
  justify-content: space-evenly;
  width: 100%;
  height: 5svh;
}

.navigation-button-group {
  position: relative;
  padding: 0px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(16, 1, 44, 0.8);
  border: 1px solid #ff1493;
  border-radius: 5px;
  backdrop-filter: blur(10px);
}

.navigation-button-group:hover {
  background-color: rgba(106, 183, 255, 0.8);
  box-shadow: 0 0 15px rgba(106, 183, 255, 0.4);
}

.rotated-90 {
  transform: rotate(90deg);
}

.navigation-button-group.rotated-90 {
  padding: 0;
}

.navigation-button-group.rotated-90::before {
  position: absolute;
  bottom: calc(100% + 5px);
  content: "Scan Lvl";
  font-size: 0.55em;
}

.navigation-button-group:has(> .navigation-button:nth-child(2)) {
  border: none;
  background: none;
  border-radius: 0;
  backdrop-filter: initial;
}

.navigation-button-group:has(> .navigation-button:nth-child(2)):hover {
  background-color: initial;
  box-shadow: initial;
}

.navigation-buttons .navigation-button-group .navigation-button {
  width: 2.624em;
  height: 100%;
}

.navigation-buttons .navigation-button-group .navigation-button:only-of-type {
  background: none;
  border: none;
  border-radius: 0;
  backdrop-filter: initial;
}

.navigation-buttons
  .navigation-button-group
  .navigation-button:only-of-type:hover {
  background-color: initial;
  box-shadow: none;
}

.navigation-buttons .navigation-button {
  position: relative;
  padding: 0px 10px;
  font-size: 1em;
  background: rgba(16, 1, 44, 0.8);
  border: 1px solid #ff1493;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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
  backdrop-filter: blur(1px);
}
</style>
