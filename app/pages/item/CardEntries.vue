<template>
  <div class="cards-page p-6 bg-[#f5ecd8] text-[#4b2e1e] w-full xl:w-1/2 min-h-screen">
    <h1 class="text-3xl font-bold mb-4 text-center">卡片總覽</h1>

    <div class="controls mb-4 flex gap-2">
      <input v-model="query" placeholder="搜尋卡片名稱 / 別稱 / 效果" class="flex-1 p-2 border rounded" />
<!--      <select v-model="filterCategory" class="p-2 border rounded">-->
<!--        <option value="全部">全部類別</option>-->
<!--        <option value="武器">武器</option>-->
<!--        <option value="頭飾">頭飾</option>-->
<!--        <option value="鎧甲">鎧甲</option>-->
<!--        <option value="盾牌">盾牌</option>-->
<!--        <option value="披肩">披肩</option>-->
<!--        <option value="鞋子">鞋子</option>-->
<!--        <option value="裝飾品">裝飾品</option>-->
<!--      </select>-->
      <button @click="clear" class="px-4 py-2 bg-[#d3b37a] rounded">清除</button>
    </div>

    <div class="grid gap-6">
      <section v-for="(list, cat) in grouped" :key="cat" class="bg-white rounded shadow p-4">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-xl font-bold">{{ cat }}（{{ list.length }}）</h2>
          <button @click="toggle(cat)" class="px-3 py-1 border rounded">{{ opened[cat] ? '收合' : '展開' }}</button>
        </div>

        <transition name="fade">
          <div v-show="opened[cat]">
            <table class="w-full table-auto border-collapse">
              <thead class="bg-[#e8d3a8]"><tr>
                <th class="p-2 border">卡片名稱</th>
                <th class="p-2 border">卡片別稱</th>
                <th class="p-2 border">卡片效果</th>
              </tr></thead>
              <tbody>
              <tr v-for="c in list" :key="cat + c.name" class="odd:bg-[#fffef6] even:bg-[#f7f0df]">
                <td class="p-2 border font-semibold">{{ c.name }}</td>
                <td class="p-2 border">{{ c.alias }}</td>
                <td class="p-2 border whitespace-pre-wrap">{{ c.effect }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref, computed, onMounted} from 'vue';

const query = ref('');
const filterCategory = ref('全部');
const opened = reactive({ 武器: false, 頭飾: false, 鎧甲: false, 盾牌: false, 披肩: false, 鞋子: false, 裝飾品: false });
const toggle = (k) => { opened[k] = !opened[k]; };
const clear = () => { query.value = ''; filterCategory.value = '全部'; };

