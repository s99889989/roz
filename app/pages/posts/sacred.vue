<template>
  <div class="container">
    <h1 class="title">🕊️ 聖物系統說明 - 時隙之翼</h1>

    <!-- NPC 圖片區 -->
    <section class="npc-section">
      <img src="@/assets/image/sacred/npc_location.png" alt="NPC 位置" class="npc-image" />
      <p class="npc-tips">
        <strong>Tips：</strong>布羅克的遺願<br />
        <span>位置：prontera 254 293</span>
      </p>
    </section>

    <!-- 聖物介紹圖片 -->
    <section class="info-section">
      <img src="@/assets/image/sacred/relic_info.png" alt="聖物介紹" class="info-image" />
    </section>

    <!-- 聖物文字資料 -->
    <section class="relic-card">
      <h2>📜 聖物介紹</h2>
      <div class="relic-info">
        <p><strong>名稱：</strong>聖物 - 時隙之翼</p>
        <p><strong>效果：</strong>不耗魔、0CD、可掛機使用、PVP無法使用</p>
        <p class="red"><strong>限制：</strong>無法交易、無法存倉（綁定角色）</p>
        <p><strong>說明：</strong>可在地圖上自由移動至隨機位置上</p>
        <p><strong>重量：</strong>0</p>
      </div>
    </section>

    <!-- 材料清單 -->
    <section class="material-section">
      <h2>🧩 材料掉落一覽</h2>
      <table>
        <thead>
        <tr>
          <th>材料名稱</th>
          <th>掉落怪物</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>火焰纏繞的斷角</td><td>小惡魔</td></tr>
        <tr><td>火焰纏繞的面具</td><td>土人</td></tr>
        <tr><td>火焰纏繞的原木</td><td>麥斯特</td></tr>
        <tr><td>火焰纏繞的結晶</td><td>狂暴野貓</td></tr>
        <tr><td>火焰纏繞的鞭子</td><td>苗娃佩瑞絲</td></tr>
        <tr><td>火焰纏繞的液體</td><td>啤酒企鵝</td></tr>
        <tr><td>火焰纏繞的原石</td><td>畢帝特飛龍</td></tr>
        <tr><td>火焰纏繞的蛇髮</td><td>米杜莎</td></tr>
        <tr><td>火焰纏繞的符石</td><td>玩具士兵</td></tr>
        <tr><td>火焰纏繞的羽毛</td><td>雪熊</td></tr>
        </tbody>
      </table>
    </section>

    <!-- 備註 -->
    <section class="note">
      <p>📘 <strong>說明：</strong>本聖物「時隙之翼」為永久性道具，不可交易、不可存倉、綁定角色使用。</p>
    </section>
  </div>
</template>

<script setup>
// 無需特別邏輯，純靜態展示頁
</script>

<style scoped>
body {
  background-color: #3a2c1f;
  font-family: "Microsoft JhengHei", sans-serif;
  color: #fff;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
}

.title {
  color: #ffe600;
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
}

.npc-section,
.info-section,
.relic-card,
.material-section,
.note {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 25px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.npc-image,
.info-image {
  display: block;
  margin: 10px auto;
  border-radius: 10px;
  max-width: 90%;
  height: auto;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.npc-tips {
  text-align: center;
  color: #d8d8ff;
  font-size: 14px;
  line-height: 1.6;
}

.relic-info p {
  margin: 8px 0;
  font-size: 15px;
  color: #f0f0f0;
}

.relic-info .red {
  color: #ff6666;
}

.material-section h2 {
  color: #ffe600;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
  color: #fff;
}

th {
  background-color: rgba(255, 230, 0, 0.1);
  color: #ffe600;
}

tr:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.note {
  font-size: 14px;
  color: #ffebc2;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
}
</style>
