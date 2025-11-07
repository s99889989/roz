
<script setup>
import { reactive, ref, computed, watch } from 'vue'

/* ---------- config / constants ---------- */
// stat max
const statMax = 99

// stat order
const statsOrder = ['STR','AGI','VIT','INT','DEX','LUK']

const eqmStatesOrder = ['E_STR','E_AGI','E_VIT','E_INT','E_DEX','E_LUK', 'HIT', 'FLEE', 'CRIT', 'ASPD']

// 職業加成範例（常見正服方向，非轉生區別）
const jobBonus = {
  '初心者': { STR:0, AGI:0, VIT:0, INT:0, DEX:0, LUK:0 },

  '劍士':   { STR:2, AGI:0, VIT:2, INT:0, DEX:0, LUK:0 },
  '騎士':   { STR:0, AGI:2, VIT:10, INT:0, DEX:3, LUK:4 },
  '十字軍': { STR:2, AGI:0, VIT:4, INT:0, DEX:0, LUK:0 },

  '法師':   { STR:0, AGI:0, VIT:0, INT:5, DEX:2, LUK:0 },
  '巫師':   { STR:0, AGI:0, VIT:0, INT:5, DEX:2, LUK:0 },
  '賢者':   { STR:0, AGI:0, VIT:0, INT:5, DEX:2, LUK:0 },

  '服事':   { STR:0, AGI:0, VIT:2, INT:2, DEX:0, LUK:0 },
  '祭司':   { STR:0, AGI:0, VIT:3, INT:4, DEX:0, LUK:0 },
  '武僧':   { STR:0, AGI:0, VIT:3, INT:4, DEX:0, LUK:0 },

  '盜賊':   { STR:0, AGI:3, VIT:0, INT:0, DEX:0, LUK:2 },
  '刺客':   { STR:0, AGI:4, VIT:0, INT:0, DEX:2, LUK:0 },
  '流氓':   { STR:0, AGI:2, VIT:0, INT:0, DEX:3, LUK:0 },

  '弓箭手':   { STR:0, AGI:3, VIT:0, INT:0, DEX:1, LUK:0 },
  '獵人':   { STR:0, AGI:3, VIT:0, INT:0, DEX:5, LUK:0 },
  '詩人':   { STR:0, AGI:3, VIT:0, INT:0, DEX:3, LUK:0 },
  '舞孃':   { STR:0, AGI:3, VIT:0, INT:0, DEX:3, LUK:0 },

  '商人':   { STR:2, AGI:0, VIT:0, INT:0, DEX:0, LUK:0 },
  '鐵匠':   { STR:3, AGI:0, VIT:5, INT:0, DEX:0, LUK:0 },
  '煉金':   { STR:3, AGI:0, VIT:5, INT:0, DEX:0, LUK:0 },
}



/* ---------- reactive state ---------- */
const job = ref('騎士')
const level = ref(66)

// base stats (editable)
const baseStats = reactive({
  STR: 71, AGI: 9, VIT: 1, INT: 36, DEX: 45, LUK: 1,
  E_STR: 0, E_AGI: 0, E_VIT: 0, E_INT: 0, E_DEX: 0, E_LUK: 0,
  ATK: 0, MATK: 0, DEF: 0, MDEF: 0, HIT: 0, FLEE: 0, CRIT: 0, ASPD: 0,
})



// total/derived constants (weapon placeholder)
const weaponATK = ref(0)
const weaponMATK = ref(0)

// formula constants (近似，若需精準可改)
const cfg = reactive({
  hp_base: 50,
  hp_per_vit: 20,
  hp_per_level: 5,
  sp_base: 10,
  sp_per_int: 3,
  atk_per_str: 2,
  matk_per_int: 2,
})

/* ---------- computed ---------- */

