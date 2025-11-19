<template>
  <div class="page-wrapper">
    <div class="content-card">

      <h1 class="main-title">⚔️ 遊戲系統數據總覽 📜</h1>
      <p class="description-text">
        此頁面彙整了 MVP 附魔、活化系統、魔物防具附魔、鐵匠鍛造和古城相關資訊。
      </p>

      <!-- Tab Navigation -->
      <div class="tabs-container">
        <div
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-item', { 'active': currentTab === tab.id }]"
            @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content-wrapper">

        <!-- 1. MVP 卡片附魔 -->
        <div v-if="currentTab === 'mvp_enchant'">
          <h2 class="section-title">MVP 卡片附魔 (武器)</h2>
          <div class="filter-group">
            <label class="group-title">系列選擇：</label>
            <label class="radio-label" v-for="series in mvpSeries" :key="series">
              <input
                  type="radio"
                  :value="series"
                  v-model="mvpSelectedSeries"
                  class="radio-input"
              />
              <span :class="['radio-text', getSeriesClass(series)]">{{ series }}</span>
            </label>
          </div>
          <DataTable
              :data="mvpEnchantments[mvpSelectedSeries]"
              :headers="['MVP名稱', '附魔能力', '數值範圍']"
              :data-keys="mvpDataKeys"
              :series-type="getSeriesClass(mvpSelectedSeries)"
          />
        </div>

        <!-- 2. 活化系統附魔 -->
        <div v-if="currentTab === 'activation_enchant'">
          <h2 class="section-title">活化系統附魔 (裝飾品)</h2>
          <div class="filter-group">
            <label class="group-title">系列選擇：</label>
            <label class="radio-label" v-for="series in activationSeries" :key="series">
              <input
                  type="radio"
                  :value="series"
                  v-model="activationSelectedSeries"
                  class="radio-input"
              />
              <span :class="['radio-text', getSeriesClass(series)]">{{ series }}</span>
            </label>
          </div>
          <!-- 活化系統的表格有兩組數據並排 -->
          <DataTable
              :data="activationEnchantments[activationSelectedSeries]"
              :headers="['系列', '能力名稱', '數值範圍', '系列(二)', '能力名稱(二)', '數值範圍(二)']"
              :data-keys="activationDataKeys"
              :series-type="getSeriesClass(activationSelectedSeries)"
          />
        </div>

        <!-- 3. 魔物防具附魔 -->
        <div v-if="currentTab === 'monster_armor'">
          <h2 class="section-title">魔物防具附魔</h2>
          <div class="filter-group">
            <label class="group-title">裝備部位：</label>
            <label class="radio-label" v-for="part in armorParts" :key="part">
              <input
                  type="radio"
                  :value="part"
                  v-model="armorSelectedPart"
                  class="radio-input"
              />
              <span class="radio-text">{{ part }}</span>
            </label>
          </div>
          <!-- 魔物防具的表格有兩組數據並排 -->
          <DataTable
              :data="monsterArmorEnchantments[armorSelectedPart]"
              :headers="['等級', '能力名稱', '數值範圍', '能力名稱(二)', '數值範圍(二)']"
              :data-keys="monsterArmorDataKeys"
              :series-type="'defense'"
          />
        </div>

        <!-- 4. 鐵匠鍛造 -->
        <div v-if="currentTab === 'blacksmith'">
          <h2 class="section-title">鐵匠鍛造 (武器)</h2>
          <DataTable
              :data="blacksmithData"
              :headers="['強化等級', '成功率', '素材1', '素材2', '備註']"
              :data-keys="blacksmithDataKeys"
              :series-type="'crafting'"
          />
        </div>

        <!-- 5. 古城資訊 -->
        <div v-if="currentTab === 'old_castle'">
          <h2 class="section-title">古城副本資訊 (經驗值、掉落物)</h2>
          <DataTable
              :data="oldCastleData"
              :headers="['地圖名稱', '魔物名稱', 'EXP(%)', 'JobEXP(%)', '重要掉落物']"
              :data-keys="oldCastleDataKeys"
              :series-type="'dungeon'"
          />
        </div>

      </div>

    </div>
  </div>
</template>

