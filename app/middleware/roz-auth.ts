// middleware/roz-auth.ts
// 套用到所有 /roz/* 頁面（除了 /roz/login）
// 在每個 roz 頁面的 definePageMeta 加上：middleware: 'roz-auth'

export default defineNuxtRouteMiddleware(async (to) => {
  // login 頁本身不需要檢查
  if (to.path === '/roz/login') return;

  // Server side：從 cookie 讀取
  // Client side：呼叫 API 確認 session
  try {
    const res = await $fetch('/api/roz/check');
    if (!res.ok) {
      return navigateTo('/roz/login');
    }
  } catch {
    return navigateTo('/roz/login');
  }
});
