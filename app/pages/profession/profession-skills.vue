<template>
  <div id="outer" class="ps-root">

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
            <div class="ps-tab-img-wrap">
              <img
                  v-if="validImgs.has(`__tab__${job.job}`)"
                  :src="`/images/profession/role/${job.job}.png`"
                  :alt="job.job"
                  class="ps-tab-img"
              />
              <div v-else class="ps-tab-img-placeholder"></div>
            </div>
            <span class="ps-tab-label">{{ job.job }}</span>
          </button>
        </div>
        <div class="ps-settings-bar">
          <label class="ps-toggle-wrap" @click="showTooltipSetting = !showTooltipSetting">
            <span class="ps-toggle-label">技能說明</span>
            <div class="ps-toggle" :class="{ on: showTooltipSetting }">
              <div class="ps-toggle-thumb"></div>
            </div>
          </label>
        </div>
      </div>

      <!-- ── Skill Groups ── -->
      <div v-if="currentJob" class="ps-content">
        <div class="ps-groups-row">
          <div v-for="(group, gi) in currentJob.groups" :key="gi" class="ps-group">

            <div class="ps-group-header">
              <span class="ps-group-title">
                {{ groupBaseName(group.title) }} - 技能點 (
                <template v-if="hoverSimCost && hoverSimCost.has(group)">
                  <span class="ps-sim-cur">{{ displayAllocated(group) + groupInitPts(group.title) }}</span>
                  <span class="ps-sim-arrow"> → </span>
                  <span class="ps-sim-next"
                        :class="{ 'ps-sim-next--over': displayAllocated(group) + groupInitPts(group.title) + (hoverSimCost.get(group) ?? 0) > groupMaxPts(group.title) }"
                  >{{ displayAllocated(group) + groupInitPts(group.title) + (hoverSimCost.get(group) ?? 0) }}</span>
                </template>
                <template v-else>{{ displayAllocated(group) + groupInitPts(group.title) }}</template>
                /{{ groupMaxPts(group.title) }})
              </span>
              <button class="ps-reset-btn" @click="resetGroup(group)" title="重置技能點">↺ 重置</button>
            </div>

            <!-- 7 欄 grid，自動列數 -->
            <div class="ps-grid">
              <div
                  v-for="(cell, idx) in paddedRows(group)"
                  :key="idx"
                  class="ps-cell"
                  :class="{
                'ps-cell--filled': !cell.empty && (allocatedPoints[skillKey(cell.img)] ?? 0) > 0,
                'ps-cell--empty':   cell.empty,
                'ps-cell--active':  activeSkill?.img === cell.img,
                'ps-cell--maxed':   !cell.empty && (allocatedPoints[skillKey(cell.img)] ?? 0) >= (skillMeta[cell.img]?.maxLv ?? 1)
                  && (allocatedPoints[skillKey(cell.img)] ?? 0) > 0,
                'ps-cell--default': !cell.empty && defaultKeys.has(skillKey(cell.img)),
                'ps-cell--prereq': !cell.empty && hoveredPrereqs.has(cell.img),
                'ps-cell--prereq-unmet': !cell.empty && hoveredPrereqs.has(cell.img) && (allocatedPoints[skillKey(cell.img)] ?? 0) < hoveredPrereqs.get(cell.img),
                'ps-cell--hovered': !cell.empty && hoverImg === cell.img && hoverGroup === group,
              }"
                  @click="!cell.empty && openModal(cell)"
                  @mouseenter="!cell.empty && showTooltip($event, cell, group)"
                  @mouseleave="hideTooltip"
                  @wheel.prevent="!cell.empty && !defaultKeys.has(skillKey(cell.img)) && onCellWheel($event, cell)"
              >
                <template v-if="!cell.empty">
                  <img
                      :src="skillImgSrc(cell.img)"
                      :alt="cell.name" class="ps-icon"
                  />
                  <div class="ps-skill-name">{{ cell.name }}</div>
                  <div v-if="hoveredPrereqs.has(cell.img)" class="ps-prereq-label"
                       :class="(allocatedPoints[skillKey(cell.img)] ?? 0) >= hoveredPrereqs.get(cell.img) ? 'ps-prereq-label--met' : 'ps-prereq-label--unmet'">
                    需 Lv{{ hoveredPrereqs.get(cell.img) }}
                  </div>
                  <div
                      class="ps-badge"
                      :class="{
                    'ps-badge--on':    (allocatedPoints[skillKey(cell.img)] ?? 0) > 0,
                    'ps-badge--maxed': (allocatedPoints[skillKey(cell.img)] ?? 0) >= (skillMeta[cell.img]?.maxLv ?? 1)
                      && (allocatedPoints[skillKey(cell.img)] ?? 0) > 0
                  }"
                  >
                    {{ allocatedPoints[skillKey(cell.img)] ?? cell.point }}
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
           ref="tooltipEl"
           :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
           v-html="tooltip.html">
      </div>
    </teleport>

    <!-- ── Modal ── -->
    <teleport to="body">
      <div v-if="modal.visible" class="ps-overlay" @click.self="closeModal">
        <div class="ps-modal" @wheel.prevent="onModalWheel">
          <button class="ps-modal-close" @click="closeModal">✕</button>
          <div class="ps-modal-body" v-html="modal.html"></div>
          <div class="ps-modal-footer" v-if="!modal.isDefault">
            <button class="ps-btn ps-btn--minus" @click="adjustPoint(-1)" :disabled="currentPoint <= 0">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 8h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </button>
            <div class="ps-point-pill">
              <span class="ps-point-cur">{{ currentPoint }}</span>
              <span class="ps-point-sep">/</span>
              <span class="ps-point-max">{{ modal.maxLv }}</span>
            </div>
            <button class="ps-btn ps-btn--plus" @click="adjustPoint(1)" :disabled="currentPoint >= modal.maxLv || isGroupFull">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </button>
            <button class="ps-btn ps-btn--max" @click="adjustToMax()" :disabled="currentPoint >= modal.maxLv || isGroupFull" title="升到滿級">MAX</button>
          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, nextTick } from 'vue'

