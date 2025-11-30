<template>
  <div class="container">
    <h2>RO 命中/閃避計算機</h2>

    <div class="input-section">
      <h3>玩家數值</h3>
      <div class="flex">
        <label class="m-1">
          玩家命中 (HIT)
          <input type="number" v-model.number="playerHit" />
        </label>

        <label class="m-1">
          玩家迴避 (FLEE)
          <input type="number" v-model.number="playerFlee" />
        </label>
      </div>


      <label>
        命中補正%（例如：90、50）
        <input type="number" step="0.1" v-model.number="hitModifier" />
      </label>

    </div>

    <div class="input-section">
      <h3>魔物數值</h3>
      <div class="flex">
        <label class="m-1">
          魔物命中 (HIT 100%)
          <input type="number" v-model.number="monsterHit" />
        </label>

        <label class="m-1">
          魔物迴避 (FLEE 95%)
          <input type="number" v-model.number="monsterFlee" />
        </label>
      </div>



    </div>

    <hr />

    <div class="result-section">
      <h3>計算結果</h3>

      <div class="result">
        <strong>對魔物命中率：</strong>
        <span>{{ playerHitRate }}%</span>
      </div>

      <div class="formula">
        公式： (100 + 玩家命中 {{playerHit}} - 魔物命中 {{monsterHit}} ) × {{100+hitModifier}}%
      </div>

      <br />

      <div class="result">
        <strong>對魔物閃避率：</strong>
        <span>{{ playerDodgeRate }}%</span>
      </div>

      <div class="formula">
        公式：95 + 玩家迴避 {{playerFlee}} - 魔物迴避 {{monsterFlee}}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 玩家
const playerHit = ref(100);
const playerFlee = ref(100);

// 魔物
const monsterHit = ref(100);
const monsterFlee = ref(100);

// 命中補正
const hitModifier = ref(0);

// 計算：對魔物命中率
const playerHitRate = computed(() => {
  let value = (100 + playerHit.value - monsterHit.value) * ((100 + hitModifier.value) / 100);
  if(value > 100){
    return 100;
  }
  return value;
});

// 計算：對魔物閃避率
const playerDodgeRate = computed(() => {
  const value = 95 + playerFlee.value - monsterFlee.value;
  if(value > 95){
    return 95
  }
  return value;
});
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: #2B1E12;
  border-radius: 8px;
  border: 1px solid #ddd;
}

h2, h3 {
  margin-bottom: 10px;
}

.input-section {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input {
  width: 100%;
  padding: 6px 8px;
  font-size: 14px;
  margin-top: 4px;
  box-sizing: border-box;
  background-color: #241D16;
}

.result {
  font-size: 20px;
  margin-bottom: 10px;
}

.formula {
  font-size: 13px;
  color: #555;
}
</style>
