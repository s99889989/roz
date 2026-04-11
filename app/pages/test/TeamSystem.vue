<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-8 font-sans">

    <!-- Header -->
    <div class="max-w-[1600px] mx-auto mb-8 border-b border-[#5e4b37] pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-[#f1d483]">副本隊伍組隊系統</h1>
        <p class="text-[#a6937c] text-xs mt-1">※ 讀取自後端 API | 分配同步儲存</p>
      </div>
      <div class="flex flex-wrap gap-3 items-center">
        <button @click="openAddAccountModal" class="bg-[#4a7c59] hover:bg-[#3d6849] text-white px-5 py-2 rounded shadow-md transition font-bold border border-white/10">
          ＋ 新增帳號
        </button>
        <div class="flex items-center bg-[#3d2b1f] px-3 py-2 rounded border border-[#5e4b37] shadow-inner">
          <span class="text-[#f1d483] text-sm font-bold mr-3">隊伍數量:</span>
          <select v-model="squadCount" class="bg-[#2c1e14] text-[#f1d483] outline-none font-mono border border-[#5e4b37] rounded px-2 py-1 cursor-pointer">
            <option v-for="n in 12" :key="n" :value="n">{{ n }} 隊</option>
          </select>
        </div>
        <button @click="resetAll" class="bg-[#5e4b37] hover:bg-[#8b3a3a] text-white px-5 py-2 rounded shadow-md transition font-bold border border-white/10">
          全部重置
        </button>
      </div>
    </div>

    <div class="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">

      <!-- ══ 左側角色名冊 ══ -->
      <div class="xl:col-span-3 space-y-4">
        <h2 class="text-[#f1d483] font-bold text-xl flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <span>📜</span>
            <span>角色名冊</span>
            <span class="text-sm font-normal text-[#a6937c]">({{ allChars.length }} 員)</span>
          </div>
          <div class="flex gap-2">
            <button @click="setAllCollapse(false)" class="text-[10px] bg-[#5e4b37] hover:bg-[#8b7a64] text-[#f1d483] px-2 py-1 rounded transition border border-[#f1d483]/30">展開全部</button>
            <button @click="setAllCollapse(true)"  class="text-[10px] bg-[#5e4b37] hover:bg-[#8b7a64] text-[#f1d483] px-2 py-1 rounded transition border border-[#f1d483]/30">收起全部</button>
          </div>
        </h2>

        <!-- 圖例說明 -->
        <div class="flex gap-3 text-[10px] text-[#a6937c] flex-wrap">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#a0c878] inline-block"></span>支援/BUFF（不進副本）</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#8d7a64] inline-block"></span>已分配至隊伍</span>
        </div>

        <div v-if="charGroups.length === 0" class="text-[#a6937c] italic py-10 text-center bg-[#3d2b1f] rounded">
          正在讀取角色資料...
        </div>

        <div v-else class="space-y-3 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar">
          <div v-for="(group, gIdx) in charGroups" :key="gIdx"
               class="bg-[#3d2b1f] border border-[#5e4b37] rounded overflow-hidden">

            <!-- 帳號標頭 -->
            <div class="bg-[#2c1e14] px-4 py-3 flex justify-between items-center">
              <div @click="toggleGroup(gIdx)" class="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer hover:opacity-80 transition-opacity">
                <span class="text-[#f1d483] text-[10px] font-bold bg-[#5e4b37] px-2 py-0.5 rounded shrink-0">帳號</span>
                <span class="text-[#e0d3b8] font-bold truncate">{{ group.name }}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button @click.stop="openEditAccountModal(group, gIdx)"
                        class="text-[10px] bg-[#4a6b5e] hover:bg-[#5b8573] text-[#a8f0c8] px-2 py-0.5 rounded border border-[#a8f0c8]/20 transition">編輯</button>
                <button @click.stop="confirmDeleteAccount(group)"
                        class="text-[10px] bg-[#6b4a4a] hover:bg-[#853b3b] text-[#f0a8a8] px-2 py-0.5 rounded border border-[#f0a8a8]/20 transition">刪除</button>
                <span @click="toggleGroup(gIdx)"
                      class="transform transition-transform duration-300 text-[#a6937c] text-xs cursor-pointer"
                      :class="{ 'rotate-180': !collapsedGroups[gIdx] }">▼</span>
              </div>
            </div>

            <!-- 角色列表 -->
            <div v-show="!collapsedGroups[gIdx]" class="p-3 grid gap-2 border-t border-[#5e4b37]">
              <template v-for="char in group.role" :key="char.name">
                <div v-if="char.name"
                     class="bg-[#f5f1e6] text-[#2c1e14] p-2.5 rounded-lg shadow-md relative transition-all flex items-center gap-2"
                     :class="[
                       char.isSupport ? 'border-2 border-[#a0c878]' :
                       char.assignedTo ? 'opacity-40 grayscale scale-95' :
                       'hover:bg-[#fffcf5] border-2 border-transparent hover:border-[#f1d483]'
                     ]">

                  <!-- 職業圖示 -->
                  <div class="relative shrink-0 pt-1 pb-4">
                    <div class="w-12 h-12 bg-[#ede4cf] rounded-full border-2 border-[#dcd2bb] flex items-center justify-center overflow-hidden shadow-inner">
                      <img :src="getJobImg(char.job)" :alt="char.job" class="w-9 h-9 object-contain drop-shadow-md">
                    </div>
                    <span class="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#5e4b37] text-[#f1d483] text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap border border-[#2c1e14]">
                      {{ char.job || '冒險者' }}
                    </span>
                  </div>

                  <!-- 名稱 & 操作 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center mb-1">
                      <div class="font-black text-base text-[#4a3728] truncate leading-tight">{{ char.name }}</div>
                      <div class="flex items-center gap-1 shrink-0">
                        <span v-if="char.level" class="text-[#8d7a64] text-[10px] font-mono font-bold">Lv.{{ char.level }}</span>
                        <!-- 支援切換按鈕 -->
                        <button @click="toggleSupport(char)"
                                :title="char.isSupport ? '取消支援模式' : '設為支援/BUFF'"
                                class="text-[10px] px-1.5 py-0.5 rounded border transition font-bold"
                                :class="char.isSupport
                                  ? 'bg-[#a0c878] text-[#2c1e14] border-[#7aaa4a]'
                                  : 'bg-transparent text-[#8d7a64] border-[#c5b99a] hover:border-[#a0c878] hover:text-[#5a8a2a]'">
                          🎵
                        </button>
                      </div>
                    </div>

                    <!-- 支援標籤 -->
                    <div v-if="char.isSupport" class="text-center py-1 mt-0.5 bg-[#d4edb8] text-[#4a7a1a] text-[10px] font-bold rounded border border-[#a0c878]">
                      🎵 外部支援 / BUFF
                    </div>
                    <!-- 已分配 -->
                    <div v-else-if="char.assignedTo" class="text-center py-1 mt-0.5 bg-[#dcd2bb] text-[#8d7a64] text-[10px] font-bold rounded">
                      已分配至 隊伍 {{ String.fromCharCode(64 + char.assignedTo) }}
                    </div>
                    <!-- 分配按鈕 -->
                    <div v-else class="grid grid-cols-4 sm:grid-cols-6 gap-1 mt-1">
                      <button v-for="sIdx in squadCount" :key="sIdx"
                              @click="addToSquad(char, sIdx - 1, gIdx)"
                              :disabled="isAccountInSquad(gIdx, sIdx - 1)"
                              class="py-1 text-[10px] font-bold rounded border transition uppercase"
                              :class="getButtonClass(sIdx - 1, gIdx)">
                        {{ String.fromCharCode(64 + sIdx) }}
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ 右側隊伍編成 ══ -->
      <div class="xl:col-span-9 space-y-4">
        <h2 class="text-[#f1d483] font-bold text-xl flex items-center gap-2">
          <span>⚔️</span> 隊伍編成結果
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
          <div v-for="(squad, sIdx) in squads" :key="sIdx"
               class="bg-[#f5f1e6] rounded shadow-xl border-t-8 flex flex-col transition-all duration-300"
               :class="getSquadColor(sIdx).border">

            <!-- 隊伍標頭 -->
            <div class="p-4 border-b border-[#dcd2bb] flex justify-between items-center">
              <h3 class="font-black text-xl text-[#2c1e14]">隊伍 {{ String.fromCharCode(64 + sIdx + 1) }}</h3>
              <span class="bg-white/40 px-2 py-0.5 rounded text-[10px] font-bold text-[#8d7a64]">SQUAD {{ String.fromCharCode(64 + sIdx + 1) }}</span>
            </div>

            <!-- 職業組成列 -->
            <div class="px-3 pt-2 flex flex-wrap gap-1 min-h-[28px]">
              <span v-for="(count, job) in getJobComposition(squad.members)" :key="job"
                    class="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                    :style="{ backgroundColor: getSquadColor(sIdx).tagBg }">
                {{ job }} ×{{ count }}
              </span>
              <span v-if="Object.keys(getJobComposition(squad.members)).length === 0"
                    class="text-[9px] text-[#c2b9a3] italic">尚無成員</span>
            </div>

            <!-- 隊員列表 -->
            <div class="p-3 flex-1 min-h-[380px] space-y-2 mt-1">
              <div v-for="member in squad.members" :key="member.name"
                   class="bg-white border border-[#e8dfc8] p-2.5 rounded-xl shadow-sm flex items-center group relative">
                <div class="relative shrink-0 pt-1 pb-3">
                  <div class="w-11 h-11 bg-[#f8f5ee] rounded-full border border-[#dcd2bb] flex items-center justify-center overflow-hidden shadow-sm">
                    <img :src="getJobImg(member.job)" :alt="member.job" class="w-7 h-7 object-contain">
                  </div>
                  <span class="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] px-1.5 py-0.5 rounded-full whitespace-nowrap text-white font-bold border border-white/20 shadow-sm"
                        :style="{ backgroundColor: getSquadColor(sIdx).tagBg }">
                    {{ member.job || '無' }}
                  </span>
                </div>
                <div class="flex-1 text-center px-3">
                  <span class="text-[#2c1e14] font-black text-base block truncate leading-tight">{{ member.name }}</span>
                  <span v-if="member.level" class="text-[#8d7a64] text-[10px] font-mono font-bold">Lv.{{ member.level }}</span>
                </div>
                <button @click="removeFromSquad(member)" class="text-[#d1cfcf] hover:text-[#8b3a3a] transition p-1 opacity-0 group-hover:opacity-100">
                  <span class="text-lg">✕</span>
                </button>
              </div>
              <div v-if="squad.members.length === 0"
                   class="h-28 flex items-center justify-center text-[#c2b9a3] italic border-2 border-dashed border-[#dcd2bb] rounded-xl">
                尚未配置隊員
              </div>
            </div>

            <!-- 外部支援區 -->
            <div v-if="squad.supporters.length > 0"
                 class="px-3 pb-2 border-t border-dashed border-[#c8be9e] pt-2">
              <div class="text-[9px] text-[#8d7a64] font-bold mb-1">🎵 外部支援</div>
              <div class="flex flex-wrap gap-1">
                <span v-for="sup in squad.supporters" :key="sup.name"
                      class="text-[10px] bg-[#d4edb8] text-[#3d6818] px-2 py-0.5 rounded-full border border-[#a0c878] font-bold">
                  {{ sup.name }} <span class="opacity-60">{{ sup.job }}</span>
                </span>
              </div>
            </div>

            <!-- 底部統計 -->
            <div class="p-3 bg-[#ede4cf] border-t border-[#dcd2bb] rounded-b-lg">
              <div class="flex justify-between items-center text-[#4a3728] font-bold">
                <span class="text-xs">隊內人數</span>
                <span class="text-lg font-mono px-3 py-0.5 bg-white/40 rounded-lg shadow-sm">
                  {{ squad.members.length }} <span class="text-xs">人</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 新增/修改帳號 Modal ══ -->
    <div v-if="showAccountModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="closeAccountModal">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div class="px-6 py-4 border-b border-[#5e4b37] flex justify-between items-center sticky top-0 bg-[#2c1e14] z-10">
          <h3 class="text-[#f1d483] font-bold text-lg">{{ isEditMode ? '✏️ 修改帳號' : '➕ 新增帳號' }}</h3>
          <button @click="closeAccountModal" class="text-[#a6937c] hover:text-[#f1d483] text-2xl leading-none transition">✕</button>
        </div>

        <div class="p-6 space-y-5">
          <div>
            <label class="block text-[#f1d483] text-sm font-bold mb-1">帳號名稱 <span class="text-red-400">*</span></label>
            <input v-model="modalForm.name" type="text" placeholder="請輸入帳號名稱"
                   class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded px-3 py-2 text-[#e0d3b8] outline-none focus:border-[#f1d483] transition" />
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-[#f1d483] text-sm font-bold">角色列表</label>
              <button @click="addRoleRow" class="text-[11px] bg-[#4a7c59] hover:bg-[#3d6849] text-white px-3 py-1 rounded transition">＋ 新增角色</button>
            </div>
            <div class="space-y-2">
              <div v-for="(role, rIdx) in modalForm.roles" :key="rIdx"
                   class="bg-[#3d2b1f] border border-[#5e4b37] rounded p-3 grid grid-cols-12 gap-2 items-center">
                <div class="col-span-4">
                  <input v-model="role.name" type="text" placeholder="角色名稱"
                         class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-[#e0d3b8] text-sm outline-none focus:border-[#f1d483] transition" />
                </div>
                <div class="col-span-4">
                  <select v-model="role.job"
                          class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-[#e0d3b8] text-sm outline-none focus:border-[#f1d483] cursor-pointer transition">
                    <option value="">選擇職業</option>
                    <option v-for="job in jobList" :key="job" :value="job">{{ job }}</option>
                  </select>
                </div>
                <div class="col-span-3">
                  <input v-model.number="role.level" type="number" placeholder="等級" min="1" max="999"
                         class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-[#e0d3b8] text-sm outline-none focus:border-[#f1d483] transition" />
                </div>
                <div class="col-span-1 flex justify-center">
                  <button @click="removeRoleRow(rIdx)" :disabled="modalForm.roles.length <= 1"
                          class="text-[#f0a8a8] hover:text-red-400 text-lg leading-none transition disabled:opacity-30">✕</button>
                </div>
              </div>
            </div>
          </div>

          <p v-if="modalError" class="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-3 py-2">{{ modalError }}</p>
        </div>

        <div class="px-6 py-4 border-t border-[#5e4b37] flex justify-end gap-3">
          <button @click="closeAccountModal" class="px-5 py-2 bg-[#3d2b1f] hover:bg-[#5e4b37] text-[#a6937c] rounded border border-[#5e4b37] transition font-bold">取消</button>
          <button @click="saveAccount" :disabled="isSaving"
                  class="px-6 py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded transition font-bold disabled:opacity-50">
            {{ isSaving ? '儲存中...' : (isEditMode ? '更新帳號' : '新增帳號') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ 刪除確認 Modal ══ -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showDeleteConfirm = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="text-[#f1d483] font-bold text-lg mb-2">確認刪除帳號？</h3>
        <p class="text-[#a6937c] text-sm mb-1">帳號：<span class="text-[#e0d3b8] font-bold">{{ deleteTarget?.name }}</span></p>
        <p class="text-[#a6937c] text-xs mb-5">此操作將永久刪除該帳號下所有角色，無法復原。</p>
        <div class="flex gap-3 justify-center">
          <button @click="showDeleteConfirm = false" class="px-5 py-2 bg-[#3d2b1f] hover:bg-[#5e4b37] text-[#a6937c] rounded border border-[#5e4b37] transition font-bold">取消</button>
          <button @click="deleteAccount" :disabled="isSaving"
                  class="px-5 py-2 bg-[#8b3a3a] hover:bg-[#a04040] text-white rounded transition font-bold disabled:opacity-50">
            {{ isSaving ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCommonStore } from '~/stores/common.js';

const commonStore = useCommonStore();
const BASE = () => commonStore.data.main_url + '/roz/teamplace';

// --- 基礎設定與配色 ---
const squadCount = ref(4);

const jobList = ['祭師', '鐵匠', '騎士', '詩人', '刺客', '賢者', '巫師', '練金', '十字軍', '舞孃', '武僧', '獵人'];

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

// --- Modal 狀態 ---
const showAccountModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);
const modalError = ref('');
const deleteTarget = ref(null);
const editTargetIdx = ref(null);
const modalForm = ref({ name: '', roles: [{ name: '', job: '', level: null }] });

// --- 計算屬性 ---
const allChars = computed(() => charGroups.value.flatMap(g => g.role).filter(r => r.name));

// squads 現在包含 members（實際進副本）和 supporters（外部支援）
const squads = computed(() => {
  const result = [];
  for (let i = 1; i <= squadCount.value; i++) {
    const assigned = allChars.value.filter(c => c.assignedTo === i);
    result.push({
      members:    assigned.filter(c => !c.isSupport),
      supporters: assigned.filter(c => c.isSupport)
    });
  }
  return result;
});

// 職業組成統計
const getJobComposition = (members) => {
  const map = {};
  members.forEach(m => {
    if (m.job) map[m.job] = (map[m.job] || 0) + 1;
  });
  return map;
};

// --- 操作函數 ---
const toggleGroup = (idx) => { collapsedGroups.value[idx] = !collapsedGroups.value[idx]; };
const setAllCollapse = (v) => { charGroups.value.forEach((_, idx) => { collapsedGroups.value[idx] = v; }); };

// 支援模式切換：支援角色可加入任意隊伍，且不阻擋同帳號其他角色分配
const toggleSupport = (char) => {
  char.isSupport = !char.isSupport;
  // 取消支援時若已分配則清除
  if (!char.isSupport) char.assignedTo = null;
  saveAssignments();
};

// isAccountInSquad 跳過支援角色（支援不佔名額）
const isAccountInSquad = (gIdx, sIdx) =>
    squads.value[sIdx].members.some(squadMember =>
        charGroups.value[gIdx].role.some(r => !r.isSupport && r.name === squadMember.name)
    );

const getButtonClass = (sIdx, gIdx) => {
  if (isAccountInSquad(gIdx, sIdx)) return 'bg-[#dcd2bb] text-[#b4a992] cursor-not-allowed border-transparent';
  return getSquadColor(sIdx).btn;
};

const addToSquad = (char, sIdx, gIdx) => {
  // 支援角色：可加入任意隊伍，不受帳號限制
  if (char.isSupport) {
    char.assignedTo = sIdx + 1;
  } else {
    if (!isAccountInSquad(gIdx, sIdx)) char.assignedTo = sIdx + 1;
  }
  saveAssignments();
};

const removeFromSquad = (char) => {
  char.assignedTo = null;
  saveAssignments();
};

const resetAll = () => {
  allChars.value.forEach(c => { c.assignedTo = null; c.isSupport = false; });
  saveAssignments();
};

// --- Modal 操作 ---
const openAddAccountModal = () => {
  isEditMode.value = false;
  modalError.value = '';
  modalForm.value = { name: '', roles: [{ name: '', job: '', level: null }] };
  showAccountModal.value = true;
};

const openEditAccountModal = (group, gIdx) => {
  isEditMode.value = true;
  editTargetIdx.value = gIdx;
  modalError.value = '';
  modalForm.value = {
    name: group.name || '',
    roles: group.role.map(r => ({ name: r.name || '', job: r.job || '', level: r.level || null }))
  };
  showAccountModal.value = true;
};

const closeAccountModal = () => { showAccountModal.value = false; };
const addRoleRow = () => { modalForm.value.roles.push({ name: '', job: '', level: null }); };
const removeRoleRow = (rIdx) => { if (modalForm.value.roles.length > 1) modalForm.value.roles.splice(rIdx, 1); };

const confirmDeleteAccount = (group) => {
  deleteTarget.value = group;
  showDeleteConfirm.value = true;
};

const validateForm = () => {
  if (!modalForm.value.name.trim()) { modalError.value = '請輸入帳號名稱'; return false; }
  if (!modalForm.value.roles.some(r => r.name.trim())) { modalError.value = '請至少輸入一個角色名稱'; return false; }
  modalError.value = '';
  return true;
};

// --- API ---
const fetchRoles = async () => {
  try {
    const res = await fetch(`${BASE()}/list`);
    const data = await res.json();
    charGroups.value = data.map(g => ({
      ...g,
      role: (g.role || []).map(r => ({ ...r, assignedTo: null, isSupport: false }))
    }));
    charGroups.value.forEach((_, idx) => { collapsedGroups.value[idx] = true; });
    loadAssignments();
  } catch (e) { console.error('資料載入失敗:', e); }
};

const saveAccount = async () => {
  if (!validateForm()) return;
  isSaving.value = true;
  try {
    const payload = {
      name: modalForm.value.name.trim(),
      role: modalForm.value.roles.filter(r => r.name.trim())
          .map(r => ({ name: r.name.trim(), job: r.job || '', level: r.level || null }))
    };
    const url = isEditMode.value ? `${BASE()}/update` : `${BASE()}/add`;
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.success === false) throw new Error(data.message || '儲存失敗');
    closeAccountModal();
    await fetchRoles();
  } catch (err) {
    modalError.value = err.message || '操作失敗，請稍後再試';
  } finally {
    isSaving.value = false;
  }
};

const deleteAccount = async () => {
  if (!deleteTarget.value) return;
  isSaving.value = true;
  try {
    const encodedName = encodeURIComponent(deleteTarget.value.name);
    const res = await fetch(`${BASE()}/remove/${encodedName}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success === false) throw new Error(data.message || '刪除失敗');
    showDeleteConfirm.value = false;
    deleteTarget.value = null;
    await fetchRoles();
  } catch (err) { console.error('刪除失敗:', err); }
  finally { isSaving.value = false; }
};

// --- 分配存後端（節流：500ms） ---
let saveTimer = null;
const saveAssignments = () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    if (charGroups.value.length === 0) return;
    const assignments = allChars.value.filter(c => c.name).map(c => ({
      name: c.name, assignedTo: c.assignedTo || null, isSupport: c.isSupport || false
    }));
    try {
      await fetch(`${BASE()}/assign/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ squadCount: squadCount.value, assignments })
      });
    } catch (e) { console.error('分配儲存失敗:', e); }
  }, 500);
};

const loadAssignments = async () => {
  try {
    const res = await fetch(`${BASE()}/assign/load`);
    const data = await res.json();
    if (data.squadCount) squadCount.value = data.squadCount;
    if (data.assignments && charGroups.value.length > 0) {
      charGroups.value.forEach(group => {
        group.role.forEach(char => {
          const match = data.assignments.find(d => d.name === char.name);
          if (match) {
            char.assignedTo = match.assignedTo || null;
            char.isSupport  = match.isSupport  || false;
          }
        });
      });
    }
  } catch (e) { console.error('分配載入失敗:', e); }
};

// --- 監聽 ---
watch(squadCount, (newVal) => {
  allChars.value.forEach(char => { if (char.assignedTo > newVal) char.assignedTo = null; });
  saveAssignments();
});

onMounted(() => {
  document.title = '副本隊伍組隊系統';
  fetchRoles();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #2c1e14; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #5e4b37; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8d7a64; }
select option { background-color: #3d2b1f; color: #f1d483; }
</style>