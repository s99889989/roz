<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-8 font-sans">
    <div class="max-w-[1600px] mx-auto mb-8 border-b border-[#5e4b37] pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-[#f1d483]">副本多隊伍排班系統</h1>
        <p class="text-[#a6937c] text-sm mt-1">※ 資料將自動儲存於此瀏覽器中</p>
      </div>
      <div class="flex gap-4">
        <button @click="resetAll" class="bg-[#5e4b37] hover:bg-[#8b3a3a] text-white px-6 py-2 rounded shadow-md transition font-bold">
          全部重置
        </button>
      </div>
    </div>

    <div class="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div class="xl:col-span-3 space-y-6">
        <h2 class="text-[#f1d483] font-bold text-xl flex items-center">
          <span class="mr-2">📜</span> 角色名冊
        </h2>

        <div class="space-y-4 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
          <div v-for="(group, gIdx) in charGroups" :key="gIdx" class="bg-[#3d2b1f] border border-[#5e4b37] rounded p-4">
            <div class="text-[#a6937c] text-xs font-bold mb-3 border-b border-[#5e4b37] pb-1">
              帳號組別 {{ gIdx + 1 }}
            </div>

            <div class="grid gap-3">
              <div
                  v-for="char in group" :key="char.name"
                  class="bg-[#f5f1e6] text-[#2c1e14] p-3 rounded-lg shadow-md relative transition-all flex items-center gap-3"
                  :class="char.assignedTo ? 'opacity-40 grayscale' : 'hover:bg-[#fffcf5] border-2 border-transparent hover:border-[#f1d483]'"
              >
                <div class="relative shrink-0 pt-1 pb-4">
                  <div class="w-14 h-14 bg-[#ede4cf] rounded-full border-2 border-[#dcd2bb] flex items-center justify-center overflow-hidden shadow-inner">
                    <img :src="getJobImg(char.job)" :alt="char.job" class="w-10 h-10 object-contain drop-shadow-md">
                  </div>
                  <span class="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#5e4b37] text-[#f1d483] text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap border border-[#2c1e14]">
                    {{ char.job }}
                  </span>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-center mb-1">
                    <div class="font-black text-lg text-[#4a3728] truncate">{{ char.name }}</div>
                    <span class="text-[#8d7a64] text-[10px] font-mono font-bold">Lv.{{ char.level }}</span>
                  </div>

                  <div v-if="!char.assignedTo" class="grid grid-cols-4 gap-1 mt-1">
                    <button
                        v-for="sIdx in 4" :key="sIdx"
                        @click="addToSquad(char, sIdx - 1)"
                        :disabled="isAccountInSquad(char.groupId, sIdx - 1)"
                        class="py-1 text-[11px] font-bold rounded border transition"
                        :class="getButtonClass(sIdx - 1, char.groupId)"
                    >
                      {{ String.fromCharCode(64 + sIdx) }}
                    </button>
                  </div>
                  <div v-else class="text-center py-1 mt-1 bg-[#dcd2bb] text-[#8d7a64] text-xs font-bold rounded">
                    已在 隊伍 {{ String.fromCharCode(64 + char.assignedTo) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="xl:col-span-9 space-y-6">
        <h2 class="text-[#f1d483] font-bold text-xl flex items-center">
          <span class="mr-2">⚔️</span> 戰隊編成結果
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
          <div v-for="(squad, sIdx) in squads" :key="sIdx" class="bg-[#f5f1e6] rounded shadow-xl border-t-8 flex flex-col"
               :class="getSquadColor(sIdx).border">

            <div class="p-4 border-b border-[#dcd2bb] flex justify-between items-center">
              <h3 class="font-black text-xl text-[#2c1e14]">隊伍 {{ String.fromCharCode(64 + sIdx + 1) }}</h3>
              <span class="bg-white/50 px-2 py-0.5 rounded text-[10px] font-bold text-[#8d7a64]">ONLINE</span>
            </div>

            <div class="p-3 flex-1 min-h-[450px] space-y-3">
              <div v-for="member in squad" :key="member.name" class="bg-white border border-[#e8dfc8] p-3 rounded-xl shadow-sm flex items-center group relative min-h-[85px]">

                <div class="relative shrink-0 pt-1 pb-3">
                  <div class="w-12 h-12 bg-[#f8f5ee] rounded-full border border-[#dcd2bb] flex items-center justify-center overflow-hidden shadow-sm">
                    <img :src="getJobImg(member.job)" :alt="member.job" class="w-8 h-8 object-contain">
                  </div>
                  <span class="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap text-white font-bold border border-white/20 shadow-sm"
                        :style="{ backgroundColor: getSquadColor(sIdx).tagBg }">
                    {{ member.job }}
                  </span>
                </div>

                <div class="flex-1 text-center px-4">
                  <span class="text-[#2c1e14] font-black text-xl block truncate leading-tight">{{ member.name }}</span>
                  <span class="text-[#8d7a64] text-[10px] font-mono font-bold">Lv.{{ member.level }}</span>
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

const jobFileMap = {
  '祭師': '祭師', '鐵匠': '鐵匠', '騎士': '騎士', '詩人': '詩人',
  '刺客': '刺客', '賢者': '賢者', '巫師': '巫師', '練金': '練金',
  '十字軍': '十字軍', '舞孃': '舞孃'
};

const getJobImg = (job) => {
  const fileName = jobFileMap[job] || '詩人';
  return `/images/profession/role/${fileName}.png`;
};

const squadThemes = [
  { border: 'border-[#5b8fa4]', tagBg: '#5b8fa4', btn: 'border-[#5b8fa4] text-[#5b8fa4] hover:bg-[#5b8fa4] hover:text-white' },
  { border: 'border-[#8fa45b]', tagBg: '#8fa45b', btn: 'border-[#8fa45b] text-[#8fa45b] hover:bg-[#8fa45b] hover:text-white' },
  { border: 'border-[#a47a5b]', tagBg: '#a47a5b', btn: 'border-[#a47a5b] text-[#a47a5b] hover:bg-[#a47a5b] hover:text-white' },
  { border: 'border-[#8e5ba4]', tagBg: '#8e5ba4', btn: 'border-[#8e5ba4] text-[#8e5ba4] hover:bg-[#8e5ba4] hover:text-white' }
];

const getSquadColor = (sIdx) => squadThemes[sIdx];

const charGroups = ref([
  [
    { groupId: 1, job: '祭師', level: 85, name: '雷克洛德', assignedTo: null },
    { groupId: 1, job: '鐵匠', level: 71, name: '赫菲洛斯', assignedTo: null },
    { groupId: 1, job: '騎士', level: 74, name: '暗夜騎士', assignedTo: null },
    { groupId: 1, job: '詩人', level: 70, name: '艾倫米爾', assignedTo: null },
    { groupId: 1, job: '刺客', level: 70, name: '暗影凱爾', assignedTo: null },
    { groupId: 1, job: '賢者', level: 70, name: '亞德里安', assignedTo: null },
  ],
  [
    { groupId: 2, job: '詩人', level: 75, name: '搖頭土地公', assignedTo: null },
    { groupId: 2, job: '鐵匠', level: 73, name: '都是錢', assignedTo: null },
    { groupId: 2, job: '刺客', level: 75, name: '颺梟', assignedTo: null },
    { groupId: 2, job: '巫師', level: 80, name: '搖頭土地婆', assignedTo: null },
    { groupId: 2, job: '祭師', level: 79, name: '颺昍', assignedTo: null },
    { groupId: 2, job: '巫師', level: 70, name: '搖滾土地公', assignedTo: null },
  ],
  [
    { groupId: 3, job: '巫師', level: 71, name: '別打臉', assignedTo: null },
    { groupId: 3, job: '刺客', level: 65, name: '脀塒', assignedTo: null },
    { groupId: 3, job: '練金', level: 64, name: '湯兟儿', assignedTo: null },
    { groupId: 3, job: '十字軍', level: 80, name: '鰣胔鮶', assignedTo: null },
    { groupId: 3, job: '詩人', level: 65, name: '垠莤蓍儿', assignedTo: null },
  ],
  [
    { groupId: 4, job: '祭師', level: 83, name: 'Ice~', assignedTo: null },
    { groupId: 4, job: '練金', level: 60, name: 'PopCo', assignedTo: null },
    { groupId: 4, job: '賢者', level: 60, name: 'Ice~*', assignedTo: null },
    { groupId: 4, job: '舞孃', level: 60, name: 'Icd~*.', assignedTo: null },
    { groupId: 4, job: '騎士', level: 70, name: 'Mai~', assignedTo: null },
  ]
]);

// 儲存邏輯
const saveToLocal = () => {
  const assignmentData = charGroups.value.flat().map(c => ({
    name: c.name,
    assignedTo: c.assignedTo
  }));
  localStorage.setItem('squad_assignments', JSON.stringify(assignmentData));
};

const loadFromLocal = () => {
  const saved = localStorage.getItem('squad_assignments');
  if (saved) {
    const savedData = JSON.parse(saved);
    charGroups.value.forEach(group => {
      group.forEach(char => {
        const match = savedData.find(d => d.name === char.name);
        if (match) char.assignedTo = match.assignedTo;
      });
    });
  }
};

watch(charGroups, () => { saveToLocal(); }, { deep: true });
onMounted(() => { loadFromLocal(); });

const allChars = computed(() => charGroups.value.flat());
const squads = computed(() => [1, 2, 3, 4].map(id => allChars.value.filter(c => c.assignedTo === id)));
const isAccountInSquad = (groupId, sIdx) => squads.value[sIdx].some(c => c.groupId === groupId);

const getButtonClass = (sIdx, groupId) => {
  if (isAccountInSquad(groupId, sIdx)) return 'bg-[#dcd2bb] text-[#b4a992] cursor-not-allowed border-transparent';
  return squadThemes[sIdx].btn;
};

const addToSquad = (char, sIdx) => { if (!isAccountInSquad(char.groupId, sIdx)) char.assignedTo = sIdx + 1; };
const removeFromSquad = (char) => char.assignedTo = null;
const resetAll = () => { allChars.value.forEach(c => c.assignedTo = null); };
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #2c1e14; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #5e4b37; border-radius: 10px; }
</style>