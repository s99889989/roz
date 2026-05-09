<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useCommonStore } from '~/stores/common.js';

definePageMeta({ layout: 'roz' });

const commonStore = useCommonStore();
const BASE = () => commonStore.data.roz_url + '/shop';
const AUTH = () => commonStore.data.roz_url + '/auth';

// ── 登入狀態 ─────────────────────────────────────────────────────
const loggedIn     = ref(false);
const showLogin    = ref(false);
const loginForm    = reactive({ acc: '', password: '' });
const loginLoading = ref(false);
const loginError   = ref('');
const showCreds    = ref(false);
const creds        = reactive({ cookies: '', token: '' });
const editingCreds = ref(false);
const editCreds    = reactive({ cookies: '', token: '' });

async function checkStatus() {
  try {
    const res  = await fetch(`${AUTH()}/status`, { credentials: 'include' });
    const data = await res.json();
    loggedIn.value = data.loggedIn ?? false;
    if (loggedIn.value) await fetchCreds();
  } catch { loggedIn.value = false; }
}

async function fetchCreds() {
  try {
    const res  = await fetch(`${AUTH()}/credentials`, { credentials: 'include' });
    const data = await res.json();
    creds.cookies = data.cookies || '';
    creds.token   = data.token   || '';
    editCreds.cookies = creds.cookies;
    editCreds.token   = creds.token;
  } catch {}
}

function startEditCreds() {
  editCreds.cookies = creds.cookies;
  editCreds.token   = creds.token;
  editingCreds.value = true;
}

function saveEditCreds() {
  creds.cookies = editCreds.cookies;
  creds.token   = editCreds.token;
  editingCreds.value = false;
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
      // 記住帳號密碼
      if (loginForm.remember) {
        localStorage.setItem('roz_login_remember', '1');
        localStorage.setItem('roz_login_acc',      loginForm.acc);
        localStorage.setItem('roz_login_pwd',      loginForm.password);
      } else {
        localStorage.removeItem('roz_login_remember');
        localStorage.removeItem('roz_login_acc');
        localStorage.removeItem('roz_login_pwd');
      }
      loggedIn.value   = true;
      showLogin.value  = false;
      loginForm.acc      = '';
      loginForm.password = '';
      await fetchCreds();
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
  try {
    await fetch(`${AUTH()}/logout`, { method: 'POST', credentials: 'include' });
  } catch {}
  loggedIn.value = false;
  creds.cookies  = '';
  creds.token    = '';
  showCreds.value = false;
  shopResults.value = []; historyResults.value = [];
  totalCount.value = 0; errorMsg.value = '';
}

