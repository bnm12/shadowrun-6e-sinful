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
          <div class="bands">
            <div
              v-for="(band, bandIndex) in lane.bands"
              :key="`band-${index}-${bandIndex}`"
              class="band"
              :class="`band-color-${band.color}`"
              :style="{
                top: `${band.position}%`,
                opacity: band.intensity,
                animationDelay: `${band.animationDelay}ms`,
              }"
            />
          </div>
        </div>
      </div>
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
import { computed } from "vue";
import Rand from "rand-seed";

interface Band {
  position: number;
  intensity: number;
  color: number;
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

// Generate lanes with bands
const bandedLanes = computed((): Lane[] => {
  // Reset random with original seed for consistent generation
  const seededRandom = new Rand(props.seed);

  return Array.from({ length: props.lanes }, (_, __) => {
    const laneRand = new Rand(seededRandom.next().toString());
    const numBands = Math.floor(laneRand.next() * 8) + 4; // 4-11 bands per lane
    const bands: Band[] = [];

    for (let i = 0; i < numBands; i++) {
      const bandRandom = new Rand(laneRand.next().toString());
      const position = bandRandom.next() * 85 + 5; // 5-90% down the lane
      const intensity = bandRandom.next() * 0.4 + 0.6; // 0.6-1.0 opacity
      const size = Math.floor(bandRandom.next() * 8) + 1; // 1-8 size categories
      const animationDelay = bandRandom.next() * 2000; // 0-2s delay

      bands.push({
        position,
        intensity,
        color: size,
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
  height: 100%;
  border-radius: 6px;
  padding: 5px;
  position: relative;
  overflow: hidden;
  border: 1px solid #333;
  display: flex;
}

.gel-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(lanes), 1fr);
  gap: 5px;
  height: 100%;
  position: relative;
  width: 100%;
}

.lane {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #111826 0%, #1e2b38 100%);
  border-radius: 3px;
  position: relative;
  gap: 5px;
}

.lane-label {
  font-size: 0.7em;
  color: #00ffff;
  font-weight: bold;
  border-bottom: 2px solid #222;
}

.bands {
  height: 100%;
  position: relative;
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
.band-color-1 {
  background: #ff0040;
  box-shadow: 0 0 4px rgba(255, 0, 64, 0.6);
}
.band-color-2 {
  background: #ff4000;
  box-shadow: 0 0 4px rgba(255, 64, 0, 0.6);
}
.band-color-3 {
  background: #ff8000;
  box-shadow: 0 0 4px rgba(255, 128, 0, 0.6);
}
.band-color-4 {
  background: #ffff00;
  box-shadow: 0 0 4px rgba(255, 255, 0, 0.6);
}
.band-color-5 {
  background: #80ff00;
  box-shadow: 0 0 4px rgba(128, 255, 0, 0.6);
}
.band-color-6 {
  background: #00ff80;
  box-shadow: 0 0 4px rgba(0, 255, 128, 0.6);
}
.band-color-7 {
  background: #00ffff;
  box-shadow: 0 0 4px rgba(0, 255, 255, 0.6);
}
.band-color-8 {
  background: #0080ff;
  box-shadow: 0 0 4px rgba(0, 128, 255, 0.6);
}

@keyframes bandPulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.dna-info {
  display: flex;
  gap: 10px;
  font-size: 0.7em;
  justify-content: center;
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
}
</style>
