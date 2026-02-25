<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-8 font-sans">
    <div class="max-w-[1600px] mx-auto mb-8 border-b border-[#5e4b37] pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-[#f1d483]">副本隊伍組隊系統</h1>
        <p class="text-[#a6937c] text-xs mt-1">※ 讀取自 roles2.json | 自動儲存設定</p>
      </div>

      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center bg-[#3d2b1f] px-3 py-2 rounded border border-[#5e4b37] shadow-inner">
          <span class="text-[#f1d483] text-sm font-bold mr-3">隊伍數量設定:</span>
          <select v-model="squadCount" class="bg-[#2c1e14] text-[#f1d483] outline-none font-mono border border-[#5e4b37] rounded px-2 py-1 cursor-pointer">
            <option v-for="n in 12" :key="n" :value="n">{{ n }} 隊</option>
          </select>
        </div>

        <button @click="resetAll" class="bg-[#5e4b37] hover:bg-[#8b3a3a] text-white px-6 py-2 rounded shadow-md transition font-bold border border-white/10">
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

        <div v-if="charGroups.length === 0" class="text-[#a6937c] italic py-10 text-center bg-[#3d2b1f] rounded">
          正在讀取角色資料...
        </div>

        <div v-else class="space-y-3 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar">
          <div v-for="(group, gIdx) in charGroups" :key="gIdx" class="bg-[#3d2b1f] border border-[#5e4b37] rounded overflow-hidden">
            <div @click="toggleGroup(gIdx)" class="bg-[#2c1e14] px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-[#4a3728] transition-colors">
              <div class="flex items-center gap-2 overflow-hidden">
                <span class="text-[#f1d483] text-[10px] font-bold bg-[#5e4b37] px-2 py-0.5 rounded shrink-0">帳號</span>
                <span class="text-[#e0d3b8] font-bold truncate">
                  {{ group.name || group.role[0]?.name || '未命名組別' }}
                </span>
              </div>
              <span class="transform transition-transform duration-300 text-[#a6937c] text-xs" :class="{ 'rotate-180': !collapsedGroups[gIdx] }">
                ▼
              </span>
            </div>

            <div v-show="!collapsedGroups[gIdx]" class="p-4 grid gap-3 border-t border-[#5e4b37] bg-[#3d2b1f]">
              <template v-for="char in group.role" :key="char.name">
                <div v-if="char.name" class="bg-[#f5f1e6] text-[#2c1e14] p-3 rounded-lg shadow-md relative transition-all flex items-center gap-3"
                     :class="char.assignedTo ? 'opacity-40 grayscale scale-95' : 'hover:bg-[#fffcf5] border-2 border-transparent hover:border-[#f1d483]'">

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

                    <div v-if="!char.assignedTo" class="grid grid-cols-4 sm:grid-cols-6 gap-1 mt-1">
                      <button v-for="sIdx in squadCount" :key="sIdx"
                              @click="addToSquad(char, sIdx - 1, gIdx)"
                              :disabled="isAccountInSquad(gIdx, sIdx - 1)"
                              class="py-1 text-[10px] font-bold rounded border transition uppercase"
                              :class="getButtonClass(sIdx - 1, gIdx)">
                        {{ String.fromCharCode(64 + sIdx) }}
                      </button>
                    </div>
                    <div v-else class="text-center py-1 mt-1 bg-[#dcd2bb] text-[#8d7a64] text-xs font-bold rounded">
                      已分配至 隊伍 {{ String.fromCharCode(64 + char.assignedTo) }}
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
          <div v-for="(squad, sIdx) in squads" :key="sIdx" class="bg-[#f5f1e6] rounded shadow-xl border-t-8 flex flex-col transition-all duration-300"
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
                  <span v-if="member.guild" class="text-[#5b8fa4] text-[9px] block">{{ member.guild }}</span>
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

// --- 基礎設定與配色 ---
const squadCount = ref(4); // 預設隊伍數量

const jobFileMap = {
  '祭師': '祭師', '鐵匠': '鐵匠', '騎士': '騎士', '詩人': '詩人',
  '刺客': '刺客', '賢者': '賢者', '巫師': '巫師', '練金': '練金',
  '十字軍': '十字軍', '舞孃': '舞孃', '武僧': '祭師', '獵人': '詩人'
};

const baseThemes = [
  { border: 'border-[#5b8fa4]', tagBg: '#5b8fa4', btn: 'border-[#5b8fa4] text-[#5b8fa4] hover:bg-[#5b8fa4] hover:text-white' },
  { border: 'border-[#8fa45b]', tagBg: '#8fa45b', btn: 'border-[#8fa45b] text-[#8fa45b] hover:bg-[#8fa45b] hover:text-white' },
  { border: 'border-[#a47a5b]', tagBg: '#a47a5b', btn: 'border-[#a47a5b] text-[#a47a5b] hover:bg-[#a47a5b] hover:text-white' },
  { border: 'border-[#8e5ba4]', tagBg: '#8e5ba4', btn: 'border-[#8e5ba4] text-[#8e5ba4] hover:bg-[#8e5ba4] hover:text-white' },
  { border: 'border-[#a45b5b]', tagBg: '#a45b5b', btn: 'border-[#a45b5b] text-[#a45b5b] hover:bg-[#a45b5b] hover:text-white' }
];

const getJobImg = (job) => {
  const fileName = jobFileMap[job] || '詩人';
  return `/images/profession/role/${fileName}.png`;
};

const getSquadColor = (sIdx) => baseThemes[sIdx % baseThemes.length];

// --- 資料狀態 ---
const charGroups = ref([]);
const collapsedGroups = ref({});

// --- 資料存取邏輯 ---
const fetchRoles = async () => {
  try {
    const response = await fetch('/data/roles2.json');
    const data = await response.json();

    charGroups.value = data.map(g => ({
      ...g,
      role: g.role.map(r => ({ ...r, assignedTo: null }))
    }));

    // 初始化：預設全部收起 (true)
    charGroups.value.forEach((_, idx) => {
      collapsedGroups.value[idx] = true;
    });

    loadFromLocal();
  } catch (error) {
    console.error("資料載入失敗:", error);
  }
};

const saveToLocal = () => {
  if (charGroups.value.length === 0) return;
  const assignmentData = charGroups.value.flatMap(g => g.role).filter(r => r.name).map(c => ({
    name: c.name,
    assignedTo: c.assignedTo
  }));
  localStorage.setItem('squad_assignments_v6', JSON.stringify(assignmentData));
  localStorage.setItem('squad_config_count', squadCount.value);
};

const loadFromLocal = () => {
  // 載入隊伍數量設定
  const savedCount = localStorage.getItem('squad_config_count');
  if (savedCount) squadCount.value = parseInt(savedCount);

  // 載入排班設定
  const saved = localStorage.getItem('squad_assignments_v6');
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

// --- 計算屬性 ---
const allChars = computed(() => charGroups.value.flatMap(g => g.role).filter(r => r.name));

const squads = computed(() => {
  const result = [];
  for (let i = 1; i <= squadCount.value; i++) {
    result.push(allChars.value.filter(c => c.assignedTo === i));
  }
  return result;
});

// --- 操作函數 ---
const toggleGroup = (idx) => {
  collapsedGroups.value[idx] = !collapsedGroups.value[idx];
};

const setAllCollapse = (isCollapsed) => {
  charGroups.value.forEach((_, idx) => {
    collapsedGroups.value[idx] = isCollapsed;
  });
};

const isAccountInSquad = (gIdx, sIdx) => {
  return squads.value[sIdx].some(squadMember =>
      charGroups.value[gIdx].role.some(groupMember => groupMember.name === squadMember.name)
  );
};

const getButtonClass = (sIdx, gIdx) => {
  if (isAccountInSquad(gIdx, sIdx)) return 'bg-[#dcd2bb] text-[#b4a992] cursor-not-allowed border-transparent';
  return getSquadColor(sIdx).btn;
};

const addToSquad = (char, sIdx, gIdx) => {
  if (!isAccountInSquad(gIdx, sIdx)) char.assignedTo = sIdx + 1;
};

const removeFromSquad = (char) => {
  char.assignedTo = null;
};

const resetAll = () => {
  allChars.value.forEach(c => c.assignedTo = null);
};

// --- 生命週期與監聽 ---
watch(charGroups, () => saveToLocal(), { deep: true });
watch(squadCount, (newVal) => {
  // 如果縮減隊伍，自動踢出超出範圍的人
  allChars.value.forEach(char => {
    if (char.assignedTo > newVal) char.assignedTo = null;
  });
  saveToLocal();
});

onMounted(() => {
  document.title = "副本隊伍組隊系統";
  fetchRoles();
});
</script>

<style scoped>
/* 客製化滾動條 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #2c1e14; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #5e4b37; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8d7a64; }

/* 簡單的排版優化 */
select option {
  background-color: #3d2b1f;
  color: #f1d483;
}
</style>