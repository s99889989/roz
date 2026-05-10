<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useCommonStore } from '~/stores/common.js';

definePageMeta({ layout: 'roz' });

const commonStore = useCommonStore();
const BASE = () => commonStore.data.roz_url + '/shop';
const AUTH = () => commonStore.data.roz_url + '/auth';

// ── 熱門關鍵字 ───────────────────────────────────────────────────
const hotKeywords = ref([]);
async function fetchHotKeywords() {
  try {
    const res  = await fetch(`${BASE()}/hot-keywords`, { credentials: 'include' });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) hotKeywords.value = data;
  } catch {}
}

// ── 常用關鍵字（localStorage）────────────────────────────────────
const usedKeywords = ref([]);
function loadUsedKeywords() {
  try { usedKeywords.value = JSON.parse(localStorage.getItem('roz_used_keywords') || '[]'); } catch { usedKeywords.value = []; }
}
function addUsedKeyword(kw) {
  const list = usedKeywords.value.filter(k => k !== kw);
  list.unshift(kw);
  usedKeywords.value = list.slice(0, 20);
  localStorage.setItem('roz_used_keywords', JSON.stringify(usedKeywords.value));
}
function clearUsedKeywords() {
  usedKeywords.value = [];
  localStorage.removeItem('roz_used_keywords');
}
function pickKeyword(kw) {
  keyword.value = kw;
  doSearch(1);
}

// ── 登入狀態 ─────────────────────────────────────────────────────
const loggedIn     = ref(false);
const showLogin    = ref(false);
const loginForm    = reactive({ acc: '', password: '', remember: false });
const loginLoading = ref(false);
const loginError   = ref('');

async function checkStatus() {
  try {
    const res  = await fetch(`${AUTH()}/status`, { credentials: 'include' });
    const data = await res.json();
    loggedIn.value = data.loggedIn ?? false;
  } catch { loggedIn.value = false; }
}