// 資料來源：使用者提供文本，已整理為陣列
const weapons = [
  { name: '綠棉蟲', alias: '體質', effect: 'VIT+1。\nMHP+100。' },
  { name: '土波利', alias: '靈巧', effect: 'DEX+1。\n命中率+3。' },
  { name: '瘋兔', alias: '洛基', effect: 'LUK+1。\nCRI+1。\n完全迴避+1。' },
  { name: '大嘴鳥蛋', alias: '惡魔之眼', effect: '對無形敵人的物理攻擊力+20%。' },
  { name: '小野豬', alias: '暈眩', effect: '物理攻擊時,有5%的機率使敵人陷入暈眩狀態。' },
  { name: '蜂兵', alias: '瑪特', effect: 'STR+1。\nATK+3。' },
  { name: '吸血蝙蝠', alias: '閃爍', effect: '攻擊敵人時,有5%的機率使敵人陷入黑暗狀態。\nATK+5。' },
  { name: '漂浮蟲', alias: '昏睡', effect: '攻擊敵人時,有5%的機率使敵人陷入沉睡狀態。\nATK+5。' },
  { name: '邪骸戰士', alias: '金', effect: '攻擊敵人時,有2%的機率使敵人陷入暈眩狀態。\nATK+10。' },
  { name: '浮勒盜蟲', alias: '薛魯德', effect: 'AGI+1。\n迴避+1。' },
  { name: '狼', alias: '狼獾', effect: 'ATK+15。\nCRI+1。' },
  { name: '曼陀蘿魔花', alias: '溫蒂', effect: '對風屬性敵人的物理傷害+20%。' },
  { name: '海葵', alias: '血腥', effect: '對玩家型、人類型的物理攻擊力+20%。' },
  { name: '青蛇', alias: '不可觸碰', effect: '攻擊敵人時,有5%的機率使敵人中毒。\nATK+5。' },
  { name: '白蟻', alias: '颶風', effect: 'ATK+20。' },
  { name: '螃蟹', alias: '火焰', effect: '對火屬性敵人的物理傷害+20%。' },
  { name: '水母', alias: '冰', effect: '攻擊敵人時,有5%的機率使敵人陷入冰凍狀態。\nATK+5。' },
  { name: '重金屬蝗蟲', alias: '沉默', effect: '攻擊敵人時,有5%的機率使敵人陷入沉默狀態。\nATK+5。' },
  { name: '哥布靈', alias: '吶喊', effect: '對喵族、動物型的物理攻擊力+20%。' },
  { name: '刺蝟蟲', alias: '殺蟲', effect: '對昆蟲型的物理攻擊力+20%。' },
  { name: '蠍子', alias: '化學', effect: '對植物型的物理攻擊力+20%。' },
  { name: '紅蝙蝠', alias: '抗水屬性', effect: '對水屬性敵人的物理傷害+20%。' },
  { name: '巨石怪', alias: '堅韌', effect: '可使武器完全不受損。\nATK+5。' },
  { name: '魔鍋蛋', alias: '詛咒', effect: '攻擊敵人時,有5%的機率使敵人陷入受詛咒的狀態。\nATK+5。' },
  { name: '噬人花', alias: '費舍', effect: '對魚貝型敵人的物理攻擊力+20%。' },
  { name: '邪骸獸人', alias: '抗聖屬性', effect: '對聖屬性敵人的物理傷害+20%。' },
  { name: '邪骸士兵', alias: '必殺攻擊力', effect: 'CRI+9。' },
  { name: '邪骸礦工', alias: '堅毅', effect: 'ATK+5。\n對中型的物理攻擊力+15%。' },
  { name: '邪骸弓箭手', alias: '國王', effect: '遠距離攻擊傷害+10%。' },
  { name: '兹諾克', alias: '毒液魔', effect: '攻擊敵人時,有4%的機率使敵人中毒。\nATK+10。' },
  { name: '諾可伊', alias: '混沌', effect: '攻擊敵人時,有5%的機率使敵人陷入混亂的狀態。' },
  { name: '木乃伊', alias: '狂暴', effect: '命中率+20。' },
  { name: '海神', alias: '交叉', effect: '對惡魔型敵人的物理攻擊力+20%。' },
  { name: '黑蛇', alias: '混合', effect: '可使用[二刀連擊]Lv.1。\n熟練二刀連擊技能時，依照熟練等級的發動機率而定。' },
  { name: '畢帝特地龍', alias: '龍騎士', effect: '對龍族型的物理攻擊力+20%。' },
  { name: '狄奧斯', alias: '水精靈', effect: '對人類型、玩家型、動物型、植物型、昆蟲型敵人造成的物理攻擊力+7%。' },
  { name: '米洛斯', alias: '泰斗', effect: 'ATK+5。\n對大型怪物造成的物理攻擊力+15%。' },
  { name: '卡拉蟹', alias: '癌症', effect: 'ATK+5。\n對海星造成的物理攻擊力+30%。\n(與卡拉蟹、貝殼魔靈、海星卡片組合效果：打死魚貝類怪物時，有機率掉落生魚片)。' },
  { name: '哥布靈首領', alias: '致命哥布靈', effect: '對哥布靈系列怪物造成的物理攻擊力+30%。' },
  { name: '噴射哥布靈', alias: '致命火焰', effect: '暴擊傷害+10%,對無形怪物進行攻擊時CRI+7。' },
  { name: '弓箭哥布靈', alias: '剛強潛能', effect: '暴擊傷害+10%,對不死型怪物進行攻擊時CRI+7。' },
  { name: '奈利蟲', alias: '動物奪魂者', effect: '每次近距離物理擊殺動物型怪物時，SP恢復5。\n解除裝備時，SP減少5。' },
  { name: '爆鑽傘蜥', alias: '天龍奪魂者', effect: '每次近距離物理擊殺龍族怪物時，SP恢復5。\n解除裝備時，SP減少5。' },
  { name: '直升機哥布靈', alias: '致命雙魚宮', effect: '暴擊攻擊時傷害+10%。\n對魚貝型怪物進行攻擊時,CRI+7。' },
  { name: '半龍人', alias: '燃燒', effect: 'TK+15、物理攻擊時,有機率自動念咒、火球術Lv.3技能。\n習得火球術Lv.10技能時,會代替施展火球術Lv.10技能。' },
  { name: '石砲火樹', alias: '射擊', effect: '命中率+10。\nATK+10。' },
  { name: '海星', alias: '水母', effect: 'ATK+5。\n對貝殼魔靈造成的物理攻擊力+30%。' },
  { name: '獸人女戰士', alias: '粉碎', effect: '對獸人系列敵人造成的物理攻擊力+30%。' },
  { name: '貝殼魔靈', alias: '殼', effect: 'ATK+5。\n對卡拉蟹造成的物理攻擊力+30%。' },
  { name: '魔靈娃娃', alias: '紳士接觸', effect: '物理攻擊時，以一定的機率自動念咒對敵人施展治癒術Lv.5技能。' },
  { name: '玩具士兵', alias: '裝袋的', effect: '暴擊傷害+10%。對喵族、動物型的CRI+7。' },
  { name: '巨象甲蟲', alias: '西佛斯奪魂者', effect: '每次近距離物理擊殺魚貝型魔物時，SP恢復5。\n解除裝備時，SP-5。' },
  { name: '三葉蟲', alias: '強力吸取', effect: '每次近距離物理擊殺無形怪物時，SP恢復5。\n解除裝備時，SP減少5。' },
  { name: '狂暴哥布靈', alias: '致命闇●邪心獵人', effect: '暴擊傷害+10%,對惡魔型的CRI+7。' },
  { name: '海豹寶寶', alias: '心靈', effect: '命中率+10，迴避率+3。\n服事系列角色裝備時，對惡魔型與不死型怪物的CRI+9。' },
  { name: '流氓', alias: '光圈', effect: '暴擊傷害+15%,當盜賊系列角色裝備時,CRI+4。' },
  { name: '赤蒼蠅', alias: '惡毒', effect: '物理攻擊時，以一定機率5秒內每1秒恢復HP100。' },
  { name: '深淵騎士', alias: '進擊', effect: '對BOSS怪物造成的物理傷害額外提高25%'}
  ,{ name: '暗黑祭司', alias: '吸魂術', effect: '攻擊時，以小機率降低敵人的SP。\n賢者或智者裝備時，每次命中怪物時SP恢復1。' },
  { name: '邪惡使者', alias: '延伸的', effect: '物理攻擊時，以一定機率對敵人發動自動念咒音速投擲1技能。\n裝備艾斯恩魔女卡片時，可使ATK+20、LUK+3。' },
  { name: '血腥騎士', alias: '隕石之光', effect: '普通攻擊時，以一定機率施放隕石術Lv1。(遠距離觸發率為一半)\n近距離攻擊時，以一定機率使敵人暈眩。\n隕石術擊中敵人時，以一定機率使敵人黑暗、混亂、沉默。(武器精煉度提升時，觸發機率提升)' },
  { name: '阿修羅狂戰士', alias: '奪魂者', effect: '每次近距離物理擊殺人類型敵人時，SP恢復5。\n解除裝備時，SP減少5。' },
  { name: '卡崙寶寶', alias: '凍僵術', effect: '普通攻擊時，以一定機率的自動念咒施展冰凍術3技能。' },
  { name: '海盜之王', alias: '寶球無極', effect: '對中型、小型和大型魔物的傷害100%。' }
];

