<template>
  <div class="page-wrapper">
    <div class="content-card">

      <h2 class="main-title">⚔️ 紀念副本 ⚔️<br>70 等以上裝備強化專用</h2>

      <div class="image-wrapper">
        <img src="https://imgc.gnjoy.com/ufile/common/2018/02/07/062932_eyMTb5eu.bmp" alt="螞蟻地獄 1F 副本截圖" />
      </div>

      <p class="description-text">
        此紀念副本可由 <b>紀念協會成員 (prt_fild06)</b> 進入。
        玩家必須至少 70 級才可入場，並能取得
        <b>【螞蟻地獄 1F】專屬的強化材料</b>。
      </p>

      <hr class="divider"/>

      <h2 class="section-title">📜 內容目錄</h2>

      <ul class="nav-toc">
        <li :class="{ active: currentComponent === 'AntTerritoryFeature' }">
          <a href="#" @click.prevent="currentComponent = 'AntTerritoryFeature'">副本資訊與怪物</a>
        </li>
        <li :class="{ active: currentComponent === 'AntTerritoryTreasure' }">
          <a href="#" @click.prevent="currentComponent = 'AntTerritoryTreasure'">寶箱（普通 / 困難）戰利品</a>
        </li>
        <li :class="{ active: currentComponent === 'AntTerritoryEquip' }">
          <a href="#" @click.prevent="currentComponent = 'AntTerritoryEquip'">紀念副本裝備升級清單</a>
        </li>
      </ul>

      <hr class="divider"/>

      <transition name="fade" mode="out-in">
        <component :is="currentComponent" />
      </transition>

      <div v-if="currentComponent === 'AntTerritoryFeature'">
        <h2 class="section-title" id="feature">💡 副本特色與通關提示</h2>

        <ul class="feature-list">
          <li>在【螞蟻地獄 1F】，會遇到比一般更強且會發光的昆蟲。</li>
          <li>為了通過副本，需要堵住噴出劇毒氣體的間歇泉。</li>
          <li>把握頭目魔物 <strong class="boss-name">「變異蟻后」</strong> 虛弱的時機即可輕鬆通關。</li>
        </ul>

        <hr class="divider"/>

        <h2 class="section-title" id="monster">😈 怪物資訊</h2>

        <div class="table-wrapper">
          <table class="styled-table monster-table">
            <thead>
            <tr>
              <td>怪物</td><td>等級</td><td>HP</td><td>DEF / MDEF</td><td>類型</td><td>種族</td>
              <td>屬性</td><td>尺寸</td><td>Base / Job EXP</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td class="monster-name"><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/030402_kG5QBJyt.gif" alt="變異德妮羅" /><br />變異德妮羅</td>
              <td>70</td><td>5,000</td><td>52 / 16</td>
              <td>一般</td><td>昆蟲</td><td>地 1</td><td>小</td><td>834 / 740</td>
            </tr>
            <tr class="alt">
              <td class="monster-name"><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/030416_Osxg46un.gif" alt="變異維塔塔" /><br />變異維塔塔</td>
              <td>71</td><td>5,000</td><td>44 / 12</td>
              <td>一般</td><td>昆蟲</td><td>地 1</td><td>小</td><td>829 / 756</td>
            </tr>
            <tr>
              <td class="monster-name"><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/030424_dlyx7MwC.gif" alt="變異安德烈" /><br />變異安德烈</td>
              <td>70</td><td>5,000</td><td>55 / 16</td>
              <td>一般</td><td>昆蟲</td><td>地 1</td><td>小</td><td>843 / 779</td>
            </tr>
            <tr class="alt">
              <td class="monster-name"><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/030523_eFaQXGSq.gif" alt="變異皮埃爾" /><br />變異皮埃爾</td>
              <td>70</td><td>5,000</td><td>57 / 16</td>
              <td>一般</td><td>昆蟲</td><td>地 1</td><td>小</td><td>843 / 779</td>
            </tr>
            <tr class="boss-row">
              <td class="monster-name"><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/030523_eFaQXGSq.gif" alt="變異蟻后" /><br /><span class="boss-name">變異蟻后（BOSS）</span></td>
              <td>70</td><td>2,200,000</td><td>183 / 50</td>
              <td>BOSS</td><td>昆蟲</td><td>地 4</td><td>大型</td><td>165,000 / 120,000</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <component :is="currentComponent" v-else />

      <hr class="divider"/>

      <p class="update-time">
        資料來源：遊戲官方資訊 (2018.02.14)
      </p>

    </div>
  </div>
</template>

<script>
// 1. 導入您拆分出來的組件
import AntTerritoryEquip from './AntTerritoryEquip.vue';
import AntTerritoryTreasure from './AntTerritoryTreasure.vue';
// 由於特色和怪物資訊保留在主組件中，我們將其命名為 AntTerritoryFeature (可選，這裡簡化為 v-if)

export default {
  name: "AntTerritoryMain",
  components: {
    AntTerritoryEquip,
    AntTerritoryTreasure,
    // 如果您將特色和怪物也拆分出去，可以在這裡註冊
  },
  data() {
    return {
      // 2. 設置初始要顯示的組件名稱
      currentComponent: 'AntTerritoryFeature' // 預設顯示特色和怪物資訊
    }
  }
}
</script>

<style scoped>
/* ------------------------------------------- */
/* 樣式定義：主組件、切換導航、動畫       */
/* ------------------------------------------- */

/* 確保所有子組件都能正確使用這些表格和標題樣式 */
//@import './shared-styles.css'; /* 假設您將所有樣式移到一個共享文件 */

.nav-toc {
  list-style: none;
  padding: 0;
  display: flex; /* 讓菜單橫向排列 */
  justify-content: space-around;
  margin: 20px 0;
  background: #4a3828;
  border-radius: 8px;
  overflow: hidden;
}

.nav-toc li {
  flex-grow: 1;
  text-align: center;
  border-right: 1px solid #5b4835;
  transition: background 0.3s;
}

.nav-toc li:last-child {
  border-right: none;
}

.nav-toc li a {
  display: block;
  padding: 15px 10px;
  color: #ffcc66;
  font-weight: bold;
  text-decoration: none;
}

.nav-toc li:hover,
.nav-toc li.active {
  background: #5b4835; /* 激活和懸停背景 */
}

.nav-toc li.active a {
  color: #fff; /* 激活文字顏色 */
}

/* 組件切換過渡動畫 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}


/* ... 其他原有的樣式放在這裡，或者（推薦）移到 shared-styles.css ... */

/* ================================================= */
/* 原始 CSS (為簡潔起見，假設已移至 shared-styles.css) */
/* ================================================= */

/* 所有組件共享的樣式 */
.page-wrapper, .content-card, .divider, .main-title, .section-title,
.description-text, .feature-list, .boss-name, .table-wrapper,
.styled-table, .monster-table, .treasure-table, .equipment-table,
.item-name, .item-desc, .equip-detail, .material-list, .drop-tip,
.update-time
{
  /* ... 這裡應該是所有組件都需要的 CSS 樣式 ... */
}
</style>