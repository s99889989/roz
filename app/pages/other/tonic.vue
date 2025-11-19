<script setup>
import { ref, computed } from "vue";

// =========================
// 🧪 資料區 HP 補品
// =========================
const hpItems = ref([
  { name: "蕃薯", weight: 2, price: 15, avg: 53.02, base: 18.16 },
  { name: "紅蘿蔔", weight: 2, price: 15, avg: 53.2, base: 18.22 },
  { name: "香蕉", weight: 2, price: 15, avg: 53.44, base: 18.3 },
  { name: "蘋果", weight: 2, price: 15, avg: 53.94, base: 18.47 },
  { name: "南瓜", weight: 2, price: 15, avg: 55.01, base: 18.84 },
  { name: "紅色藥草", weight: 3, price: null, avg: 64.59, base: 22.12 },
  { name: "紅蘿蔔汁", weight: 4, price: null, avg: 84.54, base: 28.95 },
  { name: "香蕉汁", weight: 4, price: null, avg: 85.83, base: 29.39 },
  { name: "蘋果汁", weight: 3, price: null, avg: 86.02, base: 29.46 },
  { name: "牛奶", weight: 3, price: 25, avg: 90.81, base: 31.1 },
  { name: "生魚片", weight: 3, price: 35, avg: 119.1, base: 40.79 },
  { name: "黃色藥草", weight: 5, price: null, avg: 138.12, base: 47.3 },
  { name: "糖果", weight: 3, price: null, avg: 158.03, base: 54.12 },
  { name: "明蝦壽司", weight: 5, price: 70, avg: 158.83, base: 54.39 },
  { name: "紅色藥水", weight: 7, price: 50, avg: 159.44, base: 54.6 },
  { name: "寵物飼料", weight: 1, price: 1000, avg: 201.38, base: 68.97 },
  { name: "肉", weight: 15, price: 50, avg: 245.07, base: 83.92 },
  { name: "蜂蜜", weight: 10, price: null, avg: 246.8, base: 84.5 },
  { name: "魔物飼料", weight: 15, price: 60, avg: 262.88, base: 90.02 },
  { name: "白色藥草", weight: 7, price: null, avg: 281.93, base: 96.55 },
  { name: "柺杖糖", weight: 4, price: null, avg: 363.17, base: 124.37 },
  { name: "赤色藥水", weight: 10, price: 200, avg: 363.34, base: 124.43 },
  { name: "蝦子", weight: 4, price: 550, avg: 457.77, base: 156.77 },
  { name: "薑餅", weight: 3, price: null, avg: 522.96, base: 179.09 },
  { name: "肉粽", weight: 3, price: null, avg: 584, base: 200 },
  { name: "好吃的魚", weight: 2, price: null, avg: 584, base: 200 },
  { name: "西納雷葉子", weight: 1, price: null, avg: 587.95, base: 201.35 },
  { name: "黃色藥水", weight: 13, price: 550, avg: 597.7, base: 204.69 },
  { name: "小蛋糕", weight: 10, price: null, avg: 871.2, base: 298.36 },
  { name: "蘆薈葉子", weight: 2, price: null, avg: 1048.98, base: 359.24 },
  { name: "白色藥水", weight: 15, price: null, avg: 1059.61, base: 362.88 },
  { name: "纖細白水", weight: 5, price: null, avg: 1064.39, base: 364.52 },
  { name: "蜂膠", weight: 15, price: null, avg: 1064.81, base: 364.66 },
  { name: "瑪絲黛拉果實", weight: 3, price: null, avg: 1456.83, base: 498.91 },
  { name: "排名纖白", weight: 5, price: null, avg: 1594.86, base: 546.18 },
]);

// =========================
// 🔵 SP 補品
// =========================
const spItems = ref([
  { name: "葡萄", weight: 2, price: null, avg: 42.52, base: 11.68 },
  { name: "檸檬", weight: 4, price: null, avg: 51.56, base: 14.16 },
  { name: "葡萄汁", weight: 4, price: null, avg: 70.08, base: 19.25 },
  { name: "藍草", weight: 7, price: null, avg: 80.41, base: 22.09 },
  { name: "蜂蜜", weight: 10, price: null, avg: 102.21, base: 28.08 },
  { name: "蜂膠", weight: 15, price: null, avg: 177.63, base: 48.8 },
  { name: "藍水", weight: 15, price: null, avg: 178.2, base: 48.96 },
]);


// =========================
// 🧮 計算欄位 + 找出效率最佳補品 ⭐
// =========================
function addEfficiencyCalc(list) {
  return list.map(item => ({
    ...item,
    restorePerWeight: (item.base / item.weight).toFixed(2),
    restorePerCost: item.price ? (item.avg / item.price).toFixed(2) : "-"
  }));
}

