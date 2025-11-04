<script>
export default {
  name: 'CardEnhanceSystem',
  data() {
    return {
      currentTab: 'enhance1',
      tabs: [
        { id: 'enhance1', name: 'Lv1附魔' },
        { id: 'enchant', name: 'Lv2附魔' }
      ],
      enhanceData: [
        {
          id: 'enhance1',
          position: 'Lv1附魔',
          successRate: '100%',
          failPenalty: '-',
          cost: '10,000 Zeny',
          note: '★重點：機率100%，費用：10,000Zeny',
          items: [
            { material: '波利寵物蛋', enchant: '波利寵物蛋1Lv', ability: 'LUK+2、CRI+1' },
            { material: '土波利寵物蛋', enchant: '土波利寵物蛋1Lv', ability: 'HIT+3、ATK+3' },
            { material: '波波利寵物蛋', enchant: '波波利寵物蛋1Lv', ability: 'LUK+2、毒屬性抗性+10%' },
            { material: '瘋兔寵物蛋', enchant: '瘋兔寵物蛋1Lv', ability: 'CRI+2、ATK+2' },
            { material: '小野豬寵物蛋', enchant: '小野豬寵物蛋1Lv', ability: 'VIT+1、MHP+50' },
            { material: '搖滾蝗蟲寵物蛋', enchant: '搖滾蝗蟲寵物蛋1Lv', ability: 'HP恢復力+5%、MHP+25' },
            { material: '魔菇寵物蛋', enchant: '魔菇寵物蛋1Lv', ability: 'HIT+5' },
            { material: '毒魔菇寵物蛋', enchant: '毒魔菇寵物蛋1Lv', ability: 'STR+1、INT+1' },
            { material: '寶貝波利寵物蛋', enchant: '寶貝波利寵物蛋1Lv', ability: 'HP恢復力+50%' },
            { material: '小雞寵物蛋', enchant: '小雞寵物蛋1Lv', ability: 'STR+1、ATK+5' },
            { material: '蒼蠅寵物蛋', enchant: '蒼龍寵物蛋1Lv', ability: 'AGI+2、FLEE+2' },
            { material: '綠蒼蠅寵物蛋', enchant: '綠蒼蠅寵物蛋1Lv', ability: 'FLEE+6' },
            { material: '赤蒼蠅寵物蛋', enchant: '赤蒼蠅寵物蛋1Lv', ability: '完全迴避+2' },
            { material: '沙漠幼狼寵物蛋', enchant: '沙漠幼狼寵物蛋1Lv', ability: 'INT+2、MSP+50' },
            { material: '大嘴鳥寵物蛋', enchant: '大嘴鳥寵物蛋1Lv', ability: 'MHP+150' },
            { material: '狸貓寵物蛋', enchant: '狸貓寵物蛋1Lv', ability: 'AGI+1、完全迴避+1' },
            { material: '溜溜猴寵物蛋', enchant: '溜溜猴寵物蛋1Lv', ability: 'CRI+3' },
            { material: '畢帝特地龍寵物蛋', enchant: '畢帝特地龍寵物蛋1Lv', ability: '攻擊速度增加(攻擊後延遲-1%)' }
          ]
        },
        {
          id: 'enchant',
          position: 'Lv2附魔',
          successRate: '50%',
          failPenalty: '材料消失',
          cost: '10,000 Zeny',
          note: '★重點：機率100%，費用：10,000Zeny',
          items: [
            { material: '波利寵物蛋', enchant: '波利寵物蛋2Lv', ability: 'LUK+3、CRI+1' },
            { material: '土波利寵物蛋', enchant: '土波利寵物蛋2Lv', ability: 'HIT+5、ATK+5' },
            { material: '波波利寵物蛋', enchant: '波波利寵物蛋2Lv', ability: 'LUK+3、毒屬性抗性+15%' },
            { material: '瘋兔寵物蛋', enchant: '瘋兔寵物蛋2Lv', ability: 'CRI+3、ATK+3' },
            { material: '小野豬寵物蛋', enchant: '小野豬寵物蛋2Lv', ability: 'VIT+2、MHP+75' },
            { material: '搖滾蝗蟲寵物蛋', enchant: '搖滾蝗蟲寵物蛋2Lv', ability: 'HP恢復力+8%、MHP+38' },
            { material: '魔菇寵物蛋', enchant: '魔菇寵物蛋2Lv', ability: 'HIT+8' },
            { material: '毒魔菇寵物蛋', enchant: '毒魔菇寵物蛋2Lv', ability: 'STR+2、INT+2' },
            { material: '寶貝波利寵物蛋', enchant: '寶貝波利寵物蛋2Lv', ability: 'HP恢復力+75%' },
            { material: '小雞寵物蛋', enchant: '小雞寵物蛋2Lv', ability: 'STR+2、ATK+8' },
            { material: '蒼蠅寵物蛋', enchant: '蒼蠅寵物蛋2Lv', ability: 'AGI+2、FLEE+3' },
            { material: '綠蒼蠅寵物蛋', enchant: '綠蒼蠅寵物蛋2Lv', ability: 'FLEE+9' },
            { material: '赤蒼蠅寵物蛋', enchant: '赤蒼蠅寵物蛋2Lv', ability: '完全迴避+2、HIT+1' },
            { material: '沙漠幼狼寵物蛋', enchant: '沙漠幼狼寵物蛋2Lv', ability: 'INT+2、MSP+75' },
            { material: '大嘴鳥寵物蛋', enchant: '大嘴鳥寵物蛋2Lv', ability: 'MHP+200' },
            { material: '狸貓物蛋', enchant: '狸貓物蛋2Lv', ability: 'AGI+2、完全迴避+1' },
            { material: '溜溜猴寵物蛋', enchant: '溜溜猴寵物蛋2Lv', ability: 'CRI+5' },
            { material: '畢帝特地龍寵物蛋', enchant: '畢帝特地龍寵物蛋2Lv', ability: '攻擊速度增加(攻擊後延遲-1%)、AGI+1' }
          ]
        }
      ]
    }
  }
}
</script>

