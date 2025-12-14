<script setup>
import { ref } from 'vue';

// 原始資料，使用 ref 包裹以確保在 Vue 中是響應式的
const characterData = ref([
  {
    name: '凜夜',
    guild: '下午茶',
    role: [
      { name: '凜夜', job: '祭師' },
      { name: '炭烤魔法鴨', job: '巫師' },
    ]
  },
  {
    name: '骨質疏鬆的阿嬤',
    guild: '貓咖',
    role: [
      { name: '', job: '' },
    ]
  },
  {
    name: '下午茶-天導鬼謀',
    guild: '',
    role: [
      { name: '', job: '' },
    ]
  },
  {
    name: '下午茶-急速蔦',
    guild: '',
    role: [
      { name: '', job: '' },
    ]
  },
  {
    name: '下午茶-洋蔥騎士',
    guild: '',
    role: [
      { name: '', job: '' },
    ]
  },
  {
    name: '下午茶-藍髮少女誤我一生',
    guild: '',
    role: [
      { name: '', job: '' },
    ]
  },
  {
    name: '下午茶-語無芯',
    guild: '',
    role: [
      { name: '', job: '' },
    ]
  },
  {
    name: '哞哞茶',
    guild: '鯊魚',
    role: [
      { name: '', job: '' },
    ]
  },
  {
    name: '',
    guild: '',
    role: [
      { name: '', job: '' },
    ]
  },
]);

/**
 * 格式化 role 陣列，將隊伍成員和職業組合成一個字串列表顯示
 * @param {Array} roles - 隊伍成員的陣列
 * @returns {String} 格式化後的隊伍資訊字串，以換行符分隔
 */
const formatRoles = (roles) => {
  if (!roles || roles.length === 0) return '無資料';

  // 僅顯示有 name 或 job 的角色
  const validRoles = roles.filter(r => r.name || r.job);

  if (validRoles.length === 0) return '無資料';

  return validRoles.map(role => {
    // 處理空字串，確保輸出可讀性
    const name = role.name || '未知成員';
    const job = role.job || '未知職業';
    return `${name} (${job})`;
  }).join('\n'); // 使用換行符號分隔
};

</script>

<template>
  <div class="data-viewer-container">
    <h2>🎮 角色與公會資訊列表</h2>

    <table class="data-table">
      <thead>
      <tr>
        <th>角色名稱 (name)</th>
        <th>所屬公會 (guild)</th>
        <th>隊伍成員與職業 (role)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in characterData" :key="index">
        <td :class="{ 'empty-cell': !item.name }">
          {{ item.name || '— 無名稱 —' }}
        </td>
        <td :class="{ 'empty-cell': !item.guild }">
          {{ item.guild || '— 無公會 —' }}
        </td>
        <td>
          <pre class="role-list">{{ formatRoles(item.role) }}</pre>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* 基礎樣式 */
.data-viewer-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
  font-family: '微軟正黑體', 'Arial', sans-serif;
  background-color: #3C3025;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 25px;
  border-bottom: 3px solid #3498db;
  padding-bottom: 10px;
}

/* 表格樣式 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #4B4036;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
  vertical-align: top; /* 確保內容從頂部對齊 */
}

.data-table th {
  background-color: #4B4036; /* 表頭背景色 */
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

.data-table tr:nth-child(even) {
  background-color: #4B4036; /* 斑馬紋樣式 */
}

.data-table tr:hover {
  background-color: #e8f5e9; /* 鼠標懸停效果 */
}

/* 隊伍成員列表樣式 */
.role-list {
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 1.5;
  /* 關鍵樣式：保持原始的換行符號，並允許文字換行 */
  white-space: pre-wrap;
  font-family: inherit; /* 避免使用等寬字體 */
  color: #27ae60; /* 綠色突出隊伍資訊 */
}

/* 處理空值儲存格的樣式 */
.empty-cell {
  color: #e74c3c; /* 紅色突出空值 */
  font-style: italic;
}
</style>