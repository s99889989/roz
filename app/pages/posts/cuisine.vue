<template>
  <div class="container">
    <h1 class="title">🍴 六屬性料理一覽表</h1>

    <!-- 屬性切換按鈕 -->
    <div class="tabs">
      <button
          v-for="attr in attributes"
          :key="attr"
          :class="{ active: attr === current }"
          @click="current = attr"
      >
        {{ attr }}（{{ attrNames[attr] }}）
      </button>
    </div>

    <!-- 單一表格：顯示目前屬性 -->
    <div class="table-wrapper">
      <h2>{{ current }}（{{ attrNames[current] }}）料理</h2>
      <table>
        <thead>
        <tr>
          <th>料理名稱</th>
          <th>等級</th>
          <th>材料</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in recipes[current]" :key="i">
          <td>{{ item.name }}</td>
          <td>{{ item.level }}</td>
          <td v-html="formatMaterials(item.materials)"></td>
        </tr>
        </tbody>
      </table>
    </div>

    <p class="note">★為食材商人所購買　其餘為怪物掉落素材</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref('STR')
const attributes = ['STR', 'INT', 'DEX', 'AGI', 'VIT', 'LUK']
const attrNames = {
  STR: '力量',
  INT: '智力',
  DEX: '靈巧',
  AGI: '敏捷',
  VIT: '體質',
  LUK: '幸運'
}

// ✅ 修正版格式化函數：★變色 + 特殊字樣金黃
const formatMaterials = (text) => {
  return text
      .replace(/★([^、]+)/g, '<span class="star">★$1</span>')
      .replace(/\n/g, '<br>')
}