async function doLogin() {
  if (!loginForm.acc || !loginForm.password) { loginError.value = '請輸入帳號和密碼'; return; }
  loginError.value   = '';
  loginLoading.value = true;
  try {
    const res  = await fetch(`${AUTH()}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ acc: loginForm.acc, password: loginForm.password }),
    });
    const data = await res.json();
    if (data.success) {
      if (loginForm.remember) {
        localStorage.setItem('roz_login_remember', '1');
        localStorage.setItem('roz_login_acc', loginForm.acc);
        localStorage.setItem('roz_login_pwd', loginForm.password);
      } else {
        localStorage.removeItem('roz_login_remember');
        localStorage.removeItem('roz_login_acc');
        localStorage.removeItem('roz_login_pwd');
      }
      loggedIn.value  = true;
      showLogin.value = false;
      if (!loginForm.remember) { loginForm.acc = ''; loginForm.password = ''; }
    } else {
      loginError.value = data.message || '登入失敗';
    }
  } catch (e) {
    loginError.value = '連線失敗：' + e.message;
  } finally {
    loginLoading.value = false;
  }
}

async function doLogout() {
  try { await fetch(`${AUTH()}/logout`, { method: 'POST', credentials: 'include' }); } catch {}
  loggedIn.value    = false;
  shopResultsRaw.value = []; historyResults.value = [];
  shopTotalCount.value = 0; historyTotalCount.value = 0;
  errorMsg.value = '';
}

onMounted(async () => {
  document.title = '露天商店查詢';
  loadUsedKeywords();
  await fetchHotKeywords();
  await checkStatus();
  keyword.value     = localStorage.getItem('roz_shop_keyword')     || '';
  server.value      = localStorage.getItem('roz_shop_server')      || '529';
  storeType.value   = localStorage.getItem('roz_shop_storetype')   || '0';
  historyDays.value = localStorage.getItem('roz_shop_historydays') || '1';
  const remembered = localStorage.getItem('roz_login_remember');
  if (remembered === '1') {
    loginForm.acc      = localStorage.getItem('roz_login_acc') || '';
    loginForm.password = localStorage.getItem('roz_login_pwd') || '';
    loginForm.remember = true;
  }
});

// ── 查詢表單 ─────────────────────────────────────────────────────
const activeTab   = ref('shop');
const keyword     = ref('');
const server      = ref('529');
const storeType   = ref('0');
const historyDays = ref('1');
const loading     = ref(false);
const errorMsg    = ref('');

// 切 tab 只切換顯示，不清除結果
function switchTab(tab) {
  if (activeTab.value === tab) return;
  activeTab.value = tab;
  errorMsg.value  = '';
}

watch(keyword,     v => localStorage.setItem('roz_shop_keyword',     v));
watch(server,      v => localStorage.setItem('roz_shop_server',      v));
watch(storeType,   v => localStorage.setItem('roz_shop_storetype',   v));
watch(historyDays, v => localStorage.setItem('roz_shop_historydays', v));

// ── 排序（純前端，不重打 API）────────────────────────────────────
const sortKey = ref('price_asc'); // 預設單價低→高

const sortOptions = [
  { label: '單價 低→高', value: 'price_asc'  },
  { label: '單價 高→低', value: 'price_desc' },
  { label: '數量 低→高', value: 'cnt_asc'    },
  { label: '數量 高→低', value: 'cnt_desc'   },
];

// ── 價格區間（前端過濾）─────────────────────────────────────────
const priceMin     = ref('');
const priceMax     = ref('');
const priceUnit    = ref(1); // 1 = z，10000 = 萬z
const priceUnitLabel = computed(() => priceUnit.value === 1 ? 'z' : '萬z');

// 實際 z 值
const priceMinZ = computed(() => priceMin.value !== '' ? Number(priceMin.value) * priceUnit.value : null);
const priceMaxZ = computed(() => priceMax.value !== '' ? Number(priceMax.value) * priceUnit.value : null);
const isFiltered = computed(() => priceMinZ.value !== null || priceMaxZ.value !== null);

function togglePriceUnit() {
  // 切換單位時，嘗試換算已輸入的數值
  if (priceUnit.value === 1) {
    // z → 萬z
    if (priceMin.value !== '') priceMin.value = String(Math.floor(Number(priceMin.value) / 10000));
    if (priceMax.value !== '') priceMax.value = String(Math.floor(Number(priceMax.value) / 10000));
    priceUnit.value = 10000;
  } else {
    // 萬z → z
    if (priceMin.value !== '') priceMin.value = String(Number(priceMin.value) * 10000);
    if (priceMax.value !== '') priceMax.value = String(Number(priceMax.value) * 10000);
    priceUnit.value = 1;
  }
}

// ── 結果（商店 & 成交紀錄各自保留，切 tab 不清除）───────────────
const shopResultsRaw     = ref([]);
const historyResults     = ref([]);
const shopTotalCount     = ref(0);
const historyTotalCount  = ref(0);
const shopCurrentPage    = ref(1);
const historyCurrentPage = ref(1);
const pageSize           = 30;

const shopTotalPages    = computed(() => Math.ceil(shopTotalCount.value    / pageSize));
const historyTotalPages = computed(() => Math.ceil(historyTotalCount.value / pageSize));

// 套用過濾 + 排序（純前端，不重打 API）
const shopResults = computed(() => {
  let list = [...shopResultsRaw.value];

  // 價格過濾
  if (priceMinZ.value !== null) list = list.filter(i => Number(i.itemPrice) >= priceMinZ.value);
  if (priceMaxZ.value !== null) list = list.filter(i => Number(i.itemPrice) <= priceMaxZ.value);

  // 排序
  switch (sortKey.value) {
    case 'price_asc':  list.sort((a, b) => Number(a.itemPrice) - Number(b.itemPrice)); break;
    case 'price_desc': list.sort((a, b) => Number(b.itemPrice) - Number(a.itemPrice)); break;
    case 'cnt_asc':    list.sort((a, b) => Number(a.itemCNT)   - Number(b.itemCNT));   break;
    case 'cnt_desc':   list.sort((a, b) => Number(b.itemCNT)   - Number(a.itemCNT));   break;
  }
  return list;
});

const filteredCount = computed(() => shopResults.value.length);

// ── 商店詳細 Modal ───────────────────────────────────────────────
const showDetail    = ref(false);
const detailLoading = ref(false);
const detailData    = ref(null);
const detailTab     = ref('store');

async function openDetail(item) {
  await checkStatus();
  if (!loggedIn.value) { showLogin.value = true; return; }
  showDetail.value    = true;
  detailLoading.value = true;
  detailData.value    = null;
  detailTab.value     = 'store';
  try {
    const res  = await fetch(`${BASE()}/store-detail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ div_svr: server.value, SSI: item.SSI2 }),
    });
    const data = await res.json();
    if (data.error) { errorMsg.value = data.error; showDetail.value = false; return; }
    detailData.value = data;
  } catch (e) {
    errorMsg.value = '查詢失敗：' + e.message;
    showDetail.value = false;
  } finally {
    detailLoading.value = false;
  }
}

function parseDesc(html) {
  if (!html) return '';
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<font[^>]*>/gi, '').replace(/<\/font>/gi, '').trim();
}
function mapLabel(mapName) { return mapName ? mapName.replace('.gat', '') : ''; }

const coordCopied = ref(false);
function copyCoord(item) {
  navigator.clipboard.writeText(`/navi ${mapLabel(item.mapName)} ${item.xPos}/${item.yPos}`);
  coordCopied.value = true;
  setTimeout(() => coordCopied.value = false, 2000);
}

