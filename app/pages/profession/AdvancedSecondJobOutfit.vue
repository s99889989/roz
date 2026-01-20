<script setup lang="ts">
import { ref } from 'vue';

// 定義職業服飾資料
interface Outfit {
  title: string;
  npcName: string;
  location: string;
  guide: any;
  previewImg: string;
  placeImg: any;
  showcaseGif: string;
}

const outfits = ref<Outfit[]>([
  {
    title: '騎士領主',
    npcName: '老練騎士-伯納德',
    location: 'prt_in 83 106',
    guide: ['/navi prt_in 83/106'],
    previewImg: '/images/profession/outfit/aabd0abcf3cd465f9b69956bd65aeb50.jpg',
    placeImg: ['/images/profession/outfit/4a7d01d24305436ead11cefd6ba63491.gif'],
    showcaseGif: '/images/profession/outfit/4a7d01d24305436ead11cefd6ba63491.gif'
  },
  {
    title: '聖殿十字軍',
    npcName: '老練騎士-伯納德',
    location: 'prt_cas 262 80',
    guide: ['/navi prt_cas 262/80'],
    previewImg: '/images/profession/outfit/6b7cafa25cd1485fab6d15c960cebcb8.jpg',
    placeImg: ['/images/profession/outfit/227995de0e4c4d49bc210b01f3da6aa8.gif'],
    showcaseGif: '/images/profession/outfit/227995de0e4c4d49bc210b01f3da6aa8.gif'
  },
  {
    title: '巫師',
    npcName: '專注巫師-傑洛德',
    location: 'gef_tower 118 36',
    guide: ['/navi gef_tower 118/36'],
    previewImg: '/images/profession/outfit/9dd96d221235402caff5c814f73a1bd4.jpg',
    placeImg: ['/images/profession/outfit/143c496bdd96438f9732e3a957ef55f5.gif'],
    showcaseGif: ''
  },
  {
    title: '賢者',
    npcName: '喃自語的賢者-聖巴特',
    location: 'iz_ac01 164 84',
    guide: ['/navi iz_ac01 164/84'],
    previewImg: '/images/profession/outfit/8cfd81573a634e53b4200c00b09defca.jpg',
    placeImg: ['/images/profession/outfit/61226d6e4bd54a7292f3de17d1ddb8c4.gif'],
    showcaseGif: ''
  },
  {
    title: '刺客',
    npcName: '準備中的刺客-克斯雷',
    location: 'in_moc_16 21 21',
    guide: ['/navi in_moc_16 21/21'],
    previewImg: '/images/profession/outfit/470266c1d5694b58a8fa4f83f3bcaaa0.jpg',
    placeImg: ['/images/profession/outfit/6ab9de278f604787aef25b9fadef21be.gif'],
    showcaseGif: ''
  },
  {
    title: '流氓',
    npcName: '長相凶狠的流氓-柳瑞莫',
    location: 'in_rogue 359 116',
    guide: ['/navi in_rogue 359/116'],
    previewImg: '/images/profession/outfit/44e7c10083bc45e58b1af04152cb1015.jpg',
    placeImg: ['/images/profession/outfit/1163821a3c2043e39d0fcd2439d147d6.gif'],
    showcaseGif: ''
  },
  {
    title: '祭司',
    npcName: '祈禱中的祭司-安潔拉',
    location: 'prt_church 16 19',
    guide: ['/navi prt_church 16/19'],
    previewImg: '/images/profession/outfit/8c56fe54f3244efdb9039f0f9dec7cb4.jpg',
    placeImg: ['/images/profession/outfit/c4eecc5ea8b244d7bc99842258d11158.gif'],
    showcaseGif: ''
  },
  {
    title: '武僧',
    npcName: '鍛鍊的武僧-奇佑',
    location: 'monk_in 117 89',
    guide: ['/navi monk_in 117/89'],
    previewImg: '/images/profession/outfit/5e33157712e94624a98f0dbfee4d3438.jpg',
    placeImg: ['/images/profession/outfit/c4f9dcfc6770433294b7d43be09043b9.gif'],
    showcaseGif: ''
  },
  {
    title: '鐵匠',
    npcName: '專注鐵匠-佩諾',
    location: 'geffen_in 110 177',
    guide: ['/navi geffen_in 110/177'],
    previewImg: '/images/profession/outfit/ce112760e9114c53a122695c05525f62.jpg',
    placeImg: ['/images/profession/outfit/c6a7de9a4e4f491a8e582e53e560a6ba.gif'],
    showcaseGif: ''
  },
  {
    title: '煉金術師',
    npcName: '冒煙的煉金術師-銀翼',
    location: 'alde_alche 90 179',
    guide: ['/navi alde_alche 90/179'],
    previewImg: '/images/profession/outfit/c45103cf2cde47219f45a7b530d91309.jpg',
    placeImg: ['/images/profession/outfit/f54cf0b4b8d44cfd89ff86839bc706f7.gif'],
    showcaseGif: ''
  },
  {
    title: '獵人',
    npcName: '溫和獵人-沙格',
    location: 'in_hunter 89 94',
    guide: ['/navi in_hunter 89/94'],
    previewImg: '/images/profession/outfit/8fb1a4642ed4489d842b13d1effaa523.jpg',
    placeImg: ['/images/profession/outfit/523788b9c2b848c495a10a5138133211.gif'],
    showcaseGif: ''
  },
  {
    title: '遊詩人、舞孃',
    npcName: '投入的吟遊詩人-艾斯格、舞姿優美的舞孃-艾朵',
    location: 'comodo 197 161、comodo 184 152',
    guide: ['/navi comodo 197/161', '/navi comodo 184/152'],
    previewImg: '/images/profession/outfit/99904c2cd0584c218e65b9bb9e0e5622.jpg',
    placeImg: ['/images/profession/outfit/ba0f1bd0ec6849eda7c282fd654d5361.gif', '/images/profession/outfit/c217a5b3829b43218e423b7f1d845b51.gif'],
    showcaseGif: ''
  }
]);