<script>
// 單一文件組件中的子組件，用於渲染表格
const DataTable = {
  // 接收 dataKeys 以確保列的渲染順序正確
  props: ['data', 'headers', 'seriesType', 'dataKeys'],
  template: `
    <div class="table-wrapper">
      <table class="styled-table" :class="seriesType + '-table'">
        <thead>
        <tr>
          <td v-for="header in headers" :key="header">{{ header }}</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, index) in data" :key="index" :class="{ 'alt': index % 2 === 1 }">
          <!-- *** 修正點：改為迭代 dataKeys 來保證順序與表頭一致 *** -->
          <td
              v-for="(key) in dataKeys"
              :key="key"
              :class="{
                'left-align': isLeftAligned(key),
                'enchant-value': isValue(key),
                'enchant-name': isAbility(key)
              }"
          >
            {{ row[key] }} <!-- 使用 key 從 row 物件中取出正確的值 -->
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  `,
  methods: {
    // 檢查鍵名是否應靠左對齊
    isLeftAligned(key) {
      // 根據實際的數據鍵名進行判斷
      const rightAlignedKeys = ['等級', '附魔編號', '數值範圍', '數值範圍_2', '成功率', 'EXP(%)', 'JobEXP(%)', '系列', '系列_2'];
      return !rightAlignedKeys.includes(key);
    },
    // 檢查鍵名是否為數值範圍
    isValue(key) {
      return key.includes('數值範圍') || key.includes('數值範圍_2') || key.includes('成功率') || key.includes('EXP') || key.includes('JobEXP');
    },
    // 檢查鍵名是否為能力名稱
    isAbility(key) {
      return key.includes('能力名稱') || key.includes('能力名稱_2') || key.includes('附魔能力') || key.includes('重要掉落物');
    }
  }
};

