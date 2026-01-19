<script setup>
import {computed, onMounted, ref, watch} from "vue";

// 🧮 經驗表
const expTable2 = [
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

// 🧮 經驗表 (根據第二張圖修改，支援 1-90 級)
const expTable = [
  { lv: 1, exp: 0 }, { lv: 2, exp: 2443 }, { lv: 3, exp: 2736 }, { lv: 4, exp: 3064 }, { lv: 5, exp: 3431 },
  { lv: 6, exp: 3842 }, { lv: 7, exp: 4303 }, { lv: 8, exp: 4819 }, { lv: 9, exp: 5397 }, { lv: 10, exp: 6044 },
  { lv: 11, exp: 6769 }, { lv: 12, exp: 7581 }, { lv: 13, exp: 8490 }, { lv: 14, exp: 9508 }, { lv: 15, exp: 10648 },
  { lv: 16, exp: 11925 }, { lv: 17, exp: 13356 }, { lv: 18, exp: 14958 }, { lv: 19, exp: 16752 }, { lv: 20, exp: 18762 },
  { lv: 21, exp: 21013 }, { lv: 22, exp: 23534 }, { lv: 23, exp: 26358 }, { lv: 24, exp: 29520 }, { lv: 25, exp: 33062 },
  { lv: 26, exp: 37029 }, { lv: 27, exp: 41472 }, { lv: 28, exp: 46448 }, { lv: 29, exp: 52021 }, { lv: 30, exp: 58263 },
  { lv: 31, exp: 65254 }, { lv: 32, exp: 73084 }, { lv: 33, exp: 81854 }, { lv: 34, exp: 91676 }, { lv: 35, exp: 102677 },
  { lv: 36, exp: 114998 }, { lv: 37, exp: 128797 }, { lv: 38, exp: 144252 }, { lv: 39, exp: 161562 }, { lv: 40, exp: 180949 },
  { lv: 41, exp: 202662 }, { lv: 42, exp: 226981 }, { lv: 43, exp: 254218 }, { lv: 44, exp: 284724 }, { lv: 45, exp: 318890 },
  { lv: 46, exp: 357156 }, { lv: 47, exp: 400014 }, { lv: 48, exp: 448015 }, { lv: 49, exp: 501776 }, { lv: 50, exp: 561989 },
  { lv: 51, exp: 680006 }, { lv: 52, exp: 1482156 }, { lv: 53, exp: 2178770 }, { lv: 54, exp: 3202791 }, { lv: 55, exp: 4708104 },
  { lv: 56, exp: 6920913 }, { lv: 57, exp: 10173741 }, { lv: 58, exp: 14955400 }, { lv: 59, exp: 21984439 }, { lv: 60, exp: 32317125 },
  { lv: 61, exp: 36841522 }, { lv: 62, exp: 41999335 }, { lv: 63, exp: 47879242 }, { lv: 64, exp: 54582336 }, { lv: 65, exp: 62223863 },
  { lv: 66, exp: 70935204 }, { lv: 67, exp: 80866132 }, { lv: 68, exp: 92187391 }, { lv: 69, exp: 105093625 }, { lv: 70, exp: 119806732 },
  { lv: 71, exp: 135381607 }, { lv: 72, exp: 152981215 }, { lv: 73, exp: 172868773 }, { lv: 74, exp: 195341713 }, { lv: 75, exp: 220736135 },
  { lv: 76, exp: 249431833 }, { lv: 77, exp: 281857970 }, { lv: 78, exp: 318499506 }, { lv: 79, exp: 359904442 }, { lv: 80, exp: 406692019 },
  { lv: 81, exp: 455495061 }, { lv: 82, exp: 510154468 }, { lv: 83, exp: 571373004 }, { lv: 84, exp: 639937764 }, { lv: 85, exp: 716730295 },
  { lv: 86, exp: 802737930 }, { lv: 87, exp: 899066481 }, { lv: 88, exp: 1006954458 }, { lv: 89, exp: 1127788992 }, { lv: 90, exp: 1263123671 },
];

const windowWidth = ref(window.innerWidth);
window.addEventListener("resize", () => (windowWidth.value = window.innerWidth));
const columns = computed(() => (windowWidth.value >= 850 ? 4 : 2));

// 角色列表與當前選中角色
const characters = ref([]);
const activeIndex = ref(0);

// 當前操作的角色物件
const currentChar = computed(() => characters.value[activeIndex.value] || null);

// 初始化一個空角色
function createNewChar(name = "新角色") {
  return {
    name,
    records: [{ time: "", level: null, expType: 'percent', expValue: null }],
    predictLevels: 1,
    perHourExp: 0,
    results: []
  };
}

onMounted(() => {
  const saved = localStorage.getItem("ro_calculator_chars");
  if (saved) {
    characters.value = JSON.parse(saved);
  } else {
    characters.value = [createNewChar("祭師"), createNewChar("騎士")];
  }
});

// 自動儲存
watch(characters, () => {
  localStorage.setItem("ro_calculator_chars", JSON.stringify(characters.value));
}, { deep: true });

function addCharacter() {
  const name = prompt("請輸入新角色名稱：", "新角色");
  if (name) {
    characters.value.push(createNewChar(name));
    activeIndex.value = characters.value.length - 1;
  }
}

function removeCharacter(index) {
  if (characters.value.length <= 1) return alert("至少保留一個角色！");
  if (confirm(`確定要刪除角色「${characters.value[index].name}」嗎？`)) {
    characters.value.splice(index, 1);
    if (activeIndex.value >= characters.value.length) {
      activeIndex.value = characters.value.length - 1;
    }
  }
}

// 核心計算邏輯
function getTotalAbsoluteExp(record) {
  let total = 0;
  for (let i = 1; i <= record.level; i++) {
    const data = expTable.find(item => item.lv === i);
    if (data) total += data.exp;
  }
  const nextLvReq = expTable.find(item => item.lv === (record.level + 1))?.exp || 0;
  total += (record.expType === 'percent') ? (nextLvReq * (record.expValue / 100)) : record.expValue;
  return total;
}

function calculate() {
  const char = currentChar.value;
  const validRecords = char.records
      .filter(r => r.time && r.level && r.expValue !== null)
      .sort((a, b) => new Date(a.time) - new Date(b.time));

  if (validRecords.length < 2) return alert("該角色至少需要兩筆完整紀錄！");

  const startTotal = getTotalAbsoluteExp(validRecords[0]);
  const endTotal = getTotalAbsoluteExp(validRecords[validRecords.length - 1]);
  const timeDiffHr = (new Date(validRecords[validRecords.length - 1].time) - new Date(validRecords[0].time)) / 3600000;

  char.perHourExp = (endTotal - startTotal) / timeDiffHr;
  const gainPerMin = char.perHourExp / 60;

  char.results = [];
  let currentAccumulated = endTotal;
  for (let i = 1; i <= char.predictLevels; i++) {
    const targetLv = validRecords[validRecords.length - 1].level + i;
    if (targetLv > 90) break;

    let targetTotal = 0;
    for (let j = 1; j <= targetLv; j++) {
      targetTotal += expTable.find(item => item.lv === j).exp;
    }

    const needExp = targetTotal - currentAccumulated;
    const mins = needExp / gainPerMin;
    char.results.push({
      targetLevel: targetLv,
      needExp,
      days: Math.floor(mins / 1440),
      hours: Math.floor((mins % 1440) / 60),
      minutes: Math.floor(mins % 60)
    });
  }
}


// 格式化為「萬」單位的函式
function formatToWan(n) {
  // 先除以 10,000，再無條件捨去小數點後數字，最後加上千分位符號
  return Math.floor(n / 10000).toLocaleString();
}

function formatNumber(n) { return Math.round(n).toLocaleString(); }




// 經驗差計算
function calcExpBetween(startLv, startExpPercent, endLv, endExpPercent) {
  if (startLv === endLv) {
    // 同一等級，只需算百分比差
    return expTable[startLv].exp * ((endExpPercent - startExpPercent) / 100);
  }

  // 起始等級尚未滿的經驗量
  const startRemaining = expTable[startLv].exp * ((100 - startExpPercent) / 100);

  // 結尾等級的經驗量
  const endPortion = expTable[endLv].exp * (endExpPercent / 100);

  // 中間完整等級的經驗
  let middle = 0;
  for (let lv = startLv + 1; lv < endLv; lv++) {
    middle += expTable[lv].exp;
  }

  return startRemaining + middle + endPortion;
}

const calcStartLv = ref(1);
const calcStartExp = ref(0);
const calcEndLv = ref(1);
const calcEndExp = ref(0);
const calcResult = ref(null);

function calcDiff() {
  calcResult.value = calcExpBetween(
      calcStartLv.value,
      calcStartExp.value,
      calcEndLv.value,
      calcEndExp.value
  );
}

</script>

<template>
  <div class="container" v-if="currentChar">
    <div class="tabs">
      <button
          v-for="(char, index) in characters" :key="index"
          :class="['tab-btn', { active: activeIndex === index }]"
          @click="activeIndex = index"
      >
        {{ char.name }}
        <span class="close-tab" @click.stop="removeCharacter(index)">×</span>
      </button>
      <button class="add-char-btn" @click="addCharacter">＋ 新增角色</button>
    </div>

    <div class="char-content">
      <div class="header-row">
        <input class="name-input" v-model="currentChar.name" title="點擊修改名稱" />
        <span class="subtitle">的經驗值紀錄</span>
      </div>

      <div class="section">
        <div v-for="(record, index) in currentChar.records" :key="index" class="record-row">
          <div class="input-group">
            <label>日期時間</label>
            <input type="datetime-local" v-model="record.time" />
          </div>
          <div class="input-group">
            <label>等級</label>
            <input type="number" v-model="record.level" class="short-input" />
          </div>
          <div class="input-group">
            <label>類型</label>
            <select v-model="record.expType">
              <option value="percent">百分比 %</option>
              <option value="value">數值</option>
            </select>
          </div>
          <div class="input-group">
            <label>{{ record.expType === 'percent' ? '經驗%' : '經驗' }}</label>
            <input type="number" v-model="record.expValue" class="val-input" />
          </div>
          <button class="del-btn" @click="currentChar.records.splice(index, 1)">❌</button>
        </div>
        <button class="add-btn" @click="currentChar.records.push({ time: '', level: null, expType: 'percent', expValue: null })">＋ 新增紀錄</button>
      </div>

      <div class="section">
        <h2>🎯 升級預估</h2>
        <div class="predict-row">
          <label>預估往後計算幾個等級：</label>
          <input type="number" v-model="currentChar.predictLevels" class="short-input" />
          <button class="calc-btn" @click="calculate">開始計算 {{ currentChar.name }}</button>
        </div>
      </div>

      <div class="section result" v-if="currentChar.results.length">
        <div class="summary">
          🚀 {{ currentChar.name }} 平均經驗：
          <span class="highlight">{{ formatToWan(currentChar.perHourExp) }} 萬</span> Exp/hr
        </div>
        <div class="result-grid">
          <div v-for="(res, i) in currentChar.results" :key="i" class="result-card">
            <h3>➡️ 升級到 Lv.{{ res.targetLevel }}</h3>
            <p>需再獲得：<span class="val">{{ formatNumber(res.needExp) }}</span></p>
            <p>預估時間：<br><span class="highlight">{{ res.days }}天 {{ res.hours }}小時 {{ res.minutes }}分鐘</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <h1 class="title">📈 等級經驗差計算機</h1>


    <div class="section">


      <label>起始等級：</label>
      <input type="number" v-model="calcStartLv" min="1" max="90">
      <label>起始經驗(%)：</label>
      <input type="number" v-model="calcStartExp" min="0" max="100" step="0.1">

      <label>結束等級：</label>
      <input type="number" v-model="calcEndLv" min="1" max="90">
      <label>結束經驗(%)：</label>
      <input type="number" v-model="calcEndExp" min="0" max="100" step="0.1">

      <button class="calc-btn" @click="calcDiff">計算</button>

      <p v-if="calcResult !== null" class="font-xl">
        📘 共需經驗值：{{ formatNumber(calcResult) }}
      </p>
    </div>

  </div>

  <div class="container">
    <h1 class="title">📘 BaseLv 經驗表</h1>

    <!-- 經驗表 -->
    <div class="section exp-table">
      <table class="exp-table-inner">
        <thead>
        <tr>
          <template v-for="j in columns" :key="j">
            <th>BaseLv.</th>
            <th>需求經驗</th>
          </template>
        </tr>
        </thead>
        <tbody>
        <tr v-for="i in Math.ceil(expTable.length / columns)" :key="i">
          <template v-for="j in columns">
            <td v-if="expTable[(i - 1) * columns + j - 1]">
              {{ expTable[(i - 1) * columns + j - 1].lv }}
            </td>
            <td v-if="expTable[(i - 1) * columns + j - 1]">
              {{ formatNumber(expTable[(i - 1) * columns + j - 1].exp) }}
            </td>
          </template>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.container { max-width: 1000px; margin: 20px auto; background: #2b1e12; color: #fff; padding: 20px; border-radius: 12px; font-family: sans-serif; }

/* 頁籤樣式 */
.tabs { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 20px; border-bottom: 2px solid #5a4028; padding-bottom: 10px; }
.tab-btn { background: #4a3625; color: #aaa; border: none; padding: 10px 20px; border-radius: 8px 8px 0 0; cursor: pointer; position: relative; }
.tab-btn.active { background: #ffd700; color: #3a2c1f; font-weight: bold; }
.close-tab { margin-left: 10px; font-size: 14px; opacity: 0.6; }
.close-tab:hover { color: red; opacity: 1; }
.add-char-btn { background: #4caf50; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; }

.header-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.name-input { background: transparent; border: none; border-bottom: 2px solid #ffd700; color: #ffd700; font-size: 1.5rem; width: 120px; text-align: center; }
.subtitle { font-size: 1.2rem; color: #ccc; }

.section { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-bottom: 20px; }
.record-row { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px; align-items: flex-end; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.input-group { display: flex; flex-direction: column; gap: 5px; }
.input-group label { font-size: 12px; color: #aaa; }
input, select { background: #3a2c1f; color: #fff; border: 1px solid #666; padding: 8px; border-radius: 5px; }

.short-input { width: 70px; }
.val-input { width: 120px; }
.add-btn { background: #5a4028; color: #ffd700; border: 1px solid #ffd700; padding: 8px 15px; border-radius: 5px; cursor: pointer; }
.calc-btn { background: #ffd700; color: #3a2c1f; font-weight: bold; padding: 10px 20px; border-radius: 5px; cursor: pointer; border: none; margin-left: 15px; }
.del-btn { background: transparent; border: none; cursor: pointer; font-size: 1.2rem; }

.summary { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 5px solid #00ffb3; }
.highlight { color: #00ffb3; font-weight: bold; }
.result-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
.result-card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border-bottom: 3px solid #ffd700; }
.val { color: #b8faff; }




.exp-table-inner {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
}
.exp-table-inner th,
.exp-table-inner td {
  border: 1px solid #7a5220;
  padding: 5px 8px;
}
.exp-table-inner th {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
}
.exp-table-inner td {
  color: #b8faff;
}

</style>
