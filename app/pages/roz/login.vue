<template>
  <div class="min-h-screen bg-[#2c1e14] flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">⚔️</div>
        <h1 class="text-2xl font-black text-[#f1d483]">ROZ 管理後台</h1>
        <p class="text-[#a6937c] text-xs mt-1">私人管理區域，僅限授權帳號進入</p>
      </div>

      <!-- 讀取中（檢查是否已登入） -->
      <div v-if="checking" class="text-center text-[#a6937c] italic text-sm py-8">
        驗證中...
      </div>

      <!-- 卡片 -->
      <div v-else class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-6 shadow-2xl">

        <!-- 錯誤訊息 -->
        <p v-if="errorMsg" class="text-red-400 text-xs bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2 mb-4">
          {{ errorMsg }}
        </p>

        <!-- Google 登入按鈕（由 GIS renderButton 渲染） -->
        <div class="flex justify-center">
          <div id="roz-google-btn"></div>
        </div>

        <p class="text-center text-[#a6937c] text-xs mt-4">
          僅限授權的 Google 帳號可進入
        </p>
      </div>

      <!-- 返回公開頁 -->
      <div class="text-center mt-4">
        <NuxtLink to="/" class="text-[#a6937c] hover:text-[#e0d3b8] text-xs transition">
          ← 返回公開頁面
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'blank' });

const route       = useRoute();
const router      = useRouter();
const errorMsg    = ref('');
const checking    = ref(true);
const config      = useRuntimeConfig();
const commonStore = useCommonStore();

const BASE = () => commonStore.data.main_url + '/roz/user';
const GOOGLE_CLIENT_ID = config.public.googleClientId;

// 取得登入後要跳轉的目標，預設 /roz/accounts
const redirectTarget = computed(() => {
  const r = route.query.redirect;
  if (r && typeof r === 'string' && r.startsWith('/roz')) return r;
  return '/roz/accounts';
});

// ── 載入時先確認是否已登入，已登入直接跳轉 ────────────────────────
onMounted(async () => {
  try {
    const res  = await fetch(`${BASE()}/me`, { credentials: 'include' });
    const data = await res.json();
    if (!data.error) {
      commonStore.setRozUser(data);
      router.replace(redirectTarget.value);
      return;
    }
  } catch { /* 未登入，正常顯示登入頁 */ }

  checking.value = false;
  initGoogleScript();
});

// ── Google GIS ────────────────────────────────────────────────────
const handleCredential = async (response) => {
  errorMsg.value = '';
  try {
    const res  = await fetch(`${BASE()}/google-login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential }),
    });
    const data = await res.json();
    if (data.error) {
      errorMsg.value = data.error;
    } else {
      commonStore.setRozUser(data);
      router.push(redirectTarget.value);
    }
  } catch {
    errorMsg.value = '登入失敗，請再試一次';
  }
};

const initGoogle = () => {
  if (!window.google) return;
  window.google.accounts.id.initialize({
    client_id:   GOOGLE_CLIENT_ID,
    callback:    handleCredential,
    auto_select: false,
  });
  window.google.accounts.id.renderButton(
      document.getElementById('roz-google-btn'),
      { theme: 'outline', size: 'large', text: 'signin_with', locale: 'zh-TW', width: 240 }
  );
};

const initGoogleScript = () => {
  if (!document.getElementById('google-gsi-script')) {
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => initGoogle();
    document.head.appendChild(script);
  } else if (window.google) {
    initGoogle();
  }
};
</script>