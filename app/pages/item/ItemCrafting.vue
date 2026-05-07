<template>
  <div class="container">
    <h1 class="title">🎩 RO 頭飾製作與染料製作表</h1>

    <!-- 頭飾表 -->
    <div class="table-section">
      <h2>🎩 頭飾製作</h2>
      <table>
        <thead>
        <tr>
          <th>頭飾名稱</th>
          <th>頭飾能力</th>
          <th>需要材料</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in headItems" :key="i">
          <td>{{ item.name }}</td>
          <td>{{ item.effect }}</td>
          <td v-html="formatText(item.materials)"></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 染料製作表 -->
    <div class="table-section">
      <h2>🎨 染料製作</h2>
      <table>
        <thead>
        <tr>
          <th>名稱</th>
          <th>所需道具</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(dye, i) in dyeList" :key="'dye-' + i">
          <td>{{ dye.name }}</td>
          <td v-html="formatText(dye.materials)"></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 中和劑 / 混合劑製作 -->
    <div class="table-section">
      <h2>🧪 中和劑 / 混合劑製作</h2>
      <table>
        <thead>
        <tr>
          <th>名稱</th>
          <th>所需道具</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(chem, i) in chemList" :key="'chem-' + i">
          <td>{{ chem.name }}</td>
          <td v-html="formatText(chem.materials)"></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// 🪶 頭飾資料
import {onMounted} from "vue";

const headItems = [
  { name: '礦坑安全帽', effect: 'DEX+2', materials: '安全帽*1、手提燈*1、鋼鐵*25、水晶鏡子*1<br>邪骸礦工、赤蒼蠅、綠蒼蠅、巨石怪<br>夢羅克商人販售' },
  { name: '鋼鐵面具', effect: '火屬性攻擊的抗性+10%', materials: '鋼鐵*50<br>赤蒼蠅、綠蒼蠅、巨石怪' },
  { name: '紅髮梳', effect: 'CRI+6', materials: '混合劑*1、紅色染料*1、堅硬外皮*50、斧*1<br>摩肯修塔尹、旮八獨力漢製作、鍬形蟲、武器商人' },
  { name: '廚師帽', effect: 'DEX+1', materials: '小蛋糕*20、白色染料*1、柔毛*30<br>邪惡禮盒、旮八獨力漢製作、瘋兔' },
  { name: '青蛙帽', effect: '對昆蟲型魔物的物理、魔法傷害增加12%，MDEF+1', materials: '青蛙蛋*100、毒牙*100、鱗片皮膚*50<br>突變蛙、黑蛇、蛇女伊絲' },
  { name: '望遠鏡', effect: 'DEX+1', materials: '旋轉眼鏡*1、鋼鐵*100<br>中央玩具商人購買、赤蒼蠅、綠蒼蠅、巨石怪' },
  { name: '醫師髮箍', effect: 'INT+1', materials: '頭巾*1、鐵*50、受損的鑽石*1<br>刺刀哥布靈、蒼蠅、蛇女伊絲' },
  { name: '狐狸面具', effect: 'AGI+1、LUK+1', materials: '狐狸尾巴*999<br>九尾狐' },
  { name: '熱血髮圈', effect: 'STR+2', materials: '小雞卡片*1、方頭巾*1、白色染料*1<br>小雞、斐揚防具商人、旮八獨力漢製作' },
  { name: '藍色魚', effect: '對魚貝型的物理攻擊力+10%', materials: '腐臭之魚*1、腐爛鱗片*30、生魚片*5、魚尾*1<br>邪骸食人魚、異變魚、劍魚' },
  { name: '遮陽帽', effect: 'AGI+1', materials: '穀物*100、強韌木藤條*30<br>食材商人、森林妖姬' },
  { name: '墨西哥帽', effect: 'AGI+1', materials: '遮陽帽*1、仙人掌刺*50<br>努梅羅兌換、摩卡' },
  { name: '毛帽', effect: 'LUK+1', materials: '無邊帽*1、毛*50、羽毛*50、柔毛*10<br>防具商人、綠棉蟲、小雞、瘋兔' },
  { name: '耳機', effect: '詛咒抗性+10%', materials: '鋼鐵*10、酒精*1、煤礦*1<br>赤蒼蠅、綠蒼蠅、巨石怪、蛙王、黑菇、紅菇、邪骸礦工' },
  { name: '耳罩', effect: '詛咒抗性+10%', materials: '詛咒紅寶石*1、柔毛*200、耳機*1<br>腐屍、瘋兔、鄭何義嘉製作' },
  { name: '氧氣罩', effect: '毒抗性+20%', materials: '歐拉歐拉*1<br>白鼠' },
  { name: '羽毛帽', effect: 'AGI+1', materials: '回憶帽*1、羽毛*300<br>蝗蟲之王、小雞' },
  { name: '草帽', effect: 'AGI+1', materials: '瑪哪樹枝*120<br>樹精' }
]

// 🎨 染料製作
const dyeList = [
  { name: '紅色染料', materials: '紅色藥草*30、中和劑*1、空瓶*1' },
  { name: '黃色染料', materials: '黃色藥草*30、中和劑*1、空瓶*1' },
  { name: '藍色染料', materials: '藍色藥草*20、中和劑*1、空瓶*1' },
  { name: '綠色染料', materials: '藍色藥草*5、黃色藥草*20、綠色藥草*20、中和劑*1、混合劑*1、空瓶*1' },
  { name: '赤色染料', materials: '紅色藥草*20、黃色藥草*20、中和劑*1、混合劑*1、空瓶*1' },
  { name: '紫色染料', materials: '紅色藥草*30、藍色藥草*10、中和劑*1、混合劑*1、空瓶*1' },
  { name: '白色染料', materials: '白色藥草*30、中和劑*1、空瓶*1' },
  { name: '黑色染料', materials: '紅色藥草*30、黃色藥草*30、綠色藥草*30、藍色藥草*5、中和劑*1、混合劑*1、空瓶*1' }
]

// 🧪 中和劑 / 混合劑
const chemList = [
  { name: '中和劑', materials: '酒精*1、帝特立米藥水*1、空瓶*1' },
  { name: '混合劑', materials: '酒精*1、卡勒波迪藥水*1、空瓶*1' }
]

// ★ 高亮文字處理
function formatText(t) {
  return t.replace(/★([^、<]+)/g, '<span class="star">★$1</span>')
}
onMounted(() => {
  document.title = 'RO樂園-物品製作';
})
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: 40px auto;
  padding: 20px;
  color: #fff;
  font-family: "Microsoft JhengHei", sans-serif;
  background: #3a2c1f;
  border-radius: 12px;
}
.title {
  text-align: center;
  color: #ffe600;
  font-size: 2em;
  margin-bottom: 30px;
}
.table-section {
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
}
h2 {
  color: #f8d74b;
  border-left: 5px solid #ffe600;
  padding-left: 10px;
  margin-bottom: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  line-height: 1.6;
}
th {
  background: rgba(255,255,255,0.08);
  color: #ffe600;
}
.star {
  color: #ffb347;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 200, 100, 0.8);
}
</style>
