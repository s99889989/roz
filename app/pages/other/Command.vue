<template>
  <div class="command-list-wrapper">
    <div class="content-card">

      <h1 class="main-title">⌨️ 遊戲指令與快捷鍵列表</h1>
      <p class="description-text">
        您可以在此查詢遊戲內所有可用的指令、快捷鍵及功能說明。
      </p>

      <!-- 搜尋和篩選控制項 -->
      <div class="controls-panel">
        <input
            type="text"
            v-model="searchTerm"
            placeholder="🔍 輸入指令或說明關鍵字..."
            class="search-input"
        />
        <select v-model="selectedCategory" class="category-select">
          <option value="">所有分類</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <!-- 指令表格 -->
      <div class="table-wrapper">
        <table class="styled-table command-table">
          <thead>
          <tr>
            <td style="width: 25%;">指令/快捷鍵</td>
            <td style="width: 15%;">分類</td>
            <td style="width: 60%; text-align: left;">功能說明</td>
          </tr>
          </thead>
          <tbody>
          <tr v-if="filteredCommands.length === 0">
            <td colspan="3" class="no-results">無符合條件的指令。請嘗試其他關鍵字或篩選。</td>
          </tr>
          <tr v-else v-for="(command, index) in filteredCommands" :key="index" :class="{ 'alt': index % 2 === 1 }">
            <td class="command-key">{{ command.command }}</td>
            <td>
              <span :class="['tag', getCategoryClass(command.category)]">{{ command.category }}</span>
            </td>
            <td class="command-desc left">{{ command.description }}</td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'CommandList',
  data() {
    return {
      searchTerm: '',
      selectedCategory: '',
      commands: [
        // 系統/介面
        { command: '/tip', description: '打開今天的小秘訣', category: '系統/介面' },
        { command: '/help', description: '指令瀏覽', category: '系統/介面' },
        { command: '/bgm', description: '開啟/關閉背景音樂', category: '系統/介面' },
        { command: '/music', description: '開啟/關閉背景音樂', category: '系統/介面' },
        { command: '/sound', description: '開啟/關閉效果音', category: '系統/介面' },
        { command: '/mineffect', description: '簡化特效開啟/關閉', category: '系統/介面' },
        { command: '/effect', description: '效果開啟/關閉', category: '系統/介面' },
        { command: '/quake', description: '震動開啟/關閉', category: '系統/介面' },
        { command: '/v (0~127)', description: '調整音量', category: '系統/介面' },
        { command: '/bv (0~127)', description: '調整背景音樂音量', category: '系統/介面' },
        { command: '/where', description: '標示現在位置', category: '系統/介面' },
        { command: '/skip', description: '開啟/關閉畫面同步更新', category: '系統/介面' },
        { command: '/savechat', description: '儲存對話內容', category: '系統/介面' },
        { command: '/aura', description: '簡化光芒效果開啟/關閉', category: '系統/介面' },
        { command: '/lightmap', description: '消除建築物陰影', category: '系統/介面' },
        { command: '/showname', description: '變更角色姓名的顯示方式', category: '系統/介面' },
        { command: '/tingonly', description: '只能聽到聊天室入場音', category: '系統/介面' },
        { command: '/window', description: '視窗位置移動時，和其他視窗貼在一起的屬性會進到裡面On Off', category: '系統/介面' },
        { command: '/logingout', description: '顯示公會員和好友的上/下線狀態的消息On Off', category: '系統/介面' },
        { command: '/shopping', description: '點選一次時可開啟商店，當點選商店名稱右邊時，可關閉商店On Off', category: '系統/介面' },
        { command: '/monsterhp', description: '要攻擊怪獸的HP情報會有顯示On Off', category: '系統/介面' },
        { command: '/camera', description: '照相機焦點固定開啟或關閉 (使用 /camera On 或 /camera Off)', category: '系統/介面' },
        { command: '/miss', description: '攻擊失敗動畫圖示開啟或關閉', category: '系統/介面' },
        { command: '/fog', description: '開啟/關閉霧化效果', category: '系統/介面' },
        { command: '/font', description: '角色名稱顯示在頭上', category: '系統/介面' },

        // 戰鬥/操作
        { command: '/Snap', description: '攻擊魔物時自動鎖定游標功能On Off', category: '戰鬥/操作' },
        { command: '/skillsnap', description: '使用技能時自動鎖定游標功能On Off', category: '戰鬥/操作' },
        { command: '/hunting', description: '看打獵目錄', category: '戰鬥/操作' },
        { command: '/noshift', description: '不用按 shift 鍵，也可以用治癒術攻擊魔物。On Off', category: '戰鬥/操作' },
        { command: '/noctrl', description: '不用按 ctrl 鍵，也可以自動攻擊魔物。', category: '戰鬥/操作' },
        { command: '/skillfail', description: '使用紅色技能失敗時，不會顯示訊息 On Off', category: '戰鬥/操作' },
        { command: '/quickspell', description: '點選滑鼠右鍵後，可以使用F9鍵裡的儲存技能On Off', category: '戰鬥/操作' },
        { command: '/quickspell2', description: '上下滾動滑鼠滾輪之後，可以使用F7鍵和F8鍵裡的儲存技能On Off', category: '戰鬥/操作' },
        { command: '/q1', description: '按右鍵可以使用快捷鍵第一排的最後一個按紐(預設F9)', category: '戰鬥/操作' },
        { command: '/q2', description: '滑鼠滾輪可以適用快捷第一排倒數兩個按紐(預設F7 F8)', category: '戰鬥/操作' },
        { command: '/q3', description: '同時開啟q1和q2功能', category: '戰鬥/操作' },
        { command: '/set1', description: '/ noctrl + / showname + / skillfail 組合指令', category: '戰鬥/操作' },
        { command: '/ns', description: '不用按shift鍵, 也可以用治愈術攻擊魔物。', category: '戰鬥/操作' },
        { command: '/nc', description: '不不用按ctrl鍵, 也可以自動連續攻擊魔物。', category: '戰鬥/操作' },
        { command: '/nt', description: '自動拒絕申請交易和申請加為好友。', category: '戰鬥/操作' },
        { command: '/bm', description: ' 按Q ~ O 的話，可以使用技能快速鍵，窗口2的技能，\n按A ~ L的話，可以使用技能快速鍵，窗口3的技能，\n按住Z ~ > 鍵，可以使用技能快速鍵，窗口1的技能，\n按一次Space鍵，輸入文字之後就可以聊天', category: '戰鬥/操作' },

        // 組隊/公會
        { command: '/leave', description: '退出組隊', category: '組隊/公會' },
        { command: '/invite 名稱', description: '邀請指定人物加入組隊', category: '組隊/公會' },
        { command: '/li', description: '開啟/關閉工會成員上下線顯示', category: '組隊/公會' },
        { command: '/expel 人物名稱', description: '將某指定人物從組隊中除名', category: '組隊/公會' },
        { command: '/organize 組隊名稱', description: '組隊構成', category: '組隊/公會' },
        { command: '/guild 公會名稱', description: '公會構成 ( 不可使用空格或 " 符號 )', category: '組隊/公會' },
        { command: '/gocp 公會名稱', description: '公會解散 ( 需將所有公會成員皆請出公會剩會長一人才可 )', category: '組隊/公會' },
        { command: '/emblem', description: '開啟/關閉工會會標顯示', category: '組隊/公會' },
        { command: '發話給組隊成員', description: '在訊息前面加上 " % " 就可以發話給組隊成員。＜例如：%大家好＞', category: '組隊/公會' },

        // 社交/聊天
        { command: '/chat', description: '開啟聊天室', category: '社交/聊天' },
        { command: '/', description: '退出聊天室', category: '社交/聊天' },
        { command: '/am', description: '自動回复密聊內容', category: '社交/聊天' },
        { command: '/ex [ 人物名稱 ]', description: '拒絕接收某指定人物的悄悄話', category: '社交/聊天' },
        { command: '/ex', description: '拒絕悄悄話的人物列表', category: '社交/聊天' },
        { command: '/in [ 人物名稱 ]', description: '接受某指定人物的悄悄話', category: '社交/聊天' },
        { command: '/inall', description: '接受所有人物的悄悄話', category: '社交/聊天' },
        { command: '/exall', description: '拒絕所有人物的悄悄話', category: '社交/聊天' },
        { command: '/notrade', description: '自動拒絕申請交易On Off', category: '社交/聊天' },
        { command: '/notalkmsg', description: '聊天的內容不顯示在聊天視窗上。On Off', category: '社交/聊天' },
        { command: '悄悄話功能', description: '在對話欄左邊空格輸入要密語的角色名，右邊輸入你要給對方的對話內容', category: '社交/聊天' },
        { command: '/hi', description: '給登錄為朋友的角色打招呼', category: '社交/聊天' },
        { command: '/nm', description: '屏蔽公開聊天（不包括自己說的話）', category: '社交/聊天' },
        { command: '/nm2', description: '屏蔽工會聊天（包括自己說的話）', category: '社交/聊天' },

        // 動作/表情
        { command: '/emotion', description: '顯示出現在可以使用的表情符號清單', category: '動作/表情' },
        { command: '表情指令', description: '按下Alt+(1~9)組合鍵或是Ctrl+( - = \\ )可以做出特定之表情動作', category: '動作/表情' },
        { command: '/bingbing', description: '若連續輸入這指令，玩家角色會逆時鐘方向轉身', category: '動作/表情' },
        { command: '/bangbang', description: '若連續輸入這指令，玩家角色會順時鐘方向轉身', category: '動作/表情' },
        { command: '/doridori', description: '若連續輸入這指令，玩家角色會搖頭', category: '動作/表情' },
        { command: '[Insert]', description: '坐下/站立', category: '動作/表情' },
        { command: '/sit', description: '坐下/站立', category: '動作/表情' },
        { command: '/stand', description: '坐下/站立', category: '動作/表情' },

        // 快捷鍵/功能
        { command: 'F12', description: '物品快捷設定', category: '快捷鍵/功能' },
        { command: '滑鼠右鍵 (隊長)', description: '可看到邀請加入隊伍名單的視窗', category: '快捷鍵/功能' },
        { command: '[Alt]+[End]', description: '切換是否用血條方式顯示自己角色的HP和SP', category: '快捷鍵/功能' },
        { command: '[Alt]+[H]', description: '開啟好友清單', category: '快捷鍵/功能' },
        { command: '[F10]', description: '調整訊息視窗大小', category: '快捷鍵/功能' },
        { command: '[Alt]+[F10]', description: '訊息視窗on off', category: '快捷鍵/功能' },
        { command: '[Alt]+Y', description: '可以容易開啟數十種指令的window視窗', category: '快捷鍵/功能' },
        { command: '照相機功能', description: '按[Print Screen]或[Scroll Lock]即可截圖', category: '快捷鍵/功能' },
        { command: '/memo', description: '記憶空間移動場所 (有此記憶技能時才可使用)', category: '快捷鍵/功能' },

        // 排名/製作
        { command: '/blacksmith', description: '玩家可藉由這個指令來看到鐵匠的排名順序', category: '排名/製作' },
        { command: '/alchemist', description: '玩家可藉由這個指令來看到鍊金術師的排名順序', category: '排名/製作' }
      ]
    };
  },
  computed: {
    // 從指令列表中動態獲取所有不重複的分類
    categories() {
      const cats = new Set(this.commands.map(cmd => cmd.category));
      return Array.from(cats).sort();
    },

    // 根據搜尋詞和分類篩選指令
    filteredCommands() {
      let filtered = this.commands;

      // 1. 篩選分類
      if (this.selectedCategory) {
        filtered = filtered.filter(cmd => cmd.category === this.selectedCategory);
      }

      // 2. 篩選關鍵字
      if (this.searchTerm) {
        const lowerCaseSearch = this.searchTerm.toLowerCase();
        filtered = filtered.filter(cmd =>
            cmd.command.toLowerCase().includes(lowerCaseSearch) ||
            cmd.description.includes(this.searchTerm)
        );
      }

      return filtered;
    }
  },
  methods: {
    // 根據分類名稱返回一個 CSS class 名稱
    getCategoryClass(category) {
      // 轉換中文名稱為英文或拼音，用於 CSS class，避免特殊字符
      return category.replace(/[\/\(\)]/g, '').toLowerCase().replace(/[\u4e00-\u9fa5]/g, (match) => {
        const map = {
          '系統': 'system', '介面': 'interface',
          '戰鬥': 'combat', '操作': 'control',
          '組隊': 'party', '公會': 'guild',
          '社交': 'social', '聊天': 'chat',
          '動作': 'movement', '表情': 'emote',
          '快捷鍵': 'hotkey', '功能': 'utility',
          '排名': 'ranking', '製作': 'crafting',
        };
        return map[match] || '';
      }).trim().replace(/\s/g, '-');
    }
  }
}
</script>