const headgear = [
  { name: '樹精', alias: '智慧', effect: 'MSP+80。' },
  { name: '瓢蟲', alias: '貴族的', effect: '沉默抗性+20%。\nDEF+1。' },
  { name: '松鼠', alias: '寶球泥人', effect: '睡眠抗性+20%\nDEF+1。' },
  { name: '土撥鼠', alias: '寶球教士', effect: '黑暗抗性+20%\nDEF+1。' },
  { name: '長老樹精', alias: '艾柳達伊特', effect: 'INT+2。' },
  { name: '基爾瑟', alias: '命令', effect: '可避免陷入混亂的狀態。\n對地屬性的抗性+15%。' },
  { name: '綠腐屍', alias: '毒蛇', effect: '中毒抗性+20%。\nDEF+1。' },
  { name: '馬爾杜克', alias: '沉默', effect: '可避免陷入沉默的狀態。' },
  { name: '小惡魔', alias: '暗黑', effect: '可避免陷入黑暗的狀態。\nSTR+1。' },
  { name: '夢魘', alias: '睡眠', effect: '可避免陷入睡眠的狀態。\nAGI+1。' },
  { name: '森林妖姬', alias: '寶球綠色石頭', effect: '每次擊殺植物型怪時,有機率得到地靈礦石。\n對地屬性攻擊的抗性+10%。' },
  { name: '邪惡禮盒', alias: '方塊', effect: '每次殺死怪物時，以一定機率掉落禮物箱。' },
  { name: '鐘乳巨石怪', alias: '抵抗暈眩', effect: '暈眩抗性+20%。' },
  { name: '伍坦彈弓箭手', alias: '混亂防禦的', effect: 'DEF+1。\n混亂抗性+20%。' },
  { name: '伍坦戰士', alias: '出血防禦的', effect: 'DEF+1。\n出血抗性+20%。' },
  { name: '藍鼠', alias: '貪婪', effect: '每次擊敗怪物時，以一定機率獲得一定量的「金幣」。\n同時裝備白鼠卡片時，STR+3。' },
  { name: '寶貝波利', alias: '菜鳥', effect: 'LUK+1。\n與克里圖拉學院帽一起裝備時,ATK+5、MATK+5。' },
  { name: '飛行魔書', alias: '智慧', effect: 'INT+1。\n服事系列角色裝備時，INT+1、MDEF+1。' },
  { name: '迷幻之王', alias: '寶球魔咒大師', effect: 'MAXHP-10%、MAXSP-10%。\n變動詠唱-10%。' },
  { name: '卡拉特小丑', alias: '超高等級', effect: 'INT+2。\n精煉度為9以上時，可使MAXSP+150。' },
  { name: '獸人英雄', alias: '中性', effect: '免疫暈眩。\nVIT+3。' }
];

