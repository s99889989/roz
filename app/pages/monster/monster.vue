<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue"
import { initFlowbite } from "flowbite";
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

// ✅ 怪物資料
const monsters1 = ref([]);
const items = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('/data/monsters_display_index.json');
    if (!response.ok) throw new Error('資料載入失敗');
    const data = await response.json();
    monsters1.value = data;
  } catch (error) {
    console.error("讀取資料錯誤:", error);
  }
  try {
    const response = await fetch('/data/items_database.json');
    if (!response.ok) throw new Error('資料載入失敗');
    const data = await response.json();
    items.value = data;
  } catch (error) {
    console.error("讀取資料錯誤:", error);
  }
});

// 紀錄每個魔物卡片目前顯示的物品詳情
const selectedItemDetail = ref({});

const toggleItemDetail = (monsterId, itemId) => {
  if (selectedItemDetail.value[monsterId]?.id === itemId) {
    selectedItemDetail.value[monsterId] = null;
    return;
  }
  const itemData = items.value[itemId];
  if (itemData) {
    selectedItemDetail.value[monsterId] = itemData;
  }
};

const formatText = (text) => {
  if (!text) return '';
  return text.replace(/\\n/g, '\n');
};

const isModalOpen = ref(false);
const selectedFullItem = ref({});

const showFullDetail = (item) => {
  selectedFullItem.value = item;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = 'auto';
};

const formatDescription = (text) => {
  if (!text) return '';
  return text.replace(/\\n/g, '\n');
};

// 排序切換
const sortAsc = ref(false)

// 搜尋輸入
const search = ref("")
const minLevel = ref("")
const maxLevel = ref("")
const minHP = ref("")
const maxHP = ref("")
const minHit = ref("")
const maxHit = ref("")
const minFlee = ref("")
const maxFlee = ref("")

// 選取標籤
const selectedType = ref(['all'])
const selectedElement = ref(['all'])
const selectedRace = ref(['all'])
const selectedSize = ref(['all'])

onMounted(() => {
  initFlowbite()
})

const typeList = [
  { id: "all", name: "ALL", icon: "/assets/element/neutral.png" },
  { id: "common", name: "一般", icon: "/assets/element/neutral.png" },
  { id: "mini", name: "MINI", icon: "/assets/element/neutral.png" },
  { id: "MVP", name: "MVP", icon: "/assets/element/neutral.png" },
]

const elementList = [
  { id: "all", name: "ALL", icon: "/assets/element/neutral.png" },
  { id: "無", name: "無", icon: "/assets/element/neutral.png" },
  { id: "水", name: "水", icon: "/assets/element/water.png" },
  { id: "地", name: "地", icon: "/assets/element/earth.png" },
  { id: "火", name: "火", icon: "/assets/element/fire.png" },
  { id: "風", name: "風", icon: "/assets/element/wind.png" },
  { id: "毒", name: "毒", icon: "/assets/element/poison.png" },
  { id: "聖", name: "聖", icon: "/assets/element/holy.png" },
  { id: "暗", name: "暗", icon: "/assets/element/shadow.png" },
  { id: "念", name: "念", icon: "/assets/element/ghost.png" },
  { id: "不死", name: "不死", icon: "/assets/element/undead.png" },
]

const raceList = [
  { id: "all", name: "ALL", icon: "/assets/race/formless.png" },
  { id: "無形", name: "無形", icon: "/assets/race/formless.png" },
  { id: "植物", name: "植物", icon: "/assets/race/plant.png" },
  { id: "動物", name: "動物", icon: "/assets/race/brute.png" },
  { id: "昆蟲", name: "昆蟲", icon: "/assets/race/insect.png" },
  { id: "魚貝", name: "魚貝", icon: "/assets/race/fish.png" },
  { id: "惡魔", name: "惡魔", icon: "/assets/race/demon.png" },
  { id: "天使", name: "天使", icon: "/assets/race/angel.png" },
  { id: "龍", name: "龍族", icon: "/assets/race/dragon.png" },
  { id: "不死", name: "不死", icon: "/assets/race/undead.png" },
  { id: "人形", name: "人形", icon: "/assets/race/undead.png" },
]

const sizeList = [
  { id: "all", name: "ALL", icon: "/assets/size/small.png" },
  { id: "小型", name: "小型", icon: "/assets/size/small.png" },
  { id: "中型", name: "中型", icon: "/assets/size/medium.png" },
  { id: "大型", name: "大型", icon: "/assets/size/large.png" },
]

