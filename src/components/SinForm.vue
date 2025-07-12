<template>
  <div class="sin-form-container">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="formData.basic.name" required />
      </div>

      <div class="form-group">
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

      <div class="form-group">
        <label for="nationality">Nationality:</label>
        <select id="nationality" v-model="formData.basic.nationality" required>
          <option
            v-for="nationality in nationalities"
            :key="nationality"
            :value="nationality"
          >
            {{ nationality }}
          </option>
        </select>
      </div>

      <div class="form-group">
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

      <div class="form-group">
        <label for="sinQuality">SIN Quality:</label>
        <select id="sinQuality" v-model="formData.sinQuality" required>
          <!-- sinQuality is top-level -->
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

      <div class="form-group">
        <label for="imageUrl">Image URL (for Basic Photo):</label>
        <input type="url" id="imageUrl" v-model="formData.basic.photo" />
      </div>

      <div v-if="formData.basic.photo" class="image-preview">
        <img :src="formData.basic.photo" alt="Image Preview" />
      </div>

      <!-- Identity Details Section -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_2"
        class="identity-details-section"
      >
        <h3>Identity Details</h3>
        <div class="form-group">
          <label for="address">Address:</label>
          <input
            type="text"
            id="address"
            v-model="formData.identity!.address"
          />
        </div>
        <div class="form-group">
          <label for="city">City:</label>
          <input type="text" id="city" v-model="formData.identity!.city" />
        </div>
        <div class="form-group">
          <label for="country">Country:</label>
          <select
            id="nationality"
            v-model="formData.identity!.country"
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
        <div class="form-group">
          <label for="birthdate">Birthdate:</label>
          <input
            type="date"
            id="birthdate"
            v-model="formData.identity!.birthdate"
          />
        </div>
      </div>
      <!-- End Identity Details Section -->

      <!-- Physical Details Section -->
      <div
        v-if="formData.sinQuality >= SinQuality.SIN_QUALITY_LEVEL_3"
        class="physical-details-section"
      >
        <h3>Physical Details</h3>
        <div class="form-group">
          <label for="height">Height (cm):</label>
          <input
            type="number"
            id="height"
            v-model="formData.physical!.height"
          />
        </div>
        <div class="form-group">
          <label for="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            v-model="formData.physical!.weight"
          />
        </div>
        <div class="form-group">
          <label for="skin">Skin color:</label>
          <input type="text" id="skin" v-model="formData.physical!.skin" />
        </div>
        <div class="form-group">
          <label for="hair">Hair color:</label>
          <input type="text" id="hair" v-model="formData.physical!.hair" />
        </div>
        <div class="form-group">
          <label for="eyes">Eye color:</label>
          <input type="text" id="eyes" v-model="formData.physical!.eyes" />
        </div>
      </div>
      <!-- End Physical Details Section -->

      <!-- Licenses Section -->
      <div class="licenses-section">
        <h3>Manage Licenses</h3>
        <div class="form-group">
          <label for="licenseName">License Name:</label>
          <input type="text" id="licenseName" v-model="currentLicenseName" />
        </div>
        <div class="form-group">
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
        <button type="button" @click="addOrUpdateLicense" class="action-button">
          {{ editingLicenseKey ? "Update License" : "Add License" }}
        </button>

        <div
          v-if="Object.keys(formData.licenses).length > 0"
          class="licenses-list"
        >
          <h4>Current Licenses:</h4>
          <ul>
            <li
              v-for="([licenseName, qualityValue], index) in Object.entries(
                formData.licenses
              )"
              :key="index"
            >
              {{ licenseName }} ({{
                SinQualityFlairMap[
                  qualityValue ?? SinQuality.SIN_QUALITY_UNSPECIFIED
                ]
              }})
              <button
                type="button"
                @click="editLicense(licenseName)"
                class="edit-button small-button"
              >
                Edit
              </button>
              <button
                type="button"
                @click="deleteLicense(licenseName)"
                class="delete-button small-button"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
      <!-- End Licenses Section -->

      <div class="form-submission-area">
        <button type="submit" :disabled="props.isWriting">
          <span v-if="props.isWriting">Waiting for tag...</span>
          <span v-else>Write to Tag</span>
        </button>
        <p
          v-if="props.writeStatusMessage"
          :class="['status-message', props.writeStatusMessageType]"
        >
          {{ props.writeStatusMessage }}
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"; // Import computed
import { ShadowrunNationality, getAllNationalities } from "./shadowrun-flags";
import { ShadowrunMetatype, getAllMetatypes } from "./shadowrun-metatypes";
import { Gender, SinQuality, type ProfileData } from "../proto/profile.pb"; // Import ProfileData, ProfileBasic is unused, Import GenderJSON
import { v4 as uuidv4 } from "uuid";
import { useLicenseManagement } from "../composables/useLicenseManagement";
import { SinQualityFlairMap } from "../utils/sin-quality";
import { GenderDisplayMap } from "../utils/profile";

