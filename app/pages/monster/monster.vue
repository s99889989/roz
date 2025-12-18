<script setup>
import {ref, computed} from "vue"
import {initFlowbite} from "flowbite";
import {monstersData3} from "~/assets/data/monsters3.js";
import {monstersDisplayIndex} from "~/assets/data/monsters_display_index.js";
import { VirtualScroll } from 'vue3-virtual-scroll'
import 'vue3-virtual-scroll/dist/style.css'

// ✅ 怪物資料
const monsters1 = ref(monstersDisplayIndex);
const monsters = ref(monstersData3);

//排序切換
const sortAsc = ref(false) // true = 小→大, false = 大→小

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

// 選取標籤（類型 / 屬性 / 種族 / 大小）
const selectedType = ref(['all'])
const selectedElement = ref(['all'])
const selectedRace = ref(['all'])
const selectedSize = ref(['all'])

onMounted(() => {
  initFlowbite()
})

const typeList = [
  {id: "all", name: "ALL", icon: "/assets/element/neutral.png"},
  {id: "common", name: "一般", icon: "/assets/element/neutral.png"},
  {id: "mini", name: "MINI", icon: "/assets/element/neutral.png"},
  {id: "MVP", name: "MVP", icon: "/assets/element/neutral.png"},
]

// ✅ icon/項目列表
const elementList = [
  {id: "all", name: "ALL", icon: "/assets/element/neutral.png"},
  {id: "無", name: "無", icon: "/assets/element/neutral.png"},
  {id: "水", name: "水", icon: "/assets/element/water.png"},
  {id: "地", name: "地", icon: "/assets/element/earth.png"},
  {id: "火", name: "火", icon: "/assets/element/fire.png"},
  {id: "風", name: "風", icon: "/assets/element/wind.png"},
  {id: "毒", name: "毒", icon: "/assets/element/poison.png"},
  {id: "聖", name: "聖", icon: "/assets/element/holy.png"},
  {id: "暗", name: "暗", icon: "/assets/element/shadow.png"},
  {id: "念", name: "念", icon: "/assets/element/ghost.png"},
  {id: "不死", name: "不死", icon: "/assets/element/undead.png"},
]

const raceList = [
  {id: "all", name: "ALL", icon: "/assets/race/formless.png"},
  {id: "無形", name: "無形", icon: "/assets/race/formless.png"},
  {id: "植物", name: "植物", icon: "/assets/race/plant.png"},
  {id: "動物", name: "動物", icon: "/assets/race/brute.png"},
  {id: "昆蟲", name: "昆蟲", icon: "/assets/race/insect.png"},
  {id: "魚貝", name: "魚貝", icon: "/assets/race/fish.png"},
  {id: "惡魔", name: "惡魔", icon: "/assets/race/demon.png"},
  {id: "天使", name: "天使", icon: "/assets/race/angel.png"},
  {id: "龍", name: "龍族", icon: "/assets/race/dragon.png"},
  {id: "不死", name: "不死", icon: "/assets/race/undead.png"},
  {id: "人形", name: "人形", icon: "/assets/race/undead.png"}
]

const sizeList = [
  {id: "all", name: "ALL", icon: "/assets/size/small.png"},
  {id: "小型", name: "小型", icon: "/assets/size/small.png"},
  {id: "中型", name: "中型", icon: "/assets/size/medium.png"},
  {id: "大型", name: "大型", icon: "/assets/size/large.png"},
]