// ── 查詢 ─────────────────────────────────────────────────────────
async function doSearch(page = 1) {
  if (!keyword.value.trim()) { errorMsg.value = '請輸入關鍵字'; return; }
  await checkStatus();
  if (!loggedIn.value) { showLogin.value = true; return; }

  addUsedKeyword(keyword.value.trim());
  errorMsg.value = '';
  loading.value  = true;

  try {
    if (activeTab.value === 'shop') {
      shopCurrentPage.value = page;
      const res  = await fetch(`${BASE()}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          div_svr: server.value, div_storetype: storeType.value,
          txb_KeyWord: keyword.value.trim(),
          row_start: String((page - 1) * pageSize + 1),
          // 固定從 API 取 itemPrice asc，前端再做排序
          sort_by: 'itemPrice', sort_desc: '',
        }),
      });
      const data = await res.json();
      if (data.error) { errorMsg.value = data.error; return; }
      shopResultsRaw.value  = data.dt      || [];
      shopTotalCount.value  = data.dt2?.[0]?.count || 0;
    } else {
      historyCurrentPage.value = page;
      const res  = await fetch(`${BASE()}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          div_svr: server.value, div_history_days: historyDays.value,
          txb_KeyWord: keyword.value.trim(),
          sort_by: 'SumitemCNT', sort_desc: 'desc',
        }),
      });
      const data = await res.json();
      if (data.error) { errorMsg.value = data.error; return; }
      historyResults.value      = data.dt      || [];
      historyTotalCount.value   = data.dt2?.[0]?.count || 0;
    }
  } catch (e) {
    errorMsg.value = '查詢失敗：' + e.message;
  } finally {
    loading.value = false;
  }
}

function formatPrice(n) { return Number(n).toLocaleString(); }
function storeTypeLabel(t) { return t === 0 ? '販售' : '收購'; }

function itemDisplayName(item) {
  return item.itemRefining > 0 ? `+${item.itemRefining} ${item.itemName}` : item.itemName;
}
function slotDisplay(item) {
  const s = [item.slot_1, item.slot_2, item.slot_3, item.slot_4].filter(Boolean);
  return s.length ? s.join('・') : '-';
}

const detailSlots = computed(() => {
  if (!detailData.value) return [];
  return [detailData.value.slot_1, detailData.value.slot_2,
    detailData.value.slot_3, detailData.value.slot_4].filter(s => s);
});
const randomOpts = computed(() => {
  if (!detailData.value) return [];
  return [detailData.value.RandomOpt1, detailData.value.RandomOpt2,
    detailData.value.RandomOpt3, detailData.value.RandomOpt4,
    detailData.value.RandomOpt5].filter(s => s);
});
</script>

