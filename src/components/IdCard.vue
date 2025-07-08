<template>
  <div class="id-card">
    <div class="card-header">
      <div class="header-tabs">
        <div class="tab active"></div>
        <div class="tab"></div>
        <div class="tab"></div>
      </div>
    </div>

    <div class="card-content">
      <div class="left-section">
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

      <div class="right-section">
        <div class="top-right-section">
          <div class="barcode">
            <div class="barcode-lines">
              <div
                v-for="n in 45"
                :key="n"
                class="barcode-line"
                :data-barcode-width="
                  Math.floor(Math.random() * (3 - 1 + 1) + 1)
                "
              ></div>
            </div>
          </div>
          <div class="flag-container">
            <div
              class="flag"
              :style="{ background: profileData.flagColors }"
            ></div>
          </div>
        </div>

        <div class="info-section">
          <span class="name">{{ profileData.name }}</span>
          <div class="details">
            <div class="detail-row">
              <span class="label">Nationality</span>
              <span class="label-colon">:</span>
              <span class="value">{{ profileData.nationality }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Gender</span>
              <span class="label-colon">:</span>
              <span class="value">{{ profileData.gender }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Metatype</span>
              <span class="label-colon">:</span>
              <span class="value">{{ profileData.metatype }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="system-info">
      <div class="system-title">
        System Identification Number : {{ profileData.systemId }}
      </div>
      <div class="system-codes">
        <div class="code-line">IDC : {{ profileData.idc }}</div>
        <div class="code-line">{{ profileData.additionalCode }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

interface ProfileData {
  name: string;
  nationality: string;
  gender: string;
  metatype: string;
  photo: string;
  systemId: string;
  idc: string;
  additionalCode: string;
  flagColors: string;
}

interface Props {
  profileData: ProfileData;
}

const props = withDefaults(defineProps<Props>(), {
  profileData: () => ({
    name: "John Doe",
    nationality: "American",
    gender: "Male",
    metatype: "Human",
    photo: "https://via.placeholder.com/120x150/333/fff?text=Photo",
    systemId: "#Error1#",
    idc: "R-025648545482 - 5254267869 - 551247895512 - 02",
    additionalCode: "<<< 85478516/GTR/22145 >>> SIN ID",
    flagColors:
      "linear-gradient(to right, #ff0000 33%, #ffff00 33%, #ffff00 66%, #00ff00 66%)",
  }),
});
</script>

<style scoped>
.id-card {
  width: 500px;
  height: 300px;
  background: linear-gradient(135deg, #1a2332 0%, #2a3847 100%);
  border: 2px solid #4a9eff;
  border-radius: 8px;
  font-family: "Courier New", monospace;
  color: #00ffff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(74, 158, 255, 0.5);
  display: flex;
  flex-direction: column;
}

.card-header {
  height: 20px;
  background: linear-gradient(to right, #4a9eff, #6ab7ff);
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.header-tabs {
  display: flex;
  gap: 5px;
}

.tab {
  width: 30px;
  height: 12px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.tab.active {
  background: rgba(255, 255, 255, 0.8);
}

.card-content {
  display: flex;
  padding: 15px;
  gap: 20px;
  flex-grow: 1;
}

.left-section {
  display: flex;
  flex-direction: column;
}

.photo-section {
}

.photo-container {
  width: 150px;
  height: 170px;
  border: 2px solid #00ffff;
  border-radius: 4px;
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
  gap: 15px;
}

.top-right-section {
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 30px;
  justify-content: space-between;
}

.barcode {
  width: 100%;
}

.barcode-lines {
  display: flex;
  gap: 2px;
  align-items: end;
  height: 100%;
}

.barcode-line {
  background: #00ffff;
  height: 100%;
}

.barcode-line[data-barcode-width="1"] {
  flex-grow: 1;
}
.barcode-line[data-barcode-width="2"] {
  flex-grow: 2;
}
.barcode-line[data-barcode-width="3"] {
  flex-grow: 3;
}

.flag-container {
  width: 60px;
  border: 1px solid #00ffff;
  box-sizing: border-box;
}

.flag {
  width: 100%;
  height: 100%;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.name {
  font-size: 24px;
  font-weight: bold;
  color: #00ffff;
  text-align: left;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  flex-direction: row;
  justify-content: start;
  font-size: 14px;
  gap: 5px;
}

.label {
  color: #4a9eff;
  width: 100px;
  text-align: left;
  display: inline-block;
}

.label-colon {
  color: #4a9eff;
}

.value {
  color: #00ffff;
}

.system-info {
  background: rgba(0, 255, 255, 0.1);
  padding: 10px 15px;
  border-top: 1px solid #4a9eff;
  font-size: 11px;
}

.system-title {
  color: #00ffff;
  margin-bottom: 5px;
  font-weight: bold;
}

.system-codes {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.code-line {
  color: #4a9eff;
  font-size: 10px;
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
  z-index: -1;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}

/* Scan line effect */
.id-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: scan 3s linear infinite;
}

@keyframes scan {
  0% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(250px);
  }
}
</style>
