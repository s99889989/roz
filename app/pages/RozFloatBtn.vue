<template>
  <!-- 只有 cookie 驗證通過才顯示 -->
  <Teleport to="body">
    <div v-if="visible"
         class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

      <!-- 展開選單 -->
      <transition name="menu-fade">
        <div v-if="menuOpen" class="flex flex-col items-end gap-1.5 mb-1">
          <a v-for="item in navItems" :key="item.to" :href="item.to"
             class="flex items-center gap-2 bg-[#1e150d] border border-[#5e4b37] text-[#e0d3b8] text-sm font-bold px-4 py-2 rounded-xl shadow-xl hover:bg-[#3d2b1f] hover:border-[#f1d483] hover:text-[#f1d483] transition-all whitespace-nowrap">
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </div>
      </transition>

      <!-- 主按鈕 -->
      <button @click="menuOpen = !menuOpen"
              class="w-12 h-12 rounded-full bg-[#4a7c59] hover:bg-[#3d6849] shadow-2xl flex items-center justify-center transition-all border-2 border-white/10"
              :class="menuOpen ? 'rotate-45' : ''"
              title="管理後台">
        <span class="text-white text-xl leading-none">⚔️</span>
      </button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const visible  = ref(false);
const menuOpen = ref(false);

const navItems = [
  { to: '/roz/accounts',  icon: '👤', label: '帳號管理'    },
  { to: '/roz/teamplace', icon: '⚔️', label: '副本組隊'    },
  { to: '/roz/taskcd',    icon: '⏱️', label: '任務 CD 追蹤' },
];

// 確認 cookie 是否有效
onMounted(async () => {
  try {
    const res = await $fetch('/api/roz/check');
    if (res?.ok) visible.value = true;
  } catch {
    visible.value = false;
  }
});
</script>

<style scoped>
.menu-fade-enter-active { transition: opacity 0.2s, transform 0.2s; }
.menu-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.menu-fade-enter-from   { opacity: 0; transform: translateY(8px); }
.menu-fade-leave-to     { opacity: 0; transform: translateY(8px); }
</style>
