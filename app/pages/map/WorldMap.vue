<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { worldMapData } from '~/assets/data/worldMapData.js'

/* ── 地圖 DOM ── */
const mapRef = ref(null)

/* ── 怪物資料（從 JSON fetch）── */
const monstersDB = ref({})   // key = monster id
// 以 map_name 為 key，value = 出現在該地圖的怪物清單
// { "prt_fild08": [{ id, count, name, level, element, size, race, img }, ...] }
const mapMonsters = ref({})

onMounted(async () => {
  try {
    const res = await fetch('/data/monsters_display_index.json')
    if (!res.ok) throw new Error('載入失敗')
    const data = await res.json()
    monstersDB.value = data

    // 建立 mapMonsters 索引
    const index = {}
    for (const m of Object.values(data)) {
      if (!Array.isArray(m.spawns)) continue
      for (const spawn of m.spawns) {
        const mapName = spawn.map_name
        if (!mapName) continue
        if (!index[mapName]) index[mapName] = []
        index[mapName].push({
          id: m.id,
          count: spawn.amount ?? spawn.count ?? '?',
          name: m.name?.zh_tw ?? m.name?.en ?? String(m.id),
          level: m.basic_info?.level ?? '?',
          element: `${m.basic_info?.element?.type ?? ''}${m.basic_info?.element?.level ?? ''}`,
          size: m.basic_info?.size ?? '?',
          race: m.basic_info?.race ?? '?',
          img: `/images/monsters/${m.id}.gif`,
        })
      }
    }
    // 依等級排序
    for (const k of Object.keys(index)) {
      index[k].sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
    }
    mapMonsters.value = index
  } catch (e) {
    console.error('worldmap monster load error:', e)
  }
})

/* ── 熱區資料 ── */
const areas = ref(worldMapData)

/* ── 地圖縮放比例（圖片實際顯示寬 vs 設計寬 870px）── */
const mapNaturalW = 870  // worldMapData 座標基準寬度

// 取得目前地圖顯示寬度，用於動態縮放 getStyle
const mapDisplayW = ref(870)
const updateMapW = () => {
  if (mapRef.value) mapDisplayW.value = mapRef.value.offsetWidth
}
onMounted(() => {
  document.title = 'RO樂園-世界地圖';
  updateMapW()
  window.addEventListener('resize', updateMapW)
})
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => window.removeEventListener('resize', updateMapW))

const scale = computed(() => mapDisplayW.value / mapNaturalW)

function getStyle(area) {
  const s = scale.value
  return {
    left:   (area.x * s) + 'px',
    top:    (area.y * s) + 'px',
    width:  (area.w * s) + 'px',
    height: (area.h * s) + 'px',
  }
}

/* ── Tooltip（點擊切換）── */
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  area: null,
})

const tooltipStyle = computed(() => {
  if (!mapRef.value) return {}
  const mapW = mapRef.value.offsetWidth
  const mapH = mapRef.value.offsetHeight
  // 防止超出右邊或下方
  const ttW = 320
  const ttH = 300
  let x = tooltip.x + 14
  let y = tooltip.y + 14
  if (x + ttW > mapW) x = tooltip.x - ttW - 4
  if (y + ttH > mapH) y = tooltip.y - ttH - 4
  return { left: x + 'px', top: y + 'px' }
})

function onAreaClick(e, area) {
  e.stopPropagation()
  if (tooltip.area === area && tooltip.visible) {
    tooltip.visible = false
    tooltip.area = null
    return
  }
  const rect = mapRef.value.getBoundingClientRect()
  tooltip.x = e.clientX - rect.left
  tooltip.y = e.clientY - rect.top
  tooltip.area = area
  tooltip.visible = true
}

function onMapClick() {
  tooltip.visible = false
  tooltip.area = null
}

/* ── 當前地圖的怪物清單 ── */
const currentMonsters = computed(() => {
  if (!tooltip.area) return []
  return mapMonsters.value[tooltip.area.code] ?? []
})

/* ── 地圖名稱：若 worldMapData 沒填 name，就顯示 code ── */
function areaLabel(area) {
  return area.name || area.code
}
</script>

