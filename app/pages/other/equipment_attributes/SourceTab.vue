<template>
  <button :class="['tab-button', { active: isActive }]">
    {{ sourceName }}
  </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  sourceName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.tab-button {
  padding: 10px 15px;
  cursor: pointer;
  border: none;
  background-color: #f1f1f1;
  color: #555;
  border-bottom: 3px solid transparent;
  transition: background-color 0.3s, border-bottom 0.3s;
  font-size: 16px;
  font-weight: bold;
}
.tab-button:hover {
  background-color: #e9e9e9;
}
.tab-button.active {
  background-color: #fff;
  color: #007bff;
  border-bottom: 3px solid #007bff;
}
</style>