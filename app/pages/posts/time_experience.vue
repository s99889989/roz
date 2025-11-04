<script setup>
// 無需特別邏輯，純展示
</script>

<template>
  <div class="container">
    <h1 class="title">🕰️ 定時經驗加倍活動</h1>

    <!-- 活動說明 -->
    <section class="card">
      <h2>📜 活動內容</h2>
      <p>在特定時段內於旅館休息，可獲得 <strong class="highlight">+10% 經驗加成</strong>，效果持續 30 分鐘。</p>
      <p>住宿費用：<strong class="highlight">一晚 5000 Zeny</strong></p>
    </section>

    <!-- 時間表 -->
    <section class="card">
      <h2>🏨 旅館時間與地點</h2>
      <table>
        <thead>
        <tr>
          <th>時間</th>
          <th>城市</th>
          <th>備註</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>02:00～03:00</td><td>艾爾帕蘭</td><td>宵夜</td></tr>
        <tr><td>08:00～09:00</td><td>艾爾貝塔、普隆德拉</td><td>早餐</td></tr>
        <tr><td>14:00～15:00</td><td>吉芬、斐楊</td><td>下午點心</td></tr>
        <tr><td>20:00～21:00</td><td>夢羅克、普隆德拉</td><td>晚餐</td></tr>
        </tbody>
      </table>
    </section>

    <!-- 提示 -->
    <section class="note">
      <p>💡 <strong>提示：</strong>在對應時段內與旅館老闆對話即可進入休息。<br>
        若在時間外嘗試，將不會獲得經驗加倍效果。</p>
    </section>
  </div>
</template>



<style scoped>

body {
  background-color: #3a2c1f;
  color: #fff;
  font-family: "Microsoft JhengHei", sans-serif;
  margin: 0;
  padding: 0;
}

.container {

  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}

.title {
  color: #ffe600;
  text-align: center;
  font-size: 2em;
  margin-bottom: 25px;
}

.card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

h2 {
  color: #ffe600;
  margin-bottom: 10px;
}

p {
  font-size: 15px;
  line-height: 1.6;
  color: #f5f5f5;
}

.highlight {
  color: #ffdd33;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

th {
  background-color: rgba(255, 230, 0, 0.1);
  color: #ffe600;
}

tr:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.note {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  color: #ffd;
  font-size: 14px;
  text-align: center;
  line-height: 1.6;
}
</style>
