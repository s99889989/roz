<template>
  <div class="page-wrapper">
    <div class="content-card">

      <h2 class="section-title">紀念副本 ・ 70 等以上裝備強化專用</h2>

      <div class="image-wrapper">
        <img src="https://imgc.gnjoy.com/ufile/common/2018/02/07/062932_eyMTb5eu.bmp" />
      </div>

      <p>
        此紀念副本可由 <b>紀念協會成員 (prt_fild06)</b> 進入。<br />
        玩家必須至少 70 級才可入場，並能取得
        <b>【螞蟻地獄 1F】專屬的強化材料</b>。
      </p>

      <h2 class="section-title">目錄</h2>

      <ul class="toc">
        <li><a href="#feature">特色</a></li>
        <li><a href="#monster">怪物資訊</a></li>
        <li><a href="#treasure">寶箱（普通 / 困難）</a></li>
        <li><a href="#equipment">紀念副本裝備</a></li>
      </ul>

      <hr />

      <!-- ====================== 特色 ====================== -->
      <h2 class="section-title" id="feature">特色</h2>

      <p>‧ 在【螞蟻地獄 1F】，會遇到比一般更強且會發光的昆蟲。</p>
      <p>‧ 為了通過副本，需要堵住噴出劇毒氣體的間歇泉。</p>
      <p>‧ 把握頭目魔物<strong>「變異瑪雅」</strong>虛弱的時機即可輕鬆通關。</p>

      <hr />

      <!-- ====================== 怪物表 ====================== -->
      <h2 class="section-title" id="monster">怪物資訊</h2>

      <div class="table-wrapper">
        <table class="styled-table">
          <thead>
          <tr>
            <td>怪物</td><td>等級</td><td>HP</td><td>DEF / MDEF</td><td>類型</td><td>種族</td>
            <td>屬性</td><td>尺寸</td><td>Base / Job EXP</td>
          </tr>
          </thead>
          <tbody>
          <!-- 🔻 以下為原表格內容，僅翻譯不更動數值 -->
          <tr>
            <td><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/030402_kG5QBJyt.gif" /><br />變異德妮羅</td>
            <td>70</td><td>5000</td><td>52 / 16</td>
            <td>一般</td><td>昆蟲</td><td>毒 1</td><td>小</td><td>834 / 740</td>
          </tr>
          <tr class="alt">
            <td><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/030416_Osxg46un.gif" /><br />變異維塔塔</td>
            <td>71</td><td>5000</td><td>44 / 12</td>
            <td>一般</td><td>昆蟲</td><td>毒 1</td><td>小</td><td>829 / 756</td>
          </tr>
          <tr>
            <td><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/030424_dlyx7MwC.gif" /><br />變異安德烈</td>
            <td>70</td><td>5000</td><td>55 / 16</td>
            <td>一般</td><td>昆蟲</td><td>毒 1</td><td>小</td><td>843 / 779</td>
          </tr>
          <tr class="alt">
            <td><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/030523_eFaQXGSq.gif" /><br />變異皮埃爾</td>
            <td>70</td><td>5000</td><td>57 / 16</td>
            <td>一般</td><td>昆蟲</td><td>毒 1</td><td>小</td><td>843 / 779</td>
          </tr>
          <tr>
            <td><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/030523_eFaQXGSq.gif" /><br />變異瑪雅（BOSS）</td>
            <td>70</td><td>2,200,000</td><td>183 / 50</td>
            <td>BOSS</td><td>昆蟲</td><td>毒 4</td><td>大型</td><td>165,000 / 120,000</td>
          </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <!-- ====================== 寶箱 ====================== -->
      <h2 class="section-title" id="treasure">寶箱（普通模式）</h2>

      <div class="table-wrapper">
        <table class="styled-table">
          <thead><tr><td>名稱</td><td>說明</td></tr></thead>
          <tbody>
          <tr>
            <td><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/022433_A2oC5cXo.bmp" /><br />微光的水晶</td>
            <td>體內魔力濃縮後形成的結晶，散發微弱光芒。</td>
          </tr>
          <tr class="alt">
            <td><img src="https://imgc.gnjoy.com/ufile/common/2018/02/13/050759_58Za7Yid.bmp" /><br />藍光晶體</td>
            <td>當魔力聚集時會發出藍光。</td>
          </tr>
          <tr>
            <td><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/022517_NT2d6pur.bmp" /><br />果凍碎片盒</td>
            <td>一個畫著波利的可疑盒子，裡面裝著果凍碎片。</td>
          </tr>
          </tbody>
        </table>
      </div>

      <h2 class="section-title">寶箱（困難模式）</h2>

      <div class="table-wrapper">
        <table class="styled-table">
          <thead><tr><td>名稱</td><td>說明</td></tr></thead>
          <tbody>
          <tr>
            <td><img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/022607_WghORyXe.bmp" /><br />微光的水晶</td>
            <td>體內魔力形成的礦物。</td>
          </tr>

          <!-- 省略其他，資料照貼即可 -->
          </tbody>
        </table>
      </div>

      <p class="note">
        ※ 隊伍人數 ≥ 7 人時，掉落物品數量會增加。<br>
        ※ 所有材料皆可用於強化與附魔紀念副本裝備。
      </p>

      <hr />

      <h2 class="section-title" id="equipment">紀念副本裝備（原稱：遠征隊裝備）</h2>
      <p>以下裝備可由副本內的寶箱或活動獲得，可用於強化或附魔。</p>

      <div class="table-wrapper">
        <table class="styled-table">
          <thead>
          <tr>
            <td>名稱</td>
            <td>說明</td>
          </tr>
          </thead>

          <tbody>
          <!-- 1 -->
          <tr>
            <td>
              <img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/053325_6RLfCkKN.bmp" />
              <br />遠征隊的鞋子
            </td>
            <td class="left">
              遠征活動獎勵鞋子。<br /><br />
              HP 回復量 + 10%，SP 回復量 + 7%。<br />
              精煉 +3 時，VIT + 1。<br /><br />
              類型：鞋子　防禦：14　重量：25<br />
              裝備等級：70　職業：全職業<br />
              SLOT：1
            </td>
          </tr>

          <!-- 2 -->
          <tr class="alt">
            <td>
              <img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/053336_BSptHouj.bmp" />
              <br />遠征隊的長袍
            </td>
            <td class="left">
              遠征活動獎勵長袍。<br /><br />
              MaxHP + 400，MaxSP + 50，MDEF + 5，DEF + 30。<br />
              精煉 +3 時，DEF + 5，MaxSP + 10。<br /><br />
              與 <b>遠征隊的圍巾 / 鞋子 / 魔法戒指</b> 同時裝備時：<br />
              MATK + 20<br />
              精煉合計 +21 以上時：<br />
              固定施法 -5%，變動施法 -5%<br /><br />
              類型：盔甲　防禦：51　重量：45<br />
              裝備等級：70　職業：全職業<br />
              SLOT：1
            </td>
          </tr>

          <!-- 3 -->
          <tr>
            <td>
              <img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/053344_9Jy6YSjR.bmp" />
              <br />遠征隊的靴子
            </td>
            <td class="left">
              遠征活動獎勵靴子。<br /><br />
              HP 回復量 + 15%，SP 回復量 + 5%。<br />
              精煉 +3 時，AGI + 1。<br /><br />
              類型：鞋子　防禦：16　重量：30<br />
              裝備等級：70　職業：全職業<br />
              SLOT：1
            </td>
          </tr>

          <!-- 4 -->
          <tr class="alt">
            <td>
              <img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/053352_chAx6Lq1.bmp" />
              <br />遠征隊的盔甲
            </td>
            <td class="left">
              遠征活動獎勵盔甲。<br /><br />
              MaxHP + 500，MaxSP + 30，MDEF + 5，DEF + 30。<br />
              精煉 +3 時，DEF + 10，MHP + 50。<br /><br />
              與 <b>遠征隊的斗篷 / 靴子 / 戒指</b> 同時裝備時：<br />
              ATK + 20<br />
              精煉合計 +21 以上時：<br />
              攻擊後延遲 -5%，固定施法 -5%<br /><br />
              類型：盔甲　防禦：56　重量：50<br />
              裝備等級：70　職業：全職業<br />
              SLOT：1
            </td>
          </tr>

          <!-- 5 -->
          <tr>
            <td>
              <img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/053358_sfcA9p1O.bmp" />
              <br />遠征隊的魔法戒指
            </td>
            <td class="left">
              遠征活動獎勵戒指。<br /><br />
              INT + 3<br /><br />
              類型：飾品　防禦：0　重量：10<br />
              裝備等級：70　職業：全職業<br />
              SLOT：1
            </td>
          </tr>

          <!-- 6 -->
          <tr class="alt">
            <td>
              <img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/053406_2CuWhbaF.bmp" />
              <br />遠征隊的圍巾
            </td>
            <td class="left">
              遠征活動獎勵圍巾。<br /><br />
              無屬性耐性 +9%，FLEE + 12<br />
              精煉 +3 時，無屬性耐性 +1%<br /><br />
              類型：披肩　防禦：13　重量：25<br />
              裝備等級：70　職業：全職業<br />
              SLOT：1
            </td>
          </tr>

          <!-- 7 -->
          <tr>
            <td>
              <img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/053413_irc8A6Gi.bmp" />
              <br />遠征隊的戒指
            </td>
            <td class="left">
              遠征活動獎勵戒指。<br /><br />
              STR + 3<br /><br />
              類型：飾品　防禦：0　重量：10<br />
              裝備等級：70　職業：全職業<br />
              SLOT：1
            </td>
          </tr>

          <!-- 8 -->
          <tr class="alt">
            <td>
              <img src="https://imgc.gnjoy.com/ufile/common/2018/01/30/053422_Dg2tMgDG.bmp" />
              <br />遠征隊的斗篷
            </td>
            <td class="left">
              遠征活動獎勵斗篷。<br /><br />
              無屬性耐性 +8%，FLEE + 15<br />
              精煉 +3 時，FLEE + 3<br /><br />
              類型：披肩　防禦：14　重量：30<br />
              裝備等級：70　職業：全職業<br />
              SLOT：1
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
  name: "AntHellGuide"
}
</script>

<style scoped>
.page-wrapper { background: #3a2c1f; padding: 20px; }

.content-card {
  background: #3a2c1f;
  border-radius: 12px;
  padding: 25px;
  margin: auto;
  max-width: 900px;
  box-shadow: 0 0 10px rgba(0,0,0,0.4);
}

.section-title {
  color: #8b5a2b;
  border-left: 5px solid #c9a063;
  padding-left: 10px;
  margin-top: 25px;
}

.toc li { margin: 5px 0; }
.toc a { color: #b82e2e; font-weight: bold; }

.table-wrapper {

  overflow-x: auto; margin-top: 20px; }

.styled-table {
  width: 100%; border-collapse: collapse;
  background: #3A2C1F;
}
.styled-table td {
  padding: 10px; border: 1px solid #c9a063; text-align: center;
}
.styled-table thead td { background: #3A2C1F; color: white; font-weight: bold; }
.alt { background: #3A2C1F; }
.note { font-weight: bold; color: #b82e2e; margin-top: 10px; }
.update-time { opacity: 0.6; font-size: 0.85rem; }
</style>