export default {
  name: 'GameDataHub',
  components: { DataTable },
  data() {
    return {
      currentTab: 'mvp_enchant',
      tabs: [
        { id: 'mvp_enchant', name: 'MVP 卡片附魔' },
        { id: 'activation_enchant', name: '活化系統附魔' },
        { id: 'monster_armor', name: '魔物防具附魔' },
        { id: 'blacksmith', name: '鐵匠鍛造' },
        { id: 'old_castle', name: '古城資訊' },
      ],

      // *** 核心修正點：定義明確的 Data Keys 以保證表格列的順序 ***
      mvpDataKeys: ['MVP名稱', '附魔能力', '數值範圍'],
      activationDataKeys: ['系列', '能力名稱', '數值範圍', '系列_2', '能力名稱_2', '數值範圍_2'],
      monsterArmorDataKeys: ['等級', '能力名稱', '數值範圍', '能力名稱_2', '數值範圍_2'],
      blacksmithDataKeys: ['強化等級', '成功率', '素材1', '素材2', '備註'],
      oldCastleDataKeys: ['地圖名稱', '魔物名稱', 'EXP(%)', 'JobEXP(%)', '重要掉落物'],

      // MVP 附魔數據
      mvpSelectedSeries: '近距離系列',
      mvpSeries: ['近距離系列', '遠距離系列', '魔法系列'],
      mvpEnchantments: {
        '近距離系列': [
          { 'MVP名稱': '巴風特', '附魔能力': '攻擊速度增加(%)', '數值範圍': '10 ~ 15' },
          { 'MVP名稱': '巴風特', '附魔能力': '對人類型魔物的物理傷害增加(%)', '數值範圍': '10 ~ 15' },
          { 'MVP名稱': '巴風特', '附魔能力': 'FLEE', '數值範圍': '5 ~ 15' },
          { 'MVP名稱': '虎王', '附魔能力': 'ATK(%)', '數值範圍': '3 ~ 5' },
          { 'MVP名稱': '虎王', '附魔能力': '對無型魔物的物理傷害增加(%)', '數值範圍': '10 ~ 15' },
          { 'MVP名稱': '虎王', '附魔能力': 'CRI', '數值範圍': '3 ~ 5' },
          // ... 略過其他 MVP 條目，只列出部分範例
          { 'MVP名稱': '幽暗夢魘', '附魔能力': 'ASPD+1', '數值範圍': '1' },
          { 'MVP名稱': '幽暗夢魘', '附魔能力': 'HP Max', '數值範圍': '500 ~ 2000' },
        ],
        '遠距離系列': [
          { 'MVP名稱': '虎王', '附魔能力': 'ATK(%)', '數值範圍': '3 ~ 5' },
          { 'MVP名稱': '虎王', '附魔能力': '對無型魔物的物理傷害增加(%)', '數值範圍': '10 ~ 15' },
          { 'MVP名稱': '虎王', '附魔能力': '暴擊傷害增加(%)', '數值範圍': '5 ~ 10' },
          { 'MVP名稱': '幽暗夢魘', '附魔能力': '對遠距離物理傷害耐性(%)', '數值範圍': '5 ~ 10' },
          { 'MVP名稱': '幽暗夢魘', '附魔能力': '對人類型魔物的物理傷害增加(%)', '數值範圍': '10 ~ 15' },
          { 'MVP名稱': '幽暗夢魘', '附魔能力': 'FLEE', '數值範圍': '5 ~ 15' },
          { 'MVP名稱': '巴風特', '附魔能力': '對遠距離物理傷害耐性(%)', '數值範圍': '5 ~ 10' },
          { 'MVP名稱': '巴風特', '附魔能力': '攻擊後延遲減少(%)', '數值範圍': '5 ~ 10' },
        ],
        '魔法系列': [
          { 'MVP名稱': '幽暗夢魘', '附魔能力': 'MATK(%)', '數值範圍': '3 ~ 5' },
          { 'MVP名稱': '幽暗夢魘', '附魔能力': '技能後延遲減少(%)', '數值範圍': '5 ~ 10' },
          { 'MVP名稱': '幽暗夢魘', '附魔能力': '對無型魔物的魔法傷害增加(%)', '數值範圍': '10 ~ 15' },
          { 'MVP名稱': '虎王', '附魔能力': '對人類型魔物的魔法傷害增加(%)', '數值範圍': '10 ~ 15' },
          { 'MVP名稱': '虎王', '附魔能力': 'HP Max', '數值範圍': '500 ~ 2000' },
          { 'MVP名稱': '虎王', '附魔能力': 'SP Max', '數值範圍': '100 ~ 500' },
          { 'MVP名稱': '巴風特', '附魔能力': '變動詠唱減少(%)', '數值範圍': '5 ~ 10' },
          { 'MVP名稱': '巴風特', '附魔能力': '對遠距離物理傷害耐性(%)', '數值範圍': '5 ~ 10' },
        ]
      },

      // 活化系統附魔數據
      activationSelectedSeries: '近距離系列',
      activationSeries: ['近距離系列', '魔法系列'],
      activationEnchantments: {
        '近距離系列': [
          { '系列': '近距離', '能力名稱': '近距離物理傷害(%)', '數值範圍': '2 ~ 5', '系列_2': '近距離', '能力名稱_2': '對人類型魔物的物理傷害增加(%)', '數值範圍_2': '3 ~ 5' },
          { '系列': '近距離', '能力名稱': 'ATK(%)', '數值範圍': '1 ~ 3', '系列_2': '近距離', '能力名稱_2': '對無型魔物的物理傷害增加(%)', '數值範圍_2': '3 ~ 5' },
          { '系列': '近距離', '能力名稱': 'CRI', '數值範圍': '3 ~ 5', '系列_2': '近距離', '能力名稱_2': '對不死型魔物的物理傷害增加(%)', '數值範圍_2': '3 ~ 5' },
          { '系列': '近距離', '能力名稱': 'HIT', '數值範圍': '5 ~ 15', '系列_2': '近距離', '能力名稱_2': '對動物型魔物的物理傷害增加(%)', '數值範圍_2': '3 ~ 5' },
          { '系列': '近距離', '能力名稱': 'FLEE', '數值範圍': '5 ~ 15', '系列_2': '近距離', '能力名稱_2': '對植物型魔物的物理傷害增加(%)', '數值範圍_2': '3 ~ 5' },
          { '系列': '通用', '能力名稱': 'ASPD+1', '數值範圍': '1', '系列_2': '通用', '能力名稱_2': '攻擊後延遲減少(%)', '數值範圍_2': '3 ~ 5' },
        ],
        '魔法系列': [
          { '系列': '魔法', '能力名稱': 'MATK(%)', '數值範圍': '1 ~ 3', '系列_2': '魔法', '能力名稱_2': '對人類型魔物的魔法傷害增加(%)', '數值範圍_2': '3 ~ 5' },
          { '系列': '魔法', '能力名稱': '變動詠唱減少(%)', '數值範圍': '3 ~ 5', '系列_2': '魔法', '能力名稱_2': '對無型魔物的魔法傷害增加(%)', '數值範圍_2': '3 ~ 5' },
          { '系列': '魔法', '能力名稱': '技能後延遲減少(%)', '數值範圍': '3 ~ 5', '系列_2': '魔法', '能力名稱_2': '對不死型魔物的魔法傷害增加(%)', '數值範圍_2': '3 ~ 5' },
          { '系列': '魔法', '能力名稱': '無視MDEF(%)', '數值範圍': '3 ~ 5', '系列_2': '魔法', '能力名稱_2': '對動物型魔物的魔法傷害增加(%)', '數值範圍_2': '3 ~ 5' },
          { '系列': '通用', '能力名稱': 'HP Max', '數值範圍': '500 ~ 2000', '系列_2': '通用', '能力名稱_2': 'SP Max', '數值範圍_2': '100 ~ 500' },
          { '系列': '通用', '能力名稱': '全屬性耐性(%)', '數值範圍': '1 ~ 3', '系列_2': '通用', '能力名稱_2': '暴擊傷害增加(%)', '數值範圍_2': '3 ~ 5' },
        ],
      },

      // 魔物防具附魔數據
      armorSelectedPart: '鎧甲',
      armorParts: ['鎧甲', '披肩', '鞋子'],
      monsterArmorEnchantments: {
        '鎧甲': [
          { '等級': 'Lv.1', '能力名稱': 'HP Max(%)', '數值範圍': '2 ~ 5', '能力名稱_2': 'SP Max(%)', '數值範圍_2': '2 ~ 5' },
          { '等級': 'Lv.1', '能力名稱': '對遠距離物理傷害耐性(%)', '數值範圍': '1 ~ 3', '能力名稱_2': '對近距離物理傷害耐性(%)', '數值範圍_2': '1 ~ 3' },
          { '等級': 'Lv.2', '能力名稱': 'HP Max(%)', '數值範圍': '6 ~ 10', '能力名稱_2': 'SP Max(%)', '數值範圍_2': '6 ~ 10' },
          { '等級': 'Lv.3', '能力名稱': '物理/魔法傷害增加(%)', '數值範圍': '3 ~ 5', '能力名稱_2': '忽略魔物MDEF(%)', '數值範圍_2': '3 ~ 5' },
          { '等級': 'Lv.4', '能力名稱': '技能後延遲減少(%)', '數值範圍': '3 ~ 5', '能力名稱_2': 'HP Max', '數值範圍_2': '1000 ~ 3000' },
        ],
        '披肩': [
          { '等級': 'Lv.1', '能力名稱': 'MDEF', '數值範圍': '5 ~ 15', '能力名稱_2': 'DEF', '數值範圍_2': '5 ~ 15' },
          { '等級': 'Lv.1', '能力名稱': 'ATK', '數值範圍': '10 ~ 30', '能力名稱_2': 'MATK', '數值範圍_2': '10 ~ 30' },
          { '等級': 'Lv.2', '能力名稱': '物理/魔法傷害增加(%)', '數值範圍': '3 ~ 5', '能力名稱_2': 'ATK(%)', '數值範圍_2': '1 ~ 3' },
          { '等級': 'Lv.3', '能力名稱': '忽略魔物DEF(%)', '數值範圍': '3 ~ 5', '能力名稱_2': '無視MDEF(%)', '數值範圍_2': '3 ~ 5' },
          { '等級': 'Lv.4', '能力名稱': '暴擊傷害增加(%)', '數值範圍': '5 ~ 10', '能力名稱_2': '全屬性耐性(%)', '數值範圍_2': '1 ~ 3' },
        ],
        '鞋子': [
          { '等級': 'Lv.1', '能力名稱': 'HP Max', '數值範圍': '500 ~ 1500', '能力名稱_2': 'SP Max', '數值範圍_2': '100 ~ 300' },
          { '等級': 'Lv.1', '能力名稱': '變動詠唱減少(%)', '數值範圍': '3 ~ 5', '能力名稱_2': '固定詠唱減少(%)', '數值範圍_2': '3 ~ 5' },
          { '等級': 'Lv.2', '能力名稱': 'ASPD+1', '數值範圍': '1', '能力名稱_2': '移動速度增加(%)', '數值範圍_2': '3 ~ 5' },
          { '等級': 'Lv.3', '能力名稱': '全能力+1', '數值範圍': '1', '能力名稱_2': '技能後延遲減少(%)', '數值範圍_2': '3 ~ 5' },
          { '等級': 'Lv.4', '能力名稱': '攻擊後延遲減少(%)', '數值範圍': '3 ~ 5', '能力名稱_2': 'HP/SP回復增加(%)', '數值範圍_2': '5 ~ 10' },
        ],
      },

      // 鐵匠鍛造數據

      blacksmithData: [
        { '強化等級': '+4', '成功率': '100%', '素材1': '鐵礦/鋁', '素材2': '神之金屬', '備註': '無失敗' },
        { '強化等級': '+5', '成功率': '50%', '素材1': '鐵礦/鋁', '素材2': '神之金屬', '備註': '失敗裝備不毀損' },
        { '強化等級': '+6', '成功率': '30%', '素材1': '鐵礦/鋁', '素材2': '神之金屬', '備註': '失敗裝備不毀損' },
        { '強化等級': '+7', '成功率': '20%', '素材1': '濃縮神之金屬', '素材2': '鋁', '備註': '失敗裝備毀損' },
        { '強化等級': '+8', '成功率': '15%', '素材1': '濃縮神之金屬', '素材2': '鋁', '備註': '失敗裝備毀損' },
        { '強化等級': '+9', '成功率': '10%', '素材1': '濃縮神之金屬', '素材2': '鋁', '備註': '失敗裝備毀損' },
        { '強化等級': '+10', '成功率': '5%', '素材1': '高濃縮神之金屬', '素材2': '鋁', '備註': '失敗裝備毀損' },
      ],

      // 古城資訊數據
      oldCastleData: [
        { '地圖名稱': '古城聖域 1F', '魔物名稱': '深淵騎士', 'EXP(%)': '110', 'JobEXP(%)': '120', '重要掉落物': '深淵騎士卡片' },
        { '地圖名稱': '古城聖域 2F', '魔物名稱': '血腥騎士', 'EXP(%)': '120', 'JobEXP(%)': '130', '重要掉落物': '血腥騎士卡片' },
        { '地圖名稱': '古城聖域 3F', '魔物名稱': '殘暴邪惡箱', 'EXP(%)': '130', 'JobEXP(%)': '140', '重要掉落物': '殘暴邪惡箱卡片' },
        { '地圖名稱': '古城聖域 4F', '魔物名稱': '迪塔勒泰晤勒斯', 'EXP(%)': '150', 'JobEXP(%)': '160', '重要掉落物': '迪塔勒泰晤勒斯卡片' },
        { '地圖名稱': '古城聖域 5F', '魔物名稱': '闇●王', 'EXP(%)': '200', 'JobEXP(%)': '220', '重要掉落物': '闇●王卡片' },
      ],
    };
  },
  methods: {
    // 根據系列名稱返回 CSS class，用於標記顏色
    getSeriesClass(series) {
      if (series.includes('近距離')) return 'melee';
      if (series.includes('遠距離')) return 'range';
      if (series.includes('魔法')) return 'magic';
      return '';
    },
  },
};
</script>

