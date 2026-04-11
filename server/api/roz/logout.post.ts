// server/api/roz/logout.post.ts
import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler((event) => {
  deleteCookie(event, 'roz_auth', { path: '/' });
  return { success: true };
});
