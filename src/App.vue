<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import IdCard from "./components/IdCard.vue";
import SinForm from "./components/SinForm.vue";
import type { ProfileData } from "./proto/profile.pb";
import { useNfc } from "./composables/useNfc";
import { useReadme } from "./composables/useReadme";

const currentView = ref<"landing" | "sin-check" | "create-sin">("landing");

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

const {
  showReadmeModal,
  readmeHtmlContent,
  // loadReadme, // loadReadme is called internally by toggleReadmeModal
  toggleReadmeModal,
} = useReadme();

// Initialize currentProfileData as a minimal empty object.
// IdCard.vue's withDefaults will handle showing its own default "standby" data.
const currentProfileData = ref<ProfileData>({} as ProfileData);

// Watch for changes in scannedProfileData from the composable and update local currentProfileData
watch(scannedProfileData, (newData) => {
  if (newData && newData.sinId) {
    currentProfileData.value = newData;
  }
});

const setView = (viewName: "landing" | "sin-check" | "create-sin") => {
  currentView.value = viewName;
  history.replaceState(null, "", `#${viewName}`);
  if (viewName === "sin-check") {
    currentProfileData.value = {} as ProfileData; // Reset before scan
    readTag();
  }
};

const handleHashChange = () => {
  const hash = window.location.hash.replace(/^#/, "") as
    | "landing"
    | "sin-check"
    | "create-sin";
  if (["landing", "sin-check", "create-sin"].includes(hash)) {
    currentView.value = hash;
    if (hash === "sin-check") {
      currentProfileData.value = {} as ProfileData; // Reset before scan
      readTag();
    }
  } else {
    currentView.value = "landing";
    window.location.hash = "landing";
  }
};

const particles = computed(() => {
  const particleCount = 25;
  const generatedParticles: {
    size: number;
    left: number;
    top: number;
    animationDuration: number;
  }[] = [];
  for (let i = 0; i < particleCount; i++) {
    generatedParticles.push({
      // Random size between 2-8px
      size: Math.random() * 6 + 2,

      // Random position
      left: Math.random() * 100,
      top: Math.random() * 100,

      // Random animation duration
      animationDuration: Math.random() * 4 + 5,
    });
  }
  return generatedParticles;
});

const initializeBackground = () => {
  // Add subtle mouse movement effect
  const handleMouseMove = (e: MouseEvent) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const glow = document.querySelector(".glow-effect") as HTMLElement;
    if (glow) {
      glow.style.transform = `translate(-50%, -50%) translate(${mouseX * 30}px, ${mouseY * 30}px)`;
    }
  };

  document.addEventListener("mousemove", handleMouseMove);

  // Store the cleanup function
  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
  };
};

onMounted(() => {
  handleHashChange();
  window.addEventListener("hashchange", handleHashChange);
  initializeBackground();
  // Initial README load can be triggered here if desired, or on first click via toggleReadmeModal
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", handleHashChange);
});
</script>

