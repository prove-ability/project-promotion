import { renderToString } from "react-dom/server";
import {
  PageRenderer,
  setupComponents,
  type PageData,
} from "@project-promotion/components";

setupComponents();

const FAVICON_DATA_URI = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#2563eb"/><text x="16" y="23" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="700" fill="white" text-anchor="middle">P</text></svg>'
);

interface PageMeta {
  title: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoOgImage?: string | null;
  pageId: string;
  slug: string;
  publicAppUrl: string;
}

export function generatePageHtml(
  pageData: PageData,
  meta: PageMeta
): string {
  const bodyHtml = renderToString(<PageRenderer pageData={pageData} />);

  const title = meta.seoTitle || meta.title;
  const description = meta.seoDescription || "";
  const ogImage = meta.seoOgImage || "";
  const canonicalUrl = `${meta.publicAppUrl}/${meta.slug}`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  ${description ? `<meta name="description" content="${escapeAttr(description)}">` : ""}
  <link rel="icon" type="image/svg+xml" href="${FAVICON_DATA_URI}">
  <link rel="canonical" href="${escapeAttr(canonicalUrl)}">

  <!-- Open Graph -->
  <meta property="og:title" content="${escapeAttr(title)}">
  ${description ? `<meta property="og:description" content="${escapeAttr(description)}">` : ""}
  ${ogImage ? `<meta property="og:image" content="${escapeAttr(ogImage)}">` : ""}
  <meta property="og:url" content="${escapeAttr(canonicalUrl)}">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  ${description ? `<meta name="twitter:description" content="${escapeAttr(description)}">` : ""}
  ${ogImage ? `<meta name="twitter:image" content="${escapeAttr(ogImage)}">` : ""}

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
    img { max-width: 100%; height: auto; }
    .carousel-track::-webkit-scrollbar { display: none; }
  </style>
</head>
<body>
  ${bodyHtml}

  <script>
  // Carousel autoplay
  document.querySelectorAll('[data-carousel]').forEach(function(el) {
    if (el.dataset.autoplay !== 'true') return;
    var track = el.querySelector('.carousel-track');
    if (!track) return;
    var interval = parseInt(el.dataset.interval) || 3000;
    var index = 0;
    var count = track.children.length;
    setInterval(function() {
      index = (index + 1) % count;
      track.scrollTo({ left: track.offsetWidth * index, behavior: 'smooth' });
    }, interval);
  });
  </script>

  <script>
  // Tracker
  (function() {
    var API_URL = "${escapeAttr(meta.publicAppUrl)}";
    var PAGE_ID = "${escapeAttr(meta.pageId)}";
    var key = "_promo_vid";
    var vid = localStorage.getItem(key);
    if (!vid) { vid = Math.random().toString(36).substring(2) + Date.now().toString(36); localStorage.setItem(key, vid); }

    function send(type, data) {
      var payload = JSON.stringify({ pageId: PAGE_ID, visitorId: vid, eventType: type, eventData: data || {} });
      if (navigator.sendBeacon) { navigator.sendBeacon(API_URL + "/api/events", new Blob([payload], { type: "application/json" })); }
      else { var x = new XMLHttpRequest(); x.open("POST", API_URL + "/api/events"); x.setRequestHeader("Content-Type", "application/json"); x.send(payload); }
    }

    send("pageview");

    document.addEventListener("click", function(e) {
      var t = e.target.closest("a, button");
      if (!t) return;
      send("click", { tag: t.tagName.toLowerCase(), text: (t.textContent || "").trim().substring(0, 100), href: t.href || null });
    });

    var maxScroll = 0, ticking = false;
    window.addEventListener("scroll", function() {
      if (!ticking) { requestAnimationFrame(function() { var p = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100); if (p > maxScroll) maxScroll = p; ticking = false; }); ticking = true; }
    });
    window.addEventListener("pagehide", function() { if (maxScroll > 0) send("scroll", { maxDepth: maxScroll }); });
  })();
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
