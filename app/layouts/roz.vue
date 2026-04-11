<template>
  <div class="min-h-screen bg-[#2c1e14] flex">

    <!-- ══ 側邊導覽 ══ -->
    <aside
      class="fixed top-0 left-0 h-full z-30 flex flex-col bg-[#1e150d] border-r border-[#5e4b37] transition-all duration-300"
      :class="sidebarOpen ? 'w-56' : 'w-14'">

      <!-- Logo / 收合按鈕 -->
      <div class="flex items-center justify-between px-3 py-4 border-b border-[#5e4b37]">
        <span v-if="sidebarOpen" class="text-[#f1d483] font-black text-base tracking-wide truncate">⚔️ ROZ 管理</span>
        <button @click="sidebarOpen = !sidebarOpen"
                class="text-[#a6937c] hover:text-[#f1d483] transition ml-auto shrink-0"
                :title="sidebarOpen ? '收起' : '展開'">
          <svg class="w-5 h-5 transition-transform duration-300" :class="sidebarOpen ? 'rotate-180' : ''"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      <!-- 導覽項目 -->
      <nav class="flex-1 py-3 space-y-1 px-2 overflow-hidden">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
                  class="flex items-center gap-3 px-2 py-2.5 rounded-lg transition-all group"
                  :class="isActive(item.to)
                    ? 'bg-[#5e4b37] text-[#f1d483]'
                    : 'text-[#a6937c] hover:bg-[#3d2b1f] hover:text-[#e0d3b8]'">
          <span class="text-lg shrink-0 w-5 text-center">{{ item.icon }}</span>
          <span v-if="sidebarOpen" class="text-sm font-bold truncate">{{ item.label }}</span>
          <!-- Tooltip（收起時） -->
          <span v-if="!sidebarOpen"
                class="absolute left-14 bg-[#1e150d] border border-[#5e4b37] text-[#e0d3b8] text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>

      <!-- 底部：回公開頁 + 登出 -->
      <div class="border-t border-[#5e4b37] py-3 px-2 space-y-1">
        <NuxtLink to="/"
                  class="flex items-center gap-3 px-2 py-2 rounded-lg text-[#a6937c] hover:bg-[#3d2b1f] hover:text-[#e0d3b8] transition group">
          <span class="text-lg shrink-0 w-5 text-center">🌐</span>
          <span v-if="sidebarOpen" class="text-sm truncate">回公開頁面</span>
          <span v-if="!sidebarOpen"
                class="absolute left-14 bg-[#1e150d] border border-[#5e4b37] text-[#e0d3b8] text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            回公開頁面
          </span>
        </NuxtLink>
        <button @click="logout"
                class="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-[#a6937c] hover:bg-[#3d2b1f] hover:text-[#f0a8a8] transition group">
          <span class="text-lg shrink-0 w-5 text-center">🚪</span>
          <span v-if="sidebarOpen" class="text-sm">登出</span>
          <span v-if="!sidebarOpen"
                class="absolute left-14 bg-[#1e150d] border border-[#5e4b37] text-[#e0d3b8] text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            登出
          </span>
        </button>
      </div>
    </aside>

    <!-- ══ 主內容區 ══ -->
    <main class="flex-1 transition-all duration-300" :class="sidebarOpen ? 'ml-56' : 'ml-14'">
      <slot />
    </main>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route  = useRoute();
const router = useRouter();

const sidebarOpen = ref(true);

const navItems = [
  { to: '/roz/accounts',  icon: '👤', label: '帳號管理'   },
  { to: '/roz/teamplace', icon: '⚔️', label: '副本組隊'   },
  { to: '/roz/taskcd',    icon: '⏱️', label: '任務 CD 追蹤' },
];

const isActive = (path) => route.path === path;

const logout = async () => {
  await $fetch('/api/roz/logout', { method: 'POST' });
  router.push('/roz/login');
};
</script>
