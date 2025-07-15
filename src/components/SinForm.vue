<template>
  <div class="sin-form-container">
    <form @submit.prevent="submitForm" class="sin-form">
      <div class="form-section">
        <div class="form-field">
          <label for="sinQuality">SIN Quality:</label>
          <select id="sinQuality" v-model="formData.sinQuality" required>
            <option
              v-for="[qualityName, qualityFlair] in Object.entries(
                SinQualityFlairMap
              )"
              :key="qualityName"
              :value="qualityName"
            >
              {{ qualityFlair }}
            </option>
          </select>
        </div>
      </div>
      <!-- Level 1: Basic Identity -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_1"
        class="form-section"
      >
        <h3 class="section-title">Level 1: Basic Identity</h3>
        <div class="form-field">
          <label for="photo">Photo URL:</label>
          <input
            type="text"
            id="photo"
            v-model="formData.level1!.photo"
            required
          />
        </div>
        <div v-if="formData.level1!.photo" class="image-preview">
          <img :src="formData.level1!.photo" alt="Profile Preview" />
        </div>
      </div>

      <!-- Level 2: Core Identity -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_2"
        class="form-section"
      >
        <h3 class="section-title">Level 2: Core Identity</h3>
        <div class="form-field">
          <label for="name">Name:</label>
          <input
            type="text"
            id="name"
            v-model="formData.level2!.name"
            required
          />
        </div>
        <div class="form-field">
          <label for="birthdate">Birthdate:</label>
          <input
            type="date"
            id="birthdate"
            v-model="formData.level2!.birthdate"
            required
          />
        </div>
        <div class="form-field">
          <label for="birthplace">Birthplace:</label>
          <input
            type="text"
            id="birthplace"
            v-model="formData.level2!.birthplace"
            required
          />
        </div>
        <div class="form-field">
          <label for="gender">Gender:</label>
          <select id="gender" v-model="formData.level2!.gender" required>
            <option
              v-for="[key, value] in Object.entries(GenderDisplayMap)"
              :key="key"
              :value="key"
            >
              {{ value }}
            </option>
          </select>
        </div>
        <div class="form-field">
          <label for="metatype">Metatype:</label>
          <select id="metatype" v-model="formData.level2!.metatype" required>
            <option
              v-for="metatype in metatypes"
              :key="metatype"
              :value="metatype"
            >
              {{ metatype }}
            </option>
          </select>
        </div>
      </div>

      <!-- Level 3: Printed Information -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_3"
        class="form-section"
      >
        <h3 class="section-title">Level 3: Printed Information</h3>
        <div class="form-field">
          <label for="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            v-model="formData.level3!.fullName"
          />
        </div>
        <div class="form-field">
          <label for="address">Address:</label>
          <input type="text" id="address" v-model="formData.level3!.address" />
        </div>
        <div class="form-field">
          <label for="city">City:</label>
          <input type="text" id="city" v-model="formData.level3!.city" />
        </div>
        <div class="form-field">
          <label for="country">Country:</label>
          <input type="text" id="country" v-model="formData.level3!.country" />
        </div>
        <div class="form-field">
          <label for="nationality">Nationality:</label>
          <select
            id="nationality"
            v-model="formData.level3!.nationality"
            required
          >
            <option
              v-for="nationality in nationalities"
              :key="nationality"
              :value="nationality"
            >
              {{ nationality }}
            </option>
          </select>
        </div>
        <div class="form-field">
          <label for="occupation">Occupation:</label>
          <input
            type="text"
            id="occupation"
            v-model="formData.level3!.occupation"
          />
        </div>
      </div>

      <!-- Level 4: Physical Biometrics -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_4"
        class="form-section"
      >
        <h3 class="section-title">Level 4: Physical Biometrics</h3>
        <div class="form-field">
          <label for="height">Height (cm):</label>
          <input
            type="number"
            id="height"
            v-model="formData.level4!.height"
          />
        </div>
        <div class="form-field">
          <label for="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            v-model="formData.level4!.weight"
          />
        </div>
        <div class="form-field">
          <label for="eyeColor">Eye Color:</label>
          <input
            type="text"
            id="eyeColor"
            v-model="formData.level4!.eyeColor"
          />
        </div>
        <div class="form-field">
          <label for="hairColor">Hair Color:</label>
          <input
            type="text"
            id="hairColor"
            v-model="formData.level4!.hairColor"
          />
        </div>
        <div class="form-field">
          <label for="skinTone">Skin Tone:</label>
          <input
            type="text"
            id="skinTone"
            v-model="formData.level4!.skinTone"
          />
        </div>
      </div>

      <!-- Level 5: Deep Background -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_5"
        class="form-section"
      >
        <h3 class="section-title">Level 5: Deep Background</h3>
        <div class="form-field">
          <label for="employer">Employer:</label>
          <input
            type="text"
            id="employer"
            v-model="formData.level5!.employer"
          />
        </div>
        <div class="form-field">
          <label for="employerAddress">Employer Address:</label>
          <input
            type="text"
            id="employerAddress"
            v-model="formData.level5!.employerAddress"
          />
        </div>
      </div>

      <!-- Level 6: Genetic Markers -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_6"
        class="form-section"
      >
        <h3 class="section-title">Level 6: Genetic Markers</h3>
        <div class="form-field">
          <label for="bloodType">Blood Type:</label>
          <select id="bloodType" v-model="formData.level6!.bloodType" required>
            <option
              v-for="[key, value] in Object.entries(BloodTypeDisplayMap)"
              :key="key"
              :value="key"
            >
              {{ value }}
            </option>
          </select>
        </div>
      </div>

      <!-- Licenses Section -->
      <div class="form-section">
        <h3 class="section-title">Manage Licenses</h3>

        <div class="form-field">
          <label for="licenseName">License Name:</label>
          <input type="text" id="licenseName" v-model="currentLicenseName" />
        </div>

        <div class="form-field">
          <label for="licenseQuality">License Quality:</label>
          <select id="licenseQuality" v-model="currentLicenseQuality">
            <option
              v-for="[key, value] in Object.entries(SinQualityFlairMap)"
              :key="key"
              :value="key"
            >
              {{ value }}
            </option>
          </select>
        </div>

        <div v-if="licenseQualityError" class="error-message">
          {{ licenseQualityError }}
        </div>
        <button
          type="button"
          @click="addOrUpdateLicense"
          class="cyber-button"
          :disabled="isLicenseQualityInvalid"
        >
          {{ editingLicenseKey ? "UPDATE LICENSE" : "ADD LICENSE" }}
        </button>

        <div
          v-if="Object.keys(formData.licenses).length > 0"
          class="licenses-display"
        >
          <div
            v-for="([licenseName, qualityValue], index) in Object.entries(
              formData.licenses
            )"
            :key="index"
            class="license-item"
          >
            <div class="license-info">
              <span class="license-name">{{ licenseName }}</span>
              <span class="license-quality">
                ({{
                  SinQualityFlairMap[
                    qualityValue ?? SinQuality.SIN_QUALITY_UNSPECIFIED
                  ]
                }})
              </span>
            </div>
            <div class="license-actions">
              <div
                @click="editLicense(licenseName)"
                class="glitch-text license-action"
                data-text="✏️"
              >
                ✏️
              </div>
              <div
                @click="deleteLicense(licenseName)"
                class="glitch-text license-action"
                data-text="❌"
              >
                ❌
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <MessageOverlay
      :message="overlayMessage"
      :visible="isOverlayVisible"
      :result-type="overlayStatus"
      title="NFC Status"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from "vue";
