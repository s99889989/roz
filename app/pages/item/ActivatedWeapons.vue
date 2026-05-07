<script setup>
import {nextTick, onMounted} from "vue";

const items = ref([
  {
    image: 'activated_weapons_w1'
  },
  {
    image: 'activated_weapons_w2'
  },
  {
    image: 'activated_weapons_w3'
  },
  {
    image: 'activated_weapons_w4'
  },
  {
    image: 'activated_weapons_w5'
  },
  {
    image: 'activated_weapons_w6'
  },
  {
    image: 'activated_weapons_w7'
  },
  {
    image: 'activated_weapons_w8'
  },
  {
    image: 'activated_weapons_w9'
  },
  {
    image: 'activated_weapons_w10'
  },
  {
    image: 'activated_weapons_w11'
  },
  {
    image: 'activated_weapons_w12'
  },
  {
    image: 'activated_weapons_w13'
  },
  {
    image: 'activated_weapons_w14'
  },
  {
    image: 'activated_weapons_w15'
  },
  {
    image: 'activated_weapons_w16'
  },
  {
    image: 'activated_weapons_w17'
  },
])
onMounted(() => {
  document.title = 'RO樂園-活化武器系統(★武器)';
})
</script>

<template>
  <div class="notice-container">
    <header class="notice-header">
      <h1 class="notice-title">活化武器系統(★武器)</h1>
    </header>

    <main class="notice-body">
      <section class="info-section">
        <span style="color: #f1c40f;" class="font-bold text-2xl">鑄造之證兌換</span>
        <img :src="`/images/other/activated_weapons/activated_weapons1.png`" class="info-image" />
        <strong>名稱：</strong>工坊學徒鳴家<br />
        <span>位置：/navi prontera 272/264</span>
        <section class="npc-info">
          <ul>
            <li>與NPC「工坊學徒鳴家」對話後可將魔物掉落裝備x1兌換為對應「★鑄造之證」x 1。</li>
            <li>每件武器必須「★鑄造之證」x 100件。</li>
          </ul>
        </section>
      </section>

      <section class="info-section">
        <span style="color: #f1c40f;" class="font-bold text-2xl flex justify-center">哥布靈碎幣兌換</span>
        <span style="color: #f1c40f;" class="font-bold text-2xl flex justify-center">物理魔晶石兌換</span>
        <span style="color: #f1c40f;" class="font-bold text-2xl flex justify-center">魔法魔晶石兌換</span>

        <img :src="`/images/other/activated_weapons/activated_weapons4.png`" class="info-image" />
        <strong>名稱：</strong>想飛的魔像<br />
        <span>位置：/navi prontera 284/253</span>
        <section class="npc-info">
          <ul>
            <li>每件★武器必須「哥布靈碎幣」x 8。</li>
            <li>Zeny36萬~80萬(隨機)   →  「哥布靈碎幣」1~3個(隨機)。</li>
            <li>100個蒼蠅翅膀+充滿雜質的石頭1個</li>
            <li>⬇</li>
            <li>「物理魔晶石」1個、「魔法魔晶石」1個、「充滿雜質的石頭」1個 (隨機取一)。</li>
          </ul>
        </section>
      </section>

      <section class="info-section">
        <span style="color: #f1c40f;" class="font-bold text-2xl">★武器製作</span>
        <img :src="`/images/other/activated_weapons/activated_weapons2.png`" alt="聖物介紹" class="info-image" />
        <p class="npc-tips">
          <strong>Tips：</strong>叨叨齋爺爺<br />
          <span>位置： /navi prontera 272/260</span>
        </p>
        <section class="npc-info">
          <ul>
            <li>收集對應的材料與「叨叨齋爺爺」對話後可開啟活化介面。</li>
            <li>材料：</li>
            <li>對應武器+7 x 1</li>
            <li>對應武器鑄造之證 x 100</li>
            <li>哥布靈碎幣 x 8</li>
            <img :src="`/images/other/activated_weapons/activated_weapons3.png`" alt="聖物介紹" class="info-image" />
          </ul>

        </section>
      </section>

      <section class="info-section">
        <span style="color: #f1c40f;" class="font-bold text-2xl flex justify-center">附魔</span>
        <img :src="`/images/items/105347.gif`" class="info-image w-20" />
        <img :src="`/images/items/105348.gif`" class="info-image w-20" />
        <section class="npc-info">
          <ul>
            <li>點擊附魔石打開附魔介面，選擇要附魔的★武器。</li>
          </ul>
        </section>
      </section>

      <section class="info-section">
        <span style="color: #f1c40f;" class="font-bold text-2xl flex justify-center">★武器</span>
        <div class="flex flex-wrap gap-2">
          <img  class="info-image w-60" v-for="item in items" :src="`/images/other/activated_weapons/items/${item.image}.png`" />

        </div>

      </section>

      <section class="info-section">
        <span style="color: #f1c40f;" class="font-bold text-2xl">參考資料</span>
        <a style="color: #b46f1c" class="flex justify-center font-bold" target="_blank" href="https://roz.gnjoy.com.tw/Notice/Notice_Info?id=217788">二級★武器</a>
      </section>


      <section class="notes">
        <h3>【注意事項】</h3>
        <p>隨著版本更迭將有可能提供其他「活化」的入手方式以及新增可「活化」的道具，詳細資訊再請依照最新版本更新、公告說明為主。</p>
      </section>

      <div class="back-link">
        <a href="javascript:history.back()">回上頁</a>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* =========== 參考 aftroz.netlify.app 的深色樣式 =========== */

