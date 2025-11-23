<template>
  <div class="page">
    <h1>RO 裝備查詢工具</h1>

    <div class="search-box">
      <input
          v-model="keyword"
          placeholder="輸入裝備名稱…"
          @keyup.enter="search"
      />
      <button @click="search">搜尋</button>
    </div>

    <div v-if="loading" class="loading">查詢中…</div>

    <table v-if="results.length" class="result-table">
      <thead>
      <tr>
        <th>名稱</th>
        <th>類型</th>
        <th>來源</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in results" :key="i">
        <td>{{ item.name }}</td>
        <td>{{ item.type }}</td>
        <td>{{ item.source }}</td>
      </tr>
      </tbody>
    </table>

    <div v-if="!loading && !results.length && searched">
      沒有搜尋結果
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const keyword = ref("")
const results = ref([])
const loading = ref(false)
const searched = ref(false)

// 這是模擬你那個 search2.js 的請求方式
async function search () {
  if (!keyword.value.trim()) return

  loading.value = true
  searched.value = true
  results.value = []

  try {
    // ⚠️ 你要換成 search2.js 裡的真實 API URL
    const res = await fetch(
        `https://example.com/api/search?keyword=${encodeURIComponent(keyword.value)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
    )

    const data = await res.json()

    // ⚠️ 依你的 API 回傳結構調整
    results.value = data.list || []

  } catch (e) {
    console.error("查詢錯誤", e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  padding: 20px;
  font-family: "Noto Sans TC", sans-serif;
}

.search-box {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

input {
  padding: 6px 10px;
  font-size: 14px;
  flex: 1;
}

button {
  padding: 6px 12px;
  cursor: pointer;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
}

.result-table th,
.result-table td {
  border: 1px solid #ddd;
  padding: 6px;
  text-align: left;
}

.loading {
  color: #888;
}
</style>
