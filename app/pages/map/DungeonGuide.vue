<template>
  <div class="page-wrapper">
    <div class="content-card">

      <h2 class="main-title">🗺️ 副本清單總覽</h2>
      <p class="description-text">
        以下表格列出了各式副本，您可以透過點擊連結前往詳細頁面。
      </p>

      <div class="table-wrapper">
        <table class="styled-table content-list-table">
          <thead>
          <tr>
            <td style="width: 5%;">順序</td>
            <td style="width: 25%; text-align: left;">名稱</td>
            <td style="width: 14%;">等級</td>
<!--            <td style="width: 10%;">冷卻(天)</td>-->
            <td style="width: 23%;">連結(台)</td>
            <td style="width: 23%;">連結(韓)</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in contentList" :key="item.id" :class="{ 'alt': index % 2 === 1 }">
            <td>{{ item.id }}</td>
            <td class="item-name left">
              {{ item.title }}
            </td>

            <td :class="{'high-level': item.requiredLevel >= 150}">
              Lv.{{ item.requiredLevel }}+
            </td>
<!--            <td class="">-->
<!--              {{ item.day }}-->
<!--            </td>-->
            <td>
              <template v-if="item.linkTW !== '#'">
                <a :href="item.linkTW" target="_blank" class="detail-link">
                  查看詳情
                  <span class="arrow">→</span>
                </a>
              </template>
              <template v-else>
                    <span class="no-link-text">
                      尚無資料
                    </span>
              </template>
            </td>
            <td>
              <template v-if="item.linkK !== '#'">
                <a :href="item.linkK" target="_blank" class="detail-link">
                  查看詳情
                  <span class="arrow">→</span>
                </a>
              </template>
              <template v-else>
                    <span class="no-link-text">
                      尚無資料
                    </span>
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
import {nextTick, onMounted} from "vue";

export default {
  name: 'ContentListPage',
  data() {
    return {
      // 內容列表數據結構
      contentList: [
        { id: 1, title: '波利村', day: 1, requiredLevel: 30, linkTW: 'https://roz.gnjoy.com.tw/Notice/Notice_Info?id=217651', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=1&curpage=3' },
        { id: 2, title: '地下水道', day: 1, requiredLevel: 59, linkTW: 'https://roz.gnjoy.com.tw/Notice/Notice_Info?id=217842', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=3&curpage=3' },
        { id: 3, title: '獸人的記憶', day: 1, requiredLevel: 59, linkTW: 'https://roz.gnjoy.com.tw/Notice/Notice_Info?id=217841', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=2&curpage=3' },
        { id: 4, title: '螞蟻地獄', day: 1, requiredLevel: 70, linkTW: 'https://roz.gnjoy.com.tw/Notice/Notice_Info?id=217972', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=10&curpage=3' },
        { id: 5, title: '依斯魯地下城二層', day: 1, requiredLevel: 80, linkTW: 'https://roz.gnjoy.com.tw/Notice/Notice_Info?id=218152', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=11&curpage=3' },
        { id: 6, title: '沈船', day: 1, requiredLevel: 90, linkTW: 'https://roz.gnjoy.com.tw/Notice/Notice_Info?id=218316', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=12&curpage=3' },
        { id: 7, title: '奧丁榮耀神殿', day: 1, requiredLevel: 90, linkTW: '#', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=48&curpage=3' },
        { id: 8, title: '舊克雷斯特漢姆', day: 1, requiredLevel: 100, linkTW: '#', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=94&curpage=2' },
        { id: 9, title: '臉蟲巢穴', day: 1, requiredLevel: 110, linkTW: '#', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=95&curpage=2' },
        { id: 10, title: '莎拉的回憶', day: 1, requiredLevel: 100, linkTW: '#', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=97&curpage=2' },
        { id: 11, title: '格芬之夜競技場', day: 3, requiredLevel: 90, linkTW: '#', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=102&curpage=2' },
        { id: 12, title: '無限空間', day: 1, requiredLevel: 100, linkTW: '#', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=108&curpage=2' },
        { id: 13, title: '格芬魔法錦標賽', day: 1, requiredLevel: 90, linkTW: '#', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=116&curpage=2' },
        { id: 14, title: '幽靈宮殿', day: 1, requiredLevel: 120, linkTW: '#', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=117&curpage=2' },
        { id: 15, title: '機械之塔', day: 1, requiredLevel: 130, linkTW: '#', linkK: 'https://roz.gnjoy.com/news/update/View.asp?BBSMode=10014&seq=118&curpage=2' },

      ]
    };
  }
}
onMounted(() => {
  document.title = 'RO樂園-副本清單';
})
</script>

<style scoped>
/* ================================================= */
/* 樣式部分新增：無連結按鈕的樣式        */
/* ================================================= */
/* [其他樣式保持不變，只新增無連結文字樣式] */

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
  font-size: 0.95rem;
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

/* 等級需求強調 */
.high-level {
  color: #ff4d4d;
  font-weight: bold;
  font-size: 1.05rem;
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


/* 類型標籤 */
.tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
  color: #3A2C1F;
}

.tag.副本 {
  background-color: #ff6347;
}
.tag.活動 {
  background-color: #7fffd4;
}
.tag.日常 {
  background-color: #ffd700;
}
.tag.特殊 {
  background-color: #8a2be2;
  color: #fff;
}
</style>