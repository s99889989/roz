<template>
  <div class="min-h-screen bg-[#2c1e14] flex items-center justify-center p-4 font-sans">

    <!-- 載入中 -->
    <div v-if="status === 'loading'" class="text-[#a6937c] italic text-lg animate-pulse">
      驗證邀請碼中...
    </div>

    <!-- 無效 / 過期 -->
    <div v-else-if="status === 'invalid'"
         class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
      <div class="text-5xl mb-4">⚠️</div>
      <h1 class="text-[#f0a8a8] font-black text-xl mb-2">邀請連結無效</h1>
      <p class="text-[#a6937c] text-sm">{{ errorMsg }}</p>
    </div>

    <!-- ready：顯示邀請資訊 -->
    <div v-else-if="status === 'ready'"
         class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-8 max-w-sm w-full shadow-2xl">
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2c1e14] border-2 border-[#f1d483]/40 flex items-center justify-center text-3xl">
          ⚔️
        </div>
        <p class="text-[#a6937c] text-xs mb-1 uppercase tracking-widest">副本組隊邀請</p>
        <h1 class="text-[#f1d483] font-black text-2xl mb-1">{{ inviteInfo.teamName }}</h1>
        <span class="inline-block text-xs px-2.5 py-1 rounded-full font-bold"
              :class="inviteInfo.permission === 'edit'
                ? 'bg-[#2a4a3a] text-[#a8f0c8] border border-[#a8f0c8]/20'
                : 'bg-[#2a3a4a] text-[#a8c0f0] border border-[#a8c0f0]/20'">
          {{ inviteInfo.permission === 'edit' ? '✏️ 編輯權限' : '👁 查看權限' }}
        </span>
      </div>

      <div class="border-t border-[#5e4b37] pt-4 mb-5">
        <div class="text-[#6b5a4a] text-xs text-center mb-4">
          邀請有效期至 {{ inviteInfo.expiresAt }}
        </div>

        <!-- 未登入提示 -->
        <div v-if="!isLoggedIn" class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl p-4 text-center mb-4">
          <p class="text-[#a6937c] text-sm mb-3">請先登入才能加入隊伍</p>
          <button @click="goLogin"
                  class="w-full py-2.5 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded-lg font-bold transition">
            前往登入
          </button>
        </div>

        <!-- 已登入 → 加入按鈕 -->
        <div v-else>
          <p class="text-[#a6937c] text-xs text-center mb-3">
            登入為 <span class="text-[#e0d3b8] font-bold">{{ userName }}</span>
          </p>
          <button @click="acceptInvite" :disabled="joining"
                  class="w-full py-3 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded-xl font-black text-lg transition disabled:opacity-50 shadow-lg">
            {{ joining ? '加入中...' : '加入隊伍' }}
          </button>
          <p v-if="joinError" class="text-red-400 text-sm text-center mt-3">{{ joinError }}</p>
        </div>
      </div>
    </div>

    <!-- 成功加入 -->
    <div v-else-if="status === 'joined'"
         class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
      <div class="text-5xl mb-4">🎉</div>
      <h1 class="text-[#a8f0c8] font-black text-xl mb-2">成功加入！</h1>
      <p class="text-[#a6937c] text-sm mb-5">
        已加入隊伍「<span class="text-[#f1d483] font-bold">{{ inviteInfo.teamName }}</span>」
      </p>
      <button @click="goTeam"
              class="w-full py-2.5 bg-[#5e4b37] hover:bg-[#7a6248] text-[#f1d483] rounded-xl font-bold transition">
        前往副本組隊 →
      </button>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'blank' });

import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead, useFetch } from '#imports';
import { useCommonStore } from '~/stores/common.js';

const route  = useRoute();
const router = useRouter();
const commonStore = useCommonStore();
const BASE_TEAM = () => commonStore.data.main_url + '/roz/team';
const BASE_USER = () => commonStore.data.main_url + '/roz/user';

// ── 從 URL 取 code（SSR 和 client 都能讀到）
const code = computed(() => (route.query.code || '').toString().toUpperCase());

// ── SSR 階段就 fetch 邀請資訊，讓 Discord bot 能讀到 OG tags
const { data: fetchedInfo } = await useFetch(
    () => `${BASE_TEAM()}/invite-info/${code.value}`,
    { key: `invite-${code.value}`, server: true }
);

const inviteInfo = computed(() => ({
  teamName:   fetchedInfo.value?.teamName   || '',
  permission: fetchedInfo.value?.permission || 'view',
  expiresAt:  fetchedInfo.value?.expiresAt  || '',
}));

const isValidInvite = computed(() => !!fetchedInfo.value?.teamName && !fetchedInfo.value?.error);

// ── OG tags（SITE_URL 改成你的網域）
const SITE_URL = 'https://aftroz.netlify.app';

useHead({
  title: computed(() =>
      inviteInfo.value.teamName
          ? `加入隊伍：${inviteInfo.value.teamName} | ROZ 組隊`
          : 'ROZ 副本組隊邀請'
  ),
  meta: [
    { property: 'og:title', content: computed(() =>
          inviteInfo.value.teamName
              ? `加入隊伍：${inviteInfo.value.teamName}`
              : 'ROZ 副本組隊邀請'
      )},
    { property: 'og:description', content: computed(() =>
          inviteInfo.value.teamName
              ? `你被邀請加入「${inviteInfo.value.teamName}」${inviteInfo.value.permission === 'edit' ? '（編輯權限）' : '（查看權限）'}，點擊加入！`
              : '加入 ROZ 副本組隊'
      )},
    { property: 'og:type',  content: 'website' },
    { property: 'og:image', content: `${SITE_URL}/images/roz-ogimage.png` },
    { property: 'og:url',   content: computed(() => `${SITE_URL}/roz/join?code=${code.value}`) },
    { name: 'theme-color',  content: '#f1d483' },
  ]
});

// ── 頁面狀態
const status    = ref(isValidInvite.value ? 'ready' : 'invalid');
const errorMsg  = ref(fetchedInfo.value?.error || '邀請連結無效');
const isLoggedIn = ref(false);
const userName  = ref('');
const joining   = ref(false);
const joinError = ref('');

// ── client 端確認登入狀態
onMounted(async () => {
  if (!isValidInvite.value) return;
  try {
    const me = await (await fetch(`${BASE_USER()}/me`, { credentials: 'include' })).json();
    if (me?.googleId && !me.error) {
      isLoggedIn.value = true;
      userName.value = me.name || me.email || '';
    }
  } catch { /* 未登入 */ }
});

const acceptInvite = async () => {
  joining.value = true;
  joinError.value = '';
  try {
    const data = await (await fetch(`${BASE_TEAM()}/accept-share`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.value })
    })).json();
    if (data.error) { joinError.value = data.error; return; }
    status.value = 'joined';
  } catch {
    joinError.value = '加入失敗，請稍後再試';
  } finally {
    joining.value = false;
  }
};

const goLogin = () => router.push('/roz/login?redirect=' + encodeURIComponent(route.fullPath));
const goTeam  = () => router.push('/roz/teamplace');
</script>