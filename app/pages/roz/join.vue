<template>
  <div class="min-h-screen bg-[#2c1e14] flex items-center justify-center p-4 font-sans">

    <div v-if="status === 'loading'" class="text-[#a6937c] italic text-lg animate-pulse">
      驗證邀請碼中...
    </div>

    <div v-else-if="status === 'invalid'"
         class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
      <div class="text-5xl mb-4">⚠️</div>
      <h1 class="text-[#f0a8a8] font-black text-xl mb-2">邀請連結無效</h1>
      <p class="text-[#a6937c] text-sm">{{ errorMsg }}</p>
    </div>

    <div v-else-if="status === 'ready'"
         class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-8 max-w-sm w-full shadow-2xl">
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2c1e14] border-2 border-[#f1d483]/40 flex items-center justify-center text-3xl">
          {{ typeIcon }}
        </div>
        <p class="text-[#a6937c] text-xs mb-1 uppercase tracking-widest">{{ typeLabel }}</p>
        <h1 class="text-[#f1d483] font-black text-2xl mb-1">{{ inviteInfo.displayName }}</h1>
        <span class="inline-block text-xs px-2.5 py-1 rounded-full font-bold"
              :class="inviteInfo.permission === 'edit' || inviteInfo.permission === 'use'
                ? 'bg-[#2a4a3a] text-[#a8f0c8] border border-[#a8f0c8]/20'
                : 'bg-[#2a3a4a] text-[#a8c0f0] border border-[#a8c0f0]/20'">
          {{ permLabel }}
        </span>
      </div>
      <div class="border-t border-[#5e4b37] pt-4 mb-5">
        <div class="text-[#6b5a4a] text-xs text-center mb-4">邀請有效期至 {{ inviteInfo.expiresAt }}</div>
        <div v-if="!isLoggedIn" class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl p-4 text-center mb-4">
          <p class="text-[#a6937c] text-sm mb-3">請先登入才能加入</p>
          <button @click="goLogin" class="w-full py-2.5 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded-lg font-bold transition">前往登入</button>
        </div>
        <div v-else>
          <p class="text-[#a6937c] text-xs text-center mb-3">登入為 <span class="text-[#e0d3b8] font-bold">{{ userName }}</span></p>
          <button @click="acceptInvite" :disabled="joining"
                  class="w-full py-3 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded-xl font-black text-lg transition disabled:opacity-50 shadow-lg">
            {{ joining ? '加入中...' : joinBtnText }}
          </button>
          <p v-if="joinError" class="text-red-400 text-sm text-center mt-3">{{ joinError }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="status === 'joined'"
         class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
      <div class="text-5xl mb-4">🎉</div>
      <h1 class="text-[#a8f0c8] font-black text-xl mb-2">成功加入！</h1>
      <p class="text-[#a6937c] text-sm mb-5">已加入「<span class="text-[#f1d483] font-bold">{{ inviteInfo.displayName }}</span>」</p>
      <button @click="goTarget" class="w-full py-2.5 bg-[#5e4b37] hover:bg-[#7a6248] text-[#f1d483] rounded-xl font-bold transition">{{ goBtnText }} →</button>
    </div>

  </div>
</template>

<script setup>
definePageMeta({layout: 'blank'});

import {ref, computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useCommonStore} from '~/stores/common.js';

const route = useRoute();
const router = useRouter();
const commonStore = useCommonStore();
const BASE_TEAM = () => commonStore.data.main_url + '/roz/team';
const BASE_ACCOUNT = () => commonStore.data.main_url + '/roz/account';
const BASE_CLASSIC = () => commonStore.data.main_url + '/roz/classic';
const BASE_USER = () => commonStore.data.main_url + '/roz/user';

const code = computed(() => (route.query.code || '').toString().toUpperCase());
const type = computed(() => (route.query.type || 'team').toString()); // team | account | classic

// type 對應設定
const typeIcon = computed(() => ({team: '⚔️', account: '👤', classic: '🏰'}[type.value] || '⚔️'));
const typeLabel = computed(() => ({
  team: '副本組隊邀請',
  account: '帳號共享邀請',
  classic: '經典分隊邀請'
}[type.value] || '邀請'));
const permLabel = computed(() => {
  const p = inviteInfo.value.permission;
  if (p === 'edit') return '✏️ 編輯權限';
  if (p === 'use') return '🔧 使用權限';
  return '👁 查看權限';
});
const joinBtnText = computed(() => ({
  team: '加入隊伍',
  account: '加入共享',
  classic: '加入分隊'
}[type.value] || '加入'));
const goBtnText = computed(() => ({
  team: '前往副本組隊',
  account: '前往帳號管理',
  classic: '前往經典組隊'
}[type.value] || '前往'));
const targetRoute = computed(() => ({
  team: '/roz/teamplace',
  account: '/roz/accounts',
  classic: '/roz/teamclassic'
}[type.value] || '/roz/teamplace'));

const status = ref('loading');
const errorMsg = ref('');
const inviteInfo = ref({displayName: '', permission: 'view', expiresAt: ''});
const isLoggedIn = ref(false);
const userName = ref('');
const joining = ref(false);
const joinError = ref('');

// 根據 type 呼叫不同的 invite-info endpoint
const fetchInviteInfo = async (c) => {
  const urlMap = {
    team: `${BASE_TEAM()}/invite-info/${c}`,
    account: `${BASE_ACCOUNT()}/invite-info/${c}`,
    classic: `${BASE_CLASSIC()}/invite-info/${c}`,
  };
  const res = await fetch(urlMap[type.value] || urlMap.team);
  const info = await res.json();
  if (info.error) throw new Error(info.error);
  // 統一 displayName 欄位
  return {
    displayName: info.teamName || info.accName || info.classicName || '',
    permission: info.permission,
    expiresAt: info.expiresAt,
  };
};

// 根據 type 呼叫不同的 accept-share endpoint
const fetchAcceptShare = async (c) => {
  const urlMap = {
    team: `${BASE_TEAM()}/accept-share`,
    account: `${BASE_ACCOUNT()}/accept-share`,
    classic: `${BASE_CLASSIC()}/accept-share`,
  };
  const res = await fetch(urlMap[type.value] || urlMap.team, {
    method: 'POST', credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({code: c})
  });
  return res.json();
};

onMounted(async () => {
  if (!code.value) {
    status.value = 'invalid';
    errorMsg.value = '缺少邀請碼';
    return;
  }

  try {
    inviteInfo.value = await fetchInviteInfo(code.value);
    document.title = `加入${typeLabel.value.replace('邀請', '')}「${inviteInfo.value.displayName}」— ROZ`;
  } catch (e) {
    status.value = 'invalid';
    errorMsg.value = e.message || '邀請碼無效或已過期';
    return;
  }

  try {
    const me = await (await fetch(`${BASE_USER()}/me`, {credentials: 'include'})).json();
    if (me?.googleId && !me.error) {
      isLoggedIn.value = true;
      userName.value = me.name || me.email || '';
    }
  } catch {
  }

  status.value = 'ready';
});

const acceptInvite = async () => {
  joining.value = true;
  joinError.value = '';
  try {
    const data = await fetchAcceptShare(code.value);
    if (data.error) {
      joinError.value = data.error;
      return;
    }
    status.value = 'joined';
  } catch {
    joinError.value = '加入失敗，請稍後再試';
  } finally {
    joining.value = false;
  }
};

const goLogin = () => router.push('/roz/login?redirect=' + encodeURIComponent(route.fullPath));
const goTarget = () => router.push(targetRoute.value);
</script>