<style scoped>
/* ================================================= */
/* 基礎排版與顏色 (深色調風格)                       */
/* ================================================= */
.page-wrapper {
  background: #2a2a2e;
  padding: 30px 20px;
  min-height: 100vh;
}

.content-card {
  background: #3c3c42;
  border-radius: 12px;
  padding: 30px;
  margin: auto;
  max-width: 1200px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  color: #e6e6e6;
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
  line-height: 1.6;
}

.main-title {
  color: #ffc107;
  text-align: center;
  font-size: 2.5rem;
  padding-bottom: 15px;
  border-bottom: 3px double #ffc107;
  margin-bottom: 25px;
}

.description-text {
  font-size: 1.05rem;
  margin: 15px 0 30px;
  text-align: center;
  color: #c0c0c0;
}

.section-title {
  color: #00bcd4; /* 區塊標題使用亮藍色 */
  border-left: 5px solid #ffc107;
  padding-left: 15px;
  margin-top: 40px;
  margin-bottom: 25px;
  font-size: 1.6rem;
}

/* ================================================= */
/* Tab 樣式                                          */
/* ================================================= */
.tabs-container {
  display: flex;
  overflow-x: auto;
  border-bottom: 2px solid #5a5a60;
  margin-bottom: 20px;
  padding-bottom: 5px;
  gap: 5px;
}

