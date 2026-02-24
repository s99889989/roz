<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

// 資料結構
interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

const timeSlots = ref<TimeSlot[]>([]);
const nextId = ref(1);

onMounted(() => {
  const saved = localStorage.getItem('ro-time-calculator');
  if (saved) {
    const parsed = JSON.parse(saved);
    timeSlots.value = parsed.slots;
    nextId.value = parsed.nextId;
  } else {
    addSlot();
  }
});

watch(timeSlots, (newVal) => {
  localStorage.setItem('ro-time-calculator', JSON.stringify({
    slots: newVal,
    nextId: nextId.value
  }));
}, { deep: true });

const addSlot = () => {
  timeSlots.value.push({ id: nextId.value++, date: '', startTime: '', endTime: '' });
};

const removeSlot = (id: number) => {
  timeSlots.value = timeSlots.value.filter(s => s.id !== id);
};

// 計算邏輯
const calculateMinutes = (slot: TimeSlot) => {
  if (!slot.startTime || !slot.endTime) return 0;
  const [sH, sM] = slot.startTime.split(':').map(Number);
  const [eH, eM] = slot.endTime.split(':').map(Number);
  if (isNaN(sH) || isNaN(sM) || isNaN(eH) || isNaN(eM)) return 0;
  let diff = (eH * 60 + eM) - (sH * 60 + sM);
  if (diff < 0) diff += 24 * 60;
  return diff;
};

// 格式化單行 (用於顯示與匯出)
const getDurationText = (mins: number) => {
  if (mins <= 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} 小時 ${m} 分鐘`;
};

// 總計計算
const totalSummary = computed(() => {
  const totalMins = timeSlots.value.reduce((acc, slot) => acc + calculateMinutes(slot), 0);
  return {
    h: Math.floor(totalMins / 60),
    m: totalMins % 60,
    text: `${Math.floor(totalMins / 60)} 小時 ${totalMins % 60} 分鐘`
  };
});

// --- 新增：自動匯出邏輯 ---
const exportText = computed(() => {
  const lines = timeSlots.value
      .filter(s => s.date && s.startTime && s.endTime) // 只抓完整的資料
      .map(s => {
        const duration = getDurationText(calculateMinutes(s));
        return `${s.date} - ${s.startTime}~${s.endTime}: ${duration}`;
      });

  if (lines.length === 0) return '尚未輸入完整時段資料...';

  return lines.join('\n') + `\n\n總計：${totalSummary.value.text}`;
});

const copyToClipboard = () => {
  navigator.clipboard.writeText(exportText.value);
  alert('文字已複製到剪貼簿！');
};

const clearAll = () => {
  if (confirm('確定要清空所有紀錄嗎？')) {
    timeSlots.value = [];
    nextId.value = 1;
    addSlot();
  }
};
</script>

<template>
  <div class="calc-wrapper">
    <div class="calc-card">
      <div class="header">
        <h1 class="title">時段總計計算機</h1>
        <button @click="clearAll" class="btn-clear">清空紀錄</button>
      </div>

      <div class="table-container">
        <table class="time-table">
          <thead>
          <tr>
            <th>日期</th>
            <th>開始</th>
            <th>結束</th>
            <th class="hide-mobile">小計</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="slot in timeSlots" :key="slot.id">
            <td><input v-model="slot.date" placeholder="0916" /></td>
            <td><input v-model="slot.startTime" placeholder="15:33" /></td>
            <td><input v-model="slot.endTime" placeholder="17:28" /></td>
            <td class="subtotal hide-mobile">{{ getDurationText(calculateMinutes(slot)) || '-' }}</td>
            <td><button @click="removeSlot(slot.id)" class="btn-remove">✕</button></td>
          </tr>
          </tbody>
        </table>
      </div>

      <button @click="addSlot" class="btn-add">+ 新增時段</button>

      <div class="summary-section">
        <div class="summary-box">
          <span class="label">總計時間</span>
          <span class="value">{{ totalSummary.h }} <small>小時</small> {{ totalSummary.m }} <small>分鐘</small></span>
        </div>
      </div>

      <div class="export-section">
        <div class="export-header">
          <span class="export-title">自動匯出文本</span>
          <button @click="copyToClipboard" class="btn-copy">📋 一鍵複製</button>
        </div>
        <pre class="export-area">{{ exportText }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calc-wrapper { background: #1c120a; min-height: 100vh; padding: 40px 20px; display: flex; justify-content: center; }
.calc-card { background: #3a2c1f; width: 100%; max-width: 850px; border: 3px double #c9a063; border-radius: 8px; padding: 25px; color: #f2e6d9; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #5c4033; padding-bottom: 10px; }
.title { color: #ffcc66; font-size: 1.5rem; margin: 0; }

/* 表格樣式 */
.time-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
.time-table th { text-align: left; color: #a88a64; font-size: 0.85rem; padding: 10px; border-bottom: 1px solid #5c4033; }
.time-table td { padding: 6px; }
input { background: #2c2118; border: 1px solid #8b5a2b; color: #fff; padding: 8px; border-radius: 4px; width: 100%; font-family: monospace; }
input:focus { border-color: #ffcc66; outline: none; }
.subtotal { color: #c9a063; font-weight: bold; font-size: 0.9rem; }

/* 按鈕樣式 */
.btn-add { width: 100%; padding: 10px; background: #536153; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-bottom: 20px; }
.btn-add:hover { background: #637563; }
.btn-remove { background: #cc5a4b; color: white; border: none; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; }
.btn-clear { background: transparent; color: #cc5a4b; border: 1px solid #cc5a4b; padding: 4px 10px; border-radius: 4px; cursor: pointer; }

/* 總結區 */
.summary-section { background: #2c2118; padding: 20px; border-radius: 8px; border: 1px solid #c9a063; text-align: center; margin-bottom: 25px; }
.summary-box .value { font-size: 2.2rem; color: #ffcc66; font-weight: bold; }
.summary-box small { font-size: 0.9rem; color: #f2e6d9; margin: 0 4px; }

/* --- 匯出區樣式 --- */
.export-section { background: #1a140f; border-radius: 6px; padding: 15px; border-left: 4px solid #a88a64; }
.export-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.export-title { font-size: 0.9rem; color: #a88a64; font-weight: bold; }
.btn-copy { background: #a88a64; color: #1c120a; border: none; padding: 5px 12px; border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-weight: bold; }
.btn-copy:hover { background: #c9a063; }
.export-area { font-family: 'Courier New', monospace; font-size: 0.9rem; color: #d9c5b2; white-space: pre-wrap; margin: 0; line-height: 1.6; }

@media (max-width: 600px) {
  .hide-mobile { display: none; }
}
</style>