//每點花費
function getCostForStat(statValue) {
  if (statValue <= 10) return 2;
  if (statValue <= 20) return 3;
  if (statValue <= 30) return 4;
  if (statValue <= 40) return 5;
  if (statValue <= 50) return 6;
  if (statValue <= 60) return 7;
  if (statValue <= 70) return 8;
  if (statValue <= 80) return 9;
  if (statValue <= 90) return 10;
  if (statValue <= 100) return 11;
  return 12;
}
// 總點數
const totalPoints = computed(() => {
  let total = 61; // 初始點數

  for (let lv = 2; lv <= level.value; lv++) {
    total += 3 + Math.floor((lv - 2) / 5);
  }

  return total;
});
// 已使用點數（依照素質花費來扣）
const allocatedPoints = computed(() => {
  let totalCost = 0;

  statsOrder.forEach((key) => {
    const statValue = Number(baseStats[key]);     // ex: STR = 30
    const baseValue = 1;                          // 每項初始是 1
    for (let i = baseValue; i < statValue; i++) {
      totalCost += getCostForStat(i);
    }
  });

  return totalCost;
});
//剩餘點數
const remainingPoints = computed(() => Math.max(0, totalPoints.value - allocatedPoints.value))

// final stats include job bonus
const finalStats = computed(() => {
  // const bonus = jobBonus[job.value] || {}
  const out = {}
  for (const s of statsOrder) {
    out[s] = Math.max(1, Number(baseStats[s] || 0))
  }
  return out
})

const finalEqmStats = computed(() => {
  const bonus = jobBonus[job.value] || {}
  const out = {}
  for (const s of eqmStatesOrder) {
    out[s] = Math.max(0, Number(baseStats[s] || 0) + (bonus[s.replace(/^E_/, '')] || 0))
  }
  return out
})


// core combat calculations (近似正服公式)
const calc = computed(() => {


  const STR = finalStats.value.STR + finalEqmStats.value.E_STR
  const AGI = finalStats.value.AGI + finalEqmStats.value.E_AGI
  const VIT = finalStats.value.VIT + finalEqmStats.value.E_VIT
  const INT = finalStats.value.INT + finalEqmStats.value.E_INT
  const DEX = finalStats.value.DEX + finalEqmStats.value.E_DEX
  const LUK = finalStats.value.LUK + finalEqmStats.value.E_LUK

  // HP / SP
  const hp = Math.max(0, Math.floor(VIT + level.value * 10 * (100 + VIT /100)))
  const sp = Math.max(0, Math.floor(cfg.sp_base + INT * cfg.sp_per_int))

  // ATK / MATK (簡化)
  let atk = Math.floor((STR + DEX * 0.2 + weaponATK.value) * ((100 + STR*0.5) / 100))

  if(job.value === '弓箭手' || job.value === '獵人' || job.value === '詩人' || job.value === '舞孃'){
    atk = Math.floor((STR * 0.2 + DEX * ((100 + DEX) /100)) + weaponATK.value)
  }

  const matk = Math.floor(INT * 1.5 + DEX * 0.2 + weaponMATK.value)

  // HIT / FLEE (常見近似)
  const hit = 175 + level.value + Math.floor(DEX + LUK * 0.33) + finalEqmStats.value.HIT;
  const flee = 100 + level.value + Math.floor(AGI + LUK * 0.2) + finalEqmStats.value.FLEE;

  // CRIT (近似)
  const crit = 1 + Math.floor(LUK / 3)

  // ASPD 近似（常用公式的簡化版）
  let aspdRaw = 150 + Math.floor(AGI / 3) + Math.floor(DEX / 5)
  if (aspdRaw > 190) aspdRaw = 190
  if (aspdRaw < 1) aspdRaw = 1

  // DEF / MDEF (非常簡化)
  const def = Math.floor(VIT * 0.5 + VIT * 0.2 + AGI * 0.2)
  const mdef = Math.floor(INT + DEX * 0.2)

  // WEIGHT approx
  const weight = 2730 + Math.floor(STR * 30)

  //出血
  const bleeding = AGI;
  //中毒
  const poisoning = VIT;
  //冰凍
  const freezing = mdef;
  //混亂
  const confusion = LUK;
  //石化
  const petrification = mdef;
  //睡眠
  const sleep = AGI;
  //暈眩
  const dizziness = VIT;
  //沉默
  const silence = INT;
  //詛咒
  const curse = LUK;
  //黑暗
  const darkness = INT;

  return {
    hp, sp, atk, matk, hit, flee, crit, aspd: aspdRaw, aspdDisplay: aspdRaw, def, mdef, weight,
    bleeding, poisoning, freezing, confusion, petrification, sleep, dizziness, silence, curse, darkness,
  }
})

