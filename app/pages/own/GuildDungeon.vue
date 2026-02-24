<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-8 font-sans">
    <div class="max-w-[1600px] mx-auto mb-8 border-b border-[#5e4b37] pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-[#f1d483]">副本隊伍組隊系統</h1>
      </div>
      <div class="flex gap-4">
        <button @click="resetAll" class="bg-[#5e4b37] hover:bg-[#8b3a3a] text-white px-6 py-2 rounded shadow-md transition font-bold">
          全部重置
        </button>
      </div>
    </div>

    <div class="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div class="xl:col-span-3 space-y-6">
        <h2 class="text-[#f1d483] font-bold text-xl flex items-center justify-between w-full">
          <div class="flex items-center">
            <span class="mr-2">📜</span> 角色名冊 ({{ allChars.length }} 員)
          </div>
          <div class="flex gap-2">
            <button @click="setAllCollapse(false)" class="text-[10px] bg-[#5e4b37] hover:bg-[#8b7a64] text-[#f1d483] px-2 py-1 rounded transition border border-[#f1d483]/30">
              展開全部
            </button>
            <button @click="setAllCollapse(true)" class="text-[10px] bg-[#5e4b37] hover:bg-[#8b7a64] text-[#f1d483] px-2 py-1 rounded transition border border-[#f1d483]/30">
              收起全部
            </button>
          </div>
        </h2>

        <div class="space-y-3 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
          <div v-for="(group, gIdx) in charGroups" :key="gIdx" class="bg-[#3d2b1f] border border-[#5e4b37] rounded overflow-hidden">
            <div
                @click="toggleGroup(gIdx)"
                class="bg-[#2c1e14] px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-[#4a3728] transition-colors"
            >
              <div class="flex items-center gap-2 overflow-hidden">
                <span class="text-[#f1d483] text-[10px] font-bold bg-[#5e4b37] px-2 py-0.5 rounded shrink-0">帳號</span>
                <span class="text-[#e0d3b8] font-bold truncate">
                  {{ group.name || group.role[0]?.name || '未命名組別' }}
                </span>
              </div>
              <span class="transform transition-transform duration-300 text-[#a6937c] text-xs" :class="{ 'rotate-180': collapsedGroups[gIdx] }">
                ▼
              </span>
            </div>

            <div v-show="!collapsedGroups[gIdx]" class="p-4 grid gap-3 border-t border-[#5e4b37] bg-[#3d2b1f]">
              <template v-for="char in group.role" :key="char.name">
                <div
                    v-if="char.name"
                    class="bg-[#f5f1e6] text-[#2c1e14] p-3 rounded-lg shadow-md relative transition-all flex items-center gap-3"
                    :class="char.assignedTo ? 'opacity-40 grayscale' : 'hover:bg-[#fffcf5] border-2 border-transparent hover:border-[#f1d483]'"
                >
                  <div class="relative shrink-0 pt-1 pb-4">
                    <div class="w-14 h-14 bg-[#ede4cf] rounded-full border-2 border-[#dcd2bb] flex items-center justify-center overflow-hidden shadow-inner">
                      <img :src="getJobImg(char.job)" :alt="char.job" class="w-10 h-10 object-contain drop-shadow-md">
                    </div>
                    <span class="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#5e4b37] text-[#f1d483] text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap border border-[#2c1e14]">
                      {{ char.job || '冒險者' }}
                    </span>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center mb-1">
                      <div class="font-black text-lg text-[#4a3728] truncate">{{ char.name }}</div>
                      <span v-if="char.level" class="text-[#8d7a64] text-[10px] font-mono font-bold">Lv.{{ char.level }}</span>
                    </div>

                    <div v-if="!char.assignedTo" class="grid grid-cols-4 gap-1 mt-1">
                      <button
                          v-for="sIdx in 4" :key="sIdx"
                          @click="addToSquad(char, sIdx - 1, gIdx)"
                          :disabled="isAccountInSquad(gIdx, sIdx - 1)"
                          class="py-1 text-[11px] font-bold rounded border transition"
                          :class="getButtonClass(sIdx - 1, gIdx)"
                      >
                        {{ String.fromCharCode(64 + sIdx) }}
                      </button>
                    </div>
                    <div v-else class="text-center py-1 mt-1 bg-[#dcd2bb] text-[#8d7a64] text-xs font-bold rounded">
                      隊伍 {{ String.fromCharCode(64 + char.assignedTo) }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="xl:col-span-9 space-y-6">
        <h2 class="text-[#f1d483] font-bold text-xl flex items-center">
          <span class="mr-2">⚔️</span> 隊伍編成結果
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
          <div v-for="(squad, sIdx) in squads" :key="sIdx" class="bg-[#f5f1e6] rounded shadow-xl border-t-8 flex flex-col"
               :class="getSquadColor(sIdx).border">

            <div class="p-4 border-b border-[#dcd2bb] flex justify-between items-center">
              <h3 class="font-black text-xl text-[#2c1e14]">隊伍 {{ String.fromCharCode(64 + sIdx + 1) }}</h3>
              <span class="bg-white/40 px-2 py-0.5 rounded text-[10px] font-bold text-[#8d7a64]">SQUAD {{ String.fromCharCode(64 + sIdx + 1) }}</span>
            </div>

            <div class="p-3 flex-1 min-h-[450px] space-y-3">
              <div v-for="member in squad" :key="member.name" class="bg-white border border-[#e8dfc8] p-3 rounded-xl shadow-sm flex items-center group relative min-h-[85px]">
                <div class="relative shrink-0 pt-1 pb-3">
                  <div class="w-12 h-12 bg-[#f8f5ee] rounded-full border border-[#dcd2bb] flex items-center justify-center overflow-hidden shadow-sm">
                    <img :src="getJobImg(member.job)" :alt="member.job" class="w-8 h-8 object-contain">
                  </div>
                  <span class="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap text-white font-bold border border-white/20 shadow-sm"
                        :style="{ backgroundColor: getSquadColor(sIdx).tagBg }">
                    {{ member.job || '無' }}
                  </span>
                </div>
                <div class="flex-1 text-center px-4">
                  <span class="text-[#2c1e14] font-black text-lg block truncate leading-tight">{{ member.name }}</span>
                  <span v-if="member.level" class="text-[#8d7a64] text-[10px] font-mono font-bold">Lv.{{ member.level }}</span>
<!--                  <span v-if="member.guild" class="text-[#5b8fa4] text-[9px] block">{{ member.guild }}</span>-->
                </div>
                <div class="w-8 shrink-0 flex justify-end">
                  <button @click="removeFromSquad(member)" class="text-[#d1cfcf] hover:text-[#8b3a3a] transition p-1">
                    <span class="text-xl">✕</span>
                  </button>
                </div>
              </div>
              <div v-if="squad.length === 0" class="h-32 flex items-center justify-center text-[#c2b9a3] italic border-2 border-dashed border-[#dcd2bb] rounded-xl mt-4">
                尚未配置隊員
              </div>
            </div>

            <div class="p-4 bg-[#ede4cf] border-t border-[#dcd2bb] rounded-b-lg">
              <div class="flex justify-between items-center text-[#4a3728] font-bold">
                <span class="text-sm">當前角色數量</span>
                <span class="text-xl font-mono px-3 py-0.5 bg-white/40 rounded-lg shadow-sm">
                  {{ squad.length }} <span class="text-xs">人</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// 根據您的資料結構定義的職位映射
const jobFileMap = {
  '祭師': '祭師', '鐵匠': '鐵匠', '騎士': '騎士', '詩人': '詩人',
  '刺客': '刺客', '賢者': '賢者', '巫師': '巫師', '練金': '練金',
  '十字軍': '十字軍', '舞孃': '舞孃', '武僧': '祭師', '獵人': '詩人',
  '流氓': '流氓'
};

const getJobImg = (job) => {
  const fileName = jobFileMap[job] || '詩人'; // 預設頭像
  return `/images/profession/role/${fileName}.png`;
};

const squadThemes = [
  { border: 'border-[#5b8fa4]', tagBg: '#5b8fa4', btn: 'border-[#5b8fa4] text-[#5b8fa4] hover:bg-[#5b8fa4] hover:text-white' },
  { border: 'border-[#8fa45b]', tagBg: '#8fa45b', btn: 'border-[#8fa45b] text-[#8fa45b] hover:bg-[#8fa45b] hover:text-white' },
  { border: 'border-[#a47a5b]', tagBg: '#a47a5b', btn: 'border-[#a47a5b] text-[#a47a5b] hover:bg-[#a47a5b] hover:text-white' },
  { border: 'border-[#8e5ba4]', tagBg: '#8e5ba4', btn: 'border-[#8e5ba4] text-[#8e5ba4] hover:bg-[#8e5ba4] hover:text-white' }
];

const getSquadColor = (sIdx) => squadThemes[sIdx];


// 抓取外部 JSON 資料的函數
const fetchRoles = async () => {
  try {
    // 指向你 public 資料夾下的路徑
    const response = await fetch('/data/roles.json');
    const data = await response.json();

    // 處理資料：補上 assignedTo 狀態
    charGroups.value = data.map(g => ({
      ...g,
      role: g.role.map(r => ({ ...r, assignedTo: null }))
    }));

    // 初始化摺疊狀態 (預設全部收起)
    charGroups.value.forEach((_, idx) => {
      collapsedGroups.value[idx] = true;
    });

    // 資料抓完後，再載入本地的排班存檔
    loadFromLocal();
  } catch (error) {
    console.error("載入角色資料失敗:", error);
  }
};

// 批次設定所有組別的展開或收起
const setAllCollapse = (isCollapsed) => {
  charGroups.value.forEach((_, idx) => {
    collapsedGroups.value[idx] = isCollapsed;
  });
};
// 初始化資料 (為每個角色補上 assignedTo)
const charGroups = ref([]); // 初始設為空陣列

const collapsedGroups = ref({});
const toggleGroup = (idx) => collapsedGroups.value[idx] = !collapsedGroups.value[idx];

// 儲存邏輯 (Key 改為 v4 避免衝突)
const saveToLocal = () => {
  if (charGroups.value.length === 0) return; // 沒資料就不存
  const assignmentData = charGroups.value.flatMap(g => g.role).filter(r => r.name).map(c => ({
    name: c.name,
    assignedTo: c.assignedTo
  }));
  localStorage.setItem('squad_assignments_v4', JSON.stringify(assignmentData));
};

const loadFromLocal = () => {
  const saved = localStorage.getItem('squad_assignments_v4');
  if (saved && charGroups.value.length > 0) {
    const savedData = JSON.parse(saved);
    charGroups.value.forEach(group => {
      group.role.forEach(char => {
        const match = savedData.find(d => d.name === char.name);
        if (match) char.assignedTo = match.assignedTo;
      });
    });
  }
};

watch(charGroups, () => saveToLocal(), { deep: true });
// 頁面掛載時，將所有組別預設為「收起」(true)
onMounted(() => {

  // --- 新增這行來修改標籤名稱 ---
  document.title = "副本隊伍組隊系統";
  // -------------------------
  fetchRoles(); // 啟動時抓取資料
  loadFromLocal(); // 讀取排班存檔

  // 遍歷所有組別，將狀態設為 true (收起)
  charGroups.value.forEach((_, idx) => {
    collapsedGroups.value[idx] = true;
  });
});
const allChars = computed(() => charGroups.value.flatMap(g => g.role).filter(r => r.name));
const squads = computed(() => [1, 2, 3, 4].map(id => allChars.value.filter(c => c.assignedTo === id)));

const isAccountInSquad = (gIdx, sIdx) => {
  return squads.value[sIdx].some(squadMember =>
      charGroups.value[gIdx].role.some(groupMember => groupMember.name === squadMember.name)
  );
};

const getButtonClass = (sIdx, gIdx) => {
  if (isAccountInSquad(gIdx, sIdx)) return 'bg-[#dcd2bb] text-[#b4a992] cursor-not-allowed border-transparent';
  return squadThemes[sIdx].btn;
};

const addToSquad = (char, sIdx, gIdx) => {
  if (!isAccountInSquad(gIdx, sIdx)) char.assignedTo = sIdx + 1;
};
const removeFromSquad = (char) => char.assignedTo = null;
const resetAll = () => allChars.value.forEach(c => c.assignedTo = null);

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #2c1e14; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #5e4b37; border-radius: 10px; }
</style>