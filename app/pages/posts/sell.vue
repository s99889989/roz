<script setup>
import { ref, reactive, computed } from 'vue';
import axios from 'axios';

// --- API 配置 ---
const API_ENDPOINT = 'https://event.gnjoy.com.tw/RoZ/RoZ_ShopSearch/forAjax_shopDeal';

// --- 數據模型 ---

// 伺服器/分流選項 (請依據您的遊戲環境調整)
const servers = ['西格倫', '艾克瑟', '波利', '查爾斯'];
const searchTypes = [
  { value: 'sale', label: '露天商店查詢 (販售)' },
  { value: 'buy', label: '露天商店查詢 (收購)' },
  { value: 'history', label: '成交紀錄查詢' }
];

// 查詢表單的狀態
const formState = reactive({
  server: servers[0],
  searchType: searchTypes[0].value,
  keyword: '',
  // 價格篩選 (設為 null 方便判斷未輸入)
  minPrice: null,
  maxPrice: null,
  // 假定 API 還有分頁參數
  page: 1,
  pageSize: 10,
});

// 查詢結果的狀態
const searchResults = ref([]);
const totalCount = ref(0); // 總筆數
const isLoading = ref(false);
const errorMessage = ref('');
const isSubmitted = ref(false);

// --- 邏輯函數 ---

/**
 * @description 實際呼叫 API 取得商店數據
 */
const fetchShopData = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  if (!formState.keyword.trim() || formState.keyword.length < 2) {
    errorMessage.value = '關鍵字至少需要 2 個字元。';
    isLoading.value = false;
    return;
  }

  // 根據 API 實際需求的參數名稱和格式來構造 Payload
  // 請確認這些參數名稱 ('server', 'type', 'keyword', etc.) 是否與官方 API 一致
  const requestBody = {
    server: formState.server,
    type: formState.searchType,
    keyword: formState.keyword,
    minPrice: formState.minPrice || 0, // 價格為數字，未輸入時傳 0 或不傳
    maxPrice: formState.maxPrice || 999999999,
    page: formState.page,
    pageSize: formState.pageSize,
  };

  try {
    // 使用 POST 請求發送數據
    const response = await axios.post(API_ENDPOINT, requestBody);

    // 假設 API 成功回傳的數據在 response.data 中
    const data = response.data;

    if (data.ErrorCode && data.ErrorCode !== '0') {
      // 處理 API 回傳的錯誤碼
      errorMessage.value = `查詢失敗: ${data.ErrorMsg || '伺服器返回錯誤'}`;
      searchResults.value = [];
      totalCount.value = 0;
    } else {
      // 假設結果列表在 data.list，總筆數在 data.TotalCount
      searchResults.value = data.list || [];
      totalCount.value = data.TotalCount || searchResults.value.length;
    }

  } catch (error) {
    console.error('API 呼叫失敗:', error);
    errorMessage.value = '網路連線或伺服器錯誤，請檢查連線。';
    searchResults.value = [];
    totalCount.value = 0;
  } finally {
    isLoading.value = false;
  }
};

/**
 * @description 處理表單提交
 */
const handleSearch = () => {
  // 重置分頁到第一頁
  formState.page = 1;
  isSubmitted.value = true;
  fetchShopData();
};

/**
 * @description 處理分頁切換
 */
const changePage = (newPage) => {
  formState.page = newPage;
  fetchShopData();
}


/**
 * @description 處理價格輸入，只允許數字
 */
const formatPriceInput = (field) => {
  // 移除所有非數字字符
  let value = formState[field] ? formState[field].toString().replace(/[^\d]/g, '') : '';
  formState[field] = value === '' ? null : parseInt(value);
};

// --- computed 屬性 ---

// 根據查詢類型判斷表格標題
const tableTitle = computed(() => {
  const type = searchTypes.find(t => t.value === formState.searchType);
  return type ? type.label : '查詢結果';
});

// 根據查詢類型判斷表格欄位
const tableHeaders = computed(() => {
  if (formState.searchType === 'history') {
    // 成交紀錄可能需要的欄位
    return [
      { key: 'dealDate', label: '日期' },
      { key: 'itemName', label: '道具名稱' },
      { key: 'price', label: '價格 (單價)' },
      { key: 'quantity', label: '數量' },
      { key: 'type', label: '交易類型' },
    ];
  }

  // 販售或收購查詢
  return [
    { key: 'itemName', label: '道具名稱' },
    { key: 'price', label: '價格' },
    { key: 'stock', label: formState.searchType === 'sale' ? '庫存' : '需求量' },
    { key: 'shopName', label: '商店名稱' },
    { key: 'mapName', label: '所在區域' },
    { key: 'location', label: '商店座標' },
    { key: 'action', label: '導航' },
  ];
});

// 總頁數計算
const totalPages = computed(() => {
  return Math.ceil(totalCount.value / formState.pageSize);
});

// 格式化價格顯示
const formatPrice = (price) => {
  return price ? price.toLocaleString() : '-';
}

/**
 * @description 模擬複製座標到剪貼簿的動作
 */
const copyLocation = (location) => {
  // 假設 location 格式為 "X/Y"，且我們需要 mapName 作為上下文
  const mapName = searchResults.value.find(item => item.location === location)?.mapName || '普隆德拉';
  const command = `/whereis ${mapName} ${location.replace('/', ' ')}`;

  // 實際複製到剪貼簿 (需要 HTTPS 環境)
  navigator.clipboard.writeText(command).then(() => {
    alert(`已複製導航指令到剪貼簿: ${command}`);
  }).catch(err => {
    // 降級處理 (Fallback)
    alert(`瀏覽器無法自動複製。請手動複製: ${command}`);
    console.error('無法複製:', err);
  });
}