// ── Data ──────────────────────────────────────────────
const skillsData = ref([])
const skillMeta  = ref({})
const prereqMap  = ref({})
const loading    = ref(true)
const validImgs  = reactive(new Set())   // 預先確認存在的圖片 key

const FALLBACK_IMG = '/images/profession/skills/no_skill.png'

function skillImgSrc(img) {
  return validImgs.has(img)
      ? `/images/profession/skills/${img}.png`
      : FALLBACK_IMG
}

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

  // 批次初始化所有預設點數，並記錄為 defaultKeys（不計入點數消耗）
  for (const job of skillsData.value) {
    for (const group of job.groups) {
      for (const row of group.rows) {
        for (const cell of row) {
          if (!cell.empty && cell.img) {
            const defaultPt = parseInt(cell.point) || 0
            if (defaultPt > 0) {
              const k = `${job.job}:${cell.img}`
              allocatedPoints[k] = defaultPt
              defaultKeys.add(k)
            }
          }
        }
      }
    }
  }

  // 批次 HEAD 請求確認圖片是否存在，不存在則用預設圖，避免 console 404
  const seen = new Set()
  const checks = []
  for (const job of skillsData.value) {
    // tab 圖示
    const tabKey = `__tab__${job.job}`
    checks.push(
        fetch(`/images/profession/role/${job.job}.png`, { method: 'HEAD' })
            .then(r => { if (r.ok) validImgs.add(tabKey) })
            .catch(() => {})
    )
    // 技能圖示
    for (const group of job.groups)
      for (const row of group.rows)
        for (const cell of row)
          if (!cell.empty && cell.img && !seen.has(cell.img)) {
            seen.add(cell.img)
            checks.push(
                fetch(`/images/profession/skills/${cell.img}.png`, { method: 'HEAD' })
                    .then(r => { if (r.ok) validImgs.add(cell.img) })
                    .catch(() => {})
            )
          }
  }
  await Promise.all(checks)

  loading.value = false
})

// ── Job ───────────────────────────────────────────────
const selectedJob = ref('')
const currentJob  = computed(() => skillsData.value.find(j => j.job === selectedJob.value))

// ── Points ────────────────────────────────────────────
const allocatedPoints = reactive({})
const defaultKeys = reactive(new Set())   // 預設有點的技能 key，不計入點數消耗

// 每個技能的 key 加上職業前綴，避免共用前置職業技能互相污染
function skillKey(img) {
  return `${selectedJob.value}:${img}`
}

// 將 group.rows 攤平，補足至最後一個有內容格子所在列的末尾
const COLS = 7
const ROWS = 6
const EMPTY_CELL = { empty: true, img: '', name: '', point: '0', skid: null }

function paddedRows(group) {
  const flat = group.rows.flatMap(r => r)
  // 找最後一個非空格的 index
  let lastFilled = -1
  for (let i = flat.length - 1; i >= 0; i--) {
    if (!flat[i].empty) { lastFilled = i; break }
  }
  // 補到該列末尾（ceil to next multiple of COLS），最多 COLS*ROWS
  const needed = lastFilled < 0 ? COLS : Math.min(Math.ceil((lastFilled + 1) / COLS) * COLS, COLS * ROWS)
  while (flat.length < needed) flat.push({ ...EMPTY_CELL })
  return flat.slice(0, needed)
}

// 從 title "職業 - 技能點 (1/70)" 取出職業名稱
function groupBaseName(title) {
  return title.replace(/\s*-\s*技能點.*$/, '').trim()
}

// 從 title 取出最大技能點數上限（顯示用，e.g. 50 或 70）
function groupMaxPts(title) {
  const m = title.match(/\((\d+)\/(\d+)\)/)
  if (!m) return 0
  return parseInt(m[2])
}

// 從 title 取出初始點數（e.g. 1）
function groupInitPts(title) {
  const m = title.match(/\((\d+)\/(\d+)\)/)
  if (!m) return 0
  return parseInt(m[1])
}

