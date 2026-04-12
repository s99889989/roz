<template>
  <div class="skilltree-root">

    <!-- 頂部標題列 -->
    <header class="st-header">
      <div class="st-header-inner">
        <div class="st-title-group">
          <span class="st-logo">⚔</span>
          <div>
            <h1 class="st-title">職業技能樹</h1>
            <p class="st-subtitle">技能點數模擬器</p>
          </div>
        </div>
        <div class="st-header-actions">
          <span class="st-sp-display">剩餘點數 <b>{{ remainingSP }}</b></span>
          <button class="st-btn-reset" @click="resetAll">↺ 重置</button>
        </div>
      </div>
    </header>

    <div class="st-layout">

      <!-- 左側：職業選擇 -->
      <aside class="st-job-panel">
        <div class="st-job-section">
          <div class="st-job-section-label">初心者</div>
          <button class="st-job-btn" :class="{ active: selectedJob === 'novice' }" @click="selectJob('novice')">
            <span class="st-job-emoji">🧑</span>
            <span>初心者</span>
          </button>
        </div>
        <div class="st-job-arrow">▼</div>
        <div class="st-job-section">
          <div class="st-job-section-label">一轉</div>
          <div class="st-job-grid">
            <button v-for="job in firstJobs" :key="job.id"
                    class="st-job-btn"
                    :class="{ active: selectedJob === job.id }"
                    @click="selectJob(job.id)">
              <span class="st-job-emoji">{{ job.emoji }}</span>
              <span>{{ job.name }}</span>
            </button>
          </div>
        </div>
        <div class="st-job-arrow">▼</div>
        <div class="st-job-section">
          <div class="st-job-section-label">二轉</div>
          <div class="st-job-grid">
            <button v-for="job in availableSecondJobs" :key="job.id"
                    class="st-job-btn"
                    :class="{ active: selectedJob === job.id }"
                    @click="selectJob(job.id)">
              <span class="st-job-emoji">{{ job.emoji }}</span>
              <span>{{ job.name }}</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- 右側：技能樹 -->
      <main class="st-main">
        <div v-if="currentJobData">
          <!-- 職業標題 + SP 進度 -->
          <div class="st-job-title-bar">
            <h2 class="st-job-title">{{ currentJobData.name }}</h2>
            <div class="st-sp-bar">
              <span class="st-sp-used">{{ usedSP }}</span>
              <div class="st-sp-track">
                <div class="st-sp-fill" :style="{ width: `${Math.min(100, usedSP / totalSP * 100)}%` }"></div>
              </div>
              <span class="st-sp-total">{{ totalSP }} SP</span>
            </div>
          </div>

          <!-- 技能網格 -->
          <div class="st-skill-grid-wrapper">
            <div class="st-skill-grid" :style="gridStyle">
              <!-- SVG 前置連線 -->
              <svg class="st-prereq-svg" :style="{ width: gridCols * CELL + 'px', height: gridRows * CELL + 'px' }">
                <line v-for="(line, i) in prereqLines" :key="i"
                      :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
                      :class="['st-prereq-line', line.met ? 'met' : '']"/>
              </svg>

              <!-- 技能格 -->
              <div v-for="skill in currentJobData.skills" :key="skill.id"
                   class="st-skill-cell"
                   :style="{ gridColumn: skill.col, gridRow: skill.row }"
                   :class="{
                     'is-maxed':   (skillLevels[skill.id] || 0) >= skill.maxLevel,
                     'is-active':  (skillLevels[skill.id] || 0) > 0,
                     'is-locked':  !isUnlocked(skill),
                     'is-passive': skill.type === 'passive',
                   }"
                   @click="addPoint(skill)"
                   @contextmenu.prevent="removePoint(skill)"
                   @wheel.prevent="e => onWheel(e, skill)"
                   @mouseenter="hoveredSkill = skill"
                   @mouseleave="hoveredSkill = null">
                <div class="st-skill-icon-box">
                  <span class="st-skill-emoji">{{ skill.emoji }}</span>
                  <span v-if="skill.type === 'passive'" class="st-passive-badge">P</span>
                </div>
                <div class="st-skill-level-bar">
                  <div v-for="n in Math.min(skill.maxLevel, 10)" :key="n"
                       class="st-level-pip"
                       :class="{ filled: n <= (skillLevels[skill.id] || 0) }"></div>
                </div>
                <div class="st-skill-name">{{ skill.name }}</div>
                <div class="st-skill-lv">
                  <span class="cur">{{ skillLevels[skill.id] || 0 }}</span>
                  <span class="sep">/</span>
                  <span class="max">{{ skill.maxLevel }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="st-empty">
          <div class="st-empty-icon">⚔️</div>
          <p>請從左側選擇職業</p>
        </div>
      </main>

      <!-- 技能說明面板 -->
      <transition name="tooltip-fade">
        <div v-if="hoveredSkill" class="st-tooltip">
          <div class="st-tooltip-header">
            <span class="st-tooltip-emoji">{{ hoveredSkill.emoji }}</span>
            <div>
              <div class="st-tooltip-name">{{ hoveredSkill.name }}</div>
              <div class="st-tooltip-type">{{ hoveredSkill.type === 'passive' ? '🔵 被動技能' : '🟡 主動技能' }}</div>
            </div>
          </div>
          <div class="st-tooltip-lv">等級 {{ skillLevels[hoveredSkill.id] || 0 }} / {{ hoveredSkill.maxLevel }}</div>
          <p class="st-tooltip-desc">{{ getSkillDesc(hoveredSkill) }}</p>
          <div v-if="hoveredSkill.prereq" class="st-tooltip-prereq">
            <span class="label">前置條件：</span>
            <span :class="{ met: isPrereqMet(hoveredSkill) }">
              {{ getSkillName(hoveredSkill.prereq.id) }} Lv.{{ hoveredSkill.prereq.level }}
              {{ isPrereqMet(hoveredSkill) ? '✓' : '✗' }}
            </span>
          </div>
          <div class="st-tooltip-hint">左鍵 +1 ・ 右鍵 -1 ・ 滾輪調整</div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';

const CELL = 110;

const selectedJob  = ref(null);
const skillLevels  = reactive({});
const hoveredSkill = ref(null);

// 職業清單
const firstJobs = [
  { id: 'swordman', name: '劍士', emoji: '⚔️', parent: null },
  { id: 'mage',     name: '法師', emoji: '🔮', parent: null },
  { id: 'archer',   name: '弓手', emoji: '🏹', parent: null },
  { id: 'merchant', name: '商人', emoji: '💰', parent: null },
  { id: 'thief',    name: '盜賊', emoji: '🗡️', parent: null },
  { id: 'acolyte',  name: '服事', emoji: '✝️', parent: null },
];

const secondJobs = [
  { id: 'knight',     name: '騎士',   emoji: '🛡️', parent: 'swordman' },
  { id: 'crusader',   name: '十字軍', emoji: '⚡', parent: 'swordman' },
  { id: 'wizard',     name: '巫師',   emoji: '💥', parent: 'mage'     },
  { id: 'sage',       name: '賢者',   emoji: '📚', parent: 'mage'     },
  { id: 'hunter',     name: '獵人',   emoji: '🎯', parent: 'archer'   },
  { id: 'bard',       name: '詩人',   emoji: '🎵', parent: 'archer'   },
  { id: 'blacksmith', name: '鐵匠',   emoji: '🔨', parent: 'merchant' },
  { id: 'alchemist',  name: '練金',   emoji: '⚗️', parent: 'merchant' },
  { id: 'assassin',   name: '刺客',   emoji: '🌑', parent: 'thief'    },
  { id: 'rogue',      name: '流氓',   emoji: '🃏', parent: 'thief'    },
  { id: 'priest',     name: '祭師',   emoji: '🙏', parent: 'acolyte'  },
  { id: 'monk',       name: '武僧',   emoji: '👊', parent: 'acolyte'  },
];

// 技能資料（劍士 + 騎士示範）
const jobSkillData = {
  swordman: {
    name: '劍士', totalSP: 49,
    skills: [
      { id: 'bash',          name: '重擊',      emoji: '💢', col: 2, row: 1, maxLevel: 10, type: 'active',  prereq: null,
        descs: ['造成 130% 物理傷害，有機率昏迷。','傷害 160%。','傷害 190%。','傷害 220%，昏迷率↑。','傷害 250%。','傷害 280%。','傷害 310%。','傷害 340%。','傷害 370%。','傷害 400%，最大昏迷率。'] },
      { id: 'magnum',        name: '火焰震波',  emoji: '🔥', col: 4, row: 1, maxLevel: 10, type: 'active',  prereq: null,
        descs: ['周圍火屬性傷害，攻擊力+10%持續60秒。','攻擊+12%。','攻擊+14%。','攻擊+16%。','攻擊+18%。','攻擊+20%。','攻擊+22%。','攻擊+24%。','攻擊+26%。','攻擊+30%。'] },
      { id: 'hp_recovery',   name: 'HP回復',    emoji: '💚', col: 1, row: 2, maxLevel: 10, type: 'passive', prereq: null,
        descs: ['坐下HP回復+5%。','+10%。','+15%。','+20%。','+25%。','+30%。','+35%。','+40%。','+45%。','+50%。'] },
      { id: 'provoke',       name: '挑釁',      emoji: '😡', col: 2, row: 2, maxLevel: 10, type: 'active',  prereq: { id: 'bash', level: 5 },
        descs: ['降低目標防禦5%，吸引仇恨。','防禦-6%。','防禦-7%。','防禦-8%。','防禦-9%。','防禦-10%，持續↑。','防禦-12%。','防禦-14%。','防禦-16%。','防禦-20%。'] },
      { id: 'endure',        name: '忍耐',      emoji: '🧱', col: 3, row: 2, maxLevel: 10, type: 'active',  prereq: null,
        descs: ['無法被擊退7秒，MDEF+1。','MDEF+2。','MDEF+3。','MDEF+4。','MDEF+5。','MDEF+6，持續↑。','MDEF+7。','MDEF+8。','MDEF+9。','MDEF+10，持續12秒。'] },
      { id: 'auto_berserk',  name: '狂暴化',    emoji: '😤', col: 4, row: 2, maxLevel:  1, type: 'passive', prereq: { id: 'magnum', level: 5 },
        descs: ['HP低於25%自動狂暴，攻速大幅↑。'] },
      { id: 'sword_mastery', name: '劍術精通',  emoji: '⚔️', col: 1, row: 3, maxLevel: 10, type: 'passive', prereq: null,
        descs: ['單手劍攻擊+4。','+8。','+12。','+16。','+20。','+24。','+28。','+32。','+36。','+40。'] },
      { id: '2h_mastery',    name: '雙手劍精通',emoji: '🗡️', col: 3, row: 3, maxLevel: 10, type: 'passive', prereq: null,
        descs: ['雙手劍攻擊+4。','+8。','+12。','+16。','+20。','+24。','+28。','+32。','+36。','+40。'] },
      { id: 'moving_hp',     name: '移動回復',  emoji: '🏃', col: 2, row: 3, maxLevel:  3, type: 'passive', prereq: { id: 'hp_recovery', level: 5 },
        descs: ['移動中也可緩慢回復HP。','HP回復速度↑。','HP回復速度大幅↑。'] },
      { id: 'fatal_blow',    name: '致命打擊',  emoji: '💀', col: 2, row: 4, maxLevel:  3, type: 'passive', prereq: { id: 'provoke', level: 3 },
        descs: ['重擊昏迷機率+5%。','+10%。','+15%。'] },
    ]
  },

  knight: {
    name: '騎士', totalSP: 70,
    skills: [
      { id: 'bowling_bash',  name: '保齡重擊',  emoji: '💢', col: 2, row: 1, maxLevel: 10, type: 'active',  prereq: null,
        descs: ['200%傷害，擊退連鎖攻擊。','220%。','240%。','260%。','280%。','300%。','320%。','340%。','360%。','400%，最大連鎖。'] },
      { id: 'charge_atk',    name: '突擊攻擊',  emoji: '💨', col: 4, row: 1, maxLevel: 10, type: 'active',  prereq: null,
        descs: ['向遠處目標衝刺攻擊，距離越遠傷害越高。','傷害↑。','傷害↑。','傷害↑。','傷害↑。','傷害↑。','傷害↑。','傷害↑。','傷害↑。','最大距離傷害最大化。'] },
      { id: 'one_hand_q',    name: '單手奧義',  emoji: '⚡', col: 1, row: 2, maxLevel:  5, type: 'passive', prereq: null,
        descs: ['單手劍ASPD+2。','+4。','+6。','+8。','+10。'] },
      { id: 'peco_ride',     name: '騎乘飛梵卡',emoji: '🐦', col: 3, row: 2, maxLevel:  1, type: 'passive', prereq: null,
        descs: ['騎乘飛梵卡，移動速度↑，特定技能威力↑。'] },
      { id: 'two_hand_q',    name: '雙手奧義',  emoji: '⚡', col: 5, row: 2, maxLevel:  5, type: 'passive', prereq: null,
        descs: ['雙手劍ASPD+2。','+4。','+6。','+8。','+10。'] },
      { id: 'spear_mastery', name: '槍術精通',  emoji: '🗡️', col: 6, row: 2, maxLevel: 10, type: 'passive', prereq: null,
        descs: ['槍攻擊+4。','+8。','+12。','+16。','+20。','+24。','+28。','+32。','+36。','+40。'] },
      { id: 'cavalier',      name: '騎兵衝刺',  emoji: '🐴', col: 3, row: 3, maxLevel:  5, type: 'active',  prereq: { id: 'peco_ride', level: 1 },
        descs: ['騎乘衝刺100%傷害並擊退。','120%。','140%。','160%。','200%。'] },
      { id: 'lord_aura',     name: '王者光輝',  emoji: '✨', col: 2, row: 3, maxLevel: 10, type: 'active',  prereq: { id: 'bowling_bash', level: 5 },
        descs: ['周圍隊員攻擊+1%，持續120秒。','+2%。','+3%。','+4%。','+5%。','+6%。','+7%。','+8%。','+9%。','+10%。'] },
      { id: 'concentration', name: '集中意志',  emoji: '🎯', col: 2, row: 4, maxLevel:  5, type: 'active',  prereq: { id: 'lord_aura', level: 3 },
        descs: ['Hit+50，持續45秒。','Hit+65。','Hit+80。','Hit+95。','Hit+115。'] },
    ]
  }
};

// 計算屬性
const selectedFirstJob = computed(() => {
  if (!selectedJob.value) return null;
  if (firstJobs.find(j => j.id === selectedJob.value)) return selectedJob.value;
  return secondJobs.find(j => j.id === selectedJob.value)?.parent ?? null;
});

const availableSecondJobs = computed(() =>
  selectedFirstJob.value
    ? secondJobs.filter(j => j.parent === selectedFirstJob.value)
    : secondJobs
);

const currentJobData = computed(() =>
  selectedJob.value ? (jobSkillData[selectedJob.value] ?? null) : null
);

const totalSP = computed(() => currentJobData.value?.totalSP ?? 49);
const usedSP  = computed(() => {
  if (!currentJobData.value) return 0;
  return currentJobData.value.skills.reduce((sum, s) => sum + (skillLevels[s.id] || 0), 0);
});
const remainingSP = computed(() => totalSP.value - usedSP.value);

const gridCols = computed(() => {
  if (!currentJobData.value) return 6;
  return Math.max(...currentJobData.value.skills.map(s => s.col)) + 1;
});
const gridRows = computed(() => {
  if (!currentJobData.value) return 5;
  return Math.max(...currentJobData.value.skills.map(s => s.row)) + 1;
});
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridCols.value}, ${CELL}px)`,
  gridTemplateRows:    `repeat(${gridRows.value}, ${CELL}px)`,
  width:  `${gridCols.value * CELL}px`,
  height: `${gridRows.value * CELL}px`,
}));

const prereqLines = computed(() => {
  if (!currentJobData.value) return [];
  return currentJobData.value.skills
    .filter(s => s.prereq)
    .map(s => {
      const from = currentJobData.value.skills.find(x => x.id === s.prereq.id);
      if (!from) return null;
      const cx = col => (col - 1) * CELL + CELL / 2;
      const cy = row => (row - 1) * CELL + CELL / 2;
      return { x1: cx(from.col), y1: cy(from.row) + 38, x2: cx(s.col), y2: cy(s.row) - 38, met: isPrereqMet(s) };
    }).filter(Boolean);
});

// 方法
const selectJob = (id) => {
  selectedJob.value = id;
  if (currentJobData.value) {
    currentJobData.value.skills.forEach(s => { if (!(s.id in skillLevels)) skillLevels[s.id] = 0; });
  }
};

const isPrereqMet = (skill) => {
  if (!skill.prereq) return true;
  return (skillLevels[skill.prereq.id] || 0) >= skill.prereq.level;
};

const isUnlocked = (skill) => isPrereqMet(skill);

const addPoint = (skill) => {
  const cur = skillLevels[skill.id] || 0;
  if (!isUnlocked(skill) || cur >= skill.maxLevel || remainingSP.value <= 0) return;
  skillLevels[skill.id] = cur + 1;
};

const removePoint = (skill) => {
  const cur = skillLevels[skill.id] || 0;
  if (cur <= 0) return;
  const dependents = (currentJobData.value?.skills || []).filter(s =>
    s.prereq?.id === skill.id && (skillLevels[s.id] || 0) > 0
  );
  if (dependents.some(d => cur - 1 < d.prereq.level)) return;
  skillLevels[skill.id] = cur - 1;
};

const onWheel = (e, skill) => {
  if (e.deltaY < 0) addPoint(skill); else removePoint(skill);
};

const resetAll = () => { Object.keys(skillLevels).forEach(k => { skillLevels[k] = 0; }); };

const getSkillDesc = (skill) => {
  const lv = Math.max(0, (skillLevels[skill.id] || 1) - 1);
  return skill.descs?.[lv] ?? '尚無說明。';
};

const getSkillName = (id) => {
  for (const job of Object.values(jobSkillData)) {
    const s = job.skills.find(x => x.id === id);
    if (s) return s.name;
  }
  return id;
};
</script>

<style scoped>
.skilltree-root {
  min-height: 100vh;
  background: #1a1108;
  color: #e0d3b8;
  font-family: 'Microsoft JhengHei', sans-serif;
  display: flex;
  flex-direction: column;
}
.st-header {
  background: #0e0904;
  border-bottom: 2px solid #5e4b37;
  padding: 0 24px;
  flex-shrink: 0;
}
.st-header-inner {
  max-width: 1600px; margin: 0 auto; height: 60px;
  display: flex; align-items: center; justify-content: space-between;
}
.st-title-group { display: flex; align-items: center; gap: 12px; }
.st-logo { font-size: 24px; }
.st-title { font-size: 20px; font-weight: 900; color: #f1d483; margin: 0; }
.st-subtitle { font-size: 11px; color: #a6937c; margin: 2px 0 0; }
.st-header-actions { display: flex; align-items: center; gap: 12px; }
.st-sp-display { font-size: 13px; color: #a6937c; }
.st-sp-display b { color: #f1d483; font-size: 18px; }
.st-btn-reset {
  background: #3d2b1f; border: 1px solid #5e4b37; color: #a6937c;
  padding: 6px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all .2s;
}
.st-btn-reset:hover { background: #5e4b37; color: #f1d483; }

.st-layout { display: flex; flex: 1; overflow: hidden; max-width: 1600px; margin: 0 auto; width: 100%; }

.st-job-panel {
  width: 180px; flex-shrink: 0; background: #0e0904; border-right: 1px solid #5e4b37;
  padding: 16px 10px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;
}
.st-job-section { display: flex; flex-direction: column; gap: 4px; }
.st-job-section-label {
  font-size: 10px; font-weight: bold; color: #5e4b37; letter-spacing: 2px;
  padding: 4px 6px; border-bottom: 1px solid #2c1e14; margin-bottom: 4px; text-transform: uppercase;
}
.st-job-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
.st-job-btn {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 8px 4px; border-radius: 8px; cursor: pointer;
  background: #1e150d; border: 1px solid #3d2b1f; color: #a6937c;
  font-size: 11px; font-weight: bold; transition: all .2s; text-align: center;
}
.st-job-btn:hover { background: #2c1e14; border-color: #5e4b37; color: #e0d3b8; }
.st-job-btn.active { background: #3d2b1f; border-color: #f1d483; color: #f1d483; }
.st-job-emoji { font-size: 20px; }
.st-job-arrow { text-align: center; color: #3d2b1f; font-size: 12px; padding: 4px 0; }

.st-main { flex: 1; overflow: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.st-job-title-bar { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
.st-job-title { font-size: 22px; font-weight: 900; color: #f1d483; margin: 0; }
.st-sp-bar { display: flex; align-items: center; gap: 8px; max-width: 300px; }
.st-sp-used { font-size: 13px; color: #f1d483; font-weight: bold; white-space: nowrap; }
.st-sp-track { width: 160px; height: 6px; background: #2c1e14; border-radius: 3px; overflow: hidden; }
.st-sp-fill { height: 100%; background: linear-gradient(90deg, #f1d483, #c8a840); border-radius: 3px; transition: width .3s; }
.st-sp-total { font-size: 12px; color: #5e4b37; white-space: nowrap; }

.st-skill-grid-wrapper { overflow: auto; }
.st-skill-grid { display: grid; position: relative; }
.st-prereq-svg { position: absolute; top: 0; left: 0; pointer-events: none; z-index: 0; overflow: visible; }
.st-prereq-line { stroke: #3d2b1f; stroke-width: 2; stroke-dasharray: 5 4; }
.st-prereq-line.met { stroke: #7a6340; stroke-dasharray: none; }

.st-skill-cell {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  width: 88px; height: 88px; margin: 11px;
  background: #1e150d; border: 2px solid #3d2b1f; border-radius: 12px;
  cursor: pointer; transition: all .2s; user-select: none;
}
.st-skill-cell:hover:not(.is-locked) {
  border-color: #f1d483; background: #2c1e14;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(241,212,131,.2);
}
.st-skill-cell.is-active  { border-color: #7a6340; background: #251a0d; }
.st-skill-cell.is-maxed   { border-color: #c8a840; background: #2c1e14; box-shadow: 0 0 14px rgba(200,168,64,.25); }
.st-skill-cell.is-locked  { opacity: .3; cursor: not-allowed; }
.st-skill-cell.is-passive { border-style: dashed; }

.st-skill-icon-box { position: relative; }
.st-skill-emoji { font-size: 32px; line-height: 1; display: block; }
.st-passive-badge {
  position: absolute; bottom: -2px; right: -6px;
  background: #5b8fa4; color: white; font-size: 8px; font-weight: bold;
  border-radius: 3px; padding: 1px 3px;
}
.st-skill-level-bar { display: flex; gap: 2px; }
.st-level-pip { width: 6px; height: 4px; border-radius: 2px; background: #2c1e14; border: 1px solid #3d2b1f; transition: background .15s; }
.st-level-pip.filled { background: #f1d483; border-color: #c8a840; }
.st-skill-name { font-size: 10px; font-weight: bold; color: #a6937c; text-align: center; line-height: 1.2; max-width: 80px; }
.st-skill-lv { display: flex; gap: 1px; align-items: baseline; font-size: 12px; font-weight: bold; }
.st-skill-lv .cur { color: #f1d483; }
.st-skill-lv .sep { color: #5e4b37; font-size: 9px; }
.st-skill-lv .max { color: #5e4b37; font-size: 9px; }

.st-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: #3d2b1f; }
.st-empty-icon { font-size: 64px; }
.st-empty p { font-size: 16px; }

.st-tooltip {
  position: fixed; right: 24px; bottom: 24px; width: 280px;
  background: #0e0904; border: 1px solid #5e4b37; border-radius: 12px;
  padding: 16px; z-index: 100; pointer-events: none; box-shadow: 0 8px 32px rgba(0,0,0,.7);
}
.st-tooltip-header { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 8px; }
.st-tooltip-emoji { font-size: 36px; flex-shrink: 0; }
.st-tooltip-name { font-size: 15px; font-weight: 900; color: #f1d483; }
.st-tooltip-type { font-size: 10px; color: #a6937c; margin-top: 2px; }
.st-tooltip-lv { font-size: 11px; color: #a6937c; margin-bottom: 8px; }
.st-tooltip-desc { font-size: 12px; color: #c8b89a; line-height: 1.7; margin: 0 0 8px; }
.st-tooltip-prereq { font-size: 11px; margin-bottom: 8px; }
.st-tooltip-prereq .label { color: #5e4b37; }
.st-tooltip-prereq span { color: #8b3a3a; }
.st-tooltip-prereq span.met { color: #4a7c59; }
.st-tooltip-hint { font-size: 10px; color: #3d2b1f; border-top: 1px solid #1e150d; padding-top: 8px; text-align: center; }

.tooltip-fade-enter-active, .tooltip-fade-leave-active { transition: opacity .15s, transform .15s; }
.tooltip-fade-enter-from, .tooltip-fade-leave-to { opacity: 0; transform: translateY(6px); }
</style>
