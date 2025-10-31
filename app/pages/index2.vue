<script setup lang="ts">
import { computed, ref } from 'vue'


const int = ref(36)
const maxsp = ref(200)
const sprec = ref(0)
const saintSong = ref(false)
const meditation = ref(false)
const merman = ref(false)
const succubus = ref(false)
const egg = ref(false)

const result1 = computed(() => {
  const INT = Math.floor(int.value)
  const MAXSP = Math.floor(maxsp.value)
  let SPREC = sprec.value


  if (merman.value) SPREC += 10
  if (succubus.value) SPREC += 3
  if (egg.value) SPREC += 15


  let multiplier = saintSong.value ? 2 : 1


  // Step 1: 基礎回復量 (捨去小數)
  const base = Math.floor(1 + Math.floor(INT / 6) + Math.floor(MAXSP / 100))


// Step 2: 最終自然回復
  let total = base * (1 + SPREC / 100)


// Step 3: INT ≥ 120 額外加成
  if (INT >= 120) {
    total += (4 + (INT / 2 - 60))
  }


// Step 4: 綜合回復 (每8秒一次)
  let perMinute = total * (60 / 8) * multiplier


// 禪心額外回復
  if (meditation.value) {
    perMinute += MAXSP * 0.02 * (60 / 10)
  }


  return Math.round(total)
})

const result = computed(() => {
  const INT = Math.floor(int.value)
  const MAXSP = Math.floor(maxsp.value)
  let SPREC = sprec.value


  if (merman.value) SPREC += 10
  if (succubus.value) SPREC += 3
  if (egg.value) SPREC += 15


  let multiplier = saintSong.value ? 2 : 1


  // Step 1: 基礎回復量 (捨去小數)
  const base = Math.floor(1 + Math.floor(INT / 6) + Math.floor(MAXSP / 100))


// Step 2: 最終自然回復
  let total = base * (1 + SPREC / 100)


  // Step 3: INT ≥ 120 額外加成
  if (INT >= 120) {
    total += (4 + (INT / 2 - 60))
  }


// Step 4: 綜合回復 (每8秒一次)
  let perMinute = total * (60 / 8) * multiplier


// 禪心額外回復
  if (meditation.value) {
    perMinute += MAXSP * 0.02 * (60 / 10)
  }


  return Math.round(perMinute)
})



</script>

<template>
  <div>
    <h1>🌿 RO SP自然回復計算機</h1>
    <div class="calculator">
      <div class="flex flex-wrap">
        <label>INT：<input style="background-color: #5a422a" type="number" v-model.number="int" min="1"></label>
        <label>MAX SP：<input style="background-color: #5a422a" type="number" v-model.number="maxsp" min="1"></label>
      </div>



      <div class="slider-container">
        <label>SP恢復力加成(%)：{{ sprec }}%</label>
        <input type="range" v-model.number="sprec" min="0" max="100">
      </div>


      <div class="checkboxes">
        <label class="checkbox"><input type="checkbox" v-model="saintSong"> 聖母之頌歌(祭司) ×2速度</label>
        <label class="checkbox"><input type="checkbox" v-model="meditation"> 禪心(法師)</label>
        <label class="checkbox"><input type="checkbox" v-model="merman"> 人魚士兵卡 SP恢復力+10%</label>
        <label class="checkbox"><input type="checkbox" v-model="succubus"> 鬼女卡 +3%</label>
        <label class="checkbox"><input type="checkbox" v-model="egg"> 轉轉蛋卡 +15%</label>
      </div>

      <div class="result">每 8 秒回復：{{ result1 }}</div>
      <div class="result">每分鐘平均回魔量：{{ result }}</div>
    </div>


    <div class="note">
      <p>📘 計算公式：</p>
      <ol style="text-align:left;display:inline-block;">
        <li>1. 基礎回復量(SPR) = 1 + (INT / 6) + (MAX SP / 100)，INT 和 MAX SP 的計算結果皆捨去小數</li>
        <li>2. 最終自然回復 = 基礎回復量 × (1 + 恢復力加成%)</li>
        <li>3. INT ≥ 120 時額外加成 = 最終自然回復再加 4 + (INT / 2 - 60)</li>
        <li>4. 綜合回復 = 將各項回復(自然回復、禪心) 換算為相同時間單位後相加並四捨五入</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
body {
  background: #4b3621;
  color: #fff;
  font-family: 'Microsoft JhengHei', sans-serif;
  text-align: center;
  padding: 30px;
}
h1 {
  color: #f8d74b;
  margin-bottom: 20px;
}
.calculator {
  background: #3a2c1f;
  padding: 20px;
  border-radius: 15px;
  max-width: 700px;
  margin: auto;
  box-shadow: 0 0 15px rgba(0,0,0,0.3);
}

label, input {
  display: block;
  margin: 10px auto;
  font-size: 16px;
}
input[type=number] {
  width: 100px;
  padding: 5px;
  border-radius: 8px;
  border: none;
  text-align: center;
}
.checkboxes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}
label.checkbox {
  background: #5a422a;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}
.slider-container {
  margin-top: 20px;
}
input[type=range] {
  width: 80%;
}
.result {
  margin-top: 25px;
  font-size: 28px;
  font-weight: bold;
  color: #ffe600;
}
.note {
  margin-top: 20px;
  font-size: 14px;
  color: #ddd;
}
</style>