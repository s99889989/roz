<template>
  <div class="pet-guide">
    <header class="header">
      <h1>🎮 仙境傳說 寵物資料查詢系統</h1>
      <div class="search-box">
        <input
            v-model="searchTerm"
            type="text"
            placeholder="搜尋寵物名稱、效果..."
            class="search-input"
        />
      </div>
    </header>

    <nav class="tabs">
      <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </nav>

    <main class="content">
      <!-- 一般寵物 -->
      <div v-if="activeTab === 'normal'" class="pet-section">
        <h2>一般寵物</h2>
        <div class="pet-grid">
          <div
              v-for="pet in filteredNormalPets"
              :key="pet.name"
              class="pet-card"
              @click="selectedPet = pet"
          >
            <div class="pet-header">
              <h3>{{ pet.name }}</h3>
              <span v-if="pet.tag" class="tag">{{ pet.tag }}</span>
            </div>
            <div class="pet-info">
              <p><strong>馴養物品:</strong> {{ pet.item }}</p>
              <p><strong>效果:</strong> {{ pet.effect }}</p>
              <p><strong>飼料:</strong> {{ pet.food }}</p>
              <p><strong>飾品:</strong> {{ pet.accessory || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 進化寵物 -->
      <div v-if="activeTab === 'evolved'" class="pet-section">
        <h2>進化寵物</h2>
        <div class="notice">
          ⚠️ 進化寵物的飼料皆為「寵物飼料」,只有蜜糖土波利吃「糖果」和邪骸煮縛吃「美味豬肉」。全部可以自動餵食。
        </div>
        <div class="pet-grid">
          <div
              v-for="pet in filteredEvolvedPets"
              :key="pet.name"
              class="pet-card evolved"
              @click="selectedPet = pet"
          >
            <div class="pet-header">
              <h3>{{ pet.name }}</h3>
              <span class="badge">進化</span>
            </div>
            <div class="pet-info">
              <p><strong>所需寵物:</strong> {{ pet.basePet }}</p>
              <p><strong>材料:</strong> {{ pet.materials }}</p>
              <div class="effects">
                <p><strong>效果:</strong></p>
                <ul>
                  <li v-for="(effect, idx) in pet.effects" :key="idx">
                    <strong>{{ effect.intimacy }}:</strong> {{ effect.bonus }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MVP寵物 -->
      <div v-if="activeTab === 'mvp'" class="pet-section">
        <h2>MVP寵物</h2>
        <div class="notice">
          🏆 MVP寵物的飼料皆為「高級寵物飼料」,全部可以自動餵食。
        </div>
        <div class="pet-grid">
          <div
              v-for="pet in filteredMvpPets"
              :key="pet.name"
              class="pet-card mvp"
              @click="selectedPet = pet"
          >
            <div class="pet-header">
              <h3>{{ pet.name }}</h3>
              <span class="badge mvp-badge">MVP</span>
            </div>
            <div class="pet-info">
              <p><strong>所需寵物:</strong> {{ pet.basePet }}</p>
              <p><strong>材料:</strong> {{ pet.materials }}</p>
              <div class="effects">
                <p><strong>效果:</strong></p>
                <ul>
                  <li v-for="(effect, idx) in pet.effects" :key="idx">
                    <strong>{{ effect.intimacy }}:</strong> {{ effect.bonus }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 詳細資訊彈窗 -->
    <div v-if="selectedPet" class="modal" @click="selectedPet = null">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="selectedPet = null">✕</button>
        <h2>{{ selectedPet.name }}</h2>
        <div class="modal-body">
          <div class="detail-row">
            <strong>馴養物品:</strong>
            <span>{{ selectedPet.item || selectedPet.basePet }}</span>
          </div>
          <div class="detail-row" v-if="selectedPet.materials">
            <strong>所需材料:</strong>
            <span>{{ selectedPet.materials }}</span>
          </div>
          <div class="detail-row">
            <strong>飼料:</strong>
            <span>{{ selectedPet.food }}</span>
          </div>
          <div class="detail-row" v-if="selectedPet.accessory">
            <strong>飾品:</strong>
            <span>{{ selectedPet.accessory }}</span>
          </div>
          <div class="detail-row">
            <strong>效果:</strong>
            <div v-if="selectedPet.effects">
              <ul class="effect-list">
                <li v-for="(effect, idx) in selectedPet.effects" :key="idx">
                  <span class="intimacy-level">{{ effect.intimacy }}</span>
                  <span>{{ effect.bonus }}</span>
                </li>
              </ul>
            </div>
            <span v-else>{{ selectedPet.effect }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoPetGuide',
  data() {
    return {
      activeTab: 'normal',
      searchTerm: '',
      selectedPet: null,
      tabs: [
        { id: 'normal', label: '一般寵物', icon: '🐾' },
        { id: 'evolved', label: '進化寵物', icon: '⭐' },
        { id: 'mvp', label: 'MVP寵物', icon: '🏆' }
      ],
      normalPets: [
        { name: '波利', item: '青澀蘋果', effect: 'LUK+2、CRI+1', food: '蘋果汁', accessory: '寵物書包' },
        { name: '土波利', item: '濃縮柳橙汁', effect: 'HIT+3、ATK+3', food: '黃色藥草', accessory: '寵物書包' },
        { name: '波波利', item: '苦味草', effect: 'LUK+2、毒屬性耐性+10%', food: '綠色藥草', accessory: '寵物書包' },
        { name: '瘋兔', item: '彩色紅蘿蔔', effect: 'CRI+2、ATK+2', food: '紅蘿蔔汁', accessory: '寵物髮帶' },
        { name: '小雞', item: '變態蚯蚓', effect: 'STR+1、ATK+5', food: '紅色藥草', accessory: '寵物蛋殼帽' },
        { name: '蒼蠅', item: '腐臭之魚', effect: 'AGI+1、FLEE+2', food: '寵物飼料', accessory: '寵物防毒面具' },
        { name: '綠蒼蠅', item: '鋸齒', effect: 'FLEE+6、AGI-1', food: '鋼礦石', accessory: '寵物防毒面具' },
        { name: '赤蒼蠅', item: '魔物飲料', effect: '完全迴避+2、FLEE-5', food: '紅色魔力礦石', accessory: '寵物防毒面具' },
        { name: '小野豬', item: '魔物牛奶', effect: 'VIT+1、MHP+50', food: '寵物飼料', accessory: '寵物圍兜兜' },
        { name: '沙漠幼狼', item: '營養大骨', effect: 'INT+1、MSP+50', food: '寵物飼料', accessory: '潛水頭盔' },
        { name: '蒼蟲', item: '呢喃花', effect: 'HP自然恢復量+5%、MHP+25', food: '寵物飼料', accessory: '蒼蟲眼鏡' },
        { name: '魔菇', item: '青苔', effect: 'HIT+5、ATK-2', food: '寵物飼料', accessory: '樹皮褲' },
        { name: '毒魔菇', item: '青嫩毒草', effect: 'STR+1、INT+1', food: '寵物飼料', accessory: '樹皮褲' },
        { name: '大嘴鳥', item: '營養蚯蚓', effect: 'MHP+150、MSP-10', food: '寵物飼料', accessory: '變形鍋子' },
        { name: '狸貓', item: '魔物番薯', effect: 'AGI+1、完全迴避+1', food: '寵物飼料', accessory: '紅色領巾' },
        { name: '溜溜猴', item: '魔物香蕉', effect: 'CRI+3、LUK-1', food: '香蕉汁', accessory: '猴子髮箍' },
        { name: '縛人戰士', item: '魔物之證(NPC兌換)', effect: 'ATK+10、DEF-3', food: '寵物飼料', accessory: '野生花' },
        { name: '殭屍', item: '魔物信件(NPC兌換)', effect: 'INT+1、DEF+1', food: '寵物飼料', accessory: '體罰棒' },
        { name: '土人', item: '魔物掃把', effect: 'MATK+1%、ATK-1%', food: '寵物飼料', accessory: '三色凸髮' },
        { name: '鬼女', item: '純淨銀刃', effect: 'STR+1、DEX+1', food: '寵物飼料', accessory: '寵物鈴鐺' },
        { name: '蛇女伊絲', item: '馴服手鐲', effect: 'ATK+1%、MATK-1%', food: '寵物飼料', accessory: '蛇飾髮簪' },
        { name: '畢帝特地龍', item: '閃爍之石', effect: '攻速增加(攻擊延遲-1%)、DEF/MDEF-2', food: '寵物飼料', accessory: '寵物髮夾' },
        { name: '小惡魔', item: '黑暗契約書', effect: 'ATK+1%、MATK+1%、MHP/MSP-3%', food: '芽苗', accessory: '寵物奶嘴' },
        { name: '小巴風特', item: '惡魔召喚書', effect: 'DEF+1、MDEF+1、暈眩抗性+1%', food: '蜂蜜', accessory: '牛角骨盔' },
        { name: '妖魔', item: '心愛女人之回憶(NPC兌換)', effect: 'VIT+1、暈眩抗性+1%', food: '寵物飼料', accessory: '鈍幻魔士之劍' },
        { name: '九尾狐', item: '神木樹液果凍', effect: '有點親密:CRI+2、HIT+2 / 非常親密:CRI+3、HIT+3', food: '神秘男瓶', accessory: '-' },
        { name: '玩偶熊', item: '小娃娃錘', effect: '有點親密:MSP+50 / 非常親密:MSP+100', food: '棉花球', accessory: '-' }
      ],
      evolvedPets: [
        {
          name: '波利之王',
          basePet: '波利',
          materials: '天地樹葉子×10、青澀蘋果×3',
          food: '寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'LUK+2、CRI+1' },
            { intimacy: '普通', bonus: 'LUK+3、CRI+1' },
            { intimacy: '有點親密', bonus: 'LUK+3、CRI+2' },
            { intimacy: '非常親密', bonus: 'LUK+3、CRI+3' }
          ]
        },
        {
          name: '野豬',
          basePet: '小野豬',
          materials: '寵物飼料×10、魔物牛奶×3、肉×100、柔毛×50',
          food: '寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'VIT+1、MHP+50' },
            { intimacy: '普通', bonus: 'VIT+2、MHP+50' },
            { intimacy: '有點親密', bonus: 'VIT+2、MHP+100' },
            { intimacy: '非常親密', bonus: 'VIT+2、MHP+200' }
          ]
        },
        {
          name: '七彩大嘴鳥',
          basePet: '大嘴鳥',
          materials: '寵物飼料×10、營養蚯蚓×3、七彩大嘴鳥之羽×300、大嘴鳥卡片×1、瑪絲黛拉果實×10',
          food: '寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'MHP+150' },
            { intimacy: '普通', bonus: 'MHP+200' },
            { intimacy: '有點親密', bonus: 'MHP+300' },
            { intimacy: '非常親密', bonus: 'MHP+400' }
          ]
        },
        {
          name: '縛人戰士長',
          basePet: '縛人戰士',
          materials: '魔物之證×3、縛人刀×1、縛人戰士之證×500、香蕉×1、縛人戰士卡片×1',
          food: '寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'ATK+10' },
            { intimacy: '普通', bonus: 'ATK+15' },
            { intimacy: '有點親密', bonus: 'ATK+20' },
            { intimacy: '非常親密', bonus: 'ATK+25' }
          ]
        },
        {
          name: '天使波利',
          basePet: '波利之王',
          materials: '光環×1、白色藥草×50、黃色藥水×20、傑勒比結晶×200',
          food: '寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'MHP+1%、治癒量+2%' },
            { intimacy: '普通', bonus: 'MHP+1%、治癒量+4%' },
            { intimacy: '有點親密', bonus: 'MHP+2%、治癒量+6%' },
            { intimacy: '非常親密', bonus: 'MHP+2%、治癒量+8%' }
          ]
        },
        {
          name: '狂暴小土人',
          basePet: '土人',
          materials: '魔物掃把×3、紫色染料×3、土人魔角×300、黃金×3',
          food: '寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'MATK+1%' },
            { intimacy: '普通', bonus: 'MATK+2%' },
            { intimacy: '有點親密', bonus: 'MATK+3%' },
            { intimacy: '非常親密', bonus: 'MATK+4%' }
          ]
        },
        {
          name: '小蛇女伊絲',
          basePet: '蛇女伊絲',
          materials: '馴服手鐲×3、蛇飾髮簪×1、發亮鱗片×300、3克拉鑽石×6',
          food: '寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'ATK+1%' },
            { intimacy: '普通', bonus: 'ATK+2%' },
            { intimacy: '有點親密', bonus: 'ATK+3%' },
            { intimacy: '非常親密', bonus: 'ATK+4%' }
          ]
        },
        {
          name: '巧克猴',
          basePet: '溜溜猴',
          materials: '魔物香蕉×3、溜溜猴娃娃×2、可可×300、溜溜猴卡片×1',
          food: '寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'CRI+3' },
            { intimacy: '普通', bonus: 'CRI+5、遠距離ATK+1%' },
            { intimacy: '有點親密', bonus: 'CRI+7、遠距離ATK+2%' },
            { intimacy: '非常親密', bonus: 'CRI+9、遠距離ATK+3%' }
          ]
        },
        {
          name: '妖囡',
          basePet: '妖魔',
          materials: '妖囡帽×1、殭屍娃娃×100、破舊畫像×50、妖囡卡片×1',
          food: '寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'VIT+1、暈眩抗性+1%' },
            { intimacy: '普通', bonus: 'VIT+2、暈眩抗性+2%' },
            { intimacy: '有點親密', bonus: 'VIT+3、暈眩抗性+3%、有機率將對敵人傷害的1%吸收成SP' },
            { intimacy: '非常親密', bonus: 'VIT+4、暈眩抗性+4%、有機率將對敵人傷害的1%吸收成SP' }
          ]
        }
      ],
      mvpPets: [
        {
          name: '月夜貓',
          basePet: '狂暴月夜貓',
          materials: '強烈靈魂精髓×30、九尾狐卡片×10、鬼女卡片×10、殭屍卡片×10',
          food: '高級寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'CRI+3、HIT+3' },
            { intimacy: '普通', bonus: 'CRI+4、HIT+4、物理攻擊時,有機率在5秒內每秒恢復300HP' },
            { intimacy: '有點親密', bonus: 'CRI+5、HIT+5、物理攻擊時,有機率在5秒內每秒恢復400HP和10SP' },
            { intimacy: '非常親密', bonus: 'CRI+6、HIT+6、物理攻擊時,有機率在5秒內每秒恢復500HP和20SP' }
          ]
        },
        {
          name: '白素貞',
          basePet: '妖仙女',
          materials: '強烈靈魂精髓×30、狐仙卡片×10、豹皮怪卡片×10、舞姬卡片×10',
          food: '高級寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'MSP+2%' },
            { intimacy: '普通', bonus: 'MSP+3%、技能延遲-1%' },
            { intimacy: '有點親密', bonus: 'MSP+4%、技能延遲-2%' },
            { intimacy: '非常親密', bonus: 'MSP+5%、技能延遲-3%' }
          ]
        },
        {
          name: '幽暗夢魘',
          basePet: '異型',
          materials: '強烈靈魂精髓×30、異型卡片×10、伊西拉卡片×10、阿努巴卡片×10',
          food: '高級寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'MATK+10' },
            { intimacy: '普通', bonus: 'MATK+20' },
            { intimacy: '有點親密', bonus: 'MATK+30、念和火屬性魔法傷害+5%' },
            { intimacy: '非常親密', bonus: 'MATK+40、念和火屬性魔法傷害+7%' }
          ]
        },
        {
          name: '縛人英雄',
          basePet: '縛人戰士長',
          materials: '強烈靈魂精髓×30、縛人戰士卡片×10、縛人嬰兒卡片×10、縛人英雄之證×10',
          food: '高級寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'ATK+1%' },
            { intimacy: '普通', bonus: 'ATK+2%' },
            { intimacy: '有點親密', bonus: 'ATK+4%、暴擊傷害+1%' },
            { intimacy: '非常親密', bonus: 'ATK+7%、暴擊傷害+3%' }
          ]
        },
        {
          name: '巴風特',
          basePet: '混沌小巴風特',
          materials: '強烈靈魂精髓×30、小巴風特卡片×15、混沌小巴風特卡片×15',
          food: '高級寵物飼料',
          effects: [
            { intimacy: '任何', bonus: 'FLEE+8、MSP+1%' },
            { intimacy: '普通', bonus: 'FLEE+12、MSP+3%、遠距離物理傷害+1%' },
            { intimacy: '有點親密', bonus: 'FLEE+16、MSP+5%、遠距離物理傷害+3%' },
            { intimacy: '非常親密', bonus: 'FLEE+20、MSP+7%、遠距離物理傷害+5%' }
          ]
        },
        {
          name: '蜂后',
          basePet: '狂暴蜂兵',
          materials: '強烈靈魂精髓×30、螳螂卡片×10、黑蛇卡片×10、爆鋸傘蜥卡片×10',
          food: '高級寵物飼料',
          effects: [
            { intimacy: '任何', bonus: '對一般階級魔物的物理傷害+1%' },
            { intimacy: '普通', bonus: '對一般階級魔物的物理傷害+3%' },
            { intimacy: '有點親密', bonus: '對一般階級魔物的物理傷害+5%' },
            { intimacy: '非常親密', bonus: '對一般階級魔物的物理傷害+7%、無視武器的體型修正' }
          ]
        },
        {
          name: '黑暗之王',
          basePet: '迷幻之王',
          materials: '強烈靈魂精髓×30、迷幻之王卡片×10、闇神官卡片×10、暗黑祭司卡片×10',
          food: '高級寵物飼料',
          effects: [
            { intimacy: '任何', bonus: '暗屬性魔法傷害+3%' },
            { intimacy: '普通', bonus: '暗屬性魔法傷害+5%' },
            { intimacy: '有點親密', bonus: '暗屬性魔法傷害+7%' },
            { intimacy: '非常親密', bonus: '暗屬性魔法傷害+7%、無限移動加速' }
          ]
        }
      ]
    };
  },
  computed: {
    filteredNormalPets() {
      return this.filterPets(this.normalPets);
    },
    filteredEvolvedPets() {
      return this.filterPets(this.evolvedPets);
    },
    filteredMvpPets() {
      return this.filterPets(this.mvpPets);
    }
  },
  methods: {
    filterPets(pets) {
      if (!this.searchTerm) return pets;
      const term = this.searchTerm.toLowerCase();
      return pets.filter(pet => {
        return pet.name.toLowerCase().includes(term) ||
            (pet.effect && pet.effect.toLowerCase().includes(term)) ||
            (pet.item && pet.item.toLowerCase().includes(term)) ||
            (pet.basePet && pet.basePet.toLowerCase().includes(term));
      });
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.pet-guide {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Microsoft JhengHei', 'PingFang TC', sans-serif;
  padding-bottom: 40px;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #667eea;
  font-size: 2rem;
  margin-bottom: 20px;
}

.search-box {
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid #667eea;
  border-radius: 25px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #764ba2;
  box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1);
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  flex-wrap: wrap;
}

.tab {
  padding: 12px 30px;
  font-size: 16px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
}

.tab:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.pet-section h2 {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
}

.notice {
  background: rgba(255, 243, 205, 0.95);
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid #ffa500;
  font-weight: 500;
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.pet-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.pet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.pet-card.evolved {
  border: 2px solid #ffa500;
}

.pet-card.mvp {
  border: 2px solid #ff4757;
  background: linear-gradient(135deg, #fff 0%, #ffe4e6 100%);
}

.pet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.pet-header h3 {
  color: #667eea;
  font-size: 1.3rem;
}

.tag {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.badge {
  background: #ffa500;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.mvp-badge {
  background: linear-gradient(135deg, #ff4757 0%, #ff6348 100%);
}

.pet-info p {
  margin: 8px 0;
  color: #333;
  line-height: 1.6;
}

.pet-info strong {
  color: #667eea;
  font-weight: 600;
}

.effects {
  margin-top: 10px;
}

.effects ul {
  list-style: none;
  padding-left: 0;
  margin-top: 8px;
}

.effects li {
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.effects li:last-child {
  border-bottom: none;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff4757;
  color: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #ff3838;
  transform: rotate(90deg);
}

.modal-content h2 {
  color: #667eea;
  font-size: 1.8rem;
  margin-bottom: 20px;
  padding-right: 40px;
}

.modal-body {
  color: #333;
}

.detail-row {
  margin: 15px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-row strong {
  color: #667eea;
  display: block;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.detail-row span {
  color: #555;
  line-height: 1.6;
}

.effect-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.effect-list li {
  padding: 10px;
  margin: 8px 0;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.intimacy-level {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-right: 10px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.5rem;
  }

  .pet-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    flex-direction: column;
  }

  .tab {
    width: 100%;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-content h2 {
    font-size: 1.4rem;
  }
}

/* 捲軸美化 */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}

</style>