/* ---------- helpers ---------- */
function format(n) {
  if (n === null || n === undefined) return '-'
  return Number(n).toLocaleString()
}

function changeStat(stat, delta) {
  const newVal = Number(baseStats[stat] || 0) + delta;
  if (newVal < 1 || newVal > statMax) return;
  baseStats[stat] = newVal;
}

function changeEqmStat(stat, delta) {
  const newVal = Number(baseStats[stat] || 0) + delta;
  if (newVal < 0 || newVal > statMax) return;
  baseStats[stat] = newVal;
}

function resetAll() {
  level.value = 1
  for (const s of statsOrder) baseStats[s] = 1
  job.value = '初心者'
}

function loadSample() {
  level.value = 66
  baseStats.STR = 71
  baseStats.AGI = 9
  baseStats.VIT = 1
  baseStats.INT = 36
  baseStats.DEX = 45
  baseStats.LUK = 1
}

function loadSample2() {
  level.value = 66
  baseStats.STR = 46
  baseStats.AGI = 50
  baseStats.VIT = 1
  baseStats.INT = 34
  baseStats.DEX = 47
  baseStats.LUK = 1
}

function loadSample3() {
  level.value = 61
  baseStats.STR = 1
  baseStats.AGI = 43
  baseStats.VIT = 1
  baseStats.INT = 60
  baseStats.DEX = 43
  baseStats.LUK = 1
}

/* ---------- localStorage save/load ---------- */
const STORAGE_KEY = 'ro_status_calc_v2'
watch([() => job.value, () => level.value, () => ({...baseStats}), () => ({...cfg})], () => {
  try {
    const payload = { job: job.value, level: level.value, base: {...baseStats}, cfg: {...cfg} }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (e) { /* ignore */ }
}, { deep: true })

// load on start
try {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    const p = JSON.parse(raw)
    if (p.job) job.value = p.job
    if (p.level) level.value = p.level
    if (p.base) Object.assign(baseStats, p.base)
    if (p.cfg) Object.assign(cfg, p.cfg)
  }
} catch (e) { /* ignore */ }

/* ---------- styles as computed for template (avoids using @apply) ---------- */
const btnWarnStyle = { background: '#ffb300', color: '#0f0f14', fontWeight: 700 }
const btnInfoStyle = { background: '#1f8ed8', color: '#fff', fontWeight: 700 }
const cardStyle = { background: '#241D16', border: '1px solid #24242b', borderRadius: '8px' }

</script>