onMounted(async () => {
  await checkStatus();
  keyword.value     = localStorage.getItem('roz_shop_keyword')     || '';
  server.value      = localStorage.getItem('roz_shop_server')      || '529';
  storeType.value   = localStorage.getItem('roz_shop_storetype')   || '0';
  historyDays.value = localStorage.getItem('roz_shop_historydays') || '1';
  // 讀取記住的帳號密碼
  const remembered = localStorage.getItem('roz_login_remember');
  if (remembered === '1') {
    loginForm.acc      = localStorage.getItem('roz_login_acc')  || '';
    loginForm.password = localStorage.getItem('roz_login_pwd')  || '';
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

watch(keyword,     v => localStorage.setItem('roz_shop_keyword',     v));
watch(server,      v => localStorage.setItem('roz_shop_server',      v));
watch(storeType,   v => localStorage.setItem('roz_shop_storetype',   v));
watch(historyDays, v => localStorage.setItem('roz_shop_historydays', v));

// ── 結果 ─────────────────────────────────────────────────────────
const shopResults    = ref([]);
const historyResults = ref([]);
const totalCount     = ref(0);
const currentPage    = ref(1);
const lastToken      = ref('');
const pageSize       = 30;

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

// ── 商店詳細 Modal ───────────────────────────────────────────────
const showDetail    = ref(false);
const detailLoading = ref(false);
const detailData    = ref(null);
const detailTab     = ref('store');

async function openDetail(item) {
  showDetail.value    = true;
  detailLoading.value = true;
  detailData.value    = null;
  detailTab.value     = 'store';

  try {
    const res  = await fetch(`${BASE()}/store-detail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ div_svr: server.value, SSI: item.SSI2, token: lastToken.value }),
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
  return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<font[^>]*>/gi, '')
      .replace(/<\/font>/gi, '')
      .trim();
}

function mapLabel(mapName) { return mapName ? mapName.replace('.gat', '') : ''; }

const coordCopied = ref(false);
function copyCoord(item) {
  const text = `/navi ${mapLabel(item.mapName)} ${item.xPos}/${item.yPos}`;
  navigator.clipboard.writeText(text);
  coordCopied.value = true;
  setTimeout(() => coordCopied.value = false, 2000);
}

// ── 查詢 ─────────────────────────────────────────────────────────
async function doSearch(page = 1) {
  if (!keyword.value.trim()) { errorMsg.value = '請輸入關鍵字'; return; }
  if (!loggedIn.value)       { showLogin.value = true; return; }

  errorMsg.value    = '';
  loading.value     = true;
  currentPage.value = page;

  try {
    if (activeTab.value === 'shop') {
      const res  = await fetch(`${BASE()}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          div_svr: server.value, div_storetype: storeType.value,
          txb_KeyWord: keyword.value.trim(),
          row_start: String((page - 1) * pageSize + 1),
          sort_by: 'itemPrice', sort_desc: '',
          _cookies: creds.cookies || undefined,
          _token:   creds.token   || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) { errorMsg.value = data.error; return; }
      shopResults.value = data.dt      || [];
      totalCount.value  = data.dt2?.[0]?.count || 0;
      lastToken.value   = data.token   || '';
    } else {
      const res  = await fetch(`${BASE()}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          div_svr: server.value, div_history_days: historyDays.value,
          txb_KeyWord: keyword.value.trim(),
          sort_by: 'SumitemCNT', sort_desc: 'desc',
          _cookies: creds.cookies || undefined,
          _token:   creds.token   || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) { errorMsg.value = data.error; return; }
      historyResults.value = data.dt      || [];
      totalCount.value     = data.dt2?.[0]?.count || 0;
      lastToken.value      = data.token   || '';
    }
  } catch (e) {
    errorMsg.value = '查詢失敗：' + e.message;
  } finally {
    loading.value = false;
  }
}

function switchTab(tab) {
  activeTab.value = tab;
  shopResults.value = []; historyResults.value = [];
  totalCount.value = 0; currentPage.value = 1; errorMsg.value = '';
}

function formatPrice(n) { return Number(n).toLocaleString(); }
function storeTypeLabel(t) { return t === 0 ? '販售' : '收購'; }

const slots = computed(() => {
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
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] font-sans pb-16">
    <div class="max-w-5xl mx-auto px-4 pt-8 pb-4">

      <!-- 頁首 -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-black text-[#f1d483]">🏪 露天商店查詢</h1>
        <button v-if="!loggedIn" @click="showLogin = true"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition bg-[#4a1a1a] text-[#f0a8a8] border border-[#f0a8a8]/30 hover:bg-[#5a2020] animate-pulse">
          🔑 尚未登入
        </button>
        <div v-else class="flex items-center gap-2">
          <button @click="showCreds = !showCreds"
                  class="text-xs text-[#a8f0c8] bg-[#2a4a3a] border border-[#a8f0c8]/30 px-3 py-1.5 rounded-lg hover:bg-[#2a5a4a] transition">
            ✅ 已登入 {{ showCreds ? '▲' : '▼' }}
          </button>
          <button @click="doLogout"
                  class="px-3 py-1.5 rounded-lg text-sm bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] transition">
            登出
          </button>
        </div>
      </div>

      <!-- Credentials 展開區塊 -->
      <Transition name="modal">
        <div v-if="showCreds" class="bg-[#1e150d] border border-[#5e4b37] rounded-xl p-4 mb-4 text-xs space-y-3">
          <!-- 檢視模式 -->
          <template v-if="!editingCreds">
            <div>
              <p class="text-[#a6937c] mb-1 font-bold">Cookie</p>
              <textarea readonly :value="creds.cookies" rows="3"
                        class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 py-2 text-[#e0d3b8] resize-none focus:outline-none font-mono text-xs" />
            </div>
            <div>
              <p class="text-[#a6937c] mb-1 font-bold">RequestVerificationToken</p>
              <input readonly :value="creds.token"
                     class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 py-2 text-[#e0d3b8] focus:outline-none font-mono text-xs" />
            </div>
            <div class="flex justify-end">
              <button @click="startEditCreds"
                      class="px-3 py-1.5 rounded-lg bg-[#3d2b1f] text-[#f1d483] border border-[#f1d483]/30 hover:bg-[#4a3528] transition text-xs font-bold">
                ✏️ 手動修改
              </button>
            </div>
          </template>

          <!-- 編輯模式 -->
          <template v-else>
            <div>
              <p class="text-[#a6937c] mb-1 font-bold">Cookie <span class="text-[#f0a8a8]">（編輯中）</span></p>
              <textarea v-model="editCreds.cookies" rows="4"
                        class="w-full bg-[#2c1e14] border border-[#f1d483]/50 rounded-lg px-3 py-2 text-[#e0d3b8] resize-none focus:outline-none font-mono text-xs" />
            </div>
            <div>
              <p class="text-[#a6937c] mb-1 font-bold">RequestVerificationToken <span class="text-[#f0a8a8]">（編輯中）</span></p>
              <input v-model="editCreds.token"
                     class="w-full bg-[#2c1e14] border border-[#f1d483]/50 rounded-lg px-3 py-2 text-[#e0d3b8] focus:outline-none font-mono text-xs" />
            </div>
            <div class="flex justify-end gap-2">
              <button @click="editingCreds = false"
                      class="px-3 py-1.5 rounded-lg bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528] transition text-xs">取消</button>
              <button @click="saveEditCreds"
                      class="px-3 py-1.5 rounded-lg bg-[#f1d483] text-[#2c1e14] font-bold hover:bg-[#e8c870] transition text-xs">儲存</button>
            </div>
          </template>
        </div>
      </Transition>

      <!-- Tab -->
      <div class="flex gap-2 mb-4">
        <button @click="switchTab('shop')"    class="px-5 py-2 rounded-lg font-bold text-sm transition"
                :class="activeTab==='shop'    ? 'bg-[#f1d483] text-[#2c1e14]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">露天商店查詢</button>
        <button @click="switchTab('history')" class="px-5 py-2 rounded-lg font-bold text-sm transition"
                :class="activeTab==='history' ? 'bg-[#f1d483] text-[#2c1e14]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">成交紀錄查詢</button>
      </div>

      <!-- 搜尋列 -->
      <div class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-4 mb-4">
        <div class="flex flex-wrap gap-3 items-end">
          <div class="flex-1 min-w-48">
            <label class="text-xs text-[#a6937c] mb-1 block">關鍵字</label>
            <input v-model="keyword" @keyup.enter="doSearch(1)" type="text" placeholder="輸入道具名稱..."
                   class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] focus:outline-none focus:border-[#f1d483]" />
          </div>
          <div>
            <label class="text-xs text-[#a6937c] mb-1 block">伺服器</label>
            <select v-model="server" class="bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] focus:outline-none focus:border-[#f1d483]">
              <option value="529">西格倫</option>
              <option value="629">艾克瑟</option>
            </select>
          </div>
          <div v-if="activeTab === 'shop'">
            <label class="text-xs text-[#a6937c] mb-1 block">類型</label>
            <select v-model="storeType" class="bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] focus:outline-none focus:border-[#f1d483]">
              <option value="0">全部</option>
              <option value="1">收購</option>
              <option value="2">販售</option>
            </select>
          </div>
          <div v-if="activeTab === 'history'">
            <label class="text-xs text-[#a6937c] mb-1 block">天數</label>
            <select v-model="historyDays" class="bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] focus:outline-none focus:border-[#f1d483]">
              <option value="1">1 天</option>
              <option value="7">7 天</option>
              <option value="30">30 天</option>
            </select>
          </div>
          <button @click="doSearch(1)" :disabled="loading"
                  class="px-6 py-2 bg-[#f1d483] text-[#2c1e14] font-black rounded-lg hover:bg-[#e8c870] disabled:opacity-50 disabled:cursor-not-allowed transition">
            {{ loading ? '查詢中...' : '查詢' }}
          </button>
        </div>
        <p v-if="errorMsg" class="mt-3 text-sm text-[#f0a8a8] bg-[#4a1a1a] rounded-lg px-3 py-2">⚠️ {{ errorMsg }}</p>
      </div>

      <!-- 結果數 -->
      <div v-if="totalCount > 0" class="text-sm text-[#a6937c] mb-3">
        共 {{ totalCount }} 筆結果
        <span v-if="totalPages > 1">（第 {{ currentPage }} / {{ totalPages }} 頁）</span>
      </div>

      <!-- 露天商店結果 -->
      <div v-if="activeTab === 'shop' && shopResults.length > 0">
        <div class="overflow-x-auto rounded-xl border border-[#5e4b37]">
          <table class="w-full text-sm">
            <thead>
            <tr class="bg-[#3d2b1f] text-[#f1d483] text-left">
              <th class="px-4 py-3 font-bold">商店名稱</th>
              <th class="px-4 py-3 font-bold">道具名稱</th>
              <th class="px-4 py-3 font-bold text-right">單價</th>
              <th class="px-4 py-3 font-bold text-right">數量</th>
              <th class="px-4 py-3 font-bold text-center">類型</th>
              <th class="px-4 py-3 font-bold">精煉/Slot</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, i) in shopResults" :key="i" class="border-t border-[#5e4b37] hover:bg-[#3d2b1f] transition">
              <td class="px-4 py-2.5">
                <button @click="openDetail(item)" class="text-[#f1d483] hover:underline font-bold text-left">{{ item.storeName }}</button>
              </td>
              <td class="px-4 py-2.5 font-bold text-[#e0d3b8]">
                {{ item.itemName }}
                <span v-if="item.ItemGradeLevel > 0" class="text-[#f1d483] text-xs ml-1">★{{ item.ItemGradeLevel }}</span>
              </td>
              <td class="px-4 py-2.5 text-right font-bold text-[#f1d483]">{{ formatPrice(item.itemPrice) }} z</td>
              <td class="px-4 py-2.5 text-right text-[#a6937c]">{{ item.itemCNT }}</td>
              <td class="px-4 py-2.5 text-center">
                  <span class="text-xs px-2 py-0.5 rounded-full"
                        :class="item.storetype===0 ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#2a3a4a] text-[#a8c0f0]'">
                    {{ storeTypeLabel(item.storetype) }}
                  </span>
              </td>
              <td class="px-4 py-2.5 text-[#a6937c] text-xs">
                <span v-if="item.itemRefining > 0">+{{ item.itemRefining }} </span>
                <span v-if="item.slot_1">{{ item.slot_1 }} </span>
                <span v-if="item.slot_2">{{ item.slot_2 }} </span>
                <span v-if="item.slot_3">{{ item.slot_3 }} </span>
                <span v-if="item.slot_4">{{ item.slot_4 }}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-4">
          <button @click="doSearch(currentPage-1)" :disabled="currentPage<=1"
                  class="px-3 py-1.5 rounded-lg bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">← 上一頁</button>
          <span class="px-3 py-1.5 text-sm text-[#f1d483]">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="doSearch(currentPage+1)" :disabled="currentPage>=totalPages"
                  class="px-3 py-1.5 rounded-lg bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">下一頁 →</button>
        </div>
      </div>

      <!-- 成交紀錄結果 -->
      <div v-if="activeTab === 'history' && historyResults.length > 0">
        <div class="overflow-x-auto rounded-xl border border-[#5e4b37]">
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
            <tr v-for="(item, i) in historyResults" :key="i" class="border-t border-[#5e4b37] hover:bg-[#3d2b1f] transition">
              <td class="px-4 py-2.5 font-bold text-[#e0d3b8]">{{ item.itemName }}</td>
              <td class="px-4 py-2.5 text-right text-[#a8f0c8]">{{ formatPrice(item.MinPrice) }} z</td>
              <td class="px-4 py-2.5 text-right text-[#f1d483] font-bold">{{ formatPrice(item.AvgPrice) }} z</td>
              <td class="px-4 py-2.5 text-right text-[#f0a8a8]">{{ formatPrice(item.MaxPrice) }} z</td>
              <td class="px-4 py-2.5 text-right text-[#a6937c]">{{ item.SumitemCNT }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 查無資料 -->
      <div v-if="!loading && totalCount===0 && shopResults.length===0 && historyResults.length===0 && keyword"
           class="text-center py-16 text-[#6b5a4a]">
        <div class="text-4xl mb-3">👻</div>
        <p>查無資料</p>
      </div>

    </div>

    <!-- ── 商店詳細 Modal ── -->
    <Transition name="modal">
      <div v-if="showDetail" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
           @click.self="showDetail = false">
        <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-2xl w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col">

          <div class="px-6 pt-5 pb-3 border-b border-[#5e4b37] shrink-0">
            <h2 class="text-[#f1d483] font-black text-lg mb-3">🏪 商店資訊</h2>
            <div class="flex gap-2">
              <button @click="detailTab='store'" class="px-4 py-1.5 rounded-lg text-xs font-bold transition"
                      :class="detailTab==='store' ? 'bg-[#f1d483] text-[#2c1e14]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">露天商店資訊</button>
              <button @click="detailTab='sell'"  class="px-4 py-1.5 rounded-lg text-xs font-bold transition"
                      :class="detailTab==='sell'  ? 'bg-[#f1d483] text-[#2c1e14]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">販售資訊</button>
              <button @click="detailTab='desc'"  class="px-4 py-1.5 rounded-lg text-xs font-bold transition"
                      :class="detailTab==='desc'  ? 'bg-[#f1d483] text-[#2c1e14]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">道具說明</button>
            </div>
          </div>

          <div class="overflow-y-auto px-6 py-4 flex-1">
            <div v-if="detailLoading" class="text-center py-8 text-[#a6937c]">載入中...</div>
            <div v-else-if="detailData">

              <!-- 露天商店資訊 -->
              <div v-if="detailTab === 'store'" class="space-y-0 text-sm">
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">商店名稱</span>
                  <span class="font-bold text-[#e0d3b8]">{{ detailData.storeName }}</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">角色名稱</span>
                  <span class="font-bold text-[#e0d3b8]">{{ detailData.ItemSellerCharName }}</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">道具名稱</span>
                  <span class="font-bold text-[#e0d3b8]">
                    {{ detailData.itemName }}
                    <span v-if="detailData.ItemGradeLevel > 0" class="text-[#f1d483] ml-1">★{{ detailData.ItemGradeLevel }}</span>
                  </span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">商店座標</span>
                  <button @click="copyCoord(detailData)"
                          class="font-bold text-[#f1d483] hover:text-[#e8c870] flex items-center gap-1.5 transition">
                    {{ mapLabel(detailData.mapName) }} {{ detailData.xPos }}/{{ detailData.yPos }}
                    <span class="text-xs text-[#a6937c]">{{ coordCopied ? '已複製' : '複製' }}</span>
                  </button>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">單價</span>
                  <span class="font-bold text-[#f1d483]">{{ formatPrice(detailData.itemPrice) }} z</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">數量</span>
                  <span class="font-bold text-[#e0d3b8]">{{ detailData.itemCNT }}</span>
                </div>
                <div class="flex justify-between py-2.5">
                  <span class="text-[#a6937c]">收購/販售</span>
                  <span class="text-xs px-2 py-0.5 rounded-full"
                        :class="detailData.storetype===0 ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#2a3a4a] text-[#a8c0f0]'">
                    {{ storeTypeLabel(detailData.storetype) }}
                  </span>
                </div>
              </div>

              <!-- 販售資訊 -->
              <div v-if="detailTab === 'sell'" class="space-y-0 text-sm">
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">精煉</span>
                  <span class="font-bold text-[#a8f0c8]">{{ detailData.itemRefining > 0 ? '+' + detailData.itemRefining : '-' }}</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">階級</span>
                  <span class="font-bold text-[#f1d483]">{{ detailData.ItemGradeLevel > 0 ? '★' + detailData.ItemGradeLevel : '-' }}</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">道具名稱</span>
                  <span class="font-bold text-[#e0d3b8]">{{ detailData.itemName }}</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">Slot 數</span>
                  <span class="font-bold text-[#e0d3b8]">{{ detailData.DefaultSlotCount || detailData.slotCount }}</span>
                </div>
                <template v-if="slots.length > 0">
                  <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                    <span class="text-[#a6937c]">卡片/附魔</span>
                    <div class="text-right">
                      <div v-for="(s, i) in slots" :key="i" class="text-[#e8c870] font-bold">{{ s }}</div>
                    </div>
                  </div>
                </template>
                <div v-else class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">卡片/附魔</span>
                  <span class="text-[#6b5a4a]">-</span>
                </div>
                <template v-if="randomOpts.length > 0">
                  <div class="py-2.5 border-b border-[#5e4b37]">
                    <p class="text-[#a6937c] mb-2">附加能力</p>
                    <div v-for="(opt, i) in randomOpts" :key="i" class="text-[#a8f0c8] text-xs py-0.5">{{ opt }}</div>
                  </div>
                </template>
                <div v-else class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">附加能力</span>
                  <span class="text-[#6b5a4a]">-</span>
                </div>
              </div>

              <!-- 道具說明 -->
              <div v-if="detailTab === 'desc'" class="text-sm space-y-0">
                <div class="py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c] text-xs">道具名稱</span>
                  <p class="font-bold text-[#e0d3b8] mt-1">{{ detailData.itemName }}</p>
                </div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c] text-xs">Slot</span>
                  <span class="font-bold text-[#e0d3b8]">{{ detailData.DefaultSlotCount || detailData.slotCount }}</span>
                </div>
                <div class="py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c] text-xs">敘述</span>
                  <pre class="mt-2 text-xs text-[#e0d3b8] whitespace-pre-wrap font-sans leading-relaxed">{{ parseDesc(detailData.identifiedDescription) }}</pre>
                </div>
                <template v-if="detailData.slotDetails && detailData.slotDetails.length > 0">
                  <div v-for="(sd, i) in detailData.slotDetails" :key="i">
                    <div class="py-2.5 border-b border-[#5e4b37]">
                      <span class="text-[#a6937c] text-xs">卡片/附魔 {{ i + 1 }}</span>
                      <p class="font-bold text-[#e8c870] mt-1">{{ sd.name }}</p>
                    </div>
                    <div v-if="sd.desc" class="py-2.5 border-b border-[#5e4b37]">
                      <span class="text-[#a6937c] text-xs">敘述</span>
                      <pre class="mt-2 text-xs text-[#e0d3b8] whitespace-pre-wrap font-sans leading-relaxed">{{ parseDesc(sd.desc) }}</pre>
                    </div>
                  </div>
                </template>
              </div>

            </div>
            <div v-else class="text-center py-8 text-[#6b5a4a]">查無資料</div>
          </div>

          <div class="px-6 pb-5 pt-3 shrink-0">
            <button @click="showDetail = false"
                    class="w-full py-2 bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528] rounded-lg transition text-sm font-bold">
              關閉
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 登入 Modal ── -->
    <Transition name="modal">
      <div v-if="showLogin" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
           @click.self="showLogin = false">
        <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <h2 class="text-[#f1d483] font-black text-lg mb-5">🔑 登入 gnjoy</h2>

          <div class="mb-3">
            <label class="text-xs text-[#a6937c] mb-1 block">遊戲帳號</label>
            <input v-model="loginForm.acc" type="text" placeholder="請輸入帳號..."
                   @keyup.enter="doLogin"
                   class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] focus:outline-none focus:border-[#f1d483]" />
          </div>
          <div class="mb-4">
            <label class="text-xs text-[#a6937c] mb-1 block">身分證字號</label>
            <input v-model="loginForm.password" type="password" placeholder="請輸入密碼..."
                   @keyup.enter="doLogin"
                   class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] focus:outline-none focus:border-[#f1d483]" />
          </div>

          <!-- 記住帳號密碼 -->
          <label class="flex items-center gap-2 mb-4 cursor-pointer select-none">
            <input v-model="loginForm.remember" type="checkbox"
                   class="w-4 h-4 rounded accent-[#f1d483] cursor-pointer" />
            <span class="text-xs text-[#a6937c]">記住帳號和密碼</span>
          </label>

          <p v-if="loginError" class="mb-3 text-sm text-[#f0a8a8] bg-[#4a1a1a] rounded-lg px-3 py-2">⚠️ {{ loginError }}</p>

          <!-- 登入中提示 -->
          <div v-if="loginLoading" class="mb-3 text-sm text-[#a6937c] bg-[#3d2b1f] rounded-lg px-3 py-2 text-center">
            ⏳ 正在開啟瀏覽器並自動登入，請稍候...
          </div>

          <div class="flex justify-end gap-2">
            <button @click="showLogin = false; loginError = ''"
                    class="px-4 py-2 rounded-lg bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528] transition text-sm">取消</button>
            <button @click="doLogin" :disabled="loginLoading"
                    class="px-4 py-2 rounded-lg bg-[#f1d483] text-[#2c1e14] font-bold hover:bg-[#e8c870] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm">
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
</style>