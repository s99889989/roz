<script setup>
import { ref, computed } from 'vue';
import { itemsData } from "../../assets/data/items_database.js";

const items = ref(itemsData); // 這裡使用模擬數據

// --- 狀態 State ---
const searchTerm = ref('');
const selectedCategory = ref('ALL');
const selectedSubcategory = ref('ALL');


// --- 計算屬性 Computed ---

/**
 * 提取所有不重複的主分類名稱，並將 "消耗/恢復" -> "消耗"
 */
// const categories = computed(() => {
//   if (!items.value || Object.keys(items.value).length === 0) {
//     return [];
//   }
//   const allCategories = Object.values(items.value).map(item => item.category.split('/')[0]);
//   return ['ALL', ...new Set(allCategories)].filter(c => c); // 排除空值並去重
// });

const categories = ['ALL', '武器', '防具', '附魔', '服飾', '卡片', '消耗', '寵物', '其他'];

const subcategories = computed(() => {

  if(selectedCategory.value === '武器' && selectedCategory.value !== 'ALL') {
    return ['ALL', '短劍', '劍', '單手矛', '雙手矛', '單手斧', '雙手斧', '鈍器', '弓', '箭矢', '手杖', '樂器', '書', '拳刃', '拳套', '鞭子', '投擲短劍'];
  }

  if(selectedCategory.value === '防具' && selectedCategory.value !== 'ALL') {
    return ['ALL', '頭上', '頭中', '頭下', '頭上、中', '頭中、下', '頭上、中、下', '鎧甲', '鞋子', '披肩', '盾牌', '飾品'];
  }

  if(selectedCategory.value === '附魔' && selectedCategory.value !== 'ALL') {
    return ['ALL', '(服飾)頭上', '(服飾)頭中', '裝備', '(服飾)披肩', '寵物'];
  }

  if(selectedCategory.value === '服飾' && selectedCategory.value !== 'ALL') {
    return ['ALL', '頭上', '頭中', '頭下', '頭上、中', '頭中、下', '頭上、中、下', '披肩', '飾品(右邊)'];
  }

  if(selectedCategory.value === '卡片' && selectedCategory.value !== 'ALL') {
    return ['ALL', '武器', '頭具', '鎧甲', '鞋子', '披肩', '盾牌', '飾品'];
  }

  if(selectedCategory.value === '寵物' && selectedCategory.value !== 'ALL') {
    return ['ALL', '捕捉', '蛋'];
  }

  return [];
});

/**
 * 根據搜尋、主類別和子類別來篩選物品
 */
const filteredItemsArray = computed(() => {
  let itemsArray = Object.values(items.value);

  // 1. 主分類篩選
  if (selectedCategory.value && selectedCategory.value !== 'ALL') {
    itemsArray = itemsArray.filter(item => item.category.startsWith(selectedCategory.value));
  }

  // 2. 子分類篩選 (根據 category 字段的第二部分)
  if (selectedSubcategory.value && selectedSubcategory.value !== 'ALL') {
    // const fullSubcategory = `${selectedCategory.value}/${selectedSubcategory.value}`;
    itemsArray = itemsArray.filter(item => item.slot === selectedSubcategory.value);
  }

  // 3. 執行搜尋篩選 (保留您的搜尋邏輯)
  const term = searchTerm.value.toLowerCase().trim();
  if (term) {
    itemsArray = itemsArray.filter(item => {
      const nameZhTw = item.name?.zh_tw ? item.name.zh_tw.toLowerCase() : '';
      const description = item.description?.official_clean ? item.description.official_clean.toLowerCase() : '';
      const id = String(item.id);

      return nameZhTw.includes(term) || description.includes(term) || id === term;
    });
  }

  return itemsArray;
});

// --- 函數 Functions ---

function selectCategory(category) {
  selectedCategory.value = category;
  selectedSubcategory.value = 'ALL'; // 切換主類別時，子類別重置
}

function selectSubcategory(subcategory) {
  selectedSubcategory.value = subcategory;
}

function formatPrice(price) {
  return price ? price.toLocaleString() : '0';
}

function getEquipClass(item) {
  return item.equip_jobs || '無限制';
}

function getRequiredLevel(item) {
  return item.required_level || 1;
}

/**
 * 獲取裝備的主要屬性，例如 'STR+2'
 */
