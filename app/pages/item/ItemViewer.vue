<script setup>
import { ref, computed } from 'vue';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import {VirtualScroll} from "vue3-virtual-scroll";
const items = ref([]); // 這裡使用模擬數據

// --- 狀態 State ---
const searchTerm = ref('');
const selectedCategory = ref('ALL');
const selectedSubcategory = ref('ALL');

// 2. 在網頁載入時 fetch 資料
onMounted(async () => {
  try {
    // 路徑不需要寫 public，編譯後 public 會變成根目錄 /
    const response = await fetch('/data/items_database.json');
    if (!response.ok) throw new Error('資料載入失敗');

    const data = await response.json();
    items.value = data;
  } catch (error) {
    console.error("讀取資料錯誤:", error);
  } finally {
    // isLoading.value = false;
  }
});

const categories = ['ALL', '武器', '防具', '附魔', '服飾', '卡片', '消耗', '寵物', '其他'];

const subcategories = computed(() => {

  if(selectedCategory.value === '武器' && selectedCategory.value !== 'ALL') {
    return ['ALL', '短劍', '劍', '單手矛', '雙手矛', '單手斧', '雙手斧', '鈍器', '弓', '箭矢', '手杖', '樂器', '書籍', '拳刃', '拳套', '鞭子', '投擲短劍'];
  }

  if(selectedCategory.value === '防具' && selectedCategory.value !== 'ALL') {
    return ['ALL', '頭上', '頭中', '頭下', '頭上、中', '頭中、下', '頭上、中、下', '鎧甲', '鞋子', '披肩', '盾牌', '飾品'];
  }

  if(selectedCategory.value === '附魔' && selectedCategory.value !== 'ALL') {
    return ['ALL', '(服飾)頭上', '(服飾)頭中', '裝備', '(服飾)披肩', '寵物'];
  }

  if(selectedCategory.value === '服飾' && selectedCategory.value !== 'ALL') {
    return ['ALL', '頭上', '頭中', '頭下', '頭上、中', '頭中、下', '頭上、中、下', '披肩', '飾品(右邊)', '飾品(左)'];
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
  return item.required_level || 0;
}

/**
 * 獲取物品的基礎防禦力 (若為裝備)
 */
function getItemDefense(item) {
  return item.defense || 0;
}
/**
 * 獲取物品的基礎防禦力 (若為裝備)
 */
function getItemAttack(item) {
  return item.attack || 0;
}
/**
 * 清除所有篩選條件
 */
function clearFilters() {
  searchTerm.value = '';
  selectedCategory.value = 'ALL';
  selectedSubcategory.value = 'ALL';
}

const formattedDescription = (text) =>{
  if (!text) {
    return ''; // 確保傳入空值時不會出錯
  }
  // 只處理傳入的 text 參數，不依賴 this.item
  return text.replace(/\\n/g, '<br>');
}
const getItemImg = (id) => {

  // const url = `http://localhost:3000/images/items/${id}.gif`;
  // return url;
  // // return `https://assets.twroz.wiki/images/items/${id}.gif`
  return `/images/items/${id}.gif`
}
const onImgError = (e, id) => {
  const fallbackUrl = `https://assets.twroz.wiki/images/items/${id}.gif`;
  console.log(fallbackUrl);
  e.target.src = fallbackUrl;
  // 直接使用 <a download> 觸發下載（不用 fetch）

  // const a = document.createElement('a');
  // a.href = fallbackUrl;
  // a.download = `${id}.gif`; // 載入原檔名稱
  // a.target = '_blank';
  // document.body.appendChild(a);
  // a.click();
  // a.remove();

};
// console.log('測試路徑: '+url)
//  return `/images/items/${id}.gif`
const getWearingBImg = (id) => {
  // return `https://assets.twroz.wiki/images/wearing/${id}_b.png`
    return `/images/wearing/${id}_b.png`
}
const getWearingGImg = (id) => {
    // return `https://assets.twroz.wiki/images/wearing/${id}_g.png`
  return `/images/wearing/${id}_g.png`
}
const getMonsterImg = (id) => {
  // return `https://assets.twroz.wiki/images/wearing/${id}_b.png`
  return `/images/monsters/${id}.gif`
}
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

      <!-- 結果統計 -->
      <div class="mb-4 p-3 bg-[#2b1e12] border border-yellow-600 rounded">
        <span class="text-yellow-400 font-bold">搜尋結果：</span>
        <span class="text-white">共 {{ filteredItemsArray.length }} 件物品</span>
      </div>

      <VirtualScroll
          :list="filteredItemsArray"
          :item-height="200"
          :bufferCount = "70"
          :grid="4"
          :rowKey="id"
      >
        <template #default="{ item: it, index }">
          <div  class="item-card"
                style="
                    width: calc(25% - 15px);
                    min-width: 200px;
                    border: 1px solid #7a6a5d;
                    border-radius: 8px;
                    background-color: #4a3e35;
                    padding: 15px;
                    color: #e0d8cc;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
                ">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span class="card-type-tab" style="padding: 3px 8px; background-color: #6a5a4d; border-radius: 4px;">{{ it.category.split('/')[0] }}</span>
              <span class="card-type-tab" style="padding: 3px 8px; background-color: #6a5a4d; border-radius: 4px;">{{ it.slot}}</span>
            </div>



          <div class="flex w-full justify-center">
            <img :src="getItemImg(it.id)" @error="e => onImgError(e, it.id)" alt="" class="h-8">
<!--            <img :src="getWearingBImg(it.id)" alt="" class="h-20">-->
<!--            <img :src="getWearingGImg(it.id)" alt="" class="h-20">-->
          </div>


          <h3 style="color: #cfbd9c; margin-top: 0; margin-bottom: 5px; font-size: 1.2em;">{{ it.name.zh_tw }}</h3>
          <p style="font-size: 0.8em; color: #b0a59a; margin: 0;">ID: {{ it.id }}</p>

          <hr style="border-color: #5b4b3f; margin: 10px 0;">



          <p class="text-left" style="font-size: 0.9em; margin-bottom: 15px; overflow: hidden; color: #c9c1b6; line-height: 1.5;">
            <strong style="color: #ff9b9b;" v-html="formattedDescription(it.description.official_clean)"></strong>
          </p>

          <table style="width: 100%; font-size: 0.9em;">
            <tbody>
            <tr class="">
              <td class="td1">需求等級</td>
              <td class="td2">{{ it.required_level }}</td>
              <td class="td3">重量</td>
              <td class="td4">{{ it.attributes.weight}}</td>
            </tr>
            <tr>
              <td class="td1">買價</td>
              <td class="td2">{{ formatPrice(it.attributes?.buy_price) }}</td>
              <td class="td3">賣價</td>
              <td class="td4">{{ formatPrice(it.attributes?.sell_price) }}</td>
            </tr>
            <tr>
              <td v-if="it.slotCount !== 0" class="td1">洞數</td>
              <td v-if="it.slotCount !== 0" class="td2">{{ it.slotCount || 0 }}</td>
              <td v-if="it.weapon_level !== 0" class="td3">等級</td>
              <td v-if="it.weapon_level !== 0" class="td4">{{ it.weapon_level || 0 }}</td>
            </tr>
            <tr>
              <td v-if="getItemDefense(it) !== 0" class="td1">防禦力</td>
              <td v-if="getItemDefense(it) !== 0" class="td2">{{ getItemDefense(it) }}</td>
              <td v-if="getItemAttack(it) !== 0" class="td3">攻擊力</td>
              <td v-if="getItemAttack(it) !== 0" class="td4">{{ getItemAttack(it) }}</td>
            </tr>
            </tbody>
          </table>

            <p v-if="it.equip_jobs === ''" class="pt-2" style="font-size: 1em; margin-bottom: 10px;">
              <strong style="color: #b0a59a;">可裝備職業：</strong>
              <span style="color: #90ee90;">{{ it.equip_jobs }}</span>
            </p>

          <hr style="border-color: #5b4b3f; margin: 10px 0;">
            <span v-if="it.dropped_by.length <= 0" class="font-bold">暫無道具掉落來源</span>
          <div v-if="it.dropped_by && it.dropped_by.length" style="font-size: 0.8em; color: #b0a59a;">
            <li v-for="(drop, index) in it.dropped_by.slice(0, 2)" class="flex justify-between" :key="index" style="margin: 3px 0;">
              <div class="flex">
                <img :src="getMonsterImg(drop.monster_id)" alt="" class="w-5 h-5">
                <span>{{ drop.monster_name }}</span>
              </div>
              <span class="text-red-600 font-bold">{{ drop.rate }}%</span>
            </li>
          </div>

          </div>
        </template>
      </VirtualScroll>

      <p v-if="filteredItemsArray.length === 0" class="no-results">
        找不到符合條件的物品。
      </p>

    </div>
  </div>
</template>

<style scoped>
/* 保持所有樣式不變 */
.td1{
  text-align: left;
  color: #b0a59a;
}
.td2{
  text-align: left;
}
.td3{
  text-align: left;
  color: #b0a59a;
}
.td4{
  text-align: left;
}
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

