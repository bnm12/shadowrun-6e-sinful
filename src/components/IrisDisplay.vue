<template>
  <div class="iris-container">
    <svg viewBox="0 0 200 240" class="iris-svg">
      <defs>
        <!-- Glow effect for ridges -->
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#irisGradient)" />

      <!-- Iris ridges -->
      <g class="iris-ridges" filter="url(#glow)">
        <path
          v-for="(ridge, index) in ridges"
          :key="`ridge-${index}`"
          :d="ridge.path"
          :stroke="ridge.color"
          :stroke-width="ridge.width"
          fill="none"
          :opacity="ridge.opacity"
          class="ridge-line"
        />
      </g>

      <!-- Match points -->
      <g class="match-points">
        <circle
          v-for="(point, index) in matchPoints"
          :key="`match-${index}`"
          :cx="point.x"
          :cy="point.y"
          :r="point.radius"
          :fill="point.color"
          :opacity="point.opacity"
          class="match-circle"
        >
          <animate
            attributeName="opacity"
            :values="
              point.opacity + ';' + point.opacity * 0.3 + ';' + point.opacity
            "
            dur="2s"
            repeatCount="indefinite"
            :begin="index * 0.2 + 's'"
          />
        </circle>

        <!-- Match point centers -->
        <circle
          v-for="(point, index) in matchPoints"
          :key="`match-center-${index}`"
          :cx="point.x"
          :cy="point.y"
          :r="1"
          fill="#00ffff"
          opacity="0.9"
          class="match-center"
        />
      </g>

      <!-- Scan lines overlay -->
      <g class="scan-overlay" opacity="0.3">
        <line
          v-for="(line, index) in scanLines"
          :key="`scan-${index}`"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          stroke="#ff1493"
          stroke-width="0.5"
          :opacity="line.opacity"
        />
      </g>
    </svg>

    <!-- Info overlay -->
    <div class="iris-info">
      <div class="match-count">{{ matchPoints.length }} MATCHES</div>
      <div class="quality-indicator">QUALITY: {{ qualityPercentage }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Rand from "rand-seed";

interface IrisProps {
  seed?: string;
}

const props = withDefaults(defineProps<IrisProps>(), {
  seed: "default-seed",
});

const rng = computed(() => new Rand(props.seed));

const matchCount = computed(() => rng.value.next() * 30 + 5); // Random match count between 5 and 25

// Generate iris ridges
const ridges = computed(() => {
  const ridgeData = [];
  const centerX = 100;
  const centerY = 120;

  // Generate concentric ridges with realistic iris patterns
  for (let i = 0; i < 25; i++) {
    const baseRadius = 15 + i * 6;
    const points = [];

    // Create wavy, organic ridge lines
    for (let angle = 0; angle <= 360; angle += 8) {
      const rad = (angle * Math.PI) / 180;
      const noise = (rng.value.next() - 0.5) * 8; // Random variation
      const radius = baseRadius + noise + Math.sin(rad * 3) * 3;

      const x = centerX + Math.cos(rad) * radius;
      const y = centerY + Math.sin(rad) * radius * 0.85; // Slightly oval

      points.push({ x, y });
    }

    // Create SVG path
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let j = 1; j < points.length; j++) {
      const cp1x = points[j - 1].x + (points[j].x - points[j - 1].x) * 0.5;
      const cp1y = points[j - 1].y + (points[j].y - points[j - 1].y) * 0.5;
      path += ` Q ${cp1x} ${cp1y} ${points[j].x} ${points[j].y}`;
    }
    path += " Z";

    ridgeData.push({
      path,
      color: `rgba(0, 255, 255, ${0.4 + rng.value.next() * 0.3})`,
      width: 0.8 + rng.value.next() * 0.4,
      opacity: 0.6 + rng.value.next() * 0.4,
    });
  }

  return ridgeData;
});

// Generate match points
const matchPoints = computed(() => {
  const points = [];
  const centerX = 100;
  const centerY = 120;

  for (let i = 0; i < matchCount.value; i++) {
    const angle = rng.value.next() * Math.PI * 2;
    const distance = 20 + rng.value.next() * 60;

    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance * 0.85;

    points.push({
      x,
      y,
      radius: 4 + rng.value.next() * 3,
      color: `rgba(255, 20, 147, ${0.5 + rng.value.next() * 0.3})`,
      opacity: 0.7 + rng.value.next() * 0.3,
    });
  }

  return points;
});

// Generate scan lines for cyberpunk effect
const scanLines = computed(() => {
  const lines = [];

  for (let i = 0; i < 12; i++) {
    const y = 20 + i * 18;
    lines.push({
      x1: 10 + rng.value.next() * 20,
      y1: y,
      x2: 170 + rng.value.next() * 20,
      y2: y + (rng.value.next() - 0.5) * 4,
      opacity: 0.1 + rng.value.next() * 0.2,
    });
  }

  return lines;
});

// Calculate quality percentage based on match count and seed
const qualityPercentage = computed(() => {
  const baseQuality = Math.min(matchCount.value * 8, 85);
  const seedVariation = Math.floor(rng.value.next() * 15);
  return Math.max(45, Math.min(99, baseQuality + seedVariation));
});
</script>

<style scoped>
.iris-container {
  position: relative;
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  background: linear-gradient(
    135deg,
    rgba(26, 35, 50, 0.8) 0%,
    rgba(42, 56, 71, 0.8) 100%
  );
  box-shadow:
    0 0 10px rgba(0, 255, 255, 0.2),
    inset 0 0 10px rgba(0, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  padding: 5px;
  gap: 5px;
  height: 100%;
}

.iris-svg {
  height: 100%;
}

.ridge-line {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.match-circle {
  filter: drop-shadow(0 0 2px rgba(255, 20, 147, 0.5));
}

.match-center {
  filter: drop-shadow(0 0 1px rgba(0, 255, 255, 0.8));
}

.iris-info {
  display: flex;
  justify-content: space-between;
  font-family: monospace;
  font-size: 0.6em;
  color: #00ffff;
  text-shadow: 0 0 2px rgba(0, 255, 255, 0.5);
}

.match-count {
  color: #ff1493;
  font-weight: bold;
}

.quality-indicator {
  color: #4a9eff;
}
</style>
