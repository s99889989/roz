<script setup>
import {ref, reactive, computed, onMounted, watch} from 'vue';
import {useCommonStore} from '~/stores/common.js';

definePageMeta({layout: 'roz'});

const commonStore = useCommonStore();
const BASE = () => commonStore.data.roz_url + '/shop';
const AUTH = () => commonStore.data.roz_url + '/auth';

// ── 統一 fetch wrapper + 登入攔截 ────────────────────────────────
// 後端 session 過期時回 HTTP 200 + { error: '請先登入' }，同時也處理 HTTP 401
async function authFetch(url, options = {}) {
  const res = await fetch(url, {credentials: 'include', ...options});
  if (res.status === 401) {
    loggedIn.value = false;
    showLogin.value = true;
    throw new Error('SESSION_EXPIRED');
  }
  return res;
}

// 解析回應，遇到「請先登入」自動彈 modal 並 throw；其他 error 也 throw
function handleApiResponse(data) {
  if (data?.error) {
    if (data.error.includes('請先登入')) {
      loggedIn.value = false;
      showLogin.value = true;
      throw new Error('SESSION_EXPIRED');
    }
    throw new Error(data.error);
  }
  return data;
}

// ── 熱門關鍵字 ───────────────────────────────────────────────────
const hotKeywords = ref([]);

async function fetchHotKeywords() {
  try {
    const res = await fetch(`${BASE()}/hot-keywords`, {credentials: 'include'});
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) hotKeywords.value = data;
  } catch {
  }
}

// ── 常用關鍵字（localStorage）────────────────────────────────────
const usedKeywords = ref([]);