.tab-item {
  cursor: pointer;
  padding: 10px 15px;
  min-width: 120px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  background: #5a5a60;
  color: #e6e6e6;
  font-weight: bold;
  transition: background 0.3s, color 0.3s;
  flex-shrink: 0;
}

.tab-item:hover {
  background: #6a6a70;
}

.tab-item.active {
  background: #ffc107;
  color: #3c3c42;
  box-shadow: 0 -3px 10px rgba(255, 193, 7, 0.3);
}

.tab-content-wrapper {
  padding: 15px 0;
}

/* ================================================= */
/* 篩選群組 (Radio Buttons)                          */
/* ================================================= */
.filter-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  padding: 15px 10px;
  margin-bottom: 25px;
  background: #4a4a50;
  border-radius: 8px;
}

.group-title {
  font-weight: bold;
  color: #ffc107;
  font-size: 1rem;
}

.radio-label {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: #e6e6e6;
  font-size: 0.95rem;
}

.radio-input {
  display: none;
}

.radio-text {
  padding: 8px 15px;
  border-radius: 5px;
  background: #5a5a60;
  transition: background 0.2s, box-shadow 0.2s;
}

.radio-label:hover .radio-text {
  background: #6a6a70;
}

.radio-input:checked + .radio-text {
  background: #00bcd4;
  color: #3c3c42;
  font-weight: bold;
  box-shadow: 0 0 8px rgba(0, 188, 212, 0.5);
}

