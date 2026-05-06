<script setup>
definePageMeta({ layout: 'blank' });

const router      = useRouter();
const route       = useRoute();
const errorMsg    = ref('');
const checking    = ref(true);
const config      = useRuntimeConfig();
const commonStore = useCommonStore();

// ── Debug log ────────────────────────────────────────────────────
const debugLogs = ref([]);
const log = (msg, type = 'info') => {
  const time = new Date().toLocaleTimeString('zh-TW', { hour12: false });
  debugLogs.value.push({ time, msg, type });
  console.log(`[ROZ DEBUG ${time}] ${msg}`);
};

const BASE = () => commonStore.data.main_url + '/roz/user';
const GOOGLE_CLIENT_ID = config.public.googleClientId;

onMounted(async () => {
  log('onMounted 開始');
  log('BASE URL: ' + BASE());
  log('GOOGLE_CLIENT_ID: ' + (GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.slice(0, 20) + '...' : '❌ 未設定'));

  try {
    log('發送 /me 請求...');
    const res  = await fetch(`${BASE()}/me`, { credentials: 'include' });
    log('/me 狀態碼: ' + res.status);
    const data = await res.json();
    log('/me 回應: ' + JSON.stringify(data));
    if (!data.error) {
      log('已登入，跳轉 /roz/accounts', 'success');
      router.replace('/roz/accounts');
      return;
    } else {
      log('未登入: ' + data.error, 'warn');
    }
  } catch (e) {
    log('/me 請求失敗: ' + e.message, 'error');
  }

  checking.value = false;
  log('開始載入 Google GIS script');
  initGoogleScript();
});

const handleCredential = async (response) => {
  errorMsg.value = '';
  log('收到 Google credential，長度: ' + response.credential.length);
  try {
    log('發送 /google-login 請求...');
    const res  = await fetch(`${BASE()}/google-login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential }),
    });
    log('/google-login 狀態碼: ' + res.status);
    const data = await res.json();
    log('/google-login 回應: ' + JSON.stringify(data));
    if (data.error) {
      errorMsg.value = data.error;
      log('登入失敗: ' + data.error, 'error');
    } else {
      log('登入成功，跳轉 /roz/accounts', 'success');
      const redirect = route.query.redirect;
      router.push(redirect ? decodeURIComponent(redirect) : '/roz/accounts');
    }
  } catch (e) {
    errorMsg.value = '登入失敗，請再試一次';
    log('登入請求 exception: ' + e.message, 'error');
  }
};

const initGoogle = () => {
  log('initGoogle 執行，window.google 存在: ' + !!window.google);
  if (!window.google) {
    log('window.google 不存在，無法初始化', 'error');
    return;
  }
  window.google.accounts.id.initialize({
    client_id:   GOOGLE_CLIENT_ID,
    callback:    handleCredential,
    auto_select: false,
  });
  const btnEl = document.getElementById('roz-google-btn');
  log('roz-google-btn 元素: ' + (btnEl ? '找到' : '❌ 找不到'));
  window.google.accounts.id.renderButton(
      btnEl,
      { theme: 'outline', size: 'large', text: 'signin_with', locale: 'zh-TW', width: 240 }
  );
  log('Google 按鈕渲染完成', 'success');
};

const initGoogleScript = () => {
  const existing = document.getElementById('google-gsi-script');
  log('google-gsi-script 已存在: ' + !!existing);
  if (!existing) {
    const script  = document.createElement('script');
    script.id     = 'google-gsi-script';
    script.src    = 'https://accounts.google.com/gsi/client';
    script.async  = true;
    script.defer  = true;
    script.onload = () => {
      log('Google GIS script 載入完成');
      initGoogle();
    };
    script.onerror = () => log('Google GIS script 載入失敗', 'error');
    document.head.appendChild(script);
  } else if (window.google) {
    log('script 已存在且 window.google 有值，直接 initGoogle');
    initGoogle();
  } else {
    log('script 已存在但 window.google 還沒準備好', 'warn');
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#2c1e14] flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-sm">

      <div class="text-center mb-8">
        <div class="text-5xl mb-3">⚔️</div>
        <h1 class="text-2xl font-black text-[#f1d483]">ROZ 管理後台</h1>
        <p class="text-[#a6937c] text-xs mt-1">私人管理區域，僅限授權帳號進入</p>
      </div>

      <div v-if="checking" class="text-center text-[#a6937c] italic text-sm py-8">
        驗證中...
      </div>

      <div v-else class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-6 shadow-2xl">
        <p v-if="errorMsg" class="text-red-400 text-xs bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2 mb-4">
          {{ errorMsg }}
        </p>
        <div class="flex justify-center">
          <div id="roz-google-btn"></div>
        </div>
        <p class="text-center text-[#a6937c] text-xs mt-4">
          僅限授權的 Google 帳號可進入
        </p>
      </div>

      <div class="text-center mt-4">
        <NuxtLink to="/" class="text-[#a6937c] hover:text-[#e0d3b8] text-xs transition">
          ← 返回公開頁面
        </NuxtLink>
      </div>

      <!-- Debug Panel -->
      <div class="mt-6 bg-black/60 border border-[#5e4b37] rounded-xl p-3 text-xs font-mono">
        <p class="text-[#f1d483] mb-2 font-bold">🛠 Debug Log</p>
        <div class="max-h-60 overflow-y-auto space-y-1">
          <div v-for="(entry, i) in debugLogs" :key="i"
               :class="{
                 'text-green-400':  entry.type === 'success',
                 'text-red-400':    entry.type === 'error',
                 'text-yellow-400': entry.type === 'warn',
                 'text-gray-300':   entry.type === 'info',
               }">
            <span class="text-gray-500">{{ entry.time }}</span> {{ entry.msg }}
          </div>
          <div v-if="debugLogs.length === 0" class="text-gray-500 italic">等待中...</div>
        </div>
      </div>

    </div>
  </div>
</template>