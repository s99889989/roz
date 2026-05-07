<template>
  <div class="min-h-screen bg-[#3A2C1F] p-4 md:p-8 font-sans flex flex-col items-center">

    <div class="mb-6 text-center">
      <h1 class="text-[#f2e6d9] text-3xl font-black tracking-[0.2em] drop-shadow-lg">屬性相剋表</h1>
      <div class="h-1 w-32 bg-[#a88a64] mx-auto mt-2"></div>
    </div>

    <div class="w-full max-w-5xl space-y-10">
      <div v-for="lv in [1, 2, 3, 4]" :key="lv" class="bg-[#f2e6d9] rounded-lg shadow-2xl overflow-hidden border-4 border-[#5c4033]">

        <div class="bg-[#5c4033] text-[#f2e6d9] py-3 px-6 flex justify-between items-center border-b-2 border-[#3d2b1f]">
          <div class="flex items-center gap-3">
            <div class="bg-[#a88a64] px-3 py-1 rounded font-bold text-sm shadow-inner">Lv.{{ lv }}</div>
            <span class="font-bold tracking-widest text-lg">目標屬性等級 {{ lv }}</span>
          </div>
          <span class="text-xs text-[#a89078] italic">單位：％</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-center border-collapse">
            <thead>
            <tr class="bg-[#d9c5b2] text-[#5c4033] text-sm font-bold">
              <th class="p-3 border-r border-[#5c4033]/20 bg-[#e8dbc9] min-w-[80px]">
                <div class="text-[10px] opacity-60">施放 \ 目標</div>
              </th>
              <th v-for="el in elements" :key="el" class="p-3 border-r border-[#5c4033]/20 min-w-[60px]">
                {{ el }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, rIdx) in elementData[lv-1]" :key="rIdx" class="border-t border-[#5c4033]/10 hover:bg-white/30 transition-colors">
              <td class="p-3 border-r border-[#5c4033]/20 font-bold text-[#3d2b1f] bg-[#e8dbc9]">
                {{ elements[rIdx] }}
              </td>
              <td
                  v-for="(val, cIdx) in row" :key="cIdx"
                  :class="getRateClass(val)"
                  class="p-2 border-r border-[#5c4033]/10 font-black text-sm transition-all"
              >
                <div class="rounded-sm py-1 shadow-sm border border-black/5">
                  {{ val }}
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="no-print py-6 text-center text-[#a88a64] font-bold tracking-widest">
        ★ 實際設定皆以遊戲內設定為主 ★
      </div>
    </div>

  </div>
</template>

<script setup>
import {onMounted} from "vue";

const elements = ['無', '水', '地', '火', '風', '毒', '聖', '暗', '念', '不死'];

/**
 * 根據數值回傳對應的 CSS 樣式 (統一體型修正表風格)
 * > 100% -> 深綠色 (有利)
 * = 100% -> 灰色/米色 (中性)
 * < 100% -> 紅色/褐色 (不利)
 */
function getRateClass(value) {
  if (value > 100) return 'text-[#f2f2f2] bg-[#536153]'; // 深綠底 (強)
  if (value === 0) return 'text-[#f2f2f2] bg-[#333333]'; // 近乎無效
  if (value < 100) return 'text-[#f2f2f2] bg-[#cc5a4b]';  // 紅底 (弱)
  return 'text-[#5c4033] bg-transparent';              // 預設 (100)
}

// 屬性表數據 (範例為 Lv1 數據，您可以依照圖片陸續補齊其餘等級)
const lv1Data = [
  [100, 100, 100, 100, 100, 100, 100, 100, 90, 100],
  [100, 25, 100, 150, 90, 150, 100, 100, 100, 100],
  [100, 100, 25, 90, 150, 150, 100, 100, 100, 100],
  [100, 90, 150, 25, 100, 150, 100, 100, 100, 125],
  [100, 150, 90, 100, 25, 150, 100, 100, 100, 100],
  [100, 150, 150, 150, 150, 0, 75, 75, 75, 75],
  [100, 100, 100, 100, 100, 75, 0, 125, 100, 125],
  [100, 100, 100, 100, 100, 75, 125, 0, 100, 0],
  [90, 100, 100, 100, 100, 75, 90, 90, 125, 100],
  [100, 100, 100, 90, 100, 75, 125, 0, 100, 0],
];

const lv2Data = [
  [100, 100, 100, 100, 100, 100, 100, 100, 70, 100],
  [100, 0, 100, 175, 80, 150, 100, 100, 100, 100],
  [100, 100, 0, 80, 175, 150, 100, 100, 100, 100],
  [100, 80, 175, 0, 100, 150, 100, 100, 100, 150],
  [100, 175, 80, 100, 0, 150, 100, 100, 100, 100],
  [100, 150, 150, 150, 150, 0, 75, 75, 75, 50],
  [100, 100, 100, 100, 100, 75, 0, 150, 100, 150],
  [100, 100, 100, 100, 100, 75, 150, 0, 100, 0],
  [70, 100, 100, 100, 100, 75, 80, 80, 150, 125],
  [100, 100, 100, 80, 100, 50, 150, 0, 125, 0],
];

const lv3Data = [
  [100, 100, 100, 100, 100, 100, 100, 100, 50, 100],
  [100, 0, 100, 200, 70, 125, 100, 100, 100, 100],
  [100, 100, 0, 70, 200, 125, 100, 100, 100, 100],
  [100, 70, 200, 0, 100, 125, 100, 100, 100, 175],
  [100, 200, 70, 100, 0, 125, 100, 100, 100, 100],
  [100, 125, 125, 125, 125, 0, 50, 50, 50, 25],
  [100, 100, 100, 100, 100, 50, 0, 175, 100, 175],
  [100, 100, 100, 100, 100, 50, 175, 0, 100, 0],
  [50, 100, 100, 100, 100, 50, 70, 70, 175, 150],
  [100, 100, 100, 70, 100, 25, 175, 0, 150, 0],
];

const lv4Data = [
  [100, 100, 100, 100, 100, 100, 100, 100, 0, 100],
  [100, 0, 100, 200, 60, 125, 100, 100, 100, 100],
  [100, 100, 0, 60, 200, 125, 100, 100, 100, 100],
  [100, 60, 200, 0, 100, 125, 100, 100, 100, 200],
  [100, 200, 60, 100, 0, 125, 100, 100, 100, 100],
  [100, 125, 125, 125, 125, 0, 50, 50, 50, 0],
  [100, 100, 100, 100, 100, 50, 0, 200, 100, 200],
  [100, 100, 100, 100, 100, 50, 200, 0, 100, 0],
  [0, 100, 100, 100, 100, 50, 60, 60, 200, 175],
  [100, 100, 100, 60, 100, 0, 200, 0, 175, 0],
];

// 四個等級的數據容器
const elementData = [lv1Data, lv2Data, lv3Data, lv4Data];

onMounted(() => {
  document.title = 'RO樂園-屬性相剋';
})
</script>

<style scoped>
/* 仿 RPG 的微陰影與字體 */
td, th {
  text-shadow: 1px 1px 0px rgba(0,0,0,0.1);
  min-width: 50px;
}

@media print {
  .no-print { display: none; }
  body { background: white; padding: 0; }
  .bg-[#1c120a] { background: white !important; }
}

/* 滾動條樣式優化 */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #5c4033;
  border-radius: 4px;
}
</style>