// ✅ 過濾結果
const filteredMonsters = computed(() => {
  let monstersArray = Object.values(monsters1.value);

  return monstersArray.filter(m => {
    const q = (search.value || "").trim().toLowerCase();

    const matchesName =
        q === "" ||
        (m.name.zh_tw && m.name.zh_tw.includes(q)) ||
        m.id.toString() === q ||
        (itemSearch.value && m.drops && m.drops.some(it => it.name.includes(q))) ||
        (Array.isArray(m.spawns) &&
            m.spawns.some(loc =>
                (loc.map_name && loc.map_name.toLowerCase().includes(q))
            ));

    const matchesLevel =
        (!minLevel.value || m.basic_info.level >= parseInt(minLevel.value)) &&
        (!maxLevel.value || m.basic_info.level <= parseInt(maxLevel.value))

    const matchesHP =
        (!minHP.value || m.stats.hp >= parseInt(minHP.value)) &&
        (!maxHP.value || m.stats.hp <= parseInt(maxHP.value))

    const matchesHit =
        (!minHit.value || m.stats.hit_100_percent >= parseInt(minHit.value)) &&
        (!maxHit.value || m.stats.hit_100_percent <= parseInt(maxHit.value))

    const matchesFlee =
        (!minFlee.value || m.stats.flee_95_percent >= parseInt(minFlee.value)) &&
        (!maxFlee.value || m.stats.flee_95_percent <= parseInt(maxFlee.value))

    const matchesType =
        selectedType.value.length === 0 ||
        selectedType.value.includes("all") ||
        selectedType.value.some(t => {
          if (m.special_status.includes(t)) {
            return true;
          } else {
            if (selectedType.value.includes("common")) {
              if (!m.special_status.includes('mini') && !m.special_status.includes('MVP')) {
                return true;
              }
            }
          }
          return false;
        })

    const matchesElement =
        selectedElement.value.length === 0 ||
        selectedElement.value.includes("all") ||
        selectedElement.value.some(e => m.basic_info.element.type.includes(e))

    const matchesRace =
        selectedRace.value.length === 0 ||
        selectedRace.value.includes("all") ||
        selectedRace.value.some(r => m.basic_info.race.includes(r))

    const matchesSize =
        selectedSize.value.length === 0 ||
        selectedSize.value.includes("all") ||
        selectedSize.value.includes(m.basic_info.size + '型')

    return matchesName && matchesLevel && matchesHP && matchesHit && matchesFlee && matchesElement && matchesRace && matchesSize && matchesType
  })
      .sort((a, b) => sortAsc.value
          ? a.basic_info.level - b.basic_info.level
          : b.basic_info.level - a.basic_info.level
      )
})

// ✅ 響應式欄數：用 ResizeObserver 監測容器寬度
// 卡片最小寬度 240px，間距 16px
const scrollerRef = ref(null)
const colCount = ref(1)

const MIN_CARD_WIDTH = 240
const GAP = 16

function updateColCount(width) {
  const cols = Math.max(1, Math.floor((width + GAP) / (MIN_CARD_WIDTH + GAP)))
  colCount.value = cols
}

let resizeObserver = null