const armors = [
  { name: '波利', alias: '洛基', effect: 'LUK+2。\n完全迴避+1。' },
  { name: '蟲蛹', alias: '哈德', effect: 'MHP+700。' },
  { name: '小雞', alias: '超異', effect: 'STR+1。\nATK+10。' },
  { name: '蛋殼小雞', alias: '動力', effect: 'VIT+1。\nMHP+100。' },
  { name: '羅達蛙', alias: '寶球冠軍', effect: 'MHP+400。\nMSP+50。' },
  { name: '盜蟲', alias: '迅速', effect: 'AGI+1。' },
  { name: '搖滾蝗蟲', alias: '熟練', effect: 'DEX+1。\nATK+5。' },
  { name: '沙漠幼狼', alias: '寶球沙漠', effect: 'INT+1。' },
  { name: '大嘴鳥', alias: '寶球烏賊', effect: 'MHP+10%。' },
  { name: '綠蒼蠅', alias: '寶球海曼', effect: 'DEF+2。\n對風屬性敵人的抗性+10%。' },
  { name: '幽靈波利', alias: '幽靈', effect: '可將鎧甲的屬性轉變為念力屬性。\nHP恢復率-25%。' },
  { name: '天使波利', alias: '神聖', effect: '盔甲的屬性為聖屬性。' },
  { name: '卡那多斯', alias: '永恆', effect: '可使鎧甲完全不受損。\nDEF+1。' },
  { name: '野豬', alias: '寶球痊癒術', effect: 'VIT+3。' },
  { name: '異變魚', alias: '水精靈', effect: '可將鎧甲的屬性轉變為水屬性。\nDEF+1。' },
  { name: '土人', alias: '寶球風靈之矛', effect: '可將鎧甲的屬性轉變為風屬性。\nDEF+1。' },
  { name: '帕莎納', alias: '寶球伊夫利特', effect: '可將鎧甲的屬性轉變為火屬性。\nDEF+1。' },
  { name: '泥人', alias: '寶球傢伙', effect: '可將鎧甲的屬性轉變為地屬性。\nDEF+1。' },
  { name: '馬克', alias: '冰凍', effect: '可避免陷入冰凍的狀態。\n對水屬性的抗性+5%。' },
  { name: '艾吉歐蜈蚣', alias: '中毒的', effect: '可將鎧甲的屬性轉變為毒屬性。\nDEF+1。' },
  { name: '雪熊', alias: '寶球普立茲', effect: '造成物理傷害時，以一定機率對敵人施加冰凍效果。' },
  { name: '虎蜥人', alias: '明鏡止水的', effect: '造成物理傷害時，以一定機率使用自動念咒心神凝聚1技能。\n如學會心神凝聚10，會改用10技能。' },
  { name: '機木人', alias: '寶球自然', effect: 'HP恢復力+30%。\nDEF+1。' },
  { name: '單眼蟲', alias: '寶球史東克兹', effect: '受到物理傷害時,有機率讓敵人陷入石化。\nINT77以上時,有較高機率石化。' },
  { name: '闇神官', alias: '致命', effect: '可將鎧甲的屬性轉變為不死屬性。' },
  { name: '鏡妖', alias: '硬化的', effect: '受到物理傷害時，以一定機率對敵人施加石化。' },
  { name: '瑞比歐', alias: '寶球暈眩', effect: '受到物理傷害時，以一定機率對敵人施加眩暈效果。\nDEX77以上時，以更高機率造成昏迷效果。' },
  { name: '狂暴米諾斯', alias: '保有暈眩', effect: '受到物理傷害時，以一定機率對敵人施加昏迷。' },
  { name: '邪骸戰俘', alias: '寶球睡眠', effect: '受到物理傷害時，以一定機率對敵人施加睡眠效果。\n裝備邪骸戰士卡片時，以更高機率施加睡眠。' },
  { name: '凱美拉', alias: '寶球毒藥蓄力', effect: '造成物理傷害時，以一定機率對敵人施加中毒效果。\n盜賊或十字刺客裝備時，以更高機率。' },
  { name: '獸人酋長', alias: '鏡子', effect: '受到近距離物理攻擊的傷害反射30%。' },
  { name: '塔奧群卡', alias: '高風險', effect: 'MHP+50%。\n裝備者讓道具物理/魔法防禦力固定為一半。' }
];

