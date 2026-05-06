<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-6 font-sans">

    <!-- Header -->
    <div class="max-w-[800px] mx-auto mb-6 border-b border-[#5e4b37] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-3xl font-bold text-[#f1d483]">副本管理</h1>
        <p class="text-[#a6937c] text-sm mt-1">管理可用副本清單，所有隊伍共用</p>
      </div>
    </div>

    <div class="max-w-[800px] mx-auto">

      <!-- 新增副本 -->
      <div class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-4 mb-6">
        <div class="flex gap-2">
          <input v-model="newName" placeholder="輸入副本名稱（例：波利村）"
                 @keydown.enter="addDungeon"
                 class="flex-1 bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-4 py-2.5 text-[#e0d3b8] outline-none focus:border-[#f1d483] transition" />
          <div class="flex items-center gap-1.5 bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 focus-within:border-[#f1d483] transition shrink-0">
            <span class="text-[#a6937c] text-xs whitespace-nowrap">最低等級</span>
            <input v-model.number="newMinLevel" type="number" min="1" max="99" placeholder="—"
                   class="w-14 bg-transparent text-[#f1d483] font-bold text-sm outline-none text-center" />
          </div>
          <button @click="addDungeon" :disabled="!newName.trim() || isSaving"
                  class="bg-[#4a7c59] hover:bg-[#3d6849] text-white px-5 py-2.5 rounded-lg font-bold transition disabled:opacity-50 shrink-0">
            ＋ 新增
          </button>
        </div>
      </div>
      <p v-if="addError" class="text-red-400 text-sm mb-4 -mt-4">{{ addError }}</p>

      <!-- 副本清單 -->
      <div v-if="loading" class="text-center py-20 text-[#a6937c] italic">讀取中...</div>

      <div v-else-if="dungeons.length === 0"
           class="text-center py-20 text-[#a6937c] italic bg-[#3d2b1f] rounded-xl border border-[#5e4b37]">
        尚未新增任何副本
      </div>

      <div v-else class="space-y-2">
        <div v-for="(d, idx) in dungeons" :key="d.name"
             class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl px-4 py-3 flex items-center justify-between hover:border-[#8b7a64] transition">
          <div class="flex items-center gap-3">
            <!-- 排序 -->
            <div class="flex flex-col gap-0.5">
              <button @click="moveDungeon(idx, -1)" :disabled="idx === 0"
                      class="p-0.5 text-[#a6937c] hover:text-[#f1d483] disabled:opacity-20 transition leading-none">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/></svg>
              </button>
              <button @click="moveDungeon(idx, 1)" :disabled="idx === dungeons.length - 1"
                      class="p-0.5 text-[#a6937c] hover:text-[#f1d483] disabled:opacity-20 transition leading-none">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
            <span class="text-[#a6937c] font-mono text-xs w-5 text-right">{{ idx + 1 }}</span>
            <span class="text-[#e0d3b8] font-bold text-base">{{ d.name }}</span>
          </div>
          <div class="flex items-center gap-3">
            <!-- 最低等級 -->
            <div class="flex items-center gap-1.5">
              <span class="text-[#a6937c] text-xs">最低等級</span>
              <input :value="d.minLevel ?? ''"
                     @change="updateMinLevel(d, $event.target.value)"
                     type="number" min="1" max="99" placeholder="—"
                     class="w-14 bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1 text-[#f1d483] font-bold text-sm text-center outline-none focus:border-[#f1d483] transition" />
            </div>
            <button @click="confirmRemove(d.name)"
                    class="text-xs bg-[#6b4a4a] hover:bg-[#853b3b] text-[#f0a8a8] px-3 py-1 rounded border border-[#f0a8a8]/20 transition">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 刪除確認 Modal -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="deleteTarget = null">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="text-[#f1d483] font-bold text-xl mb-2">確認刪除副本？</h3>
        <p class="text-[#a6937c] mb-1">副本「<span class="text-[#e0d3b8] font-bold">{{ deleteTarget }}</span>」將從清單中移除。</p>
        <p class="text-[#6b5a4a] text-sm mb-5">注意：各隊伍中已有的分配資料不會自動清除。</p>
        <div class="flex gap-3 justify-center">
          <button @click="deleteTarget = null"
                  class="px-5 py-2 bg-[#3d2b1f] hover:bg-[#5e4b37] text-[#a6937c] rounded border border-[#5e4b37] transition font-bold">取消</button>
          <button @click="removeDungeon" :disabled="isSaving"
                  class="px-5 py-2 bg-[#8b3a3a] hover:bg-[#a04040] text-white rounded transition font-bold disabled:opacity-50">
            {{ isSaving ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toast.show"
           class="fixed bottom-6 right-6 bg-[#3d2b1f] border border-[#5e4b37] text-[#e0d3b8] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50">
        <span class="text-green-400">✔</span> {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'roz');

import { ref, onMounted } from 'vue';
import { useCommonStore } from '~/stores/common.js';

const commonStore = useCommonStore();
const BASE = () => commonStore.data.main_url + '/roz/dungeon';

const loading     = ref(true);
const dungeons    = ref([]);
const newName     = ref('');
const newMinLevel = ref(null);
const addError    = ref('');
const isSaving    = ref(false);
const deleteTarget = ref(null);
const toast       = ref({ show: false, message: '' });

const loadDungeons = async () => {
  loading.value = true;
  try {
    const data = await (await fetch(`${BASE()}/list`, { credentials: 'include' })).json();
    dungeons.value = Array.isArray(data) ? data : [];
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const addDungeon = async () => {
  if (!newName.value.trim()) return;
  addError.value = '';
  isSaving.value = true;
  try {
    const data = await (await fetch(`${BASE()}/add`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: newName.value.trim(), minLevel: newMinLevel.value || null})
    })).json();
    if (data.error) {
      addError.value = data.error;
      return;
    }
    newName.value = '';
    newMinLevel.value = null;
    await loadDungeons();
    showToast('副本已新增');
  } catch {
    addError.value = '新增失敗';
  } finally {
    isSaving.value = false;
  }
};

const confirmRemove = (name) => {
  deleteTarget.value = name;
};
const removeDungeon = async () => {
  isSaving.value = true;
  try {
    await fetch(`${BASE()}/remove/${encodeURIComponent(deleteTarget.value)}`, {
      method: 'DELETE', credentials: 'include'
    });
    deleteTarget.value = null;
    await loadDungeons();
    showToast('副本已刪除');
  } catch {
    showToast('刪除失敗');
  } finally {
    isSaving.value = false;
  }
};

const updateMinLevel = async (d, val) => {
  const minLevel = val === '' ? null : parseInt(val);
  d.minLevel = minLevel;
  try {
    await fetch(`${BASE()}/update/${encodeURIComponent(d.name)}`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({minLevel})
    });
    showToast('已更新');
  } catch {
    showToast('更新失敗');
  }
};

const moveDungeon = async (idx, dir) => {
  const swapIdx = idx + dir;
  if (swapIdx < 0 || swapIdx >= dungeons.value.length) return;
  const arr = [...dungeons.value];
  [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
  dungeons.value = arr;
  try {
    await fetch(`${BASE()}/reorder`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({names: arr.map(d => d.name)})
    });
  } catch {
    showToast('排序同步失敗');
  }
};

const showToast = (msg) => {
  toast.value = {show: true, message: msg};
  setTimeout(() => {
    toast.value.show = false;
  }, 2500);
};

onMounted(() => {
  document.title = '副本管理';
  loadDungeons();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>