function groupAllocated(group) {
  let total = 0
  for (const row of group.rows)
    for (const cell of row)
      if (!cell.empty) {
        const k = skillKey(cell.img)
        if (!defaultKeys.has(k))
          total += allocatedPoints[k] ?? 0
      }
  return total
}

// job 所有 group 合計已分配點數
function jobAllocated() {
  if (!currentJob.value) return 0
  return currentJob.value.groups.reduce((sum, g) => sum + groupAllocated(g), 0)
}

// 找出一轉 group：上限點數最大的那個
function firstGroup() {
  if (!currentJob.value) return null
  return currentJob.value.groups.reduce((best, g) =>
          groupMaxPts(g.title) < groupMaxPts(best.title) ? g : best
      , currentJob.value.groups[0])
}

// 非一轉 group 的剩餘點數加總（供一轉借用）
function laterGroupsRemaining() {
  if (!currentJob.value) return 0
  const fg = firstGroup()
  return currentJob.value.groups
      .filter(g => g !== fg)
      .reduce((sum, g) => {
        const max = groupMaxPts(g.title) - groupInitPts(g.title)
        return sum + Math.max(0, max - groupAllocated(g))
      }, 0)
}


// 顯示用已用點數：
//   一轉：最多顯示自己上限（超出部分是借用二轉的，不顯示在自己這）
//   二轉：自己已用 + 被一轉借走的點數
function displayAllocated(group) {
  const fg = firstGroup()
  const isFG = fg === group
  const ownAllocated = groupAllocated(group)
  if (isFG) {
    const ownMax = groupMaxPts(group.title) - groupInitPts(group.title)
    return Math.min(ownAllocated, ownMax)
  } else {
    const fgAllocated = groupAllocated(fg)
    const fgMax = groupMaxPts(fg.title) - groupInitPts(fg.title)
    const borrowed = Math.max(0, fgAllocated - fgMax)
    const ownMax = groupMaxPts(group.title) - groupInitPts(group.title)
    return Math.min(ownAllocated + borrowed, ownMax)
  }
}

// 取得目前 hover 技能的所有前置（含遞迴）-> Map<img, requiredLv>
function collectPrereqs(img, result = new Map()) {
  const prereqs = prereqMap.value[img] ?? []
  for (const { img: pImg, lv: pLv } of prereqs) {
    if (!result.has(pImg) || result.get(pImg) < pLv) {
      result.set(pImg, pLv)
      collectPrereqs(pImg, result)
    }
  }
  return result
}

const hoveredPrereqs = computed(() => {
  if (!hoverImg.value) return new Map()
  return collectPrereqs(hoverImg.value)
})

// 模擬 hover 技能點1級+前置所需的總額外點數（依 group 分）
const hoverSimCost = computed(() => {
  if (!hoverImg.value || !currentJob.value) return null
  const img = hoverImg.value
  const curLv = allocatedPoints[skillKey(img)] ?? 0
  const maxLv = skillMeta.value[img]?.maxLv ?? 1
  if (curLv >= maxLv) return null   // 已滿級，不模擬

  const prereqs = collectPrereqs(img)
  // cost map: group -> extra points needed
  const costMap = new Map()

  // cost for the skill itself: 1 point — use hoverGroup to avoid img collision
  const sg = hoverGroup.value ?? findGroup(img)
  if (sg) costMap.set(sg, (costMap.get(sg) ?? 0) + 1)

  // cost for each unmet prereq — prefer same group as hover skill to avoid cross-group img collision
  for (const [pImg, pLv] of prereqs) {
    const pCur = allocatedPoints[skillKey(pImg)] ?? 0
    const needed = Math.max(0, pLv - pCur)
    if (needed > 0 && !defaultKeys.has(skillKey(pImg))) {
      const pg = findGroup(pImg, sg)
      if (pg) costMap.set(pg, (costMap.get(pg) ?? 0) + needed)
    }
  }
  // 借用邏輯：一轉 group 若已滿，多出的 cost 轉移給二轉 groups
  const fg = firstGroup()
  if (fg && costMap.has(fg)) {
    const fgMax = groupMaxPts(fg.title) - groupInitPts(fg.title)
    const fgUsed = groupAllocated(fg)
    const fgRemaining = Math.max(0, fgMax - fgUsed)
    const fgCost = costMap.get(fg)
    const overflow = Math.max(0, fgCost - fgRemaining)
    if (overflow > 0) {
      costMap.set(fg, Math.min(fgCost, fgRemaining))
      const laterGroups = currentJob.value.groups.filter(g => g !== fg)
      let rem = overflow
      for (const lg of laterGroups) {
        if (rem <= 0) break
        costMap.set(lg, (costMap.get(lg) ?? 0) + rem)
        rem = 0
      }
    }
  }

  // 移除 cost 為 0 的 group，避免觸發不必要的模擬顯示
  for (const [g, c] of costMap) {
    if (c <= 0) costMap.delete(g)
  }

  return costMap.size > 0 ? costMap : null
})

