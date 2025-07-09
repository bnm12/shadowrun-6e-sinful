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
import {
  ShadowrunNationality,
  getFlagCSS,
  type ShadowrunNationalityType,
} from "./shadowrun-flags";

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
}

interface Props {
  profileData: ProfileData;
}

const props = withDefaults(defineProps<Props>(), {
  profileData: () => ({
    name: "John Doe",
    nationality: ShadowrunNationality.UNKNOWN,
    gender: "Male",
    metatype: "Human",
    photo: "./blank-profile-picture.svg",
    systemId: "#Error1#",
    idc: "R-025648545482 - 5254267869 - 551247895512 - 02",
    additionalCode: "<<< 85478516/GTR/22145 >>> SIN ID",
  }),
});

// Function to get flag colors based on nationality or manual override
const getFlagColors = (): string => {
  // If manual colors are provided, use them
  if (props.profileData.flagColors) {
    return props.profileData.flagColors;
  }

  // Otherwise, look up by nationality
  return getFlagCSS(props.profileData.nationality);
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
  transform: rotate(90deg);
  transform-origin: center center;
  flex-shrink: 0;
  height: 95vw;
}

/* Ensure pseudo-elements rotate with the card if they are positioned relative to it */
.id-card::before,
.id-card::after {
  /* transform-origin might need to be adjusted if they look off */
}

.card-header {
  height: 6%; /* Relative height */
  background: linear-gradient(to right, #4a9eff, #6ab7ff);
  display: flex;
  align-items: center;
  padding: 0 2%; /* Relative padding */
}

.header-tabs {
  display: flex;
  gap: 1%; /* Relative gap */
  height: 100%;
  width: 100%;
  align-items: center;
}

.tab {
  width: 6%; /* Relative width */
  height: 60%; /* Relative to header height */
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.tab.active {
  background: rgba(255, 255, 255, 0.8);
}

.card-content {
  display: flex;
  padding: 3%; /* Relative padding */
  gap: 4%; /* Relative gap */
  flex-grow: 1;
}

.left-section {
  display: flex;
  flex-direction: column;
  width: 30%; /* Proportion of card content */
}

.photo-section {
  width: 100%;
}

.photo-container {
  width: 100%;
  aspect-ratio: 150 / 170; /* Maintain original aspect ratio */
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
  gap: 5%; /* Relative gap */
  width: 66%; /* Proportion of card content */
}

.top-right-section {
  display: flex;
  flex-direction: row;
  gap: 2%; /* Relative gap */
  height: 15%; /* Relative to right-section height */
  justify-content: space-between;
}

.barcode {
  width: 70%; /* Proportion of top-right-section */
}

.barcode-lines {
  display: flex;
  gap: 1px; /* Minimal gap for lines */
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
  width: 25%; /* Proportion of top-right-section */
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
  gap: 5%; /* Relative gap */
  flex-grow: 1;
}

.name {
  font-size: clamp(1em, 4vh, 2em); /* Responsive font size */
  font-weight: bold;
  color: #00ffff;
  text-align: left;
  line-height: 1.1;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.5vh; /* Relative gap */
}

.detail-row {
  display: flex;
  flex-direction: row;
  justify-content: start;
  font-size: clamp(0.6em, 2vh, 1em); /* Responsive font size */
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
  font-size: clamp(0.5em, 1.8vh, 0.8em); /* Responsive font size */
}

.system-title {
  color: #00ffff;
  margin-bottom: 1%;
  font-weight: bold;
}

.system-codes {
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
}

.code-line {
  color: #4a9eff;
  font-size: clamp(0.4em, 1.5vh, 0.7em); /* Responsive font size */
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
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: scan 3s linear infinite;
  z-index: 1; /* Ensure it's above other content if necessary */
}

@keyframes scan {
  0% {
    top: 0;
  }
  100% {
    /*
      The id-card's new height (visual height on screen after rotation) is its CSS width (85vh).
      We want the 2px line to travel from top to bottom of this.
      If translateY(100%) refers to the element's own height (2px), this is not what we want.
      We need to translate it by the height of the container.
      A common trick for this is to make the pseudo-element itself have 0 height and use a border or box-shadow for visuals,
      or to translate it by a large fixed/viewport unit that matches the container.
      Let's try translating it by the visual height of the card.
      The card's effective height after rotation is its `width` property: 85vh.
    */
    top: 100%; /* Travel full visual height minus its own height */
  }
}
</style>
