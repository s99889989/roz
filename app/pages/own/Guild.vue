<template>
  <div class="member-wrapper">
    <div class="member-card">
      <h2 class="main-title">成員名單</h2>

      <div class="member-grid">
        <div
            v-for="(member, index) in memberData"
            :key="index"
            class="member-item"
        >
          <div class="player-header">
            <span class="icon">👤</span>
            <span class="player-name">{{ member.name || '未命名玩家' }}</span>
          </div>

          <div class="role-list">
            <div
                v-for="(role, rIdx) in member.role"
                :key="rIdx"
                class="role-row"
            >
              <div class="role-info">
                <span class="role-name">{{ role.name || '尚未設定角色' }}</span>
                <span v-if="role.job" class="badge job">{{ role.job }}</span>
                <span v-if="role.guild" class="badge guild">{{ role.guild }}</span>
                <span v-if="role.level" class="badge guild">{{ role.level}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const memberData = ref([
      {
        name: '凜夜',
        role: [
          {name: '凜夜', job: '祭師', level: '0', guild: '下午茶', work: ''},
          {name: '炭烤魔法鴨', job: '巫師', level: '', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '骨質疏鬆的阿嬤',
        role: [
          {name: '骨質疏鬆的阿嬤', job: '武僧', level: '', guild: '貓咖', work: ''},
        ]
      },
      {
        name: '天導鬼謀',
        role: [
          {name: '天導鬼謀', job: '', level: '', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '急速蔦',
        role: [
          {name: '急速蔦', job: '巫師', level: '', guild: '下午茶', work: ''},
          {name: '聖光蔦', job: '祭師', level: '', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '洋蔥騎士',
        role: [
          {name: '洋蔥騎士', job: '', level: '', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '藍髮少女誤我一生',
        role: [
          {name: '藍髮少女誤我一生', job: '', level: '', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '語無芯',
        role: [
          {name: '語無芯', job: '刺客', level: '', guild: '下午茶', work: ''},
          {name: '幕夏戀情', job: '祭師', level: '', guild: '', work: ''},
        ]
      },
      {
        name: '哞哞茶',
        role: [
          {name: '哞哞茶', job: '獵人', level: '', guild: '鯊魚', work: ''},
        ]
      },
      {
        name: '雲襄',
        role: [
          {name: '雲襄', job: '刺客', level: '', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '月心',
        role: [
          {name: '月心', job: '', level: '', guild: '', work: ''},
          {name: '月君', job: '祭師', level: '', guild: '', work: ''},
          {name: '玄月', job: '巫師', level: '', guild: '', work: ''},
        ]
      },
      {
        name: '心理醫師',
        role: [
          {name: '心理醫師˙', job: '刺客', level: '', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '心魔',
        role: [
          {name: '心魔', job: '', level: '', guild: '', work: ''},
          {name: '瑀芯妹妹OuO~*', job: '祭師', level: '', guild: '', work: ''},
        ]
      },
      {
        name: '茗澤羽',
        role: [
          {name: '知道我綠色的可怕', job: '練金', level: '', guild: '下午茶', work: ''},
          {name: '萬噸巨魄', job: '十字軍', level: '', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '星眸',
        role: [
          {name: '', job: '', level: '', guild: '', work: ''},
        ]
      },
      {
        name: '白水木',
        role: [
          {name: '白水木', job: '騎士', level: '80', guild: '下午茶', work: ''},
		  {name: '捲葉榕', job: '十字軍', level: '71', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '獨孤皇天',
        role: [
          {name: '獨孤皇天', job: '武僧', level: '', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '代替月亮懲罰你',
        role: [
          {name: '代替月亮懲罰你', job: '十字軍', level: '', guild: '', work: ''},
        ]
      },
      {
        name: '搖頭土地公',
        role: [
          {name: '', job: '', level: '', guild: '', work: ''},
          {name: '', job: '', level: '', guild: '', work: ''},
        ]
      },
      {
        name: '神奇海螺',
        role: [
          {name: '神奇海螺', job: '', level: '', guild: '', work: ''},
		  {name: '隔壁大叔', job: '武僧', level: '60', guild: '', work: ''},
        ]
      },

      {
        name: '小悶悶',
        role: [
          {name: '~悶悶~', job: '巫師', level: '80', guild: '下午茶', work: ''},
        ]
      },

      {
        name: '雷克洛德',
        role: [
          {name: '雷克洛德', job: '祭師', level: '72', guild: '下午茶', work: '補'},
		  {name: '艾倫米爾', job: '祭師', level: '70', guild: '下午茶', work: '遠攻'},
	      {name: '暗影凱爾', job: '祭師', level: '70', guild: '下午茶', work: '近戰'},
        ]
      },
      {
        name: '納義',
        role: [
          {name: '納義', job: '祭師', level: '66', guild: '下午茶', work: ''},
        ]
      },
      {
        name: '',
        role: [
          {name: '', job: '', level: '', guild: '', work: ''},
        ]
      },
    ]
);
</script>

<style scoped>
.member-wrapper {
  background: #3a2c1f;
  padding: 30px 20px;
  min-height: 100vh;
}

.member-card {
  background: #3a2c1f;
  border-radius: 12px;
  padding: 30px;
  margin: 0; /* 靠左對齊 */
  max-width: 1000px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  color: #fff8e1;
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 內容靠左 */
}

.main-title {
  color: #c9a063;
  text-align: left; /* 標題靠左 */
  font-size: 2.2rem;
  border-bottom: 3px double #c9a063;
  margin-bottom: 25px;
  padding-bottom: 10px;
  width: 100%;
}

.member-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.member-item {
  background: #2c2118;
  border: 1px solid #8b5a2b;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.2s;
}

.member-item:hover {
  border-color: #c9a063;
  box-shadow: 0 0 10px rgba(201, 160, 99, 0.3);
}

.player-header {
  border-bottom: 1px solid #5c4033;
  padding-bottom: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-name {
  font-weight: bold;
  font-size: 1.1rem;
  color: #ffcc66;
}

.role-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.role-row {
  font-size: 0.9rem;
}

.role-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.role-name {
  color: #ddd;
}

.badge {
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.job {
  background: #536153; /* 參考體型表的深綠 */
  color: #fff;
}

.guild {
  background: #a88a64; /* 參考體型表的褐色 */
  color: #fff;
}

/* 針對內容為空時的處理 */
.member-item:has(.player-name:empty) {
  display: none; /* 隱藏完全沒有名稱的資料 */
}
</style>