import MessageOverlay from "./MessageOverlay.vue";
import { ShadowrunNationality, getAllNationalities } from "./shadowrun-flags";
import { ShadowrunMetatype, getAllMetatypes } from "./shadowrun-metatypes";
import {
  BloodType,
  Gender,
  SinQuality,
  type ProfileData,
} from "../proto/profile.pb";
import { v4 as uuidv4 } from "uuid";
import { useLicenseManagement } from "../composables/useLicenseManagement";
import { SinQualityFlairMap } from "../utils/sin-quality";
import { BloodTypeDisplayMap, GenderDisplayMap } from "../utils/profile";
import { useNfc } from "../composables/useNfc";

const {
  isWriting,
  isReading,
  writeStatusMessage,
  writeStatusMessageType,
  currentScanResultMessage,
  readStatusMessageType,
  scannedProfileData,
  readTag,
  writeTag,
} = useNfc();

const isOverlayVisible = ref(false);
const overlayMessage = ref("");
const overlayStatus = ref<"reading" | "writing" | "success" | "error" | "">("");

let overlayTimeout: ReturnType<typeof setTimeout> | undefined;

watch(
  [isReading, isWriting, writeStatusMessage, currentScanResultMessage],
  ([reading, writing, writeMsg, scanMsg]) => {
    clearTimeout(overlayTimeout);
    if (reading) {
      isOverlayVisible.value = true;
      overlayMessage.value = "Waiting for read...";
      overlayStatus.value = "reading";
    } else if (writing) {
      isOverlayVisible.value = true;
      overlayMessage.value = "Waiting for write...";
      overlayStatus.value = "writing";
    } else if (writeMsg || scanMsg) {
      isOverlayVisible.value = true;
      overlayMessage.value = writeMsg || scanMsg || "";
      overlayStatus.value =
        writeStatusMessageType.value === "error" ||
        readStatusMessageType.value === "error"
          ? "error"
          : "success";
      overlayTimeout = setTimeout(() => {
        isOverlayVisible.value = false;
      }, 2000);
    } else {
      isOverlayVisible.value = false;
    }
  },
  { immediate: true }
);

