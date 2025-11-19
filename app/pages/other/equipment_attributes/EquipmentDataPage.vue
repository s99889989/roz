
<script setup>
import {computed, ref} from 'vue'
import {equipmentData} from "../../../assets/data/equipment.js";

// 範例：把 data 轉成方便操作的扁平結構
function normalize(dataObj) {
  const out = []
  for (const sourceName of Object.keys(dataObj)) {
    const source = dataObj[sourceName]
    for (const typeName of Object.keys(source)) {
      const type = source[typeName]
      for (const prefixName of Object.keys(type)) {
        const list = type[prefixName]
        out.push({source: sourceName, type: typeName, prefix: prefixName, list})
      }
    }
  }
  return out
}

const flat = normalize(equipmentData)

const sourcesList = Array.from(new Set(flat.map(i => i.source)))

const filters = ref({
  sources: '魔物掉落',
  types: '武器-近距離',
})
function setSource(s) {
  filters.value.sources = s;
  const source = equipmentData[s]
  filters.value.types = Object.keys(source)[0];
}
const typesList = computed(() => {
  const out = []
  for (const sourceName of Object.keys(equipmentData)) {
    const source = equipmentData[sourceName]
    if(sourceName === filters.value.sources){
      for (const typeName of Object.keys(source)) {
        out.push(typeName)
      }
    }


  }
  return out;
})

const filtered = computed(() => {
  const out = []
  for (const sourceName of Object.keys(equipmentData)) {
    const source = equipmentData[sourceName]
    if(sourceName === filters.value.sources){
      for (const typeName of Object.keys(source)) {
        if(typeName === filters.value.types){
          const type = source[typeName]
          for (const prefixName of Object.keys(type)) {
            const list = type[prefixName]
            out.push({source: sourceName, type: typeName, prefix: prefixName, list})
          }
        }
      }
    }
  }
  return out;
})

// 決定要顯示的詞綴欄位 — 將第一個符合的來源/類型的詞綴1..4 取出做為三欄或四欄顯示
const visiblePrefixes = computed(() => {
  // 如果有多個來源/類型，先取第一個符合的
  const first = filtered.value[0]
  if (!first) return []
  // 嘗試依照詞綴名稱排序：詞綴1, 詞綴2, ...
  const group = flat.filter(f => f.source === first.source && f.type === first.type)
  const sorted = group.sort((a, b) => a.prefix.localeCompare(b.prefix, undefined, {numeric: true}))
  return sorted.map(s => s.list)
})
</script>

<template>
  <div class="page">
    <header class="header">
      <h1>裝備詞綴檢視器</h1>
      <h1>{{filters.sources}}</h1>
      <h1>{{filters.types}}</h1>
    </header>

    <section class="controls">
      <div class="control-group">
        <label class="group-title">裝備來源</label>
        <div class="checks">
          <button v-for="t in sourcesList" :key="t"
                  class="check"
                  @click="setSource(t)">
            {{ t }}
          </button>
        </div>
      </div>

      <div class="control-group">
        <label class="group-title">裝備類型</label>
        <div class="checks">
<!--          <label v-for="t in typesList" :key="t" class="check">-->
<!--            <input type="checkbox" v-model="filters.types" :value="t" />-->
<!--            {{ t }}-->
<!--          </label>-->
          <button v-for="t in typesList" :key="t"
                  class="check"
                  @click="filters.types = t">
            {{ t }}
          </button>
        </div>
      </div>


    </section>

    <section class="prefixes">
      <div class="prefix-column" v-for="(prefix, idx) in visiblePrefixes" :key="idx">
        <div class="prefix-header">詞綴 {{ idx + 1 }}</div>
        <table class="prefix-table">
          <thead>
          <tr><th>附加能力</th><th>數值範圍</th></tr>
          </thead>
          <tbody>
          <tr v-for="(item,i) in prefix" :key="i">
            <td class="name flex">{{ item['附加能力'] || item['備註'] || '—' }}</td>
            <td class="value">{{ item['數值'] || item['數值'] === 0 ? item['數值'] : (item['數值'] || '—') }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <footer class="footer">顯示 {{ visiblePrefixes.length }} 個詞綴欄位 — 篩選結果可即時更新</footer>
  </div>
</template>


<style scoped>
.page {
  padding: 20px;
  font-family: "Noto Sans TC", sans-serif;
  background: #3b2b21;
  color: #f6e7d5
}

.header {
  margin-bottom: 18px
}

.header h1 {
  margin: 0;
  font-size: 20px
}

.muted {
  color: #d6c4b1;
  font-size: 12px
}

.screenshot {
  max-width: 360px;
  border-radius: 6px;
  margin-top: 8px;
  display: block
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px 0
}

.control-group {
  background: #4a392f;
  padding: 10px;
  border-radius: 6px
}

.group-title {
  display: block;
  color: #ffd8a8;
  margin-bottom: 8px
}

.checks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px
}

.check {
  background: #f6e7d5;
  padding: 6px;
  border-radius: 4px;
  color: #3b2b21
}

.control-row {
  display: flex;
  gap: 12px;
  align-items: center
}

.prefixes {
  display: flex;
  gap: 12px;
  margin-top: 18px
}

.prefix-column {
  background: #f6e7d5;
  color: #3b2b21;
  padding: 10px;
  border-radius: 6px;
  flex: 1;
  min-width: 220px
}

.prefix-header {
  background: #d9853b;
  color: white;
  padding: 6px;
  border-radius: 4px;
  margin-bottom: 8px;
  text-align: center
}

.prefix-table {
  width: 100%;
  border-collapse: collapse
}

.prefix-table th {
  background: #f0d8b8;
  text-align: left;
  padding: 6px
}

.prefix-table td {
  padding: 6px;
  border-top: 1px solid rgba(0, 0, 0, 0.05)
}

.name {
  font-weight: 600
}

.footer {
  margin-top: 14px;
  color: #d6c4b1
}
</style>
