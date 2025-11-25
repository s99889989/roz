<script setup>
import {ref, computed} from "vue"
import {initFlowbite} from "flowbite";
import {monstersData3} from "~/assets/data/monsters3.js";
import { VirtualScroll } from 'vue3-virtual-scroll'
import 'vue3-virtual-scroll/dist/style.css'

//排序切換
const sortAsc = ref(false) // true = 小→大, false = 大→小

// 搜尋輸入
const search = ref("")
const minLevel = ref("")
const maxLevel = ref("")

// 選取標籤（屬性 / 種族 / 大小）
const selectedElement = ref(['all'])
const selectedRace = ref(['all'])
const selectedSize = ref(['all'])

onMounted(() => {
  initFlowbite()
})

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
  {id: "龍族", name: "龍族", icon: "/assets/race/dragon.png"},
  {id: "不死", name: "不死", icon: "/assets/race/undead.png"},
  {id: "人形", name: "人形", icon: "/assets/race/undead.png"}
]

const sizeList = [
  {id: "all", name: "ALL", icon: "/assets/size/small.png"},
  {id: "小型", name: "小型", icon: "/assets/size/small.png"},
  {id: "中型", name: "中型", icon: "/assets/size/medium.png"},
  {id: "大型", name: "大型", icon: "/assets/size/large.png"},
]

// ✅ 怪物資料
const monsters = ref(monstersData3);