// Props received from App.vue
const props = defineProps<{
  isWriting: boolean;
  writeStatusMessage: string;
  writeStatusMessageType: "success" | "error" | "";
}>();

const nationalities = getAllNationalities();
const metatypes = getAllMetatypes();

// Initialize formData with the full ProfileData structure
const formData = reactive<ProfileData>({
  sinId: uuidv4(), // Will be set in App.vue before writing
  active: true,
  sinQuality: SinQuality.SIN_QUALITY_LEVEL_3, // Default SIN quality for new SINs
  licenses: {}, // Initialize licenses as an empty object
  basic: {
    name: "",
    gender: Gender.GENDER_MALE,
    nationality: ShadowrunNationality.UCAS, // Default nationality
    metatype: ShadowrunMetatype.HUMAN, // Default metatype
    photo: "", // imageUrl maps to photo
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
    bloodType: "",
    eyeScan: "",
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

const emit = defineEmits(["submitSinData"]);

const submitForm = () => {
  // Basic validation can be added here if needed
  if (formData.sinQuality === SinQuality.SIN_QUALITY_LEVEL_1) {
  }
  if (formData.sinQuality === SinQuality.SIN_QUALITY_LEVEL_2) {
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
  if (formData.sinQuality === SinQuality.SIN_QUALITY_LEVEL_4) {
    formData.medical = {
      bloodType: "N/A",
      eyeScan: "N/A",
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
  emit("submitSinData", formData);
};
</script>

<style scoped>
.sin-form-container {
  padding: 20px;
  color: #00ffff;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #4a9eff;
  justify-self: flex-start;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group input[type="number"],
.form-group input[type="url"],
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #00ffff;
  border-radius: 4px;
  background-color: #2a3847;
  color: #00ffff;
  box-sizing: border-box;
}

.image-preview {
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #00ffff;
  border-radius: 4px;
}

button[type="submit"] {
  padding: 10px 15px;
  background-color: #4a9eff;
  color: #1a2332;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button[type="submit"]:hover {
  background-color: #6ab7ff;
}

.licenses-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #4a9eff;
}

.licenses-section h3,
.identity-details-section h3,
.physical-details-section h3 {
  color: #4a9eff;
  margin-bottom: 10px;
}

.identity-details-section,
.physical-details-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #4a9eff;
}

.licenses-section h4 {
  color: #00ffff;
  margin-top: 15px;
  margin-bottom: 5px;
}

.licenses-list ul {
  list-style-type: none;
  padding: 0;
}

.licenses-list li {
  background-color: #2a3847;
  padding: 8px;
  border: 1px solid #00ffff;
  border-radius: 4px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-button,
.edit-button,
.delete-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 5px; /* For spacing between buttons */
}

.action-button {
  background-color: #00bfff; /* DeepSkyBlue */
  color: #1a2332;
  margin-bottom: 10px; /* Space below add/update button */
}
.action-button:hover {
  background-color: #1edcff;
}

.small-button {
  padding: 5px 8px;
  font-size: 0.9em;
}

.edit-button {
  background-color: #ffae42; /* Orange */
  color: #1a2332;
}
.edit-button:hover {
  background-color: #ffc069;
}

.delete-button {
  background-color: #ff4242; /* Red */
  color: #1a2332;
}
.delete-button:hover {
  background-color: #ff6969;
}

.form-submission-area {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-submission-area button {
  min-width: 150px; /* Give button a decent width */
}

.status-message {
  margin-top: 10px;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  width: 100%;
  max-width: 400px; /* Or adjust as needed */
  box-sizing: border-box;
}

.status-message.success {
  background-color: #28a745; /* Green background */
  color: #ffffff; /* White text */
  border: 1px solid #1e7e34;
}

.status-message.error {
  background-color: #dc3545; /* Red background */
  color: #ffffff; /* White text */
  border: 1px solid #b21f2d;
}
</style>
