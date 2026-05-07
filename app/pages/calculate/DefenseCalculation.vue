
<script setup>
import {ref, computed, onMounted} from 'vue'

const defValue = ref(200)
const mdefValue = ref(50)

//防禦減傷計算 ( 取小數點後1位 )
const physicalReduction = computed(() =>
    ( 100 -( ( (4000+defValue.value) / (4000+defValue.value*10)) * 100) ).toFixed(1)
)

//魔法減傷計算 ( 取小數點後1位 )
const magicalReduction = computed(() =>
    ( 100 - ( (1000 + mdefValue.value) / (1000 + 10 * mdefValue.value) ) * 100).toFixed(1)
)
onMounted(() => {
  document.title = 'RO樂園-防禦計算';
})
</script>

<template>
  <div class="app">
    <h1 class="main-title">🛡️ RO 防禦減傷計算</h1>


    <div class="def-section">
      <h2>⚙️ 防禦計算</h2>
      <div class="inputs">
        <label>DEF：<input type="number" v-model.number="defValue" /></label>
        <label>MDEF：<input type="number" v-model.number="mdefValue" /></label>
      </div>

      <div class="result">
        <p>🛡️ 物理減傷率：<b>{{ physicalReduction }}%</b></p>
        <p>🔮 魔法減傷率：<b>{{ magicalReduction }}%</b></p>
      </div>

    </div>

    <div class="note">
      <h3>📘 防禦公式說明</h3>
      <ol>
        <li>1. 減傷率 = 100 - ( (4000 + 後DEF) / (4000 + 後DEF x 10) * 100)</li>
        <li>2. 魔法減傷率 = 100 - ( (1000 + 後MDEF) / (1000 + 後MDEF x 10) * 100)</li>
        <li>3. 結果以百分比顯示</li>
      </ol>
    </div>
  </div>
</template>


<style scoped>
.main-title {
  font-size: 1.8rem;
}
.app {
  background: #ae9170;
  border-radius: 12px;
  color: #fff;
  font-family: "Microsoft JhengHei", sans-serif;
  min-height: 100vh;
  min-width: 800px;
  padding: 30px;
  text-align: center;
}
h1 {
  color: #f8d74b;
  margin-bottom: 20px;
}
.selector {
  margin-bottom: 20px;
}
select {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
}

.table-container {
  background: #3a2c1f;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0,0,0,0.3);
  margin-bottom: 30px;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border-bottom: 1px solid #5a422a;
  font-size: 14px;
  white-space: pre-wrap;
}
th {
  background: #5a422a;
  color: #ffe600;
  text-align: center;
}
td {
  white-space: pre-wrap;
  text-align: center;
}
tr:hover {
  background: rgba(255,255,255,0.05);
}

.def-section {
  background: #3a2c1f;
  border-radius: 12px;
  padding: 20px;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}
.inputs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}
input[type=number] {
  width: 80px;
  padding: 5px;
  border-radius: 8px;
  border: none;
  text-align: center;
  background: #5a422a;
}
.result {
  font-size: 18px;
  color: #ffe600;
}
.note {
  margin-top: 40px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: #ddd;
}
</style>
