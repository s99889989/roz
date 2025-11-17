<template>
  <div class="p-6 max-w-6xl mx-auto text-[#3e2b17] space-y-6">
    <!-- 標題 -->
    <h1 class="text-3xl font-bold text-center mb-4">配藥成功率計算與材料資訊</h1>

    <!-- 成功率公式區 -->
    <div class="bg-[#f4e7d0] p-4 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-3">📌 配藥成功率公式</h2>
      <p class="leading-7">
        成功率(%) = 知識藥水技能等級×1 + 配藥技能等級×3 + Job Lv×0.2 + Dex×0.1 + Luk×0.1 + Int×0.05 + 各類物品係數
      </p>

      <p class="mt-4 leading-7">
        JOB 等級、素質、裝備都會影響成功率，物品係數如下：
      </p>

      <!-- 物品係數表格 -->
      <table class="w-full mt-4 border">
        <thead class="bg-[#d3b37a]">
        <tr>
          <th class="p-2 border">物品</th>
          <th class="p-2 border">基本成功率</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in itemCoefficients" :key="item.name">
          <td class="p-2 border">{{ item.name }}</td>
          <td class="p-2 border">{{ item.value }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 範例計算 -->
    <div class="bg-[#f4e7d0] p-4 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-3">📌 99 等素質範例計算</h2>
      <p class="leading-7">假設：Dex 99、Luk 99、Int 25、Job Lv 50、技能等級皆為 10</p>

      <p class="leading-7 mt-3">公式帶入後：71.05% + 各類物品係數</p>

      <p class="leading-7 mt-3">
        ✔ 完美鍊金師基本成功率約 71%<br>
        ✔ 製作一般藥水可提升到 90%<br>
        ✔ 其他藥水則依物品係數下降
      </p>

      <p class="leading-7 mt-3 font-bold">目前頂多約可達 85%（不含物品係數）</p>
    </div>

    <!-- 配藥材料表 -->
    <div class="bg-[#f4e7d0] p-4 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-3">📌 配藥材料資訊表</h2>

      <table class="w-full mt-4 border text-sm">
        <thead class="bg-[#d3b37a]">
        <tr>
          <th class="p-2 border">品名</th>
          <th class="p-2 border">成功一次取得</th>
          <th class="p-2 border">固定材料</th>
          <th class="p-2 border">試管</th>
          <th class="p-2 border">空瓶</th>
          <th class="p-2 border">藥瓶</th>
          <th class="p-2 border">材料 1</th>
          <th class="p-2 border">材料 2</th>
          <th class="p-2 border">材料 3</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="p in potionList" :key="p.name">
          <td class="p-2 border">{{ p.name }}</td>
          <td class="p-2 border text-center">{{ p.output }}</td>
          <td class="p-2 border text-center">{{ p.tool }}</td>
          <td class="p-2 border text-center">{{ p.tube }}</td>
          <td class="p-2 border text-center">{{ p.emptyBottle }}</td>
          <td class="p-2 border text-center">{{ p.drugBottle }}</td>
          <td class="p-2 border">{{ p.m1 }}</td>
          <td class="p-2 border">{{ p.m2 }}</td>
          <td class="p-2 border">{{ p.m3 }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 物品係數
const itemCoefficients = ref([
  { name: "一般藥水", value: "20%" },
  { name: "藍色藥水", value: "-5%" },
  { name: "紅色纖細藥水", value: "-5%" },
  { name: "黃色纖細藥水", value: "-8%" },
  { name: "白色纖細藥水", value: "-10%" },
  { name: "酒精", value: "-10%" },
  { name: "特殊瓶", value: "0%" },
  { name: "護貝藥", value: "-10%" },
  { name: "曼特療傷藥", value: "-5%" },
  { name: "蘆薈汁液", value: "-5%" },
  { name: "艾普利歐", value: "-5%" },
  { name: "抵抗藥水", value: "-5%" }
]);

// 配藥材料表
const potionList = ref([
  { name: "護貝藥", output: 1, tool: "藥缽", tube: 0, emptyBottle: 1, drugBottle: 0, m1: "酒精*1", m2: "茲諾克之牙*1", m3: "人魚之心*1" },
  { name: "火煙瓶", output: 1, tool: "藥缽", tube: 0, emptyBottle: 1, drugBottle: 0, m1: "酒精*1", m2: "透明之布*1", m3: "" },
  { name: "鹽酸瓶", output: 1, tool: "藥缽", tube: 0, emptyBottle: 1, drugBottle: 0, m1: "不死心臟*1", m2: "", m3: "" },
  { name: "植物瓶", output: 1, tool: "藥缽", tube: 0, emptyBottle: 1, drugBottle: 0, m1: "噬人樹花*2", m2: "", m3: "" },
  { name: "酒精", output: 1, tool: "藥缽", tube: 1, emptyBottle: 1, drugBottle: 0, m1: "植物梗*5", m2: "毒魔菇芽胞*5", m3: "" },
  { name: "火抵抗藥", output: 1, tool: "藥缽", tube: 0, emptyBottle: 0, drugBottle: 1, m1: "傘蜥頸*2", m2: "紅色魔力礦石*1", m3: "" },
  { name: "水抵抗藥", output: 1, tool: "藥缽", tube: 0, emptyBottle: 0, drugBottle: 1, m1: "人魚之心*3", m2: "藍色魔力礦石*1", m3: "" },
  { name: "地抵抗藥", output: 1, tool: "藥缽", tube: 0, emptyBottle: 0, drugBottle: 1, m1: "蛾蝶蟲翅膀粉末*3", m2: "藍色魔力礦石*1", m3: "" },
  { name: "風抵抗藥", output: 1, tool: "藥缽", tube: 0, emptyBottle: 0, drugBottle: 1, m1: "巨大傑勒比結晶*2", m2: "黃色魔力礦石*1", m3: "" },
  { name: "艾普利歐", output: 1, tool: "藥缽", tube: 0, emptyBottle: 0, drugBottle: 0, m1: "生命的種子*1", m2: "生化試管*1", m3: "天地樹露水*1" }
]);
</script>

<style scoped>
body { background: #e8dcc4; }
</style>