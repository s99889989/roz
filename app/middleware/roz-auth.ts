// middleware/roz-auth.ts
// 套用到所有 /roz/* 頁面（除了 /roz/login）
// 在每個 roz 頁面的 definePageMeta 加上：middleware: 'roz-auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/roz/login') return;

  // 取得 Spring Boot base URL
  const commonStore = useCommonStore();
  const base = (commonStore?.data?.main_url ?? '') + '/roz/user';

  try {
    const res = await $fetch(`${base}/me`, {
      credentials: 'include',
    });
    // me 回傳有 error 就視為未登入
    if ((res as any).error) {
      return navigateTo('/roz/login');
    }
  } catch {
    return navigateTo('/roz/login');
  }
});