<template>
  <div class="app-container">
    <!-- Animated Background -->
    <div class="background-container">
      <div class="floating-particles">
        <template v-for="particle in particles">
          <div
            class="particle"
            :style="{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDuration: `${particle.animationDuration}s`,
            }"
          ></div>
        </template>
      </div>
      <div class="grid-overlay"></div>
      <div class="glow-effect"></div>
    </div>

    <!-- Info Button for Landing View -->
    <div v-if="currentView === 'landing'" class="info-button-container">
      <div class="info-button" @click="toggleReadmeModal">
        <span class="glitch-text" data-text="i">i</span>
      </div>
    </div>

    <!-- Landing View -->
    <div v-if="currentView === 'landing'" class="landing-view main-content">
      <h1 class="landing-headline glitch-text" data-text="SINful">SINful</h1>
      <div class="logo"></div>
      <div class="navigation-buttons">
        <div @click="setView('sin-check')" class="navigation-button">
          <div class="glitch-text" data-text="SIN Check">SIN Check</div>
        </div>
        <div @click="setView('create-sin')" class="navigation-button">
          <div class="glitch-text" data-text="Create SIN">Create SIN</div>
        </div>
      </div>
    </div>

    <!-- SIN Check View -->
    <div
      v-else-if="currentView === 'sin-check'"
      class="sin-check-view main-content"
    >
      <div class="id-card-container">
        <IdCard
          :profileData="currentProfileData"
          :scanStatus="currentScanStatus"
          :scanResultMessage="currentScanResultMessage"
        />
      </div>
      <div class="navigation-buttons">
        <div @click="setView('landing')" class="navigation-button">
          <div class="glitch-text" data-text="Back to Home">Back to Home</div>
        </div>
      </div>
    </div>

    <!-- Create SIN View -->
    <div
      v-else-if="currentView === 'create-sin'"
      class="create-sin-view main-content"
    >
      <div class="create-sin-heading glitch-text" data-text="Create your SIN">
        Create your SIN
      </div>
      <div class="sin-form-section">
        <SinForm
          @submitSinData="writeTag"
          :isWriting="isWriting"
          :writeStatusMessage="writeStatusMessage"
          :writeStatusMessageType="writeStatusMessageType"
        />
      </div>
      <div class="navigation-buttons">
        <div @click="setView('landing')" class="navigation-button">
          <div class="glitch-text" data-text="Back to Home">Back to Home</div>
        </div>
      </div>
    </div>

    <!-- README Modal -->
    <div
      v-if="showReadmeModal"
      class="readme-modal-overlay"
      @click.self="toggleReadmeModal"
    >
      <div class="readme-modal-content">
        <div class="readme-modal-header">
          <div class="readme-modal-header-text">
            <span class="glitch-text" data-text="INFORMATION">INFORMATION</span>
          </div>
          <div class="close-readme-button" @click="toggleReadmeModal">
            <span class="glitch-text" data-text="X">X</span>
          </div>
        </div>
        <div class="readme-modal-body">
          <div v-html="readmeHtmlContent" class="readme-html-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-button-container {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 100; /* Ensure it's above other landing page content */
}

.info-button {
  border: 1px solid #ff1493;
  color: #ff1493;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  /* Torn/damaged edge effect */
  clip-path: polygon(
    0% 0%,
    80% 0%,
    100% 20%,
    90% 40%,
    100% 60%,
    85% 80%,
    100% 100%,
    0% 100%,
    10% 80%,
    0% 60%,
    15% 40%,
    0% 20%
  );
}

.info-button:hover {
  background-color: #ff1493;
  color: #10012c;
  box-shadow: 0 0 20px rgba(255, 20, 147, 0.5);
  transform: scale(1.1);
}

.info-button > span {
  font-family: monospace;
}

.readme-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.readme-modal-content {
  padding: 5px;
  background-color: #10012c;
  color: #00ffff;
  border-radius: 3px;
  width: 85%;
  max-width: 900px;
  height: 85%;
  max-height: 90vh;
  border: 2px solid #ff1493;
  box-shadow:
    0 0 20px #ff1493,
    inset 0 0 20px rgba(255, 20, 147, 0.1);

  /* Add patchy texture like info button */
  background-image:
    radial-gradient(
      circle at 20% 50%,
      rgba(255, 20, 147, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(138, 43, 226, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 80%,
      rgba(0, 255, 255, 0.05) 0%,
      transparent 50%
    );

  /* Subtle scan lines */
  background-size:
    100% 2px,
    100% 100%,
    100% 100%;
  background-repeat: repeat-y, no-repeat, no-repeat;

  /* Use flexbox for layout */
  display: flex;
  flex-direction: column;
}

.readme-modal-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  border-bottom: 2px solid rgba(255, 20, 147, 0.8);
}

.readme-modal-header-text {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
}

.close-readme-button {
  border: 1px solid #ff1493;
  color: #ff1493;
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  /* Torn/damaged edge effect */
  clip-path: polygon(
    0% 0%,
    80% 0%,
    100% 20%,
    90% 40%,
    100% 60%,
    85% 80%,
    100% 100%,
    0% 100%,
    10% 80%,
    0% 60%,
    15% 40%,
    0% 20%
  );
}

.close-readme-button:hover {
  background-color: #ff1493;
  color: #10012c;
  box-shadow: 0 0 20px rgba(255, 20, 147, 0.5);
  transform: scale(1.1);
}

.readme-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.readme-html-container {
  /* Content fade-in animation */
  animation: content-fade-in 0.8s ease-out;

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #ff1493 #10012c;

  /* Better text rendering */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* Better mobile scrolling */
  -webkit-overflow-scrolling: touch;

  /* Responsive font sizing */
  font-size: clamp(0.9rem, 2vw, 1.1rem);

  /* Left-align all content by default */
  text-align: left;
}

/* Custom scrollbar styles */
.readme-html-container::-webkit-scrollbar {
  width: 8px;
}

.readme-html-container::-webkit-scrollbar-track {
  background: #10012c;
  border-radius: 4px;
}

.readme-html-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ff1493, #8a2be2);
  border-radius: 4px;
  border: 1px solid #ff1493;
}

