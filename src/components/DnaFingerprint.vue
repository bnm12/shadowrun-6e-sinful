<template>
  <div class="dna-fingerprint">
    <div class="gel-container">
      <div class="gel-grid">
        <div
          v-for="(lane, index) in bandedLanes"
          :key="`lane-${index}`"
          class="lane"
        >
          <div class="lane-label">{{ index === 0 ? "M" : `L${index}` }}</div>
          <div
            v-for="(band, bandIndex) in lane.bands"
            :key="`band-${index}-${bandIndex}`"
            class="band"
            :class="`band-size-${band.size}`"
            :style="{
              top: `${band.position}%`,
              opacity: band.intensity,
              animationDelay: `${band.animationDelay}ms`,
            }"
          />
        </div>
      </div>

      <!-- Scanning effect overlay -->
      <div class="scan-overlay" :style="{ animationDelay: `${scanDelay}ms` }" />

      <!-- Background gel texture -->
      <div class="gel-texture" />
    </div>

    <!-- Info display -->
    <div class="dna-info">
      <div class="info-item">
        <span class="label">Pattern:</span>
        <span class="value">{{ patternId }}</span>
      </div>
      <div class="info-item">
        <span class="label">Bands:</span>
        <span class="value">{{ totalBands }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Rand from "rand-seed";

interface Band {
  position: number;
  intensity: number;
  size: number;
  animationDelay: number;
}

interface Lane {
  bands: Band[];
}

interface Props {
  seed?: string;
  lanes?: number;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  seed: "12345",
  lanes: 6,
  animated: true,
});

const random = new Rand(props.seed);
const scanDelay = ref(0);

// Generate lanes with bands
const bandedLanes = computed((): Lane[] => {
  // Reset random with original seed for consistent generation
  const seededRandom = new Rand(props.seed);

  return Array.from({ length: props.lanes }, (_, __) => {
    const numBands = Math.floor(seededRandom.next() * 8) + 4; // 4-11 bands per lane
    const bands: Band[] = [];

    for (let i = 0; i < numBands; i++) {
      const position = seededRandom.next() * 85 + 5; // 5-90% down the lane
      const intensity = seededRandom.next() * 0.4 + 0.6; // 0.6-1.0 opacity
      const size = Math.floor(seededRandom.next() * 8) + 1; // 1-8 size categories
      const animationDelay = seededRandom.next() * 2000; // 0-2s delay

      bands.push({
        position,
        intensity,
        size,
        animationDelay,
      });
    }

    // Sort bands by position for realistic appearance
    return { bands: bands.sort((a, b) => a.position - b.position) };
  });
});

// Computed properties for display
const patternId = computed(() => {
  const seededRandom = new Rand(props.seed);
  return Array.from({ length: 4 }, () =>
    Math.floor(seededRandom.next() * 16)
      .toString(16)
      .toUpperCase()
  ).join("");
});

const totalBands = computed(() =>
  bandedLanes.value.reduce((sum, lane) => sum + lane.bands.length, 0)
);

onMounted(() => {
  // Randomize scan animation start time
  scanDelay.value = random.next() * 1000;
});
</script>

<style scoped>
.dna-fingerprint {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: "Courier New", monospace;
  color: #00ffff;
  gap: 8px;
}

.gel-container {
  flex: 1;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border-radius: 6px;
  padding: 8px;
  position: relative;
  overflow: hidden;
  border: 1px solid #333;
}

.gel-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(lanes), 1fr);
  gap: 4px;
  height: 100%;
  position: relative;
  z-index: 2;
}

.lane {
  background: linear-gradient(180deg, #111 0%, #000 100%);
  border-radius: 3px;
  position: relative;
  border: 1px solid #222;
  min-height: 120px;
}

.lane-label {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7em;
  color: #00ffff;
  font-weight: bold;
  z-index: 3;
}

.band {
  position: absolute;
  left: 2px;
  right: 2px;
  height: 2px;
  border-radius: 1px;
  transition: all 0.3s ease;
  animation: bandPulse 3s ease-in-out infinite;
}

.band:hover {
  height: 3px;
  transform: scaleX(1.05);
}

/* Band size colors - smaller fragments migrate further */
.band-size-1 {
  background: #ff0040;
  box-shadow: 0 0 4px rgba(255, 0, 64, 0.6);
}
.band-size-2 {
  background: #ff4000;
  box-shadow: 0 0 4px rgba(255, 64, 0, 0.6);
}
.band-size-3 {
  background: #ff8000;
  box-shadow: 0 0 4px rgba(255, 128, 0, 0.6);
}
.band-size-4 {
  background: #ffff00;
  box-shadow: 0 0 4px rgba(255, 255, 0, 0.6);
}
.band-size-5 {
  background: #80ff00;
  box-shadow: 0 0 4px rgba(128, 255, 0, 0.6);
}
.band-size-6 {
  background: #00ff80;
  box-shadow: 0 0 4px rgba(0, 255, 128, 0.6);
}
.band-size-7 {
  background: #00ffff;
  box-shadow: 0 0 4px rgba(0, 255, 255, 0.6);
}
.band-size-8 {
  background: #0080ff;
  box-shadow: 0 0 4px rgba(0, 128, 255, 0.6);
}

@keyframes bandPulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.gel-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(0, 255, 255, 0.02) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 60%,
      rgba(0, 255, 255, 0.02) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 80%,
      rgba(0, 255, 255, 0.02) 0%,
      transparent 50%
    );
  z-index: 1;
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 255, 0.4),
    rgba(255, 0, 255, 0.4),
    rgba(0, 255, 255, 0.4),
    transparent
  );
  animation: scanning 4s linear infinite;
  z-index: 3;
  border-radius: 2px;
}

@keyframes scanning {
  0% {
    top: -3px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

.dna-info {
  display: flex;
  gap: 12px;
  font-size: 0.7em;
  padding: 4px 0;
}

.info-item {
  display: flex;
  gap: 4px;
  align-items: center;
}

.label {
  color: #4a9eff;
  font-weight: bold;
}

.value {
  color: #00ffff;
  font-family: "Courier New", monospace;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gel-grid {
    gap: 2px;
  }

  .lane {
    min-height: 80px;
  }

  .band {
    height: 1.5px;
  }

  .dna-info {
    font-size: 0.6em;
  }
}
</style>
