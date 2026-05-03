<template>
  <div class="ps-root">

    <div v-if="loading" class="ps-loading">
      <span class="ps-loading-dot"></span>
      <span class="ps-loading-dot"></span>
      <span class="ps-loading-dot"></span>
    </div>

    <template v-else>
      <!-- ── Job Tabs ── -->
      <div class="ps-tabs-wrap">
        <div class="ps-tabs">
          <button
              v-for="job in skillsData" :key="job.job"
              class="ps-tab"
              :class="{ active: selectedJob === job.job }"
              @click="selectedJob = job.job"
          >
            <img
                :src="`/images/profession/skills/${job.job}.png`" :alt="job.job"
                class="ps-tab-icon"
                @error="(e) => e.target.style.display='none'"
            />
            <span class="ps-tab-label">{{ job.job }}</span>
          </button>
        </div>
      </div>

      <!-- ── Skill Groups ── -->
      <div v-if="currentJob" class="ps-content">
        <div class="ps-groups-row">
          <div v-for="(group, gi) in currentJob.groups" :key="gi" class="ps-group">

            <div class="ps-group-header">
            <span class="ps-group-title">
              {{ groupBaseName(group.title) }} - 技能點 ({{ groupAllocated(group) }}/{{ groupMaxPts(group.title) }})
            </span>
            </div>

            <!-- 固定 7×6 grid，不足補空格 -->
            <div class="ps-grid">
              <div
                  v-for="(cell, idx) in paddedRows(group)"
                  :key="idx"
                  class="ps-cell"
                  :class="{
                'ps-cell--filled': !cell.empty && (allocatedPoints[cell.img] ?? Number(cell.point)) > 0,
                'ps-cell--empty':   cell.empty,
                'ps-cell--active':  activeSkill?.img === cell.img,
                'ps-cell--maxed':   !cell.empty && (allocatedPoints[cell.img] ?? Number(cell.point)) >= (skillMeta[cell.img]?.maxLv ?? 1)
                  && (allocatedPoints[cell.img] ?? Number(cell.point)) > 0,
              }"
                  @click="!cell.empty && openModal(cell)"
                  @mouseenter="!cell.empty && showTooltip($event, cell)"
                  @mouseleave="hideTooltip"
              >
                <template v-if="!cell.empty">
                  <img
                      :src="`/images/profession/skills/${cell.img}.png`"
                      :alt="cell.name" class="ps-icon"
                      @error="(e) => e.target.src='/images/profession/skills/no_skill.png'"
                  />
                  <div class="ps-skill-name">{{ cell.name }}</div>
                  <div
                      class="ps-badge"
                      :class="{
                    'ps-badge--on':    (allocatedPoints[cell.img] ?? Number(cell.point)) > 0,
                    'ps-badge--maxed': (allocatedPoints[cell.img] ?? Number(cell.point)) >= (skillMeta[cell.img]?.maxLv ?? 1)
                      && (allocatedPoints[cell.img] ?? Number(cell.point)) > 0
                  }"
                  >
                    {{ allocatedPoints[cell.img] ?? cell.point }}
                  </div>
                </template>
              </div>
            </div>

          </div>
        </div>
      </div>
    </template>

    <!-- ── Tooltip ── -->
    <teleport to="body">
      <div v-if="tooltip.visible" class="ps-tooltip"
           :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
           v-html="tooltip.html">
      </div>
    </teleport>

    <!-- ── Modal ── -->
    <teleport to="body">
      <div v-if="modal.visible" class="ps-overlay" @click.self="closeModal">
        <div class="ps-modal">
          <button class="ps-modal-close" @click="closeModal">✕</button>
          <div class="ps-modal-body" v-html="modal.html"></div>
          <div class="ps-modal-footer">
            <button class="ps-btn ps-btn--minus" @click="adjustPoint(-1)" :disabled="currentPoint <= 0">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 8h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </button>
            <div class="ps-point-pill">
              <span class="ps-point-cur">{{ currentPoint }}</span>
              <span class="ps-point-sep">/</span>
              <span class="ps-point-max">{{ modal.maxLv }}</span>
            </div>
            <button class="ps-btn ps-btn--plus" @click="adjustPoint(1)" :disabled="currentPoint >= modal.maxLv">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

// ── Data ──────────────────────────────────────────────
const skillsData = ref([])
const skillMeta  = ref({})
const prereqMap  = ref({})
const loading    = ref(true)

