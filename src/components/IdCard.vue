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
                :src="internalProfileData.Basic.photo"
                :alt="internalProfileData.Basic.name"
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
              <div class="flag-nationality">
                {{ internalProfileData.Basic.nationality }}
              </div>
            </div>
          </div>

          <div class="info-section">
            <span class="name">{{ internalProfileData.Basic.name }}</span>
            <div class="details">
              <div class="detail-row">
                <span class="label">Nationality</span>
                <span class="label-colon">:</span>
                <span class="value">{{
                  internalProfileData.Basic.nationality
                }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Gender</span>
                <span class="label-colon">:</span>
                <span class="value">{{
                  internalProfileData.Basic.gender
                }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Metatype</span>
                <span class="label-colon">:</span>
                <span class="value">{{
                  internalProfileData.Basic.metatype
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Identity Info (SIN Quality 2) -->
      <div v-if="activeTab === SinQuality.LEVEL_2" class="tab-content-section">
        <h4>Identity Information</h4>
        <div class="details">
          <div class="detail-row">
            <span class="label">Address</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Identity.address || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">City</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Identity.city || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Country</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Identity.country || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Birthdate</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Identity.birthdate || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Birthplace</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Identity.birthplace || "N/A"
            }}</span>
          </div>
        </div>
      </div>

      <!-- Physical Info (SIN Quality 3) -->
      <div v-if="activeTab === SinQuality.LEVEL_3" class="tab-content-section">
        <h4>Physical Characteristics</h4>
        <div class="details">
          <div class="detail-row">
            <span class="label">Size</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Physical.size || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Height</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Physical.height || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Weight</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Physical.weight || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Skin</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Physical.skin || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Hair</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Physical.hair || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Eyes</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Physical.eyes || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Blood Type</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Physical.bloodType || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Fingerprints</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Physical.fingerprints || "N/A"
            }}</span>
          </div>
        </div>
      </div>

      <!-- Medical Info (SIN Quality 4) -->
      <div v-if="activeTab === SinQuality.LEVEL_4" class="tab-content-section">
        <h4>Medical Records</h4>
        <div class="details">
          <div class="detail-row">
            <span class="label">Eye Scan</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Medical.eyeScan || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Medical Record</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Medical.medicalRecord || "N/A"
            }}</span>
          </div>
        </div>
      </div>

      <!-- Employment Info (SIN Quality 5) -->
      <div v-if="activeTab === SinQuality.LEVEL_5" class="tab-content-section">
        <h4>Employment History</h4>
        <div class="details">
          <div class="detail-row">
            <span class="label">Profession</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Employment.profession || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Employer</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Employment.employer || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Employer Address</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Employment.employerAddress || "N/A"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Verified Data Links</span>
            <span class="label-colon">:</span>
            <div class="value">
              <div>
                Civil:
                {{
                  internalProfileData.Employment.verifiedDataLinks?.civil ||
                  "N/A"
                }}
              </div>
              <div>
                Bank:
                {{
                  internalProfileData.Employment.verifiedDataLinks?.bank ||
                  "N/A"
                }}
              </div>
              <div>
                Personal:
                {{
                  internalProfileData.Employment.verifiedDataLinks?.personal ||
                  "N/A"
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Genetic Info (SIN Quality 6) -->
      <div v-if="activeTab === SinQuality.LEVEL_6" class="tab-content-section">
        <h4>Genetic Markers</h4>
        <div class="details">
          <div class="detail-row">
            <span class="label">DNA Fingerprint Pattern</span>
            <span class="label-colon">:</span>
            <span class="value">{{
              internalProfileData.Genetic.dnaFingerprintPattern || "N/A"
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="system-info">
      <div class="system-title">
        {{ internalProfileData.active ? "## ACTIVE ##" : "## BURNED ##" }}
      </div>
      <div class="system-codes">
        <div class="code-line">IDC : {{ idc }}</div>
        <div class="code-line">{{ additionalCode }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// This is a separate, non-setup script block for module-scoped constants/functions
import { ShadowrunNationality } from "./shadowrun-flags";
import { SinQuality } from "./sin-quality";
import type { ProfileData } from "../@types/profile";

const INITIAL_SIN_ID_MODULE = "00000000-0000-0000-0000-000000000000";

export const getDefaultProfileData = (): ProfileData => ({
  sinId: INITIAL_SIN_ID_MODULE,
  active: false,
  sinQuality: SinQuality.LEVEL_1,
  licenses: {},
  Basic: {
    name: "Jane Doe",
    gender: "N/A",
    nationality: ShadowrunNationality.UNKNOWN,
    metatype: "N/A",
    photo: "/blank-profile-picture.svg",
  },
  Identity: {
    address: "N/A",
    city: "N/A",
    country: "N/A",
    birthdate: "N/A",
    birthplace: "N/A",
  },
  Physical: {
    size: "N/A",
    height: "N/A",
    weight: "N/A",
    skin: "N/A",
    hair: "N/A",
    eyes: "N/A",
    bloodType: "N/A",
    fingerprints: "N/A",
  },
  Medical: {
    eyeScan: "N/A",
    medicalRecord: "N/A",
  },
  Employment: {
    profession: "N/A",
    employer: "N/A",
    employerAddress: "N/A",
    verifiedDataLinks: { civil: "N/A", bank: "N/A", personal: "N/A" },
  },
  Genetic: {
    dnaFingerprintPattern: "N/A",
  },
});
</script>

<script setup lang="ts">
import Rand from "rand-seed";
import { computed, ref, watch } from "vue"; // Removed computed as effectiveSinQuality is removed // Added watch
import IdCardOverlay from "./IdCardOverlay.vue"; // Import the overlay component
import { getFlagCSS } from "./shadowrun-flags"; // ShadowrunNationality is imported in the script block above
// Removed getSinQualityFlair from this import
import { getAllSinQualities, type SinQualityValue } from "./sin-quality"; // SinQuality is imported above
// ProfileData is imported in the script block above

type ScanStatus = "idle" | "scanning" | "success" | "error";

interface Props {
  profileData: ProfileData; // Use the imported ProfileData
  scanStatus: ScanStatus;
  scanResultMessage?: string;
}

// INITIAL_SIN_ID can be defined here if only used by setup logic, or keep INITIAL_SIN_ID_MODULE if it was truly module-scoped
const INITIAL_SIN_ID = "00000000-0000-0000-0000-000000000000";

const props = withDefaults(defineProps<Props>(), {
  profileData: getDefaultProfileData,
  scanStatus: "idle",
  scanResultMessage: "",
});

// Overlay state - will be computed based on props
const isOverlayVisible = ref(true); // Will be managed by new logic
const overlayMessage = ref("Waiting for SIN");

// New watcher for overlay logic
watch(
  [
    () => props.scanStatus,
    () => props.scanResultMessage,
    () => props.profileData.sinId,
  ],
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
      setTimeout(() => {
        isOverlayVisible.value = false;
      }, 2000);
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

const internalProfileData = computed(() => {
  // If the passed sinId is undefined or the initial one, use full default data
  // When props.profileData.sinId is undefined or INITIAL_SIN_ID,
  // it means we are in a "waiting for scan" or "standby" state.
  // In this case, use the IdCard's own default data structure.
  if (!props.profileData.sinId || props.profileData.sinId === INITIAL_SIN_ID) {
    const defaultData = getDefaultProfileData(); // Get the default nested structure
    return {
      ...defaultData, // Spread all default fields
      // Compute flagColors based on the default nationality
      flagColors: getFlagCSS(
        defaultData.Basic.nationality || ShadowrunNationality.UNKNOWN
      ),
    };
  }

  // This is for when a real SIN is scanned and props.profileData contains actual data.
  // It should already be in the new nested format from App.vue.
  return {
    ...props.profileData, // Use the actual data from App.vue (already nested)
    // Compute flagColors based on the actual nationality
    // Ensure Basic object and nationality exist, otherwise default to UNKNOWN
    flagColors: getFlagCSS(
      props.profileData.Basic?.nationality || ShadowrunNationality.UNKNOWN
    ),
  };
});

const idc = computed(() => {
  const myRand = new Rand(internalProfileData.value.sinId);
  return `R-${myRand.next().toString().slice(-9)} - ${myRand
    .next()
    .toString()
    .slice(2, 11)} - ${myRand.next().toString().slice(2, 11)} - 01`;
});

const additionalCode = computed(() => {
  return `<<< ${
    internalProfileData.value.Basic?.nationality || ShadowrunNationality.UNKNOWN
  }/${
    internalProfileData.value.Basic?.metatype || "UNKNOWN"
  } >>> SIN ID VERIFIED`;
});

const barcodeWidths = computed(() => {
  const barcodeRand = new Rand(internalProfileData.value.sinId);
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
  // Note: flagColors is not part of the ProfileData spec, this might be legacy or for future use.
  // For now, we will assume it might be on internalProfileData if set by some other means.
  if ((internalProfileData.value as any).flagColors) {
    return (internalProfileData.value as any).flagColors;
  }

  // Otherwise, look up by nationality from the Basic profile data
  return getFlagCSS(
    internalProfileData.value.Basic?.nationality || ShadowrunNationality.UNKNOWN
  );
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
