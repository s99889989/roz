<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const items = ref([]);

// --- 狀態 State ---
const searchTerm = ref('');
const selectedCategory = ref('ALL');
const selectedSubcategory = ref('ALL');

onMounted(async () => {
  try {
    const response = await fetch('/data/items_database.json');
    if (!response.ok) throw new Error('資料載入失敗');
    const data = await response.json();
    items.value = data;
  } catch (error) {
    console.error("讀取資料錯誤:", error);
  }
});

const categories = ['ALL', '武器', '防具', '附魔', '服飾', '卡片', '消耗', '寵物', '其他'];

const subcategories = computed(() => {
  if (selectedCategory.value === '武器') {
    return ['ALL', '短劍', '劍', '單手矛', '雙手矛', '單手斧', '雙手斧', '鈍器', '弓', '箭矢', '手杖', '樂器', '書籍', '拳刃', '拳套', '鞭子', '投擲短劍'];
  }
  if (selectedCategory.value === '防具') {
    return ['ALL', '頭上', '頭中', '頭下', '頭上、中', '頭中、下', '頭上、中、下', '鎧甲', '鞋子', '披肩', '盾牌', '飾品'];
  }
  if (selectedCategory.value === '附魔') {
    return ['ALL', '(服飾)頭上', '(服飾)頭中', '裝備', '(服飾)披肩', '寵物'];
  }
  if (selectedCategory.value === '服飾') {
    return ['ALL', '頭上', '頭中', '頭下', '頭上、中', '頭中、下', '頭上、中、下', '披肩', '飾品(右邊)', '飾品(左)'];
  }
  if (selectedCategory.value === '卡片') {
    return ['ALL', '武器', '頭具', '鎧甲', '鞋子', '披肩', '盾牌', '飾品'];
  }
  if (selectedCategory.value === '寵物') {
    return ['ALL', '捕捉', '蛋'];
  }
  return [];
});

