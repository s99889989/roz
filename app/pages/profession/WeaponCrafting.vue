<template>
  <div class="p-6 bg-[#f5ecd8] text-[#4b2e1e] min-h-screen">
    <h1 class="text-3xl font-bold mb-6">武器製作與藥水製作總表（分章節、可折疊）</h1>

    <!-- 全域搜尋 -->
    <div class="mb-4 flex gap-2">
      <input v-model="globalQuery" type="text" placeholder="搜尋材料 / 武器 / 技能..." class="flex-1 p-2 rounded border" />
      <button @click="clear" class="px-4 py-2 bg-[#d3b37a] rounded">清除</button>
    </div>

    <!-- 章節：武器材料總表 -->
    <section class="mb-6">
      <button @click="toggle('weapons')" class="w-full text-left p-3 bg-[#e8d3a8] rounded flex justify-between items-center">
        <span class="font-bold">一、武器製作材料總表</span>
        <span>{{ opened.weapons ? '▾' : '▸' }}</span>
      </button>

      <transition name="fade">
        <div v-show="opened.weapons" class="mt-3 bg-[#fffaf0] p-4 rounded border">
          <table class="w-full table-auto border-collapse">
            <thead class="bg-[#f0e0c3]">
            <tr>
              <th class="p-2 border">生產物品</th>
              <th class="p-2 border">所需材料</th>
              <th class="p-2 border">其他所需條件</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="w in filteredWeapons" :key="w.name">
              <td class="p-2 border align-top">{{ w.name }}</td>
              <td class="p-2 border">{{ w.materials.join(' + ') }}</td>
              <td class="p-2 border">{{ w.skill }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </transition>
    </section>

    <!-- 章節：強悍 / 屬性武器 -->
    <section class="mb-6">
      <button @click="toggle('strong')" class="w-full text-left p-3 bg-[#e8d3a8] rounded flex justify-between items-center">
        <span class="font-bold">二、製作（屬性/強悍）武器說明</span>
        <span>{{ opened.strong ? '▾' : '▸' }}</span>
      </button>

      <transition name="fade">
        <div v-show="opened.strong" class="mt-3 bg-[#fffaf0] p-4 rounded border">
          <p class="mb-3">加入 <strong>星星的角</strong>（1~3）或四屬性原石可以獲得強悍或帶屬性的武器：</p>
          <table class="w-full mb-3 border-collapse">
            <thead class="bg-[#f0e0c3]"><tr><th class="p-2 border">材料</th><th class="p-2 border">結果</th></tr></thead>
            <tbody>
            <tr><td class="p-2 border">星星的角 x1</td><td class="p-2 border">一級強悍 (Atk +10)</td></tr>
            <tr><td class="p-2 border">星星的角 x2</td><td class="p-2 border">二級強悍 (Atk +20)</td></tr>
            <tr><td class="p-2 border">星星的角 x3</td><td class="p-2 border">三級強悍 (Atk +60)</td></tr>
            <tr><td class="p-2 border">火/水/土/風 原石 各 x1</td><td class="p-2 border">給武器附加屬性</td></tr>
            </tbody>
          </table>

          <p>製作機率（範例）：基礎 71.2%、上強悍 -15%、上屬性 -20%</p>
        </div>
      </transition>
    </section>

    <!-- 章節：肯貝特製作 -->
    <section class="mb-6">
      <button @click="toggle('kenbet')" class="w-full text-left p-3 bg-[#e8d3a8] rounded flex justify-between items-center">
        <span class="font-bold">三、肯貝特（Kenbet）製作</span>
        <span>{{ opened.kenbet ? '▾' : '▸' }}</span>
      </button>

      <transition name="fade">
        <div v-show="opened.kenbet" class="mt-3 bg-[#fffaf0] p-4 rounded border">
          <table class="w-full border-collapse">
            <thead class="bg-[#f0e0c3]"><tr><th class="p-2 border">生產物品</th><th class="p-2 border">所需材料</th><th class="p-2 border">所需技能</th></tr></thead>
            <tbody>
            <tr v-for="k in kenbet" :key="k.name"><td class="p-2 border">{{ k.name }}</td><td class="p-2 border">{{ k.materials.join(' + ') }}</td><td class="p-2 border">{{ k.skill }}</td></tr>
            </tbody>
          </table>
        </div>
      </transition>
    </section>

    <!-- 章節：藥水製作說明 -->
    <section class="mb-6">
      <button @click="toggle('potions')" class="w-full text-left p-3 bg-[#e8d3a8] rounded flex justify-between items-center">
        <span class="font-bold">四、藥水製作材料說明書</span>
        <span>{{ opened.potions ? '▾' : '▸' }}</span>
      </button>

      <transition name="fade">
        <div v-show="opened.potions" class="mt-3 bg-[#fffaf0] p-4 rounded border">
          <p class="mb-3">製作必需材料：藥缽 1 個</p>

          <table class="w-full mb-4 border-collapse">
            <thead class="bg-[#f0e0c3]"><tr><th class="p-2 border">藥水名稱</th><th class="p-2 border">所需材料</th></tr></thead>
            <tbody>
            <tr v-for="p in potionRecipes" :key="p.name"><td class="p-2 border">{{ p.name }}</td><td class="p-2 border">{{ p.materials.join(' + ') }}</td></tr>
            </tbody>
          </table>

          <h3 class="font-bold mb-2">纖細藥水</h3>
          <table class="w-full mb-4 border-collapse">
            <thead class="bg-[#f0e0c3]"><tr><th class="p-2 border">藥水</th><th class="p-2 border">材料</th></tr></thead>
            <tbody>
            <tr v-for="f in finePotions" :key="f.name"><td class="p-2 border">{{ f.name }}</td><td class="p-2 border">{{ f.materials.join(' + ') }}</td></tr>
            </tbody>
          </table>

          <h3 class="font-bold mb-2">屬性/抵抗藥水</h3>
          <table class="w-full border-collapse">
            <thead class="bg-[#f0e0c3]"><tr><th class="p-2 border">藥水</th><th class="p-2 border">材料</th></tr></thead>
            <tbody>
            <tr v-for="r in resistPotions" :key="r.name"><td class="p-2 border">{{ r.name }}</td><td class="p-2 border">{{ r.materials.join(' + ') }}</td></tr>
            </tbody>
          </table>
        </div>
      </transition>
    </section>

    <!-- Footer: 使用說明 -->
    <footer class="mt-6 text-sm text-[#3e2b17]">
      <p>提示：可在上方搜尋框輸入「神之金屬」、「鋼鐵」或武器名稱快速過濾。</p>
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

const globalQuery = ref('');
const opened = reactive({ weapons: true, strong: false, kenbet: false, potions: false });
const toggle = (k) => { opened[k] = !opened[k]; };
const clear = () => { globalQuery.value = ''; };

// 武器資料（根據你提供的清單整理成結構化陣列）
const weapons = ref([
  { name: '鐵', materials: ['鐵礦石 x1'], skill: '鐵製造 Lv1' },
  { name: '鋼鐵', materials: ['鐵 x5', '煤礦 x1'], skill: '鋼製造 Lv1' },

  { name: '火靈原石', materials: ['火靈礦石 x10'], skill: '屬性石製造 Lv1' },
  { name: '水靈原石', materials: ['水靈礦石 x10'], skill: '屬性石製造 Lv1' },
  { name: '風靈原石', materials: ['風靈礦石 x10'], skill: '屬性石製造 Lv1' },
  { name: '土靈原石', materials: ['地靈礦石 x10'], skill: '屬性石製造 Lv1' },
  { name: '星星的角', materials: ['星星的粉末 x10'], skill: '屬性石製造 Lv1' },

  { name: '短劍', materials: ['傑勒比結晶 x10', '鐵 x1'], skill: '短劍製作 Lv1' },
  { name: '卡特短劍', materials: ['鐵 x25'], skill: '短劍製作 Lv1' },
  { name: '笨拙短劍', materials: ['鐵 x50'], skill: '短劍製作 Lv1' },
  { name: '德克短劍', materials: ['鋼鐵 x17'], skill: '短劍製作 Lv2' },
  { name: '大駒短劍', materials: ['鋼鐵 x30'], skill: '短劍製作 Lv2' },
  { name: '雙刃短劍', materials: ['鋼鐵 x40'], skill: '短劍製作 Lv2' },
  { name: '長柄短劍', materials: ['藍寶石 x1', '神之金屬 x4', '鋼鐵 x40'], skill: '短劍製作 Lv3' },
  { name: '大馬士革短劍', materials: ['青綠寶石 x1', '神之金屬 x4', '鋼鐵 x60'], skill: '短劍製作 Lv3' },

  { name: '長劍', materials: ['鐵 x2'], skill: '劍製作 Lv1' },
  { name: '圓月刀', materials: ['鐵 x30'], skill: '劍製作 Lv1' },
  { name: '厚實刃劍', materials: ['蝙蝠牙 x25', '鐵 x45'], skill: '劍製作 Lv1' },
  { name: '擊刺長劍', materials: ['鋼鐵 x20'], skill: '劍製作 Lv2' },
  { name: '彎刀', materials: ['鋼鐵 x35'], skill: '劍製作 Lv2' },
  { name: '圓柄馬刀', materials: ['狼指甲 x50', '鋼鐵 x40'], skill: '劍製作 Lv2' },
  { name: '日本刀', materials: ['深紅寶石 x1', '神之金屬 x8', '鋼鐵 x15'], skill: '劍製作 Lv3' },
  { name: '海東劍', materials: ['黃寶石 x1', '神之金屬 x8', '鋼鐵 x10'], skill: '劍製作 Lv3' },
  { name: '騎兵之劍', materials: ['白寶石 x1', '神之金屬 x8', '鋼鐵 x5'], skill: '劍製作 Lv3' },
  { name: '水紋之劍', materials: ['詛咒紅寶石 x1', '神之金屬 x16'], skill: '劍製作 Lv3' },
  { name: '武士刀', materials: ['亡者牙齒 x15', '鐵 x35'], skill: '雙手劍製作 Lv1' },

  { name: '雙手劍', materials: ['亡者指甲 x20', '鋼鐵 x25'], skill: '雙手劍製作 Lv2' },
  { name: '亞爾特劍', materials: ['鋼鐵 x45'], skill: '雙手劍製作 Lv2' },
  { name: '雙手巨劍', materials: ['神之金屬 x12', '鋼鐵 x10'], skill: '雙手劍製作 Lv3' },
  { name: '雙手重劍', materials: ['神之金屬 x12', '鋼鐵 x20'], skill: '雙手劍製作 Lv3' },
  { name: '十字巨劍', materials: ['受損的鑽石 x1', '神之金屬 x16', '鋼鐵 x20'], skill: '雙手劍製作 Lv3' },

  { name: '斧頭', materials: ['鐵 x10'], skill: '斧頭製作 Lv1' },
  { name: '大斧頭', materials: ['鐵 x110'], skill: '斧頭製作 Lv1' },
  { name: '鋼斧', materials: ['鋼鐵 x30'], skill: '斧頭製作 Lv2' },
  { name: '毀滅之斧', materials: ['獸人犬齒 x30', '神之金屬 x4', '鋼鐵 x20'], skill: '斧頭製作 Lv3' },
  { name: '雙手斧', materials: ['紫寶石 x1', '神之金屬 x8', '鋼鐵 x10'], skill: '斧頭製作 Lv3' },

  { name: '木錘', materials: ['鐵 x3'], skill: '鈍器製作 Lv1' },
  { name: '鐵鎚', materials: ['鐵 x30'], skill: '鈍器製作 Lv1' },
  { name: '思麥斯鐵鎚', materials: ['鋼鐵 x20'], skill: '鈍器製作 Lv2' },
  { name: '流星錘', materials: ['鋼鐵 x33'], skill: '鈍器製作 Lv2' },
  { name: '鏈鎚', materials: ['鋼鐵 x45'], skill: '鈍器製作 Lv2' },
  { name: '日星錘', materials: ['1克拉鑽石 x1', '鋼鐵 x85'], skill: '鈍器製作 Lv3' },
  { name: '尖刃鐵鎚', materials: ['銳利麟片 x20', '鋼鐵 x100'], skill: '鈍器製作 Lv3' },
  { name: '昏迷之鎚', materials: ['獸人英雄之證 x1', '鋼鐵 x120'], skill: '鈍器製作 Lv3' },

  { name: '虎爪拳套', materials: ['珍珠 x1', '鐵 x160'], skill: '拳套製作 Lv1' },
  { name: '鋼鐵拳套', materials: ['鋼鐵 x50'], skill: '拳套製作 Lv2' },
  { name: '賀勒拳套', materials: ['鋼鐵 x65'], skill: '拳套製作 Lv2' },
  { name: '昇龍拳套', materials: ['紅寶石 x10', '神之金屬 x4'], skill: '拳套製作 Lv3' },
  { name: '龍爪拳套', materials: ['黃寶石 x10', '神之金屬 x8'], skill: '拳套製作 Lv3' },
  { name: '鷹爪拳套', materials: ['白寶石 x10', '神之金屬 x4'], skill: '拳套製作 Lv3' },

  { name: '長戟', materials: ['鐵 x3'], skill: '長矛製作 Lv1' },
  { name: '長矛', materials: ['鐵 x35'], skill: '長矛製作 Lv1' },
  { name: '步兵長矛', materials: ['鐵 x70'], skill: '長矛製作 Lv1' },
  { name: '彎刃長矛', materials: ['鋼鐵 x25'], skill: '長矛製作 Lv2' },
  { name: '長槍', materials: ['鋼鐵 x40'], skill: '長矛製作 Lv2' },
  { name: '雙刃長戟', materials: ['鋼鐵 x55'], skill: '長矛製作 Lv2' },
  { name: '騎士長矛', materials: ['紅寶石 x3', '惡魔角 x2', '神之金屬 x12'], skill: '長矛製作 Lv3' },
  { name: '德瑞尹長戟', materials: ['天藍寶石 x5', '神之金屬 x8', '鋼鐵 x10'], skill: '長矛製作 Lv3' },
  { name: '斧錘長矛', materials: ['神之金屬 x12', '鋼鐵 x10'], skill: '長矛製作 Lv3' }
]);

// 強悍與屬性武器說明（簡要）
const strongInfo = ref({ baseRate: '71.2%', strongPenalty: '-15%', attrPenalty: '-20%' });

// 肯貝特製作
const kenbet = ref([
  { name: '[水肯貝特]', materials: ['水靈礦石 x1', '大卷軸 x1'], skill: '肯貝特製作' },
  { name: '[風肯貝特]', materials: ['風靈礦石 x1', '大卷軸 x1'], skill: '肯貝特製作' },
  { name: '[地肯貝特]', materials: ['地靈礦石 x1', '大卷軸 x1'], skill: '肯貝特製作' },
  { name: '[火肯貝特]', materials: ['火靈礦石 x1', '大卷軸 x1'], skill: '肯貝特製作' }
]);

// 藥水配方
const potionRecipes = ref([
  { name: '紅色藥水', materials: ['紅色藥草 x1', '空藥瓶 x1'] },
  { name: '黃色藥水', materials: ['黃色藥草 x1', '空藥瓶 x1'] },
  { name: '白色藥水', materials: ['白色藥草 x1', '空藥瓶 x1'] },
  { name: '藍色藥水', materials: ['藍色藥草 x1', '空藥瓶 x1', '雪勒結晶 x1'] },
  { name: '蘆薈汁液', materials: ['蘆薈 x1', '蜂蜜 x1', '空瓶 x1'] },
  { name: '曼特療傷藥', materials: ['曼特花 x1', '酒精 x1', '空瓶 x1'] },
  { name: '艾普理歐', materials: ['生化試管 x1', '天地樹露水 x1', '生命的種子 x1'] }
]);

const finePotions = ref([
  { name: '紅色纖細藥水', materials: ['紅色藥水 x1', '空試瓶 x1', '仙人掌刺 x1'] },
  { name: '黃色纖細藥水', materials: ['黃色藥水 x1', '空試瓶 x1', '鼠鬚 x1'] },
  { name: '白色纖細藥水', materials: ['白色藥水 x1', '空試瓶 x1', '魔女之星砂 x1'] }
]);

const resistPotions = ref([
  { name: '火抵抗藥', materials: ['傘蜥頸 x2', '紅色魔力礦石 x1', '空藥瓶 x1'] },
  { name: '水抵抗藥', materials: ['人魚心臟 x3', '藍色魔力礦石 x1', '空藥瓶 x1'] },
  { name: '地抵抗藥', materials: ['巨大傑勒比結晶 x2', '黃色魔力礦石 x1', '空藥瓶 x1'] },
  { name: '風抵抗藥', materials: ['蛾蝶蟲翅膀粉末 x3', '藍色魔力礦石 x1', '空藥瓶 x1'] }
]);

// 全站搜尋過濾
const filteredWeapons = computed(() => {
  const q = globalQuery.value.trim().toLowerCase();
  if (!q) return weapons.value;
  return weapons.value.filter(w => (
      w.name.toLowerCase().includes(q) ||
      w.materials.join(' ').toLowerCase().includes(q) ||
      (w.skill || '').toLowerCase().includes(q)
  ));
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }

table { border-collapse: collapse; }
th, td { border: 1px solid #c4a484; }
</style>
