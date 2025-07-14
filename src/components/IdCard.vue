<template>
  <div class="id-card">
    <MessageOverlay
      :visible="isOverlayVisible"
      :message="overlayMessage"
      :result-type="overlayResultType"
    />
    <div class="card-header">
      <div class="header-tabs">
        <div class="quality-tabs">
          <template
            v-for="[quality, qualityTabName] in Object.entries(
              SinQualityTitleMap
            )"
            :key="`quality-tab-${quality}`"
          >
            <div
              v-if="internalProfileData.sinQuality >= quality"
              :class="[
                'tab',
                'quality-tab-item',
                { active: activeTab === quality },
              ]"
              @click="selectTab(quality as SinQuality)"
            >
              {{ qualityTabName }}
            </div>
          </template>
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
        <div
          v-if="
            internalProfileData.licenses &&
            Object.keys(internalProfileData.licenses).length > 0
          "
          class="licenses-list-display"
        >
          <div
            class="license-item"
            v-for="[name, quality] in Object.entries(
              internalProfileData.licenses
            )"
            :key="name"
          >
            <div class="license-details">
              <span class="license-name">{{ name }}</span>
              <span class="license-quality">{{
                SinQualityFlairMap[
                  quality ?? SinQuality.SIN_QUALITY_UNSPECIFIED
                ]
              }}</span>
            </div>
            <div
              class="glitch-text license-check-button"
              data-text="✔️"
              @click="
                performLicenseCheck(
                  quality ?? SinQuality.SIN_QUALITY_UNSPECIFIED
                )
              "
            >
              ✔️
            </div>
          </div>
        </div>
        <p v-else class="no-licenses-message">No licenses on record.</p>
      </div>

      <!-- Basic Info (Original Content) -->
      <template v-if="activeTab === SinQuality.SIN_QUALITY_LEVEL_1">
        <div class="left-section tab-content-section">
          <div class="photo-section">
            <div class="photo-container">
              <img
                :src="
                  internalProfileData.basic.photo ??
                  '/blank-profile-picture.svg'
                "
                :alt="internalProfileData.basic.name"
                class="profile-photo"
              />
            </div>
          </div>
        </div>

        <div class="right-section tab-content-section">
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
                {{ internalProfileData.basic.nationality }}
              </div>
            </div>
          </div>

          <div class="info-section">
            <span class="name">{{ internalProfileData.basic.name }}</span>
            <div class="details">
              <div class="left-content">
                <div class="detail-row">
                  <span class="label">Nationality</span>
                  <span class="label-colon">:</span>
                  <span class="value">{{
                    internalProfileData.basic.nationality
                  }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Gender</span>
                  <span class="label-colon">:</span>
                  <span class="value">{{
                    GenderDisplayMap[internalProfileData.basic.gender]
                  }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Metatype</span>
                  <span class="label-colon">:</span>
                  <span class="value">{{
                    internalProfileData.basic.metatype
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Identity Info (SIN Quality 2) -->
      <div
        v-if="activeTab === SinQuality.SIN_QUALITY_LEVEL_2"
        class="tab-content-section"
      >
        <h4>Identity Information</h4>
        <div class="details">
          <div class="left-content">
            <div class="detail-row">
              <span class="label">Address</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.identity?.address || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">City</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.identity?.city || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Country</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.identity?.country || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Birthdate</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.identity?.birthdate || "N/A"
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Physical Info (SIN Quality 3) -->
      <div
        v-if="activeTab === SinQuality.SIN_QUALITY_LEVEL_3"
        class="tab-content-section"
      >
        <h4>Physical Characteristics</h4>
        <div class="details">
          <div class="left-content">
            <div class="detail-row">
              <span class="label">Height (cm)</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.physical?.height || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Weight (kg)</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.physical?.weight || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Skin color</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.physical?.skin || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Hair color</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.physical?.hair || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Eye color</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.physical?.eyes || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Fingerprints</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.physical?.seed || "N/A"
              }}</span>
            </div>
          </div>
          <div class="right-content">
            <span>Iris Scan</span>
            <IrisDisplay
              :seed="
                internalProfileData.sinId + internalProfileData.physical?.seed
              "
            />
          </div>
        </div>
      </div>

      <!-- Medical Info (SIN Quality 4) -->
      <div
        v-if="activeTab === SinQuality.SIN_QUALITY_LEVEL_4"
        class="tab-content-section"
      >
        <h4>Medical Records</h4>
        <div class="details">
          <div class="left-content">
            <div class="detail-row">
              <span class="label">Blood Type</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                BloodTypeDisplayMap[
                  internalProfileData.medical?.bloodType ??
                    BloodType.BLOOD_TYPE_UNSPECIFIED
                ]
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Medical Record</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.medical?.seed ?? "N/A"
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Employment Info (SIN Quality 5) -->
      <div
        v-if="activeTab === SinQuality.SIN_QUALITY_LEVEL_5"
        class="tab-content-section"
      >
        <h4>Employment History</h4>
        <div class="details">
          <div class="left-content">
            <div class="detail-row">
              <span class="label">Profession</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.employment?.profession || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Employer</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.employment?.employer || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Employer Address</span>
              <span class="label-colon">:</span>
              <span class="value">{{
                internalProfileData.employment?.employerAddress || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Verified Data Links</span>
              <span class="label-colon">:</span>
              <div class="value">
                <div>Civil: "N/A"</div>
                <div>Bank: "N/A"</div>
                <div>Personal: "N/A"</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Genetic Info (SIN Quality 6) -->
      <div
        v-if="activeTab === SinQuality.SIN_QUALITY_LEVEL_6"
        class="tab-content-section"
      >
        <h4>Genetic Markers</h4>
        <DnaFingerprint
          :seed="internalProfileData.sinId + internalProfileData.genetic?.seed"
          :lanes="12"
          :animated="true"
        />
      </div>
    </div>
    <div class="system-info">
      <div class="system-codes">
        <div class="code-line">IDC : {{ idc }}</div>
        <div class="system-title">
          {{ internalProfileData.active ? "## ACTIVE ##" : "## BURNED ##" }}
        </div>
        <div class="code-line">{{ additionalCode }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import MessageOverlay from "./MessageOverlay.vue";
import DnaFingerprint from "./DnaFingerprint.vue";
import IrisDisplay from "./IrisDisplay.vue";
import { useIdCardSystemInfo } from "../composables/useIdCardSystemInfo";
import { useIdCardBarcode } from "../composables/useIdCardBarcode";
import { ShadowrunNationality, getFlagCSS } from "./shadowrun-flags";
import { BloodType, SinQuality } from "../proto/profile.pb";
import {
  BloodTypeDisplayMap,
  getDefaultProfileData,
  GenderDisplayMap,
} from "../utils/profile";
import { SinQualityFlairMap, SinQualityTitleMap } from "../utils/sin-quality";
import { checkSin } from "../utils/sin-check-helpers";
import { sinScanResultTextMap } from "../utils/sin-scan-result";
import { licenseScanResultTextMap } from "../utils/license-scan-result";
import { useNfc } from "../composables/useNfc";
import type { sincheckresult } from "../utils/sin-check-helpers";

interface IdCardProps {
  scanLevel: SinQuality;
  validateOnScan: boolean;
}

const props = defineProps<IdCardProps>();
const emit = defineEmits([
  "update:scanLevel",
  "update:validateOnScan",
  "check-sin",
]);

const {
  isReading,
  currentScanResultMessage,
  readStatusMessageType,
  scannedProfileData,
  readTag,
  abortScan,
} = useNfc();

onMounted(() => {
  readTag(true); // Start scanning when component is mounted
});

onBeforeUnmount(() => {
  abortScan(); // Stop scanning when component is unmounted
});

// INITIAL_SIN_ID can be defined here if only used by setup logic, or keep INITIAL_SIN_ID_MODULE if it was truly module-scoped
const INITIAL_SIN_ID = "00000000-0000-0000-0000-000000000000";

// Overlay state - will be computed based on props
const isOverlayVisible = ref(true); // Will be managed by new logic
const overlayMessage = ref("Waiting for SIN");
const overlayResultType = ref<sincheckresult | undefined>(undefined);

let overlayTimeout: NodeJS.Timeout;

watch(
  [isReading, currentScanResultMessage, scannedProfileData],
  ([reading, newMessage, newProfileData]) => {
    clearTimeout(overlayTimeout);
    const newSinId = newProfileData?.sinId;

    overlayResultType.value = undefined;

    if (reading) {
      overlayMessage.value = newMessage || "Scanning...";
      isOverlayVisible.value = true;
    } else if (readStatusMessageType.value === "error") {
      overlayMessage.value = newMessage || "Error during scan.";
      overlayResultType.value = "burned";
      isOverlayVisible.value = true;
    } else if (readStatusMessageType.value === "success" && newSinId) {
      if (props.validateOnScan) {
        performSinCheck(internalProfileData.value.sinQuality);
      } else {
        clearTimeout(overlayTimeout);
        overlayMessage.value = "SIN Scanned successfully";
        overlayResultType.value = "success";
        isOverlayVisible.value = true;
        overlayTimeout = setTimeout(() => {
          isOverlayVisible.value = false;
        }, 2000);
      }
    } else if (!isReading) {
      if (!newSinId || newSinId === INITIAL_SIN_ID) {
        overlayMessage.value = "Waiting for SIN";
        isOverlayVisible.value = true;
      } else {
        isOverlayVisible.value = false;
      }
    }
  },
  { immediate: true, deep: true }
);

const internalProfileData = computed(() => {
  if (
    !scannedProfileData.value?.sinId ||
    scannedProfileData.value.sinId === INITIAL_SIN_ID
  ) {
    const defaultData = getDefaultProfileData();
    return {
      ...defaultData,
      flagColors: getFlagCSS(
        defaultData.basic.nationality || ShadowrunNationality.UNKNOWN
      ),
    };
  }

  return {
    ...scannedProfileData.value,
    flagColors: getFlagCSS(
      scannedProfileData.value.basic?.nationality ||
        ShadowrunNationality.UNKNOWN
    ),
  };
});

const { idc, additionalCode } = useIdCardSystemInfo(internalProfileData);
const { barcodeWidths } = useIdCardBarcode(internalProfileData);

const activeTab = ref<SinQuality | "licenses">(SinQuality.SIN_QUALITY_LEVEL_1);

const selectTab = (tabIdentifier: SinQuality | "licenses") => {
  activeTab.value = tabIdentifier;
};

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
    internalProfileData.value.basic?.nationality || ShadowrunNationality.UNKNOWN
  );
};

const performSinCheck = (quality: SinQuality) => {
  const result = checkSin(
    SinQuality._toInt(quality),
    SinQuality._toInt(props.scanLevel)
  );
  clearTimeout(overlayTimeout);
  overlayMessage.value = sinScanResultTextMap[result];
  overlayResultType.value = result;
  isOverlayVisible.value = true;
  overlayTimeout = setTimeout(() => {
    isOverlayVisible.value = false;
  }, 2000);
};

const validateLicense = (quality: SinQuality) => {
  const result = checkSin(
    SinQuality._toInt(quality),
    SinQuality._toInt(props.scanLevel)
  );
  clearTimeout(overlayTimeout);
  overlayMessage.value = licenseScanResultTextMap[result];
  overlayResultType.value = result;
  isOverlayVisible.value = true;
  overlayTimeout = setTimeout(() => {
    isOverlayVisible.value = false;
  }, 2000);
};

const performLicenseCheck = (quality: SinQuality) => {
  validateLicense(quality);
};

defineExpose({
  performSinCheck: () => performSinCheck(internalProfileData.value.sinQuality),
});
</script>

<style scoped>
.sin-check-controls {
  display: flex;
  gap: 10px;
  padding: 0 5px;
  justify-content: center;
  align-items: center;
}

.validate-on-scan-control {
  display: flex;
  align-items: center;
  gap: 5px;
}

.scan-level-dropdown,
.scan-button {
  background-color: #00ffff;
  color: #1a2332;
  border: 1px solid #00ffff;
  padding: 5px 5px;
  cursor: pointer;
}

.scan-button:disabled {
  background-color: #555;
  cursor: not-allowed;
}
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
    height: calc(100svw - 10px * 2);
    max-width: calc(95svh - 5svh - 10px * 2);
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
  transition:
    background-color 0.3s,
    border-color 0.3s;
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
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%; /* Each section takes full width */
  padding: 5px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 4px;
  background-color: rgba(0, 255, 255, 0.03);
  color: #00ffff; /* Default text color for content sections */
}

.tab-content-section h4 {
  margin: 0;
  font-size: 1.3em;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

/* Specific styling for when left and right sections are visible for Basic Info */
.card-content > .left-section.tab-content-section {
  width: 30%; /* Restore original width */
}
.card-content > .right-section.tab-content-section {
  width: 66%; /* Restore original width */
}

.licenses-list-display {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  font-size: clamp(0.7em, 2svh, 1em);
}

.licenses-list-display .license-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: rgba(0, 255, 255, 0.05);
  border-left: 3px solid #4a9eff;
}

.license-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 5px;
}

.license-name {
  font-weight: bold;
}

.license-quality {
  font-style: italic;
  font-size: 0.6em;
}

.license-check-button {
}

.no-licenses-message {
  font-style: italic;
  color: #88ddff;
  font-size: clamp(0.7em, 2svh, 1em);
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
  gap: 5%;
  flex-grow: 1;
}

.name {
  font-size: clamp(1em, 4svh, 2em); /* Responsive font size */
  font-weight: bold;
  color: #00ffff;
  text-align: left;
  line-height: 1.1;
}

.details {
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: space-between;
  height: 100%;
}

.left-content {
  display: grid;
  grid-template-columns: max-content max-content 1fr;
  gap: 5px;
  align-items: center;
  align-content: center;
  align-self: flex-start;
}

.right-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.right-content {
  align-items: center;
  justify-content: center;
}

.detail-row {
  display: contents; /* This makes the detail-row a direct child of the grid */
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
  text-align: left;
}

.system-info {
  background: rgba(0, 255, 255, 0.1);
  padding: 5px 10px; /* Relative padding */
  border-top: 1px solid #4a9eff;
  font-size: clamp(0.5em, 1.8svh, 0.8em); /* Responsive font size */
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.system-codes {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.3svh;
}

.system-title {
  color: #00ffff;
  font-weight: bold;
}

.code-line {
  color: #4a9eff;
  font-size: clamp(0.4em, 1.5svh, 0.7em); /* Responsive font size */
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
  height: 4px; /* Thickness of the scan line */
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 20, 147, 0.3) 20%,
    rgba(255, 20, 147, 0.5) 45%,
    rgba(255, 20, 147, 0.5) 55%,
    rgba(255, 20, 147, 0.3) 80%,
    transparent 100%
  );
  animation: scan 8s linear infinite;
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
