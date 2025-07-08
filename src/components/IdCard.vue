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
            <div class="flag" :style="{ background: getFlagColors() }"></div>
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
  flagColors?: string; // Optional manual override
}

interface Props {
  profileData: ProfileData;
}

const props = withDefaults(defineProps<Props>(), {
  profileData: () => ({
    name: "John Doe",
    nationality: "UCAS",
    gender: "Male",
    metatype: "Human",
    photo: "https://via.placeholder.com/120x150/333/fff?text=Photo",
    systemId: "#Error1#",
    idc: "R-025648545482 - 5254267869 - 551247895512 - 02",
    additionalCode: "<<< 85478516/GTR/22145 >>> SIN ID",
  }),
});

// Shadowrun 6E flag definitions
const shadowrunFlags: Record<string, string> = {
  // North America
  UCAS: "linear-gradient(to bottom, #ff0000 33%, #ffffff 33%, #ffffff 66%, #0000ff 66%)",
  CAS: "linear-gradient(to bottom, #ff0000 20%, #ffffff 20%, #ffffff 40%, #ff0000 40%, #ffffff 60%, #ff0000 60%, #ffffff 80%, #ff0000 80%)",
  Quebec:
    "linear-gradient(to right, #0000ff 33%, #ffffff 33%, #ffffff 66%, #0000ff 66%)",
  "California Free State":
    "linear-gradient(to bottom, #ff0000 50%, #ffff00 50%)",
  "Tír Tairngire":
    "linear-gradient(135deg, #006400 0%, #228b22 50%, #32cd32 100%)",
  "Tír na nÓg":
    "linear-gradient(to right, #006400 33%, #ffffff 33%, #ffffff 66%, #ff8c00 66%)",
  Aztlan:
    "linear-gradient(to bottom, #006400 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",
  "Salish-Shidhe":
    "linear-gradient(45deg, #8b4513 0%, #daa520 50%, #228b22 100%)",
  "Sioux Nation": "linear-gradient(to right, #ff0000 50%, #ffff00 50%)",
  "Pueblo Corporate Council":
    "linear-gradient(to bottom, #ff8c00 50%, #4169e1 50%)",
  "Algonkian-Manitou":
    "linear-gradient(135deg, #8b4513 0%, #ffffff 50%, #0000ff 100%)",

  // Europe
  "German Alliance":
    "linear-gradient(to bottom, #000000 33%, #ff0000 33%, #ff0000 66%, #ffff00 66%)",
  "Allied German States":
    "linear-gradient(to bottom, #000000 33%, #ff0000 33%, #ff0000 66%, #ffff00 66%)",
  France:
    "linear-gradient(to right, #0000ff 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",
  "United Kingdom":
    "linear-gradient(45deg, #012169 0%, #ffffff 25%, #ce1126 50%, #ffffff 75%, #012169 100%)",
  "Scandinavian Union":
    "linear-gradient(to right, #ff0000 40%, #ffff00 40%, #ffff00 60%, #0000ff 60%)",
  Poland: "linear-gradient(to bottom, #ffffff 50%, #ff0000 50%)",
  "Czech Republic": "linear-gradient(to bottom, #ffffff 50%, #ff0000 50%)",
  Italy:
    "linear-gradient(to right, #006400 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",
  Spain:
    "linear-gradient(to bottom, #ff0000 25%, #ffff00 25%, #ffff00 75%, #ff0000 75%)",
  Netherlands:
    "linear-gradient(to bottom, #ff0000 33%, #ffffff 33%, #ffffff 66%, #0000ff 66%)",
  Switzerland: "linear-gradient(to bottom, #ff0000 0%, #ffffff 100%)",
  Austria:
    "linear-gradient(to bottom, #ff0000 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",

  // Asia
  "Japanese Imperial State":
    "linear-gradient(to bottom, #ffffff 0%, #ff0000 100%)",
  China: "linear-gradient(to bottom, #ff0000 0%, #ffff00 100%)",
  Korea:
    "linear-gradient(to bottom, #ffffff 25%, #ff0000 25%, #ff0000 50%, #0000ff 50%, #0000ff 75%, #ffffff 75%)",
  "Hong Kong": "linear-gradient(to bottom, #ff0000 0%, #ffffff 100%)",
  Philippines: "linear-gradient(to bottom, #0000ff 50%, #ff0000 50%)",
  Thailand:
    "linear-gradient(to bottom, #ff0000 20%, #ffffff 20%, #ffffff 40%, #0000ff 40%, #0000ff 60%, #ffffff 60%, #ffffff 80%, #ff0000 80%)",
  Indonesia: "linear-gradient(to bottom, #ff0000 50%, #ffffff 50%)",
  Malaysia:
    "linear-gradient(to bottom, #ff0000 25%, #ffffff 25%, #ffffff 50%, #ff0000 50%, #ffffff 75%, #ff0000 75%)",
  Singapore: "linear-gradient(to bottom, #ff0000 50%, #ffffff 50%)",
  India:
    "linear-gradient(to bottom, #ff8c00 33%, #ffffff 33%, #ffffff 66%, #006400 66%)",
  Tibet:
    "linear-gradient(to bottom, #ffff00 25%, #ff0000 25%, #ff0000 50%, #0000ff 50%, #0000ff 75%, #ffff00 75%)",

  // Middle East & Africa
  Turkey: "linear-gradient(to bottom, #ff0000 0%, #ffffff 100%)",
  Israel:
    "linear-gradient(to bottom, #0000ff 25%, #ffffff 25%, #ffffff 75%, #0000ff 75%)",
  Egypt:
    "linear-gradient(to bottom, #ff0000 33%, #ffffff 33%, #ffffff 66%, #000000 66%)",
  Morocco: "linear-gradient(to bottom, #ff0000 0%, #006400 100%)",
  Algeria: "linear-gradient(to right, #006400 50%, #ffffff 50%)",
  "South Africa":
    "linear-gradient(135deg, #ff0000 0%, #ffff00 25%, #006400 50%, #0000ff 75%, #000000 100%)",
  Nigeria:
    "linear-gradient(to right, #006400 33%, #ffffff 33%, #ffffff 66%, #006400 66%)",
  Kenya:
    "linear-gradient(to bottom, #000000 33%, #ff0000 33%, #ff0000 66%, #006400 66%)",
  Ghana:
    "linear-gradient(to bottom, #ff0000 33%, #ffff00 33%, #ffff00 66%, #006400 66%)",
  Azania:
    "linear-gradient(to bottom, #000000 33%, #ff0000 33%, #ff0000 66%, #006400 66%)",

  // South America
  Brazil:
    "linear-gradient(to bottom, #006400 25%, #ffff00 25%, #ffff00 75%, #0000ff 75%)",
  Argentina:
    "linear-gradient(to bottom, #87ceeb 33%, #ffffff 33%, #ffffff 66%, #87ceeb 66%)",
  Chile:
    "linear-gradient(to bottom, #0000ff 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",
  Colombia: "linear-gradient(to bottom, #ffff00 50%, #0000ff 25%, #ff0000 25%)",
  Venezuela:
    "linear-gradient(to bottom, #ffff00 33%, #0000ff 33%, #0000ff 66%, #ff0000 66%)",
  Peru: "linear-gradient(to right, #ff0000 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",
  Ecuador:
    "linear-gradient(to bottom, #ffff00 33%, #0000ff 33%, #0000ff 66%, #ff0000 66%)",
  Bolivia:
    "linear-gradient(to bottom, #ff0000 33%, #ffff00 33%, #ffff00 66%, #006400 66%)",

  // Oceania
  Australia: "linear-gradient(to bottom, #0000ff 0%, #ffffff 100%)",
  "New Zealand": "linear-gradient(to bottom, #0000ff 0%, #ffffff 100%)",
  "Hawai'i":
    "linear-gradient(to bottom, #ffffff 12.5%, #ff0000 12.5%, #ff0000 25%, #0000ff 25%, #0000ff 37.5%, #ffffff 37.5%, #ffffff 50%, #ff0000 50%, #ff0000 62.5%, #0000ff 62.5%, #0000ff 75%, #ffffff 75%, #ffffff 87.5%, #ff0000 87.5%)",

  // Corporate Nations
  "Renraku Arcology": "linear-gradient(to bottom, #ff0000 0%, #000000 100%)",
  "Fuchi Corporate": "linear-gradient(to bottom, #0000ff 0%, #ffffff 100%)",
  Aztechnology: "linear-gradient(to bottom, #ff8c00 0%, #8b4513 100%)",
  "Saeder-Krupp": "linear-gradient(to bottom, #000000 0%, #ff0000 100%)",
  "Ares Macrotechnology":
    "linear-gradient(to bottom, #ff0000 0%, #ffffff 100%)",

  // Metahuman Nations
  "Seelie Court":
    "linear-gradient(135deg, #ffd700 0%, #ffffff 50%, #32cd32 100%)",
  "Unseelie Court":
    "linear-gradient(135deg, #4b0082 0%, #000000 50%, #8b0000 100%)",
  "Ork Underground": "linear-gradient(to bottom, #8b4513 0%, #000000 100%)",
  "Troll Kingdom": "linear-gradient(to bottom, #696969 0%, #000000 100%)",

  // Awakened Nations
  Amazonia: "linear-gradient(135deg, #228b22 0%, #32cd32 50%, #006400 100%)",
  Yakut: "linear-gradient(to bottom, #ffffff 0%, #87ceeb 100%)",
  "Trans-Polar Aleut": "linear-gradient(to bottom, #87ceeb 0%, #ffffff 100%)",

  // Default fallback
  Unknown: "linear-gradient(to right, #808080 0%, #a0a0a0 100%)",
};

// Function to get flag colors based on nationality or manual override
const getFlagColors = (): string => {
  // If manual colors are provided, use them
  if (props.profileData.flagColors) {
    return props.profileData.flagColors;
  }

  // Otherwise, look up by nationality
  const nationality = props.profileData.nationality;
  return shadowrunFlags[nationality] || shadowrunFlags["Unknown"];
};
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