// ✅ 資料只展示部分作範例（你可保留完整）
const recipes = {
  STR: [
    { name: '蚱蜢熱炒', level: 1, materials: '蝗蟲後腿(重金屬蝗蟲、搖滾蝗蟲)、★食用油' },
    { name: '涼拌水蹼', level: 2, materials: '粘糊的蹼(達拉蛙、羅達蛙)、綠色藥草、黃色藥草、★清爽特調醬' },
    { name: '爆炸牛排', level: 3, materials: '肉、破舊平底鍋、綠色藥草、★紅辣椒、★辣調味料' },
    { name: '藥草淹製排骨', level: 4, materials: '肉、紅色藥草、黃色藥草、綠色藥草、★甜調味料、檸檬' },
    { name: '薑餅城太太的煎餅', level: 5, materials: '蕃薯、蜂蜜、★食用油、紅蘿蔔、★穀物' },
    { name: '閃亮的刷刷肉', level: 6, materials: '肉、蜂蜜、黃色藥草、瑪絲黛拉果實、發亮鱗片' },
    { name: '乳豬BBQ', level: 7, materials: '肉、火種、煤礦、★辣醬、瑪哪樹枝、白色藥草' },
    { name: '特製熊掌料理', level: 8, materials: '熊掌、紅蘿蔔、南瓜頭、蘆薈葉子、西納雷葉子、★純調味料' },
    { name: '煸炒血管', level: 9, materials: '血管、★鍋子、起士、★辣醬、煤礦、綠色藥草、墨汁' },
    { name: '舌頭料理', level: 10, materials: '細長舌頭、★鍋子、酒精、蘆薈汁液、★辣醬、蜂膠、天地樹葉子、藍色藥水' }
  ],
  INT: [
    { name: '葡汁藥草茶', level: 1, materials: '葡萄、★紅色藥水' },
    { name: '滿葉的紅茶', level: 2, materials: '藍色藥草、黃色藥草、紅色藥草' },
    { name: '藥草蜂蜜茶', level: 3, materials: '蜂蜜、白色藥草、★黃色香料' },
    { name: '夢羅克水果酒', level: 4, materials: '草莓、檸檬、柳橙、酒精、葡萄' },
    { name: '瑪絲黛拉酒', level: 5, materials: '瑪絲黛拉果實、藍色藥水、酒精、檸檬、★黃色香料' },
    { name: '紅色香菇水果酒', level: 6, materials: '★食用香菇、葡萄汁、香菇芽孢、酒精、★紅色香料' },
    { name: '特製蜂膠藥草茶', level: 7, materials: '蜂膠、蜂蜜、白色藥草、西納雷葉子、★黃色香料' },
    { name: '王室專用高級茶', level: 8, materials: '榴槤、西納雷葉子、★天地樹葉子、蜂膠、★黃色香料' },
    { name: '特力斯坦12年產', level: 9, materials: '★天地樹葉子、柳橙、酒精、蜂膠、藍色藥水、★黃色香料、蘆薈葉子' },
    { name: '雞尾酒龍的呼吸', level: 10, materials: '噬人樹根、哀唱草、蘆薈葉子、蜂膠、檸檬、榴槤、天地樹果實、藍色藥草' }
  ],
  DEX: [
    { name: '蜂蜜葡萄汁', level: 1, materials: '葡萄、★紅色藥水' },
    { name: '巧克力慕斯蛋糕', level: 2, materials: '可可、小蛋糕、牛奶、白色盤子' },
    { name: '水果刨冰', level: 3, materials: '蘋果、香蕉、柳橙、草莓、★黃色香料' },
    { name: '奶油三明治', level: 4, materials: '★麵包、牛奶、起士、黃色藥草、肉、★甜調味料' },
    { name: '綠色沙拉', level: 5, materials: '西納雷葉子、蘆薈葉子、尖銳的葉子、巨大葉子、★甜調味料、★黃色香料' },
    { name: '蜜桃蛋糕', level: 6, materials: '石榴桃、小蛋糕、起士、牛奶、濃縮柳橙汁、★甜調味料' },
    { name: '靈魂出竅麵包', level: 7, materials: '★麵包、瑪絲黛拉果實、★甜調味料、曼特花、返魂符、青澀蘋果' },
    { name: '特別的土司', level: 8, materials: '★麵包、蜂膠、肉、草莓、★辣醬、起士、★甜調味料' },
    { name: '天上的水果汁', level: 9, materials: '青澀蘋果、柳橙、草莓、★紅色香料、魔物香蕉、葡萄汁、酒精' },
    { name: '禾貝勒開米勒之酒', level: 10, materials: '天地樹果實、冰塊一角、菌絲、蜂膠、集中藥水、酒精、榴槤、幻想花' }
  ],
  AGI: [
    { name: '青蛙蛋湯', level: 1, materials: '★穀物、青蛙蛋' },
    { name: '滑潤潤的麵條', level: 2, materials: '★穀物、★純調味料、南瓜頭、紅蘿蔔' },
    { name: '觸鬚起士湯', level: 3, materials: '觸鬚、起士、美味蕃薯、★甜調味料' },
    { name: '薑餅城辣涼麵', level: 4, materials: '★穀物、★辣醬、冰塊一角、紅蘿蔔、南瓜頭' },
    { name: '蝙蝠翅膀蒸南瓜', level: 5, materials: '紅色蝙蝠翅膀、南瓜頭、★鍋子、西納雷葉子、紅色藥草' },
    { name: '紅辣椒蝦湯', level: 6, materials: '★紅辣椒、★蝦子、★甜調味料、檸檬' },
    { name: '鱷魚烤肉蔬菜蒸', level: 7, materials: '虎蜥皮、南瓜頭、紅蘿蔔、蘆薈葉子、黃色藥草、★黃色香料' },
    { name: '超辣咖哩+9', level: 8, materials: '蘆薈枝液、★辣醬、肉、西納雷葉子、南瓜頭、紅蘿蔔' },
    { name: '特製佛跳腸', level: 9, materials: '肉、蜂膠、芽苗、★純調味料、黃色藥草、白色藥草、紅色藥草' },
    { name: '蒸沙漠蠍子', level: 10, materials: '蠍子尾巴、蠍子之螯、蘆薈汁液、★天地樹葉子、苦味草、蜂膠、★辣醬、★鍋子' }
  ],
  VIT: [
    { name: '蒸蟹之螯', level: 1, materials: '鉗子、綠色藥草、★紅色藥水' },
    { name: '海產物料理', level: 2, materials: '蛤蜊肉、鰓刺、背鰭、★好吃的魚' },
    { name: '蛤蜊湯', level: 3, materials: '蛤蜊肉、海螺、蜂蜜、★甜調味料' },
    { name: '涼拌海蜇皮', level: 4, materials: '觸鬚、白色藥草、柔軟的草葉、破舊平底鍋、墨汁' },
    { name: '甜辣煎餃', level: 5, materials: '餃子、黃色藥草、★辣醬、★紅色香料、綠色藥草' },
    { name: '非常苦的補藥', level: 6, materials: '褐色樹根、噬人樹根、香菇芽孢、★食用香菇、蜂蜜' },
    { name: '特製山珍海味', level: 7, materials: '魚尾、蘆薈葉子、野豬毛、★好吃的魚、★寵物飼料、★甜調味料' },
    { name: '巨大包葉料理', level: 8, materials: '樹葉衣、肉、彩色紅蘿蔔、南瓜頭、★純調味料、★穀物' },
    { name: '昇龍湯', level: 9, materials: '龍皮、龍尾、★天地樹葉子、蜂膠、★辣醬、★紅色香料、營養蚯蚓' },
    { name: '不死之湯', level: 10, materials: '不死心臟、亡者遺物、天地樹芽、曼特療傷藥、人魚之心、★辣醬、返魂符、苦味草' }
  ],
  LUK: [
    { name: '猴子尾巴熱炒', level: 1, materials: '猴子尾巴、★食用油' },
    { name: '混合果汁', level: 2, materials: '蘋果汁、紅蘿蔔汁、葡萄汁、柳橙汁' },
    { name: '拔絲地瓜', level: 3, materials: '番薯、美味蕃薯、魔物番薯、★甜調味料' },
    { name: '人魚料理', level: 4, materials: '人魚嘴巴、變身葉子、白色藥草、★好吃的魚、★甜調味料' },
    { name: '蠍子熱炒', level: 5, materials: '蠍子尾巴、昆蟲後腳、巨大葉子、破舊平底鍋、★食用油' },
    { name: '開運湯', level: 6, materials: '爬蟲類舌頭、細長舌頭、三葉幸運草、魔女之星沙、蘆薈' },
    { name: '燒烤肉串', level: 7, materials: '鱗片皮膚、鰓刺、柔軟的草葉、肉、★食用香菇、海產物料理' },
    { name: '草莓飯糰', level: 8, materials: '草莓、★穀物、樹葉衣、★黃色香料、★紅色香料、★純調味料' },
    { name: '血腥蘇打', level: 9, materials: '家畜血、曼特療傷藥、蘆薈汁液、酒精、蜂膠、★紅色香料、蘋果汁' },
    { name: '九尾狐尾巴料理', level: 10, materials: '狐狸尾巴、四葉幸運草、噬人樹根、尖銳的葉子、★天地樹葉子、★純調味料、★黃色香料、迷幻藥' }
  ]
}
</script>

<style scoped>
body {
  background-color: #3a2c1f;
  color: #fff;
  font-family: "Microsoft JhengHei", sans-serif;
}

.container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
}

.title {
  text-align: center;
  color: #ffe600;
  font-size: 2em;
  margin-bottom: 20px;
}

.tabs {
  text-align: center;
  margin-bottom: 25px;
}

button {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: none;
  padding: 10px 18px;
  margin: 0 5px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
button.active {
  background: #ffe600;
  color: #3a2c1f;
  font-weight: bold;
}
button:hover {
  background: #ffea80;
  color: #3a2c1f;
}

.table-wrapper {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  line-height: 1.5;
}

th {
  color: #ffe600;
  background: rgba(255,255,255,0.08);
}

.star {
  color: #ffb347; /* ★金橘色 */
  font-weight: bold;
  text-shadow: 0 0 6px rgba(255, 184, 77, 0.6);
}

.note {
  text-align: center;
  margin-top: 10px;
  color: #ccc;
  font-size: 14px;
}
</style>
