<template>
  <div class="sin-form-container">
    <h2>Create SIN Data</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="formData.name" required />
      </div>

      <div class="form-group">
        <label for="gender">Gender:</label>
        <select id="gender" v-model="formData.gender" required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Diverse">Diverse</option>
        </select>
      </div>

      <div class="form-group">
        <label for="nationality">Nationality:</label>
        <select id="nationality" v-model="formData.nationality" required>
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
        <select id="metatype" v-model="formData.metatype" required>
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
        <label for="imageUrl">Image URL:</label>
        <input type="url" id="imageUrl" v-model="formData.imageUrl" />
      </div>

      <div v-if="formData.imageUrl" class="image-preview">
        <img :src="formData.imageUrl" alt="Image Preview" />
      </div>

      <button type="submit">Write to Tag</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {
  ShadowrunNationality,
  getAllNationalities,
  type ShadowrunNationalityType,
} from "./shadowrun-flags";
import {
  ShadowrunMetatype,
  getAllMetatypes,
  type ShadowrunMetatypeType,
} from "./shadowrun-metatypes";
import {
  SinQuality,
  getAllSinQualities,
} from "./sin-quality";

interface SinFormData {
  name: string;
  gender: "Male" | "Female" | "Diverse";
  nationality: ShadowrunNationalityType;
  metatype: ShadowrunMetatypeType;
  imageUrl: string;
  sinQuality: SinQuality;
}

const nationalities = getAllNationalities();
const metatypes = getAllMetatypes();
const sinQualities = getAllSinQualities();

const formData = reactive<SinFormData>({
  name: "",
  gender: "Male",
  nationality: ShadowrunNationality.UCAS, // Default nationality
  metatype: ShadowrunMetatype.HUMAN, // Default metatype
  imageUrl: "",
  sinQuality: SinQuality.LEVEL_3, // Default SIN quality
});

const emit = defineEmits(["submitSinData"]);

const submitForm = () => {
  // Basic validation can be added here if needed
  emit("submitSinData", { ...formData });
};
</script>

<style scoped>
.sin-form-container {
  padding: 20px;
  border: 1px solid #4a9eff;
  border-radius: 8px;
  background-color: #1a2332;
  color: #00ffff;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #4a9eff;
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
</style>
