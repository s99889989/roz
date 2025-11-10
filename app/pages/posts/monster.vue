<script setup>
import { ref, reactive, computed } from "vue"

// 搜尋輸入
const search = ref("")
const minLevel = ref("")
const maxLevel = ref("")

// 選取標籤（屬性 / 種族 / 大小）
const type = reactive({
  selectedElement: ['all']
})
const selectedElement = ref(['all'])
const selectedRace = ref(['all'])
const selectedSize = ref(['all'])

// ✅ icon/項目列表
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
  { id: "龍族", name: "龍族", icon: "/assets/race/dragon.png" },
  { id: "不死", name: "不死", icon: "/assets/race/undead.png" }
]

const sizeList = [
  { id: "all", name: "ALL", icon: "/assets/size/small.png" },
  { id: "小型", name: "小型", icon: "/assets/size/small.png" },
  { id: "中型", name: "中型", icon: "/assets/size/medium.png" },
  { id: "大型", name: "大型", icon: "/assets/size/large.png" },
]

// ✅ 怪物資料（示範用）
const monsters = ref([
  {
    id: 1283,
    name: "凱美拉",
    level: 125,
    race: ["惡魔"],
    element: ["地"],
    size: "大型",
    image: "/_nuxt/assets/image/monster/1283.gif",
    drops: [
      { item: "金塊", rate: 0.18 },
      { item: "龍角", rate: 12.85 },
    ]
  },
  {
    id: 1002,
    name: "波利",
    level: 1,
    race: ["植物"],
    element: ["水"],
    size: "中型",
    image: "/_nuxt/assets/image/monster/1002.gif",
    drops: [
      { item: "蘋果", rate: 15.0 },
      { item: "粘膠", rate: 30.0 },
    ]
  },
  {
    id: 1031,
    name: "惡魔波利",
    level: 34,
    race: ["惡魔"],
    element: ["暗"],
    size: "中型",
    image: "/assets/image/monster/1031.gif",
    drops: [
      { item: "惡魔角", rate: 5.0 },
      { item: "暗影珠", rate: 8.0 },
    ]
  }
])

const monsters2 = ref([
  {
    "monster_name_zh": "血腥騎士",
    "monster_name_en": "BLOODY_KNIGHT",
    "monster_id": 1268,
    "image_url": "https://assets.twroz.wiki/images/monsters/1268.gif?w=80&h=80&auto=compress&format=webp",
    "attributes": {
      "race": "無形",
      "element": "暗屬性4",
      "size": "大型"
    },
    "stats": {
      "level": 116,
      "hp": 68500,
      "base_exp": "???",
      "job_exp": "???",
      "attack_power": "1,303-1,831",
      "physical_defense_def": 122,
      "magic_defense_mdef": 50,
      "hit_100_percent": 384,
      "flee_95_percent": 438
    },
    "spawn_location": {
      "map_name_zh": "騎士團2樓",
      "map_code": "gl_knt02"
    },
    "drops": [
      {
        "item_name_zh": "亞藍斯之劍",
        "rate_percent": 0.01,
        "item_image_url": "https://assets.twroz.wiki/images/items/1170.gif?w=24&h=24&auto=compress&format=webp"
      },
      {
        "item_name_zh": "鐮戟[1]",
        "rate_percent": 0.01,
        "item_image_url": "https://assets.twroz.wiki/images/items/1417.gif?w=24&h=24&auto=compress&format=webp"
      },
      {
        "item_name_zh": "金屬頭盔[1]",
        "rate_percent": 0.23,
        "item_image_url": "https://assets.twroz.wiki/images/items/2229.gif?w=24&h=24&auto=compress&format=webp"
      },
      {
        "item_name_zh": "布里刊",
        "rate_percent": 24.25,
        "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
      },
      {
        "item_name_zh": "血腥騎士卡片",
        "rate_percent": 0.01,
        "item_image_url": "https://assets.twroz.wiki/images/items/27275.gif?w=24&h=24&auto=compress&format=webp"
      }
    ]
  }
])

// ✅ 過濾結果
const filteredMonsters = computed(() => {
  return monsters.value.filter(m => {
    // 名稱搜尋
    const matchesName = search.value === "" || m.name.includes(search.value)

    // 等級範圍
    const matchesLevel =
        (!minLevel.value || m.level >= parseInt(minLevel.value)) &&
        (!maxLevel.value || m.level <= parseInt(maxLevel.value))

    // 屬性篩選
    const matchesElement =
        selectedElement.value.length === 0 ||
        selectedElement.value.includes("all") ||
        selectedElement.value.some(e => m.element.includes(e))

    // 種族篩選
    const matchesRace =
        selectedRace.value.length === 0 ||
        selectedRace.value.includes("all") ||
        selectedRace.value.some(r => m.race.includes(r))

    // 大小篩選
    const matchesSize =
        selectedSize.value.length === 0 ||
        selectedSize.value.includes("all") ||
        selectedSize.value.includes(m.size)

    return matchesName && matchesLevel && matchesElement && matchesRace && matchesSize
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
  if(selectedRace.value.length === 0){
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
  if(selectedSize.value.length === 0){
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
  if(selectedElement.value.length === 0){
    selectedElement.value.push('all')
  }

}

// 清除所有篩選
function clearFilters() {
  search.value = ""
  minLevel.value = ""
  maxLevel.value = ""
  selectedElement.value = []
  selectedRace.value = []
  selectedSize.value = []
}
</script>

<template>
  <div class="p-4 text-white bg-[#3a2c1f] min-h-screen">

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
    <div class="grid md:grid-cols-4 gap-4 mt-6">
      <div v-for="m in filteredMonsters" :key="m.id"
           class="bg-[#f0e4d6] rounded p-4 text-black shadow-lg hover:shadow-xl transition-all hover:scale-105">
        <img :src="m.image" alt="" class="w-full h-12 object-contain mb-3 rounded">

        <h2 class="font-bold text-lg text-yellow-800">{{ m.name }}</h2>
        <p class="text-sm"><strong>等級：</strong>{{ m.level }}</p>
        <p class="text-sm"><strong>種族：</strong>{{ m.race.join('、') }}</p>
        <p class="text-sm"><strong>屬性：</strong>{{ m.element.join('、') }}</p>
        <p class="text-sm"><strong>大小：</strong>{{ m.size }}</p>

        <hr class="my-3 border-yellow-700">

        <h3 class="font-bold text-yellow-700 mb-2">💎 掉落物品</h3>
        <ul class="text-sm">
          <li v-for="drop in m.drops" :key="drop.item" class="flex justify-between">
            <span>{{ drop.item }}</span>
            <span class="text-red-600 font-bold">{{ drop.rate }}%</span>
          </li>
        </ul>
      </div>
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
</style>