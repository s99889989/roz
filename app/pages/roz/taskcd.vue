<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-6 font-sans">

    <!-- Header -->
    <div class="max-w-[1400px] mx-auto mb-6 border-b border-[#5e4b37] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#f1d483]">任務 CD 追蹤</h1>
        <p class="text-[#a6937c] text-xs mt-1">
          🍬 果凍石任務（角色 CD・3天）・🏪 露天商店任務（<span class="text-[#f1d483]">帳號 CD</span>・7天）
        </p>
      </div>
      <div class="flex gap-2 flex-wrap items-center">
        <div class="flex bg-[#1e150d] border border-[#5e4b37] rounded-lg p-0.5">
          <button @click="viewMode = 'list'"
                  class="px-3 py-1.5 text-sm font-bold rounded-md transition"
                  :class="viewMode === 'list' ? 'bg-[#5e4b37] text-[#f1d483]' : 'text-[#a6937c] hover:text-[#e0d3b8]'">
            ☰ 列表
          </button>
          <button @click="viewMode = 'calendar'"
                  class="px-3 py-1.5 text-sm font-bold rounded-md transition"
                  :class="viewMode === 'calendar' ? 'bg-[#5e4b37] text-[#f1d483]' : 'text-[#a6937c] hover:text-[#e0d3b8]'">
            📅 日曆
          </button>
        </div>
        <select v-if="viewMode === 'list'" v-model="filterStatus"
                class="bg-[#3d2b1f] border border-[#5e4b37] text-[#e0d3b8] text-sm rounded px-3 py-1.5 outline-none focus:border-[#f1d483] cursor-pointer">
          <option value="all">全部</option>
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
      <div v-for="stat in stats" :key="stat.key"
           class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-3 text-center cursor-pointer hover:border-[#8b7a64] transition"
           @click="viewMode = 'list'; filterStatus = stat.key">
        <div class="text-2xl font-black" :class="stat.color">{{ stat.value }}</div>
        <div class="text-[10px] text-[#a6937c] mt-0.5">{{ stat.label }}</div>
      </div>
    </div>

    <div v-if="loading" class="max-w-[1400px] mx-auto text-center py-20 text-[#a6937c] italic">讀取中...</div>

    <div v-else class="max-w-[1400px] mx-auto">

      <!-- ══ 日曆視圖 ══ -->
      <div v-if="viewMode === 'calendar'">
        <div class="flex items-center justify-between mb-4">
          <button @click="prevMonth" class="w-9 h-9 rounded-lg bg-[#3d2b1f] hover:bg-[#5e4b37] border border-[#5e4b37] text-[#f1d483] font-bold transition flex items-center justify-center">‹</button>
          <h2 class="text-[#f1d483] font-black text-lg">{{ calYear }} 年 {{ calMonth + 1 }} 月</h2>
          <button @click="nextMonth" class="w-9 h-9 rounded-lg bg-[#3d2b1f] hover:bg-[#5e4b37] border border-[#5e4b37] text-[#f1d483] font-bold transition flex items-center justify-center">›</button>
        </div>
        <div class="flex gap-4 mb-3 text-[10px] text-[#a6937c] flex-wrap">
          <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-[#7aa85a] inline-block"></span>🍬 果凍石可解</span>
          <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-[#5b8fa4] inline-block"></span>🏪 露天商店可解</span>
          <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-[#a45b5b] inline-block"></span>逾期未解</span>
        </div>
        <div class="grid grid-cols-7 mb-1">
          <div v-for="d in ['日','一','二','三','四','五','六']" :key="d"
               class="text-center text-[10px] font-bold text-[#a6937c] py-1">{{ d }}</div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <div v-for="n in calStartDay" :key="'empty-'+n"></div>
          <div v-for="day in calDaysInMonth" :key="day"
               class="min-h-[90px] rounded-xl border transition cursor-pointer"
               :class="[isToday(day) ? 'border-[#f1d483] bg-[#3d2b1f]' : 'border-[#5e4b37] bg-[#3d2b1f] hover:border-[#8b7a64]',
                        selectedDay === day ? 'ring-2 ring-[#f1d483]/50' : '']"
               @click="selectDay(day)">
            <div class="px-2 pt-1.5 pb-0.5 flex items-center justify-between">
              <span class="text-xs font-bold" :class="isToday(day) ? 'text-[#f1d483]' : 'text-[#a6937c]'">{{ day }}</span>
              <span v-if="hasPastDue(day)" class="w-1.5 h-1.5 rounded-full bg-[#a45b5b] inline-block"></span>
            </div>
            <div class="px-1.5 pb-1.5 space-y-0.5 overflow-hidden">
              <template v-for="item in getJellyForDay(day)" :key="'j'+item.charName">
                <div class="text-[9px] font-bold px-1 py-0.5 rounded truncate"
                     :class="isPast(day) ? 'bg-[#a45b5b]/30 text-[#f0a8a8]' : 'bg-[#4a6a2a]/60 text-[#a0c878]'">
                  🍬 {{ item.charName }}
                </div>
              </template>
              <template v-for="item in getShopForDay(day)" :key="'s'+item.accountName">
                <div class="text-[9px] font-bold px-1 py-0.5 rounded truncate"
                     :class="isPast(day) ? 'bg-[#a45b5b]/30 text-[#f0a8a8]' : 'bg-[#2a4a5e]/60 text-[#7ab8d4]'">
                  🏪 {{ item.accountName }}
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 選取日期詳細 -->
        <div v-if="selectedDay" class="mt-4 bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-[#f1d483] font-bold">
              {{ calYear }}/{{ calMonth + 1 }}/{{ selectedDay }}
              <span v-if="isToday(selectedDay)" class="ml-2 text-xs bg-[#5e4b37] text-[#f1d483] px-2 py-0.5 rounded">今天</span>
            </h3>
            <button @click="selectedDay = null" class="text-[#a6937c] hover:text-[#f0a8a8] transition text-lg leading-none">✕</button>
          </div>
          <div v-if="getJellyForDay(selectedDay).length === 0 && getShopForDay(selectedDay).length === 0"
               class="text-[#6b5a4a] italic text-sm">當日沒有任務可解</div>
          <div class="space-y-2">
            <div v-for="item in getJellyForDay(selectedDay)" :key="'jd'+item.charName"
                 class="flex items-center justify-between bg-[#2c1e14] rounded-lg px-3 py-2">
              <div class="flex items-center gap-2">
                <span class="text-sm">🍬</span>
                <div>
                  <span class="font-bold text-sm text-[#e0d3b8]">{{ item.charName }}</span>
                  <span class="text-[10px] text-[#a6937c] ml-1">{{ item.job }}</span>
                  <span class="text-[9px] text-[#6b5a4a] ml-1">{{ item.accountName }}</span>
                </div>
              </div>
              <span class="text-[10px]" :class="isPast(selectedDay) ? 'text-[#a45b5b] font-bold' : 'text-[#a0c878]'">
                {{ isPast(selectedDay) ? '⚠ 逾期' : '可解' }}
              </span>
            </div>
            <div v-for="item in getShopForDay(selectedDay)" :key="'sd'+item.accountName"
                 class="flex items-center justify-between bg-[#2c1e14] rounded-lg px-3 py-2">
              <div class="flex items-center gap-2">
                <span class="text-sm">🏪</span>
                <span class="font-bold text-sm text-[#e0d3b8]">{{ item.accountName }}</span>
                <span class="text-[9px] text-[#a6937c]">帳號</span>
              </div>
              <span class="text-[10px]" :class="isPast(selectedDay) ? 'text-[#a45b5b] font-bold' : 'text-[#7ab8d4]'">
                {{ isPast(selectedDay) ? '⚠ 逾期' : '可解' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ 列表視圖 ══ -->
      <div v-else>
        <div class="hidden md:grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold text-[#a6937c] uppercase tracking-wider border-b border-[#5e4b37] mb-2">
          <div class="col-span-2">帳號</div>
          <div class="col-span-2">角色</div>
          <div class="col-span-4 text-center">🍬 果凍石（角色・3天）</div>
          <div class="col-span-4 text-center">🏪 露天商店（帳號・7天）</div>
        </div>

        <div v-if="filteredGroups.length === 0"
             class="text-center py-16 text-[#a6937c] italic bg-[#3d2b1f] rounded-xl border border-[#5e4b37]">
          {{ filterStatus === 'all' ? '尚未載入角色資料' : '目前沒有符合此狀態的角色' }}
        </div>

        <div class="space-y-2">
          <template v-for="(group, gIdx) in filteredGroups" :key="gIdx">
            <div v-for="(char, cIdx) in group.roles" :key="char.name"
                 class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl overflow-hidden hover:border-[#8b7a64] transition">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-0">

                <!-- 帳號 + 角色 -->
                <div class="md:col-span-4 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-[#5e4b37]">
                  <div class="shrink-0 text-center" style="min-width:52px">
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
                    <div class="font-bold text-sm text-[#e0d3b8] truncate">{{ char.name }}</div>
                    <div class="text-[10px] text-[#a6937c]">{{ char.job || '未設定' }}</div>
                    <div v-if="char.level" class="text-[10px] font-mono text-[#6b5a4a]">Lv.{{ char.level }}</div>
                  </div>
                </div>

                <!-- 果凍石 -->
                <div class="md:col-span-4 px-4 py-3 border-b md:border-b-0 md:border-r border-[#5e4b37] flex flex-col justify-center gap-2">
                  <CdBadge :lastDone="char.jellyLastDone" :cdDays="3" />
                  <div class="flex gap-2 flex-wrap">
                    <button @click="markJelly(char)"
                            class="text-[11px] bg-[#4a6a2a] hover:bg-[#5a8030] text-[#a0c878] px-3 py-1 rounded border border-[#a0c878]/30 transition font-bold">
                      ✓ 完成
                    </button>
                    <button v-if="char.jellyLastDone" @click="clearJelly(char)"
                            class="text-[11px] text-[#a6937c] hover:text-[#f0a8a8] px-2 py-1 rounded border border-[#5e4b37] transition">
                      清除
                    </button>
                  </div>
                </div>

                <!-- 露天商店（只在第一個角色顯示） -->
                <div class="md:col-span-4 px-4 py-3 flex flex-col justify-center gap-2">
                  <template v-if="cIdx === 0">
                    <CdBadge :lastDone="group.shopLastDone" :cdDays="7" />
                    <div class="flex gap-2 flex-wrap">
                      <button @click="markShop(group)"
                              class="text-[11px] bg-[#2a4a6a] hover:bg-[#305880] text-[#7ab8d4] px-3 py-1 rounded border border-[#7ab8d4]/30 transition font-bold">
                        ✓ 完成
                      </button>
                      <button v-if="group.shopLastDone" @click="clearShop(group)"
                              class="text-[11px] text-[#a6937c] hover:text-[#f0a8a8] px-2 py-1 rounded border border-[#5e4b37] transition">
                        清除
                      </button>
                    </div>
                  </template>
                  <span v-else class="text-[10px] text-[#5e4b37] italic">同帳號</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toast.show"
           class="fixed bottom-6 right-6 bg-[#3d2b1f] border border-[#5e4b37] text-[#e0d3b8] text-base px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50">
        <span class="text-green-400">✔</span> {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
definePageMeta({layout: 'roz');

import {ref, computed, onMounted, onUnmounted, defineComponent} from 'vue';
import {useCommonStore} from '~/stores/common.js';

const commonStore = useCommonStore();
const BASE_ACCOUNT = () => commonStore.data.main_url + '/roz/account';
const BASE_CD = () => commonStore.data.main_url + '/roz/taskcd';

// ── CdBadge 子元件 ─────────────────────────────────────────────────
const CdBadge = defineComponent({
  props: {lastDone: String, cdDays: Number},
  setup(props) {
    const getInfo = () => {
      if (!props.lastDone) return {status: 'none', remainMs: 0, nextTime: null};
      const next = new Date(props.lastDone);
      next.setDate(next.getDate() + props.cdDays);
      const diff = next.getTime() - Date.now();
      if (diff <= 0) return {status: 'ready', remainMs: 0, nextTime: next};
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      return {status: next <= todayEnd ? 'today' : 'waiting', remainMs: diff, nextTime: next};
    };
    const fmt = (ms) => {
      const m = Math.floor(ms / 60000);
      const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), min = m % 60;
      if (d > 0) return `${d}天 ${h}小時`;
      if (h > 0) return `${h}小時 ${min}分`;
      return `${min}分鐘`;
    };
    const fmtDate = (d) => d
        ? `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
        : '';
    return {getInfo, fmt, fmtDate};
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
const loading = ref(true);
const viewMode = ref('list');
const charGroups = ref([]);
const filterStatus = ref('all');
const toast = ref({show: false, message: ''});

// ── 日曆 ──────────────────────────────────────────────────────────
const today = new Date();
const calYear = ref(today.getFullYear());
const calMonth = ref(today.getMonth());
const selectedDay = ref(null);

const calDaysInMonth = computed(() => new Date(calYear.value, calMonth.value + 1, 0).getDate());
const calStartDay = computed(() => new Date(calYear.value, calMonth.value, 1).getDay());

const prevMonth = () => {
  if (calMonth.value === 0) {
    calYear.value--;
    calMonth.value = 11;
  } else calMonth.value--;
  selectedDay.value = null;
};
const nextMonth = () => {
  if (calMonth.value === 11) {
    calYear.value++;
    calMonth.value = 0;
  } else calMonth.value++;
  selectedDay.value = null;
};
const selectDay = (day) => {
  selectedDay.value = selectedDay.value === day ? null : day;
};
const isToday = (day) => day === today.getDate() && calMonth.value === today.getMonth() && calYear.value === today.getFullYear();
const isPast = (day) => new Date(calYear.value, calMonth.value, day, 23, 59, 59) < new Date();
const isOnDay = (lastDone, cdDays, day) => {
  if (!lastDone) return false;
  const next = new Date(lastDone);
  next.setDate(next.getDate() + cdDays);
  return next.getFullYear() === calYear.value && next.getMonth() === calMonth.value && next.getDate() === day;
};

const getJellyForDay = (day) => {
  const result = [];
  charGroups.value.forEach(g => {
    (g.roles || []).forEach(r => {
      if (isOnDay(r.jellyLastDone, 3, day)) result.push({charName: r.name, job: r.job, accountName: g.name});
    });
  });
  return result;
};
const getShopForDay = (day) => {
  const result = [];
  charGroups.value.forEach(g => {
    if (isOnDay(g.shopLastDone, 7, day)) result.push({accountName: g.name});
  });
  return result;
};
const hasPastDue = (day) => isPast(day) && (getJellyForDay(day).length > 0 || getShopForDay(day).length > 0);

// ── 職業圖示 ──────────────────────────────────────────────────────
const jobFileMap = {
  '祭師': '祭師',
  '鐵匠': '鐵匠',
  '騎士': '騎士',
  '詩人': '詩人',
  '刺客': '刺客',
  '賢者': '賢者',
  '巫師': '巫師',
  '練金': '練金',
  '十字軍': '十字軍',
  '舞孃': '舞孃',
  '武僧': '祭師',
  '獵人': '詩人'
};
const getJobImg = (job) => `/images/profession/role/${jobFileMap[job] || '詩人'}.png`;

// ── CD 狀態判斷 ────────────────────────────────────────────────────
const getStatus = (lastDone, cdDays) => {
  if (!lastDone) return 'none';
  const next = new Date(lastDone);
  next.setDate(next.getDate() + cdDays);
  const diff = next.getTime() - Date.now();
  if (diff <= 0) return 'ready';
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  return next <= todayEnd ? 'today' : 'waiting';
};

const charBestStatus = (char, group) => {
  const order = {ready: 0, today: 1, waiting: 2, none: 3};
  const j = getStatus(char.jellyLastDone, 3);
  const s = getStatus(group.shopLastDone, 7);
  return order[j] <= order[s] ? j : s;
};

// ── 篩選 & 統計 ────────────────────────────────────────────────────
const filteredGroups = computed(() => {
  if (filterStatus.value === 'all') return charGroups.value;
  return charGroups.value
      .map(g => ({...g, roles: (g.roles || []).filter(c => charBestStatus(c, g) === filterStatus.value)}))
      .filter(g => g.roles.length > 0);
});

const stats = computed(() => {
  const count = {ready: 0, today: 0, waiting: 0, none: 0};
  charGroups.value.forEach(g => (g.roles || []).forEach(c => {
    count[charBestStatus(c, g)]++;
  }));
  return [
    {key: 'ready', label: '🟢 可解', value: count.ready, color: 'text-green-400'},
    {key: 'today', label: '🟡 今日可解', value: count.today, color: 'text-yellow-400'},
    {key: 'waiting', label: '🔴 CD 中', value: count.waiting, color: 'text-red-400'},
    {key: 'none', label: '⚪ 未記錄', value: count.none, color: 'text-stone-500'},
  ];
});

// ── 資料載入 ──────────────────────────────────────────────────────
// 帳號來自新版 /roz/account/list（roles 欄位）
// CD 資料來自 /roz/taskcd/list（key: account:{name} / char:{name}）
const loadData = async () => {
  loading.value = true;
  try {
    const [accountsRaw, cdRaw] = await Promise.all([
      (await fetch(`${BASE_ACCOUNT()}/list`, {credentials: 'include'})).json(),
      (await fetch(`${BASE_CD()}/list`, {credentials: 'include'})).json(),
    ]);
    charGroups.value = accountsRaw.map(acc => {
      const accountCd = cdRaw[`account:${acc.name}`] || {};
      return {
        ...acc,
        shopLastDone: accountCd.shopLastDone || null,
        roles: (acc.roles || []).filter(r => r.name).map(r => {
          const charCd = cdRaw[`char:${r.name}`] || {};
          return {...r, jellyLastDone: charCd.jellyLastDone || null};
        })
      };
    });
  } catch (e) {
    console.error('載入失敗:', e);
  } finally {
    loading.value = false;
  }
};

// ── 操作 ──────────────────────────────────────────────────────────
const markJelly = async (char) => {
  const now = new Date().toISOString();
  try {
    await fetch(`${BASE_CD()}/save`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({scope: 'char', name: char.name, type: 'jelly', time: now})
    });
    char.jellyLastDone = now;
    showToast(`${char.name} 果凍石已完成`);
  } catch (e) {
    console.error(e);
  }
};

const clearJelly = async (char) => {
  try {
    await fetch(`${BASE_CD()}/clear`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({scope: 'char', name: char.name, type: 'jelly'})
    });
    char.jellyLastDone = null;
    showToast(`${char.name} 果凍石記錄已清除`);
  } catch (e) {
    console.error(e);
  }
};

const markShop = async (group) => {
  const now = new Date().toISOString();
  try {
    await fetch(`${BASE_CD()}/save`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({scope: 'account', name: group.name, type: 'shop', time: now})
    });
    group.shopLastDone = now;
    showToast(`帳號 ${group.name} 露天商店已完成`);
  } catch (e) {
    console.error(e);
  }
};

const clearShop = async (group) => {
  try {
    await fetch(`${BASE_CD()}/clear`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({scope: 'account', name: group.name, type: 'shop'})
    });
    group.shopLastDone = null;
    showToast(`帳號 ${group.name} 露天商店記錄已清除`);
  } catch (e) {
    console.error(e);
  }
};

const showToast = (msg) => {
  toast.value = {show: true, message: msg};
  setTimeout(() => {
    toast.value.show = false;
  }, 2500);
};

let timer = null;
onMounted(() => {
  document.title = '任務 CD 追蹤';
  loadData();
  timer = setInterval(() => {
    charGroups.value = [...charGroups.value];
  }, 60000);
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

select option {
  background-color: #3d2b1f;
  color: #e0d3b8;
}
</style>