</script>

<template>
  <div class="shop-search-container">
    <h2 class="title">⚔️ RO 露天商店查詢平台</h2>

    <form @submit.prevent="handleSearch" class="search-form">

      <div class="form-group row-flex">
        <div class="field-item">
          <label for="server">伺服器/分流:</label>
          <select id="server" v-model="formState.server" required>
            <option v-for="s in servers" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div class="field-item">
          <label for="searchType">查詢類型:</label>
          <select id="searchType" v-model="formState.searchType" required>
            <option v-for="t in searchTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="keyword">關鍵字:</label>
        <input
            id="keyword"
            type="text"
            v-model.trim="formState.keyword"
            placeholder="例如：封印%卡片 或 "
        required
        >
      </div>

      <div class="form-group price-filter" v-if="formState.searchType !== 'history'">
        <label>價格範圍 (Zeny):</label>
        <input
            type="text"
            v-model="formState.minPrice"
            @input="formatPriceInput('minPrice')"
            placeholder="最低價格"
        >
        <span>~</span>
        <input
            type="text"
            v-model="formState.maxPrice"
            @input="formatPriceInput('maxPrice')"
            placeholder="最高價格"
        >
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '查詢中...' : '開始查詢' }}
        </button>
      </div>
      <div v-else class="form-group">
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '查詢中...' : '開始查詢' }}
        </button>
      </div>
    </form>

    <hr class="divider">

    <div class="results-container">
      <h3>{{ tableTitle }} (共 {{ totalCount }} 筆結果)</h3>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p v-else-if="!isSubmitted">請輸入關鍵字並點擊「開始查詢」</p>
      <p v-else-if="!isLoading && searchResults.length === 0 && isSubmitted" class="no-results">
        查無符合條件的露天商店或成交紀錄。請嘗試更換關鍵字或伺服器。
      </p>

      <div v-else-if="searchResults.length > 0" class="table-wrapper">
        <table class="search-results-table">
          <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header.key">
              {{ header.label }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in searchResults" :key="index">
            <td v-for="header in tableHeaders" :key="header.key">
                <span v-if="header.key === 'price'">
                  {{ formatPrice(item[header.key]) }}
                </span>
              <button
                  v-else-if="header.key === 'action' && item.location"
                  @click="copyLocation(item.location)"
                  class="copy-btn"
              >
                導航
              </button>
              <span v-else>
                  {{ item[header.key] }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="pagination" v-if="totalPages > 1">
          <button @click="changePage(formState.page - 1)" :disabled="formState.page === 1">
            上一頁
          </button>
          <span> 第 {{ formState.page }} 頁 / 共 {{ totalPages }} 頁 </span>
          <button @click="changePage(formState.page + 1)" :disabled="formState.page === totalPages">
            下一頁
          </button>
        </div>
      </div>
    </div>

    <blockquote class="tips">
      **關鍵字搜尋小秘訣 (SQL 萬用字元)：**
      <br>
      * 任意字元串：「**%**」代表「任意個」任意字元 (例：`封印%卡片`)
      <br>
      * 單一字元：「**\_**」代表「一個」任意字元 (例：`愛子____卡片`)
      <br>
      * 精準查詢：使用雙引號 (`"`) 將關鍵字包住 (例：`"鐵錘"`)
    </blockquote>
  </div>
</template>

<style scoped>
/* --- 樣式設定 --- */

.shop-search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: '微軟正黑體', Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #3f51b5;
  margin-bottom: 30px;
  border-bottom: 2px solid #3f51b5;
  padding-bottom: 10px;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.form-group.row-flex {
  justify-content: space-between;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group label {
  font-weight: bold;
  color: #555;
  white-space: nowrap;
}

.form-group input[type="text"],
.form-group select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 120px;
}

.form-group input#keyword {
  flex-grow: 1;
  min-width: 250px;
}

.price-filter {
  gap: 10px;
}

.price-filter input {
  width: 100px; /* 固定價格輸入框寬度 */
  flex-grow: 0;
}

.price-filter span {
  color: #888;
}


.search-form button {
  padding: 10px 20px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
  flex-shrink: 0;
}

.search-form button:hover:not(:disabled) {
  background-color: #e68900;
}

.search-form button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.divider {
  margin: 30px 0;
  border: 0;
  border-top: 1px dashed #cccccc;
}

.results-container h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.5em;
}

.error-message {
  color: #d32f2f;
  font-weight: bold;
  padding: 15px;
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: 4px;
}

.no-results {
  color: #888;
  font-style: italic;
  padding: 20px;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.table-wrapper {
  overflow-x: auto;
}

.search-results-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  min-width: 800px;
}

.search-results-table th,
.search-results-table td {
  border: 1px solid #eee;
  padding: 12px 10px;
  text-align: center;
}

.search-results-table td:nth-child(1), /* 道具名稱靠左 */
.search-results-table td:nth-child(4) { /* 商店名稱靠左 */
  text-align: left;
}


.search-results-table th {
  background-color: #e0eaff;
  color: #3f51b5;
  font-weight: bold;
  white-space: nowrap;
}

.search-results-table tr:nth-child(even) {
  background-color: #f8f8f8;
}

.copy-btn {
  padding: 6px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.copy-btn:hover {
  background-color: #388e3c;
}

.tips {
  margin-top: 25px;
  padding: 15px;
  background-color: #fffbe6;
  border-left: 5px solid #ffcc00;
  color: #6a5e00;
  line-height: 1.8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
}

.pagination button {
  padding: 8px 15px;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #b0c4de;
  cursor: not-allowed;
}
</style>