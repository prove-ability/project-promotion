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

  .lang-select { appearance: none; -webkit-appearance: none; font-size: 0.75rem; color: #6b7280; background: #f9fafb url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.5rem center; border: 1px solid #e5e7eb; border-radius: 6px; padding: 0.375rem 1.75rem 0.375rem 0.625rem; cursor: pointer; transition: all 0.15s; outline: none; }
  .lang-select:hover { border-color: #d1d5db; color: #374151; }
  .lang-select:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }

  .footer { border-top: 1px solid #f3f4f6; padding: 3rem 1.5rem; text-align: center; color: #9ca3af; font-size: 0.8125rem; }

  .container { max-width: 1080px; margin: 0 auto; padding: 0 1.5rem; }
`;

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#2563eb"/><text x="16" y="23" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="700" fill="white" text-anchor="middle">P</text></svg>`;
const FAVICON_DATA_URI = `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}`;

const PUBLIC_URL = "https://promotion.ccoshong.top";
const OG_IMAGE = `${PUBLIC_URL}/og-image.png`;

type Lang = "ko" | "en" | "ja" | "zh";

interface LayoutOpts {
  path?: string;
  lang?: Lang;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const ALL_LANGS: Lang[] = ["ko", "en", "ja", "zh"];

const LANG_PREFIXES: Record<Lang, string> = {
  ko: "",
  en: "/en",
  ja: "/ja",
  zh: "/zh",
};

const LANG_LABELS: Record<Lang, string> = {
  ko: "한국어",
  en: "EN",
  ja: "日本語",
  zh: "中文",
};

const OG_LOCALES: Record<Lang, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

const NAV: Record<Lang, { pricing: string; guide: string; cta: string }> = {
  ko: { pricing: "요금제", guide: "가이드", cta: "시작하기" },
  en: { pricing: "Pricing", guide: "Guide", cta: "Get Started" },
  ja: { pricing: "料金", guide: "ガイド", cta: "始める" },
  zh: { pricing: "定价", guide: "指南", cta: "开始使用" },
};

function getBasePath(path: string): string {
  return path.replace(/^\/(en|ja|zh)(\/|$)/, "/").replace(/\/$/, "") || "/";
}

function hreflangTags(path: string): string {
  const basePath = getBasePath(path);
  const tags = ALL_LANGS.map((l) => {
    const prefix = LANG_PREFIXES[l];
    const href = `${PUBLIC_URL}${prefix}${basePath === "/" ? "" : basePath}`;
    return `<link rel="alternate" hreflang="${l}" href="${href}">`;
  });
  const koUrl = `${PUBLIC_URL}${basePath}`;
  tags.push(`<link rel="alternate" hreflang="x-default" href="${koUrl}">`);
  return tags.join("\n  ");
}

function langSelectHtml(path: string, currentLang: Lang): string {
  const basePath = getBasePath(path);
  const options = ALL_LANGS.map((l) => {
    const prefix = LANG_PREFIXES[l];
    const href = `${prefix}${basePath === "/" ? "" : basePath}` || "/";
    const selected = l === currentLang ? " selected" : "";
    return `<option value="${href}"${selected}>${LANG_LABELS[l]}</option>`;
  }).join("");
  return `<select class="lang-select" onchange="location.href=this.value">${options}</select>`;
}

export function layout(title: string, description: string, body: string, opts?: LayoutOpts): string {
  const lang = opts?.lang ?? "ko";
  const path = opts?.path ?? "/";
  const prefix = LANG_PREFIXES[lang];
  const canonicalUrl = `${PUBLIC_URL}${path}`;
  const nav = NAV[lang];

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
  ${hreflangTags(path)}

  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="PromoBuilder">
  <meta property="og:locale" content="${OG_LOCALES[lang]}">

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
        ${langSelectHtml(path, lang)}
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

export { ADMIN_URL, PUBLIC_URL, ALL_LANGS, LANG_PREFIXES };
export type { Lang, LayoutOpts };
