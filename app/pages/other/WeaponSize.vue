<template>
  <div class="min-h-screen bg-[#3A2C1F] p-4 md:p-8 font-sans flex items-center justify-center">

    <div class="w-full max-w-2xl bg-[#f2e6d9] rounded-lg shadow-2xl overflow-hidden border-4 border-[#5c4033]">

      <div class="bg-[#5c4033] text-[#f2e6d9] py-3 px-6 flex justify-between items-center border-b-2 border-[#3d2b1f]">
        <div class="flex flex-col">
          <span class="font-bold tracking-widest text-lg">武器體型表</span>
        </div>

      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-center border-collapse">
          <thead>
          <tr class="bg-[#d9c5b2] text-[#5c4033] text-sm font-bold">
            <th class="p-4 border-r border-[#5c4033]/20 relative w-1/4">
              <div class="flex flex-col items-center justify-center">
                <span class="text-[10px] text-stone-500">武器種類</span>
                <hr class="w-full border-[#5c4033]/20 my-1">
                <span class="text-[10px] text-stone-500">魔物大小</span>
              </div>
            </th>
            <th class="p-4 border-r border-[#5c4033]/20">
              <div class="bg-[#4d7c8a] text-white rounded py-1 px-2 flex items-center justify-center gap-1 shadow-inner">
                <span class="text-xs">S</span> 小型
              </div>
            </th>
            <th class="p-4 border-r border-[#5c4033]/20">
              <div class="bg-[#c27a3f] text-white rounded py-1 px-2 flex items-center justify-center gap-1 shadow-inner">
                <span class="text-xs">M</span> 中型
              </div>
            </th>
            <th class="p-4">
              <div class="bg-[#8b5cf6] text-white rounded py-1 px-2 flex items-center justify-center gap-1 shadow-inner">
                <span class="text-xs">L</span> 大型
              </div>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="w in sizeModifiers" :key="w.name" class="border-t border-[#5c4033]/10 hover:bg-white/30 transition-colors">
            <td class="p-3 border-r border-[#5c4033]/10 font-bold text-[#3d2b1f] bg-[#e8dbc9] flex items-center gap-3 px-5">
              <span class="text-xl drop-shadow-sm">{{ w.icon }}</span>
              <span class="text-sm tracking-wide">{{ w.name }}</span>
            </td>
            <td :class="getPenaltyClass(w.s)" class="p-3 border-r border-[#5c4033]/10 font-black text-lg">
              <div class="rounded py-1">{{ w.s }}%</div>
            </td>
            <td :class="getPenaltyClass(w.m)" class="p-3 border-r border-[#5c4033]/10 font-black text-lg">
              <div class="rounded py-1">{{ w.m }}%</div>
            </td>
            <td :class="getPenaltyClass(w.l)" class="p-3 font-black text-lg">
              <div class="rounded py-1">{{ w.l }}%</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-[#d9c5b2]/50 p-3 text-center text-[10px] text-[#5c4033]/60 italic">
        * 數據僅供參考，實際傷害受技能、卡片、裝備等額外修正影響。
      </div>
    </div>

  </div>
</template>

<script setup>
// 完全模擬圖片中的數據
const sizeModifiers = [
  { name: '空手', icon: '👊', s: 100, m: 100, l: 100 },
  { name: '短劍', icon: '🗡️', s: 100, m: 75, l: 50 },
  { name: '單手劍', icon: '⚔️', s: 75, m: 100, l: 75 },
  { name: '雙手劍', icon: '⚔️', s: 75, m: 75, l: 100 },
  { name: '矛', icon: '🔱', s: 75, m: 75, l: 100 },
  { name: '矛(騎乘狀態)', icon: '🏇', s: 75, m: 100, l: 100 },
  { name: '斧', icon: '🪓', s: 50, m: 75, l: 100 },
  { name: '鈍器', icon: '🔨', s: 75, m: 100, l: 100 },
  { name: '手杖', icon: '🪄', s: 100, m: 100, l: 100 },
  { name: '弓', icon: '🏹', s: 100, m: 100, l: 75 },
  { name: '拳刃', icon: '💅', s: 75, m: 100, l: 75 },
  { name: '書', icon: '📖', s: 100, m: 100, l: 50 },
  { name: '拳套', icon: '🥊', s: 100, m: 100, l: 75 },
  { name: '樂器', icon: '🎸', s: 75, m: 100, l: 75 },
  { name: '鞭子', icon: '🐍', s: 75, m: 100, l: 75 },
  { name: '風魔手裏劍', icon: '💠', s: 75, m: 75, l: 100 },
];

/**
 * 根據數值回傳對應的 CSS 樣式 (參考圖片配色)
 * 100% -> 深綠色
 * 75%  -> 淺褐色/橘色
 * 50%  -> 紅色/磚紅色
 */
function getPenaltyClass(value) {
  if (value === 100) return 'text-[#f2f2f2] bg-[#536153]'; // 深綠底白字
  if (value === 75) return 'text-[#f2f2f2] bg-[#a88a64]';  // 褐色底白字
  return 'text-[#f2f2f2] bg-[#cc5a4b]';                 // 紅底白字
}
</script>

<style scoped>
/* 隱藏列印時的背景雜色，確保墨水節省且清晰 */
@media print {
  .no-print { display: none; }
  body { background: white; padding: 0; }
  .bg-[#1c120a] { background: white !important; }
}

/* 微調字體使其更接近傳統 RPG 質感 */
td, th {
  text-shadow: 1px 1px 0px rgba(0,0,0,0.1);
}
</style>