const shields = [
  { name: '盜蟲卵', alias: '僵硬的', effect: 'MHP+400。' },
  { name: '蟻卵', alias: '卓越的', effect: 'MHP+5%。' },
  { name: '蝸牛', alias: '寶球戰神', effect: 'DEF+2。' },
  { name: '鍬形蟲', alias: '沉重', effect: '受到遠距離物理攻擊傷害-35%。' },
  { name: '突變蛙', alias: '骷髏', effect: '對玩家型、人類型的抗性+30%。' },
  { name: '獸人戰士', alias: '殘爆', effect: '對動物型敵人的抗性+30%。' },
  { name: '邪骸食人魚', alias: '原子', effect: '冰凍抗性+20%。\nDEF+1。' },
  { name: '大腳熊', alias: '寶球巨屍', effect: '對昆蟲型敵人的抗性+30%。' },
  { name: '艾斯蜘蛛', alias: '催眠', effect: '石化抗性+20%。\nDEF+1。' },
  { name: '殭屍', alias: '護身符', effect: '石化抗性+15%。\n對地屬性的抗性+5%。\nDEF+1。' },
  { name: '畢帝特飛龍', alias: '寶球龍騎士', effect: '對龍族型敵人的抗性+30%。' },
  { name: '米杜莎', alias: '石化', effect: '可避免陷入石化的狀態。\n對惡魔型敵人的抗性+15%。' },
  { name: '安畢斯', alias: '邪惡', effect: '對天使型的抗性+30%。' },
  { name: '卷甲蟲', alias: '寶球抵抗特殊力量', effect: '精煉5以下時，DEF+2、MDEF+3。' },
  { name: '狂暴木乃伊', alias: '閃亮十字', effect: '物理攻擊時，以一定機率使用自動念咒天使之光Lv.5技能。\n同時裝備木乃伊卡片時，誘導攻擊率+20%。' },
  { name: '苗娃佩瑞絲', alias: '剛強掩護', effect: 'DEF+1。\n對無屬性的抗性+5%。' },
  { name: '黃金蟲', alias: '寶球德夫', effect: 'MDEF+250。\n裝備者的DEF-90%。' },
  { name: '蟻后', alias: '寶球阻擋', effect: '念屬性、風屬性攻擊抗性+20%。\n火屬性、暗屬性攻擊抗性-15%。\n受到人類型、玩家型、動物型敵人的傷害-30%。' },
  { name: '卡利斯格', alias: '弗羅姆地獄', effect: '惡魔型敵人造成的傷害減少30%。' },
  { name: '史汀', alias: '超高等級', effect: 'DEF+2。\n精煉度為9以上時，可使MDEF+5。' },
  { name: '愛麗絲女僕', alias: '寶球皇家禁衛隊', effect: '受到首領階級的傷害-40%。\n受到一般階級的傷害+40%。' },
  { name: '艾斯恩魔女', alias: '寶球射擊大師', effect: 'LUK+2。\n技能「纏箭投擲」、「樂器攻擊」攻擊力增加10%。' }
];

