<template>
  <div class="min-h-screen bg-[#2b1e12] text-white p-6" style="min-width: 100vh; border-radius: 10px">
    <h1 class="text-3xl font-bold text-yellow-400 mb-6">RO 寵物資料圖鑑</h1>

    <!-- 搜尋 + 分類 -->
    <div class="flex flex-col md:flex-row gap-3 mb-6">
<!--      <select-->
<!--          v-model="selectedType"-->
<!--          class="bg-[#3a2c1f] px-4 py-2 rounded border border-gray-500"-->
<!--      >-->
<!--        <option value="">全部種類</option>-->
<!--        <option value="一般寵物">一般寵物</option>-->
<!--        <option value="進化寵物">進化寵物</option>-->
<!--        <option value="MVP寵物">MVP寵物</option>-->
<!--      </select>-->

      <input
          type="text"
          v-model="keyword"
          placeholder="搜尋名稱 / 食物 / 捕捉方式 / 親密度"
          class="flex-1 bg-[#3a2c1f] px-4 py-2 rounded border border-gray-500"
      />
    </div>

    <!-- 寵物清單 -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
          v-for="pet in filteredPets"
          :key="pet.name"
          class="bg-[#3a2c1f] p-5 rounded-lg shadow-lg border border-yellow-500"
      >
        <!-- 寵物圖片 -->
        <div class="flex justify-center">
          <img
              :src="getImg(pet.image)"
              class="w-24 h-24 object-contain drop-shadow-lg mb-3"
              :alt="pet.name"
          />
        </div>

        <h2 class="text-xl text-yellow-300 font-bold text-center">
          {{ pet.name }}
        </h2>

        <p class="text-center opacity-90 mt-1 text-sm">
          {{ pet.type }}
        </p>

        <div class="mt-3 text-sm leading-relaxed">
          <p>🍖 食物：<span class="text-green-300">{{ pet.food }}</span></p>
          <p>🎯 認養：<span class="text-cyan-300">{{ pet.catch }}</span></p>
          <p>🎒 飾品：{{ pet.accessories }}</p>

          <!-- 親密度 -->
          <p class="mt-2">💗 親密度效果：</p>
          <ul class="ml-4 list-disc text-yellow-200">
            <li v-for="(txt, idx) in pet.intimacy" :key="idx">
              {{ txt }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref, computed} from "vue";

const pets = [
  {
    type: "一般寵物", name: "波利",
    image: "1002", food: "蘋果汁",
    catch: "青澀蘋果", accessories: "寵物書包",
    intimacy: ["有點親密: LUK +2、CRI+1"],
  },
  {
    type: "一般寵物", name: "土波利",
    image: "1113", food: "黃色藥草",
    catch: "濃縮柳橙汁", accessories: "寵物書包",
    intimacy: ["有點親密: HIT+3、ATK+3"],
  },
  {
    type: "一般寵物", name: "波波利",
    image: "1031", food: "綠色藥草",
    catch: "苦味草", accessories: "寵物書包",
    intimacy: ["有點親密: LUK+2、對毒的抗性+10%"],
  },
  {
    type: "一般寵物", name: "瘋兔",
    image: "1063", food: "紅蘿蔔汁",
    catch: "彩色紅蘿蔔", accessories: "寵物髮帶",
    intimacy: ["有點親密: CRI+2、ATK+2"],
  },
  {
    type: "一般寵物", name: "小野豬",
    image: "1167", food: "寵物飼料",
    catch: "魔物牛奶", accessories: "寵物圍兜兜",
    intimacy: ["有點親密: VIT+1、MHP+50"],
  },
  {
    type: "一般寵物", name: "搖滾蝗蟲",
    image: "1088", food: "寵物飼料",
    catch: "呢喃花", accessories: "蝗蟲眼鏡",
    intimacy: ["有點親密: HP恢復力+5%, MHP+ 25"],
  },
  {
    type: "一般寵物", name: "魔菇",
    image: "1014", food: "寵物飼料",
    catch: "青苔", accessories: "樹皮褲",
    intimacy: ["有點親密: HIT+ 5, ATK -2"],
  },
  {
    type: "一般寵物", name: "毒魔菇",
    image: "1077", food: "寵物飼料",
    catch: "青嫩毒草", accessories: "樹皮褲",
    intimacy: ["有點親密: STR+ 1, INt+ 1"],
  },
  {
    type: "一般寵物", name: "寶貝波利",
    image: "2398", food: "蘋果汁",
    catch: "青蘋果", accessories: "",
    intimacy: ["有點親密: HP恢復力+50%"],
  },
  {
    type: "一般寵物", name: "小雞",
    image: "1049", food: "紅色藥草",
    catch: "變態蚯蚓", accessories: "寵物蛋殼帽",
    intimacy: ["有點親密: STR+ 1, ATK+ 5"],
  },
  {
    type: "一般寵物", name: "蒼蠅",
    image: "1011", food: "寵物飼料",
    catch: "腐臭之魚", accessories: "寵物防毒面具",
    intimacy: ["有點親密: AGI+ 1, FLEE+ 2"],
  },
  {
    type: "一般寵物", name: "綠蒼蠅",
    image: "1042", food: "鐵礦石",
    catch: "鏽鐵", accessories: "寵物防毒面具",
    intimacy: ["有點親密: FLEE+ 6, AGI - 1"],
  },
  {
    type: "一般寵物", name: "赤蒼蠅",
    image: "1042", food: "紅色魔力礦石",
    catch: "怪物飲料", accessories: "寵物防毒面具",
    intimacy: ["有點親密: 完全迴避+ 2, FLEE - 5"],
  },
  {
    type: "一般寵物", name: "沙漠幼狼",
    image: "1107", food: "寵物飼料",
    catch: "營養大骨", accessories: "潛水頭盔",
    intimacy: ["有點親密: INT+ 1, MSP+ 50"],
  },
  {
    type: "一般寵物", name: "大嘴鳥",
    image: "1019", food: "寵物飼料",
    catch: "營養蚯蚓", accessories: "變形鍋子",
    intimacy: ["有點親密: MHP+ 150, MSP - 10"],
  },
  {
    type: "一般寵物", name: "狸貓",
    image: "1056", food: "寵物飼料",
    catch: "怪物番薯", accessories: "紅色領巾",
    intimacy: ["有點親密: AGI+ 1, 完全迴避+ 1"],
  },
  {
    type: "一般寵物", name: "溜溜猴",
    image: "1057", food: "香蕉汁",
    catch: "怪物香蕉", accessories: "猴子髮箍",
    intimacy: ["有點親密: CRI+ 3, LUK - 1"],
  },
  {
    type: "一般寵物", name: "畢帝特地龍",
    image: "1155", food: "寵物飼料",
    catch: "閃爍之石", accessories: "寵物髮夾",
    intimacy: ["有點親密: ASPD+ 1%, DEF/MDEF -2"],
  }
];

const keyword = ref("");
const selectedType = ref("");

// 產生圖片路徑
const getImg = (id) => new URL(`/assets/images/monsters/${id}.gif`, import.meta.url).href;

// 搜尋 + 篩選
const filteredPets = computed(() =>
    pets.filter((p) => {
      const matchType = selectedType.value === "" || p.type === selectedType.value;
      const matchKeyword =
          p.name.includes(keyword.value) ||
          p.food.includes(keyword.value) ||
          p.catch.includes(keyword.value) ||
          p.intimacy.some((t) => t.includes(keyword.value));

      return matchType && matchKeyword;
    })
);
</script>