// 複製導引指令的功能
const copyGuide = (text: string) => {
  navigator.clipboard.writeText(text);
  alert('導引指令已複製: ' + text);
};
</script>

<template>
  <div class="outfit-page">
    <div class="announcement-card">
      <h1 class="page-title">進階服飾</h1>
      <div class="info-content">
        <p>※ 當達成 <span class="highlight">二轉、JOB Lv50</span> 時，可回到各職業公會領取「服飾變更券(二轉)×1」。(僅限1次)</p>
        <p>※ 將「服飾變更券(二轉)」提供給 <span class="highlight">NPC造型師(prt_in 244 168)</span>，即可更換服飾。</p>
        <p>※ 「進階服飾」可隨時更換為「初始服飾」，不需消耗任何材料。</p>
        <a href="https://roz.gnjoy.com.tw/Notice/Notice_Info?id=218070">資料來源</a>
      </div>
    </div>

    <div class="outfit-grid">
      <div v-for="(item, index) in outfits" :key="index" class="outfit-card">
        <div class="card-header">
          <span class="job-badge">JOB Lv50+</span>
          <h2 class="job-title">{{ item.title }}</h2>
        </div>

        <div class="card-body">
          <div class="info-side">
            <img :src="item.previewImg" alt="NPC位置" class="npc-img" />
            <img v-for="p in item.placeImg" :src="p" alt="NPC位置" class="npc-img" />
            <div class="npc-details">
              <p><strong>領取 NPC：</strong>{{ item.npcName }}</p>
              <p><strong>位置：</strong>{{ item.location }}</p>
              <button v-for="gu in item.guide" @click="copyGuide(gu)" class="copy-btn">
                📋 複製導引：{{ gu }}
              </button>
            </div>
          </div>

<!--          <div class="gif-side">-->
<!--            <div class="gif-label">服飾預覽</div>-->
<!--            <img :src="item.showcaseGif" alt="服飾展示" class="showcase-gif" />-->
<!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outfit-page {
  background: #1c120a;
  min-height: 100vh;
  padding: 40px 20px;
  color: #f2e6d9;
  font-family: 'Microsoft JhengHei', sans-serif;
}

/* 公告卡片樣式 */
.announcement-card {
  max-width: 900px;
  margin: 0 auto 40px;
  background: #3a2c1f;
  border: 3px double #c9a063;
  border-radius: 8px;
  padding: 25px;
}

.page-title {
  color: #ffcc66;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #5c4033;
  padding-bottom: 10px;
}

.info-content p {
  line-height: 1.8;
  margin-bottom: 10px;
  font-size: 1rem;
}

.highlight {
  color: #ffcc66;
  font-weight: bold;
}

/* 職業展示格 */
.outfit-grid {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.outfit-card {
  background: #2c2118;
  border-radius: 12px;
  border: 1px solid #8b5a2b;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.card-header {
  background: #5c4033;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.job-badge {
  background: #cc5a4b;
  color: white;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.job-title {
  font-size: 1.3rem;
  color: #f2e6d9;
  margin: 0;
}

.card-body {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
}

.info-side {
  flex: 1;
  min-width: 250px;
}

.npc-img {
  width: 100%;
  border-radius: 6px;
  border: 2px solid #5c4033;
  margin-bottom: 15px;
}

.npc-details p {
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.copy-btn {
  background: #a88a64;
  color: #1c120a;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85rem;
  margin-top: 5px;
  transition: background 0.2s;
  margin-left: 10px;
}

.copy-btn:hover {
  background: #c9a063;
}

.gif-side {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 15px;
}

.gif-label {
  font-size: 0.8rem;
  color: #c9a063;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.showcase-gif {
  max-width: 100%;
  height: auto;
}

/* 手機版優化 */
@media (max-width: 600px) {
  .card-body {
    flex-direction: column;
  }
  .gif-side {
    flex: none;
    width: 100%;
  }
}
</style>