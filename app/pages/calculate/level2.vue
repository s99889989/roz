<script setup>
import { computed, onMounted, ref, watch } from "vue";

// 🧮 經驗表 (BaseLv 1-80) - 保持不變
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
    if (targetLv > 80) break;

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

function formatNumber(n) { return Math.round(n).toLocaleString(); }
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
            <label>{{ record.expType === 'percent' ? '進度' : '數值' }}</label>
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
          🚀 {{ currentChar.name }} 平均時薪：<span class="highlight">{{ formatNumber(currentChar.perHourExp) }}</span> Exp/hr
        </div>
        <div class="result-grid">
          <div v-for="(res, i) in currentChar.results" :key="i" class="result-card">
            <h3>➡️ Lv.{{ res.targetLevel }}</h3>
            <p>需再獲得：<span class="val">{{ formatNumber(res.needExp) }}</span></p>
            <p>預估時間：<br><span class="highlight">{{ res.days }}天 {{ res.hours }}時 {{ res.minutes }}分</span></p>
          </div>
        </div>
      </div>
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
</style>