function getCardMainStat(item) {
  const attrs = item.attributes;
  if (!attrs) return '';

  // 依序檢查 STR, INT, VIT, DEX 屬性
  if (attrs.str) return `STR+${attrs.str}`;
  if (attrs.int) return `INT+${attrs.int}`;
  if (attrs.vit) return `VIT+${attrs.vit}`;
  if (attrs.dex) return `DEX+${attrs.dex}`;
  if (attrs.def) return `DEF+${attrs.def}`;
  return item.description.official_clean.split('。')[0] || '';
}

/**
 * 獲取物品的基礎防禦力 (若為裝備)
 */
function getItemDefense(item) {
  return item.attributes?.def || 0;
}

/**
 * 清除所有篩選條件
 */
function clearFilters() {
  searchTerm.value = '';
  selectedCategory.value = 'ALL';
  selectedSubcategory.value = 'ALL';
}

const getItemImg = (id) => new URL(`/assets/images/items/${id}.gif`, import.meta.url).href;

const getWearingBImg = (id) => new URL(`/assets/images/wearing/${id}_b.png`, import.meta.url).href;
const getWearingGImg = (id) => new URL(`/assets/images/wearing/${id}_g.png`, import.meta.url).href;
</script>

<template>
  <div class="website-container">
    <div class="content-card" style="width: 100%; max-width: 1000px; padding: 15px 25px;">
      <div class="top-controls">
        <input v-model="searchTerm" placeholder="請輸入物品名稱" class="search-input w-3/4">

        <button @click="clearFilters" class="clear-button w-1/5" style="float: right; margin: 5px;">清除篩選條件</button>
      </div>

      <div class="category-panel" style="margin-top: 20px;">
        <div style="color: #e0d8cc; font-size: 1.1em; margin-bottom: 5px;">類別</div>
        <div class="main-category-buttons">
          <button
              v-for="cat in categories"
              :key="cat"
              @click="selectCategory(cat)"
              :class="['category-button', { active: selectedCategory === cat }]"
              style="margin: 5px;"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div v-if="subcategories.length > 0" class="subcategory-panel" style="margin-top: 20px;">
        <div style="color: #e0d8cc; font-size: 1.1em; margin-bottom: 5px;">子類別</div>
        <div class="sub-category-buttons">
          <button
              v-for="subcat in subcategories"
              :key="subcat"
              @click="selectSubcategory(subcat)"
              :class="['category-button', { active: selectedSubcategory === subcat }]"
              style="margin: 5px;"
          >
            {{ subcat }}
          </button>
        </div>
      </div>

      <hr style="border-color: #7a6a5d; margin: 20px 0;">

      <div class="item-card-grid" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: flex-start;">

        <div
            v-for="item in filteredItemsArray"
            :key="item.id"
            class="item-card"
            style="
                    width: calc(25% - 15px);
                    min-width: 200px;
                    border: 1px solid #7a6a5d;
                    border-radius: 8px;
                    background-color: #4a3e35;
                    padding: 15px;
                    color: #e0d8cc;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
                "
        >
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span class="card-type-tab" style="padding: 3px 8px; background-color: #6a5a4d; border-radius: 4px;">{{ item.category.split('/')[0] }}</span>
            <span class="card-type-tab" style="padding: 3px 8px; background-color: #6a5a4d; border-radius: 4px;">{{ item.slot}}</span>
          </div>

          <div class="flex w-full justify-center">
            <img :src="getItemImg(item.id)" alt="" class="h-8">
            <img :src="getWearingBImg(item.id)" alt="" class="h-20">
            <img :src="getWearingGImg(item.id)" alt="" class="h-20">
          </div>


          <h3 style="color: #cfbd9c; margin-top: 0; margin-bottom: 5px; font-size: 1.2em;">{{ item.name.zh_tw }}</h3>
          <p style="font-size: 0.8em; color: #b0a59a; margin: 0;">ID: {{ item.id }}</p>

          <hr style="border-color: #5b4b3f; margin: 10px 0;">

          <p style="font-size: 0.9em; margin-bottom: 15px;  overflow: hidden; color: #c9c1b6; line-height: 1.5;">
            {{ item.description.official_clean }}
            <br><strong v-if="getCardMainStat(item)" style="color: #90ee90;">{{ getCardMainStat(item) }}</strong>
          </p>

          <table style="width: 100%; font-size: 0.9em;">
            <tr>
              <td style="color: #b0a59a;">需求等級</td>
              <td style="text-align: right;">{{ getRequiredLevel(item) }}</td>
              <td style="color: #b0a59a;">重量</td>
              <td style="text-align: right;">{{ item.attributes?.weight || 0 }}</td>
            </tr>
            <tr>
              <td style="color: #b0a59a;">買價</td>
              <td style="text-align: right;">{{ formatPrice(item.attributes?.buy_price) }}</td>
              <td style="color: #b0a59a;">賣價</td>
              <td style="text-align: right;">{{ formatPrice(item.attributes?.sell_price) }}</td>
            </tr>
            <tr>
              <td style="color: #b0a59a;">洞數</td>
              <td style="text-align: right;">{{ item.slotCount || 0 }}</td>
              <td style="color: #b0a59a;">洞數</td>
              <td style="text-align: right;">{{ item.enchantment_slots || 0 }}</td>
            </tr>
            <tr>
              <td style="color: #b0a59a;">防禦力</td>
              <td style="text-align: right;">{{ getItemDefense(item) }}</td>
              <td style="color: #b0a59a;">防禦力</td>
              <td style="text-align: right;">{{ getItemDefense(item) }}</td>
            </tr>
          </table>

          <hr style="border-color: #5b4b3f; margin: 10px 0;">

          <p style="font-size: 0.9em; margin-bottom: 10px;">
            <strong style="color: #b0a59a;">可裝備職業：</strong>
            <span style="color: #90ee90;">{{ getEquipClass(item) }}</span>
          </p>

          <div v-if="item.dropped_by && item.dropped_by.length" style="font-size: 0.8em; color: #b0a59a;">
            <p v-for="(drop, index) in item.dropped_by.slice(0, 2)" :key="index" style="margin: 3px 0;">
              👾 {{ drop.name }} <span style="float: right; color: #cfbd9c;">{{ drop.rate }}</span>
            </p>
          </div>
        </div>

      </div>

      <p v-if="filteredItemsArray.length === 0" class="no-results">
        找不到符合條件的物品。
      </p>

    </div>
  </div>
