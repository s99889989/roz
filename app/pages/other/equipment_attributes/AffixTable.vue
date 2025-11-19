<template>
  <div class="affix-card">
    <h4 class="affix-title">{{ affixTitle }}</h4>
    <table class="affix-table">
      <thead>
      <tr>
        <th>附加能力</th>
        <th>數值</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td v-if="item.備註">{{ item.備註 }}</td>
        <td v-else>{{ item.附加能力 }}</td>

        <td v-if="item.數值">{{ item.數值 }}</td>
        <td v-else-if="item.備註" class="note-cell" colspan="1"></td>
        <td v-else>-</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  affixTitle: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.affix-card {
  width: 350px; /* 控制每個表格的寬度 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
}
.affix-title {
  background-color: #28a745; /* 綠色標題，類似圖片中的橘色或綠色 */
  color: white;
  padding: 10px;
  margin: 0;
  text-align: center;
  font-size: 1.1em;
}
.affix-table {
  width: 100%;
  border-collapse: collapse;
}
.affix-table th, .affix-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.affix-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}
.affix-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
.note-cell {
  font-style: italic;
  color: #cc0000;
}
</style>