<template>
  <div class="min-h-screen bg-[#2c1e14] flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">⚔️</div>
        <h1 class="text-2xl font-black text-[#f1d483]">ROZ 管理後台</h1>
        <p class="text-[#a6937c] text-xs mt-1">私人管理區域，請輸入密碼進入</p>
      </div>

      <!-- 卡片 -->
      <div class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl p-6 shadow-2xl">
        <div class="space-y-4">
          <div>
            <label class="block text-[#f1d483] text-sm font-bold mb-1.5">密碼</label>
            <input v-model="password"
                   type="password"
                   placeholder="請輸入管理密碼"
                   @keydown.enter="login"
                   autofocus
                   class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded-xl px-4 py-3 text-[#e0d3b8] outline-none focus:border-[#f1d483] transition text-sm" />
          </div>

          <!-- 錯誤訊息 -->
          <p v-if="errorMsg" class="text-red-400 text-xs bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
            {{ errorMsg }}
          </p>

          <button @click="login"
                  :disabled="loading || !password"
                  class="w-full py-3 bg-[#4a7c59] hover:bg-[#3d6849] text-white font-black rounded-xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? '驗證中...' : '進入管理區' }}
          </button>
        </div>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 這個頁面不套用 roz layout（用 blank 或 default）
definePageMeta({ layout: 'blank' });

const router   = useRouter();
const password = ref('');
const loading  = ref(false);
const errorMsg = ref('');

const login = async () => {
  if (!password.value || loading.value) return;
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await $fetch('/api/roz/login', {
      method: 'POST',
      body: { password: password.value }
    });
    if (res.success) {
      router.push('/roz/accounts');
    } else {
      errorMsg.value = '密碼錯誤，請再試一次';
    }
  } catch {
    errorMsg.value = '密碼錯誤，請再試一次';
  } finally {
    loading.value = false;
    password.value = '';
  }
};
</script>