<style scoped>
/* ================================================= */
/* 基礎排版與顏色 (延續 RPG 深色風格)                */
/* ================================================= */
.command-list-wrapper {
  background: #2c211a; /* 極深棕色背景 */
  padding: 30px 20px;
  min-height: 100vh;
}

.content-card {
  background: #3a2c1f; /* 內容卡片深棕色 */
  border-radius: 12px;
  padding: 30px 20px;
  margin: auto;
  max-width: 1000px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
  color: #fff8e1; /* 象牙白文字 */
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
  line-height: 1.6;
}

.main-title {
  color: #ffcc66; /* 主標題使用金色 */
  text-align: center;
  font-size: 2.4rem;
  padding-bottom: 15px;
  border-bottom: 3px double #c9a063; /* 底部金色雙線 */
  margin-bottom: 25px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.description-text {
  font-size: 1.05rem;
  margin: 15px 0 30px;
  padding: 0 10px;
  text-align: center;
  color: #e0d8c7;
}

/* ================================================= */
/* 搜尋和篩選控制項                                  */
/* ================================================= */
.controls-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
  justify-content: center;
}

.search-input, .category-select {
  padding: 12px 15px;
  border: 1px solid #c9a063; /* 金色邊框 */
  border-radius: 8px;
  background: #2c211a; /* 內部深色背景 */
  color: #fff8e1;
  font-size: 1rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6);
  flex-grow: 1; /* 允許它們佔用空間 */
  max-width: 450px; /* 限制最大寬度 */
}

