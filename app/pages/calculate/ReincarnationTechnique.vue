<template>
  <div class="page-wrapper">
    <div class="content-card">

      <h1 class="main-title">🌳 轉生術成功率計算器</h1>

      <!-- 等級選擇 -->
      <div class="form-group">
        <label>轉生術等級</label>
        <select v-model="skillLevel" class="input">
          <option v-for="n in 10" :key="n" :value="n">
            {{ n }} 等
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>BaseLv</label>
        <input type="number" v-model.number="baseLv" class="input" />
      </div>

      <!-- 屬性輸入 -->

      <div class="form-group">
        <label>INT</label>
        <input type="number" v-model.number="intValue" class="input" />
      </div>

      <div class="form-group">
        <label>LUK</label>
        <input type="number" v-model.number="luk" class="input" />
      </div>

      <!-- 結果 -->
      <div class="result-box">
        <p>基礎成功率：<span class="highlight">{{ baseChance }}%</span></p>
        <p>公式加成：<span class="highlight">{{ bonusChance }}%</span></p>
        <hr />
        <p class="final-result">
          🎯 最終成功率：
          <span class="final">{{ finalChance }}%</span>
        </p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "RebornSkill",
  data() {
    return {
      skillLevel: 1,
      luk: 0,
      intValue: 0,
      baseLv: 1
    };
  },
  computed: {
    // 基礎成功率
    baseChance() {
      return this.skillLevel * 2;
    },

    // 公式加成
    bonusChance() {
      const value =
          (this.luk + this.intValue + this.baseLv) / 10;

      // 先套用上限 70，再保留小數點 1 位
      const limited = Math.min(value, 70);

      return parseFloat(limited.toFixed(1));
    },


    // 最終成功率
    finalChance() {
      return Math.min(this.baseChance + this.bonusChance, 70);
    },
  },
};
</script>

<style scoped>
.page-wrapper {
  background: #3A2C1F;
  padding: 30px;
  min-height: 100vh;
}

.content-card {
  max-width: 500px;
  margin: auto;
  background: #3A2C1F;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 12px;
  color: #fff;
  font-family: 'Microsoft JhengHei', sans-serif;
}

.main-title {
  text-align: center;
  color: #ffc107;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: #503D2B;
  color: #fff;
}

.result-box {
  margin-top: 25px;
  background: #503D2B;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.highlight {
  color: #00e5ff;
  font-weight: bold;
}

.final-result {
  font-size: 1.3rem;
  margin-top: 10px;
}

.final {
  color: #ff5252;
  font-weight: bold;
}
</style>
