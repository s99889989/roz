<script setup>
import { ref, watch, onMounted } from "vue";

// 🧮 經驗表
const expTable = [
  { lv: 1, exp: 0 }, { lv: 2, exp: 2443 }, { lv: 3, exp: 2760 }, { lv: 4, exp: 3118 }, { lv: 5, exp: 3523 },
  { lv: 6, exp: 3980 }, { lv: 7, exp: 4497 }, { lv: 8, exp: 5081 }, { lv: 9, exp: 5741 }, { lv: 10, exp: 6487 },
  { lv: 11, exp: 7330 }, { lv: 12, exp: 8282 }, { lv: 13, exp: 9358 }, { lv: 14, exp: 10574 }, { lv: 15, exp: 11948 },
  { lv: 16, exp: 13501 }, { lv: 17, exp: 15256 }, { lv: 18, exp: 17239 }, { lv: 19, exp: 19480 }, { lv: 20, exp: 22012 },
  { lv: 21, exp: 24873 }, { lv: 22, exp: 28106 }, { lv: 23, exp: 31759 }, { lv: 24, exp: 35887 }, { lv: 25, exp: 40552 },
  { lv: 26, exp: 45823 }, { lv: 27, exp: 51779 }, { lv: 28, exp: 58510 }, { lv: 29, exp: 66116 }, { lv: 30, exp: 74711 },
  { lv: 31, exp: 84423 }, { lv: 32, exp: 95397 }, { lv: 33, exp: 107798 }, { lv: 34, exp: 121811 }, { lv: 35, exp: 137646 },
  { lv: 36, exp: 155539 }, { lv: 37, exp: 175759 }, { lv: 38, exp: 198607 }, { lv: 39, exp: 224425 }, { lv: 40, exp: 253600 },
  { lv: 41, exp: 286568 }, { lv: 42, exp: 323821 }, { lv: 43, exp: 365917 }, { lv: 44, exp: 413486 }, { lv: 45, exp: 467239 },
  { lv: 46, exp: 527980 }, { lv: 47, exp: 596617 }, { lv: 48, exp: 674177 }, { lv: 49, exp: 761820 }, { lv: 50, exp: 860856 },
  { lv: 51, exp: 1058852 }, { lv: 52, exp: 2117366 }, { lv: 53, exp: 3112529 }, { lv: 54, exp: 4575417 },
  { lv: 55, exp: 6725863 }, { lv: 56, exp: 9887019 }, { lv: 57, exp: 14533917 }, { lv: 58, exp: 21364858 },
  { lv: 59, exp: 31406342 }, { lv: 60, exp: 46167322 }, { lv: 61, exp: 52630747 }, { lv: 62, exp: 59999051 },
  { lv: 63, exp: 68398918 }, { lv: 64, exp: 77974766 }, { lv: 65, exp: 88891233 }, { lv: 66, exp: 101336006 },
  { lv: 67, exp: 115523046 }, { lv: 68, exp: 131696273 }, { lv: 69, exp: 150133750 }, { lv: 70, exp: 171152475 },
  { lv: 71, exp: 193402296 }, { lv: 72, exp: 218544594 }, { lv: 73, exp: 246955391 }, { lv: 74, exp: 279059591 },
  { lv: 75, exp: 315337337 }, { lv: 76, exp: 356331190 }, { lv: 77, exp: 402654244 }, { lv: 78, exp: 454999295 },
  { lv: 79, exp: 514149203 }, { lv: 80, exp: 580888599 },
];

const records = ref([{ time: "", level: null, exp: null }]);
const predictLevels = ref(1);
const results = ref([]);
const perHourExp = ref(0);

// 📦 載入 localStorage
onMounted(() => {
  const saved = localStorage.getItem("expRecords");
  const savedPredict = localStorage.getItem("expPredict");
  if (saved) records.value = JSON.parse(saved);
  if (savedPredict) predictLevels.value = parseInt(savedPredict);
});

// 💾 儲存
function saveToStorage() {
  localStorage.setItem("expRecords", JSON.stringify(records.value));
  localStorage.setItem("expPredict", predictLevels.value);
}

function clearRecords() {
  if (confirm("確定清除所有紀錄？")) {
    records.value = [{ time: "", level: null, exp: null }];
    predictLevels.value = 1;
    results.value = [];
    perHourExp.value = 0;
    localStorage.removeItem("expRecords");
    localStorage.removeItem("expPredict");
  }
}