.search-input::placeholder {
  color: #c9a063;
  opacity: 0.7;
}

.category-select {
  cursor: pointer;
  appearance: none; /* 移除預設的下拉箭頭 */
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23c9a063" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  padding-right: 40px; /* 為箭頭騰出空間 */
  min-width: 180px;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .controls-panel {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input, .category-select {
    max-width: 100%;
  }
}

/* ================================================= */
/* 表格樣式                                          */
/* ================================================= */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #8b5a2b;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  background: #3A2C1F;
  color: #fff8e1;
  min-width: 700px; /* 確保在小螢幕上不會擠壓太緊 */
  font-size: 0.95rem;
}

.styled-table td {
  padding: 15px 10px;
  border: 1px solid #5b4835;
  text-align: center;
  vertical-align: middle;
}

.styled-table thead td {
  background: #5b4835;
  color: #ffcc66; /* 金色表頭文字 */
  font-weight: bold;
  letter-spacing: 1px;
  border-bottom: 2px solid #ffcc66;
}

/* 隔行換色 */
.styled-table tbody tr.alt {
  background: #423528;
}

.styled-table tbody tr:hover {
  background: #503d2b; /* 懸停效果 */
}

.command-key {
  font-family: 'Consolas', 'Courier New', monospace;
  font-weight: bold;
  color: #5c9888; /* 淺藍綠色突出指令 */
  word-break: break-all; /* 防止長指令溢出 */
  font-size: 1.2rem;
}

