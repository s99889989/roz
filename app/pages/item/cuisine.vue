<script setup>
import {onMounted, ref} from 'vue'

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
// ✅ 資料只展示部分作範例（你可保留完整）
const recipes = {
  STR: [
    { id: '12041', name: '蚱蜢熱炒', level: 1, capability: 'STR+1，持續20分鐘。' ,
      materials: '★食用油、蝗蟲後腿',
      materials2: [
        {
          "item_id":  7457, "name": "食用油",
          "get": "",
        },
        {
          "item_id":  0, "name": "蝗蟲後腿",
        },
      ],
      description: '初學者也能輕鬆做的料理。彷彿感受到綠草地的味道。'},
    { id: '12042', name: '涼拌水蹼', level: 2, capability: 'STR+2，持續20分鐘。' ,
      materials: '★清爽特調醬、粘糊的、綠色藥草、黃色藥草',
      materials2: [
        {
          "item_id":  0, "name": "",
        },
        {
          "item_id":  0, "name": "",
        },
      ],
      description: '可能會有點厭惡的感覺，但吃下去就是讓人看到新世界的珍貴料理。'},
    { id: '12043', name: '爆炸牛排', level: 3, capability: 'STR+3，持續20分鐘。' ,
      materials: '★紅辣椒、★辣調味料、肉、破舊平底鍋、綠色藥草',
      description: '看起來就像是普通的牛排，但吃完是有爆炸感的強烈料理。'},
    { id: '12044', name: '調味藥草排骨', level: 4, capability: 'STR+4，持續20分鐘。' ,
      materials: '肉、紅色藥草、黃色藥草、綠色藥草、★甜調味料、檸檬',
      description: '在斐揚傳授的料理祕訣中添加香草，讓香氣更上一層樓的醬料肋排。'},
    { id: '12045', name: '薑餅城太太的煎餅', level: 5, capability: 'STR+5，持續20分鐘。' ,
      materials: '蕃薯、蜂蜜、★食用油、紅蘿蔔、★穀物',
      description: '可感受到薑餅城大嬸手藝的香甜煎餅。是一股讓人振奮精神的味道。' },
    { id: '12071', name: '閃亮的涮涮肉', level: 6, capability: 'STR+6，持續20分鐘。' ,
      materials: '肉、蜂蜜、黃色藥草、瑪絲黛拉果實、發亮鱗片',
      description: '因為刷刷肉的味道實在太棒了，吃過的人幫它的名字添加〝閃亮的〞三個字。'},
    { id: '12072', name: '整隻BBQ', level: 7, capability: 'STR+7，持續20分鐘。' ,
      materials: '肉、火種、煤礦、★辣醬、瑪哪樹枝、白色藥草',
      description: '添加辣醬的整隻豬烤成的料理。對肉食主義者來說是最棒的料理。' },
    { id: '12073', name: '特製熊掌料理', level: 8, capability: 'STR+8，持續20分鐘。' ,
      materials: '熊掌、紅蘿蔔、南瓜頭、蘆薈葉子、西納雷葉子、★純調味料',
      description: '被視為龍之城最頂尖的山珍海味，特別是右邊的熊掌最受歡迎。'},
    { id: '12074', name: '血筋莎郎', level: 9, capability: 'STR+9，持續20分鐘。' ,
      materials: '血管、★鍋子、起士、★辣醬、煤礦、綠色藥草、墨汁',
      description: '把新鮮與品質佳的筋腱稍微烤過，完整呈現材料的美味。' },
    { id: '12075', name: '舌頭料理', level: 10, capability: 'STR+10，持續20分鐘。' ,
      materials: '細長舌頭、★鍋子、酒精、蘆薈汁液、★辣醬、蜂膠、天地樹葉子、藍色藥水',
      description: '除了食材貴以外，是軟綿可口的最高級料理。聽說是從龍之城過來的料理。'}
  ],
  INT: [
    { id: '12046', name: '葡汁藥草茶', level: 1, capability: 'INT+1，持續20分鐘。',
      materials: '葡萄、★紅色藥水', description:
          '葡萄汁裡的藥草香能醒腦，是很香的茶。也很像普通的葡萄汁。' },
    { id: '12047', name: '滿葉的紅茶', level: 2, capability: 'INT+2，持續20分鐘。',
      materials: '藍色藥草、黃色藥草、紅色藥草',
      description: '3種藥草的香氣融合在一起後變超香的茶。但味道不怎麼樣。' },
    { id: '12048', name: '藥草蜂蜜茶', level: 3, capability: 'INT+3，持續20分鐘。',
      materials: '蜂蜜、白色藥草、★黃色香料',
      description: '在藥草茶裡加入能消除疲勞的蜂蜜就變成很甜的茶。很燙，小心喝。' },
    { id: '12049', name: '夢羅克水果酒', level: 4, capability: 'INT+4，持續20分鐘。',
      materials: '草莓、檸檬、柳橙、酒精、葡萄',
      description: '使用夢羅克的一名商人研發的酸味水果製成的酒，是女性們也不會有負擔的味道。' },
    { id: '12050', name: '瑪絲黛拉酒', level: 5, capability: 'INT+5，持續20分鐘。',
      materials: '瑪絲黛拉果實、藍色藥水、酒精、檸檬、★黃色香料',
      description: '瑪絲黛拉把醒腦效果達到最佳化的酒。禁止喝太多。' },
    { id: '12076', name: '紅色香菇水果酒', level: 6, capability: 'INT+6，持續20分鐘。',
      materials: '★食用香菇、葡萄汁、香菇芽孢、酒精、★紅色香料',
      description: '葡萄熟成製成的酒，呈現一股不同於其他紅酒的味道。據說秘密就在於使用香菇。' },
    { id: '12077', name: '特製蜂膠藥草茶', level: 7, capability: 'INT+7，持續20分鐘。',
      materials: '蜂膠、蜂蜜、白色藥草、西納雷葉子、★黃色香料',
      description: '草本茶中添加蜂膠和蜂蜜，對恢復精神有幫助的飲料，但聞起來的味道不太優。' },
    { id: '12078', name: '王室專用高級茶', level: 8, capability: 'INT+8，持續20分鐘。',
      materials: '榴槤、西納雷葉子、★天地樹葉子、蜂膠、★黃色香料',
      description: '王室甜點負責人〝夏羅樂歐羅萊昂〞的野心作品，據說下午茶的香氣甚至傳到王城外圍的地區。' },
    { id: '12079', name: '特力斯坦12年產', level: 9, capability: 'INT+9，持續20分鐘。',
      materials: '★天地樹葉子、柳橙、酒精、蜂膠、藍色藥水、★黃色香料、蘆薈葉子',
      description: '紀念崔斯坦3RD登基製作的最高級酒，據說12年的味道最棒。' },
    { id: '12080', name: '雞尾酒龍的呼吸', level: 10, capability: 'INT+10，持續20分鐘。',
      materials: '噬人樹根、哀唱草、蘆薈葉子、蜂膠、檸檬、榴槤、天地樹果實、藍色藥草',
      description: '僅用一口就能感受到龍的氣息的強烈味道，喝過一次酒的人絕對忘不了這個味道。' }
  ],
  DEX: [
    { id: '12061', name: '蜂蜜葡萄汁', level: 1, capability: 'DEX+1，持續20分鐘。',
      materials: '葡萄、★紅色藥水',
      description: '葡萄汁中添加營養高的蜂蜜製成的特製葡萄汁。酸酸甜甜真美味。' },
    { id: '12062', name: '巧克力慕斯蛋糕', level: 2, capability: 'DEX+2，持續20分鐘。',
      materials: '可可、小蛋糕、牛奶、白色盤子',
      description: '王室甜點負責人〝夏羅樂歐羅萊昂〞也極度稱讚的特製巧克力慕斯蛋糕。呈現柔和與香甜微苦的味道。' },
    { id: '12063', name: '水果刨冰', level: 3, capability: 'DEX+3，持續20分鐘。',
      materials: '蘋果、香蕉、柳橙、草莓、★黃色香料',
      description: '多種水果切成方便吃的大小，放入糖漿中製成的甜點。脆脆的口感堪稱極品。' },
    { id: '12064', name: '奶油三明治', level: 4, capability: 'DEX+4，持續20分鐘。',
      materials: '★麵包、牛奶、起士、黃色藥草、肉、★甜調味料',
      description: '在剛烤好的麵包中添加碎肉與奶油起士製成的清淡三明治。當作午餐是最棒的。' },
    { id: '12065', name: '綠色沙拉', level: 5, capability: 'DEX+5，持續20分鐘。',
      materials: '西納雷葉子、蘆薈葉子、尖銳的葉子、巨大葉子、★甜調味料、★黃色香料',
      description: '對健康有益的蔬菜加上香甜的汶巴拉式醬汁製成的沙拉。普隆德拉最新樂活菜單。' },
    { id: '12091', name: '蜜桃蛋糕', level: 6, capability: 'DEX+6，持續20分鐘。',
      materials: '石榴桃、小蛋糕、起士、牛奶、濃縮柳橙汁、★甜調味料',
      description: '使用崑崙特產蜜桃製成的蛋糕，香氣與口味都清爽。這個蛋糕的蜜桃非常柔軟。' },
    { id: '12092', name: '靈魂出竅麵包', level: 7, capability: 'DEX+7，持續20分鐘。',
      materials: '★麵包、瑪絲黛拉果實、★甜調味料、曼特花、返魂符、青澀蘋果',
      description: '關鍵在於讓人感覺靈魂快要出竅的味道。據說吃下後會覺得舌頭快融化了。' },
    { id: '12093', name: '特別的吐司', level: 8, capability: 'DEX+8，持續20分鐘。',
      materials: '★麵包、蜂膠、肉、草莓、★辣醬、起士、★甜調味料',
      description: '巨大土司料理，添加了比一般土司多三倍的肉、水果和起士。添加了豐富的材料，味道是否也很讚還是個未知數。' },
    { id: '12094', name: '天上的水果汁', level: 9, capability: 'DEX+9，持續20分鐘。',
      materials: '青澀蘋果、柳橙、草莓、★紅色香料、魔物香蕉、葡萄汁、酒精',
      description: '據說喝過此一果汁的人都有一種〝要升上天〞的感覺。據說最重要的是水果的分配比例。' },
    { id: '12095', name: '禾貝勒開米勒之酒', level: 10, capability: 'DEX+10，持續20分鐘。',
      materials: '天地樹果實、冰塊一角、菌絲、蜂膠、集中藥水、酒精、榴槤、幻想花',
      description: '甚至使用被稱為所有河流源泉的傳說之泉的名字命名，所有人都對這酒讚歎不已..' }
  ],
  AGI: [
    { id: '12056', name: '青蛙蛋墨水湯', level: 1, capability: 'AGI+1，持續20分鐘。',
      materials: '★穀物、青蛙蛋',
      description: '小火煮青蛙蛋製成的湯。最好閉上眼睛一口氣吃完。' },
    { id: '12057', name: '滑潤潤的麵條', level: 2, capability: 'AGI+2，持續20分鐘。',
      materials: '★穀物、★純調味料、南瓜頭、紅蘿蔔',
      description: '如同麵條匠人製成的光滑麵條是關鍵的料理。因為太滑潤了，所以很不方便吃。' },
    { id: '12058', name: '觸鬚起士湯', level: 3, capability: 'AGI+3，持續20分鐘。',
      materials: '觸鬚、起士、美味蕃薯、★甜調味料',
      description: '光滑的觸鬚加上香甜的番薯、香噴噴的起士，燉煮成焦黃的起士湯。和一般認為是孩童營養食品的那個味道好像不太一樣。' },
    { id: '12059', name: '薑餅城辣涼麵', level: 4, capability: 'AGI+4，持續20分鐘。',
      materials: '★穀物、★辣醬、冰塊一角、紅蘿蔔、南瓜頭',
      description: '冰與辣絕妙融合在一起的味道。南瓜當作配料的部分相當特別。' },
    { id: '12060', name: '蝙蝠翅膀南瓜蒸', level: 5, capability: 'AGI+5，持續20分鐘。',
      materials: '紅色蝙蝠翅膀、南瓜頭、★鍋子、西納雷葉子、紅色藥草',
      description: '使用西納雷花葉子包住神祕食材紅色蝙蝠翅膀，放進挖空的南瓜中煮成的營養食品。散發一股微妙的味道。' },
    { id: '12086', name: '紅辣椒蝦湯', level: 6, capability: 'AGI+6，持續20分鐘。',
      materials: '★紅辣椒、★蝦子、★甜調味料、檸檬',
      description: '辣椒的辣味和蝦子的香味絕妙搭配的湯...與其這樣說，其實就是辣味蝦料理。' },
    { id: '12087', name: '鱷魚烤肉蔬菜蒸', level: 7, capability: 'AGI+7，持續20分鐘。',
      materials: '虎蜥皮、南瓜頭、紅蘿蔔、蘆薈葉子、黃色藥草、★黃色香料',
      description: '使用蔬菜包覆烤過的鱷魚肉蒸煮的料理，是汶巴拉酋長的推薦料理。有個奇妙的傳聞說，這道料理只提供給貴客與飼養的家畜。' },
    { id: '12088', name: '超辣咖哩', level: 8, capability: 'AGI+8，持續20分鐘。',
      materials: '蘆薈枝液、★辣醬、肉、西納雷葉子、南瓜頭、紅蘿蔔',
      description: '據說在非常辣的咖哩中添加〝忍耐的味道〞。味道的關鍵好像是使用了曾戴在頭上的南瓜...' },
    { id: '12089', name: '特製佛跳牆', level: 9, capability: 'AGI+9，持續20分鐘。',
      materials: '肉、蜂膠、芽苗、★純調味料、黃色藥草、白色藥草、紅色藥草',
      description: '使用小火煮各種的肉類製成的料理，開蓋後香氣四溢，是龍之城的特產品。' },
    { id: '12090', name: '蒸沙漠蠍子', level: 10, capability: 'AGI+10，持續20分鐘。',
      materials: '蠍子尾巴、蠍子之螯、蘆薈汁液、★天地樹葉子、苦味草、蜂膠、★辣醬、★鍋子',
      description: '這是被稱爲蘇克拉特沙漠4大珍味的沙漠蠍子燉菜。聽說是利用沙子的熱來煮熟的。' }
  ],
  VIT: [
    { id: '12051', name: '蒸蟹之螯', level: 1, capability: 'VIT+1，持續20分鐘。',
      materials: '鉗子、綠色藥草、★紅色藥水',
      description: '將藥草和蟹之螯一起蒸的簡單料理。重點是把外殼仔細分解後再吃。' },
    { id: '12052', name: '海鮮料理', level: 2, capability: 'VIT+2，持續20分鐘。',
      materials: '蛤蜊肉、鰓刺、背鰭、★好吃的魚',
      description: '海向故鄉的人獻上濃郁鄉愁的料理。聽説我也不自覺地流下眼淚。' },
    { id: '12053', name: '蛤蜊湯', level: 3, capability: 'VIT+3，持續20分鐘。',
      materials: '蛤蜊肉、海螺、蜂蜜、★甜調味料',
      description: '保存海味的美味料理。煮滾的水和蛤蜊肉都能吃到。' },
    { id: '12054', name: '涼拌海蜇皮', level: 4, capability: 'VIT+4，持續20分鐘。',
      materials: '觸鬚、白色藥草、柔軟的草葉、破舊平底鍋、墨汁',
      description: '稍微煮熟的觸鬚搭配對身體有益的魷魚墨汁、以及藥草。看起來很美味，但其實味道很微妙。' },
    { id: '12055', name: '香辣烤煎包', level: 5, capability: 'VIT+5，持續20分鐘。',
      materials: '餃子、黃色藥草、★辣醬、★紅色香料、綠色藥草',
      description: '在煮熟的包子中添加微辣的醬料，煎過後變成一道讓人食指大動的料理。如果吃太多，隔天會非常悽慘。' },
    { id: '12081', name: '非常苦的補藥', level: 6, capability: 'VIT+6，持續20分鐘。',
      materials: '褐色樹根、噬人樹根、香菇芽孢、★食用香菇、蜂蜜',
      description: '有一個未經證實的說法，藥越難吃就越有效果。' },
    { id: '12082', name: '特製山珍海味', level: 7, capability: 'VIT+7，持續20分鐘。',
      materials: '魚尾、蘆薈葉子、野豬毛、★好吃的魚、★寵物飼料、★甜調味料',
      description: '吃過後腦海中會出現雄壯的山和蔚藍的海，並且讓人忍不住落淚的神奇料理。' },
    { id: '12083', name: '巨大包葉料理', level: 8, capability: 'VIT+8，持續20分鐘。',
      materials: '樹葉衣、肉、彩色紅蘿蔔、南瓜頭、★純調味料、★穀物',
      description: '為了不讓人一口吃掉，故意製作成相當大份量的包葉料理。可感受到製作者的心意。' },
    { id: '12084', name: '昇龍湯', level: 9, capability: 'VIT+9，持續20分鐘。',
      materials: '龍皮、龍尾、★天地樹葉子、蜂膠、★辣醬、★紅色香料、營養蚯蚓',
      description: '料理的主要材料是〝龍〞的辣味料理，據說吃過後會有一股升天的感覺。' },
    { id: '12085', name: '不死之湯', level: 10, capability: 'VIT+10，持續20分鐘。',
      materials: '不死心臟、亡者遺物、天地樹芽、曼特療傷藥、人魚之心、★辣醬、返魂符、苦味草',
      description: '雖然形狀和香味有點不喜歡，但是吃了這個的話，就會產生絕對不會死的心態。' }
  ],
  LUK: [
    { id: '12066', name: '猴子尾巴熱炒', level: 1, capability: 'LUK+1，持續20分鐘。',
      materials: '猴子尾巴、★食用油',
      description: '把猴子尾巴炒成焦黃，和基本調味料一樣清淡的料理。聽說是非常受歡迎的下酒菜。' },
    { id: '12067', name: '混合果汁', level: 2, capability: 'LUK+2，持續20分鐘。',
      materials: '蘋果汁、紅蘿蔔汁、葡萄汁、柳橙汁',
      description: '多種水果汁絕妙搭配的混合果汁。如果弄錯比例，很可能會變另一種味道。' },
    { id: '12068', name: '拔絲地瓜', level: 3, capability: 'LUK+3，持續20分鐘。',
      materials: '番薯、美味蕃薯、魔物番薯、★甜調味料',
      description: '番薯烤過後淋上糖漿熬製成的料理。酥脆香甜，是非常受歡迎的點心。' },
    { id: '12069', name: '人魚料理', level: 4, capability: 'LUK+4，持續20分鐘。',
      materials: '人魚嘴巴、變身葉子、白色藥草、★好吃的魚、★甜調味料',
      description: '使用剛捕獲的新鮮魚、以及莫名其妙被傳說對健康有益的人魚嘴巴，使用散發香氣的樹葉包覆後蒸煮成的魚料理。\\n聽說男性比女性更喜歡。' },
    { id: '12070', name: '蠍子熱炒', level: 5, capability: 'LUK+5，持續20分鐘。',
      materials: '蠍子尾巴、昆蟲後腳、巨大葉子、破舊平底鍋、★食用油',
      description: '炒最美味的蠍子尾巴製成的料理。弄碎堅硬的外殼，取出柔軟的肉食用。有微弱的毒性，食用太多對身體不好。' },
    { id: '12096', name: '開運湯', level: 6, capability: 'LUK+6，持續20分鐘',
      materials: '爬蟲類舌頭、細長舌頭、三葉幸運草、魔女之星沙、蘆薈',
      description: '據說在最燙的時候食用時，運氣就會變非常好。只不過...看來只是謠言而已。。' },
    { id: '12097', name: '燒烤肉串', level: 7, capability: 'LUK+7，持續20分鐘。',
      materials: '鱗片皮膚、鰓刺、柔軟的草葉、肉、★食用香菇、海產物料理',
      description: '把各種肉類串在樹枝上烤成的料理。可依照喜好挑選材料，因此非常受歡迎。' },
    { id: '12098', name: '草莓米飯團', level: 8, capability: 'LUK+8，持續20分鐘。',
      materials: '草莓、★穀物、樹葉衣、★黃色香料、★紅色香料、★純調味料',
      description: '清爽草莓味與香氣堪稱極品的飯糰。就像是把草莓當作白飯配菜一樣，這可是難得的寶貴經驗。' },
    { id: '12099', name: '血腥蘇打', level: 9, capability: 'LUK+9，持續20分鐘。',
      materials: '家畜血、曼特療傷藥、蘆薈汁液、酒精、蜂膠、★紅色香料、蘋果汁',
      description: '刺激味深受孩童們喜愛的蘇打飲料。雖然隱約有點血腥味，但畢竟很好喝，就算了吧。' },
    { id: '12100', name: '九尾狐尾巴料理', level: 10, capability: 'LUK+10，持續20分鐘。',
      materials: '狐狸尾巴、四葉幸運草、噬人樹根、尖銳的葉子、★天地樹葉子、★純調味料、★黃色香料、迷幻藥',
      description: '斐揚特產九尾狐的尾巴料理。在盧恩米德加爾特上，作爲幸運料理廣爲人知。' }
  ]
}