watch(
  scannedProfileData,
  (newData) => {
    if (newData && newData.sinId) {
      // Logic to merge newData into formData without losing reactivity
      Object.assign(formData, newData);
    }
  },
  { deep: true }
);

const nationalities = getAllNationalities();
const metatypes = getAllMetatypes();

const formData = reactive<ProfileData>({
  sinId: uuidv4(),
  active: true,
  sinQuality: SinQuality.SIN_QUALITY_LEVEL_3,
  licenses: {},
  level1: {
    photo: "",
  },
  level2: {
    name: "",
    birthdate: "",
    birthplace: "",
    gender: Gender.GENDER_MALE,
    metatype: ShadowrunMetatype.HUMAN,
  },
  level3: {
    fullName: "",
    address: "",
    city: "",
    country: "",
    nationality: ShadowrunNationality.UCAS,
    occupation: "",
    datalinks: [],
  },
  level4: {
    fingerprintHash: "",
    retinalHash: "",
    voiceHash: "",
    height: 0,
    weight: 0,
    eyeColor: "",
    hairColor: "",
    skinTone: "",
  },
  level5: {
    employer: "",
    employerAddress: "",
    travelStamps: [],
    affiliationCodes: [],
    educationRecords: [],
    residenceHistory: [],
  },
  level6: {
    bloodType: BloodType.BLOOD_TYPE_A_POSITIVE,
    dnaSequenceHash: "",
    geneticMarkers: [],
    medicalAlertCodes: "",
  },
  baseSeed: 0,
  biometricSeed: 0,
  backgroundSeed: 0,
});

const {
  currentLicenseName,
  currentLicenseQuality,
  editingLicenseKey,
  addOrUpdateLicense,
  editLicense,
  deleteLicense,
  licenseQualityError,
  isLicenseQualityInvalid,
} = useLicenseManagement(formData);

const submitForm = () => {
  // Validate the form
  const form = document.querySelector(".sin-form") as HTMLFormElement;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  formData.baseSeed = Date.now();
  formData.biometricSeed = Date.now() + 1;
  formData.backgroundSeed = Date.now() + 2;
  writeTag(formData);
};

defineExpose({
  readTag,
  writeTag,
  formData,
  isWriting,
  isReading,
  submitForm,
});
</script>

<style scoped>
.sin-form-container {
  max-height: 100svh;
  color: #00ffff;
  position: relative;
  height: 100%;
}

.sin-form {
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 1.5rem;
  color: #00ffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ffff;
}

.section-title::after,
.section-title::before {
  content: "";
  display: block;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  margin: 10px 0;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-field label {
  display: block;
  color: #00ffff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  text-align: left;
}

.form-field input,
.form-field select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #00ffff;
  border-radius: 0;
  background: rgba(26, 26, 46, 0.8);
  color: #00ffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-field input:focus,
.form-field select:focus {
  outline: none;
  border-color: #ff00ff;
  box-shadow:
    0 0 0 2px rgba(255, 0, 255, 0.3),
    inset 0 0 10px rgba(255, 0, 255, 0.1);
  background: rgba(26, 26, 46, 0.9);
}

.form-field input::placeholder {
  color: rgba(0, 255, 255, 0.5);
}

.image-preview {
  margin-top: 15px;
  text-align: center;
  border: 2px dashed #00ffff;
  padding: 20px;
  background: rgba(26, 26, 46, 0.5);
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border: 2px solid #00ffff;
  filter: drop-shadow(0 0 10px #00ffff);
}

.cyber-button {
  color: #00ffff;
  border: 2px solid #ff00ff;
}

.licenses-display {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.license-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 5px;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid #00ffff;
  border-left: 4px solid #ff00ff;
  transition: all 0.3s ease;
}

.license-item:hover {
  background: rgba(26, 26, 46, 0.9);
  border-color: #ff00ff;
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
}

.license-info {
  display: flex;
  flex-direction: column;
}

.license-name {
  font-weight: 700;
  color: #00ffff;
  text-align: left;
}

.license-quality {
  color: #ff00ff;
  font-size: 0.7rem;
  text-align: left;
}

.license-actions {
}

.license-action {
  aspect-ratio: 1/1;
  display: inline-block;
}

.error-message {
  color: #ff00ff;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background: rgba(255, 0, 255, 0.1);
  border: 1px solid #ff00ff;
}
</style>