.command-desc.left {
  text-align: left;
  color: #e0d8c7;
}

.no-results {
  color: #ff4d4d;
  font-style: italic;
  padding: 30px;
}

/* ================================================= */
/* 類型標籤 (Tag) 樣式                               */
/* ================================================= */
.tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px; /* 藥丸形狀 */
  font-size: 0.9rem;
  font-weight: bold;
  color: #9b624b;
  text-shadow: none;
  line-height: 1;
}

/* 類型顏色定義 */
.system-interface {
  background-color: #87cefa; /* 淺藍色 */
}
.combat-control {
  background-color: #ff4d4d; /* 紅色 */
  color: #fff;
}
.party-guild {
  background-color: #ffd700; /* 金色 */
}
.social-chat {
  background-color: #98fb98; /* 淺綠色 */
}
.movement-emote {
  background-color: #ffa07a; /* 淺橙色 */
}
.hotkey-utility {
  background-color: #f0e68c; /* 卡其色 */
}
.ranking-crafting {
  background-color: #da70d6; /* 蘭花紫 */
}

/* 確保所有指令類別都有一個樣式 */
.tag.系統介面 { background-color: #87cefa; }
.tag.戰鬥操作 { background-color: #ff4d4d; color: #fff; }
.tag.組隊公會 { background-color: #ffd700; }
.tag.社交聊天 { background-color: #98fb98; }
.tag.動作表情 { background-color: #ffa07a; }
.tag.快捷鍵功能 { background-color: #f0e68c; }
.tag.排名製作 { background-color: #da70d6; }
</style>