<template>
  <div class="map-wrapper">
    <div class="map-card">

      <h2 class="main-title">世界地圖</h2>

      <div class="map-container" ref="mapRef" @click="onMapClick">
        <img
            src="/images/map_midgard.jpg"
            class="world-map"
            alt="世界地圖"
            @load="updateMapW"
        />

        <!-- 熱區 -->
        <div
            v-for="(area, i) in areas"
            :key="i"
            class="map-area"
            :style="getStyle(area)"
            :class="{ active: tooltip.area === area }"
            @click.stop="onAreaClick($event, area)"
        >
          <span class="area-code">{{ area.code }}</span>
        </div>

        <!-- Tooltip -->
        <Transition name="fade">
          <div
              v-if="tooltip.visible && tooltip.area"
              class="tooltip-box"
              :style="tooltipStyle"
              @click.stop
          >
            <!-- 標題列 -->
            <div class="tooltip-header">
              <span class="tooltip-title">{{ areaLabel(tooltip.area) }}</span>
              <span class="tooltip-code">({{ tooltip.area.code }})</span>
              <button class="tooltip-close" @click="onMapClick">✕</button>
            </div>

            <!-- 無怪物 -->
            <div v-if="currentMonsters.length === 0" class="tooltip-empty">
              此地圖無怪物資料
            </div>

            <!-- 怪物表格 -->
            <div v-else class="tooltip-scroll">
              <table class="tooltip-table">
                <thead>
                <tr>
                  <th></th>
                  <th>魔物</th>
                  <th>等級</th>
                  <th>數量</th>
                  <th>屬性</th>
                  <th>體型</th>
                  <th>種族</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="m in currentMonsters" :key="m.id">
                  <td><img :src="m.img" :alt="m.name" class="mob-img"></td>
                  <td class="mob-name">{{ m.name }}</td>
                  <td>{{ m.level }}</td>
                  <td>{{ m.count }}</td>
                  <td>{{ m.element }}</td>
                  <td>{{ m.size }}</td>
                  <td>{{ m.race }}</td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </Transition>
      </div>

    </div>
  </div>
</template>

<style scoped>
.map-wrapper {
  background: #3a2c1f;
  padding: 30px 20px;
  margin-bottom: 50px;
}

.map-card {
  background: #3a2c1f;
  border-radius: 12px;
  padding: 30px;
  max-width: 1000px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  color: #fff8e1;
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.main-title {
  color: #c9a063;
  text-align: left;
  font-size: 2.2rem;
  border-bottom: 3px double #c9a063;
  margin-bottom: 20px;
  padding-bottom: 10px;
  width: 100%;
}

.map-container {
  position: relative;
  width: 100%;
  border: 3px solid #8b5a2b;
  border-radius: 10px;
  overflow: hidden;
}

.world-map {
  width: 100%;
  display: block;
}

/* 熱區 */
.map-area {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.18);
  cursor: pointer;
  overflow: hidden;
  transition: background 0.15s, border-color 0.15s;
}

.map-area:hover,
.map-area.active {
  background: rgba(255, 204, 102, 0.18);
  border: 1.5px solid #ffd966;
}

.area-code {
  font-size: 7px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: bold;
  line-height: 1;
  pointer-events: none;
  display: block;
  padding: 1px;
  white-space: nowrap;
  overflow: hidden;
}

/* Tooltip */
.tooltip-box {
  position: absolute;
  z-index: 50;
  background: #1e160e;
  color: #fff8e1;
  border: 2px solid #c9a063;
  border-radius: 10px;
  padding: 10px 12px;
  min-width: 260px;
  max-width: 360px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.75);
  pointer-events: auto;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.tooltip-title {
  font-weight: bold;
  color: #ffcc66;
  font-size: 1rem;
  flex: 1;
}

.tooltip-code {
  font-size: 0.8rem;
  color: #aaa;
}

.tooltip-close {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0 2px;
  line-height: 1;
  transition: color 0.15s;
}

.tooltip-close:hover {
  color: #fff;
}

.tooltip-empty {
  color: #888;
  font-size: 0.85rem;
  padding: 6px 0;
}

/* 表格捲動區 */
.tooltip-scroll {
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c9a063 #2c2118;
}

.tooltip-scroll::-webkit-scrollbar {
  width: 5px;
}

.tooltip-scroll::-webkit-scrollbar-track {
  background: #2c2118;
}

.tooltip-scroll::-webkit-scrollbar-thumb {
  background-color: #c9a063;
  border-radius: 3px;
}

.tooltip-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.tooltip-table th {
  border: 1px solid #5a4530;
  padding: 3px 5px;
  background: #2c2118;
  color: #c9a063;
  font-weight: bold;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
}

.tooltip-table td {
  border: 1px solid #3a2e22;
  padding: 3px 5px;
  text-align: center;
  white-space: nowrap;
}

.tooltip-table tr:nth-child(even) td {
  background: #221a12;
}

.mob-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.mob-name {
  text-align: left;
  font-weight: bold;
  color: #ffe599;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>