function loadUsedKeywords() {
  try {
    usedKeywords.value = JSON.parse(localStorage.getItem('roz_used_keywords') || '[]');
  } catch {
    usedKeywords.value = [];
  }
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
const loggedIn = ref(false);
const showLogin = ref(false);
const loginForm = reactive({acc: '', password: '', remember: false});
const loginLoading = ref(false);
const loginError = ref('');

async function checkStatus() {
  try {
    const res = await fetch(`${AUTH()}/status`, {credentials: 'include'});
    const data = await res.json();
    loggedIn.value = data.loggedIn ?? false;
  } catch {
    loggedIn.value = false;
  }
}

async function doLogin() {
  if (!loginForm.acc || !loginForm.password) {
    loginError.value = '請輸入帳號和密碼';
    return;
  }
  loginError.value = '';
  loginLoading.value = true;
  try {
    const res = await fetch(`${AUTH()}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      // remember 傳給後端，由後端決定 session cookie 有效期（30天 or 瀏覽器關閉失效）
      // 帳號/身分證不再存入 localStorage
      body: JSON.stringify({acc: loginForm.acc, password: loginForm.password, remember: loginForm.remember}),
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
      loggedIn.value = true;
      showLogin.value = false;
      if (!loginForm.remember) {
        loginForm.acc = '';
        loginForm.password = '';
      }
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
    await fetch(`${AUTH()}/logout`, {method: 'POST', credentials: 'include'});
  } catch {
  }
  loggedIn.value = false;
  shopResultsRaw.value = [];
  historyResults.value = [];
  shopTotalCount.value = 0;
  historyTotalCount.value = 0;
  errorMsg.value = '';
}

onMounted(async () => {
  document.title = '露天商店查詢';
  loadUsedKeywords();
  await fetchHotKeywords();
  await checkStatus();
  keyword.value = localStorage.getItem('roz_shop_keyword') || '';
  server.value = localStorage.getItem('roz_shop_server') || '529';
  storeType.value = localStorage.getItem('roz_shop_storetype') || '0';
  historyDays.value = localStorage.getItem('roz_shop_historydays') || '1';
  const remembered = localStorage.getItem('roz_login_remember');
  if (remembered === '1') {
    loginForm.acc = localStorage.getItem('roz_login_acc') || '';
    loginForm.password = localStorage.getItem('roz_login_pwd') || '';
    loginForm.remember = true;
  }
});

// ── 查詢表單 ─────────────────────────────────────────────────────
const activeTab = ref('shop');
const keyword = ref('');
const server = ref('529');
const storeType = ref('0');
const historyDays = ref('1');
const loading = ref(false);
const errorMsg = ref('');

// 切 tab 只切換顯示，不清除結果
function switchTab(tab) {
  if (activeTab.value === tab) return;
  activeTab.value = tab;
  errorMsg.value = '';
  if (tab === 'searchHistory') fetchSearchHistory(searchHistoryPage.value);
  if (tab === 'alert') fetchAlertRules();
}

watch(keyword, v => localStorage.setItem('roz_shop_keyword', v));
watch(server, v => localStorage.setItem('roz_shop_server', v));
watch(storeType, v => localStorage.setItem('roz_shop_storetype', v));
watch(historyDays, v => localStorage.setItem('roz_shop_historydays', v));

// ── 排序（純前端，不重打 API）────────────────────────────────────
const sortKey = ref('price_asc');

const sortOptions = [
  {label: '單價 低→高', value: 'price_asc'},
  {label: '單價 高→低', value: 'price_desc'},
  {label: '數量 低→高', value: 'cnt_asc'},
  {label: '數量 高→低', value: 'cnt_desc'},
];

// ── 價格區間（前端過濾）─────────────────────────────────────────
const priceMin = ref('');
const priceMax = ref('');
const priceUnit = ref(1);
const priceUnitLabel = computed(() => priceUnit.value === 1 ? 'z' : '萬z');

const priceMinZ = computed(() => priceMin.value !== '' ? Number(priceMin.value) * priceUnit.value : null);
const priceMaxZ = computed(() => priceMax.value !== '' ? Number(priceMax.value) * priceUnit.value : null);

// ── 附加能力過濾（前端）─────────────────────────────────────────
// 每一條件：{ keyword: string, operator: '>' | '>=' | '<' | '<=' | '=', value: string }
const optFilters = ref([]);

function addOptFilter() {
  optFilters.value.push({ keyword: '', operator: '>', value: '' });
}

function removeOptFilter(idx) {
  optFilters.value.splice(idx, 1);
}

function clearOptFilters() {
  optFilters.value = [];
}

// 解析附加能力字串中的數字（取最後一個數字，例如「增加 15」→ 15）
function parseOptValue(str) {
  const matches = str.match(/-?\d+(\.\d+)?/g);
  if (!matches) return null;
  return Number(matches[matches.length - 1]);
}

// 判斷單一物品是否通過所有附加能力條件
function matchOptFilters(item) {
  if (optFilters.value.length === 0) return true;
  const opts = [item.RandomOpt1, item.RandomOpt2, item.RandomOpt3, item.RandomOpt4, item.RandomOpt5].filter(Boolean);
  for (const cond of optFilters.value) {
    const kw = cond.keyword.trim().toLowerCase();
    const threshold = cond.value !== '' ? Number(cond.value) : null;
    if (!kw) continue; // 關鍵字空白略過此條件
    // 找到含關鍵字的那條附加能力
    const matched = opts.find(o => o.toLowerCase().includes(kw));
    if (!matched) return false; // 沒找到直接不符合
    if (threshold === null || isNaN(threshold)) continue; // 只要求有此能力，不限數值
    const optVal = parseOptValue(matched);
    if (optVal === null) return false;
    switch (cond.operator) {
      case '>':  if (!(optVal >  threshold)) return false; break;
      case '>=': if (!(optVal >= threshold)) return false; break;
      case '<':  if (!(optVal <  threshold)) return false; break;
      case '<=': if (!(optVal <= threshold)) return false; break;
      case '=':  if (!(optVal === threshold)) return false; break;
    }
  }
  return true;
}

const hasOptFilter = computed(() => optFilters.value.some(f => f.keyword.trim() !== ''));
const isFiltered = computed(() => priceMinZ.value !== null || priceMaxZ.value !== null || hasOptFilter.value);

function togglePriceUnit() {
  if (priceUnit.value === 1) {
    if (priceMin.value !== '') priceMin.value = String(Math.floor(Number(priceMin.value) / 10000));
    if (priceMax.value !== '') priceMax.value = String(Math.floor(Number(priceMax.value) / 10000));
    priceUnit.value = 10000;
  } else {
    if (priceMin.value !== '') priceMin.value = String(Number(priceMin.value) * 10000);
    if (priceMax.value !== '') priceMax.value = String(Number(priceMax.value) * 10000);
    priceUnit.value = 1;
  }
}

// ── 結果（商店 & 成交紀錄各自保留，切 tab 不清除）───────────────
const shopResultsRaw = ref([]);
const historyResults = ref([]);
const shopTotalCount = ref(0);
const historyTotalCount = ref(0);
const shopCurrentPage = ref(1);
const historyCurrentPage = ref(1);
const pageSize = 30;

const shopTotalPages = computed(() => Math.ceil(shopTotalCount.value / pageSize));
const historyTotalPages = computed(() => Math.ceil(historyTotalCount.value / pageSize));

// 套用過濾 + 排序（純前端，不重打 API）
const shopResults = computed(() => {
  let list = [...shopResultsRaw.value];
  if (priceMinZ.value !== null) list = list.filter(i => Number(i.itemPrice) >= priceMinZ.value);
  if (priceMaxZ.value !== null) list = list.filter(i => Number(i.itemPrice) <= priceMaxZ.value);
  if (hasOptFilter.value) list = list.filter(i => matchOptFilters(i));
  switch (sortKey.value) {
    case 'price_asc':
      list.sort((a, b) => Number(a.itemPrice) - Number(b.itemPrice));
      break;
    case 'price_desc':
      list.sort((a, b) => Number(b.itemPrice) - Number(a.itemPrice));
      break;
    case 'cnt_asc':
      list.sort((a, b) => Number(a.itemCNT) - Number(b.itemCNT));
      break;
    case 'cnt_desc':
      list.sort((a, b) => Number(b.itemCNT) - Number(a.itemCNT));
      break;
  }
  return list;
});

const filteredCount = computed(() => shopResults.value.length);

// ── 分頁跳頁輸入 ─────────────────────────────────────────────────
const shopPageInput = ref('');
const historyPageInput = ref('');
const srPageInput = ref('');

function jumpPage(type, totalPages) {
  const inputMap = {shop: shopPageInput, history: historyPageInput, searchHistory: srPageInput};
  const raw = parseInt(inputMap[type].value, 10);
  if (isNaN(raw)) return;
  const page = Math.min(Math.max(1, raw), totalPages);
  inputMap[type].value = '';
  if (type === 'shop') doSearch(page);
  if (type === 'history') doSearch(page);
  if (type === 'searchHistory') fetchSearchHistory(page);
}

// ── 商店詳細 Modal ───────────────────────────────────────────────
const showDetail = ref(false);
const detailLoading = ref(false);
const detailData = ref(null);
const detailTab = ref('store');

async function openDetail(item) {
  if (!loggedIn.value) {
    showLogin.value = true;
    return;
  }
  showDetail.value = true;
  detailLoading.value = true;
  detailData.value = null;
  detailTab.value = 'store';
  try {
    const res = await authFetch(`${BASE()}/store-detail`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({div_svr: server.value, SSI: item.SSI2}),
    });
    const data = await res.json();
    handleApiResponse(data);
    detailData.value = data;
  } catch (e) {
    if (e.message !== 'SESSION_EXPIRED') errorMsg.value = '查詢失敗：' + e.message;
    showDetail.value = false;
  } finally {
    detailLoading.value = false;
  }
}

function parseDesc(html) {
  if (!html) return '';
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<font[^>]*>/gi, '').replace(/<\/font>/gi, '').trim();
}

function mapLabel(mapName) {
  return mapName ? mapName.replace('.gat', '') : '';
}

const coordCopied = ref(false);

function copyCoord(item) {
  navigator.clipboard.writeText(`/navi ${mapLabel(item.mapName)} ${item.xPos}/${item.yPos}`);
  coordCopied.value = true;
  setTimeout(() => coordCopied.value = false, 2000);
}

// ── 地圖預覽 ─────────────────────────────────────────────────────
const showMapModal = ref(false);
const mapModalItem = ref(null);   // { storeName, mapName, xPos, yPos }

function openMapModal(item) {
  mapModalItem.value = item;
  showMapModal.value = true;
}

// prontera.jpg 座標換算
// 用4個傳送點校準（像素 ↔ 遊戲座標線性回歸）：
//   左傳送點 game(27,203)  -> pixel(23.9, 239.5)
//   右傳送點 game(284,204) -> pixel(372.7, 238.5)
//   上傳送點 game(155,355) -> pixel(198.5, 19.4)
//   下傳送點 game(155,26)  -> pixel(197.5, 476.4)
// pixel_x = 1.357198 * game_x - 12.7444
// pixel_y = -1.389058 * game_y + 512.5155  (Y 軸反轉)
const MAP_IMG_W = 399;
const MAP_IMG_H = 499;
const SLOPE_X = 1.357198;
const INTERCEPT_X = -12.7444;
const SLOPE_Y = -1.389058;
const INTERCEPT_Y = 512.5155;

function markerLeft(xPos) {
  const px = SLOPE_X * Number(xPos) + INTERCEPT_X;
  return `${(px / MAP_IMG_W) * 100}%`;
}

function markerTop(yPos) {
  const px = SLOPE_Y * Number(yPos) + INTERCEPT_Y;
  return `${(px / MAP_IMG_H) * 100}%`;
}

function isProntera(mapName) {
  return mapName && mapName.toLowerCase().includes('prontera');
}

// ── 查詢 ─────────────────────────────────────────────────────────
async function doSearch(page = 1) {
  if (!keyword.value.trim()) {
    errorMsg.value = '請輸入關鍵字';
    return;
  }
  // 直接用前端 state 判斷，不再每次查詢前呼叫 checkStatus()。
  // session 真正失效時由 authFetch + handleApiResponse 攔截（401 或 { error: '請先登入' }）。
  if (!loggedIn.value) {
    showLogin.value = true;
    return;
  }

  addUsedKeyword(keyword.value.trim());
  errorMsg.value = '';
  loading.value = true;

  try {
    if (activeTab.value === 'shop') {
      shopCurrentPage.value = page;
      const res = await authFetch(`${BASE()}/search`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          div_svr: server.value, div_storetype: storeType.value,
          txb_KeyWord: keyword.value.trim(),
          row_start: String((page - 1) * pageSize + 1),
          sort_by: 'itemPrice', sort_desc: '',
        }),
      });
      const data = await res.json();
      handleApiResponse(data);
      shopResultsRaw.value = data.dt || [];
      shopTotalCount.value = data.dt2?.[0]?.count || 0;
    } else {
      historyCurrentPage.value = page;
      const res = await authFetch(`${BASE()}/history`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          div_svr: server.value, div_history_days: historyDays.value,
          txb_KeyWord: keyword.value.trim(),
          sort_by: 'SumitemCNT', sort_desc: 'desc',
        }),
      });
      const data = await res.json();
      handleApiResponse(data);
      historyResults.value = data.dt || [];
      historyTotalCount.value = data.dt2?.[0]?.count || 0;
    }
  } catch (e) {
    if (e.message !== 'SESSION_EXPIRED') errorMsg.value = '查詢失敗：' + e.message;
  } finally {
    loading.value = false;
  }
}

// ── 查詢紀錄 ─────────────────────────────────────────────────────
const searchHistoryRecords = ref([]);
const searchHistoryTotal = ref(0);
const searchHistoryTotalPages = ref(1);
const searchHistoryPage = ref(1);
const searchHistoryPageSize = 20;
const searchHistoryLoading = ref(false);
const searchHistoryKeyword = ref('');

const filteredSearchHistory = computed(() => {
  const kw = searchHistoryKeyword.value.trim().toLowerCase();
  if (!kw) return searchHistoryRecords.value;
  return searchHistoryRecords.value.filter(r => r.itemName.toLowerCase().includes(kw));
});

// 展開某一筆紀錄的詳細物品列表
const expandedHistoryId = ref(null);
const expandedItemsPage = ref({});   // { [recordId]: currentPage }
const expandedItemsSearch = ref({});   // { [recordId]: keyword }
const EXPANDED_PAGE_SIZE = 30;

function toggleExpand(id) {
  if (expandedHistoryId.value === id) {
    expandedHistoryId.value = null;
  } else {
    expandedHistoryId.value = id;
    if (!expandedItemsPage.value[id]) expandedItemsPage.value[id] = 1;
    if (expandedItemsSearch.value[id] === undefined) expandedItemsSearch.value[id] = '';
  }
}

function getExpandedItems(record) {
  const kw = (expandedItemsSearch.value[record.id] || '').trim().toLowerCase();
  const filtered = kw
      ? record.items.filter(i => {
        const slots = [i.slot_1, i.slot_2, i.slot_3, i.slot_4].filter(Boolean).join(' ');
        const opts = [i.RandomOpt1, i.RandomOpt2, i.RandomOpt3, i.RandomOpt4, i.RandomOpt5].filter(Boolean).join(' ');
        const refine = i.itemRefining > 0 ? `+${i.itemRefining}` : '';
        return [slots, opts, refine, i.mapName || '', i.regDate_ || ''].join(' ').toLowerCase().includes(kw);
      })
      : record.items;

  const page = expandedItemsPage.value[record.id] || 1;
  const totalPages = Math.ceil(filtered.length / EXPANDED_PAGE_SIZE) || 1;
  const start = (page - 1) * EXPANDED_PAGE_SIZE;
  return {
    items: filtered.slice(start, start + EXPANDED_PAGE_SIZE),
    total: filtered.length,
    page,
    totalPages,
  };
}

function setExpandedPage(id, page) {
  expandedItemsPage.value = {...expandedItemsPage.value, [id]: page};
}

function setExpandedSearch(id, val) {
  expandedItemsSearch.value = {...expandedItemsSearch.value, [id]: val};
  expandedItemsPage.value = {...expandedItemsPage.value, [id]: 1};
}

async function fetchSearchHistory(page = 1) {
  searchHistoryLoading.value = true;
  searchHistoryPage.value = page;
  try {
    const res = await authFetch(`${BASE()}/search-history?page=${page}&pageSize=${searchHistoryPageSize}`);
    const data = await res.json();
    searchHistoryRecords.value = data.records || [];
    searchHistoryTotal.value = data.total || 0;
    searchHistoryTotalPages.value = data.totalPages || 1;
  } catch (e) {
    if (e.message !== 'SESSION_EXPIRED') errorMsg.value = '讀取查詢紀錄失敗：' + e.message;
  } finally {
    searchHistoryLoading.value = false;
  }
}

function serverLabel(s) {
  return s === '529' ? '西格倫' : s === '629' ? '艾克瑟' : s;
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ` +
      `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatPrice(n) {
  return Number(n).toLocaleString();
}

function storeTypeLabel(t) {
  return t === 0 ? '販售' : '收購';
}

function itemDisplayName(item) {
  return item.itemRefining > 0 ? `+${item.itemRefining} ${item.itemName}` : item.itemName;
}

function slotDisplay(item) {
  const s = [item.slot_1, item.slot_2, item.slot_3, item.slot_4].filter(Boolean);
  return s.length ? s.join('・') : '-';
}

function randomOptDisplay(item) {
  return [item.RandomOpt1, item.RandomOpt2, item.RandomOpt3, item.RandomOpt4, item.RandomOpt5].filter(Boolean);
}

// ── 商店結果顯示模式（table / card）─────────────────────────────
const shopViewMode = ref(localStorage.getItem('roz_shop_viewmode') || 'table');
watch(shopViewMode, v => localStorage.setItem('roz_shop_viewmode', v));
// ── 成交資訊 Modal ───────────────────────────────────────────────
const showHistoryDetail = ref(false);
const historyDetailLoading = ref(false);
const historyDetailItem = ref(null);   // 來自 history list 的那一筆
const historyDetailChart = ref([]);     // GroupByHour / GroupByDay
const historyDetailRecords = ref([]);     // DealDetail 當頁
const historyDetailTotal = ref(0);
const historyDetailPage = ref(1);
const historyDetailPageSize = 30;
const historyDetailTotalPages = computed(() => Math.ceil(historyDetailTotal.value / historyDetailPageSize) || 1);
const historyDetailPageInput = ref('');
const historyDetailSortBy = ref('regDate_');
const historyDetailSortDesc = ref('desc');

async function openHistoryDetail(item) {
  if (!loggedIn.value) {
    showLogin.value = true;
    return;
  }
  historyDetailItem.value = item;
  showHistoryDetail.value = true;
  historyDetailPage.value = 1;
  detailSearchKeyword.value = '';
  await loadHistoryDetail(1);
}

async function loadHistoryDetail(page = 1) {
  historyDetailLoading.value = true;
  historyDetailPage.value = page;
  try {
    const res = await authFetch(`${BASE()}/history-detail`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        div_svr: server.value,
        div_history_days: historyDetailItem.value.days || historyDays.value,
        itemID: historyDetailItem.value.itemID_e,
        itemName: historyDetailItem.value.itemName,
        row_start: String((page - 1) * historyDetailPageSize + 1),
        sort_by: historyDetailSortBy.value,
        sort_desc: historyDetailSortDesc.value,
        GroupByMap: 'true',
      }),
    });
    const data = await res.json();
    handleApiResponse(data);
    historyDetailChart.value = data.chart || [];
    historyDetailRecords.value = data.detail || [];
    historyDetailTotal.value = data.totalCount || 0;
  } catch (e) {
    if (e.message !== 'SESSION_EXPIRED') errorMsg.value = '查詢失敗：' + e.message;
    showHistoryDetail.value = false;
  } finally {
    historyDetailLoading.value = false;
  }
}

function historyDetailSort(by) {
  if (historyDetailSortBy.value === by) {
    historyDetailSortDesc.value = historyDetailSortDesc.value === 'desc' ? '' : 'desc';
  } else {
    historyDetailSortBy.value = by;
    historyDetailSortDesc.value = 'desc';
  }
  if (historyDetailItem.value?._fromRecord) {
    historyDetailPage.value = 1;  // 前端排序，只需重置頁碼
  } else {
    loadHistoryDetail(1);
  }
}

function sortIcon(by) {
  if (historyDetailSortBy.value !== by) return '⇅';
  return historyDetailSortDesc.value === 'desc' ? '↓' : '↑';
}

function jumpHistoryDetail(totalPages) {
  const raw = parseInt(historyDetailPageInput.value, 10);
  if (isNaN(raw)) return;
  const page = Math.min(Math.max(1, raw), totalPages);
  historyDetailPageInput.value = '';
  if (historyDetailItem.value?._fromRecord) {
    historyDetailPage.value = page;
  } else {
    loadHistoryDetail(page);
  }
}

// ── 道具說明 Modal ───────────────────────────────────────────────
const showItemDetail = ref(false);
const itemDetailLoading = ref(false);
const itemDetailData = ref(null);  // { name, desc, slotCount }

async function openItemDetail(itemID_e) {
  if (!itemID_e) return;
  if (!loggedIn.value) {
    showLogin.value = true;
    return;
  }
  showItemDetail.value = true;
  itemDetailLoading.value = true;
  itemDetailData.value = null;
  try {
    const res = await authFetch(`${BASE()}/item-detail`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({itemID: itemID_e}),
    });
    const data = await res.json();
    handleApiResponse(data);
    itemDetailData.value = data;
  } catch (e) {
    if (e.message !== 'SESSION_EXPIRED') errorMsg.value = '查詢失敗：' + e.message;
    showItemDetail.value = false;
  } finally {
    itemDetailLoading.value = false;
  }
}

function dealSlots(item) {
  return [item.slot_1, item.slot_2, item.slot_3, item.slot_4].filter(Boolean);
}

function dealOpts(item) {
  return [item.RandomOpt1, item.RandomOpt2, item.RandomOpt3, item.RandomOpt4, item.RandomOpt5].filter(Boolean);
}

function mapLabelShort(mapName) {
  return mapName ? mapName.replace('.gat', '') : '';
}

// 折線圖（Canvas + requestAnimationFrame，純 vanilla）
import {nextTick} from 'vue';

function drawChart(data) {
  nextTick(() => {
    const canvas = document.getElementById('hdChart');
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = 220;
    const PAD = {top: 20, right: 20, bottom: 40, left: 70};
    const pw = W - PAD.left - PAD.right;
    const ph = H - PAD.top - PAD.bottom;

    ctx.clearRect(0, 0, W, H);

    const prices = data.map(d => d.AvgPrice);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const range = maxP - minP || 1;

    const x = (i) => PAD.left + (i / (data.length - 1 || 1)) * pw;
    const y = (v) => PAD.top + ph - ((v - minP) / range) * ph;

    // grid lines
    ctx.strokeStyle = 'rgba(94,75,55,0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yy = PAD.top + (ph / 4) * i;
      ctx.beginPath();
      ctx.moveTo(PAD.left, yy);
      ctx.lineTo(PAD.left + pw, yy);
      ctx.stroke();
      const val = maxP - (range / 4) * i;
      ctx.fillStyle = '#a6937c';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val >= 1e6 ? (val / 1e6).toFixed(1) + 'M' : val >= 1e3 ? (val / 1e3).toFixed(0) + 'K' : val, PAD.left - 6, yy + 4);
    }

    // line
    ctx.beginPath();
    ctx.strokeStyle = '#f1d483';
    ctx.lineWidth = 2;
    data.forEach((d, i) => {
      i === 0 ? ctx.moveTo(x(i), y(d.AvgPrice)) : ctx.lineTo(x(i), y(d.AvgPrice));
    });
    ctx.stroke();

    // dots + labels
    data.forEach((d, i) => {
      ctx.beginPath();
      ctx.arc(x(i), y(d.AvgPrice), 3, 0, Math.PI * 2);
      ctx.fillStyle = '#f1d483';
      ctx.fill();
      // x-axis label (every nth to avoid clutter)
      if (data.length <= 12 || i % Math.ceil(data.length / 12) === 0) {
        ctx.fillStyle = '#a6937c';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        const label = d.regDate_.replace(/2\d{3}\//, '');
        ctx.fillText(label, x(i), H - PAD.bottom + 15);
      }
    });
  });
}

watch(historyDetailChart, (val) => {
  if (val.length) drawChart(val);
});

// ── 從查詢紀錄開成交資訊（直接用 DB 資料，不打 API）──────────
function openHistoryDetailFromRecord(record) {
  const stats = calcRecordStats(record);
  historyDetailItem.value = {
    itemName: record.itemName,
    itemID_e: record.itemID_e || '',
    MinPrice: stats.min,
    AvgPrice: stats.avg,
    MaxPrice: stats.max,
    SumitemCNT: record.totalCNT || stats.sum,
    _fromRecord: true,
  };
  historyDetailChart.value = record.chart || [];
  historyDetailRecords.value = record.items || [];
  historyDetailTotal.value = record.items?.length || 0;
  historyDetailPage.value = 1;
  detailSearchKeyword.value = '';
  showHistoryDetail.value = true;
}

// 覆蓋 totalPages（從 record 開時用 items 本身算，不依賴 API totalCount）
const historyDetailTotalPages_override = ref(null);

// 計算 record 的統計資料
function calcRecordStats(record) {
  const items = record.items || [];
  if (!items.length) return {min: 0, avg: 0, max: 0, sum: 0, dateRange: ''};
  const prices = items.map(i => i.itemPrice_a);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const sum = items.reduce((a, i) => a + (i.itemCNT || 0), 0);
  // 日期範圍：從 regDate_ 算
  const dates = [...new Set(items.map(i => i.regDate_).filter(Boolean))].sort();
  const dateRange = dates.length > 1
      ? `${dates[0].replace(/\d{4}\//, '')} ~ ${dates[dates.length - 1].replace(/\d{4}\//, '')}（${dates.length} 天）`
      : dates.length === 1 ? `${dates[0].replace(/\d{4}\//, '')}（1 天）` : '';
  return {min, avg, max, sum, dateRange};
}

// ── 成交資訊 Modal 內搜尋（前端 filter，不重打 API）──────────────
const detailSearchKeyword = ref('');

const filteredDetailRecords = computed(() => {
  const kw = detailSearchKeyword.value.trim().toLowerCase();
  const all = historyDetailRecords.value;
  const isFromRecord = historyDetailItem.value?._fromRecord;

  const filtered = kw
      ? all.filter(rec => {
        const slots = [rec.slot_1, rec.slot_2, rec.slot_3, rec.slot_4].filter(Boolean).join(' ');
        const opts = [rec.RandomOpt1, rec.RandomOpt2, rec.RandomOpt3, rec.RandomOpt4, rec.RandomOpt5].filter(Boolean).join(' ');
        const map = rec.mapName ? rec.mapName.replace('.gat', '') : '';
        const refine = rec.itemRefining > 0 ? `+${rec.itemRefining}` : '';
        return [slots, opts, map, refine, rec.itemName || ''].join(' ').toLowerCase().includes(kw);
      })
      : all;

  if (isFromRecord) {
    // 前端排序
    const by = historyDetailSortBy.value;
    const desc = historyDetailSortDesc.value === 'desc';
    const sorted = [...filtered].sort((a, b) => {
      const av = Number(a[by]) || 0;
      const bv = Number(b[by]) || 0;
      return desc ? bv - av : av - bv;
    });
    // 前端分頁
    const ps = historyDetailPageSize;
    const page = historyDetailPage.value;
    historyDetailTotal.value = sorted.length;
    return sorted.slice((page - 1) * ps, page * ps);
  }
  return filtered;
});

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

// ── 價格警報 ─────────────────────────────────────────────────────
const ALERT_BASE = () => commonStore.data.roz_url + '/alert';

const alertRules = ref([]);
const alertLoading = ref(false);
const alertError = ref('');
const alertForm = reactive({
  keyword: '',
  server: '529',
  storeType: '0',
  priceMin: '',
  priceMax: '',
  webhookUrl: '',
});
const alertSubmitting = ref(false);

async function fetchAlertRules() {
  if (!loggedIn.value) return;
  alertLoading.value = true;
  try {
    const res = await authFetch(`${ALERT_BASE()}/rules`);
    const data = await res.json();
    alertRules.value = Array.isArray(data) ? data : [];
  } catch (e) {
    if (e.message !== 'SESSION_EXPIRED') alertError.value = '載入失敗：' + e.message;
  } finally {
    alertLoading.value = false;
  }
}

async function addAlertRule() {
  if (!alertForm.keyword.trim()) { alertError.value = '請輸入關鍵字'; return; }
  if (!alertForm.webhookUrl.trim()) { alertError.value = '請輸入 Webhook URL'; return; }
  alertError.value = '';
  alertSubmitting.value = true;
  try {
    const res = await authFetch(`${ALERT_BASE()}/rules`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        keyword: alertForm.keyword.trim(),
        server: alertForm.server,
        storeType: alertForm.storeType,
        priceMin: alertForm.priceMin !== '' ? Number(alertForm.priceMin) : null,
        priceMax: alertForm.priceMax !== '' ? Number(alertForm.priceMax) : null,
        webhookUrl: alertForm.webhookUrl.trim(),
      }),
    });
    const data = await res.json();
    if (data.error) { alertError.value = data.error; return; }
    alertRules.value.unshift(data);
    alertForm.keyword = '';
    alertForm.priceMin = '';
    alertForm.priceMax = '';
    alertForm.webhookUrl = '';
  } catch (e) {
    if (e.message !== 'SESSION_EXPIRED') alertError.value = '新增失敗：' + e.message;
  } finally {
    alertSubmitting.value = false;
  }
}

async function toggleAlertRule(rule) {
  try {
    const res = await authFetch(`${ALERT_BASE()}/rules/${rule.id}/toggle`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({enabled: rule.enabled === 1 ? false : true}),
    });
    const data = await res.json();
    if (data.success) rule.enabled = rule.enabled === 1 ? 0 : 1;
  } catch (e) {
    if (e.message !== 'SESSION_EXPIRED') alertError.value = '操作失敗：' + e.message;
  }
}

async function deleteAlertRule(id) {
  if (!confirm('確定刪除此警報規則？')) return;
  try {
    const res = await authFetch(`${ALERT_BASE()}/rules/${id}`, {method: 'DELETE'});
    const data = await res.json();
    if (data.success) alertRules.value = alertRules.value.filter(r => r.id !== id);
  } catch (e) {
    if (e.message !== 'SESSION_EXPIRED') alertError.value = '刪除失敗：' + e.message;
  }
}

async function runAlertNow() {
  try {
    const res = await authFetch(`${ALERT_BASE()}/run-now`, {method: 'POST'});
    const data = await res.json();
    alert(`執行完成：共檢查 ${data.checked} 條，觸發 ${data.triggered} 條`);
  } catch (e) {
    if (e.message !== 'SESSION_EXPIRED') alertError.value = '執行失敗：' + e.message;
  }
}

function formatAlertDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
</script>

<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-6 font-sans pb-16">

    <!-- Header -->
    <div
        class="max-w-[1400px] mx-auto mb-6 border-b border-[#5e4b37] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
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
          <button @click="switchTab('searchHistory')"
                  class="px-3 py-1.5 text-sm font-bold rounded-md transition"
                  :class="activeTab === 'searchHistory' ? 'bg-[#5e4b37] text-[#f1d483]' : 'text-[#a6937c] hover:text-[#e0d3b8]'">
            🕘 查詢紀錄
          </button>
          <button @click="switchTab('alert')"
                  class="px-3 py-1.5 text-sm font-bold rounded-md transition"
                  :class="activeTab === 'alert' ? 'bg-[#5e4b37] text-[#f1d483]' : 'text-[#a6937c] hover:text-[#e0d3b8]'">
            🔔 價格警報
            <span v-if="alertRules.filter(r=>r.enabled===1).length > 0" class="ml-1 text-[10px] text-[#a6937c]">{{ alertRules.filter(r=>r.enabled===1).length }}</span>
          </button>
        </div>
        <button v-if="!loggedIn" @click="showLogin = true"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition bg-[#4a1a1a] text-[#f0a8a8] border border-[#f0a8a8]/30 hover:bg-[#5a2020] animate-pulse">
          🔑 尚未登入
        </button>
        <div v-else class="flex items-center gap-2">
          <span
              class="text-xs text-[#a8f0c8] bg-[#2a4a3a] border border-[#a8f0c8]/30 px-3 py-1.5 rounded-lg">✅ 已登入</span>
          <button @click="doLogout"
                  class="px-3 py-1.5 rounded-lg text-sm bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] transition">
            登出
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto">

      <!-- 搜尋列（查詢紀錄 tab 時隱藏） -->
      <div v-show="activeTab !== 'searchHistory' && activeTab !== 'alert'" class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-4 mb-4">

        <!-- 第一行：關鍵字 + 基本條件 + 查詢 -->
        <div class="flex flex-wrap gap-3 items-end">
          <div class="flex-1 min-w-48">
            <label class="text-xs text-[#a6937c] mb-1 block">關鍵字</label>
            <input v-model="keyword" @keyup.enter="doSearch(1)" type="text" placeholder="輸入道具名稱..."
                   class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
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
                     class="w-28 bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
            </div>
            <span class="text-[#5e4b37] pb-2 select-none">～</span>
            <div>
              <label class="text-xs text-[#a6937c] mb-1 block">最高價格</label>
              <input v-model="priceMax" type="number" min="0" placeholder="不限"
                     class="w-28 bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
            </div>
            <button @click="togglePriceUnit"
                    class="pb-2 px-2.5 py-1.5 rounded text-xs font-bold border transition mb-[1px]"
                    :class="priceUnit === 10000
                      ? 'bg-[#4a3a28] border-[#f1d483] text-[#f1d483]'
                      : 'bg-[#2c1e14] border-[#5e4b37] text-[#a6937c] hover:border-[#f1d483] hover:text-[#f1d483]'">
              {{ priceUnitLabel }}
            </button>
            <button v-if="priceMinZ !== null || priceMaxZ !== null" @click="priceMin = ''; priceMax = ''"
                    class="pb-2 text-xs text-[#a6937c] hover:text-[#f0a8a8] transition mb-[1px]">
              ✕ 清除
            </button>
          </div>
        </div>

        <!-- 第三行：附加能力過濾（商店 tab 才顯示） -->
        <div v-if="activeTab === 'shop'" class="mt-3 pt-3 border-t border-[#5e4b37]/50">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs text-[#a6937c] font-bold">附加能力過濾</span>
            <button @click="addOptFilter"
                    class="text-xs px-2.5 py-1 rounded bg-[#2c1e14] border border-[#5e4b37] text-[#a6937c] hover:border-[#f1d483] hover:text-[#f1d483] transition">
              + 新增條件
            </button>
            <button v-if="optFilters.length > 0" @click="clearOptFilters"
                    class="text-xs text-[#a6937c] hover:text-[#f0a8a8] transition">
              全部清除
            </button>
            <span class="text-[10px] text-[#5e4b37] ml-1">（過濾已載入的本頁結果）</span>
          </div>
          <div v-if="optFilters.length === 0" class="text-xs text-[#5e4b37] italic">
            尚未設定條件，點「新增條件」來篩選附加能力
          </div>
          <div class="space-y-2">
            <div v-for="(cond, idx) in optFilters" :key="idx"
                 class="flex flex-wrap items-center gap-2">
              <!-- 關鍵字輸入 -->
              <input v-model="cond.keyword" type="text" placeholder="能力關鍵字，如：對植物"
                     class="flex-1 min-w-36 bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-1.5 text-xs text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#a8d4f0] transition"/>
              <!-- 運算符 -->
              <select v-model="cond.operator"
                      class="bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-xs text-[#e0d3b8] outline-none focus:border-[#a8d4f0] cursor-pointer transition">
                <option value=">">＞ 大於</option>
                <option value=">=">≥ 大於等於</option>
                <option value="<">＜ 小於</option>
                <option value="<=">≤ 小於等於</option>
                <option value="=">＝ 等於</option>
              </select>
              <!-- 數值輸入 -->
              <input v-model="cond.value" type="number" placeholder="數值（空白=只要有）"
                     class="w-36 bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-1.5 text-xs text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#a8d4f0] transition"/>
              <!-- 刪除 -->
              <button @click="removeOptFilter(idx)"
                      class="w-6 h-6 rounded-full bg-[#3d2b1f] text-[#6b5a4a] hover:bg-[#5a2020] hover:text-[#f0a8a8] border border-[#5e4b37] transition flex items-center justify-center text-xs font-bold shrink-0">
                ✕
              </button>
              <!-- 預覽提示 -->
              <span v-if="cond.keyword.trim()" class="text-[10px] text-[#5e8ab0] italic">
                含「{{ cond.keyword.trim() }}」
                <template v-if="cond.value !== ''">{{ cond.operator }} {{ cond.value }}</template>
              </span>
            </div>
          </div>
        </div>

        <p v-if="errorMsg"
           class="mt-3 text-sm text-[#f0a8a8] bg-[#4a1a1a] border border-[#f0a8a8]/20 rounded px-3 py-2">⚠️ {{
            errorMsg
          }}</p>

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
          <div v-if="shopTotalCount > 0" class="text-sm text-[#a6937c] mb-3 flex items-center gap-2 flex-wrap">
            <span>共 <span class="text-[#f1d483] font-bold">{{ shopTotalCount }}</span> 筆</span>
            <span v-if="shopTotalPages > 1">（第 {{ shopCurrentPage }} / {{ shopTotalPages }} 頁）</span>
            <span v-if="isFiltered" class="text-[#f1d483]">
              · 過濾後 <span class="font-bold">{{ filteredCount }}</span> 筆
            </span>
          </div>

          <div v-if="shopResults.length > 0">

            <!-- ── 顯示模式切換 ── -->
            <div class="flex items-center justify-end gap-1.5 mb-3">
              <button @click="shopViewMode = 'table'"
                      :class="shopViewMode === 'table'
                        ? 'bg-[#5e4b37] text-[#f1d483] border-[#f1d483]/40'
                        : 'bg-[#2c1e14] text-[#6b5a4a] border-[#5e4b37] hover:text-[#a6937c]'"
                      class="px-2.5 py-1.5 rounded border text-xs font-bold transition flex items-center gap-1">
                ☰ 表格
              </button>
              <button @click="shopViewMode = 'card'"
                      :class="shopViewMode === 'card'
                        ? 'bg-[#5e4b37] text-[#f1d483] border-[#f1d483]/40'
                        : 'bg-[#2c1e14] text-[#6b5a4a] border-[#5e4b37] hover:text-[#a6937c]'"
                      class="px-2.5 py-1.5 rounded border text-xs font-bold transition flex items-center gap-1">
                ⊞ 卡片
              </button>
            </div>

            <!-- ── 表格模式 ── -->
            <div v-if="shopViewMode === 'table'" class="overflow-x-auto rounded-xl border border-[#5e4b37]">
              <table class="w-full text-sm">
                <thead>
                <tr class="bg-[#3d2b1f] text-[#f1d483] text-left">
                  <th class="px-4 py-3 font-bold">商店名稱</th>
                  <th class="px-4 py-3 font-bold">道具名稱</th>
                  <th class="px-4 py-3 font-bold text-center">Slot</th>
                  <th class="px-4 py-3 font-bold">卡片</th>
                  <th class="px-4 py-3 font-bold">附加能力</th>
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
                    <button v-if="isProntera(item.mapName)" @click="openMapModal(item)"
                            class="ml-2 text-[10px] text-[#a6937c] hover:text-[#f1d483] transition align-middle">
                      📍{{ item.xPos }}/{{ item.yPos }}
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
                  <td class="px-4 py-2.5 text-xs">
                    <template v-if="randomOptDisplay(item).length > 0">
                      <div v-for="(opt, oi) in randomOptDisplay(item)" :key="oi"
                           class="text-[#a8d4f0] leading-snug">{{ opt }}</div>
                    </template>
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

            <!-- ── 卡片模式 ── -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <div v-for="(item, i) in shopResults" :key="i"
                   class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-3 flex flex-col gap-2 hover:border-[#f1d483]/40 transition">
                <!-- 頂部：道具名稱 + 類型 badge -->
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p class="font-bold text-[#e0d3b8] text-sm leading-snug">
                      {{ itemDisplayName(item) }}
                    </p>
                    <span v-if="item.ItemGradeLevel > 0" class="text-[#f1d483] text-xs">★{{ item.ItemGradeLevel }}</span>
                  </div>
                  <span class="text-xs px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                        :class="item.storetype === 0 ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#2a3a4a] text-[#a8c0f0]'">
                    {{ storeTypeLabel(item.storetype) }}
                  </span>
                </div>

                <!-- 商店名稱 + 地圖 -->
                <div class="flex items-center gap-1.5 flex-wrap">
                  <button @click="openDetail(item)" class="text-xs text-[#f1d483] hover:underline font-bold">
                    {{ item.storeName }}
                  </button>
                  <button v-if="isProntera(item.mapName)" @click="openMapModal(item)"
                          class="text-[10px] text-[#a6937c] hover:text-[#f1d483] transition">
                    📍{{ item.xPos }}/{{ item.yPos }}
                  </button>
                </div>

                <!-- 分隔線 -->
                <div class="border-t border-[#5e4b37]"></div>

                <!-- 屬性列 -->
                <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  <div class="text-[#6b5a4a]">Slot</div>
                  <div class="text-[#a6937c]">{{ item.DefaultSlotCount ?? '-' }}</div>
                  <div class="text-[#6b5a4a]">卡片</div>
                  <div class="text-[#e8c870]">
                    <span v-if="slotDisplay(item) !== '-'">{{ slotDisplay(item) }}</span>
                    <span v-else class="text-[#5e4b37]">-</span>
                  </div>
                </div>

                <!-- 附加能力 -->
                <div v-if="randomOptDisplay(item).length > 0"
                     class="bg-[#2c1e14] rounded-lg px-2.5 py-2 space-y-0.5">
                  <div v-for="(opt, oi) in randomOptDisplay(item)" :key="oi"
                       class="text-[#a8d4f0] text-xs leading-snug">
                    · {{ opt }}
                  </div>
                </div>

                <!-- 底部：價格 + 數量 -->
                <div class="flex items-end justify-between mt-auto pt-1">
                  <span class="text-[#f1d483] font-bold text-base">{{ formatPrice(item.itemPrice) }} z</span>
                  <span class="text-[#6b5a4a] text-xs">× {{ item.itemCNT }}</span>
                </div>
              </div>
            </div>

            <!-- 分頁 -->
            <div v-if="shopTotalPages > 1" class="flex justify-center items-center gap-2 mt-4 flex-wrap">
              <button @click="doSearch(shopCurrentPage - 1)" :disabled="shopCurrentPage <= 1"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
                ← 上一頁
              </button>
              <span class="px-2 py-1.5 text-sm text-[#f1d483]">{{ shopCurrentPage }} / {{ shopTotalPages }}</span>
              <button @click="doSearch(shopCurrentPage + 1)" :disabled="shopCurrentPage >= shopTotalPages"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
                下一頁 →
              </button>
              <!-- 跳頁 -->
              <div class="flex items-center gap-1.5 ml-2">
                <input v-model="shopPageInput" type="number" min="1" :max="shopTotalPages" placeholder="頁碼"
                       @keyup.enter="jumpPage('shop', shopTotalPages)"
                       class="w-16 bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-sm text-[#e0d3b8] text-center outline-none focus:border-[#f1d483] transition"/>
                <button @click="jumpPage('shop', shopTotalPages)"
                        class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] transition text-sm">
                  跳至
                </button>
              </div>
            </div>
          </div>

          <!-- 過濾後無結果 -->
          <div v-else-if="shopResultsRaw.length > 0 && isFiltered"
               class="text-center py-12 text-[#6b5a4a]">
            <div class="text-3xl mb-2">🔍</div>
            <p class="text-sm">目前過濾條件內無結果</p>
            <div class="flex justify-center gap-3 mt-3 flex-wrap">
              <button v-if="priceMinZ !== null || priceMaxZ !== null" @click="priceMin = ''; priceMax = ''"
                      class="text-xs text-[#a6937c] hover:text-[#f1d483] underline transition">
                清除價格過濾
              </button>
              <button v-if="hasOptFilter" @click="clearOptFilters"
                      class="text-xs text-[#a6937c] hover:text-[#f1d483] underline transition">
                清除附加能力過濾
              </button>
            </div>
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
                  <th class="px-4 py-3 font-bold text-center">成交資訊</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in historyResults" :key="i"
                    class="border-t border-[#5e4b37] hover:bg-[#3d2b1f] transition">
                  <td class="px-4 py-2.5">
                    <button @click="openItemDetail(item.itemID_e)"
                            class="font-bold text-[#e0d3b8] hover:text-[#f1d483] transition text-left">
                      {{ item.itemName }}
                    </button>
                  </td>
                  <td class="px-4 py-2.5 text-right text-[#a8f0c8]">{{ formatPrice(item.MinPrice) }} z</td>
                  <td class="px-4 py-2.5 text-right text-[#f1d483] font-bold">{{ formatPrice(item.AvgPrice) }} z</td>
                  <td class="px-4 py-2.5 text-right text-[#f0a8a8]">{{ formatPrice(item.MaxPrice) }} z</td>
                  <td class="px-4 py-2.5 text-right text-[#a6937c]">{{ item.SumitemCNT }}</td>
                  <td class="px-4 py-2.5 text-center">
                    <button @click="openHistoryDetail(item)"
                            class="px-2.5 py-1 rounded text-xs border border-[#5e4b37] bg-[#2c1e14] text-[#a6937c] hover:border-[#f1d483] hover:text-[#f1d483] transition">
                      📊
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- 窄螢幕：卡片 -->
            <div class="md:hidden space-y-2">
              <div v-for="(item, i) in historyResults" :key="i"
                   class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-3">
                <div class="flex items-start justify-between gap-2 mb-2">
                  <button @click="openItemDetail(item.itemID_e)"
                          class="font-bold text-[#e0d3b8] text-sm hover:text-[#f1d483] transition text-left">
                    {{ item.itemName }}
                  </button>
                  <button @click="openHistoryDetail(item)"
                          class="shrink-0 px-2.5 py-1 rounded text-xs border border-[#5e4b37] bg-[#2c1e14] text-[#a6937c] hover:border-[#f1d483] hover:text-[#f1d483] transition">
                    📊
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-y-1 text-xs">
                  <span class="text-[#a6937c]">最低成交</span><span
                    class="text-[#a8f0c8] text-right font-bold">{{ formatPrice(item.MinPrice) }} z</span>
                  <span class="text-[#a6937c]">平均成交</span><span
                    class="text-[#f1d483] text-right font-bold">{{ formatPrice(item.AvgPrice) }} z</span>
                  <span class="text-[#a6937c]">最高成交</span><span
                    class="text-[#f0a8a8] text-right font-bold">{{ formatPrice(item.MaxPrice) }} z</span>
                  <span class="text-[#a6937c]">成交數量</span><span class="text-[#a6937c] text-right">{{
                    item.SumitemCNT
                  }}</span>
                </div>
              </div>
            </div>

            <!-- 分頁 -->
            <div v-if="historyTotalPages > 1" class="flex justify-center items-center gap-2 mt-4 flex-wrap">
              <button @click="doSearch(historyCurrentPage - 1)" :disabled="historyCurrentPage <= 1"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
                ← 上一頁
              </button>
              <span class="px-2 py-1.5 text-sm text-[#f1d483]">{{ historyCurrentPage }} / {{ historyTotalPages }}</span>
              <button @click="doSearch(historyCurrentPage + 1)" :disabled="historyCurrentPage >= historyTotalPages"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
                下一頁 →
              </button>
              <!-- 跳頁 -->
              <div class="flex items-center gap-1.5 ml-2">
                <input v-model="historyPageInput" type="number" min="1" :max="historyTotalPages" placeholder="頁碼"
                       @keyup.enter="jumpPage('history', historyTotalPages)"
                       class="w-16 bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-sm text-[#e0d3b8] text-center outline-none focus:border-[#f1d483] transition"/>
                <button @click="jumpPage('history', historyTotalPages)"
                        class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] transition text-sm">
                  跳至
                </button>
              </div>
            </div>
          </div>

          <!-- 尚未查詢 -->
          <div v-else-if="historyResults.length === 0 && !loading"
               class="text-center py-16 text-[#6b5a4a]">
            <div class="text-4xl mb-3">👻</div>
            <p>{{ keyword ? '查無資料' : '輸入關鍵字開始查詢' }}</p>
          </div>
        </div>

        <!-- ══ 查詢紀錄 tab ══ -->
        <div v-show="activeTab === 'searchHistory'">
          <div class="flex flex-col gap-2 mb-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="text-sm text-[#a6937c]">
                共 <span class="text-[#f1d483] font-bold">{{ filteredSearchHistory.length }}</span> 筆查詢紀錄
                <span v-if="searchHistoryTotalPages > 1">（第 {{ searchHistoryPage }} / {{
                    searchHistoryTotalPages
                  }} 頁）</span>
              </div>
              <button @click="fetchSearchHistory(searchHistoryPage)"
                      class="text-xs px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] transition">
                🔄 重新載入
              </button>
            </div>
            <div class="relative">
              <input v-model="searchHistoryKeyword" type="text" placeholder="搜尋道具名稱..."
                     class="w-full bg-[#1e140c] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] focus:outline-none focus:border-[#f1d483] transition pr-8"/>
              <button v-if="searchHistoryKeyword" @click="searchHistoryKeyword = ''"
                      class="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b5a4a] hover:text-[#a6937c] text-xs">✕
              </button>
            </div>
          </div>

          <div v-if="searchHistoryLoading" class="text-center py-20 text-[#a6937c] italic">載入中...</div>

          <div v-else-if="searchHistoryRecords.length > 0">
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
                  <th class="px-4 py-3 font-bold text-center">資料範圍</th>
                  <th class="px-4 py-3 font-bold text-center">成交資訊</th>
                </tr>
                </thead>
                <tbody>
                <template v-for="record in filteredSearchHistory" :key="record.id">
                  <tr class="border-t border-[#5e4b37] hover:bg-[#3d2b1f] transition">
                    <td class="px-4 py-2.5">
                      <button @click="record.itemID_e && openItemDetail(record.itemID_e)"
                              :class="record.itemID_e ? 'hover:text-[#e8c870] cursor-pointer' : 'cursor-default'"
                              class="font-bold text-[#f1d483] transition text-left">
                        {{ record.itemName }}
                      </button>
                      <div class="text-[10px] text-[#6b5a4a] mt-0.5">{{ serverLabel(record.server) }} · {{
                          record.days
                        }}天
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-right text-[#a8f0c8]">{{ formatPrice(calcRecordStats(record).min) }} z
                    </td>
                    <td class="px-4 py-2.5 text-right text-[#f1d483] font-bold">
                      {{ formatPrice(calcRecordStats(record).avg) }} z
                    </td>
                    <td class="px-4 py-2.5 text-right text-[#f0a8a8]">{{ formatPrice(calcRecordStats(record).max) }} z
                    </td>
                    <td class="px-4 py-2.5 text-right text-[#a6937c]">{{
                        record.totalCNT || calcRecordStats(record).sum
                      }}
                    </td>
                    <td class="px-4 py-2.5 text-center text-[#a6937c] text-xs">{{
                        calcRecordStats(record).dateRange
                      }}
                    </td>
                    <td class="px-4 py-2.5 text-center">
                      <button @click="openHistoryDetailFromRecord(record)"
                              class="px-2.5 py-1 rounded text-xs border border-[#5e4b37] bg-[#2c1e14] text-[#a6937c] hover:border-[#f1d483] hover:text-[#f1d483] transition">
                        📊
                      </button>
                    </td>
                  </tr>
                  <!-- 展開的物品列表 -->
                  <tr v-if="expandedHistoryId === record.id" class="border-t border-[#5e4b37]/40">
                    <td colspan="7" class="px-4 py-3 bg-[#251810]">
                      <!-- 搜尋 + 統計 -->
                      <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <p class="text-[11px] text-[#a6937c]">
                          共 <span class="text-[#f1d483] font-bold">{{ getExpandedItems(record).total }}</span> 筆
                          <span v-if="getExpandedItems(record).totalPages > 1">
                            （第 {{ getExpandedItems(record).page }} / {{ getExpandedItems(record).totalPages }} 頁）
                          </span>
                        </p>
                        <div class="flex items-center gap-1.5">
                          <input :value="expandedItemsSearch[record.id] || ''"
                                 @input="setExpandedSearch(record.id, $event.target.value)"
                                 type="text" placeholder="搜尋精煉/卡片/附加..."
                                 class="w-48 bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1 text-xs text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
                          <button v-if="expandedItemsSearch[record.id]"
                                  @click="setExpandedSearch(record.id, '')"
                                  class="text-xs text-[#a6937c] hover:text-[#f0a8a8] transition px-1">✕
                          </button>
                        </div>
                      </div>
                      <table class="w-full text-xs">
                        <thead>
                        <tr class="text-[#a6937c]">
                          <th class="text-right pb-2 font-semibold">成交單價</th>
                          <th class="text-right pb-2 font-semibold">數量</th>
                          <th class="text-left pb-2 font-semibold">日期</th>
                          <th class="text-left pb-2 font-semibold">精煉</th>
                          <th class="text-left pb-2 font-semibold">卡片/附加</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, j) in getExpandedItems(record).items" :key="j"
                            class="border-t border-[#5e4b37]/30 align-top">
                          <td class="py-1.5 text-right text-[#f1d483] font-bold whitespace-nowrap">
                            {{ formatPrice(item.itemPrice_a) }} z
                          </td>
                          <td class="py-1.5 text-right text-[#a6937c]">{{ item.itemCNT }}</td>
                          <td class="py-1.5 text-[#a6937c] whitespace-nowrap">{{ item.regDate_ }}</td>
                          <td class="py-1.5 text-[#a8f0c8]">{{
                              item.itemRefining > 0 ? '+' + item.itemRefining : '-'
                            }}
                          </td>
                          <td class="py-1.5">
                            <div class="text-[#e8c870] text-[11px]">{{
                                [item.slot_1, item.slot_2, item.slot_3, item.slot_4].filter(Boolean).join('・') || '-'
                              }}
                            </div>
                            <div
                                v-for="opt in [item.RandomOpt1,item.RandomOpt2,item.RandomOpt3,item.RandomOpt4,item.RandomOpt5].filter(Boolean)"
                                :key="opt" class="text-[#a8c8f0] text-[11px]">{{ opt }}
                            </div>
                          </td>
                        </tr>
                        <tr v-if="getExpandedItems(record).items.length === 0">
                          <td colspan="5" class="py-4 text-center text-[#6b5a4a]">搜尋無結果</td>
                        </tr>
                        </tbody>
                      </table>
                      <!-- items 分頁 -->
                      <div v-if="getExpandedItems(record).totalPages > 1"
                           class="flex justify-center items-center gap-2 mt-3 flex-wrap">
                        <button @click="setExpandedPage(record.id, getExpandedItems(record).page - 1)"
                                :disabled="getExpandedItems(record).page <= 1"
                                class="px-2.5 py-1 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-xs">
                          ← 上一頁
                        </button>
                        <span class="text-xs text-[#f1d483]">{{
                            getExpandedItems(record).page
                          }} / {{ getExpandedItems(record).totalPages }}</span>
                        <button @click="setExpandedPage(record.id, getExpandedItems(record).page + 1)"
                                :disabled="getExpandedItems(record).page >= getExpandedItems(record).totalPages"
                                class="px-2.5 py-1 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-xs">
                          下一頁 →
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
                </tbody>
              </table>
            </div>

            <!-- 窄螢幕：卡片 -->
            <div class="md:hidden space-y-2">
              <div v-for="record in filteredSearchHistory" :key="record.id"
                   class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl overflow-hidden">
                <div class="p-3">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <button @click="record.itemID_e && openItemDetail(record.itemID_e)"
                              :class="record.itemID_e ? 'hover:text-[#e8c870]' : ''"
                              class="font-bold text-[#f1d483] text-sm transition text-left">
                        {{ record.itemName }}
                      </button>
                      <p class="text-[10px] text-[#a6937c] mt-0.5">{{ serverLabel(record.server) }} · {{ record.days }}天
                        · {{ calcRecordStats(record).dateRange }}</p>
                    </div>
                    <button @click="openHistoryDetailFromRecord(record)"
                            class="shrink-0 px-2.5 py-1 rounded text-xs border border-[#5e4b37] bg-[#2c1e14] text-[#a6937c] hover:border-[#f1d483] hover:text-[#f1d483] transition">
                      📊
                    </button>
                  </div>
                  <div class="grid grid-cols-2 gap-y-1 text-xs">
                    <span class="text-[#a6937c]">最低成交</span><span class="text-[#a8f0c8] text-right font-bold">{{
                      formatPrice(calcRecordStats(record).min)
                    }} z</span>
                    <span class="text-[#a6937c]">平均成交</span><span class="text-[#f1d483] text-right font-bold">{{
                      formatPrice(calcRecordStats(record).avg)
                    }} z</span>
                    <span class="text-[#a6937c]">最高成交</span><span class="text-[#f0a8a8] text-right font-bold">{{
                      formatPrice(calcRecordStats(record).max)
                    }} z</span>
                    <span class="text-[#a6937c]">成交數量</span><span
                      class="text-[#a6937c] text-right">{{ record.totalCNT || calcRecordStats(record).sum }}</span>
                  </div>
                </div>
                <!-- 展開物品 -->
                <div v-if="expandedHistoryId === record.id" class="border-t border-[#5e4b37]/50 bg-[#251810] px-3 py-2">
                  <!-- 搜尋 + 統計 -->
                  <div class="flex items-center gap-1.5 mb-2">
                    <input :value="expandedItemsSearch[record.id] || ''"
                           @input="setExpandedSearch(record.id, $event.target.value)"
                           type="text" placeholder="搜尋精煉/卡片/附加..."
                           class="flex-1 bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1 text-xs text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
                    <button v-if="expandedItemsSearch[record.id]"
                            @click="setExpandedSearch(record.id, '')"
                            class="text-xs text-[#a6937c] hover:text-[#f0a8a8] transition">✕
                    </button>
                  </div>
                  <p class="text-[10px] text-[#a6937c] mb-2">
                    共 {{ getExpandedItems(record).total }} 筆
                    <span v-if="getExpandedItems(record).totalPages > 1">· 第 {{
                        getExpandedItems(record).page
                      }} / {{ getExpandedItems(record).totalPages }} 頁</span>
                  </p>
                  <div class="space-y-1.5">
                    <div v-for="(item, j) in getExpandedItems(record).items" :key="j"
                         class="text-xs border-b border-[#5e4b37]/20 pb-1.5 last:border-0 last:pb-0">
                      <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[#f1d483] font-bold">{{ formatPrice(item.itemPrice_a) }} z</span>
                        <span class="text-[#a6937c]">× {{ item.itemCNT }} · {{ item.regDate_ }}</span>
                      </div>
                      <div v-if="item.itemRefining > 0" class="text-[#a8f0c8]">精煉 +{{ item.itemRefining }}</div>
                      <div class="text-[#e8c870]">
                        {{ [item.slot_1, item.slot_2, item.slot_3, item.slot_4].filter(Boolean).join('・') }}
                      </div>
                      <div
                          v-for="opt in [item.RandomOpt1,item.RandomOpt2,item.RandomOpt3,item.RandomOpt4,item.RandomOpt5].filter(Boolean)"
                          :key="opt" class="text-[#a8c8f0]">{{ opt }}
                      </div>
                    </div>
                    <p v-if="getExpandedItems(record).items.length === 0" class="text-center text-[#6b5a4a] py-2">
                      搜尋無結果</p>
                  </div>
                  <!-- items 分頁 -->
                  <div v-if="getExpandedItems(record).totalPages > 1"
                       class="flex justify-center items-center gap-2 mt-3 flex-wrap">
                    <button @click="setExpandedPage(record.id, getExpandedItems(record).page - 1)"
                            :disabled="getExpandedItems(record).page <= 1"
                            class="px-2.5 py-1 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-xs">
                      ← 上一頁
                    </button>
                    <span class="text-xs text-[#f1d483]">{{
                        getExpandedItems(record).page
                      }} / {{ getExpandedItems(record).totalPages }}</span>
                    <button @click="setExpandedPage(record.id, getExpandedItems(record).page + 1)"
                            :disabled="getExpandedItems(record).page >= getExpandedItems(record).totalPages"
                            class="px-2.5 py-1 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-xs">
                      下一頁 →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分頁 -->
            <div v-if="searchHistoryTotalPages > 1" class="flex justify-center items-center gap-2 mt-4 flex-wrap">
              <button @click="fetchSearchHistory(searchHistoryPage - 1)" :disabled="searchHistoryPage <= 1"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
                ← 上一頁
              </button>
              <span class="px-2 py-1.5 text-sm text-[#f1d483]">{{ searchHistoryPage }} / {{
                  searchHistoryTotalPages
                }}</span>
              <button @click="fetchSearchHistory(searchHistoryPage + 1)"
                      :disabled="searchHistoryPage >= searchHistoryTotalPages"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
                下一頁 →
              </button>
              <!-- 跳頁 -->
              <div class="flex items-center gap-1.5 ml-2">
                <input v-model="srPageInput" type="number" min="1" :max="searchHistoryTotalPages" placeholder="頁碼"
                       @keyup.enter="jumpPage('searchHistory', searchHistoryTotalPages)"
                       class="w-16 bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-sm text-[#e0d3b8] text-center outline-none focus:border-[#f1d483] transition"/>
                <button @click="jumpPage('searchHistory', searchHistoryTotalPages)"
                        class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] transition text-sm">
                  跳至
                </button>
              </div>
            </div>
          </div>

          <!-- 空狀態 -->
          <div v-else class="text-center py-16 text-[#6b5a4a]">
            <div class="text-4xl mb-3">📭</div>
            <p>尚無查詢紀錄</p>
          </div>
        </div>

        <!-- ══ 價格警報 tab ══ -->
        <div v-show="activeTab === 'alert'">
          <!-- 未登入提示 -->
          <div v-if="!loggedIn" class="text-center py-16 text-[#6b5a4a]">
            <div class="text-4xl mb-3">🔑</div>
            <p>請先登入才能使用價格警報</p>
          </div>

          <div v-else>
            <!-- 新增規則表單 -->
            <div class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-4 mb-4">
              <h3 class="text-sm font-bold text-[#f1d483] mb-3">➕ 新增警報規則</h3>
              <div class="flex flex-wrap gap-3 items-end">
                <!-- 關鍵字 -->
                <div class="flex-1 min-w-40">
                  <label class="text-xs text-[#a6937c] mb-1 block">道具關鍵字</label>
                  <input v-model="alertForm.keyword" type="text" placeholder="輸入道具名稱..."
                         class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
                </div>
                <!-- 伺服器 -->
                <div>
                  <label class="text-xs text-[#a6937c] mb-1 block">伺服器</label>
                  <select v-model="alertForm.server"
                          class="bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] cursor-pointer transition">
                    <option value="529">西格倫</option>
                    <option value="629">艾克瑟</option>
                  </select>
                </div>
                <!-- 類型 -->
                <div>
                  <label class="text-xs text-[#a6937c] mb-1 block">類型</label>
                  <select v-model="alertForm.storeType"
                          class="bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] outline-none focus:border-[#f1d483] cursor-pointer transition">
                    <option value="0">全部</option>
                    <option value="1">收購</option>
                    <option value="2">販售</option>
                  </select>
                </div>
                <!-- 價格範圍 -->
                <div class="flex items-end gap-2">
                  <div>
                    <label class="text-xs text-[#a6937c] mb-1 block">最低價格（z）</label>
                    <input v-model="alertForm.priceMin" type="number" min="0" placeholder="不限"
                           class="w-28 bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
                  </div>
                  <span class="text-[#5e4b37] pb-2 select-none">～</span>
                  <div>
                    <label class="text-xs text-[#a6937c] mb-1 block">最高價格（z）</label>
                    <input v-model="alertForm.priceMax" type="number" min="0" placeholder="不限"
                           class="w-28 bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
                  </div>
                </div>
              </div>
              <!-- Webhook URL -->
              <div class="mt-3">
                <label class="text-xs text-[#a6937c] mb-1 block">Discord Webhook URL</label>
                <input v-model="alertForm.webhookUrl" type="text" placeholder="https://discord.com/api/webhooks/..."
                       class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
                <p class="text-[10px] text-[#6b5a4a] mt-1">Discord 頻道設定 → 整合 → Webhook → 複製 Webhook URL</p>
              </div>
              <p v-if="alertError" class="mt-2 text-sm text-[#f0a8a8] bg-[#4a1a1a] border border-[#f0a8a8]/20 rounded px-3 py-2">⚠️ {{ alertError }}</p>
              <div class="flex justify-end gap-2 mt-3">
                <button @click="runAlertNow"
                        class="px-4 py-2 rounded bg-[#2a3a2a] text-[#a8f0c8] border border-[#a8f0c8]/20 hover:bg-[#3a4a3a] transition text-sm">
                  ▶ 立即執行
                </button>
                <button @click="addAlertRule" :disabled="alertSubmitting"
                        class="px-4 py-2 rounded bg-[#5e4b37] text-[#f1d483] border border-[#f1d483]/20 font-bold hover:bg-[#7a6350] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm">
                  {{ alertSubmitting ? '新增中...' : '➕ 新增規則' }}
                </button>
              </div>
            </div>

            <!-- 規則清單 -->
            <div v-if="alertLoading" class="text-center py-12 text-[#a6937c] italic">載入中...</div>

            <div v-else-if="alertRules.length > 0">
              <!-- 寬螢幕：表格 -->
              <div class="hidden md:block overflow-x-auto rounded-xl border border-[#5e4b37]">
                <table class="w-full text-sm">
                  <thead>
                  <tr class="bg-[#3d2b1f] text-[#f1d483] text-left">
                    <th class="px-4 py-3 font-bold">關鍵字</th>
                    <th class="px-4 py-3 font-bold text-center">伺服器</th>
                    <th class="px-4 py-3 font-bold text-center">類型</th>
                    <th class="px-4 py-3 font-bold text-center">價格範圍</th>
                    <th class="px-4 py-3 font-bold text-center">狀態</th>
                    <th class="px-4 py-3 font-bold text-center">上次觸發</th>
                    <th class="px-4 py-3 font-bold text-center">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="rule in alertRules" :key="rule.id"
                      class="border-t border-[#5e4b37] hover:bg-[#3d2b1f] transition"
                      :class="rule.enabled === 0 ? 'opacity-50' : ''">
                    <td class="px-4 py-2.5 font-bold text-[#f1d483]">{{ rule.keyword }}</td>
                    <td class="px-4 py-2.5 text-center text-[#a6937c] text-xs">{{ rule.server === '529' ? '西格倫' : '艾克瑟' }}</td>
                    <td class="px-4 py-2.5 text-center">
                      <span class="text-xs px-2 py-0.5 rounded-full"
                            :class="rule.storeType === '1' ? 'bg-[#2a3a4a] text-[#a8c0f0]' : rule.storeType === '2' ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#3d2b1f] text-[#a6937c]'">
                        {{ rule.storeType === '1' ? '收購' : rule.storeType === '2' ? '販售' : '全部' }}
                      </span>
                    </td>
                    <td class="px-4 py-2.5 text-center text-xs text-[#e0d3b8]">
                      <span v-if="rule.priceMin !== null || rule.priceMax !== null">
                        {{ rule.priceMin !== null ? formatPrice(rule.priceMin) + ' z' : '不限' }}
                        ～
                        {{ rule.priceMax !== null ? formatPrice(rule.priceMax) + ' z' : '不限' }}
                      </span>
                      <span v-else class="text-[#6b5a4a]">不限</span>
                    </td>
                    <td class="px-4 py-2.5 text-center">
                      <button @click="toggleAlertRule(rule)"
                              class="text-xs px-2.5 py-0.5 rounded-full border transition"
                              :class="rule.enabled === 1 ? 'bg-[#2a4a3a] border-[#a8f0c8]/30 text-[#a8f0c8] hover:bg-[#1a3a2a]' : 'bg-[#3d2b1f] border-[#5e4b37] text-[#6b5a4a] hover:border-[#f1d483] hover:text-[#f1d483]'">
                        {{ rule.enabled === 1 ? '✅ 啟用中' : '⏸ 已停用' }}
                      </button>
                    </td>
                    <td class="px-4 py-2.5 text-center text-xs text-[#a6937c]">{{ formatAlertDate(rule.lastTriggeredAt) }}</td>
                    <td class="px-4 py-2.5 text-center">
                      <button @click="deleteAlertRule(rule.id)"
                              class="text-xs px-2.5 py-1 rounded border border-[#5e4b37] text-[#a6937c] hover:border-[#f0a8a8] hover:text-[#f0a8a8] transition">
                        🗑 刪除
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <!-- 窄螢幕：卡片 -->
              <div class="md:hidden space-y-2">
                <div v-for="rule in alertRules" :key="rule.id"
                     class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-3"
                     :class="rule.enabled === 0 ? 'opacity-50' : ''">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p class="font-bold text-[#f1d483]">{{ rule.keyword }}</p>
                      <p class="text-[10px] text-[#a6937c] mt-0.5">
                        {{ rule.server === '529' ? '西格倫' : '艾克瑟' }} ·
                        {{ rule.storeType === '1' ? '收購' : rule.storeType === '2' ? '販售' : '全部' }}
                      </p>
                    </div>
                    <div class="flex gap-1.5">
                      <button @click="toggleAlertRule(rule)"
                              class="text-xs px-2 py-1 rounded border transition"
                              :class="rule.enabled === 1 ? 'border-[#a8f0c8]/30 text-[#a8f0c8]' : 'border-[#5e4b37] text-[#6b5a4a]'">
                        {{ rule.enabled === 1 ? '✅' : '⏸' }}
                      </button>
                      <button @click="deleteAlertRule(rule.id)"
                              class="text-xs px-2 py-1 rounded border border-[#5e4b37] text-[#a6937c] hover:text-[#f0a8a8]">
                        🗑
                      </button>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-y-1 text-xs">
                    <span class="text-[#a6937c]">價格範圍</span>
                    <span class="text-right text-[#e0d3b8]">
                      <template v-if="rule.priceMin !== null || rule.priceMax !== null">
                        {{ rule.priceMin !== null ? formatPrice(rule.priceMin) : '不限' }} ～ {{ rule.priceMax !== null ? formatPrice(rule.priceMax) : '不限' }} z
                      </template>
                      <template v-else><span class="text-[#6b5a4a]">不限</span></template>
                    </span>
                    <span class="text-[#a6937c]">上次觸發</span>
                    <span class="text-right text-[#a6937c]">{{ formatAlertDate(rule.lastTriggeredAt) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-16 text-[#6b5a4a]">
              <div class="text-4xl mb-3">🔔</div>
              <p>尚無警報規則，新增一條開始監控</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ── 成交資訊 Modal ── -->
    <Transition name="modal">
      <div v-if="showHistoryDetail" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
           @click.self="showHistoryDetail = false">
        <div
            class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">

          <!-- Header -->
          <div class="px-6 pt-5 pb-3 border-b border-[#5e4b37] shrink-0">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-[#f1d483] font-black text-lg">📊 成交資訊</h2>
                <p v-if="historyDetailItem" class="text-[#a6937c] text-xs mt-0.5">
                  {{ historyDetailItem.itemName }}・{{ serverLabel(server) }}・{{ historyDays }} 天
                </p>
              </div>
              <div v-if="historyDetailItem" class="text-right text-xs text-[#a6937c] space-y-0.5">
                <div>最低 <span class="text-[#a8f0c8] font-bold">{{ formatPrice(historyDetailItem.MinPrice) }} z</span>
                </div>
                <div>平均 <span class="text-[#f1d483] font-bold">{{ formatPrice(historyDetailItem.AvgPrice) }} z</span>
                </div>
                <div>最高 <span class="text-[#f0a8a8] font-bold">{{ formatPrice(historyDetailItem.MaxPrice) }} z</span>
                </div>
              </div>
            </div>
          </div>

          <div class="overflow-y-auto flex-1 custom-scrollbar">
            <div v-if="historyDetailLoading" class="text-center py-16 text-[#a6937c] italic">載入中...</div>
            <div v-else>

              <!-- 折線圖 -->
              <div v-if="historyDetailChart.length > 0" class="px-6 pt-4 pb-2">
                <p class="text-xs text-[#a6937c] mb-2">平均成交價趨勢</p>
                <canvas id="hdChart" class="w-full" style="height:220px;"></canvas>
              </div>

              <!-- 明細 -->
              <div class="px-6 pt-3 pb-4">
                <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <p class="text-xs text-[#a6937c]">
                    共 <span class="text-[#f1d483] font-bold">{{ historyDetailTotal }}</span> 筆
                    <span v-if="historyDetailTotalPages > 1">（第 {{ historyDetailPage }} / {{ historyDetailTotalPages }} 頁）</span>
                    <span v-if="detailSearchKeyword" class="ml-1">
                      · 篩選後 <span class="text-[#f1d483] font-bold">{{ filteredDetailRecords.length }}</span> 筆
                    </span>
                  </p>
                  <!-- 搜尋欄 + 跳頁 -->
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <input v-model="detailSearchKeyword" type="text" placeholder="搜尋精煉/卡片/附加能力/地圖..."
                           class="w-56 bg-[#2c1e14] border border-[#5e4b37] rounded px-2.5 py-1.5 text-xs text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
                    <button v-if="detailSearchKeyword" @click="detailSearchKeyword = ''"
                            class="text-xs text-[#a6937c] hover:text-[#f0a8a8] transition px-1">✕
                    </button>
                    <template v-if="historyDetailTotalPages > 1">
                      <div class="flex items-center gap-1 ml-1">
                        <button
                            @click="historyDetailItem?._fromRecord ? historyDetailPage-- : loadHistoryDetail(historyDetailPage - 1)"
                            :disabled="historyDetailPage <= 1"
                            class="px-2 py-1 rounded bg-[#2c1e14] text-[#a6937c] border border-[#5e4b37] hover:bg-[#3d2b1f] disabled:opacity-30 transition text-xs">
                          ←
                        </button>
                        <span class="text-xs text-[#f1d483] px-1">{{ historyDetailPage }}/{{
                            historyDetailTotalPages
                          }}</span>
                        <button
                            @click="historyDetailItem?._fromRecord ? historyDetailPage++ : loadHistoryDetail(historyDetailPage + 1)"
                            :disabled="historyDetailPage >= historyDetailTotalPages"
                            class="px-2 py-1 rounded bg-[#2c1e14] text-[#a6937c] border border-[#5e4b37] hover:bg-[#3d2b1f] disabled:opacity-30 transition text-xs">
                          →
                        </button>
                        <input v-model="historyDetailPageInput" type="number" min="1" :max="historyDetailTotalPages"
                               placeholder="頁"
                               @keyup.enter="jumpHistoryDetail(historyDetailTotalPages)"
                               class="w-12 bg-[#2c1e14] border border-[#5e4b37] rounded px-1.5 py-1 text-xs text-[#e0d3b8] text-center outline-none focus:border-[#f1d483] transition"/>
                        <button @click="jumpHistoryDetail(historyDetailTotalPages)"
                                class="px-2 py-1 rounded bg-[#2c1e14] text-[#a6937c] border border-[#5e4b37] hover:bg-[#3d2b1f] transition text-xs">
                          Go
                        </button>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- 寬螢幕 -->
                <div v-if="filteredDetailRecords.length > 0"
                     class="hidden md:block overflow-x-auto rounded-xl border border-[#5e4b37]">
                  <table class="w-full text-xs">
                    <thead>
                    <tr class="bg-[#3d2b1f] text-[#a6937c] text-left">
                      <th class="px-3 py-2.5 cursor-pointer hover:text-[#f1d483] transition select-none"
                          @click="historyDetailSort('itemPrice_a')">
                        成交單價 {{ sortIcon('itemPrice_a') }}
                      </th>
                      <th class="px-3 py-2.5 text-center cursor-pointer hover:text-[#f1d483] transition select-none"
                          @click="historyDetailSort('itemCNT')">
                        數量 {{ sortIcon('itemCNT') }}
                      </th>
                      <th class="px-3 py-2.5 cursor-pointer hover:text-[#f1d483] transition select-none"
                          @click="historyDetailSort('regDate_')">
                        成交日期 {{ sortIcon('regDate_') }}
                      </th>
                      <th class="px-3 py-2.5">資訊</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(rec, i) in filteredDetailRecords" :key="i"
                        class="border-t border-[#5e4b37] hover:bg-[#3d2b1f] transition align-top">
                      <td class="px-3 py-2.5 font-bold text-[#f1d483] whitespace-nowrap">{{
                          formatPrice(rec.itemPrice_a)
                        }} z
                      </td>
                      <td class="px-3 py-2.5 text-center text-[#a6937c]">{{ rec.itemCNT }}</td>
                      <td class="px-3 py-2.5 text-[#a6937c] whitespace-nowrap">{{ rec.regDate_ }}</td>
                      <td class="px-3 py-2.5">
                        <div class="space-y-0.5 text-[#e0d3b8]">
                          <div v-if="rec.itemRefining > 0" class="text-[#a8f0c8]">精煉 +{{ rec.itemRefining }}</div>
                          <div v-if="rec.ItemGradeLevel > 0" class="text-[#f1d483]">階級 ★{{ rec.ItemGradeLevel }}</div>
                          <div v-if="dealSlots(rec).length > 0" class="text-[#e8c870]">{{
                              dealSlots(rec).join('・')
                            }}
                          </div>
                          <div v-for="opt in dealOpts(rec)" :key="opt" class="text-[#a8c8f0] text-[11px]">{{
                              opt
                            }}
                          </div>
                          <div v-if="rec.mapName" class="text-[#6b5a4a] text-[11px]">{{
                              mapLabelShort(rec.mapName)
                            }}
                          </div>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 窄螢幕 -->
                <div v-if="filteredDetailRecords.length > 0" class="md:hidden space-y-2">
                  <div v-for="(rec, i) in filteredDetailRecords" :key="i"
                       class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl p-3">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="font-bold text-[#f1d483] text-sm">{{ formatPrice(rec.itemPrice_a) }} z</span>
                      <span class="text-xs text-[#a6937c]">× {{ rec.itemCNT }}・{{ rec.regDate_ }}</span>
                    </div>
                    <div class="text-xs space-y-0.5">
                      <div v-if="rec.itemRefining > 0" class="text-[#a8f0c8]">精煉 +{{ rec.itemRefining }}</div>
                      <div v-if="dealSlots(rec).length > 0" class="text-[#e8c870]">{{ dealSlots(rec).join('・') }}</div>
                      <div v-for="opt in dealOpts(rec)" :key="opt" class="text-[#a8c8f0]">{{ opt }}</div>
                      <div v-if="rec.mapName" class="text-[#6b5a4a]">{{ mapLabelShort(rec.mapName) }}</div>
                    </div>
                  </div>
                </div>

                <div v-else-if="!historyDetailLoading" class="text-center py-8 text-[#6b5a4a]">
                  {{ detailSearchKeyword ? '搜尋無結果' : '查無明細' }}
                </div>

                <!-- 分頁 -->
                <div v-if="historyDetailTotalPages > 1" class="flex justify-center items-center gap-2 mt-4 flex-wrap">
                  <button
                      @click="historyDetailItem?._fromRecord ? historyDetailPage-- : loadHistoryDetail(historyDetailPage - 1)"
                      :disabled="historyDetailPage <= 1"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-xs">
                    ← 上一頁
                  </button>
                  <span class="px-2 text-xs text-[#f1d483]">{{ historyDetailPage }} / {{
                      historyDetailTotalPages
                    }}</span>
                  <button
                      @click="historyDetailItem?._fromRecord ? historyDetailPage++ : loadHistoryDetail(historyDetailPage + 1)"
                      :disabled="historyDetailPage >= historyDetailTotalPages"
                      class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-xs">
                    下一頁 →
                  </button>
                  <div class="flex items-center gap-1.5 ml-2">
                    <input v-model="historyDetailPageInput" type="number" min="1" :max="historyDetailTotalPages"
                           placeholder="頁碼"
                           @keyup.enter="jumpHistoryDetail(historyDetailTotalPages)"
                           class="w-14 bg-[#2c1e14] border border-[#5e4b37] rounded px-2 py-1.5 text-xs text-[#e0d3b8] text-center outline-none focus:border-[#f1d483] transition"/>
                    <button @click="jumpHistoryDetail(historyDetailTotalPages)"
                            class="px-3 py-1.5 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] transition text-xs">
                      跳至
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 pb-5 pt-3 border-t border-[#5e4b37] shrink-0">
            <button @click="showHistoryDetail = false"
                    class="w-full py-2 bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] rounded transition text-sm font-bold">
              關閉
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 商店詳細 Modal ── -->
    <Transition name="modal">
      <div v-if="showDetail" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
           @click.self="showDetail = false">
        <div
            class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col">
          <div class="px-6 pt-5 pb-3 border-b border-[#5e4b37] shrink-0">
            <h2 class="text-[#f1d483] font-black text-lg mb-3">🏪 商店資訊</h2>
            <div class="flex gap-2">
              <button @click="detailTab = 'store'" class="px-3 py-1.5 rounded text-xs font-bold transition"
                      :class="detailTab === 'store' ? 'bg-[#5e4b37] text-[#f1d483]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">
                商店資訊
              </button>
              <button @click="detailTab = 'sell'" class="px-3 py-1.5 rounded text-xs font-bold transition"
                      :class="detailTab === 'sell' ? 'bg-[#5e4b37] text-[#f1d483]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">
                販售資訊
              </button>
              <button @click="detailTab = 'desc'" class="px-3 py-1.5 rounded text-xs font-bold transition"
                      :class="detailTab === 'desc' ? 'bg-[#5e4b37] text-[#f1d483]' : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">
                道具說明
              </button>
            </div>
          </div>
          <div class="overflow-y-auto px-6 py-4 flex-1 custom-scrollbar">
            <div v-if="detailLoading" class="text-center py-8 text-[#a6937c] italic">載入中...</div>
            <div v-else-if="detailData">
              <div v-if="detailTab === 'store'" class="text-sm">
                <!-- 有地圖時：寬螢幕左圖右資訊，窄螢幕垂直堆疊 -->
                <div :class="isProntera(detailData.mapName) ? 'sm:flex sm:gap-4 sm:items-start' : ''">
                  <!-- 地圖預覽（僅 Prontera）-->
                  <div v-if="isProntera(detailData.mapName)" class="sm:w-48 sm:shrink-0 mb-3 sm:mb-0">
                    <p class="text-[#a6937c] text-xs mb-2">地圖位置</p>
                    <div class="relative w-full overflow-hidden rounded-lg border border-[#5e4b37] cursor-pointer"
                         style="padding-top: 125%;"
                         @click="openMapModal(detailData)">
                      <img src="/images/map/prontera.jpg" alt="prontera"
                           class="absolute inset-0 w-full h-full object-cover"/>
                      <!-- marker -->
                      <div class="absolute w-0 h-0 -translate-x-1/2"
                           :style="{ left: markerLeft(detailData.xPos), top: markerTop(detailData.yPos) }">
                        <div class="w-4 h-4 -translate-x-1/2 -translate-y-full relative">
                          <div
                              class="w-4 h-4 bg-[#f1d483] border-2 border-[#2c1e14] rounded-full shadow-lg animate-pulse"></div>
                          <div class="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-2 bg-[#f1d483]"></div>
                        </div>
                      </div>
                      <!-- 放大提示 -->
                      <div
                          class="absolute bottom-1.5 right-1.5 text-[10px] bg-black/60 text-[#f1d483] px-1.5 py-0.5 rounded">
                        🔍 點擊放大
                      </div>
                    </div>
                  </div>
                  <!-- 資訊欄位 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span
                        class="text-[#a6937c]">商店名稱</span><span class="font-bold text-[#e0d3b8]">{{
                        detailData.storeName
                      }}</span></div>
                    <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span
                        class="text-[#a6937c]">角色名稱</span><span
                        class="font-bold text-[#e0d3b8]">{{ detailData.ItemSellerCharName }}</span></div>
                    <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                      <span class="text-[#a6937c]">道具名稱</span>
                      <span class="font-bold text-[#e0d3b8] text-right ml-2">{{ itemDisplayName(detailData) }}<span
                          v-if="detailData.ItemGradeLevel > 0" class="text-[#f1d483] ml-1">★{{
                          detailData.ItemGradeLevel
                        }}</span></span>
                    </div>
                    <div class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                      <span class="text-[#a6937c]">商店座標</span>
                      <button @click="copyCoord(detailData)"
                              class="font-bold text-[#f1d483] hover:text-[#e8c870] flex items-center gap-1.5 transition">
                        {{ mapLabel(detailData.mapName) }} {{ detailData.xPos }}/{{ detailData.yPos }}
                        <span class="text-xs text-[#a6937c]">{{ coordCopied ? '✓ 已複製' : '複製' }}</span>
                      </button>
                    </div>
                    <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span
                        class="text-[#a6937c]">單價</span><span
                        class="font-bold text-[#f1d483]">{{ formatPrice(detailData.itemPrice) }} z</span></div>
                    <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span
                        class="text-[#a6937c]">數量</span><span class="font-bold text-[#e0d3b8]">{{
                        detailData.itemCNT
                      }}</span></div>
                    <div class="flex justify-between py-2.5">
                      <span class="text-[#a6937c]">收購/販售</span>
                      <span class="text-xs px-2 py-0.5 rounded-full"
                            :class="detailData.storetype === 0 ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#2a3a4a] text-[#a8c0f0]'">{{
                          storeTypeLabel(detailData.storetype)
                        }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="detailTab === 'sell'" class="text-sm">
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span
                    class="text-[#a6937c]">精煉</span><span class="font-bold text-[#a8f0c8]">{{
                    detailData.itemRefining > 0 ? '+' + detailData.itemRefining : '-'
                  }}</span></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span
                    class="text-[#a6937c]">階級</span><span class="font-bold text-[#f1d483]">{{
                    detailData.ItemGradeLevel > 0 ? '★' + detailData.ItemGradeLevel : '-'
                  }}</span></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span
                    class="text-[#a6937c]">道具名稱</span><span class="font-bold text-[#e0d3b8]">{{
                    detailData.itemName
                  }}</span></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span
                    class="text-[#a6937c]">Slot 數</span><span class="font-bold text-[#e0d3b8]">{{
                    detailData.DefaultSlotCount || detailData.slotCount || '-'
                  }}</span></div>
                <div v-if="detailSlots.length > 0" class="flex justify-between py-2.5 border-b border-[#5e4b37]">
                  <span class="text-[#a6937c]">卡片/附魔</span>
                  <div class="text-right">
                    <div v-for="(s, i) in detailSlots" :key="i" class="text-[#e8c870] font-bold">{{ s }}</div>
                  </div>
                </div>
                <div v-else class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c]">卡片/附魔</span><span
                    class="text-[#6b5a4a]">-</span></div>
                <div v-if="randomOpts.length > 0" class="py-2.5 border-b border-[#5e4b37]">
                  <p class="text-[#a6937c] mb-2">附加能力</p>
                  <div v-for="(opt, i) in randomOpts" :key="i" class="text-[#a8f0c8] text-xs py-0.5">{{ opt }}</div>
                </div>
                <div v-else class="flex justify-between py-2.5"><span class="text-[#a6937c]">附加能力</span><span
                    class="text-[#6b5a4a]">-</span></div>
              </div>
              <div v-if="detailTab === 'desc'" class="text-sm">
                <div class="py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c] text-xs">道具名稱</span>
                  <p class="font-bold text-[#e0d3b8] mt-1">{{ detailData.itemName }}</p></div>
                <div class="flex justify-between py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c] text-xs">Slot</span><span
                    class="font-bold text-[#e0d3b8]">{{
                    detailData.DefaultSlotCount || detailData.slotCount || '-'
                  }}</span></div>
                <div class="py-2.5 border-b border-[#5e4b37]"><span class="text-[#a6937c] text-xs">敘述</span>
                  <pre class="mt-2 text-xs text-[#e0d3b8] whitespace-pre-wrap font-sans leading-relaxed">{{
                      parseDesc(detailData.identifiedDescription)
                    }}</pre>
                </div>
                <template v-if="detailData.slotDetails && detailData.slotDetails.length > 0">
                  <div v-for="(sd, i) in detailData.slotDetails" :key="i">
                    <div class="py-2.5 border-b border-[#5e4b37]"><span
                        class="text-[#a6937c] text-xs">卡片/附魔 {{ i + 1 }}</span>
                      <p class="font-bold text-[#e8c870] mt-1">{{ sd.name }}</p></div>
                    <div v-if="sd.desc" class="py-2.5 border-b border-[#5e4b37]"><span
                        class="text-[#a6937c] text-xs">敘述</span>
                      <pre class="mt-2 text-xs text-[#e0d3b8] whitespace-pre-wrap font-sans leading-relaxed">{{
                          parseDesc(sd.desc)
                        }}</pre>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div v-else class="text-center py-8 text-[#6b5a4a]">查無資料</div>
          </div>
          <div class="px-6 pb-5 pt-3 border-t border-[#5e4b37] shrink-0">
            <button @click="showDetail = false"
                    class="w-full py-2 bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] rounded transition text-sm font-bold">
              關閉
            </button>
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
              <li>任意字元：「<span class="text-[#e0d3b8]">%</span>」代表「任意個」任意字元（例：封印<span
                  class="text-[#e0d3b8]">%</span>卡片）
              </li>
              <li>單一字元：「<span class="text-[#e0d3b8]">_</span>」代表「一個」任意字元（例：愛子<span
                  class="text-[#e0d3b8]">____</span>卡片）
              </li>
              <li>精準查詢：「<span class="text-[#e0d3b8]">"</span>」使用在關鍵字前後時，可使用精準查詢，可排除其他可能的物品（例：<span
                  class="text-[#e0d3b8]">"鐵錘"</span>）
              </li>
            </ul>
          </li>
          <li>若資料數量過多時，本平台資料顯示將有些微延遲，請玩家耐心等候。</li>
          <li>各項道具名稱完整顯示方式與遊戲內將略有不同。</li>
          <li>各項道具設定以遊戲內設定為主。</li>
          <li>遊戲關機維護期間本平台將無法進行查詢功能。</li>
        </ol>
      </div>
    </div>

    <!-- ── 道具說明 Modal ── -->
    <Transition name="modal">
      <div v-if="showItemDetail" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
           @click.self="showItemDetail = false">
        <div
            class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col">
          <div class="px-6 pt-5 pb-3 border-b border-[#5e4b37] shrink-0">
            <h2 class="text-[#f1d483] font-black text-lg">📖 道具說明</h2>
          </div>
          <div class="overflow-y-auto flex-1 px-6 py-4 custom-scrollbar">
            <div v-if="itemDetailLoading" class="text-center py-8 text-[#a6937c] italic">載入中...</div>
            <div v-else-if="itemDetailData" class="text-sm space-y-3">
              <div v-if="itemDetailData.name" class="flex justify-between border-b border-[#5e4b37] pb-2">
                <span class="text-[#a6937c]">道具名稱</span>
                <span class="font-bold text-[#f1d483]">{{ itemDetailData.name }}</span>
              </div>
              <div v-if="itemDetailData.slotCount" class="flex justify-between border-b border-[#5e4b37] pb-2">
                <span class="text-[#a6937c]">Slot 數</span>
                <span class="font-bold text-[#e0d3b8]">{{ itemDetailData.slotCount }}</span>
              </div>
              <div>
                <p class="text-[#a6937c] text-xs mb-2">敘述</p>
                <pre class="text-xs text-[#e0d3b8] whitespace-pre-wrap font-sans leading-relaxed"
                     v-html="parseDesc(itemDetailData.desc)"></pre>
              </div>
            </div>
            <div v-else class="text-center py-8 text-[#6b5a4a]">查無資料</div>
          </div>
          <div class="px-6 pb-5 pt-3 border-t border-[#5e4b37] shrink-0">
            <button @click="showItemDetail = false"
                    class="w-full py-2 bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] rounded transition text-sm font-bold">
              關閉
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 地圖放大 Modal ── -->
    <Transition name="modal">
      <div v-if="showMapModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4"
           @click.self="showMapModal = false">
        <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl flex flex-col"
             style="width: min(90vw, 560px); max-height: 90vh;">
          <div class="px-5 pt-4 pb-3 border-b border-[#5e4b37] shrink-0 flex items-center justify-between">
            <div>
              <h2 class="text-[#f1d483] font-black text-base">📍 地圖位置</h2>
              <p v-if="mapModalItem" class="text-[#a6937c] text-xs mt-0.5">
                {{ mapModalItem.storeName }} ·
                {{ mapLabel(mapModalItem.mapName) }}
                {{ mapModalItem.xPos }}/{{ mapModalItem.yPos }}
              </p>
            </div>
            <button @click="showMapModal = false"
                    class="text-[#a6937c] hover:text-[#f1d483] transition text-xl leading-none">✕
            </button>
          </div>
          <div class="flex-1 overflow-auto p-3">
            <div v-if="mapModalItem" class="relative w-full" style="padding-top: 125%;">
              <img src="/images/map/prontera.jpg" alt="prontera"
                   class="absolute inset-0 w-full h-full object-cover rounded"/>
              <!-- marker pin -->
              <div class="absolute pointer-events-none"
                   :style="{ left: markerLeft(mapModalItem.xPos), top: markerTop(mapModalItem.yPos) }">
                <div
                    class="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#f1d483]/20 animate-ping"></div>
                <div class="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center">
                  <div class="w-5 h-5 bg-[#f1d483] border-2 border-[#2c1e14] rounded-full shadow-lg"></div>
                  <div class="w-0.5 h-3 bg-[#f1d483] shadow"></div>
                </div>
                <div
                    class="absolute left-4 -translate-y-full mb-1 bg-[#2c1e14]/90 border border-[#5e4b37] rounded px-2 py-0.5 whitespace-nowrap text-[10px] text-[#f1d483] font-bold shadow">
                  {{ mapModalItem.xPos }}/{{ mapModalItem.yPos }}
                </div>
              </div>
            </div>
          </div>
          <div class="px-5 pb-4 pt-2 border-t border-[#5e4b37] shrink-0 flex gap-2">
            <button @click="mapModalItem && copyCoord(mapModalItem)"
                    class="flex-1 py-2 bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] rounded transition text-sm font-bold">
              {{ coordCopied ? '✓ 已複製' : '複製座標' }}
            </button>
            <button @click="showMapModal = false"
                    class="flex-1 py-2 bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] rounded transition text-sm font-bold">
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
        <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl p-6 w-full max-w-sm shadow-2xl">
          <h2 class="text-[#f1d483] font-black text-lg mb-5">🔑 登入 gnjoy</h2>
          <div class="mb-3">
            <label class="text-xs text-[#a6937c] mb-1 block">遊戲帳號</label>
            <input v-model="loginForm.acc" type="text" placeholder="請輸入帳號..." @keyup.enter="doLogin"
                   class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
          </div>
          <div class="mb-4">
            <label class="text-xs text-[#a6937c] mb-1 block">身分證字號</label>
            <input v-model="loginForm.password" type="password" placeholder="請輸入密碼..." @keyup.enter="doLogin"
                   class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] outline-none focus:border-[#f1d483] transition"/>
          </div>
          <label class="flex items-center gap-2 mb-4 cursor-pointer select-none">
            <input v-model="loginForm.remember" type="checkbox"
                   class="w-4 h-4 rounded accent-[#f1d483] cursor-pointer"/>
            <span class="text-xs text-[#a6937c]">記住帳號和身分證</span>
          </label>
          <p v-if="loginError"
             class="mb-3 text-sm text-[#f0a8a8] bg-[#4a1a1a] border border-[#f0a8a8]/20 rounded px-3 py-2">⚠️
            {{ loginError }}</p>
          <div v-if="loginLoading"
               class="mb-3 text-sm text-[#a6937c] bg-[#3d2b1f] border border-[#5e4b37] rounded px-3 py-2 text-center">⏳
            正在開啟瀏覽器並自動登入，請稍候...
          </div>
          <div class="flex justify-end gap-2">
            <button @click="showLogin = false; loginError = ''"
                    class="px-4 py-2 rounded bg-[#3d2b1f] text-[#a6937c] border border-[#5e4b37] hover:bg-[#4a3528] transition text-sm">
              取消
            </button>
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
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #2c1e14;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #5e4b37;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #8d7a64;
}

select option {
  background-color: #2c1e14;
  color: #e0d3b8;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>