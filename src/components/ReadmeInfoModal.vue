<script setup lang="ts">
import { useReadme } from "../composables/useReadme";

// defineProps<{
//   currentView: "landing" | "sin-check" | "create-sin";
// }>(); // No longer needed

const { showReadmeModal, readmeHtmlContent, toggleReadmeModal } = useReadme();
</script>

<template>
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
</template>

<style scoped>
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
</style>