// ── Tooltip ───────────────────────────────────────────
const tooltip = reactive({visible: false, x: 0, y: 0, html: ''})
const tooltipEl = ref(null)

function buildHtml(cell) {
  const raw = skillMeta.value[cell.img]?.desc ?? `<strong>${cell.name}</strong>`
  return raw
}

// 在 modal 用：把 [Lv N] 等級列表包成兩欄 grid
function buildModalHtml(cell) {
  const raw = skillMeta.value[cell.img]?.desc ?? `<strong>${cell.name}</strong>`
  // 把 <br> 分行後，找出 [Lv N] 開頭的行，包進 ps-lv-grid
  const lines = raw.split(/<br\s*\/?>/i)
  const lvLines = []
  const infoLines = []
  let foundLv = false
  for (const line of lines) {
    if (/^\s*\[Lv/.test(line)) {
      foundLv = true
      lvLines.push(`<div class="ps-lv-entry">${line.trim()}</div>`)
    } else if (!foundLv) {
      infoLines.push(line)
    }
  }
  let html = infoLines.join('<br>')
  if (lvLines.length) {
    html += `<div class="ps-lv-grid">${lvLines.join('')}</div>`
  }
  return html
}

function showTooltip(e, cell, group) {
  if (showTooltipSetting.value) {
    tooltip.html = buildHtml(cell)
    tooltip.visible = true
    placeTooltip(e)
  }
  hoverImg.value = cell.img
  hoverGroup.value = group ?? null
}

function placeTooltip(e) {
  const TOOLTIP_W = 340
  const OFFSET_X = 12
  const MARGIN = 8

  // 以技能格子的 bounding rect 為基準
  const cell = e.currentTarget
  const rect = cell.getBoundingClientRect()

  // 水平：預設在格子左邊，放不下則往右
  let x = rect.left - TOOLTIP_W - OFFSET_X
  if (x < MARGIN) x = rect.right + OFFSET_X

  // 垂直暫存格子中心，nextTick 拿真實高度後 clamp
  const cellCenterY = rect.top + rect.height / 2

  tooltip.x = x + window.scrollX
  tooltip.y = cellCenterY + window.scrollY  // 暫存

  nextTick(() => {
    const el = tooltipEl.value
    if (!el) return
    const h = el.offsetHeight

    // 垂直：tooltip 中心對齊格子中心，再 clamp 防超出邊界
    let y = cellCenterY - h / 2
    y = Math.max(MARGIN, y)
    y = Math.min(y, window.innerHeight - h - MARGIN)

    tooltip.y = y + window.scrollY
  })
}

function hideTooltip() {
  tooltip.visible = false
  hoverImg.value = null
  hoverGroup.value = null
}

// ── Modal ─────────────────────────────────────────────
const modal = reactive({visible: false, img: '', maxLv: 1, html: '', isDefault: false})
const activeSkill = ref(null)
const hoverImg = ref(null)
const hoverGroup = ref(null)
const showTooltipSetting = ref(true)
const currentPoint = computed(() => allocatedPoints[skillKey(modal.img)] ?? 0)

// 找出目前技能所屬的 group（用來算上限）
// preferGroup: 若該 group 內也有此 img，優先回傳（避免跨 group 同名 img 找錯）
function findGroup(img, preferGroup = null) {
  if (!currentJob.value) return null
  if (preferGroup) {
    for (const row of preferGroup.rows)
      for (const cell of row)
        if (!cell.empty && cell.img === img) return preferGroup
  }
  for (const group of currentJob.value.groups)
    for (const row of group.rows)
      for (const cell of row)
        if (!cell.empty && cell.img === img) return group
  return null
}

// 目前 modal 技能所屬的 group
const currentGroup = computed(() => findGroup(modal.img))

// 加點是否被擋住：
//   一轉 group（上限最大者）：自己的點數池 + 二轉剩餘點數
//   二轉 group：只看自己 group 的點數池
const isGroupFull = computed(() => {
  const g = currentGroup.value
  if (!g) return true
  const isFG = firstGroup() === g
  const max = groupMaxPts(g.title) - groupInitPts(g.title)
  if (isFG) {
    return groupAllocated(g) >= max + laterGroupsRemaining()
  } else {
    // 二轉：一轉必須先點滿才能加點
    const fg = firstGroup()
    if (fg) {
      const fgMax = groupMaxPts(fg.title) - groupInitPts(fg.title)
      if (groupAllocated(fg) < fgMax) return true
    }
    return displayAllocated(g) >= max
  }
})

function openModal(cell) {
  activeSkill.value = cell
  modal.img = cell.img
  modal.maxLv = skillMeta.value[cell.img]?.maxLv ?? 1
  modal.html = buildModalHtml(cell)
  modal.visible = true
  // 預設有點的技能（不可手動調整）→ 隱藏 -/+ 按鈕
  const key = skillKey(cell.img)
  modal.isDefault = defaultKeys.has(key)
  hideTooltip()
}

function adjustToMax() {
  const g = findGroup(modal.img)
  if (!g) return
  const isFG = firstGroup() === g
  const max = g ? groupMaxPts(g.title) - groupInitPts(g.title) : 0
  const cur = allocatedPoints[skillKey(modal.img)] ?? 0

  // 計算剩餘可用點數
  let remaining
  if (isFG) {
    remaining = (max + laterGroupsRemaining()) - groupAllocated(g)
  } else {
    remaining = max - displayAllocated(g)
  }

  const target = Math.min(modal.maxLv, cur + Math.max(0, remaining))
  if (target <= cur) return
  ensurePrereqs(modal.img, target)
  allocatedPoints[skillKey(modal.img)] = target
}

function resetGroup(group) {
  for (const row of group.rows)
    for (const cell of row)
      if (!cell.empty) {
        const k = skillKey(cell.img)
        if (!defaultKeys.has(k))
          allocatedPoints[k] = 0
      }
}

function closeModal() {
  modal.visible = false;
  activeSkill.value = null
}

// 滾輪調整技能等級（電腦版）
function onModalWheel(e) {
  if (modal.isDefault || !modal.visible) return
  // deltaY > 0 往下滾 → 減少；往上滾 → 增加
  const d = e.deltaY > 0 ? -1 : 1
  adjustPoint(d)
}

// 直接在技能格上滾輪調整（不需要開 Modal）
function onCellWheel(e, cell) {
  const d = e.deltaY > 0 ? -1 : 1
  // 暫借 modal state 讓 adjustPoint / cascadeDowngrade 能找到正確 group
  const prevImg = modal.img
  const prevMaxLv = modal.maxLv
  const prevVisible = modal.visible
  modal.img = cell.img
  modal.maxLv = skillMeta.value[cell.img]?.maxLv ?? 1
  adjustPoint(d)
  if (!prevVisible) {
    modal.img = prevImg
    modal.maxLv = prevMaxLv
  }
}

// 遞迴滿足前置：要讓 img 達到 targetLv，先確保其所有前置達到要求等級
function ensurePrereqs(img, targetLv) {
  if (targetLv <= 0) return
  const prereqs = prereqMap.value[img] ?? []
  for (const {img: pImg, lv: pLv} of prereqs) {
    const cur = allocatedPoints[skillKey(pImg)] ?? 0
    if (cur < pLv) {
      ensurePrereqs(pImg, pLv)          // 先滿足前置的前置
      allocatedPoints[skillKey(pImg)] = pLv
    }
  }
}

// 降級連鎖：當 img 降到 newLv 後，檢查所有以 img 為前置的技能是否還達標
function cascadeDowngrade(img, newLv) {
  if (!currentJob.value) return
  for (const group of currentJob.value.groups) {
    for (const row of group.rows) {
      for (const cell of row) {
        if (cell.empty) continue
        const prereqs = prereqMap.value[cell.img] ?? []
        for (const { img: pImg, lv: pLv } of prereqs) {
          if (pImg === img && newLv < pLv) {
            // 前置不達標，把這個技能降到 0
            const k = skillKey(cell.img)
            if (!defaultKeys.has(k) && (allocatedPoints[k] ?? 0) > 0) {
              allocatedPoints[k] = 0
              cascadeDowngrade(cell.img, 0)
            }
          }
        }
      }
    }
  }
}

function adjustPoint(d) {
  const key = skillKey(modal.img)
  const cur = allocatedPoints[key] ?? 0
  const next = Math.max(0, Math.min(modal.maxLv, cur + d))
  if (d > 0 && next > cur) {
    const g = findGroup(modal.img)
    const isFG = firstGroup() === g
    const max = g ? groupMaxPts(g.title) - groupInitPts(g.title) : 0

    // 計算前置補點的額外消耗（同 group 內）
    const prereqCost = calcPrereqCost(modal.img, next, g)

    if (isFG) {
      if (groupAllocated(g) + prereqCost >= max + laterGroupsRemaining()) return
    } else {
      const fg2 = firstGroup()
      if (fg2) {
        const fgMax2 = groupMaxPts(fg2.title) - groupInitPts(fg2.title)
        if (groupAllocated(fg2) < fgMax2) return
      }
      if (g && displayAllocated(g) + prereqCost >= max) return
    }
    ensurePrereqs(modal.img, next)      // 加點前自動補前置
  }
  allocatedPoints[key] = next
  if (d < 0 && next < cur) {
    cascadeDowngrade(modal.img, next)
  }
}

// 計算為了讓 img 升到 targetLv，同一 group 內的前置需要額外補多少點
function calcPrereqCost(img, targetLv, group) {
  if (targetLv <= 0 || !group) return 0
  const prereqs = prereqMap.value[img] ?? []
  let cost = 0
  for (const { img: pImg, lv: pLv } of prereqs) {
    const cur = allocatedPoints[skillKey(pImg)] ?? 0
    if (cur < pLv) {
      // 前置不足，需要補到 pLv，再遞迴算它自己的前置
      const inSameGroup = group.rows.some(row => row.some(c => !c.empty && c.img === pImg))
      if (inSameGroup) {
        cost += (pLv - cur)
        cost += calcPrereqCost(pImg, pLv, group)
      }
    }
  }
  return cost
}
</script>

<style scoped>
/* ── CSS Variables ── */
.ps-root {
  --c-bg: #1a1410;
  --c-surface: #231c14;
  --c-border: #4a3820;
  --c-border-hi: #c8a050;
  --c-gold: #e8c060;
  --c-gold-dim: #9a7030;
  --c-text: #d4b896;
  --c-text-dim: #7a6040;
  --c-filled: #2a1e08;
  --c-filled-bd: #c8902a;
  --c-maxed: #0d1f0d;
  --c-maxed-bd: #3a9a3a;
  --c-active-bd: #60a8f0;
  --cell-size: 90px;
  --radius: 6px;

  background: var(--c-bg);
  color: var(--c-text);
  padding: 12px 16px 16px;
  border-radius: 12px;
  align-self: flex-start;
  width: fit-content;
  min-width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
}

/* ── Loading ── */
.ps-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 120px;
}