.readme-html-container::-webkit-scrollbar-thumb:hover {
  background: #ff1493;
  box-shadow: 0 0 5px #ff1493;
}

.readme-html-container > *:first-child {
  margin-top: 0;
}

/* Content fade-in animation */
@keyframes content-fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animations for child elements */
.readme-html-container :deep(h1),
.readme-html-container :deep(h2),
.readme-html-container :deep(h3),
.readme-html-container :deep(p),
.readme-html-container :deep(ul),
.readme-html-container :deep(ol),
.readme-html-container :deep(pre) {
  animation: element-fade-in 0.6s ease-out backwards;
}

.readme-html-container :deep(*:nth-child(1)) {
  animation-delay: 0.1s;
}
.readme-html-container :deep(*:nth-child(2)) {
  animation-delay: 0.2s;
}
.readme-html-container :deep(*:nth-child(3)) {
  animation-delay: 0.3s;
}
.readme-html-container :deep(*:nth-child(4)) {
  animation-delay: 0.4s;
}
.readme-html-container :deep(*:nth-child(5)) {
  animation-delay: 0.5s;
}

@keyframes element-fade-in {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Add subtle glow to all text */
.readme-html-container :deep(*) {
  text-shadow: 0 0 2px rgba(0, 255, 255, 0.1);
}

/* Basic styling for content generated by marked */
.readme-html-container :deep(h1),
.readme-html-container :deep(h2),
.readme-html-container :deep(h3) {
  color: #ff1493;
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  text-align: left;
}

.readme-html-container :deep(h1) {
  font-size: 2em;
  border-bottom: 2px solid rgba(255, 20, 147, 0.3);
  padding-bottom: 0.3em;
}

.readme-html-container :deep(h2) {
  font-size: 1.75em;
  border-bottom: 1px solid rgba(255, 20, 147, 0.2);
  padding-bottom: 0.2em;
}

.readme-html-container :deep(h3) {
  font-size: 1.5em;
}

/* Terminal-style text cursor animation for headings */
/*.readme-html-container :deep(h1)::after,
.readme-html-container :deep(h2)::after {
  content: "_";
  animation: cursor-blink 1s infinite;
  color: #ff1493;
  margin-left: 4px;
}*/

@keyframes cursor-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.readme-html-container :deep(p) {
  line-height: 1.7;
  margin-bottom: 1.2em;
  color: #c0c0c0;
  text-align: left;
}

/* Enhanced hover effect for paragraphs */
.readme-html-container :deep(p):hover {
  background: rgba(255, 20, 147, 0.05);
  border-left: 3px solid #ff1493;
  padding-left: 1em;
  transition: all 0.3s ease;
  border-radius: 0 4px 4px 0;
}

/* Better list styling */
.readme-html-container :deep(ul),
.readme-html-container :deep(ol) {
  margin-left: 0;
  padding-left: 1.5em;
  margin-bottom: 1.2em;
  color: #c0c0c0;
  text-align: left;
}

.readme-html-container :deep(li) {
  margin-bottom: 0.8em;
  line-height: 1.6;
  position: relative;
}

/* Custom bullet points for unordered lists */
.readme-html-container :deep(ul) {
  list-style: none;
  padding-left: 0;
}

.readme-html-container :deep(ul li) {
  padding-left: 1.5em;
  position: relative;
}

.readme-html-container :deep(ul li::before) {
  content: "▶";
  position: absolute;
  left: 0;
  color: #ff1493;
  font-size: 0.8em;
  top: 0.1em;
}

/* Nested list styling */
.readme-html-container :deep(ul ul li::before) {
  content: "▷";
  color: #6ab7ff;
}

/* Better ordered list styling */
.readme-html-container :deep(ol) {
  counter-reset: custom-counter;
  list-style: none;
  padding-left: 0;
}

.readme-html-container :deep(ol li) {
  counter-increment: custom-counter;
  padding-left: 2em;
  position: relative;
}

.readme-html-container :deep(ol li::before) {
  content: counter(custom-counter) ".";
  position: absolute;
  left: 0;
  color: #ff1493;
  font-weight: bold;
  min-width: 1.5em;
}

/* Enhanced link styling */
.readme-html-container :deep(a) {
  color: #6ab7ff;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  padding: 2px 4px;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.readme-html-container :deep(a::before) {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 20, 147, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.readme-html-container :deep(a:hover) {
  background: rgba(106, 183, 255, 0.1);
  color: #ff1493;
}

.readme-html-container :deep(a:hover::before) {
  left: 100%;
}

/* Enhanced code styling */
.readme-html-container :deep(code) {
  background-color: #1a0033;
  padding: 0.2em 0.6em;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  color: #00ffff;
  border: 1px solid rgba(255, 20, 147, 0.2);
  font-size: 0.9em;
}

.readme-html-container :deep(pre) {
  background-color: #1a0033;
  padding: 1.5em;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #6ab7ff;
  margin: 1.5em 0;
  position: relative;
}

.readme-html-container :deep(pre):hover::before {
  content: "Click to copy";
  position: absolute;
  top: 8px;
  right: 12px;
  background: #ff1493;
  color: #10012c;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  opacity: 0.9;
  font-family: sans-serif;
}

.readme-html-container :deep(pre code) {
  padding: 0;
  background: none;
  border: none;
  font-size: 0.9em;
}

.readme-html-container :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1em 0;
  border: 1px solid rgba(255, 20, 147, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Strong/Bold text styling - fix for centered alignment issues */
.readme-html-container :deep(strong) {
  color: #ff1493;
  font-weight: bold;
  text-shadow: 0 0 4px rgba(255, 20, 147, 0.3);
}

/* Table styling */
.readme-html-container :deep(table) {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #ff1493;
  margin: 1.5em 0;
  background: rgba(26, 0, 51, 0.5);
}

.readme-html-container :deep(th),
.readme-html-container :deep(td) {
  border: 1px solid rgba(255, 20, 147, 0.3);
  padding: 0.8em;
  text-align: left;
}

.readme-html-container :deep(th) {
  background: rgba(255, 20, 147, 0.1);
  color: #ff1493;
  font-weight: bold;
}

/* Mobile-specific adjustments */
@media (max-width: 768px) {
  .readme-html-container :deep(li) {
    padding-left: 1.2em;
  }

  .readme-html-container :deep(ul li::before) {
    left: 0;
  }

  .readme-html-container :deep(ol li) {
    padding-left: 1.8em;
  }

  .readme-html-container :deep(pre) {
    padding: 1em;
    font-size: 0.85em;
  }

  .readme-html-container :deep(h1) {
    font-size: 1.8em;
  }

  .readme-html-container :deep(h2) {
    font-size: 1.5em;
  }

  .readme-html-container :deep(h3) {
    font-size: 1.3em;
  }
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100dvh; /* Full viewport height */
  width: 100dvw; /* Full viewport width */
  background: linear-gradient(135deg, #0a0a2e, #1a2332, #16213e);
  color: #00ffff; /* Default text color */
  overflow-y: auto;
  padding: 10px;
  position: relative;
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(255, 20, 147, 0.4);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.particle:nth-child(2n) {
  background: rgba(106, 183, 255, 0.3);
  animation-delay: -2s;
}

.particle:nth-child(3n) {
  background: rgba(0, 255, 255, 0.2);
  animation-delay: -4s;
}

.particle:nth-child(4n) {
  background: rgba(138, 43, 226, 0.25);
  animation-delay: -1s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
    opacity: 1;
  }
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255, 20, 147, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 20, 147, 0.1) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.4;
  animation: gridMove 15s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(60px, 60px);
  }
}

.glow-effect {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(255, 20, 147, 0.08) 0%,
    transparent 70%
  );
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: glow 4s ease-in-out infinite alternate;
}