// ✅ 過濾結果
const filteredMonsters = computed(() => {
  return monsters.value.filter(m => {
    // ✅ 名稱 / 地圖搜尋
    // 改良版：trim + toLowerCase + 防空值檢查
    const q = (search.value || "").trim().toLowerCase();

    const matchesName =
        q === "" ||
        (m.name.zh_tw && m.name.zh_tw.includes(q)) ||
        (Array.isArray(m.spawns) &&
            m.spawns.some(loc =>
                (loc.map_name && loc.map_name.toLowerCase().includes(q))
            ));

    // ✅ 等級範圍
    const matchesLevel =
        (!minLevel.value || m.basic_info.level >= parseInt(minLevel.value)) &&
        (!maxLevel.value || m.basic_info.level <= parseInt(maxLevel.value))

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

     return matchesName && matchesLevel && matchesElement && matchesRace && matchesSize
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

// ✅ 切換種族
function toggleRace(id) {
// 如果點擊 ALL
  // 如果有選 ALL，先清除
  if (id === 'all') {
    selectedRace.value = ['all']
    return
  }

  // 如果列表包含 ALL，先移除 ALL
  if (selectedRace.value.includes('all')) {
    selectedRace.value = []
  }

  // ✅ 如果已存在 → 取消選取
  if (selectedRace.value.includes(id)) {
    selectedRace.value = selectedRace.value.filter(e => e !== id)
  } else {
    // 加入新選項
    selectedRace.value.push(id)
  }

  //如果空 → 設置為all
  if (selectedRace.value.length === 0) {
    selectedRace.value.push('all')
  }
}

// ✅ 切換體型
function toggleSize(id) {
// 如果點擊 ALL
  // 如果有選 ALL，先清除
  if (id === 'all') {
    selectedSize.value = ['all']
    return
  }

  // 如果列表包含 ALL，先移除 ALL
  if (selectedSize.value.includes('all')) {
    selectedSize.value = []
  }

  // ✅ 如果已存在 → 取消選取
  if (selectedSize.value.includes(id)) {
    selectedSize.value = selectedSize.value.filter(e => e !== id)
  } else {
    // 加入新選項
    selectedSize.value.push(id)
  }

  //如果空 → 設置為all
  if (selectedSize.value.length === 0) {
    selectedSize.value.push('all')
  }
}

// ✅ 切換屬性
function toggleElement(id) {

  // 如果點擊 ALL
  // 如果有選 ALL，先清除
  if (id === 'all') {
    selectedElement.value = ['all']
    return
  }

  // 如果列表包含 ALL，先移除 ALL
  if (selectedElement.value.includes('all')) {
    selectedElement.value = []
  }

  // ✅ 如果已存在 → 取消選取
  if (selectedElement.value.includes(id)) {
    selectedElement.value = selectedElement.value.filter(e => e !== id)
  } else {
    // 加入新選項
    selectedElement.value.push(id)
  }

  //如果空 → 設置為all
  if (selectedElement.value.length === 0) {
    selectedElement.value.push('all')
  }

}

// 清除所有篩選
function clearFilters() {
  search.value = ""
  minLevel.value = ""
  maxLevel.value = ""
  selectedElement.value = ['all']
  selectedRace.value = ['all']
  selectedSize.value = ['all']


}

function displayValue(value) {
  // 如果可以轉成數字，且不是 NaN，就做千分位格式化
  if (!isNaN(value)) {
    return Number(value).toLocaleString();
  }

  // 否則當字串回傳
  return value;
}

function selectMap(value) {
  search.value = value
  minLevel.value = ""
  maxLevel.value = ""
  selectedElement.value = ['all']
  selectedRace.value = ['all']
  selectedSize.value = ['all']

}

const getMasterImg = (id) => new URL(`/assets/images/monsters/${id}.gif`, import.meta.url).href;
const getItemImg = (id) => new URL(`/assets/images/items/${id}.gif`, import.meta.url).href;


function getImage(path) {
  return new URL(`/assets${path}`, import.meta.url).href
}

</script>

<template>
  <!--   bg-[#3a2c1f]-->
  <div class="p-4 text-white min-h-screen">

    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-yellow-400">搜尋</h1>

    </div>

    <!-- 搜尋區 -->
    <div class="mb-4 grid gap-2">
      <div class="flex mb-2 flex-wrap gap-2">
        <input
            v-model="search"
            type="text"
            placeholder="輸入怪物名稱..."
            class="bg-[#2b1e12] w-1/2 border border-yellow-600 rounded px-3 py-2 text-white placeholder-gray-400"
        />

        <button
            @click="clearFilters"
            class="bg-[#2b1e12] hover:bg-red-700 px-4 py-2 rounded text-sm font-bold"
        >
          清除篩選條件
        </button>
      </div>


      <div class="flex items-center gap-2">
        <span class="text-xl text-yellow-400 font-bold">等級：</span>
        <input
            v-model="minLevel"
            type="number"
            class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white"
            placeholder="MIN"
        >
        <span>-</span>
        <input
            v-model="maxLevel"
            type="number"
            class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white"
            placeholder="MAX"
        >
        <button
            @click="sortAsc = !sortAsc"
            class="bg-[#2b1e12] hover:bg-red-700 px-4 py-2 rounded text-sm font-bold"
        >
          切換排序
        </button>
      </div>
    </div>

    <!-- 種族篩選 -->
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <h3 class="text-yellow-400 font-bold mb-2">種族</h3>
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
        <h3 class="text-yellow-400 font-bold mb-2">屬性</h3>
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
        <h3 class="text-yellow-400 font-bold mb-2">大小</h3>
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
        :grid="4"
        :rowKey="id"
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
                src="~/assets/image/icon/map.png"
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

<!--          <img :src="getMasterImg(m.image_url)" alt="" class="w-full h-12 object-contain mb-3 rounded">-->
<!--          <img src="~/assets/images/monsters/1283.gif" alt="" class="w-full h-12 object-contain mb-3 rounded">-->
          <img :src="getMasterImg(m.id)" alt="" class="w-full h-12 object-contain mb-3 rounded">
<!--          <h2 class="font-bold text-lg text-yellow-800">{{ m.image_url }}</h2>-->
          <h2 class="font-bold text-lg text-yellow-800">{{ m.name.zh_tw }}</h2>
          <h2 class="text-xs text-gray-500">{{ m.id }}</h2>
          <h2 class="text-xs text-gray-500">{{ m.name.en }}</h2>

          <p class="text-sm flex justify-center"><strong>血量：</strong><span
              class="statsColor">{{ displayValue(m.stats.hp) }}</span></p>
          <p class="text-sm flex justify-center"><strong>經驗值：</strong><span
              class="statsColor">{{ displayValue(m.stats.exp.base) }}</span></p>
          <p class="text-sm flex justify-center"><strong>職業經驗值：</strong><span
              class="statsColor">{{ displayValue(m.stats.exp.job) }}</span></p>
          <p class="text-sm flex justify-center"><strong>攻擊力：</strong><span class="statsColor">{{
              m.stats.attack_power
            }}</span></p>
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
<!--                <img :src="getItemImg(drop.item_id)" alt="" class="w-5 h-5">-->
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