// ✅ 過濾結果
const filteredMonsters = computed(() => {

  let monstersArray = Object.values(monsters1.value);

  return monstersArray.filter(m => {
    // ✅ 名稱 / 地圖搜尋
    // 改良版：trim + toLowerCase + 防空值檢查
    const q = (search.value || "").trim().toLowerCase();

    const matchesName =
        q === "" ||
        (m.name.zh_tw && m.name.zh_tw.includes(q)) ||
        // 只有在 itemSearch 為 true 時，才會檢查掉落物
        (itemSearch.value && m.drops && m.drops.some(it => it.name.includes(q))) ||
        (Array.isArray(m.spawns) &&
            m.spawns.some(loc =>
                (loc.map_name && loc.map_name.toLowerCase().includes(q))
            ));

    // ✅ 等級範圍
    const matchesLevel =
        (!minLevel.value || m.basic_info.level >= parseInt(minLevel.value)) &&
        (!maxLevel.value || m.basic_info.level <= parseInt(maxLevel.value))

    // ✅ 血量範圍
    const matchesHP =
        (!minHP.value || m.stats.hp >= parseInt(minHP.value)) &&
        (!maxHP.value || m.stats.hp <= parseInt(maxHP.value))

    // ✅ 命中範圍
    const matchesHit =
        (!minHit.value || m.stats.hit_100_percent >= parseInt(minHit.value)) &&
        (!maxHit.value || m.stats.hit_100_percent <= parseInt(maxHit.value))

    // ✅ 迴避範圍
    const matchesFlee =
        (!minFlee.value || m.stats.flee_95_percent >= parseInt(minFlee.value)) &&
        (!maxFlee.value || m.stats.flee_95_percent <= parseInt(maxFlee.value))

    // ✅ 類型篩選
    const matchesType =
        selectedType.value.length === 0 ||
        selectedType.value.includes("all") ||
        selectedType.value.some(t => {
          if(m.special_status.includes(t)){
            return true;
          }else {
            if(selectedType.value.includes("common")){
              if(!m.special_status.includes('mini') && !m.special_status.includes('MVP')){
                return true;
              }
            }
          }


          return false;
        })


    // ✅ 屬性篩選
    const matchesElement =
        selectedElement.value.length === 0 ||
        selectedElement.value.includes("all") ||
        selectedElement.value.some(e => m.basic_info.element.type.includes(e))

    // ✅ 種族篩選
    const matchesRace =
        selectedRace.value.length === 0 ||
        selectedRace.value.includes("all") ||
        selectedRace.value.some(r => m.basic_info.race.includes(r))

    // ✅ 大小篩選
    const matchesSize =
        selectedSize.value.length === 0 ||
        selectedSize.value.includes("all") ||
        selectedSize.value.includes(m.basic_info.size+'型')

    return matchesName && matchesLevel && matchesHP && matchesHit && matchesFlee && matchesElement && matchesRace && matchesSize && matchesType
  })
      // ✅ 排序 (依 sortAsc)
      .sort((a, b) => sortAsc.value
          ? a.basic_info.level - b.basic_info.level  // 小 → 大
          : b.basic_info.level - a.basic_info.level  // 大 → 小
      )


})

watch(filteredMonsters, () => {
  nextTick(() => {
    initFlowbite()
  })
})

const getAttack = (min, max) => {
  if(min === max){
    return min;
  }
  return min+'-'+max;
}

/**
 * 核心通用切換邏輯 (支援單選/多選切換)
 * @param {String} id - 點擊的項目 ID
 * @param {Ref} selectedRef - 傳入對應的 Vue ref 陣列
 */
function handleToggle(id, selectedRef) {
  // 取得當前陣列的副本，操作完再放回去，確保 Vue 響應式觸發
  let currentSelection = [...selectedRef.value];

  // --- 情況 A：單選模式 (selectMode.value = false) ---
  if (!selectMode.value) {
    if (id === 'all' || currentSelection.includes(id)) {
      // 點擊 ALL 或 點擊已選中的項目 -> 回歸 ALL
      selectedRef.value = ['all'];
    } else {
      // 點擊新項目 -> 直接取代
      selectedRef.value = [id];
    }
    return;
  }

  // --- 情況 B：多選模式 (selectMode.value = true) ---
  if (id === 'all') {
    // 點擊 ALL -> 清空其他，只留 ALL
    selectedRef.value = ['all'];
    return;
  }

  // 如果原本是 ALL，現在點擊具體項目 -> 先移除 ALL
  if (currentSelection.includes('all')) {
    currentSelection = [];
  }

  // 執行切換 (存在就移除，不存在就加入)
  if (currentSelection.includes(id)) {
    currentSelection = currentSelection.filter(item => item !== id);
  } else {
    currentSelection.push(id);
  }

  // 如果操作完變空了，或是手動取消到沒東西 -> 自動回歸 ALL
  if (currentSelection.length === 0) {
    currentSelection = ['all'];
  }

  // 最後統一賦值
  selectedRef.value = currentSelection;
}
// ✅ 切換種族
const toggleRace = (id) => handleToggle(id, selectedRace);

// ✅ 切換體型
const toggleSize = (id) => handleToggle(id, selectedSize);

