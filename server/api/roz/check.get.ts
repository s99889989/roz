// server/api/roz/check.get.ts
import { defineEventHandler, getCookie } from 'h3';

const COOKIE_NAME  = 'roz_auth';
const COOKIE_TOKEN = 'roz_ok';

export default defineEventHandler((event) => {
  const token = getCookie(event, COOKIE_NAME);
  return { ok: token === COOKIE_TOKEN };
});