onMounted(async () => {
  const [gridRes, metaRes, prereqRes] = await Promise.all([
    fetch('/data/profession-skills-grid.json'),
    fetch('/data/profession-skills-meta.json'),
    fetch('/data/profession-skills-prereq.json'),
  ])
  skillsData.value = await gridRes.json()
  skillMeta.value  = await metaRes.json()
  prereqMap.value  = await prereqRes.json()
  selectedJob.value = skillsData.value[0]?.job ?? ''
  loading.value = false
})

// ── Job ───────────────────────────────────────────────
const selectedJob = ref('')
const currentJob  = computed(() => skillsData.value.find(j => j.job === selectedJob.value))

// ── Points ────────────────────────────────────────────
const allocatedPoints = reactive({})

// 將 group.rows 攤平並補足至固定 7×6 = 42 格
const COLS = 7
const ROWS = 6
const EMPTY_CELL = { empty: true, img: '', name: '', point: '0', skid: null }

function paddedRows(group) {
  const flat = group.rows.flatMap(r => r)
  const total = COLS * ROWS
  while (flat.length < total) flat.push({ ...EMPTY_CELL })
  return flat.slice(0, total)
}

// 從 title "職業 - 技能點 (1/70)" 取出職業名稱
function groupBaseName(title) {
  return title.replace(/\s*-\s*技能點.*$/, '').trim()
}

// 從 title 取出最大技能點數
function groupMaxPts(title) {
  const m = title.match(/\((\d+)\/(\d+)\)/)
  return m ? parseInt(m[2]) : '?'
}

function groupAllocated(group) {
  let total = 0
  for (const row of group.rows)
    for (const cell of row)
      if (!cell.empty) total += allocatedPoints[cell.img] ?? 0
  return total
}

// ── Tooltip ───────────────────────────────────────────
const tooltip = reactive({ visible: false, x: 0, y: 0, html: '' })

function buildHtml(cell) {
  return skillMeta.value[cell.img]?.desc ?? `<strong>${cell.name}</strong>`
}

function showTooltip(e, cell) {
  tooltip.html    = buildHtml(cell)
  tooltip.visible = true
  placeTooltip(e)
}
function placeTooltip(e) {
  let x = e.clientX + 16, y = e.clientY + 10
  if (x + 340 > window.innerWidth)  x = e.clientX - 340
  if (y + 260 > window.innerHeight) y = e.clientY - 260
  tooltip.x = x + window.scrollX
  tooltip.y = y + window.scrollY
}
function hideTooltip() { tooltip.visible = false }

// ── Modal ─────────────────────────────────────────────
const modal       = reactive({ visible: false, img: '', maxLv: 1, html: '' })
const activeSkill = ref(null)
const currentPoint = computed(() => allocatedPoints[modal.img] ?? 0)

function openModal(cell) {
  activeSkill.value = cell
  modal.img    = cell.img
  modal.maxLv  = skillMeta.value[cell.img]?.maxLv ?? 1
  modal.html   = buildHtml(cell)
  modal.visible = true
  hideTooltip()
}
function closeModal() { modal.visible = false; activeSkill.value = null }
// 遞迴滿足前置：要讓 img 達到 targetLv，先確保其所有前置達到要求等級
function ensurePrereqs(img, targetLv) {
  if (targetLv <= 0) return
  const prereqs = prereqMap.value[img] ?? []
  for (const { img: pImg, lv: pLv } of prereqs) {
    const cur = allocatedPoints[pImg] ?? 0
    if (cur < pLv) {
      ensurePrereqs(pImg, pLv)          // 先滿足前置的前置
      allocatedPoints[pImg] = pLv
    }
  }
}

function adjustPoint(d) {
  const cur    = allocatedPoints[modal.img] ?? 0
  const next   = Math.max(0, Math.min(modal.maxLv, cur + d))
  if (d > 0 && next > cur) {
    ensurePrereqs(modal.img, next)      // 加點前自動補前置
  }
  allocatedPoints[modal.img] = next
}
</script>

<style scoped>
/* ── CSS Variables ── */
.ps-root {
  --c-bg:        #1a1410;
  --c-surface:   #231c14;
  --c-border:    #4a3820;
  --c-border-hi: #c8a050;
  --c-gold:      #e8c060;
  --c-gold-dim:  #9a7030;
  --c-text:      #d4b896;
  --c-text-dim:  #7a6040;
  --c-filled:    #2a1e08;
  --c-filled-bd: #c8902a;
  --c-maxed:     #0d1f0d;
  --c-maxed-bd:  #3a9a3a;
  --c-active-bd: #60a8f0;
  --cell-size:   90px;
  --radius:      6px;

  background: var(--c-bg);
  color: var(--c-text);
  padding: 12px 16px 16px;
  min-height: 100%;
  font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
}

