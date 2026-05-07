<script setup>
import {ref, reactive, computed, onMounted} from 'vue';
import {useCommonStore} from '~/stores/common.js';

definePageMeta({layout: 'roz'});

const commonStore = useCommonStore();
const BASE = () => commonStore.data.main_url + '/roz/shop';

// ── 設定（Cookie / Token）────────────────────────────────────────
const showSettings = ref(false);
const settings = reactive({
  cookie: '',
  token: '',
});
const settingsSaved = ref(false);

function saveSettings() {
  localStorage.setItem('gnjoy_cookie', settings.cookie);
  localStorage.setItem('gnjoy_token', settings.token);
  settingsSaved.value = true;
  showSettings.value = false;
  setTimeout(() => settingsSaved.value = false, 2000);
}

function loadSettings() {
  settings.cookie = localStorage.getItem('gnjoy_cookie') || '';
  settings.token = localStorage.getItem('gnjoy_token') || '';
}

onMounted(() => loadSettings());

const hasCredentials = computed(() => settings.cookie && settings.token);

// ── 查詢表單 ─────────────────────────────────────────────────────
const activeTab = ref('shop');   // 'shop' | 'history'
const keyword = ref('');
const server = ref('529');
const storeType = ref('0');      // 0=全部 1=販售 2=收購
const historyDays = ref('1');
const loading = ref(false);
const errorMsg = ref('');

// ── 結果 ─────────────────────────────────────────────────────────
const shopResults = ref([]);
const historyResults = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 30;

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

// ── 查詢 ─────────────────────────────────────────────────────────
async function doSearch(page = 1) {
  if (!keyword.value.trim()) {
    errorMsg.value = '請輸入關鍵字';
    return;
  }
  if (!hasCredentials.value) {
    showSettings.value = true;
    return;
  }

  errorMsg.value = '';
  loading.value = true;
  currentPage.value = page;

  try {
    const headers = {
      'Content-Type': 'application/json',
      'X-Gnjoy-Cookie': settings.cookie,
      'X-Gnjoy-Token': settings.token,
    };

    if (activeTab.value === 'shop') {
      const res = await fetch(`${BASE()}/search`, {
        method: 'POST', headers,
        credentials: 'include',
        body: JSON.stringify({
          div_svr: server.value,
          div_storetype: storeType.value,
          txb_KeyWord: keyword.value.trim(),
          row_start: String((page - 1) * pageSize + 1),
          sort_by: 'itemPrice',
          sort_desc: '',
        }),
      });
      const data = await res.json();
      if (data.error) {
        errorMsg.value = data.error;
        return;
      }
      shopResults.value = data.dt || [];
      totalCount.value = data.dt2?.[0]?.count || 0;

    } else {
      const res = await fetch(`${BASE()}/history`, {
        method: 'POST', headers,
        credentials: 'include',
        body: JSON.stringify({
          div_svr: server.value,
          div_history_days: historyDays.value,
          txb_KeyWord: keyword.value.trim(),
          sort_by: 'SumitemCNT',
          sort_desc: 'desc',
        }),
      });
      const data = await res.json();
      if (data.error) {
        errorMsg.value = data.error;
        return;
      }
      historyResults.value = data.dt || [];
      totalCount.value = data.dt2?.[0]?.count || 0;
    }

  } catch (e) {
    errorMsg.value = '查詢失敗：' + e.message;
  } finally {
    loading.value = false;
  }
}

function switchTab(tab) {
  activeTab.value = tab;
  shopResults.value = [];
  historyResults.value = [];
  totalCount.value = 0;
  currentPage.value = 1;
  errorMsg.value = '';
}

function formatPrice(n) {
  return Number(n).toLocaleString();
}

function storeTypeLabel(t) {
  return t === 0 ? '販售' : '收購';
}
</script>

