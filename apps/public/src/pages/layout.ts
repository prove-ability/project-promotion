const ADMIN_URL = "https://admin.promotion.ccoshong.top";

const sharedStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #111827; line-height: 1.6; }
  a { color: inherit; text-decoration: none; }

  .nav { position: sticky; top: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid #f3f4f6; z-index: 50; }
  .nav-inner { max-width: 1080px; margin: 0 auto; padding: 0 1.5rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
  .nav-logo { font-size: 1.125rem; font-weight: 700; color: #111827; }
  .nav-logo span { color: #2563eb; }
  .nav-links { display: flex; align-items: center; gap: 2rem; }
  .nav-links a { font-size: 0.875rem; color: #6b7280; transition: color 0.15s; }
  .nav-links a:hover { color: #111827; }
  .nav-cta { display: inline-flex; align-items: center; padding: 0.5rem 1.25rem; background: #2563eb; color: #fff !important; border-radius: 8px; font-size: 0.875rem; font-weight: 500; transition: background 0.15s; }
  .nav-cta:hover { background: #1d4ed8; }

  .footer { border-top: 1px solid #f3f4f6; padding: 3rem 1.5rem; text-align: center; color: #9ca3af; font-size: 0.8125rem; }

  .container { max-width: 1080px; margin: 0 auto; padding: 0 1.5rem; }
`;

export function layout(title: string, description: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <style>${sharedStyles}</style>
</head>
<body>
  <nav class="nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo">Promo<span>Builder</span></a>
      <div class="nav-links">
        <a href="/pricing">요금제</a>
        <a href="/guide">가이드</a>
        <a href="${ADMIN_URL}/login" class="nav-cta">시작하기</a>
      </div>
    </div>
  </nav>
  ${body}
  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} PromoBuilder. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

export { ADMIN_URL };
