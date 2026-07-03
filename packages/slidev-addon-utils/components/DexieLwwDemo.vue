<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import RoughSvg from './RoughSvg.vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import RoughLine from './RoughLine.vue'

const { roughness = 1.2, seed = 960 } = defineProps<{
  roughness?: number
  seed?: number
}>()

// --- Click-driven state ---
const { $clicksContext } = useSlideContext()
const clicks = computed(() => $clicksContext.current)

// Click 0: Both devices offline, same todo everywhere
// Click 1: Device A renames the todo (title)
// Click 2: Device B renames it too - SAME field
// Click 3: Reconnect - two update ops for the same field
// Click 4: Last write wins - the earlier op is discarded

const aEdited = computed(() => clicks.value >= 1)
const bEdited = computed(() => clicks.value >= 2)
const syncing = computed(() => clicks.value >= 3)
const resolved = computed(() => clicks.value >= 4)

const titleA = computed(() => aEdited.value ? '"Buy oat milk"' : '"Buy milk"')
const titleB = computed(() => bEdited.value ? '"Buy almond milk"' : '"Buy milk"')
const serverTitle = computed(() => resolved.value ? '"Buy almond milk"' : '"Buy milk"')

const opA = '{ title: "Buy oat milk" }'
const opB = '{ title: "Buy almond milk" }'

const stepLabel = computed(() => {
  if (resolved.value) return 'Last write wins - the earlier one is lost'
  if (syncing.value) return 'Reconnect - two ops for the SAME field'
  if (bEdited.value) return 'Device B renames it too - same field!'
  if (aEdited.value) return 'Device A renames the todo'
  return 'Both devices offline - same todo'
})

// --- Layout constants ---
const svgW = 760
const svgH = 386

const devW = 230
const devH = 132
const devY = 8
const devAx = 24
const devBx = svgW - devW - 24

// Object card inside device
const cardW = 198
const cardH = 70
const cardOffX = (devW - cardW) / 2
const cardY = devY + 38
const row1Off = 26
const row2Off = 52

// Update-op chip under each device
const chipW = 220
const chipH = 26
const chipY = devY + devH + 18
const chipAx = devAx + (devW - chipW) / 2
const chipBx = devBx + (devW - chipW) / 2

// Server box
const srvW = 300
const srvH = 116
const srvX = (svgW - srvW) / 2
const srvY = 222
const srvCardX = srvX + (srvW - cardW) / 2
const srvCardY = srvY + 34
</script>

