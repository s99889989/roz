/**
 * Netlify Edge Function: roz-join-og.js
 * 路徑：netlify/edge-functions/roz-join-og.js
 * 攔截 /roz/join 的 bot 請求，根據 type 動態注入正確 OG meta
 */

const SITE_URL = 'https://aftroz.netlify.app';
const API_URL  = 'https://madustrialtd.asuscomm.com:8080';
const OG_IMAGE = `${SITE_URL}/images/roz-ogimage.png`;

const BOT_UA = /discord|slack|telegram|twitterbot|facebookexternalhit|linkedinbot|whatsapp|line/i;

const TYPE_CONFIG = {
  team:    { label: '副本組隊邀請', nameKey: 'teamName',    apiPath: '/roz/team/invite-info/' },
  account: { label: '帳號共享邀請', nameKey: 'accName',     apiPath: '/roz/account/invite-info/' },
  classic: { label: '經典分隊邀請', nameKey: 'classicName', apiPath: '/roz/classic/invite-info/' },
};

export default async (request, context) => {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) return context.next();

  const url  = new URL(request.url);
  const code = (url.searchParams.get('code') || '').toUpperCase();
  const type = url.searchParams.get('type') || 'team';
  const cfg  = TYPE_CONFIG[type] || TYPE_CONFIG.team;

  let title       = `ROZ ${cfg.label}`;
  let description = '點擊連結加入！';

  if (code) {
    try {
      const res  = await fetch(`${API_URL}${cfg.apiPath}${code}`);
      const info = await res.json();
      if (!info.error) {
        const name      = info[cfg.nameKey] || '';
        const permLabel = info.permission === 'edit' ? '（編輯權限）'
            : info.permission === 'use'  ? '（使用權限）'
                : '（查看權限）';
        title       = `加入${cfg.label.replace('邀請', '')}：${name}`;
        description = `你被邀請加入「${name}」${permLabel}，點擊加入！`;
      }
    } catch {}
  }

  const response = await context.next();
  let html = await response.text();

  // 移除靜態 HTML 裡 app.vue useHead 注入的 og/twitter meta
  html = html
      .replace(/<meta\s[^>]*property="og:title"[^>]*>/gi, '')
      .replace(/<meta\s[^>]*property="og:description"[^>]*>/gi, '')
      .replace(/<meta\s[^>]*property="og:image"[^>]*>/gi, '')
      .replace(/<meta\s[^>]*property="og:url"[^>]*>/gi, '')
      .replace(/<meta\s[^>]*property="og:type"[^>]*>/gi, '')
      .replace(/<meta\s[^>]*property="og:site_name"[^>]*>/gi, '')
      .replace(/<meta\s[^>]*name="twitter:card"[^>]*>/gi, '')
      .replace(/<meta\s[^>]*name="twitter:title"[^>]*>/gi, '')
      .replace(/<meta\s[^>]*name="twitter:description"[^>]*>/gi, '')
      .replace(/<meta\s[^>]*name="twitter:image"[^>]*>/gi, '');

  const metaTags = `
  <!-- Dynamic OG by Edge Function -->
  <meta property="og:type"         content="website" />
  <meta property="og:site_name"    content="ROZ 樂園" />
  <meta property="og:title"        content="${escHtml(title)}" />
  <meta property="og:description"  content="${escHtml(description)}" />
  <meta property="og:url"          content="${escHtml(request.url)}" />
  <meta property="og:image"        content="${OG_IMAGE}" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(description)}" />
  <meta name="twitter:image"       content="${OG_IMAGE}" />`;

  const patched = html.replace('</head>', metaTags + '\n</head>');
  return new Response(patched, {
    status:  response.status,
    headers: { ...Object.fromEntries(response.headers), 'content-type': 'text/html;charset=UTF-8' },
  });
};

const escHtml = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const config = { path: '/roz/join' };