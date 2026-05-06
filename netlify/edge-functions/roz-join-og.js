/**
 * Netlify Edge Function: roz-join-og.js
 * 路徑：netlify/edge-functions/roz-join-og.js
 */

const SITE_URL = 'https://aftroz.netlify.app';
const API_URL  = 'https://madustrialtd.asuscomm.com:8080';

const BOT_UA = /discord|slack|telegram|twitterbot|facebookexternalhit|linkedinbot|whatsapp|line/i;

const TYPE_CONFIG = {
  team:    { label: '副本組隊邀請', nameKey: 'teamName',    apiPath: '/roz/team/invite-info/'    },
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
  let name        = '';
  let perm        = 'view';

  if (code) {
    try {
      const res  = await fetch(`${API_URL}${cfg.apiPath}${code}`);
      const info = await res.json();
      if (!info.error) {
        name  = info[cfg.nameKey] || '';
        perm  = info.permission   || 'view';
        const permLabel = perm === 'edit' ? '（編輯權限）'
            : perm === 'use'  ? '（使用權限）'
                : '（查看權限）';
        title       = `加入${cfg.label.replace('邀請', '')}：${name}`;
        description = `你被邀請加入「${name}」${permLabel}，點擊加入！`;
      }
    } catch {}
  }

  // 動態 OG 圖片 URL（指向後端 Spring Boot）
  const ogImage = name
      ? `${API_URL}/roz/og-image?type=${encodeURIComponent(type)}&name=${encodeURIComponent(name)}&perm=${encodeURIComponent(perm)}`
      : `${SITE_URL}/images/roz-ogimage.png`;  // fallback 靜態圖

  const response = await context.next();
  let html = await response.text();

  // 移除靜態 HTML 裡的舊 meta
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
  <meta property="og:image"        content="${escHtml(ogImage)}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(description)}" />
  <meta name="twitter:image"       content="${escHtml(ogImage)}" />`;

  const patched = html.replace('</head>', metaTags + '\n</head>');
  return new Response(patched, {
    status:  response.status,
    headers: { ...Object.fromEntries(response.headers), 'content-type': 'text/html;charset=UTF-8' },
  });
};

const escHtml = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const config = { path: '/roz/join' };