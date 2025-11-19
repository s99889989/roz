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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 標題 */
.title {
  color: #ffd700;
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  background: #6b4b2a;
  color: #ffd700;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.25s;
  border: 2px solid #8b6b46;
}

.tab-btn:hover {
  background: #8c6239;
  transform: translateY(-2px);
}

.tab-btn.active {
  background: #d1ae43;
  color: #3a2c1f;
  border-color: #d1ae43;
}

/* 表格外框 */
.enhance-panel {
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid #8b6b46;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

/* Header */
.panel-header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #5c4428;
  padding: 15px;
  font-weight: bold;
}

.header-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #ffd700;
}

.header-item.success {
  background: rgba(0, 255, 150, 0.2);
}

.header-item.fail {
  background: rgba(255, 80, 80, 0.25);
}

/* 表格 */
.enhance-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
}

thead {
  background: #8b6b46;
}

th {
  padding: 12px;
  text-align: center;
  font-weight: bold;
  border: 1px solid #b08a5a;
  color: #ffd700;
}

/* 表格 TD */
td {
  padding: 10px;
  border: 1px solid #6b4b2a;
  text-align: center;
}

/* 左欄：材料 */
.material-cell {
  background: rgba(255, 255, 255, 0.08);
  text-align: left;
  padding-left: 15px;
}

/* 中間：費用 */
.cost-cell {
  background: rgba(255, 215, 0, 0.15);
  font-weight: bold;
  color: #ffd700;
}

/* 附魔欄 */
.enchant-cell {
  background: rgba(30, 55, 80, 0.6);
  text-align: left;
  padding-left: 15px;
}

/* 能力欄 */
.ability-cell {
  background: rgba(255, 255, 255, 0.05);
  text-align: left;
  padding-left: 15px;
  color: #ff6f6f;
}

/* Hover 效果 */
tbody tr:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* RWD */
@media (max-width: 768px) {
  .panel-header {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  table {
    font-size: 14px;
  }
  th, td {
    padding: 8px 4px;
  }
}
</style>