@keyframes glow {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.6;
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Center content vertically */
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  text-align: center; /* Center text elements like h1 */
  position: relative;
  z-index: 10;
}

.landing-view .landing-headline {
  font-size: 5em;
}

.glitch-text {
  color: rgba(202, 25, 115, 1);
  background: linear-gradient(180deg, #ff1493 0%, #8a2be2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-family: "Doctor Glitch";
  position: relative;
  z-index: 3;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.glitch-text::before {
  color: rgba(255, 0, 0, 0.8);
  background: rgba(255, 0, 0, 0.4);
  background-clip: text;
  -webkit-background-clip: text;
  animation: enhanced-glitch-1 20s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch-text::after {
  color: rgba(0, 255, 255, 0.8);
  background: rgba(0, 255, 255, 0.4);
  background-clip: text;
  -webkit-background-clip: text;
  animation: enhanced-glitch-2 20s infinite;
  clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
}

@keyframes enhanced-glitch-1 {
  0%,
  98%,
  100% {
    transform: translate(0);
    opacity: 0;
  }
  10% {
    transform: translate(-8px, 2px);
    opacity: 0.9;
  }
  10.5% {
    transform: translate(-6px, -3px);
    opacity: 0.8;
  }
  11% {
    transform: translate(0);
    opacity: 0;
  }
  60% {
    transform: translate(0);
    opacity: 0;
  }
  60.5% {
    transform: translate(-7px, 3px);
    opacity: 1;
  }
  61% {
    transform: translate(0);
    opacity: 0;
  }
}

@keyframes enhanced-glitch-2 {
  0%,
  98%,
  100% {
    transform: translate(0);
    opacity: 0;
  }
  10.2% {
    transform: translate(6px, -2px);
    opacity: 0.9;
  }
  10.7% {
    transform: translate(8px, 4px);
    opacity: 0.7;
  }
  11.2% {
    transform: translate(0);
    opacity: 0;
  }
  60.2% {
    transform: translate(0);
    opacity: 0;
  }
  60.7% {
    transform: translate(7px, -1px);
    opacity: 1;
  }
  61.2% {
    transform: translate(0);
    opacity: 0;
  }
}

/* Add a subtle screen-tear effect for extra cyberpunk feel */
@media (prefers-reduced-motion: no-preference) {
  .glitch-text {
    animation: screen-tear 20s infinite;
  }

  @keyframes screen-tear {
    0%,
    99%,
    100% {
      filter: none;
    }
    10.1% {
      filter: blur(0.5px) brightness(1.2);
    }
    10.3% {
      filter: none;
    }
    60.1% {
      filter: none;
    }
    60.3% {
      filter: blur(0.3px) contrast(1.1);
    }
    60.5% {
      filter: none;
    }
  }
}

.logo {
  background-image: url("/sin-check-logo.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 50dvh;
  flex-grow: 1;
}

.navigation-buttons {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  width: 100%;
  height: 5dvh;
}

.navigation-buttons .navigation-button {
  padding: 0px 10px;
  font-size: 1em;
  background: rgba(16, 1, 44, 0.8);
  border: 1px solid #ff1493;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
}

.navigation-buttons .navigation-button:hover {
  background-color: rgba(106, 183, 255, 0.8);
  box-shadow: 0 0 15px rgba(106, 183, 255, 0.4);
}

/* SIN Check View Specific Styles */
.sin-check-view .id-card-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  aspect-ratio: 4/2;
}

@media (orientation: landscape) {
  .sin-check-view .id-card-container {
    height: 100%;
  }
}

@media (orientation: portrait) {
  .sin-check-view .id-card-container {
    height: calc(95dvh - 5dvh - 10px * 2);
    max-width: 100%;
  }
}

.create-sin-view .create-sin-heading {
  font-size: 2em;
}

/* Create SIN View Specific Styles */
.create-sin-view .sin-form-section {
  width: 100%;
  height: 100%;
  flex-shrink: 1;
  max-width: 600px; /* Max width for the form */
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border: 1px solid #4a9eff;
  border-radius: 8px;
  background: rgba(26, 35, 50, 0.7);
  backdrop-filter: blur(10px);
}
</style>
