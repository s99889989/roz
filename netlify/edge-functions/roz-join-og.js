/**
 * Netlify Edge Function: roz-join-og.js
 * 路徑：netlify/edge-functions/roz-join-og.js
 *
 * 攔截 /roz/join?code=XXX 的請求，
 * 如果是 Discord/社群 bot 來爬 OG tags，就動態注入正確的 meta。
 * 一般使用者照常拿到原本的靜態 HTML。
 */

const SITE_URL  = 'https://aftroz.netlify.app';
const API_URL   = 'https://madustrialtd.asuscomm.com:8080';  // ← 改成你的 Spring Boot API 網址
const OG_IMAGE  = `${SITE_URL}/images/roz-ogimage.png`;

// 判斷是否為 bot（Discord、Slack、Telegram、LINE 等）
const BOT_UA = /discord|slack|telegram|twitterbot|facebookexternalhit|linkedinbot|whatsapp|line/i;

export default async (request, context) => {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) {
    // 一般使用者：直接放行，拿靜態 HTML
    return context.next();
  }

  const url  = new URL(request.url);
  const code = (url.searchParams.get('code') || '').toUpperCase();

  let teamName   = 'ROZ 副本組隊';
  let permission = 'view';
  let expiresAt  = '';
  let description = '點擊連結加入副本組隊！';

  if (code) {
    try {
      console.log('API_URL:', API_URL, '| code:', code);
      const res  = await fetch(`${API_URL}/roz/team/invite-info/${code}`);
      console.log('API status:', res.status);
      const info = await res.json();
      if (!info.error && info.teamName) {
        teamName   = info.teamName;
        permission = info.permission;
        expiresAt  = info.expiresAt;
        const permLabel = permission === 'edit' ? '（編輯權限）' : '（查看權限）';
        description = `你被邀請加入「${teamName}」${permLabel}，點擊加入！`;
      }
    } catch {}
  }

  const title = code ? `加入隊伍：${teamName}` : 'ROZ 副本組隊邀請';

  // 拿原始靜態 HTML
  const response = await context.next();
  const html     = await response.text();

  // 注入 OG + Twitter meta（插在 </head> 前）
  const metaTags = `
  <!-- Dynamic OG by Edge Function -->
  <meta property="og:type"         content="website" />
  <meta property="og:site_name"    content="ROZ 樂園" />
  <meta property="og:title"        content="${escHtml(title)}" />
  <meta property="og:description"  content="${escHtml(description)}" />
  <meta property="og:url"          content="${escHtml(request.url)}" />
  <meta name="twitter:card"        content="summary" />
  <meta name="twitter:title"       content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(description)}" />
  <meta name="twitter:image"       content="${OG_IMAGE}" />`;

  const patched = html.replace('</head>', metaTags + '\n</head>');

  return new Response(patched, {
    status:  response.status,
    headers: { ...Object.fromEntries(response.headers), 'content-type': 'text/html;charset=UTF-8' },
  });
};

const escHtml = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

export const config = {
  path: '/roz/join',   // 只攔截這個路徑
};