<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-6 font-sans pb-16">

    <!-- Header -->
    <div class="max-w-[1400px] mx-auto mb-6 border-b border-[#5e4b37] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#f1d483]">🏪 露天商店查詢</h1>
        <p class="text-[#a6937c] text-xs mt-1">搜尋 ROZ 露天商店物品與成交紀錄</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <div class="flex bg-[#1e150d] border border-[#5e4b37] rounded-lg p-0.5">
          <button @click="switchTab('shop')"
                  class="px-3 py-1.5 text-sm font-bold rounded-md transition"
                  :class="activeTab === 'shop' ? 'bg-[#5e4b37] text-[#f1d483]' : 'text-[#a6937c] hover:text-[#e0d3b8]'">
            🏪 商店
            <span v-if="shopTotalCount > 0" class="ml-1 text-[10px] text-[#a6937c]">{{ shopTotalCount }}</span>
          </button>
          <button @click="switchTab('history')"
                  class="px-3 py-1.5 text-sm font-bold rounded-md transition"
                  :class="activeTab === 'history' ? 'bg-[#5e4b37] text-[#f1d483]' : 'text-[#a6937c] hover:text-[#e0d3b8]'">
            📜 成交紀錄
            <span v-if="historyTotalCount > 0" class="ml-1 text-[10px] text-[#a6937c]">{{ historyTotalCount }}</span>
          </button>
        </div>
        <button v-if="!loggedIn" @click="showLogin = true"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition bg-[#4a1a1a] text-[#f0a8a8] border border-[#f0a8a8]/30 hover:bg-[#5a2020] animate-pulse">
          🔑 尚未登入
        </button>
        <div v-else class="flex items-center gap-2">
          <span class="text-xs text-[#a8f0c8] bg-[#2a4a3a] border border-[#a8f0c8]/30 px-3 py-1.5 rounded-lg">✅ 已登入</span>
          <button @click="doLogout"
                  class="px-3 py-1.5 rounded-lg text-sm bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] transition">
            登出
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto">

      <!-- 搜尋列 -->
      <div class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-4 mb-4">

        <!-- 第一行：關鍵字 + 基本條件 + 查詢 -->
        <div class="flex flex-wrap gap-3 items-end">
          <div class="flex-1 min-w-48">
            <label class="text-xs text-[#a6937c] mb-1 block">關鍵字</label>
            <input v-model="keyword" @keyup.enter="doSearch(1)" type="text" placeholder="輸入道具名稱..."
                   class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition" />
            <p class="text-[10px] text-[#6b5a4a] mt-1 leading-relaxed">
              <span class="text-[#a6937c]">%</span> 任意字元（封印%卡片）・
              <span class="text-[#a6937c]">_</span> 單一字元（愛子____卡片）・
              <span class="text-[#a6937c]">"…"</span> 精準查詢（"鐵錘"）
            </p>
          </div>
          <div>
            <label class="text-xs text-[#a6937c] mb-1 block">伺服器</label>
            <select v-model="server"
                    class="bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] cursor-pointer transition">
              <option value="529">西格倫</option>
              <option value="629">艾克瑟</option>
            </select>
          </div>
          <div v-if="activeTab === 'shop'">
            <label class="text-xs text-[#a6937c] mb-1 block">類型</label>
            <select v-model="storeType"
                    class="bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] cursor-pointer transition">
              <option value="0">全部</option>
              <option value="1">收購</option>
              <option value="2">販售</option>
            </select>
          </div>
          <div v-if="activeTab === 'history'">
            <label class="text-xs text-[#a6937c] mb-1 block">天數</label>
            <select v-model="historyDays"
                    class="bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] cursor-pointer transition">
              <option value="1">1 天</option>
              <option value="7">7 天</option>
              <option value="30">30 天</option>
            </select>
          </div>
          <button @click="doSearch(1)" :disabled="loading"
                  class="bg-[#5e4b37] hover:bg-[#7a6350] text-[#f1d483] px-6 py-2 rounded text-sm font-bold border border-[#f1d483]/20 disabled:opacity-50 disabled:cursor-not-allowed transition">
            {{ loading ? '查詢中...' : '🔍 查詢' }}
          </button>
        </div>

        <!-- 第二行：排序 + 價格區間（商店 tab 才顯示） -->
        <div v-if="activeTab === 'shop'" class="flex flex-wrap gap-3 items-end mt-3 pt-3 border-t border-[#5e4b37]/50">
          <div>
            <label class="text-xs text-[#a6937c] mb-1 block">排序</label>
            <select v-model="sortKey"
                    class="bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] cursor-pointer transition">
              <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="flex items-end gap-2">
            <div>
              <label class="text-xs text-[#a6937c] mb-1 block">最低價格</label>
              <input v-model="priceMin" type="number" min="0" placeholder="不限"
                     class="w-28 bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition" />
            </div>
            <span class="text-[#5e4b37] pb-2 select-none">～</span>
            <div>
              <label class="text-xs text-[#a6937c] mb-1 block">最高價格</label>
              <input v-model="priceMax" type="number" min="0" placeholder="不限"
                     class="w-28 bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition" />
            </div>
            <!-- 單位切換 -->
            <button @click="togglePriceUnit"
                    class="pb-2 px-2.5 py-1.5 rounded text-xs font-bold border transition mb-[1px]"
                    :class="priceUnit === 10000
                      ? 'bg-[#4a3a28] border-[#f1d483] text-[#f1d483]'
                      : 'bg-[#2c1e14] border-[#5e4b37] text-[#a6937c] hover:border-[#f1d483] hover:text-[#f1d483]'">
              {{ priceUnitLabel }}
            </button>
            <button v-if="isFiltered" @click="priceMin = ''; priceMax = ''"
                    class="pb-2 text-xs text-[#a6937c] hover:text-[#f0a8a8] transition mb-[1px]">
              ✕ 清除
            </button>
          </div>
        </div>

        <p v-if="errorMsg" class="mt-3 text-sm text-[#f0a8a8] bg-[#4a1a1a] border border-[#f0a8a8]/20 rounded px-3 py-2">⚠️ {{ errorMsg }}</p>

        <!-- 熱門 / 常用關鍵字 -->
        <div class="mt-3 space-y-2">
          <div v-if="hotKeywords.length > 0" class="flex flex-wrap items-center gap-1.5">
            <span class="text-[10px] font-bold bg-[#b85c1a] text-white px-2 py-0.5 rounded-full shrink-0 select-none">🔥 熱門關鍵字</span>
            <button v-for="kw in hotKeywords" :key="kw" @click="pickKeyword(kw)"
                    class="text-xs px-2.5 py-0.5 rounded-full bg-[#2c1e14] border border-[#5e4b37] text-[#e0d3b8] hover:border-[#f1d483] hover:text-[#f1d483] transition">
              {{ kw }}
            </button>
          </div>
          <div v-if="usedKeywords.length > 0" class="flex flex-wrap items-center gap-1.5">
            <span class="text-[10px] font-bold bg-[#3a5a8a] text-white px-2 py-0.5 rounded-full shrink-0 select-none">⭐ 常用關鍵字</span>
            <button v-for="kw in usedKeywords" :key="kw" @click="pickKeyword(kw)"
                    class="text-xs px-2.5 py-0.5 rounded-full bg-[#2c1e14] border border-[#5e4b37] text-[#e0d3b8] hover:border-[#f1d483] hover:text-[#f1d483] transition">
              {{ kw }}
            </button>
            <button @click="clearUsedKeywords"
                    class="w-5 h-5 rounded-full bg-[#5e4b37] text-[#a6937c] hover:bg-[#7a6350] hover:text-[#f0a8a8] transition flex items-center justify-center text-xs font-bold shrink-0"
                    title="清除常用關鍵字">
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- 載入中 -->
      <div v-if="loading" class="text-center py-20 text-[#a6937c] italic">查詢中...</div>

      <div v-else>

        <!-- ══ 商店 tab ══ -->
        <div v-show="activeTab === 'shop'">
          <!-- 結果數 -->
          <div v-if="shopTotalCount > 0" class="text-sm text-[#a6937c] mb-3 flex items-center gap-2 flex-wrap">
            <span>共 <span class="text-[#f1d483] font-bold">{{ shopTotalCount }}</span> 筆</span>
            <span v-if="shopTotalPages > 1">（第 {{ shopCurrentPage }} / {{ shopTotalPages }} 頁）</span>
            <span v-if="isFiltered" class="text-[#f1d483]">
              · 過濾後 <span class="font-bold">{{ filteredCount }}</span> 筆
            </span>
          </div>

          <div v-if="shopResults.length > 0">
            <!-- 寬螢幕：表格 -->
            <div class="hidden md:block overflow-x-auto rounded-xl border border-[#5e4b37]">
              <table class="w-full text-sm">
                <thead>
                <tr class="bg-[#3d2b1f] text-[#f1d483] text-left">
                  <th class="px-4 py-3 font-bold">商店名稱</th>
                  <th class="px-4 py-3 font-bold">道具名稱</th>
                  <th class="px-4 py-3 font-bold text-center">Slot</th>
                  <th class="px-4 py-3 font-bold">卡片</th>
                  <th class="px-4 py-3 font-bold text-right">單價</th>
                  <th class="px-4 py-3 font-bold text-right">數量</th>
                  <th class="px-4 py-3 font-bold text-center">類型</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in shopResults" :key="i"
                    class="border-t border-[#5e4b37] hover:bg-[#3d2b1f] transition">
                  <td class="px-4 py-2.5">
                    <button @click="openDetail(item)" class="text-[#f1d483] hover:underline font-bold text-left">
                      {{ item.storeName }}
                    </button>
                  </td>
                  <td class="px-4 py-2.5 font-bold text-[#e0d3b8]">
                    {{ itemDisplayName(item) }}
                    <span v-if="item.ItemGradeLevel > 0" class="text-[#f1d483] text-xs ml-1">★{{ item.ItemGradeLevel }}</span>
                  </td>
                  <td class="px-4 py-2.5 text-center text-[#a6937c] text-xs">{{ item.DefaultSlotCount ?? '-' }}</td>
                  <td class="px-4 py-2.5 text-xs">
                    <span v-if="slotDisplay(item) !== '-'" class="text-[#e8c870]">{{ slotDisplay(item) }}</span>
                    <span v-else class="text-[#5e4b37]">-</span>
                  </td>
                  <td class="px-4 py-2.5 text-right font-bold text-[#f1d483]">{{ formatPrice(item.itemPrice) }} z</td>
                  <td class="px-4 py-2.5 text-right text-[#a6937c]">{{ item.itemCNT }}</td>
                  <td class="px-4 py-2.5 text-center">
                      <span class="text-xs px-2 py-0.5 rounded-full"
                            :class="item.storetype === 0 ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#2a3a4a] text-[#a8c0f0]'">
                        {{ storeTypeLabel(item.storetype) }}
                      </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- 窄螢幕：卡片 -->
            <div class="md:hidden space-y-2">
              <div v-for="(item, i) in shopResults" :key="i"
                   class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-3">
                <div class="flex items-start justify-between gap-2 mb-1.5">
                  <p class="font-bold text-[#e0d3b8] text-sm leading-snug">
                    {{ itemDisplayName(item) }}
                    <span v-if="item.ItemGradeLevel > 0" class="text-[#f1d483] text-xs ml-1">★{{ item.ItemGradeLevel }}</span>
                  </p>
                  <span class="text-xs px-2 py-0.5 rounded-full shrink-0"
                        :class="item.storetype === 0 ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#2a3a4a] text-[#a8c0f0]'">
                    {{ storeTypeLabel(item.storetype) }}
                  </span>
                </div>
                <button @click="openDetail(item)" class="text-xs text-[#f1d483] hover:underline mb-2 block">{{ item.storeName }}</button>
                <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <span class="text-[#f1d483] font-bold">{{ formatPrice(item.itemPrice) }} z</span>
                  <span class="text-[#a6937c]">× {{ item.itemCNT }}</span>
                  <span class="text-[#a6937c]">Slot {{ item.DefaultSlotCount ?? '-' }}</span>
                  <span v-if="slotDisplay(item) !== '-'" class="text-[#e8c870]">{{ slotDisplay(item) }}</span>
                </div>
              </div>
            </div>

            <!-- 分頁 -->
            <div v-if="shopTotalPages > 1" class="flex justify-center gap-2 mt-4">
              <button @click="doSearch(shopCurrentPage - 1)" :disabled="shopCurrentPage <= 1"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
                ← 上一頁
              </button>
              <span class="px-3 py-1.5 text-sm text-[#f1d483]">{{ shopCurrentPage }} / {{ shopTotalPages }}</span>
              <button @click="doSearch(shopCurrentPage + 1)" :disabled="shopCurrentPage >= shopTotalPages"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
                下一頁 →
              </button>
            </div>
          </div>

          <!-- 過濾後無結果 -->
          <div v-else-if="shopResultsRaw.length > 0 && isFiltered"
               class="text-center py-12 text-[#6b5a4a]">
            <div class="text-3xl mb-2">🔍</div>
            <p class="text-sm">目前價格區間內無結果</p>
            <button @click="priceMin = ''; priceMax = ''"
                    class="mt-3 text-xs text-[#a6937c] hover:text-[#f1d483] underline transition">
              清除價格過濾
            </button>
          </div>

          <!-- 尚未查詢 -->
          <div v-else-if="shopResultsRaw.length === 0 && !loading"
               class="text-center py-16 text-[#6b5a4a]">
            <div class="text-4xl mb-3">👻</div>
            <p>{{ keyword ? '查無資料' : '輸入關鍵字開始查詢' }}</p>
          </div>
        </div>

        <!-- ══ 成交紀錄 tab ══ -->
        <div v-show="activeTab === 'history'">
          <!-- 結果數 -->
          <div v-if="historyTotalCount > 0" class="text-sm text-[#a6937c] mb-3">
            共 <span class="text-[#f1d483] font-bold">{{ historyTotalCount }}</span> 筆
            <span v-if="historyTotalPages > 1">（第 {{ historyCurrentPage }} / {{ historyTotalPages }} 頁）</span>
          </div>

          <div v-if="historyResults.length > 0">
            <!-- 寬螢幕：表格 -->
            <div class="hidden md:block overflow-x-auto rounded-xl border border-[#5e4b37]">
              <table class="w-full text-sm">
                <thead>
                <tr class="bg-[#3d2b1f] text-[#f1d483] text-left">
                  <th class="px-4 py-3 font-bold">道具名稱</th>
                  <th class="px-4 py-3 font-bold text-right">最低成交價</th>
                  <th class="px-4 py-3 font-bold text-right">平均成交價</th>
                  <th class="px-4 py-3 font-bold text-right">最高成交價</th>
                  <th class="px-4 py-3 font-bold text-right">成交數量</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in historyResults" :key="i"
                    class="border-t border-[#5e4b37] hover:bg-[#3d2b1f] transition">
                  <td class="px-4 py-2.5 font-bold text-[#e0d3b8]">{{ item.itemName }}</td>
                  <td class="px-4 py-2.5 text-right text-[#a8f0c8]">{{ formatPrice(item.MinPrice) }} z</td>
                  <td class="px-4 py-2.5 text-right text-[#f1d483] font-bold">{{ formatPrice(item.AvgPrice) }} z</td>
                  <td class="px-4 py-2.5 text-right text-[#f0a8a8]">{{ formatPrice(item.MaxPrice) }} z</td>
                  <td class="px-4 py-2.5 text-right text-[#a6937c]">{{ item.SumitemCNT }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- 窄螢幕：卡片 -->
            <div class="md:hidden space-y-2">
              <div v-for="(item, i) in historyResults" :key="i"
                   class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-3">
                <p class="font-bold text-[#e0d3b8] text-sm mb-2">{{ item.itemName }}</p>
                <div class="grid grid-cols-2 gap-y-1 text-xs">
                  <span class="text-[#a6937c]">最低成交</span><span class="text-[#a8f0c8] text-right font-bold">{{ formatPrice(item.MinPrice) }} z</span>
                  <span class="text-[#a6937c]">平均成交</span><span class="text-[#f1d483] text-right font-bold">{{ formatPrice(item.AvgPrice) }} z</span>
                  <span class="text-[#a6937c]">最高成交</span><span class="text-[#f0a8a8] text-right font-bold">{{ formatPrice(item.MaxPrice) }} z</span>
                  <span class="text-[#a6937c]">成交數量</span><span class="text-[#a6937c] text-right">{{ item.SumitemCNT }}</span>
                </div>
              </div>
            </div>

            <!-- 分頁 -->
            <div v-if="historyTotalPages > 1" class="flex justify-center gap-2 mt-4">
              <button @click="doSearch(historyCurrentPage - 1)" :disabled="historyCurrentPage <= 1"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
                ← 上一頁
              </button>
              <span class="px-3 py-1.5 text-sm text-[#f1d483]">{{ historyCurrentPage }} / {{ historyTotalPages }}</span>
              <button @click="doSearch(historyCurrentPage + 1)" :disabled="historyCurrentPage >= historyTotalPages"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
                下一頁 →
              </button>
            </div>
          </div>

          <!-- 尚未查詢 -->
          <div v-else-if="historyResults.length === 0 && !loading"
               class="text-center py-16 text-[#6b5a4a]">
            <div class="text-4xl mb-3">👻</div>
            <p>{{ keyword ? '查無資料' : '輸入關鍵字開始查詢' }}</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ── 商店詳細 Modal ── -->
    <Transition name="modal">
      <div v-if="showDetail" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
           @click.self="showDetail = false">
        <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col">
          <div class="px-6 pt-5 pb-3 border-b border-[#5e4b37] shrink-0">
            <h2 class="text-[#f1d483] font-black text-lg mb-3">🏪 商店資訊</h2>
            <div class="flex gap-2">
              <button @click="detailTab = 'store'" class="px-3 py-1.5 rounded text-xs font-bold transition"
                      :class="detailTab === 'store' ? 'bg-[#5e4b37] text-[#f1d483]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">商店資訊</button>
              <button @click="detailTab = 'sell'" class="px-3 py-1.5 rounded text-xs font-bold transition"
                      :class="detailTab === 'sell' ? 'bg-[#5e4b37] text-[#f1d483]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">販售資訊</button>
              <button @click="detailTab = 'desc'" class="px-3 py-1.5 rounded text-xs font-bold transition"
                      :class="detailTab === 'desc' ? 'bg-[#5e4b37] text-[#f1d483]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">道具說明</button>
            </div>
          </div>
          <div class="overflow-y-auto px-6 py-4 flex-1 custom-scrollbar">
            <div v-if="detailLoading" class="text-center py-8 text-[#a6937c] italic">載入中...</div>
            <div v-else-if="detailData">
              <div v-if="detailTab === 'store'" class="text-sm">
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c]">商店名稱</span><span class="font-bold text-[#e0d3b8]">{{ detailData.storeName }}</span></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c]">角色名稱</span><span class="font-bold text-[#e0d3b8]">{{ detailData.ItemSellerCharName }}</span></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">道具名稱</span>
                  <span class="font-bold text-[#e0d3b8]">{{ itemDisplayName(detailData) }}<span v-if="detailData.ItemGradeLevel > 0" class="text-[#f1d483] ml-1">★{{ detailData.ItemGradeLevel }}</span></span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">商店座標</span>
                  <button @click="copyCoord(detailData)" class="font-bold text-[#f1d483] hover:text-[#e8c870] flex items-center gap-1.5 transition">
                    {{ mapLabel(detailData.mapName) }} {{ detailData.xPos }}/{{ detailData.yPos }}
                    <span class="text-xs text-[#a6937c]">{{ coordCopied ? '✓ 已複製' : '複製' }}</span>
                  </button>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c]">單價</span><span class="font-bold text-[#f1d483]">{{ formatPrice(detailData.itemPrice) }} z</span></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c]">數量</span><span class="font-bold text-[#e0d3b8]">{{ detailData.itemCNT }}</span></div>
                <div class="flex justify-between py-2.5">
                  <span class="text-[#a6937c]">收購/販售</span>
                  <span class="text-xs px-2 py-0.5 rounded-full" :class="detailData.storetype === 0 ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#2a3a4a] text-[#a8c0f0]'">{{ storeTypeLabel(detailData.storetype) }}</span>
                </div>
              </div>
              <div v-if="detailTab === 'sell'" class="text-sm">
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c]">精煉</span><span class="font-bold text-[#a8f0c8]">{{ detailData.itemRefining > 0 ? '+' + detailData.itemRefining : '-' }}</span></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c]">階級</span><span class="font-bold text-[#f1d483]">{{ detailData.ItemGradeLevel > 0 ? '★' + detailData.ItemGradeLevel : '-' }}</span></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c]">道具名稱</span><span class="font-bold text-[#e0d3b8]">{{ detailData.itemName }}</span></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c]">Slot 數</span><span class="font-bold text-[#e0d3b8]">{{ detailData.DefaultSlotCount || detailData.slotCount || '-' }}</span></div>
                <div v-if="detailSlots.length > 0" class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">卡片/附魔</span>
                  <div class="text-right"><div v-for="(s, i) in detailSlots" :key="i" class="text-[#e8c870] font-bold">{{ s }}</div></div>
                </div>
                <div v-else class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c]">卡片/附魔</span><span class="text-[#6b5a4a]">-</span></div>
                <div v-if="randomOpts.length > 0" class="py-2.5 border-b border-[#5e4b37]">
                  <p class="text-[#a6937c] mb-2">附加能力</p>
                  <div v-for="(opt, i) in randomOpts" :key="i" class="text-[#a8f0c8] text-xs py-0.5">{{ opt }}</div>
                </div>
                <div v-else class="flex justify-between py-2.5"><span class="text-[#a6937c]">附加能力</span><span class="text-[#6b5a4a]">-</span></div>
              </div>
              <div v-if="detailTab === 'desc'" class="text-sm">
                <div class="py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c] text-xs">道具名稱</span><p class="font-bold text-[#e0d3b8] mt-1">{{ detailData.itemName }}</p></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c] text-xs">Slot</span><span class="font-bold text-[#e0d3b8]">{{ detailData.DefaultSlotCount || detailData.slotCount || '-' }}</span></div>
                <div class="py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c] text-xs">敘述</span><pre class="mt-2 text-xs text-[#e0d3b8] whitespace-pre-wrap font-sans leading-relaxed">{{ parseDesc(detailData.identifiedDescription) }}</pre></div>
                <template v-if="detailData.slotDetails && detailData.slotDetails.length > 0">
                  <div v-for="(sd, i) in detailData.slotDetails" :key="i">
                    <div class="py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c] text-xs">卡片/附魔 {{ i + 1 }}</span><p class="font-bold text-[#e8c870] mt-1">{{ sd.name }}</p></div>
                    <div v-if="sd.desc" class="py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c] text-xs">敘述</span><pre class="mt-2 text-xs text-[#e0d3b8] whitespace-pre-wrap font-sans leading-relaxed">{{ parseDesc(sd.desc) }}</pre></div>
                  </div>
                </template>
              </div>
            </div>
            <div v-else class="text-center py-8 text-[#6b5a4a]">查無資料</div>
          </div>
          <div class="px-6 pb-5 pt-3 border-t border-[#5e4b37] shrink-0">
            <button @click="showDetail = false"
                    class="w-full py-2 bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] rounded transition text-sm font-bold">關閉</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 注意事項 ── -->
    <div class="max-w-[1400px] mx-auto mt-8 mb-4 px-4 md:px-6">
      <div class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-5">
        <h3 class="text-sm font-bold text-[#f1d483] mb-3">📋 注意事項</h3>
        <ol class="space-y-1.5 text-xs text-[#a6937c] list-decimal list-inside leading-relaxed">
          <li>遊戲內成功開啟「露天商店」後，即可在「露天商店查詢平台」中查詢。</li>
          <li>「成交紀錄查詢」僅能查詢 30 天內「露天商店」的販售&amp;收購成交紀錄。</li>
          <li>「成交紀錄查詢」為每日 00:00 更新前一日的所有露天商店成交紀錄。</li>
          <li>本平台包含離線露天相關紀錄。</li>
          <li>本平台皆顯示稅前價格。</li>
          <li>
            關鍵字搜尋小秘訣：
            <ul class="mt-1 ml-4 space-y-0.5">
              <li>任意字元：「<span class="text-[#e0d3b8]">%</span>」代表「任意個」任意字元（例：封印<span class="text-[#e0d3b8]">%</span>卡片）</li>
              <li>單一字元：「<span class="text-[#e0d3b8]">_</span>」代表「一個」任意字元（例：愛子<span class="text-[#e0d3b8]">____</span>卡片）</li>
              <li>精準查詢：「<span class="text-[#e0d3b8]">"</span>」使用在關鍵字前後時，可使用精準查詢，可排除其他可能的物品（例：<span class="text-[#e0d3b8]">"鐵錘"</span>）</li>
            </ul>
          </li>
          <li>若資料數量過多時，本平台資料顯示將有些微延遲，請玩家耐心等候。</li>
          <li>各項道具名稱完整顯示方式與遊戲內將略有不同。</li>
          <li>各項道具設定以遊戲內設定為主。</li>
          <li>遊戲關機維護期間本平台將無法進行查詢功能。</li>
        </ol>
      </div>
    </div>

    <!-- ── 登入 Modal ── -->
    <Transition name="modal">
      <div v-if="showLogin" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
           @click.self="showLogin = false">
        <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl p-6 w-full max-w-sm shadow-2xl">
          <h2 class="text-[#f1d483] font-black text-lg mb-5">🔑 登入 gnjoy</h2>
          <div class="mb-3">
            <label class="text-xs text-[#a6937c] mb-1 block">遊戲帳號</label>
            <input v-model="loginForm.acc" type="text" placeholder="請輸入帳號..." @keyup.enter="doLogin"
                   class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition" />
          </div>
          <div class="mb-4">
            <label class="text-xs text-[#a6937c] mb-1 block">身分證字號</label>
            <input v-model="loginForm.password" type="password" placeholder="請輸入密碼..." @keyup.enter="doLogin"
                   class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition" />
          </div>
          <label class="flex items-center gap-2 mb-4 cursor-pointer select-none">
            <input v-model="loginForm.remember" type="checkbox" class="w-4 h-4 rounded accent-[#f1d483] cursor-pointer" />
            <span class="text-xs text-[#a6937c]">記住帳號和密碼</span>
          </label>
          <p v-if="loginError" class="mb-3 text-sm text-[#f0a8a8] bg-[#4a1a1a] border border-[#f0a8a8]/20 rounded px-3 py-2">⚠️ {{ loginError }}</p>
          <div v-if="loginLoading" class="mb-3 text-sm text-[#a6937c] bg-[#3d2b1f] border border-[#5e4b37] rounded px-3 py-2 text-center">⏳ 正在開啟瀏覽器並自動登入，請稍候...</div>
          <div class="flex justify-end gap-2">
            <button @click="showLogin = false; loginError = ''"
                    class="px-4 py-2 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] transition text-sm">取消</button>
            <button @click="doLogin" :disabled="loginLoading"
                    class="px-4 py-2 rounded bg-[#5e4b37] text-[#f1d483] border border-[#f1d483]/20 font-bold hover:bg-[#7a6350] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm">
              {{ loginLoading ? '登入中...' : '登入' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #2c1e14; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #5e4b37; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8d7a64; }
select option { background-color: #2c1e14; color: #e0d3b8; }
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }
</style>