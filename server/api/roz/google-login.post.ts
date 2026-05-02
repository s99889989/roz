// server/api/roz/google-login.post.ts
// 接收前端 GIS 的 credential（ID Token），驗證後比對白名單，設 session cookie

import { setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body   = await readBody(event);
  const credential = body?.credential;

  if (!credential) {
    return { ok: false, message: 'credential 不能為空' };
  }

  // ── Step 1：向 Google tokeninfo 驗證 ID Token ─────────────────────
  // 與農莊後端相同的驗證方式，免 Client Secret
  let email: string;
  try {
    const tokenInfo = await $fetch<any>(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );
    email = tokenInfo.email?.toLowerCase() ?? '';
    if (!email) throw new Error('no email');
  } catch {
    return { ok: false, message: 'Google token 驗證失敗' };
  }

  // ── Step 2：白名單驗證 ────────────────────────────────────────────
  // .env: NUXT_ROZ_ALLOWED_EMAILS=alice@gmail.com,bob@gmail.com
  const allowed: string[] = config.rozAllowedEmails
    ? config.rozAllowedEmails.split(',').map((e: string) => e.trim().toLowerCase())
    : [];

  if (!allowed.includes(email)) {
    return { ok: false, message: '此 Google 帳號沒有進入權限' };
  }

  // ── Step 3：設定 session cookie（與 roz-auth.ts check 相同格式）──
  setCookie(event, 'roz_session', config.rozSessionSecret, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7,  // 7 天
    path:     '/',
  });

  return { ok: true };
});