<template>
  <div class="card-enhance-system">
    <h1 class="title">🎴 飼養戒指</h1>
    <!-- 標籤切換 -->
    <div class="tabs">
      <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id">
        {{ tab.name }}
      </button>
    </div>

    <!-- 卡片強化一覽表 -->
    <div v-for="enhance in enhanceData" :key="enhance.id" v-show="currentTab === enhance.id">
      <div class="enhance-panel">
        <!-- 頂部資訊 -->
        <div class="panel-header">
          <div class="header-item">
            <span class="label">位置：</span>
            <span class="value">{{ enhance.position }}</span>
          </div>
          <div class="header-item success">
            <span class="label">成功率：</span>
            <span class="value">{{ enhance.successRate }}</span>
          </div>
          <div class="header-item fail">
            <span class="label">失敗時：</span>
            <span class="value">{{ enhance.failPenalty }}</span>
          </div>
        </div>

        <!-- 主要內容表格 -->
        <div class="enhance-table">
          <table>
            <thead>
            <tr>
              <th style="width: 180px;">材料</th>
              <th style="width: 120px;">費用</th>
              <th style="width: 200px;">附魔</th>
              <th>能力</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in enhance.items" :key="index">
              <td class="material-cell">{{ item.material }}</td>
              <td class="cost-cell" :rowspan="item.rowspan" v-if="index === 0 || !enhance.items[index-1].rowspan">
                {{ enhance.cost }}
              </td>
              <td class="enchant-cell">{{ item.enchant }}</td>
              <td class="ability-cell">{{ item.ability }}</td>
            </tr>
            </tbody>
          </table>
        </div>

<!--        &lt;!&ndash; 底部提示 &ndash;&gt;-->
<!--        <div class="panel-footer">-->
<!--          <span class="tip-icon">💡</span>-->
<!--          <span class="tip-text">{{ enhance.note }}</span>-->
<!--        </div>-->
      </div>

    </div>

  </div>
</template>



<style scoped>
.card-enhance-system {
  background-color: #3a2c1f;
  border-radius: 10px;
  font-family: 'Microsoft JhengHei', Arial, sans-serif;
  min-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  color: #ffe600;
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
}


.header h1 {
  font-size: 2.2em;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1em;
  opacity: 0.9;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  background: #b82e2e;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #671a1a;
  transform: translateY(-2px);
}

.tab-btn.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
}

.enhance-panel {
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.panel-header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #ffeb3b;
  padding: 15px;
  font-weight: bold;
}

.header-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.header-item.success {
  background: rgba(76, 175, 80, 0.2);
  padding: 5px 10px;
  border-radius: 5px;
}

.header-item.fail {
  background: rgba(244, 67, 54, 0.2);
  padding: 5px 10px;
  border-radius: 5px;
}

.label {
  color: #333;
}

.value {
  color: #000;
  font-weight: bold;
}

.enhance-table {

  overflow-x: auto;
}

table {

  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #998d21;
}

th {

  padding: 12px;
  text-align: center;
  font-weight: bold;
  border: 1px solid #ddd;
}

td {

  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.material-cell {
  background: rgb(144, 118, 68);
  text-align: left;
  padding-left: 15px;
}

.cost-cell {
  background: #fff9c4;
  font-weight: bold;
  color: #f57c00;
}

.enchant-cell {
  background: #1a4769;
  text-align: left;
  padding-left: 15px;
}

.ability-cell {
  background: #fff;
  text-align: left;
  padding-left: 15px;
  color: #d32f2f;
}

tbody tr:hover {
  background: #f5f5f5;
}

.panel-footer {
  background: #ffebc2;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 2px solid #ddd;
}

.tip-icon {
  font-size: 1.5em;
}

.tip-text {
  color: #c62828;
  font-weight: bold;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.info-box, .warning-box {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.info-box {
  border-left: 5px solid #2196f3;
}

.warning-box {
  border-left: 5px solid #ff9800;
}

.info-box h3, .warning-box h3 {
  margin-bottom: 15px;
  color: #333;
}

.info-box ul, .warning-box ul {
  list-style: none;
  padding: 0;
}

.info-box li, .warning-box li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
}

.info-box li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #2196f3;
  font-weight: bold;
}

.warning-box li::before {
  content: '⚠';
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.8em;
  }

  .panel-header {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .info-section {
    grid-template-columns: 1fr;
  }

  table {
    font-size: 14px;
  }

  th, td {
    padding: 8px 4px;
  }
}
</style>