.ps-loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-gold);
  animation: ps-pulse 1.2s ease-in-out infinite;
}

.ps-loading-dot:nth-child(2) {
  animation-delay: .2s;
}

.ps-loading-dot:nth-child(3) {
  animation-delay: .4s;
}

@keyframes ps-pulse {
  0%, 80%, 100% {
    opacity: .2;
    transform: scale(.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* ── Tabs ── */
.ps-tabs-wrap {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--c-border);
}

.ps-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
  gap: 8px;
}

.ps-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 10px 8px;
  width: 100%;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-surface);
  color: var(--c-text-dim);
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
  box-shadow: 0 0 10px rgba(200, 160, 80, 0.25), inset 0 0 0 1px rgba(232, 192, 96, 0.1);
}

.ps-tab-img-wrap {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(0,0,0,0.25);
  overflow: hidden;
  flex-shrink: 0;
}

.ps-tab-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  image-rendering: pixelated;
  filter: grayscale(0.4) brightness(0.8);
  transition: filter 0.18s;
}

.ps-tab:hover .ps-tab-img,
.ps-tab.active .ps-tab-img {
  filter: none;
}

.ps-tab-img-placeholder {
  width: 36px;
  height: 36px;
}

.ps-tab-label {
  font-size: 13px;
  letter-spacing: .3px;
  text-align: center;
  line-height: 1.2;
  word-break: keep-all;
}

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 7px 14px;
  background: linear-gradient(90deg, #2e2008 0%, #1a1410 100%);
  border: 1px solid var(--c-border);
  border-left: 3px solid var(--c-gold);
  border-radius: var(--radius);
}

