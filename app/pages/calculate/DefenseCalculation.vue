
<script setup>
import { ref, computed } from 'vue'

const type = ref('weapon1')
const defValue = ref(200)
const mdefValue = ref(100)

// 精煉資料表（完整）
const refineTable = {
  weapon1: [
    { level: 1, success: 90, fail: '裝備消失', material: '強化武器金屬-級數一', fun: 'Atk、Matk+2',  riot: '-' },
    { level: 2, success: 90, fail: '裝備消失', material: '強化武器金屬-級數一', fun: 'Atk、Matk+4',  riot: '-' },
    { level: 3, success: 90, fail: '裝備消失', material: '強化武器金屬-級數一', fun: 'Atk、Matk+6',  riot: '-' },
    { level: 4, success: 90, fail: '裝備消失', material: '強化武器金屬-級數一', fun: 'Atk、Matk+8',  riot: '-' },
    { level: 5, success: 90, fail: '裝備消失', material: '強化武器金屬-級數一', fun: 'Atk、Matk+10',  riot: '-' },
    { level: 6, success: 90, fail: '裝備消失', material: '強化武器金屬-級數一', fun: 'Atk、Matk+12',  riot: '-' },
    { level: 7, success: 80, fail: '裝備消失', material: '強化武器金屬-級數一', fun: 'Atk、Matk+14',  riot: '-' },
    { level: 8, success: 60, fail: '裝備消失', material: '強化武器金屬-級數一', fun: 'Atk、Matk+16\n浮動Atk、Matk+1~3',  riot: '鐵匠的祝福 x 1' },
    { level: 9, success: 40, fail: '裝備消失', material: '強化武器金屬-級數一', fun: 'Atk、Matk+18\n浮動Atk、Matk+2~6',  riot: '鐵匠的祝福 x 2' },
    { level: 10, success: 19, fail: '裝備消失', material: '強化武器金屬-級數一', fun: 'Atk、Matk+20\n浮動Atk、Matk+3~9',  riot: '鐵匠的祝福 x 4' },
    { level: 8, success: 90, fail: '精煉度-1', material: '高濃縮神之金屬', fun: 'Atk、Matk+16\n浮動Atk、Matk+1~3',  riot: '鐵匠的祝福 x 1' },
    { level: 9, success: 70, fail: '精煉度-1', material: '高濃縮神之金屬', fun: 'Atk、Matk+18\n浮動Atk、Matk+2~6',  riot: '鐵匠的祝福 x 2' },
    { level: 10, success: 30, fail: '精煉度-1', material: '高濃縮神之金屬', fun: 'Atk、Matk+20\n浮動Atk、Matk+3~9',  riot: '鐵匠的祝福 x 4' }
  ],
  weapon2: [
    { level: 1, success: 90, fail: '裝備消失', material: '強化武器金屬-級數二', fun: 'Atk、Matk+3',  riot: '-' },
    { level: 2, success: 90, fail: '裝備消失', material: '強化武器金屬-級數二', fun: 'Atk、Matk+6',  riot: '-' },
    { level: 3, success: 90, fail: '裝備消失', material: '強化武器金屬-級數二', fun: 'Atk、Matk+9',  riot: '-' },
    { level: 4, success: 90, fail: '裝備消失', material: '強化武器金屬-級數二', fun: 'Atk、Matk+12',  riot: '-' },
    { level: 5, success: 90, fail: '裝備消失', material: '強化武器金屬-級數二', fun: 'Atk、Matk+15',  riot: '-' },
    { level: 6, success: 80, fail: '裝備消失', material: '強化武器金屬-級數二', fun: 'Atk、Matk+18',  riot: '-' },
    { level: 7, success: 60, fail: '裝備消失', material: '強化武器金屬-級數二', fun: 'Atk、Matk+21\n浮動Atk、Matk+1~5',  riot: '-' },
    { level: 8, success: 40, fail: '裝備消失', material: '強化武器金屬-級數二', fun: 'Atk、Matk+24\n浮動Atk、Matk+2~10',  riot: '鐵匠的祝福 x 1' },
    { level: 9, success: 20, fail: '裝備消失', material: '強化武器金屬-級數二', fun: 'Atk、Matk+27\n浮動Atk、Matk+3~15',  riot: '鐵匠的祝福 x 2' },
    { level: 10, success: 19, fail: '裝備消失', material: '強化武器金屬-級數二', fun: 'Atk、Matk+30\n浮動Atk、Matk+4~20',  riot: '鐵匠的祝福 x 4' },
    { level: 8, success: 70, fail: '精煉度-1', material: '高濃縮神之金屬', fun: 'Atk、Matk+24\n浮動Atk、Matk+2~10',  riot: '鐵匠的祝福 x 1' },
    { level: 9, success: 40, fail: '精煉度-1', material: '高濃縮神之金屬', fun: 'Atk、Matk+27\n浮動Atk、Matk+3~15',  riot: '鐵匠的祝福 x 2' },
    { level: 10, success: 30, fail: '精煉度-1', material: '高濃縮神之金屬', fun: 'Atk、Matk+30\n浮動Atk、Matk+4~20',  riot: '鐵匠的祝福 x 4' }
  ],
  weapon3: [
    { level: 1, success: 90, fail: '裝備消失', material: '神之金屬', fun: 'Atk、Matk+5',  riot: '-' },
    { level: 2, success: 90, fail: '裝備消失', material: '神之金屬', fun: 'Atk、Matk+10',  riot: '-' },
    { level: 3, success: 90, fail: '裝備消失', material: '神之金屬', fun: 'Atk、Matk+15',  riot: '-' },
    { level: 4, success: 90, fail: '裝備消失', material: '神之金屬', fun: 'Atk、Matk+20',  riot: '-' },
    { level: 5, success: 80, fail: '裝備消失', material: '神之金屬', fun: 'Atk、Matk+25',  riot: '-' },
    { level: 6, success: 60, fail: '裝備消失', material: '神之金屬', fun: 'Atk、Matk+30\n浮動Atk、Matk+1~8',  riot: '-' },
    { level: 7, success: 50, fail: '裝備消失', material: '神之金屬', fun: 'Atk、Matk+35\n浮動Atk、Matk+2~16',  riot: '-' },
    { level: 8, success: 20, fail: '裝備消失', material: '神之金屬', fun: 'Atk、Matk+40\n浮動Atk、Matk+3~24',  riot: '鐵匠的祝福 x 1' },
    { level: 9, success: 20, fail: '裝備消失', material: '神之金屬', fun: 'Atk、Matk+45\n浮動Atk、Matk+4~32',  riot: '鐵匠的祝福 x 2' },
    { level: 10, success: 19, fail: '裝備消失', material: '神之金屬', fun: 'Atk、Matk+50\n浮動Atk、Matk+5~40',  riot: '鐵匠的祝福 x 4' },
    { level: 8, success: 40, fail: '精煉度-1', material: '高濃縮神之金屬', fun: 'Atk、Matk+40\n浮動Atk、Matk+3~24',  riot: '鐵匠的祝福 x 1' },
    { level: 9, success: 40, fail: '精煉度-1', material: '高濃縮神之金屬', fun: 'Atk、Matk+45\n浮動Atk、Matk+4~32',  riot: '鐵匠的祝福 x 2' },
    { level: 10, success: 30, fail: '精煉度-1', material: '高濃縮神之金屬', fun: 'Atk、Matk+50\n浮動Atk、Matk+5~40',  riot: '鐵匠的祝福 x 4' }
  ],
  armor: [
    { level: 1, success: 90, fail: '裝備消失', material: '鋁', fun: 'Def+10',  riot: '-' },
    { level: 2, success: 90, fail: '裝備消失', material: '鋁', fun: 'Def+20',  riot: '-' },
    { level: 3, success: 90, fail: '裝備消失', material: '鋁', fun: 'Def+30',  riot: '-' },
    { level: 4, success: 80, fail: '裝備消失', material: '鋁', fun: 'Def+40',  riot: '-' },
    { level: 5, success: 60, fail: '裝備消失', material: '鋁', fun: 'Def+60',  riot: '-' },
    { level: 6, success: 40, fail: '裝備消失', material: '鋁', fun: 'Def+80',  riot: '-' },
    { level: 7, success: 40, fail: '裝備消失', material: '鋁', fun: 'Def+100',  riot: '-' },
    { level: 8, success: 20, fail: '裝備消失', material: '鋁', fun: 'Def+120',  riot: '鐵匠的祝福 x 1' },
    { level: 9, success: 20, fail: '裝備消失', material: '鋁', fun: 'Def+150',  riot: '鐵匠的祝福 x 2' },
    { level: 10, success: 9, fail: '裝備消失', material: '鋁', fun: 'Def+180',  riot: '鐵匠的祝福 x 4' },
    { level: 8, success: 40, fail: '精煉度-1', material: '高濃縮鋁', fun: 'Def+120',  riot: '鐵匠的祝福 x 1' },
    { level: 9, success: 40, fail: '精煉度-1', material: '高濃縮鋁', fun: 'Def+150',  riot: '鐵匠的祝福 x 2' },
    { level: 10, success: 20, fail: '精煉度-1', material: '高濃縮鋁', fun: 'Def+180',  riot: '鐵匠的祝福 x 4' }
  ]
}

// 防禦計算
const physicalReduction = computed(() =>
    ((defValue.value / (defValue.value + 400)) * 100).toFixed(1)
)
const magicalReduction = computed(() =>
    ((mdefValue.value / (mdefValue.value + 1000)) * 100).toFixed(1)
)
</script>

<template>
  <div class="app">
    <h1 class="main-title">🛡️ RO 防禦計算</h1>


    <div class="def-section">
      <h2>⚙️ 防禦計算</h2>
      <div class="inputs">
        <label>DEF：<input type="number" v-model.number="defValue" /></label>
        <label>MDEF：<input type="number" v-model.number="mdefValue" /></label>
      </div>

      <div class="result">
        <p>🛡️ 實際物理減傷率：<b>{{ physicalReduction }}%</b></p>
        <p>🔮 實際魔法減傷率：<b>{{ magicalReduction }}%</b></p>
      </div>
    </div>

    <div class="note">
      <h3>📘 防禦公式說明</h3>
      <ol>
        <li>1. 實際減傷率 = DEF ÷ (DEF + 400)</li>
        <li>2. 實際魔法減傷率 = MDEF ÷ (MDEF + 1000)</li>
        <li>3. 結果取整數後以百分比顯示</li>
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