/* 整體容器：深色背景、淺色文字 */
.notice-container {
  max-width: 850px;
  margin: 20px auto;
  padding: 30px;
  /* 深藍/灰背景 */
  background-color: #3C3025;
  color: #ecf0f1; /* 淺灰白文字 */
  font-family: 'Arial', 'Microsoft JhengHei', sans-serif;
  line-height: 1.7;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
.info-section{
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 25px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}
.info-image {
  display: block;
  margin: 10px auto;
  border-radius: 10px;
  max-width: 90%;
  height: auto;
  border: 2px solid rgba(255, 255, 255, 0.2);
}
/* 標題區塊 */
.notice-header {
  border-bottom: 2px solid #3498db; /* 亮藍色分隔線 */
  padding-bottom: 15px;
  margin-bottom: 30px;
  text-align: center;
}

.notice-title {
  color: #f1c40f; /* 標題使用黃金色 */
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.notice-meta {
  font-size: 15px;
  color: #bdc3c7; /* 淺灰色元資料 */
}

.notice-category {
  font-weight: bold;
  color: #3498db; /* 亮藍色分類標籤 */
  margin-right: 20px;
}

/* 內文標題 */
.notice-body h2 {
  color: #f1c40f; /* 黃金色主標題 */
  font-size: 24px;
  margin-top: 30px;
  margin-bottom: 15px;
  border-left: 5px solid #e67e22; /* 橘色強調線 */
  padding-left: 15px;
}

.notice-body h3 {
  color: #3498db; /* 亮藍色子標題 */
  font-size: 18px;
  padding-left: 0;
  margin-top: 25px;
  margin-bottom: 10px;
  font-weight: 600;
}

.system-title {
  color: #e67e22; /* 橘色強調 */
}

/* NPC 資訊卡片 */
.npc-info ul {
  list-style-type: none;
  padding-left: 0;
  /* 淺一階的背景色 */
  background-color: #34495e;
  border: 1px solid #3498db;
  padding: 15px 20px;
  border-radius: 4px;
  margin-bottom: 25px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
}

.npc-info li {
  margin-bottom: 8px;
  color: #ecf0f1;
}

.npc-info li strong {
  color: #f1c40f; /* 資訊項目名稱使用黃金色 */
}

/* 注意事項區塊 */
.notes h3 {
  color: #e74c3c; /* 警示紅色標題 */
}

.notes p {
  padding: 15px;
  border: 1px solid #e74c3c;
  /* 更深的警示背景 */
  background-color: #442a2d;
  border-radius: 4px;
  color: #fdeaea;
  font-weight: 500;
}

/* 回上頁連結 */
.back-link {
  text-align: right;
  margin-top: 40px;
}

.back-link a {
  color: #f1c40f; /* 連結文字使用黃金色 */
  text-decoration: none;
  font-weight: bold;
  padding: 8px 15px;
  border: 2px solid #f1c40f;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.back-link a:hover {
  background-color: #f1c40f; /* Hover 時背景變黃金 */
  color: #2c3e50; /* 文字變深色 */
}
</style>