/* 根據系列分類的顏色 */
.radio-input:checked + .melee { background: #ff4d4d; color: #fff; } /* 近距離: 紅色 */
.radio-input:checked + .range { background: #90ee90; color: #3c3c42; } /* 遠距離: 淺綠色 */
.radio-input:checked + .magic { background: #8a2be2; color: #fff; } /* 魔法: 紫色 */


/* ================================================= */
/* 表格樣式 (DataTable)                              */
/* ================================================= */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #5a5a60;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  background: #3c3c42;
  color: #e6e6e6;
  min-width: 900px;
  font-size: 0.95rem;
}

.styled-table td {
  padding: 12px 10px;
  border: 1px solid #5a5a60;
  text-align: center;
  vertical-align: middle;
}

.styled-table thead td {
  background: #5a5a60;
  color: #ffc107;
  font-weight: bold;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #ffc107;
}

/* 隔行換色 */
.styled-table tbody tr.alt {
  background: #4a4a50;
}
.styled-table tbody tr:hover {
  background: #5a5a60;
}

/* 內容樣式 */
.styled-table .left-align {
  text-align: left;
}

.styled-table .enchant-name {
  color: #c0c0c0;
}

.styled-table .enchant-value {
  font-weight: bold;
  color: #ff6e6e; /* 數值範圍使用紅色突出 */
  font-family: 'Consolas', monospace;
}

/* 根據系列為表格添加邊框顏色 */
.melee-table { border: 2px solid #ff4d4d; }
.range-table { border: 2px solid #90ee90; }
.magic-table { border: 2px solid #8a2be2; }
.defense-table { border: 2px solid #00bcd4; } /* 魔物防具使用藍綠色 */
.crafting-table { border: 2px solid #ff9800; } /* 鍛造使用橘色 */
.dungeon-table { border: 2px solid #f44336; } /* 古城使用深紅色 */
</style>