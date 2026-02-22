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

  .lang-switch { font-size: 0.75rem; color: #9ca3af; border: 1px solid #e5e7eb; padding: 0.25rem 0.5rem; border-radius: 6px; transition: all 0.15s; }
  .lang-switch:hover { color: #6b7280; border-color: #d1d5db; }

  .footer { border-top: 1px solid #f3f4f6; padding: 3rem 1.5rem; text-align: center; color: #9ca3af; font-size: 0.8125rem; }

  .container { max-width: 1080px; margin: 0 auto; padding: 0 1.5rem; }
`;

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#2563eb"/><text x="16" y="23" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="700" fill="white" text-anchor="middle">P</text></svg>`;
const FAVICON_DATA_URI = `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}`;

const PUBLIC_URL = "https://promotion.ccoshong.top";
const OG_IMAGE = `${PUBLIC_URL}/og-image.png`;

type Lang = "ko" | "en";

interface LayoutOpts {
  path?: string;
  lang?: Lang;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const NAV: Record<Lang, { pricing: string; guide: string; cta: string }> = {
  ko: { pricing: "요금제", guide: "가이드", cta: "시작하기" },
  en: { pricing: "Pricing", guide: "Guide", cta: "Get Started" },
};

function hreflangTags(path: string, lang: Lang): string {
  const koPath = path.replace(/^\/en(\/|$)/, "/").replace(/\/$/, "") || "/";
  const enPath = `/en${koPath === "/" ? "" : koPath}`;
  const koUrl = `${PUBLIC_URL}${koPath}`;
  const enUrl = `${PUBLIC_URL}${enPath}`;

  return [
    `<link rel="alternate" hreflang="ko" href="${koUrl}">`,
    `<link rel="alternate" hreflang="en" href="${enUrl}">`,
    `<link rel="alternate" hreflang="x-default" href="${lang === "ko" ? koUrl : enUrl}">`,
  ].join("\n  ");
}

export function layout(title: string, description: string, body: string, opts?: LayoutOpts): string {
  const lang = opts?.lang ?? "ko";
  const path = opts?.path ?? "/";
  const prefix = lang === "en" ? "/en" : "";
  const canonicalUrl = `${PUBLIC_URL}${path}`;
  const nav = NAV[lang];
  const switchLang = lang === "ko" ? "en" : "ko";
  const switchPath = lang === "ko"
    ? `/en${path === "/" ? "" : path}`
    : path.replace(/^\/en(\/|$)/, "/").replace(/\/$/, "") || "/";
  const switchLabel = lang === "ko" ? "EN" : "한국어";

  const jsonLdTag = opts?.jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(opts.jsonLd)}</script>`
    : "";
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="icon" type="image/svg+xml" href="${FAVICON_DATA_URI}">
  <link rel="canonical" href="${canonicalUrl}">
  ${hreflangTags(path, lang)}

  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="PromoBuilder">
  <meta property="og:locale" content="${lang === "ko" ? "ko_KR" : "en_US"}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${OG_IMAGE}">

  ${jsonLdTag}
  <style>${sharedStyles}</style>
</head>
<body>
  <nav class="nav">
    <div class="nav-inner">
      <a href="${prefix}/" class="nav-logo">Promo<span>Builder</span></a>
      <div class="nav-links">
        <a href="${prefix}/pricing">${nav.pricing}</a>
        <a href="${prefix}/guide">${nav.guide}</a>
        <a href="${switchPath}" class="lang-switch">${switchLabel}</a>
        <a href="${ADMIN_URL}/login" class="nav-cta">${nav.cta}</a>
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

export { ADMIN_URL, PUBLIC_URL };
export type { Lang, LayoutOpts };
