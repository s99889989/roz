<script setup>
import { ref, computed } from 'vue';
// 假設您的物品數據放在這裡
import { itemsData } from "../../assets/data/items_database.js";
// --- 狀態 State ---
const items = ref(itemsData);
const searchTerm = ref('');
const selectedCategory = ref(null);

// --- 計算屬性 Computed ---

/**
 * 提取所有不重複的分類名稱，用於生成分類按鈕
 */
const categories = computed(() => {
  if (!items.value || Object.keys(items.value).length === 0) {
    return [];
  }
  const allCategories = Object.values(items.value).map(item => item.category);
  return [...new Set(allCategories)].filter(c => c); // 排除空值並去重
});

/**
 * 根據搜尋關鍵字和選定的分類來篩選物品
 */
const filteredItemsArray = computed(() => {
  let itemsArray = Object.values(items.value);

  // 1. 執行分類篩選
  if (selectedCategory.value) {
    itemsArray = itemsArray.filter(item => item.category === selectedCategory.value);
  }

  // 2. 執行搜尋篩選
  const term = searchTerm.value.toLowerCase().trim();
  if (term) {
    itemsArray = itemsArray.filter(item => {
      // 搜尋邏輯：檢查繁中名稱、韓文名稱和描述
      const nameZhTw = item.name.zh_tw ? item.name.zh_tw.toLowerCase() : '';
      const nameKr = item.name.kr ? item.name.kr.toLowerCase() : '';
      const description = item.description.official_clean ? item.description.official_clean.toLowerCase() : '';
      const id = String(item.id);

      return nameZhTw.includes(term) ||
          nameKr.includes(term) ||
          description.includes(term) ||
          id === term;
    });
  }

  return itemsArray;
});

// --- 函數 Functions ---

/**
 * 設定當前選擇的分類
 */
function selectCategory(category) {
  selectedCategory.value = category;
}

/**
 * 計算該分類下的物品數量
 */
function countItemsInCategory(category) {
  return Object.values(items.value).filter(item => item.category === category).length;
}

/**
 * 格式化後的價格 (例如: 1,200)
 */
function formatPrice(price) {
  return price.toLocaleString();
}

// 圖片路徑輔助函數 (如果您需要顯示物品圖片)
// const getItemImg = (id) => new URL(`/assets/images/items/511.gif`, import.meta.url).href;
 const getItemImg = (id) => new URL(`/assets/images/items/${id}.gif`, import.meta.url).href;
</script>

<template>
  <div id="item-viewer">
    <h1>📦 物品資料庫檢視器 (Setup API)</h1>

    <div class="controls">
      <input
          v-model="searchTerm"
          placeholder="🔍 輸入物品名稱 (例如: 紅色藥水)"
          class="search-input"
      >

      <div class="category-buttons">
        <button
            @click="selectCategory(null)"
            :class="{ active: selectedCategory === null }"
        >
          全部 ({{ Object.keys(items).length }})
        </button>
        <button
            v-for="cat in categories"
            :key="cat"
            @click="selectCategory(cat)"
            :class="{ active: selectedCategory === cat }"
        >
          {{ cat }} ({{ countItemsInCategory(cat) }})
        </button>
      </div>
    </div>

    <div class="item-list-container">
      <h2>📜 篩選結果 ({{ filteredItemsArray.length }} 筆)</h2>
      <table class="item-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>圖</th>
          <th>名稱 (繁中)</th>
          <th>類別</th>
          <th>說明 (HP 恢復)</th>
          <th>重量</th>
          <th>NPC 購買價</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in filteredItemsArray" :key="item.id">
          <td>{{ item.id }}</td>
          <img :src="getItemImg(item.id)" alt="" class="w-5 h-5">
          <td><strong>{{ item.name.zh_tw }}</strong></td>
          <td>{{ item.category }}</td>
          <td>{{ item.description.official_clean }}</td>
          <td>{{ item.attributes.weight }}</td>
          <td>{{ formatPrice(item.attributes.buy_price) }}</td>
        </tr>
        </tbody>
      </table>

      <p v-if="filteredItemsArray.length === 0" class="no-results">
        找不到符合 **"{{ searchTerm }}"** 且分類為 **"{{ selectedCategory || '全部' }}"** 的物品。
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 整體容器樣式 */
.website-container {
  background-color: #3f352b; /* 深棕色背景 */
  min-height: 100vh; /* 確保至少佔滿整個視窗高度 */
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px; /* 卡片間距 */
}

/* 卡片容器樣式 */
.content-card {
  background-color: #5b4b3f; /* 卡片背景色，比主背景稍淺 */
  border-radius: 12px; /* 圓角 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4); /* 深色陰影 */
  padding: 24px 30px;
  max-width: 900px; /* 限制卡片最大寬度 */
  width: 100%;
  box-sizing: border-box; /* 包含 padding */
  border: 1px solid #4a3e35; /* 輕微邊框，增加質感 */
}

/* 卡片標題區塊 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: center; /* 讓標題居中 */
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #7a6a5d; /* 分隔線 */
}