const cloaks = [
  { name: '禿鷹', alias: '快速', effect: '迴避率+10。' },
  { name: '獵蠅', alias: '寶球溫斯', effect: '對風屬性攻擊的抗性+30%\n迴避率+5。' },
  { name: '獸人腐屍', alias: '天使', effect: '對不死屬性的抗性+30%\n迴避率+5。' },
  { name: '蚯蚓', alias: '輝煌', effect: '對地屬性的抗性+30%\n迴避率+5。' },
  { name: '傘蜥', alias: '鐵盾', effect: '可使用[偽裝]Lv.1技能。' },
  { name: '烏賊', alias: '吉尼斯', effect: '對水屬性的抗性+30%。\n迴避+5。' },
  { name: '白幽靈', alias: '嘲弄', effect: '受念屬性怪物的攻擊時,會+50%的傷害。\n迴避+20。' },
  { name: '麥斯特', alias: '無害的', effect: '對毒屬性的抗性+30%。\n迴避率+5。' },
  { name: '南瓜先生', alias: '火焰鐵盾', effect: '對火屬性的抗性+30%。\n迴避率+5。' },
  { name: '傀儡娃娃', alias: '寶球幽靈', effect: '對念屬性的抗性+30%。\n迴避率+5。' },
  { name: '蛇女伊絲', alias: '神聖的', effect: '對暗屬性的抗性+30%。\n迴避率+5。' },
  { name: '小巴風特', alias: '寶球流氓', effect: 'AGI+3。\nCRI+1。' },
  { name: '九尾狐', alias: '超高等級', effect: 'AGI+2。\n精煉9以上時,FLEE+20。' },
  { name: '刺尾蜻蜓', alias: '寶球弓箭大師', effect: 'AGI+1。\nFLEE+10。\n「二連矢」、「箭雨」技能的攻擊力增加5%。' },
  { name: '龍蠅', alias: '聚光', effect: 'AGI+1。\n同時裝備蒼蠅卡片時，迴避率+18。' },
  { name: '流浪之狼', alias: '狼人', effect: 'STR+1。\n同時裝備狼卡片時，迴避率+18。' },
  { name: '波利之王', alias: '高級洛基', effect: 'LUK+1。\n同時裝備波利卡片時，迴避率+18。' },
  { name: '蝗蟲之王', alias: '專家', effect: 'MDEF+3。\n同時裝備搖滾蝗蟲卡片時，迴避率+18。' },
  { name: '藍瘋兔', alias: '抵抗魔法', effect: 'VIT+1。\n同時裝備瘋兔卡片時，迴避率+18。' },
  { name: '巧克猴', alias: '中了精靈魔法的', effect: '完全迴避+5。\n迴避率+10。' },
  { name: '蛙王', alias: '寶球國王', effect: '完全迴避+1。\n同時裝備羅達蛙卡片時，迴避率+18。' },
  { name: '獸人嬰兒', alias: '超異高等級', effect: '對無屬性的抗性+10%。\n迴避率+10。\n精煉9以上時，對無屬性的抗性再+5%，迴避再+5。' },
  { name: '功夫熊貓聯名卡片', alias: '功夫熊貓', effect: '搭配「劍士」、「商人」、「盜賊」、「弓箭手」系列職業時，MAXHP+100。\n搭配「魔法師」、「服事」系列職業時，MAXSP+50。' },
  { name: '幽靈劍士', alias: '無敵', effect: '對無屬性攻擊的抗性增加20%。' },
  { name: '邪骸浪人', alias: '強制賦予', effect: '物理攻擊時，以一定機率施展自動念咒脅持1技能。\n盜賊系列角色裝備時，迴避率+20。' }
];