onMounted(() => {
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

// ✅ 將 filteredMonsters 依 colCount 分組成 rows
// 每個 row 是一個虛擬滾動的項目，包含最多 colCount 個怪物
// row 的 key 用 rowIndex + 第一個怪物 id 組合，確保 colCount 改變時強制重新渲染
const monsterRows = computed(() => {
  const monsters = filteredMonsters.value
  const cols = colCount.value
  const rows = []
  for (let i = 0; i < monsters.length; i += cols) {
    const rowMonsters = monsters.slice(i, i + cols)
    rows.push({
      id: `row-${i}-${rowMonsters[0]?.id}-cols${cols}`,
      monsters: rowMonsters,
    })
  }
  return rows
})

// 篩選條件改變時重新初始化 Flowbite
watch(filteredMonsters, () => {
  nextTick(() => initFlowbite())
})

function handleToggle(id, selectedRef) {
  let currentSelection = [...selectedRef.value];

  if (!selectMode.value) {
    if (id === 'all' || currentSelection.includes(id)) {
      selectedRef.value = ['all'];
    } else {
      selectedRef.value = [id];
    }
    return;
  }

  if (id === 'all') {
    selectedRef.value = ['all'];
    return;
  }

  if (currentSelection.includes('all')) {
    currentSelection = [];
  }

  if (currentSelection.includes(id)) {
    currentSelection = currentSelection.filter(item => item !== id);
  } else {
    currentSelection.push(id);
  }

  if (currentSelection.length === 0) {
    currentSelection = ['all'];
  }

  selectedRef.value = currentSelection;
}

const toggleRace = (id) => handleToggle(id, selectedRace);
const toggleSize = (id) => handleToggle(id, selectedSize);
const toggleType = (id) => handleToggle(id, selectedType);
const toggleElement = (id) => handleToggle(id, selectedElement);

function clearFilters() {
  search.value = ""
  minLevel.value = ""
  maxLevel.value = ""
  minHP.value = ""
  maxHP.value = ""
  minHit.value = ""
  maxHit.value = ""
  minFlee.value = ""
  maxFlee.value = ""
  selectedType.value = ['all']
  selectedElement.value = ['all']
  selectedRace.value = ['all']
  selectedSize.value = ['all']
}

function displayValue(value) {
  if (!isNaN(value)) {
    return Number(value).toLocaleString();
  }
  return value;
}

function selectMap(value) {
  search.value = value
  minLevel.value = ""
  maxLevel.value = ""
  minHP.value = ""
  maxHP.value = ""
  minHit.value = ""
  maxHit.value = ""
  minFlee.value = ""
  maxFlee.value = ""
  selectedType.value = ['all']
  selectedElement.value = ['all']
  selectedRace.value = ['all']
  selectedSize.value = ['all']
}

const getMonsterImg = (id) => `/images/monsters/${id}.gif`

const isAdvanced = ref(false);
const toggleAdvanced = () => { isAdvanced.value = !isAdvanced.value; };

const itemSearch = ref(false);
const toggleItemSearch = () => { itemSearch.value = !itemSearch.value; };

const elementShow = ref(true);
const toggleElementSearch = () => { elementShow.value = !elementShow.value; };

const dropShow = ref(true);
const toggleDropSearch = () => { dropShow.value = !dropShow.value; };

const mapSplitShow = ref(true);
const toggleMapSplit = () => { mapSplitShow.value = !mapSplitShow.value; };

const displayMap = (name) => {
  if (mapSplitShow.value) return true;
  const hiddenSuffixes = ['_a', '_b', '_z'];
  const shouldHide = hiddenSuffixes.some(suffix => name.includes(suffix));
  return !shouldHide;
};

function getEquipClass(item) {
  return item.equip_jobs || '無限制';
}

onMounted(() => {
  document.title = 'RO樂園-魔物查詢';
  const savedItem = localStorage.getItem('itemSearch');
  const savedElement = localStorage.getItem('elementShow');
  const savedDrop = localStorage.getItem('dropShow');
  const savedMap = localStorage.getItem('displayMapShow');

  if (savedItem !== null) itemSearch.value = JSON.parse(savedItem);
  if (savedElement !== null) elementShow.value = JSON.parse(savedElement);
  if (savedDrop !== null) dropShow.value = JSON.parse(savedDrop);
  if (savedMap !== null) mapSplitShow.value = JSON.parse(savedMap);
});

watch(itemSearch, (newVal) => localStorage.setItem('itemSearch', JSON.stringify(newVal)));
watch(elementShow, (newVal) => localStorage.setItem('elementShow', JSON.stringify(newVal)));
watch(dropShow, (newVal) => localStorage.setItem('dropShow', JSON.stringify(newVal)));
watch(mapSplitShow, (newVal) => localStorage.setItem('displayMapShow', JSON.stringify(newVal)));

const selectMode = ref(false);
const toggleSelectMode = () => { selectMode.value = !selectMode.value; };

const elementTypes = ['無', '水', '地', '火', '風', '毒', '聖', '暗', '念', '不死'];

const elementMatrix = {
  1: [
    [100, 100, 100, 100, 100, 100, 100, 100, 90, 100],
    [100, 25, 100, 150, 90, 150, 100, 100, 100, 100],
    [100, 100, 25, 90, 150, 150, 100, 100, 100, 100],
    [100, 90, 150, 25, 100, 150, 100, 100, 100, 125],
    [100, 150, 90, 100, 25, 150, 100, 100, 100, 100],
    [100, 125, 125, 125, 125, 0, 75, 75, 75, 75],
    [100, 100, 100, 100, 100, 75, 0, 125, 100, 125],
    [100, 100, 100, 100, 100, 75, 125, 0, 100, 0],
    [90, 100, 100, 100, 100, 75, 90, 90, 125, 100],
    [100, 100, 100, 90, 100, 75, 125, 0, 100, 0]
  ],
  2: [
    [100, 100, 100, 100, 100, 100, 100, 100, 70, 100],
    [100, 0, 100, 175, 80, 150, 100, 100, 100, 100],
    [100, 100, 0, 80, 175, 150, 100, 100, 100, 100],
    [100, 80, 175, 0, 100, 150, 100, 100, 100, 150],
    [100, 175, 80, 100, 0, 150, 100, 100, 100, 100],
    [100, 150, 150, 150, 150, 0, 75, 75, 75, 50],
    [100, 100, 100, 100, 100, 75, 0, 150, 100, 150],
    [100, 100, 100, 100, 100, 75, 150, 0, 100, 0],
    [70, 100, 100, 100, 100, 75, 80, 80, 150, 125],
    [100, 100, 100, 80, 100, 50, 150, 0, 125, 0],
  ],
  3: [
    [100, 100, 100, 100, 100, 100, 100, 100, 50, 100],
    [100, 0, 100, 200, 70, 125, 100, 100, 100, 100],
    [100, 100, 0, 70, 200, 125, 100, 100, 100, 100],
    [100, 70, 200, 0, 100, 125, 100, 100, 100, 175],
    [100, 200, 70, 100, 0, 125, 100, 100, 100, 100],
    [100, 125, 125, 125, 125, 0, 50, 50, 50, 25],
    [100, 100, 100, 100, 100, 50, 0, 175, 100, 175],
    [100, 100, 100, 100, 100, 50, 175, 0, 100, 0],
    [50, 100, 100, 100, 100, 50, 70, 70, 175, 150],
    [100, 100, 100, 70, 100, 25, 175, 0, 150, 0],
  ],
  4: [
    [100, 100, 100, 100, 100, 100, 100, 100, 0, 100],
    [100, 0, 100, 200, 60, 125, 100, 100, 100, 100],
    [100, 100, 0, 60, 200, 125, 100, 100, 100, 100],
    [100, 60, 200, 0, 100, 125, 100, 100, 100, 200],
    [100, 200, 60, 100, 0, 125, 100, 100, 100, 100],
    [100, 125, 125, 125, 125, 0, 50, 50, 50, 0],
    [100, 100, 100, 100, 100, 50, 0, 200, 100, 200],
    [100, 100, 100, 100, 100, 50, 200, 0, 100, 0],
    [0, 100, 100, 100, 100, 50, 60, 60, 200, 175],
    [100, 100, 100, 60, 100, 0, 200, 0, 175, 0],
  ],
};

const getElementEffect = (targetType, targetLv) => {
  const colIndex = elementTypes.indexOf(targetType);
  if (colIndex === -1) return [];
  const matrix = elementMatrix[targetLv] || elementMatrix[1];
  return elementTypes.map((attackerType, rowIndex) => ({
    name: attackerType,
    value: matrix[rowIndex][colIndex]
  }));
};

const getAttack = (min, max) => {
  if (min === max) return min;
  return min + '-' + max;
}

const getItemImg = (id) => `/images/items/${id}.gif`

</script>

<template>
  <div class="p-4 text-white min-h-screen">

    <!-- 頂部開關列 -->
    <div class="mb-4 flex flex-wrap items-center gap-4">
      <h1 class="text-2xl font-bold text-yellow-400">搜尋</h1>

      <div class="flex items-center">
        <span class="text-xl font-bold text-[#b89a74] me-2">搜尋物品</span>
        <div
            @click="toggleItemSearch"
            class="relative w-14 h-7 flex items-center bg-white border-2 border-gray-300 rounded-lg cursor-pointer transition-colors duration-200"
            :class="{ 'bg-gray-100': itemSearch }"
        >
          <div
              class="w-5 h-5 bg-[#4a5246] rounded-md shadow-sm transform transition-transform duration-300"
              :class="itemSearch ? 'translate-x-7' : 'translate-x-1'"
          ></div>
        </div>
      </div>

      <div class="flex items-center">
        <span class="text-xl font-bold text-[#b89a74] me-2">顯示屬性相剋</span>
        <div
            @click="toggleElementSearch"
            class="relative w-14 h-7 flex items-center bg-white border-2 border-gray-300 rounded-lg cursor-pointer transition-colors duration-200"
            :class="{ 'bg-gray-100': elementShow }"
        >
          <div
              class="w-5 h-5 bg-[#4a5246] rounded-md shadow-sm transform transition-transform duration-300"
              :class="elementShow ? 'translate-x-7' : 'translate-x-1'"
          ></div>
        </div>
      </div>

      <div class="flex items-center">
        <span class="text-xl font-bold text-[#b89a74] me-2">顯示掉落物品</span>
        <div
            @click="toggleDropSearch"
            class="relative w-14 h-7 flex items-center bg-white border-2 border-gray-300 rounded-lg cursor-pointer transition-colors duration-200"
            :class="{ 'bg-gray-100': dropShow }"
        >
          <div
              class="w-5 h-5 bg-[#4a5246] rounded-md shadow-sm transform transition-transform duration-300"
              :class="dropShow ? 'translate-x-7' : 'translate-x-1'"
          ></div>
        </div>
      </div>

      <div class="flex items-center">
        <span class="text-xl font-bold text-[#b89a74] me-2">地圖顯示分流</span>
        <div
            @click="toggleMapSplit"
            class="relative w-14 h-7 flex items-center bg-white border-2 border-gray-300 rounded-lg cursor-pointer transition-colors duration-200"
            :class="{ 'bg-gray-100': mapSplitShow }"
        >
          <div
              class="w-5 h-5 bg-[#4a5246] rounded-md shadow-sm transform transition-transform duration-300"
              :class="mapSplitShow ? 'translate-x-7' : 'translate-x-1'"
          ></div>
        </div>
      </div>
    </div>

    <!-- 搜尋區 -->
    <div class="mb-4 grid gap-2">
      <div class="flex mb-2 flex-wrap gap-2">
        <input
            v-model="search"
            type="text"
            placeholder="輸入怪物或地圖名稱..."
            class="bg-[#2b1e12] w-1/2 border border-yellow-600 rounded px-3 py-2 text-white placeholder-gray-400"
        />
        <button
            @click="clearFilters"
            class="bg-[#2b1e12] hover:bg-red-700 px-4 py-2 rounded text-sm font-bold"
        >
          清除篩選條件
        </button>
      </div>
    </div>

    <!-- 分類多選 -->
    <div class="mb-4 flex justify-start items-center">
      <span class="text-xl font-bold text-[#b89a74] me-2">分類多選</span>
      <div
          @click="toggleSelectMode"
          class="relative w-14 h-7 flex items-center bg-white border-2 border-gray-300 rounded-lg cursor-pointer transition-colors duration-200"
          :class="{ 'bg-gray-100': selectMode }"
      >
        <div
            class="w-5 h-5 bg-[#4a5246] rounded-md shadow-sm transform transition-transform duration-300"
            :class="selectMode ? 'translate-x-7' : 'translate-x-1'"
        ></div>
      </div>
    </div>

    <!-- 類型篩選 -->
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <h3 class="text-xl text-yellow-400 font-bold mb-2">類型</h3>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
            v-for="e in typeList"
            :key="e.id"
            @click="toggleType(e.id)"
            class="px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 transform"
            :class="selectedType.includes(e.id)
              ? 'bg-[#FAD2A8] to-yellow-600 text-black shadow-xl'
              : 'bg-[#6C5543] text-white hover:bg-[#8C5843]'"
        >
          {{ e.name }}
        </button>
      </div>

    </div>

    <!-- 種族篩選 -->
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <h3 class="text-xl text-yellow-400 font-bold mb-2">種族</h3>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
            v-for="r in raceList"
            :key="r.id"
            @click="toggleRace(r.id)"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 transform"
            :class="selectedRace.includes(r.id)
              ? 'bg-[#FAD2A8] to-yellow-600 text-black shadow-xl'
              : 'bg-[#6C5543] text-white hover:bg-[#8C5843]'"
        >
          {{ r.name }}
        </button>
      </div>
    </div>

    <!-- 屬性篩選 -->
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <h3 class="text-xl text-yellow-400 font-bold mb-2">屬性</h3>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
            v-for="e in elementList"
            :key="e.id"
            @click="toggleElement(e.id)"
            class="px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 transform"
            :class="selectedElement.includes(e.id)
              ? 'bg-[#FAD2A8] to-yellow-600 text-black shadow-xl'
              : 'bg-[#6C5543] text-white hover:bg-[#8C5843]'"
        >
          {{ e.name }}
        </button>
      </div>

    </div>

    <!-- 大小 -->
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <h3 class="text-xl text-yellow-400 font-bold mb-2">大小</h3>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
            v-for="s in sizeList"
            :key="s.id"
            @click="toggleSize(s.id)"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 transform"
            :class="selectedSize.includes(s.id)
             ? 'bg-[#FAD2A8] to-yellow-600 text-black shadow-xl'
              : 'bg-[#6C5543] text-white hover:bg-[#8C5843]'"
        >
          {{ s.name }}
        </button>
      </div>
    </div>

    <!-- 進階搜尋 -->
    <div class="mb-4">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-xl font-bold text-[#b89a74]">進階搜尋</span>
        <div
            @click="toggleAdvanced"
            class="relative w-14 h-7 flex items-center bg-white border-2 border-gray-300 rounded-lg cursor-pointer transition-colors duration-200"
            :class="{ 'bg-gray-100': isAdvanced }"
        >
          <div
              class="w-5 h-5 bg-[#4a5246] rounded-md shadow-sm transform transition-transform duration-300"
              :class="isAdvanced ? 'translate-x-7' : 'translate-x-1'"
          ></div>
        </div>
      </div>

      <div v-show="isAdvanced" class="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-8 lg:w-fit">
        <div class="flex items-center gap-2 justify-start">
          <span class="text-xl text-yellow-400 font-bold whitespace-nowrap">等級：</span>
          <input v-model="minLevel" type="number"
                 class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
                 placeholder="MIN">
          <span class="text-yellow-600">-</span>
          <input v-model="maxLevel" type="number"
                 class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
                 placeholder="MAX">
          <button
              @click="sortAsc = !sortAsc"
              class="ml-2 bg-[#2b1e12] hover:bg-red-700 px-3 py-1 rounded text-xs font-bold text-white border border-red-900 transition-colors whitespace-nowrap"
          >
            切換排序
          </button>
        </div>

        <div class="flex items-center gap-2 justify-start">
          <span class="text-xl text-yellow-400 font-bold whitespace-nowrap">血量：</span>
          <input v-model="minHP" type="number"
                 class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
                 placeholder="MIN">
          <span class="text-yellow-600">-</span>
          <input v-model="maxHP" type="number"
                 class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
                 placeholder="MAX">
        </div>

        <div class="flex items-center gap-2 justify-start">
          <span class="text-xl text-yellow-400 font-bold whitespace-nowrap">迴避：</span>
          <input v-model="minFlee" type="number"
                 class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
                 placeholder="MIN">
          <span class="text-yellow-600">-</span>
          <input v-model="maxFlee" type="number"
                 class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
                 placeholder="MAX">
        </div>

        <div class="flex items-center gap-2 justify-start">
          <span class="text-xl text-yellow-400 font-bold whitespace-nowrap">命中：</span>
          <input v-model="minHit" type="number"
                 class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
                 placeholder="MIN">
          <span class="text-yellow-600">-</span>
          <input v-model="maxHit" type="number"
                 class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
                 placeholder="MAX">
        </div>
      </div>
    </div>

    <!-- 結果統計 -->
    <div class="mb-4 p-3 bg-[#2b1e12] border border-yellow-600 rounded flex items-center gap-4">
      <span class="text-yellow-400 font-bold">搜尋結果：</span>
      <span class="text-white">共 {{ filteredMonsters.length }} 隻怪物</span>
    </div>

    <!--
      ✅ 虛擬滾動 + 多欄 grid 方案：
      - ResizeObserver 監測 scroller 寬度 → 計算 colCount
      - filteredMonsters 依 colCount 分組成 monsterRows
      - DynamicScroller 以每個「row」為單位進行虛擬滾動
      - 每個 row 內部用 CSS grid 排列多張卡片
      - :size-dependencies 包含 colCount，確保欄數改變時重新量測行高
    -->
    <div ref="scrollerRef" class="w-full">
      <DynamicScroller
          v-if="monsterRows.length > 0"
          :items="monsterRows"
          :min-item-size="200"
          key-field="id"
          page-mode
      >
        <template #default="{ item: row, index, active }">
          <DynamicScrollerItem
              :item="row"
              :active="active"
              :size-dependencies="[
              colCount,
              elementShow,
              dropShow,
              ...row.monsters.map(m => selectedItemDetail[m.id])
            ]"
              :data-index="index"
          >
            <!-- 一整行的 grid，欄數跟著 colCount 走 -->
            <div
                class="grid gap-4 py-2"
                :style="{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }"
            >
              <div
                  v-for="m in row.monsters"
                  :key="m.id"
                  class="bg-[#f0e4d6] rounded p-4 text-black shadow-lg hover:shadow-xl transition-all"
              >

                <div class="flex justify-between">
                  <!-- 地圖 Dropdown -->
                  <img
                      :id="'dropdownHoverButton' + m.id"
                      :data-dropdown-toggle="'dropdownHover' + m.id"
                      data-dropdown-placement="right"
                      data-dropdown-trigger="hover"
                      :src="`/images/icon/map.png`"
                      alt="map icon"
                      class="w-10 h-10 cursor-pointer"
                  />
                  <div
                      :id="'dropdownHover' + m.id"
                      class="z-10 hidden bg-black rounded-xs shadow-sm"
                  >
                    <ul class="py-1 text-sm text-gray-200" :aria-labelledby="'dropdownHoverButton' + m.id">
                      <template v-for="map in m.spawns" :key="map.map_name">
                        <li
                            v-if="displayMap(map.map_name)"
                            @click="selectMap(map.map_name)"
                            class="hover:bg-gray-600 cursor-pointer"
                        >
                          <a class="px-2 py-1 block w-full hover:text-white">
                            {{ map.description }}({{ map.map_name }})
                          </a>
                        </li>
                      </template>
                    </ul>
                  </div>

                  <div class="flex h-6 flex-wrap gap-1">
                    <p style="border-radius: 2px" class="bg-[#DCD692] text-xs pt-1 ps-2 pe-2">{{ m.basic_info.race }}</p>
                    <p style="border-radius: 2px" class="bg-[#C5DCBC] text-xs pt-1 ps-2 pe-2">
                      {{ m.basic_info.element.type }}{{ m.basic_info.element.level }}</p>
                    <p style="border-radius: 2px" class="bg-[#DCD6B8] text-xs pt-1 ps-2 pe-2">{{ m.basic_info.size }}</p>
                  </div>
                </div>

                <img :src="getMonsterImg(m.id)" alt="" class="w-full h-12 object-contain mb-3 rounded">
                <h2 class="font-bold text-lg text-yellow-800">{{ m.name.zh_tw }}</h2>
                <h2 class="text-xs text-gray-500">{{ m.id }}</h2>
                <h2 class="text-xs text-gray-500">{{ m.name.en }}</h2>

                <p class="text-sm flex justify-center"><strong>等級：</strong><span class="statsColor">{{ displayValue(m.basic_info.level) }}</span></p>
                <p class="text-sm flex justify-center"><strong>血量：</strong><span class="statsColor">{{ displayValue(m.stats.hp) }}</span></p>
                <p class="text-sm flex justify-center"><strong>經驗值：</strong><span class="statsColor">{{ displayValue(m.stats.exp.base) }}</span></p>
                <p class="text-sm flex justify-center"><strong>職業經驗值：</strong><span class="statsColor">{{ displayValue(m.stats.exp.job) }}</span></p>
                <p class="text-sm flex justify-center"><strong>攻擊力：</strong><span class="statsColor">{{ getAttack(m.stats.attack.min, m.stats.attack.max) }}</span></p>
                <p class="text-sm flex justify-center"><strong>物理防禦：</strong><span class="statsColor">{{ m.stats.defense }}</span></p>
                <p class="text-sm flex justify-center"><strong>魔法防禦：</strong><span class="statsColor">{{ m.stats.magic_defense }}</span></p>
                <p class="text-sm flex justify-center"><strong>100%命中：</strong><span class="statsColor">{{ m.stats.hit_100_percent }}</span></p>
                <p class="text-sm flex justify-center"><strong>95%迴避：</strong><span class="statsColor">{{ m.stats.flee_95_percent }}</span></p>

                <!-- 屬性相剋 -->
                <div v-show="elementShow">
                  <hr class="my-3 border-yellow-700">
                  <div class="mb-4">
                    <h3 class="font-bold text-yellow-700 mb-2">屬性相剋倍率</h3>
                    <div class="grid grid-cols-5 gap-1 text-[10px] text-center">
                      <div
                          v-for="effect in getElementEffect(m.basic_info.element.type, m.basic_info.element.level)"
                          :key="effect.name"
                          class="flex flex-col border border-yellow-600 rounded p-1 transition-all"
                          :class="{
                          'bg-green-100 border-green-400': effect.value > 100,
                          'bg-red-100 border-red-400': effect.value < 100,
                          'bg-white': effect.value === 100,
                          'bg-gray-800': effect.value === 0
                        }"
                      >
                        <span class="text-black">{{ effect.name }}</span>
                        <span class="font-bold" :class="{
                          'text-green-700': effect.value > 100,
                          'text-red-600': effect.value < 100 && effect.value > 0,
                          'text-black': effect.value === 100
                        }">{{ effect.value }}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 掉落物品 -->
                <div v-show="dropShow">
                  <hr class="my-3 border-yellow-700">
                  <h3 class="font-bold text-yellow-700 mb-2">掉落物品</h3>
                  <ul class="text-sm">
                    <template v-for="drop in m.drops" :key="drop.item_id">
                      <li
                          @click="toggleItemDetail(m.id, drop.item_id)"
                          class="flex justify-between items-center py-1 px-2 rounded cursor-pointer hover:bg-yellow-100"
                          :class="{ 'bg-yellow-50': selectedItemDetail[m.id]?.id === drop.item_id }"
                      >
                        <div class="flex items-center">
                          <img :src="`/${drop.icon_url}`" alt="" class="w-5 h-5 mr-1">
                          <span :class="{ 'text-blue-700 font-bold': selectedItemDetail[m.id]?.id === drop.item_id }">
                            {{ drop.name }}
                          </span>
                          <span v-show="drop.slotCount > 0">[{{ drop.slotCount }}]</span>
                        </div>
                        <span class="text-red-600 font-bold">{{ drop.rate }}%</span>
                      </li>

                      <Transition name="expand">
                        <div v-if="selectedItemDetail[m.id]?.id === drop.item_id" class="expand-wrapper">
                          <div class="expand-content">
                            <div class="my-2 p-3 bg-[#fdfbf7] border border-yellow-600 rounded text-left shadow-inner">
                              <div class="grid grid-cols-3 text-[11px] text-gray-700">
                                <p>類型：{{ selectedItemDetail[m.id].category.split('/')[0] }}</p>
                                <p>重量：{{ selectedItemDetail[m.id].attributes?.weight }}</p>
                                <p>規格：{{ selectedItemDetail[m.id].slot }}</p>
                              </div>
                              <div class="text-xs text-blue-700 leading-relaxed whitespace-pre-line mb-3">
                                {{ formatDescription(selectedItemDetail[m.id].description.official_clean) }}
                              </div>
                              <div class="border-t border-dashed border-yellow-700/30 pt-2 text-center">
                                <button
                                    @click.stop="showFullDetail(selectedItemDetail[m.id])"
                                    class="text-xs text-red-700 font-bold hover:underline cursor-pointer"
                                >
                                  查看物品詳情
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Transition>
                    </template>
                  </ul>
                </div>

              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>

    <!-- 無結果提示 -->
    <div v-if="filteredMonsters.length === 0" class="text-center py-20">
      <p class="text-2xl text-yellow-400 mb-4">😢 找不到符合條件的怪物</p>
      <button
          @click="clearFilters"
          class="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded font-bold text-black"
      >
        清除篩選條件
      </button>
    </div>

  </div>

  <!-- 物品詳情 Modal -->
  <Transition name="fade">
    <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="closeModal"
    >
      <div class="relative w-full max-w-md bg-[#4a4540] rounded-lg border border-[#6b6359] overflow-hidden shadow-2xl animate-scale-up">

        <div class="flex justify-between items-center bg-[#3a3530] px-4 py-2 border-b border-[#6b6359]">
          <span class="bg-[#5a5550] px-3 py-1 rounded text-sm text-gray-200 shadow-inner">
            {{ selectedFullItem.category || '消耗' }}
          </span>
          <button
              @click="closeModal"
              class="bg-[#5a5550] hover:bg-red-900 text-gray-300 w-8 h-8 rounded flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div class="p-6 text-center">
          <img :src="getItemImg(selectedFullItem.id)" class="w-16 h-16 mx-auto mb-4 drop-shadow-md">
          <h2 class="text-[#b8d9f5] text-2xl font-bold mb-1">{{ selectedFullItem.name?.zh_tw }}</h2>
          <p class="text-gray-400 text-sm mb-6">ID: {{ selectedFullItem.id }}</p>

          <div class="bg-[#3a3530]/50 p-4 rounded-lg mb-6">
            <p class="text-[#7fff7f] text-base leading-relaxed whitespace-pre-line text-left">
              {{ formatDescription(selectedFullItem.description?.official) }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-y-2 gap-x-8 text-left text-gray-300 text-sm border-t border-[#6b6359] pt-4">
            <div class="flex justify-between border-b border-[#5a5550] pb-1">
              <span class="text-gray-500">需求等級</span>
              <span>{{ selectedFullItem.attributes?.required_level || 1 }}</span>
            </div>
            <div class="flex justify-between border-b border-[#5a5550] pb-1">
              <span class="text-gray-500">重量</span>
              <span>{{ selectedFullItem.attributes?.weight || 0 }}</span>
            </div>
            <div class="flex justify-between border-b border-[#5a5550] pb-1">
              <span class="text-gray-500">買價</span>
              <span>{{ selectedFullItem.buy_price?.toLocaleString() || 'N/A' }}</span>
            </div>
            <div class="flex justify-between border-b border-[#5a5550] pb-1">
              <span class="text-gray-500">賣價</span>
              <span>{{ selectedFullItem.sell_price?.toLocaleString() || 'N/A' }}</span>
            </div>
            <div class="flex justify-between border-b border-[#5a5550] pb-1">
              <span class="text-gray-500">洞數</span>
              <span>{{ selectedFullItem.slot || 0 }}</span>
            </div>
            <div class="flex justify-between border-b border-[#5a5550] pb-1">
              <span class="text-gray-500">防禦力</span>
              <span>{{ selectedFullItem.attributes?.def || 0 }}</span>
            </div>
          </div>

          <div class="mt-4 text-left">
            <p class="text-gray-300 text-lg">
              可裝備職業：<span class="text-[#7fff7f]">{{ getEquipClass(selectedFullItem) }}</span>
            </p>
          </div>
        </div>

        <div class="bg-[#3a3530] p-4 border-t border-[#6b6359]">
          <p class="text-gray-500 text-xs mb-2 italic">此物品掉落來源：</p>
          <div class="flex flex-wrap gap-4">
            <div
                v-for="source in selectedFullItem.dropped_by"
                :key="source.monster_id"
                class="flex items-center text-sm text-gray-300"
            >
              <img :src="getMonsterImg(source.monster_id)" class="w-5 h-5">
              {{ source.monster_name }}
              <span class="text-red-500 ml-1">{{ source.rate }}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Transition>

</template>

<style scoped>
button {
  transition: all 0.2s ease;
}

input[type="text"],
input[type="number"] {
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus {
  outline: none;
  border-color: #fbbf24;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
}

.statsColor {
  font-weight: bold;
  color: #d2851d;
}

/* page-mode 不需要固定高度，由 window scroll 控制 */

/* 展開動畫 */
.expand-wrapper {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.3s ease-in-out, opacity 0.2s ease;
  overflow: hidden;
}

.expand-content {
  min-height: 0;
}

.expand-enter-from,
.expand-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  grid-template-rows: 1fr;
  opacity: 1;
}

li {
  transition: background-color 0.3s ease;
}

.whitespace-pre-line {
  white-space: pre-line;
}

/* Modal 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal 縮放動畫 */
.animate-scale-up {
  animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>