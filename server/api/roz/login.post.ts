// server/api/roz/login.post.ts
import { defineEventHandler, readBody, setCookie } from 'h3';

// ⚠️ 密碼請改成你自己的，或改從環境變數讀取：
//    const PASSWORD = process.env.ROZ_PASSWORD ?? 'changeme';
const PASSWORD = 'roz2026';

// Cookie 有效期：7天
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const COOKIE_NAME    = 'roz_auth';
// Cookie 值用一個固定 token（或可改成 hash）
const COOKIE_TOKEN   = 'roz_ok';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (body?.password === PASSWORD) {
    setCookie(event, COOKIE_NAME, COOKIE_TOKEN, {
      maxAge:   COOKIE_MAX_AGE,
      httpOnly: true,
      path:     '/',
      sameSite: 'lax',
    });
    return { success: true };
  }

  return { success: false };
});
