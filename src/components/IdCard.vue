<template>
  <div class="id-card">
    <IdCardOverlay :visible="isOverlayVisible" :message="overlayMessage" />
    <div class="card-header">
      <div class="header-tabs">
        <div class="quality-tabs">
          <div
            v-for="qualityTab in filteredSinQualitiesList"
            :key="`quality-tab-${qualityTab.value}`"
            :class="[
              'tab',
              'quality-tab-item',
              { active: activeTab === qualityTab.value },
            ]"
            @click="selectTab(qualityTab.value)"
          >
            {{ qualityTab.title }}
          </div>
        </div>
        <div
          class="tab licenses-tab"
          :class="{ active: activeTab === 'licenses' }"
          @click="selectTab('licenses')"
        >
          Licenses
        </div>
      </div>
    </div>

    <div class="card-content">
      <!-- Licenses Display Section -->
      <div
        v-if="activeTab === 'licenses'"
        class="licenses-display-section tab-content-section"
      >
        <h4>Licenses on Record</h4>
        <ul
          v-if="
            profileData.licenses && Object.keys(profileData.licenses).length > 0
          "
          class="licenses-list-display"
        >
          <li v-for="(quality, name) in profileData.licenses" :key="name">
            <span class="license-name">{{ name }}</span
            >:
            <span class="license-quality">{{
              getSinQualityTextById(quality)
            }}</span>
          </li>
        </ul>
        <p v-else class="no-licenses-message">No licenses on record.</p>
      </div>

      <!-- Basic Info (Original Content) -->
      <template v-if="activeTab === SinQuality.LEVEL_1">
        <div class="left-section tab-content-section">
          <div class="photo-section">
            <div class="photo-container">
              <img
                :src="profileData.photo"
                :alt="profileData.name"
                class="profile-photo"
              />
            </div>
          </div>
        </div>

        <div
          class="right-section tab-content-section"
          v-if="activeTab === SinQuality.LEVEL_1"
        >
          <div class="top-right-section">
            <div class="barcode">
              <div class="barcode-lines">
                <div
                  v-for="(n, index) in barcodeWidths"
                  :key="index"
                  class="barcode-line"
                  :data-barcode-width="n"
                ></div>
              </div>
              <div class="sin-id">
                {{ internalProfileData.sinId }}
              </div>
            </div>
            <div class="flag-container">
              <div class="flag" :style="{ background: getFlagColors() }"></div>
              <div class="flag-nationality">{{ internalProfileData.nationality }}</div>
            </div>
          </div>

          <div class="info-section">
            <span class="name">{{ internalProfileData.name }}</span>
            <div class="details">
              <div class="detail-row">
                <span class="label">Nationality</span>
                <span class="label-colon">:</span>
                <span class="value">{{ internalProfileData.nationality }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Gender</span>
                <span class="label-colon">:</span>
                <span class="value">{{ internalProfileData.gender }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Metatype</span>
                <span class="label-colon">:</span>
                <span class="value">{{ internalProfileData.metatype }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Placeholder for Identity Info -->
      <div
        v-if="activeTab === SinQuality.LEVEL_2"
        class="tab-content-section placeholder-content"
      >
        <h4>Identity Information</h4>
        <p>Detailed identity records will be displayed here.</p>
        <p>
          SIN Quality Flair: {{ getSinQualityTextById(SinQuality.LEVEL_2) }}
        </p>
      </div>

      <!-- Placeholder for Physical Info -->
      <div
        v-if="activeTab === SinQuality.LEVEL_3"
        class="tab-content-section placeholder-content"
      >
        <h4>Physical Characteristics</h4>
        <p>Biometric data and physical descriptors will be displayed here.</p>
        <p>
          SIN Quality Flair: {{ getSinQualityTextById(SinQuality.LEVEL_3) }}
        </p>
      </div>

      <!-- Placeholder for Medical Info -->
      <div
        v-if="activeTab === SinQuality.LEVEL_4"
        class="tab-content-section placeholder-content"
      >
        <h4>Medical Records</h4>
        <p>
          Comprehensive medical history and conditions will be displayed here.
        </p>
        <p>
          SIN Quality Flair: {{ getSinQualityTextById(SinQuality.LEVEL_4) }}
        </p>
      </div>

      <!-- Placeholder for Employment Info -->
      <div
        v-if="activeTab === SinQuality.LEVEL_5"
        class="tab-content-section placeholder-content"
      >
        <h4>Employment History</h4>
        <p>
          Official employment records and affiliations will be displayed here.
        </p>
        <p>
          SIN Quality Flair: {{ getSinQualityTextById(SinQuality.LEVEL_5) }}
        </p>
      </div>

      <!-- Placeholder for Genetic Info -->
      <div
        v-if="activeTab === SinQuality.LEVEL_6"
        class="tab-content-section placeholder-content"
      >
        <h4>Genetic Markers</h4>
        <p>Genetic data and heritage information will be displayed here.</p>
        <p>
          SIN Quality Flair: {{ getSinQualityTextById(SinQuality.LEVEL_6) }}
        </p>
      </div>
    </div>

    <div class="system-info">
      <div class="system-title">
        System Identification Number : {{ internalProfileData.systemId }}
      </div>
      <div class="system-codes">
        <div class="code-line">IDC : {{ internalProfileData.idc }}</div>
        <div class="code-line">{{ internalProfileData.additionalCode }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Rand from "rand-seed";
import { computed, ref, watch } from "vue"; // Removed computed as effectiveSinQuality is removed // Added watch
import IdCardOverlay from "./IdCardOverlay.vue"; // Import the overlay component
import {
  ShadowrunNationality,
  getFlagCSS,
  type ShadowrunNationalityType,
} from "./shadowrun-flags";
// Removed getSinQualityFlair from this import
import {
  SinQuality,
  type SinQualityValue,
  getAllSinQualities,
} from "./sin-quality";

interface ProfileData {
  name: string;
  nationality: ShadowrunNationalityType;
  gender: string;
  metatype: string;
  photo: string;
  systemId: string;
  idc: string;
  additionalCode: string;
  flagColors?: string; // Optional manual override
  sinQuality: SinQualityValue; // Use SinQualityValue type
  licenses?: Record<string, SinQualityValue>; // Optional licenses
  sinId?: string; // Add sinId to ProfileData
}

type ScanStatus = "idle" | "scanning" | "success" | "error";

interface Props {
  profileData: ProfileData;
  scanStatus: ScanStatus;
  scanResultMessage?: string;
}

const INITIAL_SIN_ID = "00000000-0000-0000-0000-000000000000"; // Hardcoded initial SIN ID

const props = withDefaults(defineProps<Props>(), {
  profileData: () => ({
    name: "John Doe", // Default name
    nationality: ShadowrunNationality.UNKNOWN,
    gender: "Male",
    metatype: "Human",
    photo: "./blank-profile-picture.svg",
    systemId: "#STANDBY#", // Default systemId, will be updated by App.vue
    idc: "R-000000000 - 000000000 - 000000000 - 00",
    additionalCode: "<<< WAITING FOR SCAN >>>",
    sinQuality: SinQuality.LEVEL_1,
    licenses: {},
    sinId: INITIAL_SIN_ID, // Use hardcoded initial SIN ID
  }),
  scanStatus: "idle",
  scanResultMessage: "",
});

// Overlay state - will be computed based on props
const isOverlayVisible = ref(true); // Will be managed by new logic
const overlayMessage = ref("Waiting for SIN");

// New watcher for overlay logic
watch(
  [() => props.scanStatus, () => props.scanResultMessage, () => props.profileData.sinId],
  ([newStatus, newMessage, newSinId], [_oldStatus, _oldMessage, oldSinId]) => {
    // Priority 1: Actual SIN data changed (successful read)
    if (newSinId && newSinId !== INITIAL_SIN_ID && newSinId !== oldSinId) {
      overlayMessage.value = "SIN Scanned successfully";
      isOverlayVisible.value = true;
      setTimeout(() => {
        isOverlayVisible.value = false;
      }, 2000);
    }
    // Priority 2: Specific scanning states from App.vue
    else if (newStatus === "scanning") {
      overlayMessage.value = newMessage || "Scanning...";
      isOverlayVisible.value = true;
    } else if (newStatus === "error") {
      overlayMessage.value = newMessage || "Error during scan.";
      isOverlayVisible.value = true;
      // Optional: auto-hide error after a delay
      // setTimeout(() => { isOverlayVisible.value = false; }, 3000);
    } else if (newStatus === "success") {
      // Generic success from App.vue, only if not handled by sinId change.
      overlayMessage.value = newMessage || "Operation successful.";
      isOverlayVisible.value = true;
      setTimeout(() => { isOverlayVisible.value = false; }, 2000);
    }
    // Priority 3: Idle states
    else if (newStatus === "idle") {
      if (!newSinId || newSinId === INITIAL_SIN_ID) {
        overlayMessage.value = "Waiting for SIN";
        isOverlayVisible.value = true;
      } else {
        // Idle and have a valid SIN, hide overlay
        isOverlayVisible.value = false;
      }
    }
    // Fallback for initial load or unhandled states:
    // If visible is true and no message set, default to "Waiting for SIN"
    // This is mostly covered by immediate:true and idle state logic.
    // else if (isOverlayVisible.value && !overlayMessage.value) {
    //   overlayMessage.value = "Waiting for SIN";
    // }
  },
  { immediate: true, deep: false }
);

// This watcher will be replaced by logic reacting to scanStatus and profileData.sinId changes
// watch(
//   () => props.profileData.systemId,
//   (newSystemId, _oldSystemId) => {
//     if (newSystemId === "#ACTIVE#") {
//       overlayMessage.value = "SIN Scanned successfully";
//       isOverlayVisible.value = true; // Ensure it's visible
//
//       setTimeout(() => {
//         isOverlayVisible.value = false;
//       }, 2000); // Display success message for 2 seconds then fade out
//     } else if (newSystemId === "#STANDBY#") {
//       overlayMessage.value = "Waiting for SIN";
//       isOverlayVisible.value = true;
//     }
//   },
//   { immediate: true }
// );

const internalProfileData = computed(() => {
  // If the passed sinId is undefined or the initial one, use full default data
  if (!props.profileData.sinId || props.profileData.sinId === INITIAL_SIN_ID) {
    // This block is entered for the initial state.
    return {
      // Start with App.vue's minimal passed data (e.g., photo URL might be specific)
      ...props.profileData,

      // Now, explicitly set IdCard.vue's own defaults for the "Waiting for SIN" display.
      // These will override anything from the spread above if there were conflicts for these keys.
      name: "Jane Doe", // IdCard's default waiting name
      gender: "N/A",   // IdCard's default waiting gender
      metatype: "N/A", // IdCard's default waiting metatype
      systemId: "#STANDBY#",
      idc: "R-000000000 - 000000000 - 000000000 - 00",
      additionalCode: "<<< WAITING FOR SCAN >>>",
      sinQuality: SinQuality.LEVEL_1, // Corrected: Default to lowest valid quality
      sinId: INITIAL_SIN_ID, // Crucially, ensure sinId is the initial one
      // nationality and photo can come from props.profileData or their defaults if not set by App.vue
      nationality: props.profileData.nationality || ShadowrunNationality.UNKNOWN,
      photo: props.profileData.photo || "./blank-profile-picture.svg",
      licenses: props.profileData.licenses || {}, // Ensure licenses is an object
      flagColors: getFlagCSS(props.profileData.nationality || ShadowrunNationality.UNKNOWN),
    };
  }
  // This is for when a real SIN is scanned
  return {
    ...props.profileData, // Use the actual data from App.vue
    // Ensure nationality is valid for getFlagCSS if profileData might be incomplete
    flagColors: getFlagCSS(props.profileData.nationality || ShadowrunNationality.UNKNOWN),
  };
});


const barcodeWidths = computed(() => {
  const barcodeRand = new Rand(
    // Use a default seed if sinId is not available or system is not active
    internalProfileData.value.sinId && internalProfileData.value.sinId !== INITIAL_SIN_ID
      ? internalProfileData.value.sinId
      : Date.now().toString()
  );
  const max = 9;
  const min = 0;
  return Array.from({ length: 75 }, () =>
    Math.floor(barcodeRand.next() * (max - min + 1) + min)
  );
});

const activeTab = ref<SinQualityValue | "licenses">(SinQuality.LEVEL_1); // Default to Basic (LEVEL_1)
const sinQualitiesList = getAllSinQualities();

const filteredSinQualitiesList = computed(() =>
  sinQualitiesList.filter(
    (sq) => sq.value <= (props.profileData?.sinQuality ?? SinQuality.LEVEL_1)
  )
);

// The function `getSinQualityTextById` is used in the template to get the flair text.
const getSinQualityTextById = (qualityValue: SinQualityValue): string => {
  const quality = sinQualitiesList.find((q) => q.value === qualityValue);
  return quality ? quality.text : "Unknown Quality";
};

const selectTab = (tabIdentifier: SinQualityValue | "licenses") => {
  activeTab.value = tabIdentifier;
};

// effectiveSinQuality computed property is removed as it's no longer directly used for rendering tabs.

// Function to get flag colors based on nationality or manual override
const getFlagColors = (): string => {
  // If manual colors are provided, use them
  if (internalProfileData.value.flagColors) { // Use internalProfileData
    return internalProfileData.value.flagColors;
  }

  // Otherwise, look up by nationality
  return getFlagCSS(internalProfileData.value.nationality); // Use internalProfileData
};
</script>

<style scoped>
.id-card {
  background: linear-gradient(135deg, #1a2332 0%, #2a3847 100%);
  border: 2px solid #4a9eff;
  border-radius: 8px;
  font-family: "Courier New", monospace;
  color: #00ffff;
  position: relative; /* Keep relative for pseudo-elements */
  box-shadow: 0 0 20px rgba(74, 158, 255, 0.5);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 10px;
  aspect-ratio: 4/2;
}

@media (orientation: landscape) {
  .id-card {
    height: 100%;
    max-width: 100%;
  }
}

@media (orientation: portrait) {
  .id-card {
    transform: rotate(90deg);
    transform-origin: center center;
    height: calc(100dvw - 10px * 2);
    max-width: calc(95dvh - 5dvh - 10px * 2);
  }
}

/* Ensure pseudo-elements rotate with the card if they are positioned relative to it */
.id-card::before,
.id-card::after {
  pointer-events: none;
  /* transform-origin might need to be adjusted if they look off */
}

.card-header {
  height: 8%; /* Relative height */
  background: linear-gradient(to right, #4a9eff, #6ab7ff);
  display: flex;
  align-items: center;
  padding: 0 2px;
}

.header-tabs {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  position: relative; /* Ensure it creates a stacking context */
}

.quality-tabs {
  display: flex;
  align-items: center;
  gap: 1%; /* Relative gap */
  height: 100%;
  width: 100%;
}

.tab {
  height: 70%; /* Relative to header height, increased slightly */
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px 3px 0 0; /* Rounded top corners */
  padding: 0 10px; /* Add horizontal padding */
  display: flex;
  flex-shrink: 1;
  align-items: center;
  justify-content: center;
  font-size: 0.8em; /* Adjusted font size for titles */
  color: #1a2332; /* Darker text for contrast on light tabs */
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent; /* For active state indication */
  transition: background-color 0.3s, border-color 0.3s;
  max-width: 16%;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.5);
}

.tab.active {
  background: #00ffff;
  color: #007bff; /* Highlight active tab text */
  /*border-bottom: 2px solid #007bff; /* Active tab underline */
  font-weight: bold;
}

.card-content {
  display: flex;
  gap: 10px;
  flex-grow: 1;
  overflow-y: auto;
  justify-content: space-around;
  padding: 0 10px;
}

.tab-content-section {
  width: 100%; /* Each section takes full width */
  padding: 5px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 4px;
  background-color: rgba(0, 255, 255, 0.03);
  color: #00ffff; /* Default text color for content sections */
}

/* Specific styling for when left and right sections are visible for Basic Info */
.card-content > .left-section.tab-content-section {
  width: 30%; /* Restore original width */
}
.card-content > .right-section.tab-content-section {
  width: 66%; /* Restore original width */
}

.placeholder-content h4 {
  color: #4a9eff;
  margin-bottom: 10px;
}

.placeholder-content p {
  font-size: clamp(0.7em, 2dvh, 1em);
  line-height: 1.6;
  margin-bottom: 8px;
}

.licenses-display-section h4 {
  color: #4a9eff;
  margin-bottom: 10px;
  font-size: clamp(0.8em, 2.5dvh, 1.2em);
}

.licenses-list-display {
  list-style-type: none;
  padding: 0;
  font-size: clamp(0.7em, 2dvh, 1em);
}

.licenses-list-display li {
  margin-bottom: 8px;
  padding: 5px;
  background-color: rgba(0, 255, 255, 0.05);
  border-left: 3px solid #4a9eff;
}

.license-name {
  font-weight: bold;
}

.license-quality {
  font-style: italic;
}

.no-licenses-message {
  font-style: italic;
  color: #88ddff;
  font-size: clamp(0.7em, 2dvh, 1em);
}

.left-section {
  display: flex;
  flex-direction: column;
  width: 30%; /* Proportion of card content */
}

.photo-section {
  width: 100%;
  height: 100%;
}

.photo-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 5%; /* Relative gap */
  width: 66%; /* Proportion of card content */
}

.top-right-section {
  display: flex;
  flex-direction: row;
  gap: 2%; /* Relative gap */
  height: 25%; /* Relative to right-section height */
  justify-content: space-between;
}

.barcode {
  width: 70%; /* Proportion of top-right-section */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.barcode-lines {
  display: flex;
  gap: 1px; /* Minimal gap for lines */
  align-items: end;
  height: 100%;
}

.barcode-line {
  height: 100%;
  width: 1px;
  flex-grow: 1;
}

.barcode-line::after {
  content: "";
  background: #00ffff;
  display: block;
  height: 100%;
}

.barcode-line[data-barcode-width="0"]::after {
  width: 0%;
}
.barcode-line[data-barcode-width="1"]::after {
  width: 10%;
}
.barcode-line[data-barcode-width="2"]::after {
  width: 20%;
}
.barcode-line[data-barcode-width="3"]::after {
  width: 30%;
}
.barcode-line[data-barcode-width="4"]::after {
  width: 40%;
}
.barcode-line[data-barcode-width="5"]::after {
  width: 50%;
}
.barcode-line[data-barcode-width="6"]::after {
  width: 60%;
}
.barcode-line[data-barcode-width="7"]::after {
  width: 70%;
}
.barcode-line[data-barcode-width="8"]::after {
  width: 80%;
}
.barcode-line[data-barcode-width="9"]::after {
  width: 90%;
}

.sin-id,
.flag-nationality {
  font-size: 0.7em;
  width: 100%;
  white-space: nowrap;
}

.flag-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  aspect-ratio: 37/28;
}

.flag {
  border: 1px solid #00ffff;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 5%; /* Relative gap */
  flex-grow: 1;
}

.name {
  font-size: clamp(1em, 4dvh, 2em); /* Responsive font size */
  font-weight: bold;
  color: #00ffff;
  text-align: left;
  line-height: 1.1;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.5dvh; /* Relative gap */
}

.detail-row {
  display: flex;
  flex-direction: row;
  justify-content: start;
  font-size: clamp(0.6em, 2dvh, 1em); /* Responsive font size */
  gap: 1%;
}

.label {
  color: #4a9eff;
  min-width: 100px;
  width: 35%; /* Adjust based on content */
  text-align: left;
  display: inline-block;
  white-space: nowrap;
}

.label-colon {
  color: #4a9eff;
}

.value {
  color: #00ffff;
  white-space: nowrap;
}

.system-info {
  background: rgba(0, 255, 255, 0.1);
  padding: 2% 3%; /* Relative padding */
  border-top: 1px solid #4a9eff;
  font-size: clamp(0.5em, 1.8dvh, 0.8em); /* Responsive font size */
}

.system-title {
  color: #00ffff;
  margin-bottom: 1%;
  font-weight: bold;
}

.system-codes {
  display: flex;
  flex-direction: column;
  gap: 0.3dvh;
}

.code-line {
  color: #4a9eff;
  font-size: clamp(0.4em, 1.5dvh, 0.7em); /* Responsive font size */
  font-family: "Courier New", monospace;
}

/* Glowing effect */
.id-card::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #4a9eff, #00ffff, #4a9eff);
  border-radius: 8px;
  z-index: 1;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    opacity: 0.01;
  }
  to {
    opacity: 0.1;
  }
}

/* Scan line effect */
.id-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px; /* Thickness of the scan line */
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 20, 147, 0.5),
    transparent
  );
  animation: scan 3s linear infinite;
  z-index: 1; /* Ensure it's above other content if necessary */
}

@keyframes scan {
  0% {
    top: calc(0 - 2px);
  }
  100% {
    top: calc(100% + 2px);
  }
}
</style>