/* ── Loading ── */
.ps-loading {
  display: flex; align-items: center; justify-content: center;
  gap: 8px; height: 120px;
}
.ps-loading-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--c-gold);
  animation: ps-pulse 1.2s ease-in-out infinite;
}
.ps-loading-dot:nth-child(2) { animation-delay: .2s; }
.ps-loading-dot:nth-child(3) { animation-delay: .4s; }
@keyframes ps-pulse {
  0%, 80%, 100% { opacity: .2; transform: scale(.8); }
  40%           { opacity: 1;  transform: scale(1.2); }
}

/* ── Tabs ── */
.ps-tabs-wrap {
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--c-border);
}
.ps-tabs {
  display: flex; flex-wrap: wrap; gap: 6px;
}
.ps-tab {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 12px;
  border: 1px solid var(--c-border);
  border-radius: 20px;
  background: var(--c-surface);
  color: var(--c-text-dim);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s;
}
.ps-tab:hover {
  border-color: var(--c-gold-dim);
  color: var(--c-text);
  background: #2e2210;
}
.ps-tab.active {
  border-color: var(--c-gold);
  color: var(--c-gold);
  background: #2e1e04;
  box-shadow: 0 0 10px rgba(200,160,80,0.2);
}
.ps-tab-icon {
  width: 18px; height: 18px; object-fit: contain;
  filter: grayscale(1) brightness(.7);
  transition: filter 0.18s;
}
.ps-tab.active .ps-tab-icon,
.ps-tab:hover  .ps-tab-icon { filter: none; }
.ps-tab-label { font-size: 13px; letter-spacing: .5px; }

/* ── Group ── */
.ps-groups-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}
.ps-group {
  margin-bottom: 0;
  flex-shrink: 0;
}

.ps-group-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
  padding: 7px 14px;
  background: linear-gradient(90deg, #2e2008 0%, #1a1410 100%);
  border: 1px solid var(--c-border);
  border-left: 3px solid var(--c-gold);
  border-radius: var(--radius);
}
.ps-group-title {
  font-size: 14px; font-weight: 700;
  color: var(--c-gold);
  letter-spacing: .5px;
}
.ps-group-count {
  font-size: 11px; color: var(--c-text-dim);
}
.ps-group-count em {
  font-style: normal; color: var(--c-gold-dim); font-weight: 700;
}

/* ── Grid ── */
.ps-grid {
  display: grid;
  grid-template-columns: repeat(7, var(--cell-size));
  grid-template-rows: repeat(6, var(--cell-size));
  gap: 5px;
}

/* ── Cell ── */
.ps-cell {
  position: relative;
  display: flex; flex-direction: column;
  align-items: center; justify-content: flex-start;
  padding: 6px 4px 4px;
  width: var(--cell-size);
  min-height: var(--cell-size);
  box-sizing: border-box;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s, transform 0.1s;
}
.ps-cell:not(.ps-cell--empty):hover {
  border-color: var(--c-border-hi);
  background: #2e2210;
  box-shadow: 0 0 0 1px rgba(200,160,80,0.3), 0 2px 8px rgba(0,0,0,0.4);
  transform: translateY(-1px);
  z-index: 1;
}
.ps-cell--filled {
  background: var(--c-filled);
  border-color: var(--c-filled-bd);
}
.ps-cell--filled:hover {
  border-color: #e0a840 !important;
  box-shadow: 0 0 0 1px rgba(200,144,42,0.4), 0 2px 10px rgba(0,0,0,0.5) !important;
}
.ps-cell--maxed {
  background: var(--c-maxed) !important;
  border-color: var(--c-maxed-bd) !important;
  box-shadow: 0 0 6px rgba(58,154,58,0.3);
}
.ps-cell--active {
  border-color: var(--c-active-bd) !important;
  box-shadow: 0 0 0 2px rgba(96,168,240,0.35) !important;
}
.ps-cell--empty {
  background: #151009;
  border-color: #2a1e0e;
  cursor: default;
  opacity: .5;
}

.ps-icon {
  width: 52px; height: 52px;
  object-fit: contain;
  image-rendering: pixelated;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.6));
}
.ps-cell--empty .ps-icon { display: none; }

.ps-skill-name {
  font-size: 11px;
  color: var(--c-text);
  text-align: center;
  margin-top: 4px;
  line-height: 1.3;
  word-break: break-all;
  opacity: .85;
}