<template>
  <div class="min-h-screen py-8" :style="{ background: '#2b1e12' }" style="border-radius: 10px">
    <div class="max-w-6xl mx-auto px-4">
      <!-- header -->
      <header class="mb-6 text-center">
        <h1 class="text-3xl font-extrabold" :style="{ color: '#ffb300' }">RO 素質計算機</h1>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 左側：素質輸入 -->
        <section class="lg:col-span-5 bg-[#3C3025] rounded-lg border" :style="{ borderColor: '#2b2b32' }">
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <h2 class="font-bold text-lg" :style="{ color: '#ffb300' }">素質設定</h2>
              <div class="flex gap-2">
                <button @click="resetAll" class="px-3 py-1 rounded-md text-sm font-semibold" :style="btnWarnStyle">重置</button>
                <button @click="loadSample" class="px-3 py-1 rounded-md text-sm font-semibold" :style="btnInfoStyle">66騎士</button>
                <button @click="loadSample2" class="px-3 py-1 rounded-md text-sm font-semibold" :style="btnInfoStyle">66刺客</button>
                <button @click="loadSample3" class="px-3 py-1 rounded-md text-sm font-semibold" :style="btnInfoStyle">61獵人</button>
              </div>
            </div>

            <!-- top controls -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label class="text-xs text-slate-300">職業</label>
                <select v-model="job" class="mt-1 w-full rounded-md p-2 bg-[#241D16] text-white border" :style="{ borderColor: '#2b2b32' }">
                  <option v-for="(b, k) in jobBonus" :key="k" :value="k">{{ k }}</option>
                </select>
              </div>
              <div>
                <label class="text-xs text-slate-300">等級</label>
                <input type="number" v-model.number="level" min="1" max="99" class="mt-1 w-full rounded-md p-2 bg-[#241D16] text-white border" :style="{ borderColor: '#2b2b32' }"/>
              </div>
            </div>

            <!-- remaining points -->
            <div class="mb-3 text-sm text-slate-300">
              可用狀態點：<span class="font-mono text-[#ffb300]">{{ totalPoints }}</span>
              ／ 已用：<span class="font-mono text-green-300">{{ allocatedPoints }}</span>
              ／ 剩餘：<span class="font-mono text-emerald-300">{{ remainingPoints }}</span>
            </div>

            <!-- 六項屬性 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="stat in statsOrder" :key="stat" class="bg-[#241D16] p-3 rounded border" :style="{ borderColor: '#2b2b32' }">
                <div class="flex justify-between items-center mb-2">
                  <div>
                    <div class="text-sm font-semibold text-slate-200">{{ stat }}</div>
                    <div class="text-xs text-slate-400">職業加成：<span class="text-emerald-300">+{{ jobBonus[job]?.[stat] || 0 }}</span></div>
                  </div>
                  <div class="text-xl font-bold" :style="{ color: '#ffb300' }">{{ finalStats[stat] }} + {{ finalEqmStats['E_'+stat] }}</div>
                </div>

                <div class="flex items-center gap-2">
                  <button @click="changeStat(stat, -1)" class="px-3 py-1 rounded-md bg-[#2a2326] text-white">-</button>
                  <input type="number" v-model.number="baseStats[stat]" min="1" :max="statMax" class="w-20 text-center rounded-md bg-[#3A2C1F] text-white p-1 border" :style="{ borderColor: '#2b2b32' }" />
                  <button @click="changeStat(stat, 1)" class="px-3 py-1 rounded-md bg-[#2a2326] text-white">+</button>
                </div>
              </div>
            </div>

            <!-- notes -->
            <div class="mt-4 mb-4 text-xs text-slate-400">
              <p>備註：素質上限 {{ statMax }}；職業加成已顯示並套用至「最終」素質。</p>
            </div>

            <div class="mt-4 mb-4 text-lg">
              <p class="font-bold" :style="{ color: '#ffb300' }">裝備+料理</p>
            </div>

            <!-- 裝備屬性 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="stat in eqmStatesOrder" :key="stat" class="bg-[#241D16] p-3 rounded border" :style="{ borderColor: '#2b2b32' }">

                <div class="text-sm font-semibold text-slate-200">{{ stat.replace(/^E_/, '') }}</div>
                <div class="flex items-center gap-2">
                  <button @click="changeEqmStat(stat, -1)" class="px-3 py-1 rounded-md bg-[#2a2326] text-white">-</button>
                  <input type="number" v-model.number="baseStats[stat]" min="1" :max="statMax" class="w-20 text-center rounded-md bg-[#3A2C1F] text-white p-1 border" :style="{ borderColor: '#2b2b32' }" />
                  <button @click="changeEqmStat(stat, 1)" class="px-3 py-1 rounded-md bg-[#2a2326] text-white">+</button>
                  <!--                  <div class="ml-2 text-sm text-slate-400">最終：<span class="text-slate-100 font-medium">{{ finalStats[stat] }}</span></div>-->
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- 右側：戰鬥數值 -->
        <section class="lg:col-span-7">
          <div class="bg-[#3C3025] p-4 rounded-lg mb-4">
            <h2 class="text-lg font-bold" :style="{ color: '#ffb300' }">戰鬥數值（主要）</h2>

            <!-- grid of cards -->
            <div class="grid grid-cols-2 gap-3 mt-3">

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-4 text-slate-300">ATK</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.atk) }}</div>
                </div>
                <div class="text-xs text-slate-400 mt-1">STR × atk_str + 武器</div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-4 text-slate-300">DEF</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ calc.def }}</div>
                </div>
                <div class="text-xs text-slate-400 mt-1">近似：VIT 影響</div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-4 text-slate-300">MATK</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.matk) }}</div>
                </div>
                <div class="text-xs text-slate-400 mt-1">INT × matk_int + 武器</div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-4 text-slate-300">MDEF</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ calc.mdef }}</div>
                </div>
                <div class="text-xs text-slate-400 mt-1">近似：INT 影響</div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-4 text-slate-300">HIT</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.hit) }}</div>
                </div>
                <div class="text-xs text-slate-400 mt-1">DEX主 + LUK小幅</div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-4 text-slate-300">FLEE</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.flee) }}</div>
                </div>
                <div class="text-xs text-slate-400 mt-1">AGI主 + LUK小幅</div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-4 text-slate-300">CRIT</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ calc.crit }}</div>
                </div>
                <div class="text-xs text-slate-400 mt-1">LUK 影響</div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-4 text-slate-300">ASPD</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ calc.aspdDisplay }}</div>
                </div>
                <div class="text-xs text-slate-400 mt-1">近似值（上限193）</div>
              </div>




            </div>
          </div>

          <!-- HP/SP/Weight -->
          <div class="bg-[#3C3025] p-4 rounded-lg border" :style="{ borderColor: '#2b2b32' }">
            <h3 class="text-lg font-bold" :style="{ color: '#ffb300' }">其他</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">