.ps-group-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-gold);
  letter-spacing: .5px;
}

.ps-reset-btn {
  font-size: 15px;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--c-border);
  background: transparent;
  color: var(--c-text-dim);
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}

.ps-reset-btn:hover {
  border-color: #e05050;
  color: #e05050;
  background: rgba(224, 80, 80, 0.1);
}

.ps-settings-bar {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--c-border);
}

.ps-toggle-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.ps-toggle-label {
  font-size: 20px;
  color: var(--c-gold);
  font-weight: 600;
  letter-spacing: .3px;
}

.ps-toggle {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #3a2810;
  border: 1px solid var(--c-border);
  position: relative;
  transition: background .2s, border-color .2s;
  flex-shrink: 0;
}

.ps-toggle.on {
  background: #5a3e10;
  border-color: var(--c-gold);
}

.ps-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #7a6040;
  transition: transform .2s, background .2s;
}

.ps-toggle.on .ps-toggle-thumb {
  transform: translateX(20px);
  background: var(--c-gold);
}

.ps-sim-cur {
  color: var(--c-text-dim);
}

.ps-sim-arrow {
  color: var(--c-gold-dim);
  font-size: 11px;
}

.ps-sim-next {
  color: #60e060;
  font-weight: 900;
}

.ps-sim-next--over {
  color: #ff5555;
}

.ps-group-count {
  font-size: 11px;
  color: var(--c-text-dim);
}

.ps-group-count em {
  font-style: normal;
  color: var(--c-gold-dim);
  font-weight: 700;
}

/* ── Grid ── */
.ps-grid {
  display: grid;
  grid-template-columns: repeat(7, var(--cell-size));
  grid-auto-rows: var(--cell-size);
  gap: 10px;
}

/* ── Cell ── */
.ps-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
  box-shadow: 0 0 0 1px rgba(200, 160, 80, 0.3), 0 2px 8px rgba(0, 0, 0, 0.4);
  transform: translateY(-1px);
  z-index: 1;
}

.ps-cell--filled {
  background: var(--c-filled);
  border-color: var(--c-filled-bd);
}

.ps-cell--filled:hover {
  border-color: #e0a840 !important;
  box-shadow: 0 0 0 1px rgba(200, 144, 42, 0.4), 0 2px 10px rgba(0, 0, 0, 0.5) !important;
}