// ✅ 切換類型
const toggleType = (id) => handleToggle(id, selectedType);

// ✅ 切換屬性
const toggleElement = (id) => handleToggle(id, selectedElement);//

// 清除所有篩選
function clearFilters() {
  search.value = ""
  minLevel.value = ""
  maxLevel.value = ""
  selectedType.value = ['all']
  selectedElement.value = ['all']
  selectedRace.value = ['all']
  selectedSize.value = ['all']


}

//數值
function displayValue(value) {
  // 如果可以轉成數字，且不是 NaN，就做千分位格式化
  if (!isNaN(value)) {
    return Number(value).toLocaleString();
  }

  // 否則當字串回傳
  return value;
}

//選擇地圖
function selectMap(value) {
  search.value = value
  minLevel.value = ""
  maxLevel.value = ""
  selectedType.value = ['all']
  selectedElement.value = ['all']
  selectedRace.value = ['all']
  selectedSize.value = ['all']

}
const getMonsterImg = (id) => {
  // return `https://assets.twroz.wiki/images/wearing/${id}_b.png`
  return `/images/monsters/${id}.gif`
}

// 控制進階搜尋開關的狀態，預設為關閉 (false)
const isAdvanced = ref(false);
// 點擊切換進階搜尋
const toggleAdvanced = () => {
  isAdvanced.value = !isAdvanced.value;
};
//物品搜尋
const itemSearch = ref(false);
// 點擊切換物品搜尋
const toggleItemSearch = () => {
  itemSearch.value = !itemSearch.value;
};
//選擇模式
const selectMode = ref(false);
// 點擊切換選擇模式
const toggleSelectMode = () => {
  selectMode.value = !selectMode.value;
};
</script>