<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] font-sans pb-16">

    <!-- 頁首 -->
    <div class="max-w-5xl mx-auto px-4 pt-8 pb-4">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-black text-[#f1d483]">🏪 露天商店查詢</h1>
        <button @click="showSettings = true"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition"
                :class="hasCredentials
                  ? 'bg-[#3d2b1f] text-[#a8f0c8] border border-[#a8f0c8]/30 hover:bg-[#4a3528]'
                  : 'bg-[#4a1a1a] text-[#f0a8a8] border border-[#f0a8a8]/30 hover:bg-[#5a2020] animate-pulse'">
          <span>⚙️</span>
          <span>{{ hasCredentials ? 'Cookie 已設定' : '請先設定 Cookie' }}</span>
        </button>
      </div>

      <!-- Tab -->
      <div class="flex gap-2 mb-4">
        <button @click="switchTab('shop')"
                class="px-5 py-2 rounded-lg font-bold text-sm transition"
                :class="activeTab === 'shop'
                  ? 'bg-[#f1d483] text-[#2c1e14]'
                  : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">
          露天商店查詢
        </button>
        <button @click="switchTab('history')"
                class="px-5 py-2 rounded-lg font-bold text-sm transition"
                :class="activeTab === 'history'
                  ? 'bg-[#f1d483] text-[#2c1e14]'
                  : 'bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528]'">
          成交紀錄查詢
        </button>
      </div>

      <!-- 搜尋列 -->
      <div class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-4 mb-4">
        <div class="flex flex-wrap gap-3 items-end">

          <!-- 關鍵字 -->
          <div class="flex-1 min-w-48">
            <label class="text-xs text-[#a6937c] mb-1 block">關鍵字</label>
            <input v-model="keyword"
                   @keyup.enter="doSearch(1)"
                   type="text"
                   placeholder="輸入道具名稱..."
                   class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] placeholder-[#6b5a4a] focus:outline-none focus:border-[#f1d483]"/>
          </div>

          <!-- 伺服器 -->
          <div>
            <label class="text-xs text-[#a6937c] mb-1 block">伺服器</label>
            <select v-model="server"
                    class="bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] focus:outline-none focus:border-[#f1d483]">
              <option value="529">西格倫／艾克瑟</option>
            </select>
          </div>

          <!-- 類型（只有露天商店查詢） -->
          <div v-if="activeTab === 'shop'">
            <label class="text-xs text-[#a6937c] mb-1 block">類型</label>
            <select v-model="storeType"
                    class="bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] focus:outline-none focus:border-[#f1d483]">
              <option value="0">全部</option>
              <option value="1">販售</option>
              <option value="2">收購</option>
            </select>
          </div>

          <!-- 天數（只有成交紀錄查詢） -->
          <div v-if="activeTab === 'history'">
            <label class="text-xs text-[#a6937c] mb-1 block">天數</label>
            <select v-model="historyDays"
                    class="bg-[#2c1e14] border border-[#5e4b37] rounded-lg px-3 py-2 text-sm text-[#e0d3b8] focus:outline-none focus:border-[#f1d483]">
              <option value="1">1 天</option>
              <option value="7">7 天</option>
              <option value="30">30 天</option>
            </select>
          </div>

          <!-- 查詢按鈕 -->
          <button @click="doSearch(1)"
                  :disabled="loading"
                  class="px-6 py-2 bg-[#f1d483] text-[#2c1e14] font-black rounded-lg hover:bg-[#e8c870] disabled:opacity-50 disabled:cursor-not-allowed transition">
            {{ loading ? '查詢中...' : '查詢' }}
          </button>
        </div>

        <!-- 錯誤訊息 -->
        <p v-if="errorMsg" class="mt-3 text-sm text-[#f0a8a8] bg-[#4a1a1a] rounded-lg px-3 py-2">
          ⚠️ {{ errorMsg }}
        </p>
      </div>

      <!-- 結果數 -->
      <div v-if="totalCount > 0" class="text-sm text-[#a6937c] mb-3">
        共 {{ totalCount }} 筆結果
        <span v-if="totalPages > 1">（第 {{ currentPage }} / {{ totalPages }} 頁）</span>
      </div>

      <!-- ── 露天商店查詢結果 ── -->
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
            <tr v-for="(item, i) in shopResults" :key="i"
                class="border-t border-[#5e4b37] hover:bg-[#3d2b1f] transition">
              <td class="px-4 py-2.5 text-[#a6937c]">{{ item.storeName }}</td>
              <td class="px-4 py-2.5 font-bold text-[#e0d3b8]">
                {{ item.itemName }}
                <span v-if="item.ItemGradeLevel > 0" class="text-[#f1d483] text-xs ml-1">
                    ★{{ item.ItemGradeLevel }}
                  </span>
              </td>
              <td class="px-4 py-2.5 text-right font-bold text-[#f1d483]">
                {{ formatPrice(item.itemPrice) }} z
              </td>
              <td class="px-4 py-2.5 text-right text-[#a6937c]">{{ item.itemCNT }}</td>
              <td class="px-4 py-2.5 text-center">
                  <span class="text-xs px-2 py-0.5 rounded-full"
                        :class="item.storetype === 0
                          ? 'bg-[#2a4a3a] text-[#a8f0c8]'
                          : 'bg-[#2a3a4a] text-[#a8c0f0]'">
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

        <!-- 分頁 -->
        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-4">
          <button @click="doSearch(currentPage - 1)"
                  :disabled="currentPage <= 1"
                  class="px-3 py-1.5 rounded-lg bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
            ← 上一頁
          </button>
          <span class="px-3 py-1.5 text-sm text-[#f1d483]">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="doSearch(currentPage + 1)"
                  :disabled="currentPage >= totalPages"
                  class="px-3 py-1.5 rounded-lg bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm">
            下一頁 →
          </button>
        </div>
      </div>

      <!-- ── 成交紀錄查詢結果 ── -->
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
      </div>

      <!-- 查無資料 -->
      <div v-if="!loading && totalCount === 0 && (shopResults.length === 0 && historyResults.length === 0) && keyword"
           class="text-center py-16 text-[#6b5a4a]">
        <div class="text-4xl mb-3">👻</div>
        <p>查無資料</p>
      </div>

    </div>

    <!-- ── 設定 Modal ── -->
    <Transition name="modal">
      <div v-if="showSettings"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
           @click.self="showSettings = false">
        <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-2xl p-6 w-full max-w-lg shadow-2xl">
          <h2 class="text-[#f1d483] font-black text-lg mb-1">⚙️ gnjoy 憑證設定</h2>
          <p class="text-[#a6937c] text-xs mb-4">
            請前往
            <a href="https://event.gnjoy.com.tw/RoZ/RoZ_ShopSearch" target="_blank"
               class="text-[#f1d483] underline">官網</a>
            登入後，按 F12 → Network → 隨便查詢一次 → 點 forAjax_shopDeal → 複製 Cookie 和 Requestverificationtoken
          </p>

          <div class="mb-3">
            <label class="text-xs text-[#a6937c] mb-1 block">Cookie（完整字串）</label>
            <textarea v-model="settings.cookie" rows="4"
                      placeholder="貼上完整 Cookie 字串..."
                      class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-3 py-2 text-xs text-[#e0d3b8] placeholder-[#6b5a4a] focus:outline-none focus:border-[#f1d483] resize-none"/>
          </div>

          <div class="mb-5">
            <label class="text-xs text-[#a6937c] mb-1 block">Requestverificationtoken</label>
            <input v-model="settings.token" type="text"
                   placeholder="貼上 token..."
                   class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-3 py-2 text-xs text-[#e0d3b8] placeholder-[#6b5a4a] focus:outline-none focus:border-[#f1d483]"/>
          </div>

          <div class="flex justify-end gap-2">
            <button @click="showSettings = false"
                    class="px-4 py-2 rounded-lg bg-[#3d2b1f] text-[#a6937c] hover:bg-[#4a3528] transition text-sm">
              取消
            </button>
            <button @click="saveSettings"
                    class="px-4 py-2 rounded-lg bg-[#f1d483] text-[#2c1e14] font-bold hover:bg-[#e8c870] transition text-sm">
              儲存
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
</style>