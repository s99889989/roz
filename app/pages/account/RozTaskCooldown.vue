<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-6 font-sans">

    <!-- Header -->
    <div class="max-w-[1400px] mx-auto mb-6 border-b border-[#5e4b37] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#f1d483]">任務 CD 追蹤</h1>
        <p class="text-[#a6937c] text-xs mt-1">🍬 果凍石任務（3天 CD）・🏪 露天商店任務（7天 CD）</p>
      </div>
      <div class="flex gap-2 flex-wrap items-center">
        <select v-model="filterStatus"
                class="bg-[#3d2b1f] border border-[#5e4b37] text-[#e0d3b8] text-sm rounded px-3 py-1.5 outline-none focus:border-[#f1d483] cursor-pointer">
          <option value="all">全部角色</option>
          <option value="ready">🟢 可解任務</option>
          <option value="today">🟡 今日可解</option>
          <option value="waiting">🔴 CD 中</option>
          <option value="none">⚪ 未記錄</option>
        </select>
        <button @click="loadData"
                class="bg-[#5e4b37] hover:bg-[#7a6350] text-[#f1d483] px-4 py-1.5 rounded text-sm font-bold border border-[#f1d483]/20 transition">
          ↻ 重新整理
        </button>
      </div>
    </div>

    <!-- 統計總覽 -->
    <div class="max-w-[1400px] mx-auto mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div v-for="stat in stats" :key="stat.label"
           class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-3 text-center cursor-pointer hover:border-[#8b7a64] transition"
           @click="filterStatus = stat.key">
        <div class="text-2xl font-black" :class="stat.color">{{ stat.value }}</div>
        <div class="text-[10px] text-[#a6937c] mt-0.5">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="max-w-[1400px] mx-auto text-center py-20 text-[#a6937c] italic">讀取中...</div>

    <div v-else class="max-w-[1400px] mx-auto">

      <!-- 欄位標題 -->
      <div class="hidden md:grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold text-[#a6937c] uppercase tracking-wider border-b border-[#5e4b37] mb-2">
        <div class="col-span-2">帳號</div>
        <div class="col-span-2">角色</div>
        <div class="col-span-4 text-center">🍬 果凍石（3天）</div>
        <div class="col-span-4 text-center">🏪 露天商店（7天）</div>
      </div>

      <!-- 空狀態 -->
      <div v-if="filteredGroups.length === 0"
           class="text-center py-16 text-[#a6937c] italic bg-[#3d2b1f] rounded-xl border border-[#5e4b37]">
        {{ filterStatus === 'all' ? '尚未載入角色資料' : '目前沒有符合此狀態的角色' }}
      </div>

      <!-- 角色列 -->
      <div class="space-y-2">
        <template v-for="(group, gIdx) in filteredGroups" :key="gIdx">
          <div v-for="(char, cIdx) in group.role" :key="char.name"
               class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl overflow-hidden hover:border-[#8b7a64] transition">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-0">

              <!-- 帳號 + 角色欄 -->
              <div class="md:col-span-4 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-[#5e4b37]">
                <div class="shrink-0 text-center" style="min-width:52px">
                  <!-- 帳號名（只在第一個角色顯示） -->
                  <div v-if="cIdx === 0"
                       class="text-[9px] font-bold bg-[#5e4b37] text-[#f1d483] px-1.5 py-0.5 rounded mb-1 truncate">
                    {{ group.name }}
                  </div>
                  <div v-else class="h-4 mb-1"></div>
                  <div class="w-10 h-10 bg-[#2c1e14] rounded-full border border-[#5e4b37] flex items-center justify-center mx-auto overflow-hidden">
                    <img :src="getJobImg(char.job)" class="w-7 h-7 object-contain">
                  </div>
                </div>
                <div class="min-w-0">
                  <div class="font-black text-[#e0d3b8] truncate">{{ char.name }}</div>
                  <div class="text-[10px] text-[#a6937c]">
                    {{ char.job || '未知' }}
                    <span v-if="char.level" class="ml-1 font-mono">Lv.{{ char.level }}</span>
                  </div>
                </div>
              </div>

              <!-- 果凍石任務 -->
              <div class="md:col-span-4 px-4 py-3 border-b md:border-b-0 md:border-r border-[#5e4b37] flex items-center justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="text-[10px] font-bold text-[#a6937c] mb-1.5">🍬 果凍石</div>
                  <CdBadge :last-done="char.jellyLastDone" :cd-days="3" />
                </div>
                <div class="flex flex-col gap-1 shrink-0">
                  <button @click="markDone(char, 'jelly')"
                          class="text-[11px] font-bold px-3 py-1.5 rounded border transition"
                          :class="char.jellyLastDone
                            ? 'bg-[#2a3d25] hover:bg-[#3a5230] text-[#a0c878] border-[#4a6a38]'
                            : 'bg-[#4a7c59] hover:bg-[#3d6849] text-white border-[#5a9a6a]'">
                    ✔ 完成
                  </button>
                  <button v-if="char.jellyLastDone" @click="clearRecord(char, 'jelly')"
                          class="text-[10px] text-[#6b5a4a] hover:text-[#f0a8a8] transition text-center">清除</button>
                </div>
              </div>

              <!-- 露天商店任務 -->
              <div class="md:col-span-4 px-4 py-3 flex items-center justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="text-[10px] font-bold text-[#a6937c] mb-1.5">🏪 露天商店</div>
                  <CdBadge :last-done="char.shopLastDone" :cd-days="7" />
                </div>
                <div class="flex flex-col gap-1 shrink-0">
                  <button @click="markDone(char, 'shop')"
                          class="text-[11px] font-bold px-3 py-1.5 rounded border transition"
                          :class="char.shopLastDone
                            ? 'bg-[#2a3d25] hover:bg-[#3a5230] text-[#a0c878] border-[#4a6a38]'
                            : 'bg-[#4a7c59] hover:bg-[#3d6849] text-white border-[#5a9a6a]'">
                    ✔ 完成
                  </button>
                  <button v-if="char.shopLastDone" @click="clearRecord(char, 'shop')"
                          class="text-[10px] text-[#6b5a4a] hover:text-[#f0a8a8] transition text-center">清除</button>
                </div>
              </div>

            </div>
          </div>
        </template>
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
import { ref, computed, onMounted, onUnmounted, defineComponent, h } from 'vue';
import { useCommonStore } from '~/stores/common.js';

const commonStore  = useCommonStore();
const BASE_TEAM    = () => commonStore.data.main_url + '/roz/teamplace';
const BASE_CD      = () => commonStore.data.main_url + '/roz/taskcd';

// ── CdBadge 子元件 ────────────────────────────────────────────────
const CdBadge = defineComponent({
  props: { lastDone: String, cdDays: Number },
  setup(props) {
    const getInfo = () => {
      if (!props.lastDone) return { status: 'none', remainMs: 0, nextTime: null };
      const next = new Date(props.lastDone);
      next.setDate(next.getDate() + props.cdDays);
      const diff = next.getTime() - Date.now();
      if (diff <= 0) return { status: 'ready', remainMs: 0, nextTime: next };
      const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
      return { status: next <= todayEnd ? 'today' : 'waiting', remainMs: diff, nextTime: next };
    };
    const fmt = (ms) => {
      const m = Math.floor(ms / 60000);
      const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), min = m % 60;
      if (d > 0) return `${d}天 ${h}小時`;
      if (h > 0) return `${h}小時 ${min}分`;
      return `${min}分鐘`;
    };
    const fmtDate = (d) => d ? `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` : '';
    return { getInfo, fmt, fmtDate };
  },
  template: `
    <div>
      <div v-if="!lastDone" class="text-[11px] text-[#5e4b37] italic">⚪ 尚未記錄</div>
      <template v-else>
        <div v-if="getInfo().status==='ready'"
             class="inline-flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-900/20 border border-green-800/40 px-2 py-0.5 rounded-full">
          🟢 可解任務
        </div>
        <div v-else-if="getInfo().status==='today'"
             class="inline-flex items-center gap-1 text-[11px] font-bold text-yellow-400 bg-yellow-900/20 border border-yellow-800/40 px-2 py-0.5 rounded-full">
          🟡 今日可解・剩 {{ fmt(getInfo().remainMs) }}
        </div>
        <div v-else
             class="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-900/20 border border-red-800/40 px-2 py-0.5 rounded-full">
          🔴 CD 中・還需 {{ fmt(getInfo().remainMs) }}
        </div>
        <div class="text-[9px] text-[#6b5a4a] mt-1">
          完成：{{ fmtDate(new Date(lastDone)) }}・下次：{{ fmtDate(getInfo().nextTime) }}
        </div>
      </template>
    </div>
  `
});

// ── 狀態 ──────────────────────────────────────────────────────────
const loading      = ref(true);
const charGroups   = ref([]);
const filterStatus = ref('all');
const toast        = ref({ show: false, message: '' });

const jobFileMap = { '祭師':'祭師','鐵匠':'鐵匠','騎士':'騎士','詩人':'詩人','刺客':'刺客','賢者':'賢者','巫師':'巫師','練金':'練金','十字軍':'十字軍','舞孃':'舞孃','武僧':'祭師','獵人':'詩人' };
const getJobImg = (job) => `/images/profession/role/${jobFileMap[job] || '詩人'}.png`;

// ── CD 狀態判斷 ────────────────────────────────────────────────────
const getStatus = (lastDone, cdDays) => {
  if (!lastDone) return 'none';
  const next = new Date(lastDone);
  next.setDate(next.getDate() + cdDays);
  const diff = next.getTime() - Date.now();
  if (diff <= 0) return 'ready';
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
  return next <= todayEnd ? 'today' : 'waiting';
};

// 角色整體最優先狀態（兩個任務中較好的那個）
const charBestStatus = (char) => {
  const order = { ready: 0, today: 1, waiting: 2, none: 3 };
  const j = getStatus(char.jellyLastDone, 3);
  const s = getStatus(char.shopLastDone,  7);
  return order[j] <= order[s] ? j : s;
};

// ── 篩選 ──────────────────────────────────────────────────────────
const filteredGroups = computed(() => {
  if (filterStatus.value === 'all') return charGroups.value;
  return charGroups.value
    .map(g => ({ ...g, role: g.role.filter(c => charBestStatus(c) === filterStatus.value) }))
    .filter(g => g.role.length > 0);
});

// ── 統計 ──────────────────────────────────────────────────────────
const stats = computed(() => {
  const all = charGroups.value.flatMap(g => g.role);
  const count = { ready: 0, today: 0, waiting: 0, none: 0 };
  all.forEach(c => count[charBestStatus(c)]++);
  return [
    { key: 'ready',   label: '🟢 可解',     value: count.ready,   color: 'text-green-400'  },
    { key: 'today',   label: '🟡 今日可解',  value: count.today,   color: 'text-yellow-400' },
    { key: 'waiting', label: '🔴 CD 中',     value: count.waiting, color: 'text-red-400'    },
    { key: 'none',    label: '⚪ 未記錄',    value: count.none,    color: 'text-stone-500'  },
  ];
});

// ── 資料載入 ──────────────────────────────────────────────────────
const loadData = async () => {
  loading.value = true;
  try {
    const [groupsRaw, cdRaw] = await Promise.all([
      (await fetch(`${BASE_TEAM()}/list`)).json(),
      (await fetch(`${BASE_CD()}/list`)).json(),
    ]);
    charGroups.value = groupsRaw.map(g => ({
      ...g,
      role: (g.role || []).filter(r => r.name).map(r => {
        const cd = cdRaw[r.name] || {};
        return { ...r, jellyLastDone: cd.jellyLastDone || null, shopLastDone: cd.shopLastDone || null };
      })
    }));
  } catch (e) { console.error('載入失敗:', e); }
  finally { loading.value = false; }
};

// ── 標記完成 ──────────────────────────────────────────────────────
const markDone = async (char, type) => {
  const now = new Date().toISOString();
  try {
    await fetch(`${BASE_CD()}/save`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: char.name, type, time: now })
    });
    if (type === 'jelly') char.jellyLastDone = now;
    else                  char.shopLastDone  = now;
    showToast(`${char.name} 已標記完成`);
  } catch (e) { console.error(e); }
};

// ── 清除記錄 ──────────────────────────────────────────────────────
const clearRecord = async (char, type) => {
  try {
    await fetch(`${BASE_CD()}/clear`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: char.name, type })
    });
    if (type === 'jelly') char.jellyLastDone = null;
    else                  char.shopLastDone  = null;
    showToast(`${char.name} 記錄已清除`);
  } catch (e) { console.error(e); }
};

// ── Toast & 計時器 ────────────────────────────────────────────────
const showToast = (msg) => { toast.value = { show: true, message: msg }; setTimeout(() => { toast.value.show = false; }, 2500); };

let timer = null;
onMounted(() => { document.title = '任務 CD 追蹤'; loadData(); timer = setInterval(() => { charGroups.value = [...charGroups.value]; }, 60000); });
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }
select option { background-color: #3d2b1f; color: #e0d3b8; }
</style>
