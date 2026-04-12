<template>
  <div v-if="visible">

    <!-- ══ 側邊導覽（固定，跨頁面持續顯示） ══ -->
    <aside
        class="fixed top-0 left-0 h-full z-40 flex flex-col bg-[#1e150d] border-r border-[#5e4b37] transition-all duration-300"
        :class="sidebarOpen ? 'w-56' : 'w-14'">

      <!-- Logo / 收合按鈕 -->
      <div class="flex items-center justify-between px-3 py-4 border-b border-[#5e4b37]">
        <span v-if="sidebarOpen" class="text-[#f1d483] font-black text-base tracking-wide truncate">⚔️ ROZ 管理</span>
        <button @click="toggleSidebar"
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
                  class="flex items-center gap-3 px-2 py-2.5 rounded-lg transition-all group relative"
                  :class="isActive(item.to)
                    ? 'bg-[#5e4b37] text-[#f1d483]'
                    : 'text-[#a6937c] hover:bg-[#3d2b1f] hover:text-[#e0d3b8]'">
          <span class="text-lg shrink-0 w-5 text-center">{{ item.icon }}</span>
          <span v-if="sidebarOpen" class="text-sm font-bold truncate">{{ item.label }}</span>
          <span v-if="!sidebarOpen"
                class="absolute left-14 bg-[#1e150d] border border-[#5e4b37] text-[#e0d3b8] text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>

      <!-- 底部：登出 -->
      <div class="border-t border-[#5e4b37] py-3 px-2">
        <button @click="logout"
                class="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-[#a6937c] hover:bg-[#3d2b1f] hover:text-[#f0a8a8] transition group relative">
          <span class="text-lg shrink-0 w-5 text-center">🚪</span>
          <span v-if="sidebarOpen" class="text-sm">登出</span>
          <span v-if="!sidebarOpen"
                class="absolute left-14 bg-[#1e150d] border border-[#5e4b37] text-[#e0d3b8] text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            登出
          </span>
        </button>
      </div>
    </aside>

    <!-- 側邊欄佔位（推開頁面內容） -->
    <div class="fixed top-0 left-0 h-full pointer-events-none transition-all duration-300"
         :class="sidebarOpen ? 'w-56' : 'w-14'"></div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route  = useRoute();
const router = useRouter();

const visible     = ref(false);
const sidebarOpen = ref(true);

const navItems = [
  { to: '/roz/accounts',  icon: '👤', label: '帳號管理'    },
  { to: '/roz/teamplace', icon: '⚔️', label: '副本組隊'    },
  { to: '/roz/taskcd',    icon: '⏱️', label: '任務 CD 追蹤' },
];

const isActive = (path) => route.path === path;

// 收合狀態持久化
const SIDEBAR_KEY = 'roz_sidebar_open';
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
  localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen.value));
};

const logout = async () => {
  await $fetch('/api/roz/logout', { method: 'POST' });
  visible.value = false;
  router.push('/');
};

// 用 useFetch 在 SSR 階段就取得 cookie 狀態，不需等 onMounted
const { data: checkData } = await useFetch('/api/roz/check');
if (checkData.value?.ok) visible.value = true;

// 路由切換時重新確認（例如登入後跳轉）
watch(() => route.path, async () => {
  try {
    const res = await $fetch('/api/roz/check');
    visible.value = !!res?.ok;
  } catch {
    visible.value = false;
  }
});

onMounted(() => {
  // 恢復上次收合狀態（localStorage 只能在 client 讀）
  const saved = localStorage.getItem(SIDEBAR_KEY);
  if (saved !== null) sidebarOpen.value = saved === 'true';
});
</script>