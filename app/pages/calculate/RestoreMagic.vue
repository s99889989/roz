<script setup>
import {computed, ref} from 'vue'

const int = ref(6)
const maxsp = ref(100)
const sprec = ref(0)

const int_need = computed(() => {
  return 6 - int.value % 6
})

const maxsp_need = computed(() => {
  return 100 - maxsp.value % 100
})



// 單選配件變數（'none' / 'merman' / 'succubus' / 'egg'）
const accessory = ref('none')

// 其他選項
const saintChecked = ref(false)
const meditationChecked = ref(false)


const sprec_need = computed(() => {
  const INT = Math.floor(int.value)
  const MAXSP = Math.floor(maxsp.value)
  let SPREC = sprec.value

  if (accessory.value === 'merman') SPREC += 10
  if (accessory.value === 'succubus') SPREC += 3
  if (accessory.value === 'egg') SPREC += 15

  const base = Math.floor(1 + Math.floor(INT / 6) + Math.floor(MAXSP / 100))
  const currentTotal = Math.floor(base * (1 + SPREC / 100))

  // 目標：結果 +1
  let target = currentTotal + 1;

  let newA = SPREC;

  while (Math.floor(base * (1 + newA / 100)) < target) {
    newA++; // 每次加 1%
  }

  let delta = newA - SPREC;

  return delta
})

// 計算基礎、自然、總合與每分鐘
const natural = computed(() => {
  const INT = Math.floor(int.value)
  const MAXSP = Math.floor(maxsp.value)
  let SPREC = sprec.value

  // 三選一：透過 accessory 判斷
  if (accessory.value === 'merman') SPREC += 10
  if (accessory.value === 'succubus') SPREC += 3
  if (accessory.value === 'egg') SPREC += 15

  // Step1: 基礎回復（捨去小數）
  const base = Math.floor(1 + Math.floor(INT / 6) + Math.floor(MAXSP / 100))

  // Step2: 最終自然回復
  let total = Math.floor(base * (1 + SPREC / 100))

  // Step3: INT >= 120 額外加成
  if (INT >= 120) total += 4 + (INT / 2 - 60)

  return total
})

const total = computed(() => {
  let val = natural.value

  // 若聖母之頌歌，將自然回復速度乘 2（此乘法會在後面換算成每分鐘）
  if (saintChecked.value) val *= 2

  // 禪心：停止時每 10 秒額外回復 (以每 8 秒單位換算時需轉成等效)
  if (meditationChecked.value) {
    // 禪心額外回復 = MAXSP * 0.02 每 10 秒一次
    // 因為 natural 與 perMinute 採每8秒為一個單位，這裡先轉換為每8秒等值：
    // 每8秒額外 = MAXSP * 0.02 * (8/10)
    val += maxsp.value * 0.02 * (8 / 10)
  }

  return val
})

const perMinute = computed(() => Math.round(total.value * (60 / 8)))
</script>

<template>
  <div class="sp-calc w-full xl:w-3/4">
    <h1>SP 自然回復計算機 🧘‍♂️</h1>

    <div class="input-section">

      <div class="stat-input">
        <label>INT</label>
        <button class=""  @click="int -= 6">-</button>
        <input type="number" style="background-color: #5a422a" v-model.number="int" class="appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
        <button @click="int += 6">+</button>
        <span class="hint">再 {{int_need}} 點 INT 可使自然回復 +1</span>
      </div>

      <div class="stat-input">
        <label>MAX SP</label>
        <button @click="maxsp -= 100">-</button>
        <input type="number"  style="background-color: #5a422a" v-model.number="maxsp" class="appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
        <button @click="maxsp += 100">+</button>
        <span class="hint">再 {{maxsp_need}} 點 MAX SP 可使自然回復 +1</span>
      </div>

      <div class="slider">
        <label>SP自然恢復速度增加：{{ sprec }}%</label>
        <input type="range" v-model.number="sprec" min="0" max="100" />
        <span class="hint">再 {{sprec_need}}% SP恢復力 可使自然回復 +1</span>
      </div>
    </div>

    <div class="options">
      <div class="option">
        <label><input type="checkbox" v-model="saintChecked" /> 聖母之頌歌(祭司)</label>
        <p>施展者與畫面內的隊員，SP 自然恢復速度提升為 2 倍。</p>
      </div>

      <div class="option">
        <label><input type="checkbox" v-model="meditationChecked" /> 禪心(法師)</label>
        <p>停止時，每 10 秒額外按 MaxSP 比例恢復 SP（靜止觸發）。</p>
      </div>

      <!-- 三選一卡片（外觀可用 radio，但樣式可做成類似卡片） -->
      <div class="option accessory">
        <p class="opt-title">卡片（選一）</p>

        <label class="radio-row">
          <input type="radio" v-model="accessory" value="none" />
          <span>不使用卡片</span>
        </label>

        <label class="radio-row">
          <input type="radio" v-model="accessory" value="merman" />
          <span>人魚士兵卡（鞋） — SP 恢復力 +10%</span>
        </label>

        <label class="radio-row">
          <input type="radio" v-model="accessory" value="succubus" />
          <span>鬼女卡（鞋） — SP 恢復力 +3%</span>
        </label>

        <label class="radio-row">
          <input type="radio" v-model="accessory" value="egg" />
          <span>轉轉蛋卡（鞋） — SP 恢復力 +15%</span>
        </label>
      </div>
    </div>

    <div class="result">
      <p>每 8 秒SP自然回復 {{ total }}</p>
      <h2>每分鐘平均回魔量</h2>
      <div class="value">{{ perMinute }}</div>
    </div>

    <div class="formula">
      <h3>📘 計算公式說明</h3>
      <ol>
        <li>1. 基礎回復量(SPR) = 1 + (INT / 6) + (MAX SP / 100)，INT 和 MAX SP 的計算結果皆捨去小數</li>
        <li>2. 最終自然回復 = 基礎回復量 × (1 + 恢復力加成%)</li>
        <li>3. INT ≥ 120 時額外加成 = 最終自然回復再加 4 + (INT / 2 - 60)</li>
        <li>4. 綜合回復 = 將各項回復(自然回復、禪心) 換算為相同時間單位後相加並四捨五入</li>
      </ol>
    </div>
  </div>
</template>



<style scoped>
.sp-calc {
  background: #5A3D1A;
  color: #fff;
  font-family: 'Microsoft JhengHei';
  padding: 20px;

  margin: 24px auto;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.stat-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-input label {
  width: 60px;
}

.stat-input input {
  width: 90px;
  text-align: center;
  border-radius: 6px;
  padding: 6px;
}

.hint {
  color: #f8d74b;
  font-size: 12px;
  margin-left: 8px;
}

.slider input {
  width: 100%;
}

.options {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(280px, 1fr));
  gap: 12px;
}

.option {
  background: rgba(255, 255, 255, 0.04);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.option p {
  font-size: 13px;
  color: #ddd;
  margin-top: 6px;
}

.accessory .radio-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  margin-top: 6px;
  background: rgba(0, 0, 0, 0.05);
}

.accessory input[type="radio"] {
  transform: scale(1.1);
}

.result {
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
  margin-top: 22px;
}

.result .value {
  font-size: 72px;
  color: #ffd500;
  font-weight: 800;
  margin-top: 6px;
}

.formula {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  //border-radius: 8px;
  //font-size: 14px;
}
</style>
