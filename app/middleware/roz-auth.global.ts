// middleware/roz-auth.global.ts
// 全域自動套用，不需要在每個頁面加 middleware: 'roz-auth'
// /roz/* 底下未登入自動跳 /roz/login（login 和 join 頁除外）

export default defineNuxtRouteMiddleware(async (to) => {
  // 不在 /roz 底下 → 放行
  if (!to.path.startsWith('/roz')) return;

  // 頁面不存在（404）→ 放行，讓 Nuxt 處理
  if (!to.matched.length) return navigateTo('/');

  // 白名單：不需要登入的頁面
  const whitelist = ['/roz/login', '/roz/join'];
  if (whitelist.some(p => to.path.startsWith(p))) return;

  const commonStore = useCommonStore();
  const base = (commonStore?.data?.main_url ?? '') + '/roz/user';

  try {
    const res = await $fetch(`${base}/me`, { credentials: 'include' });
    if ((res as any).error) {
      return navigateTo('/roz/login?redirect=' + encodeURIComponent(to.fullPath));
    }
  } catch {
    return navigateTo('/roz/login?redirect=' + encodeURIComponent(to.fullPath));
  }
});