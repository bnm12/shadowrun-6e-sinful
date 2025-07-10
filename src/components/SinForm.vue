<template>
  <div class="sin-form-container">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="formData.Basic.name" required />
      </div>

      <div class="form-group">
        <label for="gender">Gender:</label>
        <select id="gender" v-model="formData.Basic.gender" required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Diverse">Diverse</option>
        </select>
      </div>

      <div class="form-group">
        <label for="nationality">Nationality:</label>
        <select id="nationality" v-model="formData.Basic.nationality" required>
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
        <select id="metatype" v-model="formData.Basic.metatype" required>
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
            v-for="quality in sinQualities"
            :key="quality.value"
            :value="quality.value"
          >
            {{ quality.text }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="imageUrl">Image URL (for Basic Photo):</label>
        <input type="url" id="imageUrl" v-model="formData.Basic.photo" />
      </div>

      <div v-if="formData.Basic.photo" class="image-preview">
        <img :src="formData.Basic.photo" alt="Image Preview" />
      </div>

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
              v-for="quality in sinQualities"
              :key="quality.value"
              :value="quality.value"
            >
              {{ quality.text }}
            </option>
          </select>
        </div>
        <button type="button" @click="addOrUpdateLicense" class="action-button">
          {{ editingLicenseKey ? "Update License" : "Add License" }}
        </button>

        <div
          v-if="Object.keys(formData.licenses || {}).length > 0"
          class="licenses-list"
        >
          <h4>Current Licenses:</h4>
          <ul>
            <li v-for="(quality, name) in formData.licenses!" :key="name">
              {{ name }} ({{ getSinQualityText(quality) }})
              <button
                type="button"
                @click="editLicense(name)"
                class="edit-button small-button"
              >
                Edit
              </button>
              <button
                type="button"
                @click="deleteLicense(name)"
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
import { reactive, ref } from "vue";
import {
  ShadowrunNationality,
  getAllNationalities,
  // type ShadowrunNationalityType, // Unused
} from "./shadowrun-flags";
import {
  ShadowrunMetatype,
  getAllMetatypes,
  // type ShadowrunMetatypeType, // Unused
} from "./shadowrun-metatypes";
import {
  SinQuality,
  getAllSinQualities,
  type SinQualityValue,
} from "./sin-quality";
import type { ProfileData } from "../@types/profile"; // Import ProfileData, ProfileBasic is unused

import { v4 as uuidv4 } from "uuid"; // Ensure uuid is imported

// Props received from App.vue
const props = defineProps<{
  isWriting: boolean;
  writeStatusMessage: string;
  writeStatusMessageType: "success" | "error" | "";
}>();

const nationalities = getAllNationalities();
const metatypes = getAllMetatypes();
const sinQualities = getAllSinQualities();

// For license form
const currentLicenseName = ref("");
const currentLicenseQuality = ref<SinQualityValue>(SinQuality.LEVEL_1);
const editingLicenseKey = ref<string | null>(null);

// Initialize formData with the full ProfileData structure
const formData = reactive<ProfileData>({
  sinId: uuidv4(), // Will be set in App.vue before writing
  active: true,
  sinQuality: SinQuality.LEVEL_3, // Default SIN quality for new SINs
  licenses: {}, // Initialize licenses as an empty object
  Basic: {
    name: "",
    gender: "Male",
    nationality: ShadowrunNationality.UCAS, // Default nationality
    metatype: ShadowrunMetatype.HUMAN, // Default metatype
    photo: "", // imageUrl maps to photo
  },
  Identity: {}, // Initialize other sections as empty.
  Physical: {}, // Form could be expanded to include these.
  Medical: {},
  Employment: {},
  Genetic: {},
});

const emit = defineEmits(["submitSinData"]);

const getSinQualityText = (qualityValue: SinQualityValue): string => {
  const quality = sinQualities.find((q) => q.value === qualityValue);
  return quality ? quality.text : "Unknown Quality";
};

const addOrUpdateLicense = () => {
  if (!currentLicenseName.value.trim()) {
    alert("License name cannot be empty.");
    return;
  }
  const name = currentLicenseName.value.trim();
  if (editingLicenseKey.value && editingLicenseKey.value !== name) {
    // If name changed during edit, delete old entry
    delete formData.licenses![editingLicenseKey.value];
  }
  formData.licenses![name] = currentLicenseQuality.value;
  currentLicenseName.value = "";
  currentLicenseQuality.value = SinQuality.LEVEL_1;
  editingLicenseKey.value = null;
};

const editLicense = (licenseName: string) => {
  currentLicenseName.value = licenseName;
  currentLicenseQuality.value = formData.licenses![licenseName];
  editingLicenseKey.value = licenseName;
};

const deleteLicense = (licenseName: string) => {
  if (confirm(`Are you sure you want to delete license "${licenseName}"?`)) {
    delete formData.licenses![licenseName];
    if (editingLicenseKey.value === licenseName) {
      // Clear form if currently editing the deleted license
      currentLicenseName.value = "";
      currentLicenseQuality.value = SinQuality.LEVEL_1;
      editingLicenseKey.value = null;
    }
  }
};

const submitForm = () => {
  // Basic validation can be added here if needed
  emit("submitSinData", { ...formData });
};
</script>

<style scoped>
.sin-form-container {
  padding: 20px;
  background-color: #1a2332;
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

.licenses-section h3 {
  color: #4a9eff;
  margin-bottom: 10px;
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
