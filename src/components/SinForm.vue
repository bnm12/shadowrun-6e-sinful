<template>
  <div class="sin-form-container">
    <form @submit.prevent="submitForm" class="sin-form">
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
      <!-- Basic Information Section -->
      <div class="form-section">
        <h3 class="section-title">Basic Details</h3>
        <div class="form-field">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="formData.basic.name" required />
        </div>

        <div class="form-field">
          <label for="gender">Gender:</label>
          <select id="gender" v-model="formData.basic.gender" required>
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
          <label for="nationality">Nationality:</label>
          <select
            id="nationality"
            v-model="formData.basic.nationality"
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
          <label for="metatype">Metatype:</label>
          <select id="metatype" v-model="formData.basic.metatype" required>
            <option
              v-for="metatype in metatypes"
              :key="metatype"
              :value="metatype"
            >
              {{ metatype }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label for="imageUrl">Image URL (for Basic Photo):</label>
          <input type="url" id="imageUrl" v-model="formData.basic.photo" />
        </div>

        <div v-if="formData.basic.photo" class="image-preview">
          <img :src="formData.basic.photo" alt="Profile Preview" />
        </div>
      </div>

      <!-- Identity Details Section -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_2"
        class="form-section"
      >
        <h3 class="section-title">Identity Details</h3>

        <div class="form-field">
          <label for="address">Address:</label>
          <input
            type="text"
            id="address"
            v-model="formData.identity!.address"
          />
        </div>

        <div class="form-field">
          <label for="city">City:</label>
          <input type="text" id="city" v-model="formData.identity!.city" />
        </div>

        <div class="form-field">
          <label for="country">Country:</label>
          <select id="country" v-model="formData.identity!.country">
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
          <label for="birthdate">Birthdate:</label>
          <input
            type="date"
            id="birthdate"
            v-model="formData.identity!.birthdate"
          />
        </div>
      </div>

      <!-- Physical Details Section -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_3"
        class="form-section"
      >
        <h3 class="section-title">Physical Details</h3>

        <div class="form-field">
          <label for="height">Height (cm):</label>
          <input
            type="number"
            id="height"
            v-model="formData.physical!.height"
          />
        </div>

        <div class="form-field">
          <label for="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            v-model="formData.physical!.weight"
          />
        </div>

        <div class="form-field">
          <label for="skin">Skin color:</label>
          <input type="text" id="skin" v-model="formData.physical!.skin" />
        </div>

        <div class="form-field">
          <label for="hair">Hair color:</label>
          <input type="text" id="hair" v-model="formData.physical!.hair" />
        </div>

        <div class="form-field">
          <label for="eyes">Eye color:</label>
          <input type="text" id="eyes" v-model="formData.physical!.eyes" />
        </div>
      </div>

      <!-- Medical Details Section -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_4"
        class="form-section"
      >
        <h3 class="section-title">Medical Details</h3>

        <div class="form-field">
          <label for="bloodType">Blood Type:</label>
          <select
            id="bloodType"
            v-model="formData.medical!.bloodType"
            required
          >
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

      <!-- Employment Details Section -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_5"
        class="form-section"
      >
        <h3 class="section-title">Employment Details</h3>

        <div class="form-field">
          <label for="profession">Profession:</label>
          <input
            type="text"
            id="profession"
            v-model="formData.employment!.profession"
          />
        </div>

        <div class="form-field">
          <label for="employer">Employer:</label>
          <input
            type="text"
            id="employer"
            v-model="formData.employment!.employer"
          />
        </div>

        <div class="form-field">
          <label for="employerAddress">Employer Address:</label>
          <input
            type="text"
            id="employerAddress"
            v-model="formData.employment!.employerAddress"
          />
        </div>
      </div>

      <!-- Genetic Details Section -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_6"
        class="form-section"
      >
        <h3 class="section-title">Genetic Details</h3>
        <p>Genetic info included</p>
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

        <button type="button" @click="addOrUpdateLicense" class="cyber-button">
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
              <button
                type="button"
                @click="editLicense(licenseName)"
                class="cyber-button cyber-button-small"
              >
                EDIT
              </button>
              <button
                type="button"
                @click="deleteLicense(licenseName)"
                class="cyber-button cyber-button-small cyber-button-danger"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Section -->
      <div class="form-actions">
        <button
          type="button"
          @click="readTag(false)"
          :disabled="currentScanStatus === 'scanning'"
          class="cyber-button"
        >
          <span v-if="currentScanStatus === 'scanning'">SCANNING...</span>
          <span v-else>SCAN CARD</span>
        </button>
        <button
          type="submit"
          :disabled="isWriting"
          class="cyber-button cyber-button-primary"
        >
          <span v-if="isWriting">WAITING FOR TAG...</span>
          <span v-else>WRITE TO TAG</span>
        </button>

        <div
          v-if="writeStatusMessage || currentScanResultMessage"
          :class="[
            'status-message',
            writeStatusMessageType ||
              (currentScanStatus === 'error' ? 'error' : 'success'),
          ]"
        >
          {{ writeStatusMessage || currentScanResultMessage }}
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
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
  writeStatusMessage,
  writeStatusMessageType,
  currentScanStatus,
  currentScanResultMessage,
  scannedProfileData,
  readTag,
  writeTag,
} = useNfc();

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
  basic: {
    name: "",
    gender: Gender.GENDER_MALE,
    nationality: ShadowrunNationality.UCAS,
    metatype: ShadowrunMetatype.HUMAN,
    photo: "",
  },
  identity: {
    address: "",
    city: "",
    country: "",
    birthdate: "",
  },
  physical: {
    height: 0,
    weight: 0,
    skin: "",
    hair: "",
    eyes: "",
    seed: 0,
  },
  medical: {
    bloodType: BloodType.BLOOD_TYPE_A_POSITIVE,
    seed: 0,
  },
  employment: {
    profession: "",
    employer: "",
    employerAddress: "",
    seed: 0,
  },
  genetic: {
    seed: 0,
  },
});

