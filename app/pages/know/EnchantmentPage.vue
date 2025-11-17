<template>
  <div class="p-6 max-w-7xl mx-auto text-[#3e2b17]">
    <!-- 搜尋區 -->
    <div class="bg-[#5c3b1e] p-4 rounded-lg text-white mb-4">
      <input
          v-model="search"
          type="text"
          placeholder="請輸入附加能力名稱 (例如 ATK...)"
          class="w-full p-2 rounded bg-[#f4e7d0] text-black"
      />
      <button @click="clearSearch" class="mt-2 px-4 py-1 bg-[#8b5a2b] rounded">清除搜尋條件</button>
    </div>

    <!-- 篩選區 -->
    <div class="bg-[#f4e7d0] p-4 rounded-lg mb-6">
      <h3 class="font-bold mb-2">裝備來源</h3>
      <div class="flex flex-wrap gap-4 mb-4">
        <label v-for="s in sourceList" :key="s" class="flex items-center gap-2">
          <input type="checkbox" v-model="filter.source" :value="s" /> {{ s }}
        </label>
      </div>

      <h3 class="font-bold mb-2">裝備類型</h3>
      <div class="flex flex-wrap gap-4">
        <label v-for="t in typeList" :key="t" class="flex items-center gap-2">
          <input type="checkbox" v-model="filter.type" :value="t" /> {{ t }}
        </label>
      </div>
    </div>

    <!-- 附魔表格區 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="(group, idx) in displayGroups" :key="idx" class="bg-[#f4e7d0] p-4 rounded-lg shadow">
        <h2 class="text-lg font-bold text-center mb-2">附魔階段 {{ idx + 1 }}</h2>
        <table class="w-full">
          <thead>
          <tr class="bg-[#d3b37a]">
            <th class="p-2 border">附加能力</th>
            <th class="p-2 border">數值</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in group" :key="item.name">
            <td class="p-2 border">{{ item.name }}</td>
            <td class="p-2 border text-center">{{ item.value }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const search = ref("");

const filter = ref({
  source: [],
  type: []
});

const sourceList = ["魔物掉落", "鍛匠製作", "活化系統", "MVP掉落", "克雷斯特凱姆姆"];
const typeList = ["武器", "防具", "近距離系列", "遠距離系列", "魔法系列"];

// 模擬資料（之後我可以幫你自動轉換成你給的 Excel 資料）
const enchantData = ref([
  { stage: 1, name: "ATK", value: "5-30 " },
  { stage: 1, name: "ATK%", value: "1-5" },
  { stage: 2, name: "ASPD", value: "1" },
  { stage: 2, name: "HIT", value: "5-20" },
  { stage: 3, name: "對風屬性敵人造成的物理傷害增加(%)", value: "5-10" }
]);

const clearSearch = () => {
  search.value = "";
  filter.value.source = [];
  filter.value.type = [];
};

const displayGroups = computed(() => {
  const g = [[], [], []];
  enchantData.value.forEach(e => g[e.stage - 1].push(e));
  return g;
});
</script>

<style scoped>
body { background: #e8dcc4; }
</style>