</template>

<style scoped>
/* 保持所有樣式不變 */

/* [Your existing styles remain here] */
.website-container { background-color: #3f352b; min-height: 100vh; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
.content-card { background-color: #5b4b3f; border-radius: 12px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4); padding: 24px 30px; max-width: 900px; width: 100%; box-sizing: border-box; border: 1px solid #4a3e35; }
.search-input{
  padding: 12px;
  color: #fff;
  font-size: 18px;
  box-shadow: 0 6px 18px rgba(89, 23, 23, 0.35);
  border-radius: 5px;
  border: 1px solid #7a6a5d;
}
.search-input::placeholder {
  color: #cbc1c1;
}
/* ... (其他您提供的樣式) ... */

/* 覆蓋/新增為了匹配圖片的小樣式調整 */
.top-controls { display: flex; justify-content: space-between;  margin-bottom: 10px; }
.clear-button { background-color: #8c785b; color: #f5f5f5; padding: 8px 15px; border-radius: 6px; border: 1px solid #a38d6f; cursor: pointer; font-weight: bold; transition: background-color 0.2s; }
.clear-button:hover { background-color: #a38d6f; }
.main-category-buttons, .sub-category-buttons { display: flex; flex-wrap: wrap; gap: 5px; }
.category-button { padding: 6px 15px; border-radius: 4px; background-color: #4a3e35; color: #e0d8cc; border: 1px solid #7a6a5d; font-size: 0.9em; font-weight: normal; box-shadow: none; }
.category-button.active { background-color: #9b8770; color: #3f352b; border-color: #cfbd9c; box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4); }
.item-card table td { padding: 2px 0; line-height: 1.2; }
.no-results { text-align: center; padding: 20px; color: #ffcccc; background-color: #8a6f6f; border-radius: 8px; margin-top: 25px; border: 1px solid #b59f9f; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); }

/* RWD 調整 */
@media (max-width: 768px) {
  .content-card { padding: 20px 15px; }
  .item-card { width: calc(50% - 10px) !important; min-width: unset !important; }
}
@media (max-width: 480px) {
  .item-card { width: 100% !important; }
}
</style>

