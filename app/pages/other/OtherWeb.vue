<template>
  <div class="page-wrapper">
    <div class="content-card">

      <h2 class="main-title">🥼 其他攻略網站</h2>
      <p class="description-text">
        以下表格列出了RO有關的資訊網站，您可以透過點擊連結前往詳細頁面。
      </p>

      <div class="table-wrapper">
        <table class="styled-table content-list-table">
          <thead>
          <tr>
            <td style="width: 15%;">順序</td>
            <td style="width: 50%; text-align: left;">名稱</td>
            <td style="width: 35%;">連結</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in contentList" :key="index" :class="{ 'alt': index % 2 === 1 }">
            <td>{{ index + 1 }}</td>
            <td class="item-name left">{{ item.title }}</td>

            <td>
              <template v-if="item.link !== '#'">
                <a :href="item.link" target="_blank" class="detail-link">
                  查看詳情 <span class="arrow">→</span>
                </a>
              </template>
              <template v-else>
                <span class="no-link-text">尚無資料</span>
              </template>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentListPage',
  data() {
    return {
      // 內容列表數據結構
      contentList: [
        { title: '官方網站', link: 'https://roz.gnjoy.com.tw/' },
        { title: '巴哈版', link: 'https://forum.gamer.com.tw/B.php?bsn=83142' },
        { title: 'RO樂園查詢工具', link: 'https://twroz.wiki/' },
        { title: '傷害計算工具', link: 'https://landgris.github.io/ROCalculator/?zero' },
        { title: '仙境全書', link: 'https://ro.ntome.com' },
        { title: '幻想廳', link: 'https://rz.fharr.com' },
        { title: '銀雪筆記', link: 'https://ronews.ginyuki.com/category/kro/roz' },
        { title: 'RO廣播', link: 'https://ro-garden.com/ ' },
        { title: 'DivinePride', link: 'https://www.divine-pride.net/' },
      ]
    };
  }
}
</script>

<style scoped>

.page-wrapper {
  background: #3a2c1f;
  padding: 30px 20px;
}

.content-card {
  background: #3a2c1f;
  border-radius: 12px;
  padding: 30px;
  margin: auto;
  max-width: 900px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  color: #fff8e1;
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
  line-height: 1.7;
}

.main-title {
  color: #c9a063;
  text-align: center;
  font-size: 2.2rem;
  padding-bottom: 15px;
  border-bottom: 3px double #c9a063;
  margin-bottom: 25px;
}

.description-text {
  font-size: 1.05rem;
  margin: 15px 0;
  padding: 0 10px;
  text-align: center;
}

/* ================================================= */
/* 表格樣式                     */
/* ================================================= */
.table-wrapper {
  overflow-x: auto;
  margin-top: 30px;
  border: 1px solid #8b5a2b;
  border-radius: 8px;
  overflow: hidden;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  background: #3A2C1F;
  color: #fff8e1;
  min-width: 650px;
  font-size: 1.1rem;
}

.styled-table td {
  padding: 15px 10px;
  border: 1px solid #5b4835;
  text-align: center;
  vertical-align: middle;
}

.styled-table thead td {
  background: #5b4835;
  color: #c9a063;
  font-weight: bold;
  letter-spacing: 1px;
  border-bottom: 2px solid #c9a063;
}

/* 隔行換色 */
.styled-table tbody tr.alt {
  background: #423528;
}
.styled-table tbody tr:hover {
  background: #503d2b;
  cursor: pointer;
}

.item-name.left {
  text-align: left;
  font-weight: bold;
  color: #ffcc66;
}

/* 連結按鈕樣式 */
.detail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #c9a063;
  color: #3A2C1F;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 5px;
  font-weight: bold;
  transition: background 0.2s, transform 0.2s;
}

.detail-link:hover {
  background: #e6c589;
  transform: translateY(-1px);
}

.arrow {
  margin-left: 5px;
  transition: margin-left 0.2s;
}

.detail-link:hover .arrow {
  margin-left: 10px;
}

/* 新增的無連結文字樣式 */
.no-link-text {
  display: inline-block;
  padding: 8px 15px;
  color: #999; /* 灰色 */
  background: #503d2b;
  border-radius: 5px;
  border: 1px solid #666;
  font-weight: 500;
}
</style>