// 計算後的資料
const hpResult = computed(() => addEfficiencyCalc(hpItems.value));
const spResult = computed(() => addEfficiencyCalc(spItems.value));


// --------------------
// ⭐ 自動找最強補品
// --------------------
function findBest(list, key) {
  return list.reduce((prev, current) =>
      parseFloat(current[key]) > parseFloat(prev[key]) ? current : prev
  );
}

const bestHpWeight = computed(() => findBest(hpResult.value, "restorePerWeight"));
const bestHpCost = computed(() => findBest(hpResult.value, "restorePerCost"));
const bestSpWeight = computed(() => findBest(spResult.value, "restorePerWeight"));
const bestSpCost = computed(() => findBest(spResult.value, "restorePerCost"));


// =========================
// 🔽 表格排序功能
// =========================
const sortDirection = ref("desc");
const sortKey = ref(null);

function sort(table, key) {
  sortKey.value = key;
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";

  table.value.sort((a, b) => {
    const valA = parseFloat(a[key]) || 0;
    const valB = parseFloat(b[key]) || 0;
    return sortDirection.value === "asc" ? valA - valB : valB - valA;
  });
}
</script>


<template>
  <div style="border-radius: 10px" class="p-6 bg-[#3a2c1f] text-white min-h-screen">


    <!-- HP 補品 -->
    <h1 class="text-2xl text-yellow-400 font-bold mb-4">❤️ HP 補品效率表</h1>

    <table class="data-table">
      <thead>
      <tr>
        <th>名稱</th>
        <th @click="sort(hpItems,'weight')">重量</th>
        <th @click="sort(hpItems,'price')">價格</th>
        <th @click="sort(hpItems,'avg')">平均回復量</th>
        <th>基本回復量</th>
        <th @click="sort(hpItems,'restorePerWeight')">回復 / 重量</th>
        <th @click="sort(hpItems,'restorePerCost')">回復 / 價錢</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="item in hpResult" :key="item.name">
        <td>{{ item.name }}</td>
        <td>{{ item.weight }}</td>
        <td>{{ item.price ?? "-" }}</td>
        <td>{{ item.avg }}</td>
        <td>{{ item.base }}</td>

        <!-- 回復/重量 -->
        <td :class="{ best: item.name === bestHpWeight.name }">
          {{ item.restorePerWeight }}
          <span v-if="item.name === bestHpWeight.name">⭐</span>
        </td>

        <!-- 回復/價格 -->
        <td :class="{ best: item.name === bestHpCost.name }">
          {{ item.restorePerCost }}
          <span v-if="item.name === bestHpCost.name">⭐</span>
        </td>
      </tr>
      </tbody>
    </table>

    <hr class="my-10 opacity-50">

    <!-- SP 補品 -->
    <h1 class="text-2xl text-blue-300 font-bold mb-4">🔵 SP 補品效率表</h1>

    <table class="data-table">
      <thead>
      <tr>
        <th>名稱</th>
        <th @click="sort(spItems,'weight')">重量</th>
        <th @click="sort(spItems,'price')">價格</th>
        <th @click="sort(spItems,'avg')">平均回復量</th>
        <th>基本回復量</th>
        <th @click="sort(spItems,'restorePerWeight')">回復 / 重量</th>
<!--        <th @click="sort(spItems,'restorePerCost')">回復 / 價錢</th>-->
      </tr>
      </thead>

      <tbody>
      <tr v-for="item in spResult" :key="item.name">
        <td>{{ item.name }}</td>
        <td>{{ item.weight }}</td>
        <td>{{ item.price ?? "-" }}</td>
        <td>{{ item.avg }}</td>
        <td>{{ item.base }}</td>

        <!-- 回復/重量 -->
        <td :class="{ best: item.name === bestSpWeight.name }">
          {{ item.restorePerWeight }}
          <span v-if="item.name === bestSpWeight.name">⭐</span>
        </td>

        <!-- 回復/價格 -->
<!--        <td :class="{ best: item.name === bestSpCost.name }">-->
<!--          {{ item.restorePerCost }}-->
<!--          <span v-if="item.name === bestSpCost.name">⭐</span>-->
<!--        </td>-->
      </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #2b1e12;
  text-align: center;
}
th, td {
  border: 1px solid rgba(255,255,255,0.2);
  padding: 10px;
}
th {
  background-color: #826c45;
  cursor: pointer;
  user-select: none;
}
tr:hover {
  background: rgba(255,255,255,0.05);
}

/* ⭐ 最強補品高亮 */
.best {
  background: #1a6d2a;
  color: #fff;
  font-weight: bold;
}
</style>