// ✅ 修正版格式化函數：★變色 + 特殊字樣金黃
const formatMaterials = (text) => {
  if (!text) {
    return ''; // 確保傳入空值時不會出錯
  }
  // 只處理傳入的 text 參數，不依賴 this.item



  return text.replaceAll('、', '<br>');
}
const formattedDescription = (text) =>{
  if (!text) {
    return ''; // 確保傳入空值時不會出錯
  }
  // 只處理傳入的 text 參數，不依賴 this.item
  return text.replace(/\\n/g, '<br>');
}
const getItemImg = (id) => {
  // return `https://assets.twroz.wiki/images/wearing/${id}_b.png`
  return `/images/items/${id}.gif`
}
onMounted(() => {
  document.title = 'RO樂園-料理';
})
</script>

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

    <div class="mb-4 p-3 bg-[#2b1e12] border border-yellow-600 rounded">
      <span class="text-yellow-400 font-bold">★為食材商人所購買，其餘為怪物掉落素材</span>
    </div>

    <div class="item-card-grid" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: flex-start;">

      <div
          v-for="(item, i) in recipes[current]"
          :key="item.id"
          class="item-card"
          style="
                    width: calc(25% - 15px);
                    min-width: 200px;
                    border: 1px solid #7a6a5d;
                    border-radius: 8px;
                    background-color: #4a3e35;
                    padding: 15px;
                    color: #e0d8cc;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
                "
      >
        <div class="flex w-full justify-center">
          <img :src="getItemImg(item.id)" alt="" class="h-15">
        </div>

        <h3 style="color: #cfbd9c; margin-top: 0; margin-bottom: 5px; font-size: 1.2em;">{{ item.name }}</h3>
        <p style="font-size: 0.8em; color: #b0a59a; margin: 0;">料理等級: {{ item.level }}</p>
        <hr style="border-color: #5b4b3f; margin: 10px 0;">
        <p style="font-size: 0.9em; margin-bottom: 15px; overflow: hidden; color: #c9c1b6; line-height: 1.5;">
          <strong style="color: #90ee90;" v-html="formattedDescription(item.capability)"></strong>
          <!--            <br><strong v-if="getCardMainStat(item)" style="color: #90ee90;">{{ getCardMainStat(item) }}</strong>-->
        </p>

        <hr style="border-color: #5b4b3f; margin: 10px 0;">
        <strong style="color: #e9d59f;" v-html="formatMaterials(item.materials)"></strong>
      </div>

    </div>

    <!-- 單一表格：顯示目前屬性 -->
    <!--    <div class="table-wrapper">-->
    <!--      <h2>{{ current }}（{{ attrNames[current] }}）料理</h2>-->
    <!--      <table>-->
    <!--        <thead>-->
    <!--        <tr>-->
    <!--          <th>料理名稱</th>-->
    <!--          <th>等級</th>-->
    <!--          <th>材料</th>-->
    <!--        </tr>-->
    <!--        </thead>-->
    <!--        <tbody>-->
    <!--        <tr v-for="(item, i) in recipes[current]" :key="i">-->
    <!--          <td>{{ item.name }}</td>-->
    <!--          <td>{{ item.level }}</td>-->
    <!--          <td v-html="formatMaterials(item.materials)"></td>-->
    <!--        </tr>-->
    <!--        </tbody>-->
    <!--      </table>-->
    <!--    </div>-->

    <p class="note">★為食材商人所購買　其餘為怪物掉落素材</p>
  </div>
</template>



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