<template>
  <div class="lww-demo">
    <!-- Status bar -->
    <div class="controls">
      <div class="step-indicator">
        <span class="step-label">{{ stepLabel }}</span>
      </div>
      <div
        class="status"
        :class="resolved ? 'status--resolved' : syncing ? 'status--conflict' : 'status--offline'"
      >
        {{ resolved ? 'Resolved' : syncing ? 'Conflict!' : 'Offline' }}
      </div>
    </div>

    <RoughSvg :width="svgW" :height="svgH" :roughness="roughness" :seed="seed" :padding="16">
      <!-- ===== DEVICE A ===== -->
      <RoughRect
        :x="devAx" :y="devY" :width="devW" :height="devH"
        variant="default"
        :seed="seed + 1"
      />
      <text :x="devAx + devW / 2" :y="devY + 26" class="label-title" text-anchor="middle">DEVICE A</text>

      <!-- Object card A -->
      <RoughRect
        :x="devAx + cardOffX" :y="cardY" :width="cardW" :height="cardH"
        variant="muted"
        :seed="seed + 3"
      />
      <g v-if="aEdited" class="fade-in">
        <RoughRect
          :x="devAx + cardOffX + 6" :y="cardY + row1Off - 15" :width="cardW - 12" :height="21"
          stroke="rgba(255, 107, 237, 0.6)" fill="rgba(255, 107, 237, 0.1)"
          :stroke-width="1.5" :seed="seed + 7"
        />
      </g>
      <text :x="devAx + cardOffX + 14" :y="cardY + row1Off" class="field-row" :class="{ 'field-row--a': aEdited }">
        title: {{ titleA }}
      </text>
      <text :x="devAx + cardOffX + 14" :y="cardY + row2Off" class="field-row">
        completed: false
      </text>

      <!-- Tracked op chip A -->
      <g v-if="aEdited" class="fade-in">
        <RoughRect
          :x="chipAx" :y="chipY" :width="chipW" :height="chipH"
          stroke="rgba(255, 107, 237, 0.7)" fill="rgba(255, 107, 237, 0.06)"
          :stroke-width="1.5" stroke-dasharray="5 4" :seed="seed + 8"
        />
        <text v-if="!resolved" :x="chipAx + chipW / 2" :y="chipY - 7" class="chip-caption chip-caption--a" text-anchor="middle">update op · 14:02</text>
        <text v-else :x="chipAx + chipW / 2" :y="chipY - 7" class="chip-caption chip-caption--lost" text-anchor="middle">earlier write · lost</text>
        <text :x="chipAx + chipW / 2" :y="chipY + 17" class="chip-text" text-anchor="middle">{{ opA }}</text>
      </g>
      <!-- Strikethrough on the losing op -->
      <g v-if="resolved" class="fade-in">
        <RoughLine
          :x1="chipAx - 4" :y1="chipY + chipH / 2 + 4"
          :x2="chipAx + chipW + 4" :y2="chipY + chipH / 2 - 4"
          stroke="rgba(248, 113, 113, 0.85)" :stroke-width="2.5" :seed="seed + 14"
        />
      </g>

      <!-- ===== DEVICE B ===== -->
      <RoughRect
        :x="devBx" :y="devY" :width="devW" :height="devH"
        variant="default"
        :seed="seed + 2"
      />
      <text :x="devBx + devW / 2" :y="devY + 26" class="label-title" text-anchor="middle">DEVICE B</text>

      <!-- Object card B -->
      <RoughRect
        :x="devBx + cardOffX" :y="cardY" :width="cardW" :height="cardH"
        variant="muted"
        :seed="seed + 4"
      />
      <g v-if="bEdited" class="fade-in">
        <RoughRect
          :x="devBx + cardOffX + 6" :y="cardY + row1Off - 15" :width="cardW - 12" :height="21"
          stroke="rgba(52, 211, 153, 0.6)" fill="rgba(52, 211, 153, 0.1)"
          :stroke-width="1.5" :seed="seed + 9"
        />
      </g>
      <text :x="devBx + cardOffX + 14" :y="cardY + row1Off" class="field-row" :class="{ 'field-row--b': bEdited }">
        title: {{ titleB }}
      </text>
      <text :x="devBx + cardOffX + 14" :y="cardY + row2Off" class="field-row">
        completed: false
      </text>

      <!-- Tracked op chip B -->
      <g v-if="bEdited" class="fade-in">
        <RoughRect
          :x="chipBx" :y="chipY" :width="chipW" :height="chipH"
          stroke="rgba(52, 211, 153, 0.7)" fill="rgba(52, 211, 153, 0.06)"
          :stroke-width="1.5" stroke-dasharray="5 4" :seed="seed + 10"
        />
        <text v-if="!resolved" :x="chipBx + chipW / 2" :y="chipY - 7" class="chip-caption chip-caption--b" text-anchor="middle">update op · 14:07</text>
        <text v-else :x="chipBx + chipW / 2" :y="chipY - 7" class="chip-caption chip-caption--b" text-anchor="middle">latest write · wins</text>
        <text :x="chipBx + chipW / 2" :y="chipY + 17" class="chip-text" text-anchor="middle">{{ opB }}</text>
      </g>

      <!-- ===== SYNC ARROWS ===== -->
      <g v-if="syncing" class="fade-in">
        <RoughArrow
          :x1="chipAx + chipW / 2" :y1="chipY + chipH + 6"
          :x2="srvX + 70" :y2="srvY - 6"
          stroke="rgba(255, 107, 237, 0.6)" :seed="seed + 20"
        />
        <RoughArrow
          :x1="chipBx + chipW / 2" :y1="chipY + chipH + 6"
          :x2="srvX + srvW - 70" :y2="srvY - 6"
          stroke="rgba(52, 211, 153, 0.6)" :seed="seed + 21"
        />
      </g>

      <!-- ===== SERVER ===== -->
      <RoughRect
        :x="srvX" :y="srvY" :width="srvW" :height="srvH"
        :variant="syncing && !resolved ? 'danger' : 'accent'"
        :seed="seed + 5"
      />
      <text :x="srvX + srvW / 2" :y="srvY + 24" class="label-title" text-anchor="middle">DEXIE CLOUD</text>

      <!-- Server object card -->
      <RoughRect
        :x="srvCardX" :y="srvCardY" :width="cardW" :height="cardH"
        variant="muted"
        :seed="seed + 6"
      />
      <g v-if="resolved" class="fade-in">
        <RoughRect
          :x="srvCardX + 6" :y="srvCardY + row1Off - 15" :width="cardW - 12" :height="21"
          stroke="rgba(52, 211, 153, 0.6)" fill="rgba(52, 211, 153, 0.1)"
          :stroke-width="1.5" :seed="seed + 11"
        />
      </g>
      <text :x="srvCardX + 14" :y="srvCardY + row1Off" class="field-row" :class="{ 'field-row--b': resolved }">
        title: {{ serverTitle }}
      </text>
      <text :x="srvCardX + 14" :y="srvCardY + row2Off" class="field-row">
        completed: false
      </text>

      <!-- ===== TAGLINE ===== -->
      <foreignObject v-if="resolved" :x="svgW / 2 - 330" :y="srvY + srvH + 8" width="660" height="30">
        <div class="tagline fade-in">
          Same field: the <strong>later timestamp wins</strong> - one intent is lost. And <strong>deletes always beat updates</strong>.
        </div>
      </foreignObject>
    </RoughSvg>
  </div>
</template>

<style scoped>
.lww-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* ---- Controls bar ---- */
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-label {
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(234, 237, 243, 0.7);
}

.status {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 4px;
}

.status--offline {
  color: rgba(248, 113, 113, 0.9);
  background: rgba(248, 113, 113, 0.1);
}

.status--conflict {
  color: rgba(248, 113, 113, 0.95);
  background: rgba(248, 113, 113, 0.15);
}

.status--resolved {
  color: rgba(255, 107, 237, 0.9);
  background: rgba(255, 107, 237, 0.1);
}

/* ---- SVG text ---- */
.label-title {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.field-row {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  fill: rgba(234, 237, 243, 0.75);
}

.field-row--a {
  fill: rgba(255, 107, 237, 0.95);
  font-weight: 600;
}

.field-row--b {
  fill: rgba(52, 211, 153, 0.95);
  font-weight: 600;
}

.chip-caption {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chip-caption--a {
  fill: rgba(255, 107, 237, 0.7);
}

.chip-caption--b {
  fill: rgba(52, 211, 153, 0.7);
}

.chip-caption--lost {
  fill: rgba(248, 113, 113, 0.85);
}

.chip-text {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  fill: rgba(234, 237, 243, 0.85);
}

/* ---- Tagline ---- */
.tagline {
  text-align: center;
  font-family: 'Geist', sans-serif;
  font-size: 15px;
  color: rgba(234, 237, 243, 0.8);
  line-height: 1.5;
}

.tagline strong {
  color: rgba(255, 107, 237, 0.95);
}

/* ---- Animations ---- */
.fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