const shoes = [
  { name: '蒼蠅', alias: '光', effect: 'AGI+1。\n迴避率+2。' },
  { name: '腐屍', alias: '恢復的', effect: 'HP恢復力+20%。' },
  { name: '瑪勒盜蟲', alias: '寶球海爾梅斯', effect: 'AGI+2。' },
  { name: '轉轉蛋', alias: '寶球女巫', effect: 'SP恢復力+15%。' },
  { name: '黑狐', alias: '綠色', effect: 'MHP+10%。\nAGI+1。' },
  { name: '鬼女', alias: '靈魂強化', effect: 'MSP+15%。\nSP恢復力+3%。' },
  { name: '木乃伊犬', alias: '飛翔', effect: 'MHP/MSP+8%。' },
  { name: '奈吉鳥', alias: '史泰紐爾斯', effect: 'STR+1。\nVIT+1。' },
  { name: '人魚士兵', alias: '寶球衝刺', effect: 'HP恢復力+10%，SP恢復力+10%。\n套裝效果詳見說明。' },
  { name: '邪惡魔艾', alias: '寶球抵抗特殊力量', effect: '當精煉+5以下時，MDEF+7。' },
  { name: '狂暴野貓', alias: '翅膀', effect: 'AGI+1。\n盜賊系列角色裝備時，完全迴避+5。' },
  { name: 'XMAS甜餅人', alias: '墮落天使的', effect: '每次擊敗天使型怪物時獲得的經驗值增加10%。\n天使型怪物造成的物理傷害增加20%。' },
  { name: '腐屍戰俘', alias: '不死消除者的', effect: '每次擊敗不死型怪物時獲得的經驗值增加10%。\n不死型怪物造成的物理傷害增加20%。' },
  { name: '虎王', alias: '送信者', effect: '無限[霸體]。\nHP最大值減少25%。' },
  { name: '古埃及王', alias: '寶球保護', effect: '所有能力值+1。\n受到物理傷害時，以一定機率對自身施放霸邪之陣Lv10。\n當穿戴角色INT為99以上時，施放機率上升。' },
  { name: '黑暗之王', alias: '寶球笨重', effect: '受到物理傷害時，以一定機率使用自動念咒隕石術5技能。\n裝備迷幻之王卡片時，MAXHP+20%、MAXSP+20%。' }
];

