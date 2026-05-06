export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/roz')) return;
  if (!to.matched.length) return navigateTo('/');

  const whitelist = ['/roz/login', '/roz/join'];
  if (whitelist.some(p => to.path.startsWith(p))) return;

  // ← 只在 client 端執行，避免 SSR cookie 帶不過去的問題
  if (import.meta.server) return;

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