.header-icon {
  width: 48px; /* 圖標大小 */
  height: 48px;
  margin-right: 15px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); /* 圖標陰影 */
}

.header-title {
  color: #e0d8cc; /* 淺色標題文字 */
  font-size: 2.2em;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5); /* 文字陰影 */
}

.card-description {
  color: #c9c1b6; /* 描述文字顏色 */
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.1em;
  line-height: 1.6;
}

.section-title {
  color: #e0d8cc;
  font-size: 1.5em;
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* 表格容器 */
.table-wrapper {
  overflow-x: auto; /* 當表格內容過多時顯示滾動條 */
  border-radius: 8px; /* 表格整體圓角 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* 表格陰影 */
  margin-bottom: 20px;
}

/* 表格樣式 */
.styled-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* 防止在小螢幕上過窄 */
}

.table-header-cell {
  background-color: #4a3e35; /* 表頭背景色 */
  color: #e0d8cc; /* 表頭文字顏色 */
  padding: 15px 12px;
  text-align: left;
  font-weight: bold;
  font-size: 1.05em;
  border-bottom: 2px solid #7a6a5d; /* 表頭底部邊框 */
  position: sticky; /* 使表頭在滾動時固定 */
  top: 0;
  z-index: 10;
}

.table-header-cell:first-child { border-top-left-radius: 8px; }
.table-header-cell:last-child { border-top-right-radius: 8px; }

.table-data-cell {
  background-color: #6a5a4d; /* 奇數行背景 */
  color: #e0d8cc; /* 資料文字顏色 */
  padding: 12px;
  border-bottom: 1px solid #5b4b3f; /* 行分隔線 */
}

.styled-table tbody tr:nth-child(even) .table-data-cell {
  background-color: #7a6a5d; /* 偶數行背景，稍深 */
}

.styled-table tbody tr:hover .table-data-cell {
  background-color: #8a7a6d; /* 滑鼠懸停效果 */
  transition: background-color 0.2s ease;
}

/* 查看詳情按鈕 */
.view-details-button {
  display: inline-block;
  background-color: #8c785b; /* 按鈕背景色，帶金屬感 */
  color: #f5f5f5; /* 按鈕文字顏色 */
  padding: 8px 15px;
  border-radius: 6px; /* 圓角按鈕 */
  text-decoration: none;
  font-weight: bold;
  font-size: 0.95em;
  transition: all 0.2s ease;
  border: 1px solid #a38d6f; /* 按鈕邊框 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* 按鈕陰影 */
}

.view-details-button:hover {
  background-color: #a38d6f; /* 懸停效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  transform: translateY(-1px); /* 輕微上浮 */
}

/* --- 物品檢視器控制區塊 --- */
.controls {
  margin-bottom: 25px;
  padding: 20px;
  border: 1px solid #7a6a5d;
  border-radius: 10px;
  background-color: #6a5a4d; /* 控制區塊背景 */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2); /* 內陰影 */
}

.search-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #7a6a5d;
  border-radius: 6px;
  background-color: #4a3e35; /* 輸入框背景色 */
  color: #e0d8cc; /* 輸入框文字顏色 */
  box-sizing: border-box;
  font-size: 1em;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.search-input::placeholder {
  color: #b0a59a; /* 提示文字顏色 */
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center; /* 按鈕居中 */
}

.category-button {
  padding: 10px 18px;
  border: 1px solid #a38d6f; /* 按鈕邊框 */
  border-radius: 25px; /* 更圓的按鈕 */
  background-color: #8c785b; /* 默認按鈕背景 */
  color: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95em;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.category-button:hover {
  background-color: #a38d6f;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  transform: translateY(-1px);
}

.category-button.active {
  background-color: #b59f81; /* 選中狀態顏色 */
  color: #333; /* 選中狀態文字顏色 */
  border-color: #cfbd9c;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4), inset 0 0 5px rgba(255, 255, 255, 0.2); /* 更多陰影和內陰影 */
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #ffcccc; /* 淺紅色提示文字 */
  background-color: #8a6f6f; /* 提示背景色 */
  border-radius: 8px;
  margin-top: 25px;
  border: 1px solid #b59f9f;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* RWD 調整 */
@media (max-width: 768px) {
  .content-card {
    padding: 20px 15px;
  }
  .header-title {
    font-size: 1.8em;
  }
  .card-description {
    font-size: 1em;
  }
  .table-header-cell, .table-data-cell {
    padding: 10px 8px;
    font-size: 0.9em;
  }
  .view-details-button, .category-button {
    padding: 7px 12px;
    font-size: 0.85em;
  }
}

@media (max-width: 480px) {
  .website-container {
    padding: 20px 10px;
  }
  .content-card {
    border-radius: 8px;
  }
  .header-icon {
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }
  .header-title {
    font-size: 1.5em;
  }
  .card-description {
    font-size: 0.9em;
  }
  .category-buttons {
    justify-content: flex-start; /* 小螢幕靠左 */
  }
}
</style>