.ps-badge {
  position: absolute;
  top: 3px; right: 3px;
  font-size: 11px; font-weight: 800;
  color: var(--c-text-dim);
  background: rgba(0,0,0,0.45);
  border-radius: 3px;
  padding: 0 4px;
  line-height: 16px;
  min-width: 16px;
  text-align: center;
}
.ps-badge--on    { color: var(--c-gold); background: rgba(40,24,0,0.7); }
.ps-badge--maxed { color: #6de06d;       background: rgba(0,20,0,0.7); }

/* ── RWD ── */

/* 平板以下：單欄 */
@media (max-width: 1199px) {
  .ps-groups-row {
    flex-direction: column;
    gap: 14px;
  }
}

/* 手機：格子用 1fr 自動縮放，不固定 px */
@media (max-width: 720px) {
  .ps-root {
    padding: 8px;
  }
  .ps-tab { padding: 4px 8px; }
  .ps-tab-label { font-size: 11px; }
  .ps-group-header { padding: 5px 8px; }
  .ps-group-title { font-size: 12px; }
  .ps-group-count { font-size: 10px; }
  /* Grid 自適應填滿寬度，高度鎖 1:1 */
  .ps-grid {
    grid-template-columns: repeat(7, 1fr) !important;
    grid-template-rows: none !important;
    grid-auto-rows: 1fr;
    width: 100%;
  }
  /* 讓格子保持正方形 */
  .ps-cell {
    width: auto !important;
    min-height: 0 !important;
    aspect-ratio: 1;
    padding: 3px 2px 2px;
  }
  .ps-icon { width: 55% !important; height: 55% !important; }
  .ps-skill-name { font-size: 8.5px; margin-top: 2px; }
  .ps-badge { font-size: 9px; padding: 0 2px; line-height: 13px; }
}
</style>

<!-- ── Global: Tooltip & Modal ── -->
<style>
.ps-tooltip {
  position: absolute; z-index: 9999;
  background: #1e160a;
  border: 1px solid #6a4e20;
  border-radius: 8px;
  padding: 12px 14px;
  max-width: 320px;
  font-size: 12px; line-height: 1.7;
  color: #d4b896;
  box-shadow: 0 6px 24px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(200,160,80,0.08);
  pointer-events: none;
}
.ps-tooltip br { display: block; }

/* ── Overlay ── */
.ps-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center;
}

/* ── Modal ── */
.ps-modal {
  position: relative;
  background: #1e160a;
  border: 1px solid #6a4e20;
  border-radius: 12px;
  width: 360px; max-width: 92vw;
  max-height: 80vh; overflow-y: auto;
  box-shadow: 0 16px 48px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(200,160,80,0.1);
  display: flex; flex-direction: column;
  animation: ps-modal-in .18s ease;
}
@keyframes ps-modal-in {
  from { opacity: 0; transform: scale(.94) translateY(8px); }
  to   { opacity: 1; transform: scale(1)   translateY(0); }
}
.ps-modal-close {
  position: absolute; top: 10px; right: 12px;
  background: none; border: none;
  color: #7a6040; font-size: 16px; cursor: pointer;
  line-height: 1; padding: 2px 4px;
  transition: color .15s;
}
.ps-modal-close:hover { color: #d4b896; }

.ps-modal-body {
  padding: 20px 20px 14px;
  font-size: 12.5px; line-height: 1.8; color: #d4b896;
  border-bottom: 1px solid #3a2810;
}
.ps-modal-body br { display: block; }

.ps-modal-footer {
  display: flex; align-items: center; justify-content: center;
  gap: 14px; padding: 14px 20px;
  flex-shrink: 0;
}

.ps-btn {
  width: 44px; height: 44px; border-radius: 8px;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700;
  transition: all .15s;
}
.ps-btn:disabled { opacity: .3; cursor: not-allowed; }

.ps-btn--minus {
  background: #2a0a0a; color: #e05050;
  border: 1px solid #6a1010;
}
.ps-btn--minus:hover:not(:disabled) {
  background: #3a1010; border-color: #e05050;
  box-shadow: 0 0 8px rgba(224,80,80,.3);
}
.ps-btn--plus {
  background: #0a2a0a; color: #40c040;
  border: 1px solid #106010;
}
.ps-btn--plus:hover:not(:disabled) {
  background: #103a10; border-color: #40c040;
  box-shadow: 0 0 8px rgba(64,192,64,.3);
}

.ps-point-pill {
  display: flex; align-items: baseline; gap: 3px;
  background: #0a0604;
  border: 1px solid #4a3010;
  border-radius: 8px;
  padding: 6px 14px;
  min-width: 80px;
  justify-content: center;
}
.ps-point-cur {
  font-size: 26px; font-weight: 900;
  color: #e8c060;
  line-height: 1;
}
.ps-point-sep { font-size: 14px; color: #6a4e20; margin: 0 1px; }
.ps-point-max { font-size: 14px; color: #9a7030; }
</style>