.ps-cell--maxed {
  background: var(--c-maxed) !important;
  border-color: var(--c-maxed-bd) !important;
  box-shadow: 0 0 6px rgba(58, 154, 58, 0.3);
}

.ps-cell--active {
  border-color: var(--c-active-bd) !important;
  box-shadow: 0 0 0 2px rgba(96, 168, 240, 0.35) !important;
}

.ps-cell--hovered {
  background: #2a1e38 !important;
  border-color: #a078e0 !important;
  box-shadow: 0 0 0 2px rgba(160, 120, 224, 0.45), 0 2px 10px rgba(0, 0, 0, 0.5) !important;
  transform: translateY(-1px);
  z-index: 1;
}

.ps-cell--prereq {
  border-color: #c0a030 !important;
  box-shadow: 0 0 8px rgba(192, 160, 48, 0.4);
}

.ps-cell--prereq-unmet {
  border-color: #c05030 !important;
  box-shadow: 0 0 8px rgba(192, 80, 48, 0.4);
}

.ps-prereq-label {
  position: absolute;
  bottom: 2px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 0;
  border-radius: 0 0 4px 4px;
}

.ps-prereq-label--met {
  color: #80e080;
  background: rgba(0, 40, 0, 0.7);
}

.ps-prereq-label--unmet {
  color: #ff9060;
  background: rgba(40, 10, 0, 0.7);
}

.ps-cell--default {
  border-color: #6080c0 !important;
  box-shadow: 0 0 6px rgba(96, 128, 192, 0.3);
}

.ps-cell--empty {
  background: #151009;
  border-color: #2a1e0e;
  cursor: default;
  opacity: .5;
}

.ps-icon {
  width: 52px;
  height: 52px;
  object-fit: contain;
  image-rendering: pixelated;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6));
}

.ps-cell--empty .ps-icon {
  display: none;
}

.ps-skill-name {
  font-size: 10px;
  color: var(--c-text);
  text-align: center;
  margin-top: 4px;
  line-height: 1.3;
  word-break: break-all;
  opacity: .85;
}

.ps-badge {
  position: absolute;
  top: 3px;
  right: 3px;
  font-size: 14px;
  font-weight: 800;
  color: var(--c-text-dim);
  background: rgba(0, 0, 0, 0.45);
  border-radius: 3px;
  padding: 0 4px;
  line-height: 16px;
  min-width: 16px;
  text-align: center;
}

.ps-badge--on {
  color: var(--c-gold);
  background: rgba(40, 24, 0, 0.7);
}

.ps-badge--maxed {
  color: #6de06d;
  background: rgba(0, 20, 0, 0.7);
}

/* ── RWD ── */

/* 手機：tab grid 更緊湊 */
@media (max-width: 480px) {
  .ps-tabs {
    grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
    gap: 5px;
  }

  .ps-tab {
    padding: 7px 4px 6px;
    gap: 4px;
  }

  .ps-tab-img-wrap {
    width: 32px;
    height: 32px;
  }

  .ps-tab-img {
    width: 28px;
    height: 28px;
  }

  .ps-tab-label {
    font-size: 10px;
  }
}

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

  .ps-tab {
    padding: 4px 8px;
  }

  .ps-tab-label {
    font-size: 13px;
  }

  .ps-group-header {
    padding: 6px 10px;
  }

  .ps-group-title {
    font-size: 14px;
  }

  .ps-reset-btn {
    font-size: 13px;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid var(--c-border);
    background: transparent;
    color: var(--c-text-dim);
    cursor: pointer;
    transition: all .15s;
    white-space: nowrap;
  }

  .ps-reset-btn:hover {
    border-color: #e05050;
    color: #e05050;
    background: rgba(224, 80, 80, 0.1);
  }

  .ps-settings-bar {
    display: flex;
    gap: 12px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--c-border);
  }

  .ps-toggle-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }

  .ps-toggle-label {
    font-size: 15px;
    color: var(--c-gold);
    font-weight: 600;
    letter-spacing: .3px;
  }

  .ps-toggle {
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background: #3a2810;
    border: 1px solid var(--c-border);
    position: relative;
    transition: background .2s, border-color .2s;
    flex-shrink: 0;
  }

  .ps-toggle.on {
    background: #5a3e10;
    border-color: var(--c-gold);
  }

  .ps-toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #7a6040;
    transition: transform .2s, background .2s;
  }

  .ps-toggle.on .ps-toggle-thumb {
    transform: translateX(20px);
    background: var(--c-gold);
  }

  .ps-sim-cur {
    color: var(--c-text-dim);
  }

  .ps-sim-arrow {
    color: var(--c-gold-dim);
    font-size: 11px;
  }

  .ps-sim-next {
    color: #60e060;
    font-weight: 900;
  }

  .ps-group-count {
    font-size: 12px;
  }

  /* Grid 自適應填滿寬度，高度鎖 1:1 */
  .ps-grid {
    grid-template-columns: repeat(7, 1fr) !important;
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

  .ps-icon {
    width: 55% !important;
    height: 55% !important;
  }

  .ps-skill-name {
    font-size: 6px;
    margin-top: 2px;
  }

  .ps-badge {
    font-size: 10px;
    padding: 0 2px;
    line-height: 14px;
  }
}
</style>