const accessories = [
  { name: '魔菇', alias: '寶球孢子', effect: 'VIT+2。' },
  { name: '庫克雷', alias: '敏捷', effect: 'AGI+2。' },
  { name: '白鼠', alias: '雙重霧', effect: 'STR+2。' },
  { name: '波波利', alias: '解毒的', effect: '可使用[解毒]Lv.1技能。' },
  { name: '森靈', alias: '智慧', effect: 'DEX+2。' },
  { name: '摩卡', alias: '精力旺盛', effect: 'HP恢復力+10%。' },
  { name: '克瑞米', alias: '瞬間移動', effect: '可使用[瞬間移動]Lv.1技能。' },
  { name: '狸貓', alias: '隱匿', effect: '可使用[隱匿]Lv.1技能。' },
  { name: '毒魔菇', alias: '毒物', effect: '可使用[施毒]Lv.3技能。' },
  { name: '溜溜猴', alias: '寶球光芒', effect: '完全迴避+5。\nAGI+1。' },
  { name: '黑蟻', alias: '治癒術', effect: '可使用[治癒術]Lv.1。\n使用技能時，SP消耗量+25%。' },
  { name: '傑洛米', alias: '敏捷', effect: 'DEX+3。' },
  { name: '邪骸海盜', alias: '低價買進', effect: '可使用[低價買進]Lv.5技能。' },
  { name: '劍魚', alias: '詠唱之下', effect: '詠唱期間不會被中斷。\n變動詠唱時間+25%。' },
  { name: '螳螂', alias: '寶球力量', effect: 'STR+3。' },
  { name: '氣泡蟲', alias: '風暴衝擊', effect: '可使用[怒爆]Lv.3技能。' },
  { name: '人魚', alias: '治療術', effect: '可使用[治療術]Lv.1技能。' },
  { name: '鬼火', alias: '神視者', effect: '可使用[火狩]Lv.1技能。' },
  { name: '啤酒企鵝', alias: '多汁的', effect: '擊敗昆蟲型怪物時，以一定機率掉落蘋果、香蕉、紅蘿蔔汁。\n喝果汁時HP恢復量+50%。' },
  { name: '冰波利', alias: '寶球傑勒比結晶', effect: '每次擊殺怪物時,有機率會掉落傑勒比結晶或是巨大傑勒比結晶。' },
  { name: '邪惡箱', alias: '寶球藍色方塊', effect: '每次殺死怪物時，以一定機率掉落神秘箱子。' },
  { name: '妖道', alias: '擊退', effect: '物理攻擊時，有機率自動念咒、狂擊Lv.1技能。\n當使用狂擊技能時,讓敵人退後5格。\n從殭屍受到的傷害,+100%。' },
  { name: '鱷魚人', alias: '四葉幸運草的', effect: '受到的遠距離物理傷害-5%。' },
  { name: '將軍魔碑', alias: '魔力長矛', effect: '物理攻擊時,有機率可蒐集到氣球體。\n當裝備者是服事系列時,會增加蒐集到氣彈的機率。' },
  { name: '甜餅人', alias: '機會', effect: 'LUK+2。\n神聖之光傷害,+10%。' },
  { name: '海獺', alias: '寶球魚香味', effect: '每次殺死魚類型怪物時，以一定機率掉落明蝦壽司或生魚片。\n吃明蝦壽司或生魚片時，HP恢復量提升50%。' },
  { name: '綠色變色龍', alias: '寶球甜心', effect: '擊敗無形怪物時，以一定機率掉落水果刨冰。' },
  { name: '蝙蝠弓箭手', alias: '乾涸天空的', effect: '每次擊敗昆蟲型怪物時，以一定機率獲得「打雷的箱子」道具。' },
  { name: '幽靈弓箭手', alias: '陰森傢伙的', effect: '每次擊敗惡魔型怪物時，以一定機率獲得「怨恨的箱子」道具。' },
  { name: '惡靈', alias: '寶球微笑使者', effect: '每次擊敗不死型怪物時，以一定機率獲得「啼笑的箱子」道具。' },
  { name: '賢者蟲', alias: '寶球魔法石頭', effect: '每次擊敗怪物時，以一定機率獲得「礦石」。' },
  { name: '鴞裊男爵', alias: '寶球雙重力量', effect: '物理攻擊時，以一定機率對敵人發動天使之怒1技能。' },
  { name: '鴞裊首領', alias: '寶球神雷斯', effect: '物理攻擊時，以一定機率對自己發動自動念咒神威祈福3技能。\n和鴞裊男爵卡片一起裝備時，物理攻擊時以一定機率觸發自動念咒雷擊術5技能。' },
  { name: '風魔巫師', alias: '雷擊', effect: '物理攻擊時，以一定機率施展自動念咒雷鳴術3技能。\n學會雷鳴術10技能時，施展10技能雷鳴術代替3技能。' },
  { name: '皮里恩', alias: '全然', effect: 'HIT+100。' },
  { name: '月夜貓', alias: '急速', effect: '無限[加速術]。' },
  { name: '俄塞里斯', alias: '寶球永恆', effect: '復活時，HP和SP全部恢復。\n裝備時所受治癒量+20%.' }
];

const grouped = computed(() => {
  const all = { 武器: weapons, 頭飾: headgear, 鎧甲: armors, 盾牌: shields, 披肩: cloaks, 鞋子: shoes, 裝飾品: accessories };
  const q = query.value.trim().toLowerCase();
  const out = {};
  for (const k in all) {
    let list = all[k];
    if (filterCategory.value !== '全部' && filterCategory.value !== k) list = [];
    if (q) {
      list = list.filter(i => (i.name + ' ' + (i.alias||'') + ' ' + (i.effect||'')).toLowerCase().includes(q));
    }
    out[k] = list;
  }
  return out;
});
onMounted(() => {
  document.title = 'RO樂園-卡片詞條';
})
</script>

<style scoped>
.cards-page { font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #e3d4b8; }
th { background: #e8d3a8; padding: 10px; text-align: left; }
td { padding: 10px; vertical-align: top; }
.fade-enter-active, .fade-leave-active { transition: all .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
