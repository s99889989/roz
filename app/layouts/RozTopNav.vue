<template>
  <div class="fixed top-0 right-0 z-50 p-3">
    <div class="relative" ref="menuRef">

      <!-- 頭像按鈕 -->
      <button @click="open = !open"
              class="w-9 h-9 rounded-full overflow-hidden border-2 transition"
              :class="open ? 'border-[#f1d483]' : 'border-[#5e4b37] hover:border-[#8b7a64]'">
        <img v-if="user.picture" :src="user.picture"
             class="w-full h-full object-cover"
             referrerpolicy="no-referrer" />
        <div v-else class="w-full h-full bg-[#5e4b37] flex items-center justify-center text-[#f1d483] font-bold text-sm">
          {{ user.name?.charAt(0) ?? '?' }}
        </div>
      </button>

      <!-- 下拉選單 -->
      <Transition name="dropdown">
        <div v-if="open"
             class="absolute right-0 mt-2 w-56 bg-[#1e150d] border border-[#5e4b37] rounded-xl shadow-2xl overflow-hidden">

          <!-- 使用者資訊 -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-[#5e4b37]">
            <img v-if="user.picture" :src="user.picture" class="w-9 h-9 rounded-full" />
            <div class="min-w-0">
              <p class="text-[#f1d483] font-bold text-sm truncate">{{ user.name }}</p>
              <p class="text-[#a6937c] text-xs truncate">{{ user.email }}</p>
            </div>
          </div>

          <!-- 導覽 -->
          <nav class="py-1">
            <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
                      @click="open = false"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm transition"
                      :class="route.path === item.to
                        ? 'bg-[#3d2b1f] text-[#f1d483] font-bold'
                        : 'text-[#e0d3b8] hover:bg-[#3d2b1f] hover:text-[#f1d483]'">
              <span class="w-5 text-center">{{ item.icon }}</span>
              {{ item.label }}
            </NuxtLink>
          </nav>

          <!-- 登出 -->
          <div class="border-t border-[#5e4b37] py-1">
            <button @click="logout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#a6937c] hover:bg-[#3d2b1f] hover:text-[#f0a8a8] transition">
              <span class="w-5 text-center">🚪</span>
              登出
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCommonStore } from '~/stores/common.js';

const route       = useRoute();
const router      = useRouter();
const commonStore = useCommonStore();
const BASE = () => commonStore.data.main_url + '/roz/user';

const open = ref(false);
const menuRef = ref(null);
const user = ref({ name: '', email: '', picture: '' });

const navItems = [
  { to: '/roz/accounts',    icon: '👤', label: '帳號管理'     },
  { to: '/roz/teamplace',   icon: '⚔️', label: '副本組隊'     },
  { to: '/roz/teamclassic', icon: '🏰', label: '經典組隊'     },
  { to: '/roz/dungeons',    icon: '🗺️', label: '副本管理'     },
  { to: '/roz/taskcd',      icon: '⏱️', label: '任務 CD 追蹤' },
];

const logout = async () => {
  try { await fetch(`${BASE()}/logout`, { method: 'POST', credentials: 'include' }); } catch {}
  open.value = false;
  router.push('/roz/login');
};

// 點選單外側關閉
const handleClickOutside = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) open.value = false;
};

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  try {
    const res  = await fetch(`${BASE()}/me`, { credentials: 'include' });
    const data = await res.json();
    if (!data.error) user.value = data;
  } catch {}
});

onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s, transform 0.15s; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }
</style>