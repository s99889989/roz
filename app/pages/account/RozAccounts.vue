<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-6 font-sans">

    <!-- Header -->
    <div class="max-w-[1000px] mx-auto mb-6 border-b border-[#5e4b37] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#f1d483]">帳號管理</h1>
        <p class="text-[#a6937c] text-xs mt-1">管理所有帳號與角色資料，供組隊與任務追蹤使用</p>
      </div>
      <button @click="startAddAccount"
              class="bg-[#4a7c59] hover:bg-[#3d6849] text-white px-5 py-2 rounded shadow-md transition font-bold border border-white/10 text-sm">
        ＋ 新增帳號
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="max-w-[1000px] mx-auto text-center py-20 text-[#a6937c] italic">讀取中...</div>

    <div v-else class="max-w-[1000px] mx-auto space-y-3">

      <!-- 空狀態 -->
      <div v-if="accounts.length === 0 && !isAdding"
           class="text-center py-20 text-[#a6937c] italic bg-[#3d2b1f] rounded-xl border border-[#5e4b37]">
        尚未新增任何帳號，點右上角「新增帳號」開始
      </div>

      <!-- ── 新增帳號列（inline） ── -->
      <div v-if="isAdding"
           class="bg-[#3d2b1f] border-2 border-[#4a7c59] rounded-xl overflow-hidden">
        <div class="bg-[#2c1e14] px-4 py-3 flex items-center gap-3 border-b border-[#5e4b37]">
          <span class="text-[#4a7c59] text-xs font-bold bg-[#1a3326] px-2 py-0.5 rounded">新增</span>
          <input v-model="newAccount.name" placeholder="輸入帳號名稱" autofocus
                 @keydown.enter="focusFirstRole"
                 class="flex-1 bg-transparent text-[#e0d3b8] font-bold outline-none placeholder-[#5e4b37] text-sm" />
          <div class="flex gap-2">
            <button @click="saveNewAccount" :disabled="isSaving"
                    class="text-xs bg-[#4a7c59] hover:bg-[#3d6849] text-white px-3 py-1 rounded transition font-bold disabled:opacity-50">
              {{ isSaving ? '儲存...' : '儲存' }}
            </button>
            <button @click="cancelAdd" class="text-xs text-[#a6937c] hover:text-[#f0a8a8] transition">取消</button>
          </div>
        </div>
        <div class="p-4 space-y-2">
          <div class="grid grid-cols-12 gap-2 text-[10px] text-[#a6937c] font-bold px-1 mb-1">
            <div class="col-span-4">角色名稱</div>
            <div class="col-span-4">職業</div>
            <div class="col-span-3">等級</div>
          </div>
          <div v-for="(role, rIdx) in newAccount.roles" :key="rIdx"
               class="grid grid-cols-12 gap-2 items-center">
            <div class="col-span-4">
              <input v-model="role.name" :ref="el => { if(rIdx===0) firstRoleInput = el }"
                     placeholder="角色名稱" @keydown.enter="addRoleRow(newAccount.roles)"
                     class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] transition" />
            </div>
            <div class="col-span-4">
              <select v-model="role.job"
                      class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] cursor-pointer transition">
                <option value="">選擇職業</option>
                <option v-for="j in jobList" :key="j" :value="j">{{ j }}</option>
              </select>
            </div>
            <div class="col-span-3">
              <input v-model.number="role.level" type="number" placeholder="等級" min="1" max="999"
                     class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] transition" />
            </div>
            <div class="col-span-1 flex justify-center">
              <button @click="removeRoleRow(newAccount.roles, rIdx)" :disabled="newAccount.roles.length <= 1"
                      class="text-[#f0a8a8] hover:text-red-400 transition text-base disabled:opacity-20">✕</button>
            </div>
          </div>
          <button @click="addRoleRow(newAccount.roles)"
                  class="text-[11px] text-[#a6937c] hover:text-[#f1d483] transition mt-1">＋ 新增角色</button>
          <p v-if="formError" class="text-red-400 text-xs mt-2">{{ formError }}</p>
        </div>
      </div>

      <!-- ── 帳號列表 ── -->
      <div v-for="(acc, aIdx) in accounts" :key="acc.name"
           class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl overflow-hidden transition-all"
           :class="editingIdx === aIdx ? 'border-[#f1d483]/60' : 'hover:border-[#8b7a64]'">

        <!-- 帳號標頭 -->
        <div class="bg-[#2c1e14] px-4 py-3 flex items-center justify-between border-b border-[#5e4b37]">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="text-[#f1d483] text-[10px] font-bold bg-[#5e4b37] px-2 py-0.5 rounded shrink-0">帳號</span>

            <!-- 編輯模式帳號名 -->
            <input v-if="editingIdx === aIdx"
                   v-model="editForm.name"
                   class="flex-1 bg-transparent text-[#e0d3b8] font-bold outline-none border-b border-[#f1d483]/40 text-sm min-w-0" />
            <span v-else class="text-[#e0d3b8] font-bold truncate">{{ acc.name }}</span>

            <span class="text-[#a6937c] text-xs shrink-0">{{ acc.role.length }} 個角色</span>
          </div>

          <div class="flex items-center gap-2 shrink-0 ml-3">
            <!-- 編輯模式操作 -->
            <template v-if="editingIdx === aIdx">
              <button @click="saveEdit(aIdx)" :disabled="isSaving"
                      class="text-xs bg-[#4a7c59] hover:bg-[#3d6849] text-white px-3 py-1 rounded transition font-bold disabled:opacity-50">
                {{ isSaving ? '儲存...' : '儲存' }}
              </button>
              <button @click="cancelEdit"
                      class="text-xs text-[#a6937c] hover:text-[#e0d3b8] transition">取消</button>
            </template>
            <!-- 一般模式操作 -->
            <template v-else>
              <button @click="startEdit(acc, aIdx)"
                      class="text-[10px] bg-[#4a6b5e] hover:bg-[#5b8573] text-[#a8f0c8] px-2 py-0.5 rounded border border-[#a8f0c8]/20 transition">編輯</button>
              <button @click="confirmDelete(acc)"
                      class="text-[10px] bg-[#6b4a4a] hover:bg-[#853b3b] text-[#f0a8a8] px-2 py-0.5 rounded border border-[#f0a8a8]/20 transition">刪除</button>
              <button @click="toggleCollapse(aIdx)"
                      class="text-[#a6937c] text-xs transition-transform duration-300"
                      :class="collapsed[aIdx] ? '' : 'rotate-180'">▼</button>
            </template>
          </div>
        </div>

        <!-- 角色列表（一般模式） -->
        <div v-if="editingIdx !== aIdx && !collapsed[aIdx]" class="p-4">
          <div class="grid grid-cols-12 gap-2 text-[10px] text-[#a6937c] font-bold px-1 mb-2">
            <div class="col-span-1"></div>
            <div class="col-span-5">角色名稱</div>
            <div class="col-span-4">職業</div>
            <div class="col-span-2 text-right">等級</div>
          </div>
          <div v-for="role in acc.role" :key="role.name"
               class="grid grid-cols-12 gap-2 items-center py-2 border-b border-[#5e4b37]/40 last:border-0">
            <div class="col-span-1 flex justify-center">
              <div class="w-7 h-7 bg-[#2c1e14] rounded-full border border-[#5e4b37] flex items-center justify-center overflow-hidden">
                <img :src="getJobImg(role.job)" class="w-5 h-5 object-contain">
              </div>
            </div>
            <div class="col-span-5 font-bold text-sm text-[#e0d3b8]">{{ role.name }}</div>
            <div class="col-span-4 text-xs text-[#a6937c]">{{ role.job || '未設定' }}</div>
            <div class="col-span-2 text-right text-xs font-mono text-[#8d7a64]">{{ role.level ? `Lv.${role.level}` : '—' }}</div>
          </div>
        </div>

        <!-- 角色列表（編輯模式） -->
        <div v-if="editingIdx === aIdx" class="p-4 space-y-2">
          <div class="grid grid-cols-12 gap-2 text-[10px] text-[#a6937c] font-bold px-1 mb-1">
            <div class="col-span-4">角色名稱</div>
            <div class="col-span-4">職業</div>
            <div class="col-span-3">等級</div>
          </div>
          <div v-for="(role, rIdx) in editForm.roles" :key="rIdx"
               class="grid grid-cols-12 gap-2 items-center">
            <div class="col-span-4">
              <input v-model="role.name" placeholder="角色名稱"
                     class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] transition" />
            </div>
            <div class="col-span-4">
              <select v-model="role.job"
                      class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] cursor-pointer transition">
                <option value="">選擇職業</option>
                <option v-for="j in jobList" :key="j" :value="j">{{ j }}</option>
              </select>
            </div>
            <div class="col-span-3">
              <input v-model.number="role.level" type="number" placeholder="等級" min="1" max="999"
                     class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] transition" />
            </div>
            <div class="col-span-1 flex justify-center">
              <button @click="removeRoleRow(editForm.roles, rIdx)" :disabled="editForm.roles.length <= 1"
                      class="text-[#f0a8a8] hover:text-red-400 transition text-base disabled:opacity-20">✕</button>
            </div>
          </div>
          <button @click="addRoleRow(editForm.roles)"
                  class="text-[11px] text-[#a6937c] hover:text-[#f1d483] transition mt-1">＋ 新增角色</button>
          <p v-if="formError" class="text-red-400 text-xs mt-2">{{ formError }}</p>
        </div>

      </div>
    </div>

    <!-- 刪除確認 Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showDeleteConfirm = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="text-[#f1d483] font-bold text-lg mb-2">確認刪除帳號？</h3>
        <p class="text-[#a6937c] text-sm mb-1">帳號：<span class="text-[#e0d3b8] font-bold">{{ deleteTarget?.name }}</span></p>
        <p class="text-[#a6937c] text-xs mb-5">此操作將永久刪除該帳號下所有角色，無法復原。</p>
        <div class="flex gap-3 justify-center">
          <button @click="showDeleteConfirm = false"
                  class="px-5 py-2 bg-[#3d2b1f] hover:bg-[#5e4b37] text-[#a6937c] rounded border border-[#5e4b37] transition font-bold">取消</button>
          <button @click="deleteAccount" :disabled="isSaving"
                  class="px-5 py-2 bg-[#8b3a3a] hover:bg-[#a04040] text-white rounded transition font-bold disabled:opacity-50">
            {{ isSaving ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toast.show"
           class="fixed bottom-6 right-6 bg-[#3d2b1f] border border-[#5e4b37] text-[#e0d3b8] text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50">
        <span class="text-green-400">✔</span> {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCommonStore } from '~/stores/common.js';

const commonStore = useCommonStore();
const BASE = () => commonStore.data.main_url + '/roz/teamplace';

const jobList = ['祭師', '鐵匠', '騎士', '詩人', '刺客', '賢者', '巫師', '練金', '十字軍', '舞孃', '武僧', '獵人'];
const jobFileMap = { '祭師':'祭師','鐵匠':'鐵匠','騎士':'騎士','詩人':'詩人','刺客':'刺客','賢者':'賢者','巫師':'巫師','練金':'練金','十字軍':'十字軍','舞孃':'舞孃','武僧':'祭師','獵人':'詩人' };
const getJobImg = (job) => `/images/profession/role/${jobFileMap[job] || '詩人'}.png`;

// ── 狀態 ──────────────────────────────────────────────────────────
const loading          = ref(true);
const accounts         = ref([]);
const collapsed        = ref({});
const isAdding         = ref(false);
const editingIdx       = ref(null);
const isSaving         = ref(false);
const formError        = ref('');
const showDeleteConfirm = ref(false);
const deleteTarget     = ref(null);
const toast            = ref({ show: false, message: '' });
const firstRoleInput   = ref(null);

const newAccount = ref({ name: '', roles: [{ name: '', job: '', level: null }] });
const editForm   = ref({ name: '', roles: [] });

// ── 載入 ──────────────────────────────────────────────────────────
const loadAccounts = async () => {
  loading.value = true;
  try {
    accounts.value = await (await fetch(`${BASE()}/list`)).json();
    accounts.value.forEach((_, i) => { collapsed.value[i] = true; });
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

// ── 新增帳號 ──────────────────────────────────────────────────────
const startAddAccount = () => {
  cancelEdit();
  newAccount.value = { name: '', roles: [{ name: '', job: '', level: null }] };
  formError.value = '';
  isAdding.value = true;
};

const focusFirstRole = () => { firstRoleInput.value?.focus(); };

const saveNewAccount = async () => {
  if (!newAccount.value.name.trim()) { formError.value = '請輸入帳號名稱'; return; }
  if (!newAccount.value.roles.some(r => r.name.trim())) { formError.value = '請至少輸入一個角色名稱'; return; }
  isSaving.value = true;
  try {
    const payload = {
      name: newAccount.value.name.trim(),
      role: newAccount.value.roles.filter(r => r.name.trim()).map(r => ({ name: r.name.trim(), job: r.job || '', level: r.level || null }))
    };
    const res = await fetch(`${BASE()}/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.success === false) { formError.value = data.message; return; }
    isAdding.value = false;
    await loadAccounts();
    showToast('帳號已新增');
  } catch (e) { formError.value = '儲存失敗'; }
  finally { isSaving.value = false; }
};

const cancelAdd = () => { isAdding.value = false; formError.value = ''; };

// ── 編輯帳號 ──────────────────────────────────────────────────────
const startEdit = (acc, idx) => {
  cancelAdd();
  editingIdx.value = idx;
  formError.value = '';
  editForm.value = {
    name: acc.name,
    roles: acc.role.map(r => ({ name: r.name, job: r.job || '', level: r.level || null }))
  };
  collapsed.value[idx] = false;
};

const saveEdit = async (idx) => {
  if (!editForm.value.name.trim()) { formError.value = '請輸入帳號名稱'; return; }
  if (!editForm.value.roles.some(r => r.name.trim())) { formError.value = '請至少輸入一個角色名稱'; return; }
  isSaving.value = true;
  try {
    const payload = {
      name: editForm.value.name.trim(),
      role: editForm.value.roles.filter(r => r.name.trim()).map(r => ({ name: r.name.trim(), job: r.job || '', level: r.level || null }))
    };
    const res = await fetch(`${BASE()}/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.success === false) { formError.value = data.message; return; }
    editingIdx.value = null;
    await loadAccounts();
    showToast('帳號已更新');
  } catch (e) { formError.value = '儲存失敗'; }
  finally { isSaving.value = false; }
};

const cancelEdit = () => { editingIdx.value = null; formError.value = ''; };

// ── 刪除帳號 ──────────────────────────────────────────────────────
const confirmDelete = (acc) => { deleteTarget.value = acc; showDeleteConfirm.value = true; };

const deleteAccount = async () => {
  isSaving.value = true;
  try {
    const encodedName = encodeURIComponent(deleteTarget.value.name);
    const res = await fetch(`${BASE()}/remove/${encodedName}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success === false) throw new Error(data.message);
    showDeleteConfirm.value = false;
    deleteTarget.value = null;
    await loadAccounts();
    showToast('帳號已刪除');
  } catch (e) { console.error(e); }
  finally { isSaving.value = false; }
};

// ── 角色列操作 ────────────────────────────────────────────────────
const addRoleRow    = (roles) => roles.push({ name: '', job: '', level: null });
const removeRoleRow = (roles, idx) => { if (roles.length > 1) roles.splice(idx, 1); };
const toggleCollapse = (idx) => { collapsed.value[idx] = !collapsed.value[idx]; };

// ── Toast ─────────────────────────────────────────────────────────
const showToast = (msg) => { toast.value = { show: true, message: msg }; setTimeout(() => { toast.value.show = false; }, 2500); };

onMounted(() => { document.title = '帳號管理'; loadAccounts(); });
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }
select option { background-color: #2c1e14; color: #e0d3b8; }
</style>