<!-- ── Global: Tooltip & Modal ── -->
<style>
.ps-tooltip {
  position: absolute;
  z-index: 9999;
  background: #1e160a;
  border: 1px solid #6a4e20;
  border-radius: 8px;
  padding: 12px 14px;
  max-width: 320px;
  font-size: 16px;
  line-height: 1.7;
  color: #d4b896;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(200, 160, 80, 0.08);
  pointer-events: none;
}

.ps-tooltip br {
  display: block;
}

/* ── Overlay ── */
.ps-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Modal ── */
.ps-modal {
  position: relative;
  background: #1e160a;
  border: 1px solid #6a4e20;
  border-radius: 12px;
  width: 680px;
  max-width: 92vw;
  max-height: 85vh;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(200, 160, 80, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ps-modal-in .18s ease;
}

@keyframes ps-modal-in {
  from {
    opacity: 0;
    transform: scale(.94) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.ps-modal-close {
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  color: #7a6040;
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
  padding: 2px 4px;
  transition: color .15s;
}

.ps-modal-close:hover {
  color: #d4b896;
}

.ps-modal-body {
  padding: 20px 24px 16px;
  font-size: 14px;
  line-height: 1.8;
  color: #d4b896;
  border-bottom: 1px solid #3a2810;
  overflow-y: auto;
  flex: 1;
}

.ps-modal-body br {
  display: block;
}

/* 等級列表兩欄 grid */
.ps-modal-body .ps-lv-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 16px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #3a2810;
}

.ps-modal-body .ps-lv-entry {
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.6;
}

.ps-modal-body .ps-lv-entry:nth-child(odd) {
  background: rgba(200, 160, 80, 0.04);
}

.ps-modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 14px 20px;
  flex-shrink: 0;
}

.ps-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  transition: all .15s;
}

.ps-btn:disabled {
  opacity: .3;
  cursor: not-allowed;
}

.ps-btn--minus {
  background: #2a0a0a;
  color: #e05050;
  border: 1px solid #6a1010;
}

.ps-btn--minus:hover:not(:disabled) {
  background: #3a1010;
  border-color: #e05050;
  box-shadow: 0 0 8px rgba(224, 80, 80, .3);
}

.ps-btn--plus {
  background: #0a2a0a;
  color: #40c040;
  border: 1px solid #106010;
}

.ps-btn--plus:hover:not(:disabled) {
  background: #103a10;
  border-color: #40c040;
  box-shadow: 0 0 8px rgba(64, 192, 64, .3);
}

.ps-point-pill {
  display: flex;
  align-items: baseline;
  gap: 3px;
  background: #0a0604;
  border: 1px solid #4a3010;
  border-radius: 8px;
  padding: 6px 14px;
  min-width: 80px;
  justify-content: center;
}

.ps-point-cur {
  font-size: 26px;
  font-weight: 900;
  color: #e8c060;
  line-height: 1;
}

.ps-point-sep {
  font-size: 14px;
  color: #6a4e20;
  margin: 0 1px;
}

.ps-btn--max {
  width: auto;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 900;
  background: #1a1a0a;
  color: #c8c040;
  border: 1px solid #6a6010;
  letter-spacing: 1px;
}

.ps-btn--max:hover:not(:disabled) {
  background: #2a2a10;
  border-color: #c8c040;
  box-shadow: 0 0 8px rgba(200, 192, 64, .3);
}

.ps-point-max {
  font-size: 14px;
  color: #9a7030;
}

/* ── Modal：手機版字體放大 ── */
@media (max-width: 720px) {
  .ps-modal {
    width: 94vw;
    max-width: 94vw;
    max-height: 85vh;
    border-radius: 10px;
    overflow-y: auto;
  }

  .ps-modal-body {
    overflow-y: visible;
  }

  /* 手機版等級列表維持單欄 */
  .ps-modal-body .ps-lv-grid {
    grid-template-columns: 1fr;
  }

  .ps-modal-close {
    font-size: 20px;
    top: 12px;
    right: 14px;
  }

  .ps-modal-body {
    padding: 20px 16px 12px;
    font-size: 12px;
    line-height: 1.75;
  }

  .ps-modal-footer {
    gap: 12px;
    padding: 12px 16px;
  }

  .ps-btn {
    width: 48px;
    height: 48px;
    font-size: 22px;
  }

  .ps-btn--max {
    width: auto;
    padding: 0 12px;
    font-size: 14px;
    height: 48px;
  }

  .ps-point-pill {
    padding: 8px 16px;
    min-width: 88px;
  }

  .ps-point-cur {
    font-size: 30px;
  }

  .ps-point-sep {
    font-size: 16px;
  }

  .ps-point-max {
    font-size: 16px;
  }

  .ps-tooltip {
    font-size: 14px;
    max-width: 260px;
    padding: 10px 12px;
  }
}
</style>