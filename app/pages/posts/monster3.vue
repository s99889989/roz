<script setup>
import {ref, computed, watch} from 'vue'
import {RecycleScroller} from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import debounce from 'lodash.debounce'

// 假設這是你的怪物資料
import { monstersData } from "../../assets/data/monsters.js";

const monsters = ref(monstersData)
const search = ref('')
const searchValue = ref('')

// 節流搜尋輸入（避免每次輸入都重算）
watch(search, debounce((val) => {
  searchValue.value = val.trim()
}, 300))

// 篩選後的資料（只依賴節流後的 searchValue）
const filteredMonsters = computed(() => {
  if (!searchValue.value) return monsters.value
  const query = searchValue.value.toLowerCase()
  return monsters.value.filter(m =>
      m.monster_name_zh?.toLowerCase().includes(query) ||
      m.monster_name_en?.toLowerCase().includes(query) ||
      m.id?.toString().includes(query)
  )
})
</script>

<template>
  <div class="monster-page">
    <div class="search-bar">
      <input
          v-model="search"
          placeholder="搜尋怪物名稱..."
          class="search-input"
      />
      <div class="result-count">
        顯示 {{ filteredMonsters.length }} 筆資料
      </div>
    </div>

    <!-- 使用虛擬滾動 -->
    <RecycleScroller
        class="monster-list"
        :items="filteredMonsters"
        :item-size="80"
        key-field="id"
    >
      <template #default="{ item }">
        <div class="monster-item">
          <div class="monster-name">{{ item.monster_name_zh }}</div>
          <div class="monster-info">
            ID：{{ item.id }}　
            英文名：{{ item.monster_name_en }}
          </div>
        </div>
      </template>
    </RecycleScroller>
  </div>
</template>

<style scoped>
.monster-page {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.result-count {
  font-size: 13px;
  color: #666;
}

.monster-list {
  height: calc(100vh - 150px);
  overflow-y: auto;
  border-top: 1px solid #ddd;
}

.monster-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 80px;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.monster-name {
  font-weight: bold;
  color: #333;
}

.monster-info {
  font-size: 13px;
  color: #777;
}
</style>