const filteredItemsArray = computed(() => {
  let itemsArray = Object.values(items.value);

  if (selectedCategory.value && selectedCategory.value !== 'ALL') {
    itemsArray = itemsArray.filter(item => item.category.startsWith(selectedCategory.value));
  }

  if (selectedSubcategory.value && selectedSubcategory.value !== 'ALL') {
    itemsArray = itemsArray.filter(item => item.slot === selectedSubcategory.value);
  }

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

// ✅ 響應式欄數：ResizeObserver 監測容器寬度
const scrollerRef = ref(null)
const colCount = ref(1)
const MIN_CARD_WIDTH = 220
const GAP = 16

function updateColCount(width) {
  colCount.value = Math.max(1, Math.floor((width + GAP) / (MIN_CARD_WIDTH + GAP)))
}

let resizeObserver = null

onMounted(() => {
  document.title = 'RO樂園-物品查詢';
  nextTick(() => {
    if (scrollerRef.value) {
      updateColCount(scrollerRef.value.offsetWidth)
      resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          updateColCount(entry.contentRect.width)
        }
      })
      resizeObserver.observe(scrollerRef.value)
    }
  })
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

// ✅ 依 colCount 分組成 rows
const itemRows = computed(() => {
  const arr = filteredItemsArray.value
  const cols = colCount.value
  const rows = []
  for (let i = 0; i < arr.length; i += cols) {
    const rowItems = arr.slice(i, i + cols)
    rows.push({
      id: `row-${i}-${rowItems[0]?.id}-cols${cols}`,
      items: rowItems,
    })
  }
  return rows
})

function selectCategory(category) {
  selectedCategory.value = category;
  selectedSubcategory.value = 'ALL';
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

function getItemDefense(item) {
  return item.defense || 0;
}

function getItemAttack(item) {
  return item.attack || 0;
}

function clearFilters() {
  searchTerm.value = '';
  selectedCategory.value = 'ALL';
  selectedSubcategory.value = 'ALL';
}

const formattedDescription = (text) => {
  if (!text) return '';
  return text.replace(/\\n/g, '<br>');
}

const getItemImg = (id) => `/images/items/${id}.gif`

const onImgError = (e, id) => {
  e.target.src = `https://assets.twroz.wiki/images/items/${id}.gif`;
};

const getWearingBImg = (id) => `/images/wearing/${id}_b.png`
const getWearingGImg = (id) => `/images/wearing/${id}_g.png`
const getMonsterImg = (id) => `/images/monsters/${id}.gif`
</script>

<template>
  <div class="website-container">
    <div class="content-card">
      <div class="top-controls">
        <input v-model="searchTerm" placeholder="請輸入物品名稱" class="search-input">
        <button @click="clearFilters" class="clear-button">清除篩選條件</button>
      </div>

      <div class="category-panel" style="margin-top: 20px;">
        <div class="section-title">類別</div>
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
        <div class="section-title">子類別</div>
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

      <!-- ✅ 虛擬滾動：page-mode 使用整頁捲軸，ResizeObserver 自動響應欄數 -->
      <div ref="scrollerRef" class="w-full">
        <DynamicScroller
            v-if="itemRows.length > 0"
            :items="itemRows"
            :min-item-size="200"
            key-field="id"
            page-mode
        >
          <template #default="{ item: row, index, active }">
            <DynamicScrollerItem
                :item="row"
                :active="active"
                :size-dependencies="[colCount]"
                :data-index="index"
            >
              <div
                  class="grid gap-4 py-2"
                  :style="{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }"
              >
                <div
                    v-for="it in row.items"
                    :key="it.id"
                    class="item-card"
                >
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span class="card-type-tab">{{ it.category.split('/')[0] }}</span>
                    <span class="card-type-tab">{{ it.slot }}</span>
                  </div>

                  <div class="flex w-full justify-center">
                    <img :src="getItemImg(it.id)" @error="e => onImgError(e, it.id)" alt="" class="h-8">
                    <img :src="getWearingBImg(it.id)" alt="" class="h-20">
                    <img :src="getWearingGImg(it.id)" alt="" class="h-20">
                  </div>

                  <h3 style="color: #cfbd9c; margin-top: 0; margin-bottom: 5px; font-size: 1.2em;">{{ it.name.zh_tw }}</h3>
                  <p style="font-size: 0.8em; color: #b0a59a; margin: 0;">ID: {{ it.id }}</p>

                  <hr style="border-color: #5b4b3f; margin: 10px 0;">

                  <p class="text-left" style="font-size: 0.9em; margin-bottom: 15px; overflow: hidden; color: #c9c1b6; line-height: 1.5;">
                    <strong style="color: #ff9b9b;" v-html="formattedDescription(it.description.official_clean)"></strong>
                  </p>

                  <table style="width: 100%; font-size: 0.9em;">
                    <tbody>
                    <tr>
                      <td class="td1">需求等級</td>
                      <td class="td2">{{ it.required_level }}</td>
                      <td class="td3">重量</td>
                      <td class="td4">{{ it.attributes.weight }}</td>
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
                    <li v-for="(drop, idx) in it.dropped_by.slice(0, 2)" :key="idx" class="flex justify-between" style="margin: 3px 0;">
                      <div class="flex">
                        <img :src="getMonsterImg(drop.monster_id)" alt="" class="w-5 h-5">
                        <span>{{ drop.monster_name }}</span>
                      </div>
                      <span class="text-red-600 font-bold">{{ drop.rate }}%</span>
                    </li>
                  </div>

                </div>
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </div>

      <p v-if="filteredItemsArray.length === 0" class="no-results">
        找不到符合條件的物品。
      </p>

    </div>
  </div>
</template>

<style scoped>
.td1 { text-align: left; color: #b0a59a; }
.td2 { text-align: left; }
.td3 { text-align: left; color: #b0a59a; }
.td4 { text-align: left; }

.website-container {
  background-color: #3f352b;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.content-card {
  background-color: #5b4b3f;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  padding: 24px 30px;
  width: 100%;
  max-width: 1000px;
  box-sizing: border-box;
  border: 1px solid #4a3e35;
}

.search-input {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  color: #fff;
  font-size: 16px;
  box-shadow: 0 6px 18px rgba(89, 23, 23, 0.35);
  border-radius: 5px;
  border: 1px solid #7a6a5d;
  background-color: #3f352b;
}

.search-input::placeholder {
  color: #cbc1c1;
}

.top-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.clear-button {
  flex-shrink: 0;
  background-color: #8c785b;
  color: #f5f5f5;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #a38d6f;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background-color: #a38d6f;
}

.main-category-buttons,
.sub-category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.category-button {
  padding: 6px 15px;
  border-radius: 4px;
  background-color: #4a3e35;
  color: #e0d8cc;
  border: 1px solid #7a6a5d;
  font-size: 0.9em;
  font-weight: normal;
  box-shadow: none;
  cursor: pointer;
}

.category-button.active {
  background-color: #9b8770;
  color: #3f352b;
  border-color: #cfbd9c;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
}

/* ✅ 物品卡片樣式 */
.item-card {
  border: 1px solid #7a6a5d;
  border-radius: 8px;
  background-color: #4a3e35;
  padding: 15px;
  color: #e0d8cc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.item-card table td {
  padding: 2px 0;
  line-height: 1.2;
}

.card-type-tab {
  padding: 3px 8px;
  background-color: #6a5a4d;
  border-radius: 4px;
  font-size: 0.85em;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #ffcccc;
  background-color: #8a6f6f;
  border-radius: 8px;
  margin-top: 25px;
  border: 1px solid #b59f9f;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* vue-virtual-scroller display 修正 */
:deep(.vue-recycle-scroller) {
  display: block !important;
}

.section-title {
  color: #e0d8cc;
  font-size: 1.1em;
  margin-bottom: 5px;
  text-align: left;
}

/* RWD */
@media (max-width: 768px) {
  .content-card { padding: 20px 15px; }
}
</style>