// 🧮 計算
function addRecord() {
  records.value.push({ time: "", level: null, exp: null });
  saveToStorage();
}
function removeRecord(i) {
  records.value.splice(i, 1);
  saveToStorage();
}
function formatNumber(n) {
  return Math.round(n).toLocaleString();
}
function calculate() {
  if (records.value.length < 2) {
    alert("⚠️ 至少需要兩筆紀錄！");
    return;
  }
  const sorted = [...records.value].sort((a, b) => new Date(a.time) - new Date(b.time));
  const start = sorted[0];
  const end = sorted[sorted.length - 1];

  // 計算起點與終點的絕對經驗值
  let totalGain = 0;

  if (end.level === start.level) {
    // 同一等級，只取百分比差
    totalGain = expTable[start.level - 1].exp * ((end.exp - start.exp) / 100);
  } else {
    // 跨等級：起始的剩餘 + 中間完整等級 + 結尾部分
    const startRemaining = expTable[start.level - 1].exp * ((100 - start.exp) / 100);
    const endPortion = expTable[end.level - 1].exp * (end.exp / 100);
    let middle = 0;
    for (let i = start.level + 1; i < end.level; i++) {
      middle += expTable[i - 1].exp;
    }
    totalGain = startRemaining + middle + endPortion;
  }



  const timeDiffHr = (new Date(end.time) - new Date(start.time)) / 3600000;
  perHourExp.value = totalGain / timeDiffHr;

  const gainPerMin = perHourExp.value / 60;
  results.value = [];
  let currentLv = end.level;

  let needExpNow = -expTable[currentLv - 1].exp*end.exp/100;

  for (let i = 0; i < predictLevels.value; i++) {
    const nextLv = currentLv + 1;
    const endExp = end.exp;
    // const needExp = expTable[nextLv - 1]?.exp ?? 0;
    needExpNow += expTable[nextLv - 2].exp;
    const needExp = needExpNow;
    const minutes = needExp / gainPerMin;
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = Math.floor(minutes % 60);
    results.value.push({ targetLevel: nextLv, endExp, needExp, days, hours, minutes: mins });
    currentLv = nextLv;
  }
  saveToStorage();
}
</script>

<template>
  <div class="container">
    <h1 class="title">📈 RO 等級經驗與升級預估計算機</h1>

    <!-- 經驗輸入區 -->
    <div class="section">
      <h2>⏱️ 經驗紀錄</h2>
      <div v-for="(record, index) in records" :key="index" class="record-row">
        <label>時間：</label>
        <input type="datetime-local" v-model="record.time" @change="saveToStorage" />
        <label>等級：</label>
        <input type="number" v-model="record.level" @change="saveToStorage" min="1" max="80" />
        <label>經驗(%)：</label>
        <input type="number" v-model="record.exp" @change="saveToStorage" min="0" max="100" step="0.1" />
        <button class="del-btn" @click="removeRecord(index)">❌</button>
      </div>
      <button class="add-btn" @click="addRecord">➕ 新增紀錄</button>
      <button class="clear-btn" @click="clearRecords">🗑 清除紀錄</button>
    </div>

    <!-- 預估設定 -->
    <div class="section">
      <h2>🎯 預估設定</h2>
      <label>預估升級等級數：</label>
      <input type="number" v-model="predictLevels" min="1" @change="saveToStorage" />
      <button class="calc-btn" @click="calculate">開始預估</button>
    </div>

    <!-- 結果 -->
    <div class="section result" v-if="results.length">
      <h2>📊 預估結果</h2>

      <div class="summary">
        <p>💡 平均每小時經驗量：約 <span class="highlight">{{ formatNumber(perHourExp) }}</span></p>
      </div>

      <div v-for="(res, i) in results" :key="i" class="result-card">
        <h3>➡️ Lv.{{ res.targetLevel }} 預估升級時間</h3>
        <p>需要經驗：{{ formatNumber(res.needExp) }}</p>
        <p>預估時間：約 {{ res.days }}天 {{ res.hours }}小時 {{ res.minutes }}分鐘</p>
      </div>
    </div>
  </div>
</template>



<style scoped>
.container {
  max-width: 900px;
  margin: 30px auto;
  color: #fff;
  background: #2b1e12;
  padding: 20px;
  border-radius: 10px;
  font-family: "Microsoft JhengHei", sans-serif;
}
.title {
  text-align: center;
  color: #ffd700;
  margin-bottom: 20px;
}
.section {
  margin-top: 25px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}
.record-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
input {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #888;
  text-align: center;
  background-color: #3a2c1f;
  color: #fff;
}
.add-btn, .calc-btn, .del-btn, .clear-btn {
  background: #ffd700;
  color: #3a2c1f;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  //margin-right: 10px;
  margin-left: 10px;
}
.add-btn:hover, .calc-btn:hover, .clear-btn:hover {
  background: #ffea70;
}
.result-card {
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
}
.highlight {
  color: #00ffb3;
  font-weight: bold;
}
.summary {
  background: rgba(0,0,0,0.4);
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
}
</style>