<!--              <div class="p-3 rounded-lg" :style="cardStyle">-->
<!--                <div class="flex items-center justify-center items-center mb-2">-->
<!--                  <div class="text-2xl me-4 text-slate-300">HP</div>-->
<!--                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.hp) }}</div>-->
<!--                </div>-->
<!--                <div class="text-xs text-slate-400 mt-1">公式：HP_base + VIT×HP_per_VIT + Level×HP_per_Lv</div>-->
<!--              </div>-->

<!--              <div class="p-3 rounded-lg" :style="cardStyle">-->
<!--                <div class="flex items-center justify-center items-center mb-2">-->
<!--                  <div class="text-2xl me-4 text-slate-300">SP</div>-->
<!--                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.sp) }}</div>-->
<!--                </div>-->
<!--                <div class="text-xs text-slate-400 mt-1">公式：SP_base + INT×SP_per_INT</div>-->
<!--              </div>-->

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-4 text-slate-300">負重</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.weight) }}</div>
                </div>

                <div class="text-xs text-slate-400 mt-1">公式：每點STR+30</div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-1 text-slate-300">抗出血</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.bleeding) }}</div>
                  <div class="text-2xl ms-1 text-slate-300">%</div>
                </div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-1 text-slate-300">抗中毒</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.poisoning) }}</div>
                  <div class="text-2xl ms-1 text-slate-300">%</div>
                </div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-1 text-slate-300">抗冰凍</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.freezing) }}</div>
                  <div class="text-2xl ms-1 text-slate-300">%</div>
                </div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-1 text-slate-300">抗混亂</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.confusion) }}</div>
                  <div class="text-2xl ms-1 text-slate-300">%</div>
                </div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-1 text-slate-300">抗石化</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.petrification) }}</div>
                  <div class="text-2xl ms-1 text-slate-300">%</div>
                </div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-1 text-slate-300">抗睡眠</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.sleep) }}</div>
                  <div class="text-2xl ms-1 text-slate-300">%</div>
                </div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-1 text-slate-300">抗暈眩</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.dizziness) }}</div>
                  <div class="text-2xl ms-1 text-slate-300">%</div>
                </div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-1 text-slate-300">抗沉默</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.silence) }}</div>
                  <div class="text-2xl ms-1 text-slate-300">%</div>
                </div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-1 text-slate-300">抗詛咒</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.curse) }}</div>
                  <div class="text-2xl ms-1 text-slate-300">%</div>
                </div>
              </div>

              <div class="p-3 rounded-lg" :style="cardStyle">
                <div class="flex items-center justify-center items-center mb-2">
                  <div class="text-2xl me-1 text-slate-300">抗黑暗</div>
                  <div class="text-2xl font-extrabold" :style="{ color: '#ffb300' }">{{ format(calc.darkness) }}</div>
                  <div class="text-2xl ms-1 text-slate-300">%</div>
                </div>
              </div>

            </div>
          </div>


        </section>
      </div>

      <!-- footer note -->
      <footer class="mt-6 text-sm text-slate-400">
        <p>說明：如有問題可連絡修改。</p>
      </footer>
    </div>
  </div>
</template>


<style scoped>
/* 微調輸入框在深色下的外觀（Tailwind 已大量使用，這裡僅少量補強） */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
