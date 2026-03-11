<script setup>
import { ref, onMounted, computed } from 'vue';

const members = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');

onMounted(async () => {
  try {
    // 參考你的寫法：路徑不包含 public，從根目錄開始
    const response = await fetch('/data/members.json');

    if (!response.ok) throw new Error('成員資料載入失敗');

    const data = await response.json();
    // 確保將資料賦值給 members
    members.value = data;

  } catch (error) {
    console.error("讀取資料錯誤:", error);
  } finally {
    // 資料抓完（無論成功或失敗）都關閉載入狀態
    isLoading.value = false;
  }
});

// 搜尋過濾邏輯
const filteredMembers = computed(() => {
  return members.value.filter(person =>
      person.name.includes(searchQuery.value) ||
      person.phone.includes(searchQuery.value)
  );
});

// 狀態文字轉換
const getStatusText = (status) => {
  const map = { 'active': '活躍', 'lost': '失聯/拒訪', 'good': '良好未到' };
  return map[status] || '待聯絡';
};
</script>

<template>
  <div class="app-container">
    <header>
      <h2>⛪ 教會成員聯絡管理</h2>
      <input
          v-model="searchQuery"
          class="search-input"
          placeholder="🔍 搜尋姓名或電話..."
      />
    </header>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>正在同步成員資料...</p>
    </div>

    <div v-else class="card-grid">
      <div
          v-for="person in filteredMembers"
          :key="person.id"
          :class="['member-card', person.status || 'pending']"
      >
        <div class="card-header">
          <span class="name">{{ person.name }}</span>
          <span class="badge">{{ getStatusText(person.status) }}</span>
        </div>

        <div class="card-body">
          <p class="phone">📞 <a :href="'tel:' + person.phone">{{ person.phone }}</a></p>
          <p class="note">{{ person.note || '無備註' }}</p>
        </div>

        <div class="card-footer">
          <select v-model="person.status">
            <option value="">待聯絡 (無色)</option>
            <option value="active">活躍成員 (藍色)</option>
            <option value="lost">失聯/拒訪 (灰色)</option>
            <option value="good">良好未到 (綠色)</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 配色核心 */
.active { background-color: #e3f2fd; border-top: 5px solid #2196f3; color: #0d47a1; }
.lost { background-color: #f5f5f5; border-top: 5px solid #9e9e9e; color: #616161; }
.good { background-color: #e8f5e9; border-top: 5px solid #4caf50; color: #1b5e20; }
.pending { background-color: #ffffff; border-top: 5px solid #cfd8dc; color: #455a64; }

/* 佈局樣式 */
.app-container { max-width: 1100px; margin: auto; padding: 20px; }
header { margin-bottom: 25px; text-align: center; }
.search-input { width: 100%; max-width: 400px; padding: 12px; border-radius: 25px; border: 1px solid #ddd; outline: none; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.member-card {
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: 0.3s;
}

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-weight: bold; }
.badge { font-size: 0.75rem; background: rgba(255,255,255,0.6); padding: 2px 8px; border-radius: 10px; }
.phone a { text-decoration: none; color: inherit; font-weight: bold; }
.note { font-size: 0.9rem; margin-top: 10px; opacity: 0.8; flex-grow: 1; }

.card-footer { margin-top: 15px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 10px; }
select { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc; cursor: pointer; }

/* 載入動畫樣式 */
.loading-state { text-align: center; padding: 50px; color: #666; }
.spinner {
  width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db;
  border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>