const {
  currentLicenseName,
  currentLicenseQuality,
  editingLicenseKey,
  addOrUpdateLicense,
  editLicense,
  deleteLicense,
} = useLicenseManagement(formData);

const submitForm = () => {
  // Validate the form
  const form = document.querySelector(".sin-form") as HTMLFormElement;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (formData.sinQuality === SinQuality.SIN_QUALITY_LEVEL_3) {
    formData.physical = {
      height: 0,
      weight: 0,
      skin: "N/A",
      hair: "N/A",
      eyes: "N/A",
      seed: Date.now(),
      ...formData.physical,
    };
  }
  if (formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_4) {
    formData.medical = {
      bloodType: BloodType.BLOOD_TYPE_UNSPECIFIED,
      seed: Date.now(),
      ...formData.medical,
    };
  }
  if (formData.sinQuality === SinQuality.SIN_QUALITY_LEVEL_5) {
    formData.employment = {
      profession: "N/A",
      employer: "N/A",
      employerAddress: "N/A",
      seed: Date.now(),
      ...formData.employment,
    };
  }
  if (formData.sinQuality === SinQuality.SIN_QUALITY_LEVEL_6) {
    formData.genetic = {
      seed: Date.now(),
      ...formData.genetic,
    };
  }
  writeTag(formData);
};

defineExpose({
  readTag,
  writeTag,
  formData,
  currentScanStatus,
  isWriting,
  submitForm,
});
</script>

<style scoped>
.sin-form-container {
  min-height: 100vh;
  padding: 20px;
  color: #00ffff;
  position: relative;
  overflow-x: hidden;
}

.sin-form {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.form-section {
  margin-bottom: 30px;
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
  margin-bottom: 20px;
}

.form-field label {
  display: block;
  margin-bottom: 8px;
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
  background: linear-gradient(45deg, #ff00ff, #8000ff);
  color: #ffffff;
  border: 2px solid #ff00ff;
  padding: 12px 24px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 10px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
}

.cyber-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.cyber-button:hover::before {
  left: 100%;
}

.cyber-button:hover {
  background: linear-gradient(45deg, #ff3399, #9933ff);
  box-shadow:
    0 0 20px rgba(255, 0, 255, 0.5),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.cyber-button:active {
  transform: translateY(0);
}

.cyber-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.cyber-button-primary {
  font-size: 1.2rem;
  padding: 16px 32px;
  background: linear-gradient(45deg, #00ffff, #0099cc);
  border-color: #00ffff;
  color: #1a1a2e;
}

.cyber-button-primary:hover {
  background: linear-gradient(45deg, #33ffff, #00ccff);
  box-shadow:
    0 0 20px rgba(0, 255, 255, 0.5),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.cyber-button-small {
  padding: 8px 16px;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.cyber-button-danger {
  background: linear-gradient(45deg, #ff0066, #cc0033);
  border-color: #ff0066;
}

.cyber-button-danger:hover {
  background: linear-gradient(45deg, #ff3388, #ff0044);
  box-shadow:
    0 0 20px rgba(255, 0, 102, 0.5),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.licenses-display {
  margin-top: 20px;
}

.license-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
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
  align-items: center;
  gap: 10px;
}

.license-name {
  font-weight: 700;
  color: #00ffff;
}

.license-quality {
  color: #ff00ff;
  font-size: 0.9rem;
}

.license-actions {
  display: flex;
  gap: 5px;
}

.form-actions {
  text-align: center;
  margin-top: 40px;
}

.status-message {
  margin-top: 20px;
  padding: 15px;
  border: 2px solid;
  background: rgba(26, 26, 46, 0.9);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-message.success {
  border-color: #00ff00;
  color: #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.status-message.error {
  border-color: #ff0000;
  color: #ff0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .form-title {
    font-size: 2rem;
  }

  .sin-form {
    max-width: 100%;
  }

  .license-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .license-actions {
    justify-content: center;
  }
}
</style>