<template>
  <!--   bg-[#3a2c1f]-->
  <div class="p-4 text-white min-h-screen">

    <div class="mb-4 flex justify-start items-center">
      <h1 class="text-2xl font-bold text-yellow-400 me-4">搜尋</h1>
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
          <input
              v-model="minLevel"
              type="number"
              class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
              placeholder="MIN"
          >
          <span class="text-yellow-600">-</span>
          <input
              v-model="maxLevel"
              type="number"
              class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
              placeholder="MAX"
          >
          <button
              @click="sortAsc = !sortAsc"
              class="ml-2 bg-[#2b1e12] hover:bg-red-700 px-3 py-1 rounded text-xs font-bold text-white border border-red-900 transition-colors whitespace-nowrap"
          >
            切換排序
          </button>
        </div>

        <div class="flex items-center gap-2 justify-start">
          <span class="text-xl text-yellow-400 font-bold whitespace-nowrap">血量：</span>
          <input
              v-model="minHP"
              type="number"
              class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
              placeholder="MIN"
          >
          <span class="text-yellow-600">-</span>
          <input
              v-model="maxHP"
              type="number"
              class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
              placeholder="MAX"
          >
        </div>

        <div class="flex items-center gap-2 justify-start">
          <span class="text-xl text-yellow-400 font-bold whitespace-nowrap">迴避：</span>
          <input
              v-model="minFlee"
              type="number"
              class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
              placeholder="MIN"
          >
          <span class="text-yellow-600">-</span>
          <input
              v-model="maxFlee"
              type="number"
              class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
              placeholder="MAX"
          >
        </div>

        <div class="flex items-center gap-2 justify-start">
          <span class="text-xl text-yellow-400 font-bold whitespace-nowrap">命中：</span>
          <input
              v-model="minHit"
              type="number"
              class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
              placeholder="MIN"
          >
          <span class="text-yellow-600">-</span>
          <input
              v-model="maxHit"
              type="number"
              class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white focus:border-yellow-400 outline-none"
              placeholder="MAX"
          >
        </div>

      </div>

    </div>

    <!-- 結果統計 -->
    <div class="mb-4 p-3 bg-[#2b1e12] border border-yellow-600 rounded">
      <span class="text-yellow-400 font-bold">搜尋結果：</span>
      <span class="text-white">共 {{ filteredMonsters.length }} 隻怪物</span>
    </div>

    <!-- 怪物結果 -->
    <VirtualScroll
        :list="filteredMonsters"
        :item-height="200"
        :bufferCount = "25"
        :grid="1"
        :rowKey="id"
        class="md:hidden"
    >
      <template #default="{ item: m, index }">
        <div class="m-2 bg-[#f0e4d6] rounded p-4 text-black shadow-lg hover:shadow-xl transition-all">

          <div class="flex justify-between">
            <!-- 圖片觸發 dropdown -->
            <img
                :id="'dropdownHoverButtonO' + m.id"
                :data-dropdown-toggle="'dropdownHoverO' + m.id"
                data-dropdown-placement="right"
                data-dropdown-trigger="hover"
                :src="`/images/icon/map.png`"
                alt="map icon"
                class="w-10 h-10 cursor-pointer"
            />

            <!-- Dropdown menu -->
            <div
                :id="'dropdownHoverO' + m.id"
                class="z-10 hidden bg-black rounded-xs shadow-sm"
            >
              <ul class="py-1 text-sm text-gray-200"
                  :aria-labelledby="'dropdownHoverButtonO'+m.id" v-for="map in m.spawns">
                <li @click="selectMap(map.map_name)" class=" hover:bg-gray-600 pointer cursor-pointer">
                  <a class=" px-2 py-1 w-full hover:text-white">
                    {{ map.description }}({{ map.map_name }})
                  </a>
                </li>

              </ul>
            </div>


            <div class="flex h-6">
              <p style="border-radius: 2px" class="bg-[#DCD692] text-xs pt-1 ps-2 pe-2 me-1">{{ m.basic_info.race }}</p>
              <p style="border-radius: 2px" class="bg-[#C5DCBC] text-xs pt-1 ps-2 pe-2 me-1">{{m.basic_info.element.type}}</p>
              <p style="border-radius: 2px" class="bg-[#DCD6B8] text-xs pt-1 ps-2 pe-2">{{ m.basic_info.size }}</p>
            </div>

          </div>

          <img :src="getMonsterImg(m.id)" alt="" class="w-full h-12 object-contain mb-3 rounded">
          <h2 class="font-bold text-lg text-yellow-800">{{ m.name.zh_tw }}</h2>
          <h2 class="text-xs text-gray-500">{{ m.id }}</h2>
          <h2 class="text-xs text-gray-500">{{ m.name.en }}</h2>

          <p class="text-sm flex justify-center"><strong>等級：</strong><span
              class="statsColor">{{ displayValue(m.basic_info.level) }}</span></p>
          <p class="text-sm flex justify-center"><strong>血量：</strong><span
              class="statsColor">{{ displayValue(m.stats.hp) }}</span></p>
          <p class="text-sm flex justify-center"><strong>經驗值：</strong><span
              class="statsColor">{{ displayValue(m.stats.exp.base) }}</span></p>
          <p class="text-sm flex justify-center"><strong>職業經驗值：</strong><span
              class="statsColor">{{ displayValue(m.stats.exp.job) }}</span></p>
          <p class="text-sm flex justify-center"><strong>攻擊力：</strong><span class="statsColor">
            {{getAttack(m.stats.attack.min, m.stats.attack.max)}}
          </span></p>
          <p class="text-sm flex justify-center"><strong>物理防禦：</strong><span
              class="statsColor">{{ m.stats.defense }}</span></p>
          <p class="text-sm flex justify-center"><strong>魔法防禦：</strong><span
              class="statsColor">{{ m.stats.magic_defense }}</span></p>
          <p class="text-sm flex justify-center"><strong>100%命中：</strong><span
              class="statsColor">{{ m.stats.hit_100_percent }}</span></p>
          <p class="text-sm flex justify-center"><strong>95%迴避：</strong><span
              class="statsColor">{{ m.stats.flee_95_percent }}</span></p>

          <hr class="my-3 border-yellow-700">

          <h3 class="font-bold text-yellow-700 mb-2">掉落物品</h3>
          <ul class="text-sm">
            <li v-for="drop in m.drops" :key="drop.item" class="flex justify-between">
              <div class="flex">
                <img :src="`/${drop.icon_url}`" alt="" class="w-5 h-5">
                <span>{{ drop.name }}</span>
              </div>
              <span class="text-red-600 font-bold">{{ drop.rate }}%</span>
            </li>

          </ul>

        </div>


      </template>
    </VirtualScroll>

    <VirtualScroll
        :list="filteredMonsters"
        :item-height="200"
        :bufferCount = "25"
        :grid="4"
        :rowKey="id"
        class="md:block"
    >
      <template #default="{ item: m, index }">
        <div class="m-2 bg-[#f0e4d6] rounded p-4 text-black shadow-lg hover:shadow-xl transition-all">

          <div class="flex justify-between">
            <!-- 圖片觸發 dropdown -->
            <img
                :id="'dropdownHoverButton' + m.id"
                :data-dropdown-toggle="'dropdownHover' + m.id"
                data-dropdown-placement="right"
                data-dropdown-trigger="hover"
                :src="`/images/icon/map.png`"
                alt="map icon"
                class="w-10 h-10 cursor-pointer"
            />

            <!-- Dropdown menu -->
            <div
                :id="'dropdownHover' + m.id"
                class="z-10 hidden bg-black rounded-xs shadow-sm"
            >
              <ul class="py-1 text-sm text-gray-200"
                  :aria-labelledby="'dropdownHoverButton'+m.id" v-for="map in m.spawns">
                <li @click="selectMap(map.map_name)" class=" hover:bg-gray-600 pointer cursor-pointer">
                  <a class=" px-2 py-1 w-full hover:text-white">
                    {{ map.description }}({{ map.map_name }})
                  </a>
                </li>

              </ul>
            </div>


            <div class="flex h-6">
              <p style="border-radius: 2px" class="bg-[#DCD692] text-xs pt-1 ps-2 pe-2 me-1">{{ m.basic_info.race }}</p>
              <p style="border-radius: 2px" class="bg-[#C5DCBC] text-xs pt-1 ps-2 pe-2 me-1">{{m.basic_info.element.type}}</p>
              <p style="border-radius: 2px" class="bg-[#DCD6B8] text-xs pt-1 ps-2 pe-2">{{ m.basic_info.size }}</p>
            </div>

          </div>

          <img :src="getMonsterImg(m.id)" alt="" class="w-full h-12 object-contain mb-3 rounded">
          <h2 class="font-bold text-lg text-yellow-800">{{ m.name.zh_tw }}</h2>
          <h2 class="text-xs text-gray-500">{{ m.id }}</h2>
          <h2 class="text-xs text-gray-500">{{ m.name.en }}</h2>

          <p class="text-sm flex justify-center"><strong>等級：</strong><span
              class="statsColor">{{ displayValue(m.basic_info.level) }}</span></p>
          <p class="text-sm flex justify-center"><strong>血量：</strong><span
              class="statsColor">{{ displayValue(m.stats.hp) }}</span></p>
          <p class="text-sm flex justify-center"><strong>經驗值：</strong><span
              class="statsColor">{{ displayValue(m.stats.exp.base) }}</span></p>
          <p class="text-sm flex justify-center"><strong>職業經驗值：</strong><span
              class="statsColor">{{ displayValue(m.stats.exp.job) }}</span></p>
          <p class="text-sm flex justify-center"><strong>攻擊力：</strong><span class="statsColor">
            {{getAttack(m.stats.attack.min, m.stats.attack.max)}}
          </span></p>
          <p class="text-sm flex justify-center"><strong>物理防禦：</strong><span
              class="statsColor">{{ m.stats.defense }}</span></p>
          <p class="text-sm flex justify-center"><strong>魔法防禦：</strong><span
              class="statsColor">{{ m.stats.magic_defense }}</span></p>
          <p class="text-sm flex justify-center"><strong>100%命中：</strong><span
              class="statsColor">{{ m.stats.hit_100_percent }}</span></p>
          <p class="text-sm flex justify-center"><strong>95%迴避：</strong><span
              class="statsColor">{{ m.stats.flee_95_percent }}</span></p>

          <hr class="my-3 border-yellow-700">

          <h3 class="font-bold text-yellow-700 mb-2">掉落物品</h3>
          <ul class="text-sm">
            <li v-for="drop in m.drops" :key="drop.item" class="flex justify-between">
              <div class="flex">
                <img :src="`/${drop.icon_url}`" alt="" class="w-5 h-5">
                <span>{{ drop.name }}</span>
              </div>
              <span class="text-red-600 font-bold">{{ drop.rate }}%</span>
            </li>

          </ul>

        </div>


      </template>
    </VirtualScroll>

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
</template>

<style scoped>
/* 添加平滑過渡效果 */
button {
  transition: all 0.2s ease;
}

/* 輸入框樣式 */
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

</style>