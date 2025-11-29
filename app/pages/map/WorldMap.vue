<script setup>
import { ref, reactive, computed } from 'vue'
import {monstersSearch} from "~/assets/data/monstersSearch.js";
import {worldMapData} from "~/assets/data/worldMapData.js";
/* 地圖 DOM */
const mapRef = ref(null)

/* Tooltip 狀態 */
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  data: {}
})
/* 熱區資料 */
const areas = ref(worldMapData)
const monsters = ref(monstersSearch)
/* 計算 Tooltip 樣式 */
const tooltipStyle = computed(() => ({
  left: tooltip.x + 'px',
  top: tooltip.y + 'px'
}))

/* 區塊樣式 */
function getStyle(area) {
  return {
    // left: area.x + '%',
    // top: area.y + '%',
    // width: area.w + '%',
    // height: area.h + '%'
    left: (area.x * 1.151) + 'px',
    top: (area.y * 1.1) +  'px',
    width: area.w + 'px',
    height: area.h + 'px',
  }
}

const displayTooltip = (e, area) => {

  if(tooltip.data === area){
    tooltip.visible = false
    tooltip.data = {}
    return
  }
  tooltip.visible = true
  tooltip.data = area

  const rect = mapRef.value.getBoundingClientRect()
  tooltip.x = e.clientX - rect.left + 15
  tooltip.y = e.clientY - rect.top + 15
  // tooltip.x = e.clientX + 15
  // tooltip.y = e.clientY - 60
}

const onMapClick = (e) => {
  if (e.target.classList.contains('tooltip-box')) {
    return
  }
  if (!e.target.classList.contains('map-area')) {
    tooltip.visible = false
    tooltip.data = {}
  }
}
const getMonster = (id) => {
  return monsters.value[id]
}
const openMonster = (id) => {
  window.open(`/monster/monster`, import.meta.url, '_blank') // 開新分頁
}
/* 顯示 Tooltip */
function showTooltip(e, area) {
  tooltip.visible = true
  tooltip.data = area

  const rect = mapRef.value.getBoundingClientRect()
  tooltip.x = e.clientX - rect.left + 15
  tooltip.y = e.clientY - rect.top + 15
}

/* 隱藏 Tooltip */
function hideTooltip() {
  tooltip.visible = false
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
        />

        <!-- 熱區 -->
<!--        <div-->
<!--            v-for="(area, i) in areas"-->
<!--            :key="i"-->
<!--            class="map-area"-->
<!--            :style="getStyle(area)"-->
<!--            @click="displayTooltip($event, area)"-->
<!--        ></div>-->

        <div
            v-for="(area, i) in areas"
            :key="i"
            class="map-area"
            :style="getStyle(area)"
            @mouseenter="showTooltip($event, area)"
            @mouseleave="hideTooltip"
        >
          <div class="p-0 m-0">
            <span style="font-size: 8px; color: #ffffff" class="font-bold">{{area.code}}</span>
          </div>

        </div>

        <!-- 提示框 -->
        <div
            v-if="tooltip.visible"
            class="tooltip-box"
            :style="tooltipStyle"
            @click.stop
        >
          <div class="flex">
            <div class="tooltip-title">{{ tooltip.data.name }}</div>
            <div class="ms-1 tooltip-text">({{ tooltip.data.code }})</div>
          </div>

          <!-- 表格 -->
          <table v-if="tooltip.data.monsters.length > 0" class="tooltip-table">
            <thead>
            <tr>
              <th>等級</th>
              <th>魔物</th>
              <th>數量</th>
              <th>屬性</th>
              <th>體型</th>
              <th>種族</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="m in tooltip.data.monsters" :key="m.id">
              <td>{{ getMonster(m.id).basic_info.level }}</td>
              <td class="mob-name">
                {{ getMonster(m.id).name.zh_tw }}
              </td>
              <td>{{ m.count }}</td>
              <td>
                {{ getMonster(m.id).basic_info.element.type }}
                {{ getMonster(m.id).basic_info.element.level }}
              </td>
              <td>{{ getMonster(m.id).basic_info.size }}</td>
              <td>{{ getMonster(m.id).basic_info.race }}</td>
            </tr>
            </tbody>
          </table>
        </div>
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
  margin: auto;
  max-width: 1000px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  color: #fff8e1;
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
}

.main-title {
  color: #c9a063;
  text-align: center;
  font-size: 2.2rem;
  border-bottom: 3px double #c9a063;
  margin-bottom: 20px;
  padding-bottom: 10px;
}

.map-container {

  position: relative;
  width: 100%;
  border: 3px solid #8b5a2b;
  border-radius: 10px;
  //padding: 2px 2vw 3rem;
}

.world-map {
  width: 100%;
  display: block;
}

/* 熱區 */
.map-area {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
}

.map-area:hover {
  background: rgba(255, 255, 255, 0.12);
  border: 2px solid #e3e3e3;
}

/* Tooltip */
.tooltip-box {
  position: absolute;   /* 取代 absolute */
  z-index: 10;
  background: #2c2118;
  color: #fff8e1;
  border: 2px solid #c9a063;
  border-radius: 8px;
  padding: 10px 14px;

  white-space: nowrap;

  box-shadow: 0 0 10px rgba(0,0,0,0.6);

}

.tooltip-title {
  font-weight: bold;
  color: #ffcc66;
  margin-bottom: 3px;
}

.tooltip-text {
  font-size: 0.9rem;
  color: #ddd;
}
.tooltip-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.tooltip-table th {
  border: 1px solid #c9a063;
  padding: 2px 4px;
  font-weight: bold;
  white-space: nowrap;
}

.tooltip-table td {
  border: 1px solid #c9a063;
  padding: 2px 4px;
  text-align: center;
  white-space: nowrap;
}

.mob-name {
  text-align: left;
  font-weight: bold;
}

</style>
