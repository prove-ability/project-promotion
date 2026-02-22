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
    [data-animate] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
    [data-animate].visible { opacity: 1; transform: translateY(0); }
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
  // Floating CTA
  document.querySelectorAll('[data-floating-cta]').forEach(function(el) {
    var pos = el.dataset.position || 'bottom-center';
    el.style.position = 'fixed';
    el.style.bottom = '0';
    el.style.zIndex = '50';
    el.style.padding = '16px';
    if (pos === 'bottom-center') {
      el.style.left = '0';
      el.style.right = '0';
      el.style.textAlign = 'center';
    } else {
      el.style.right = '0';
      el.style.textAlign = 'right';
    }
  });
  </script>

  <script>
  // Countdown timer
  document.querySelectorAll('[data-countdown]').forEach(function(el) {
    var target = new Date(el.dataset.countdown).getTime();
    var expiredText = el.dataset.expiredText || '';
    var showDays = el.dataset.showDays !== 'false';
    var style = el.dataset.style || 'card';
    function pad(n) { return String(n).padStart(2, '0'); }
    function update() {
      var diff = target - Date.now();
      if (diff <= 0) {
        el.textContent = '';
        var p = document.createElement('p');
        p.style.cssText = 'font-size:16px;font-weight:500';
        p.textContent = expiredText;
        el.appendChild(p);
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var units = [];
      if (showDays) units.push({ v: d, l: '일' });
      units.push({ v: h, l: '시' }, { v: m, l: '분' }, { v: s, l: '초' });
      if (style === 'minimal') {
        var textEl = el.querySelector('p') || el;
        textEl.textContent = units.map(function(u) { return pad(u.v) + u.l; }).join(' ');
      } else {
        var spans = el.querySelectorAll('[data-unit]');
        units.forEach(function(u, i) { if (spans[i]) spans[i].textContent = pad(u.v); });
      }
      requestAnimationFrame(function() { setTimeout(update, 1000 - (Date.now() % 1000)); });
    }
    if (style !== 'minimal') {
      var container = el.querySelector('div > div') || el.querySelector('div');
      if (container && !container.querySelector('[data-unit]')) {
        var children = container.children;
        for (var i = 0; i < children.length; i++) {
          var numEl = children[i].querySelector('span') || children[i].querySelector('div');
          if (numEl) numEl.setAttribute('data-unit', i);
        }
      }
    }
    update();
  });
  </script>

  <script>
  // Scroll animation
  (function() {
    var els = document.body.children[0] ? document.body.children[0].children : [];
    for (var i = 0; i < els.length; i++) {
      if (!els[i].hasAttribute('data-floating-cta')) els[i].setAttribute('data-animate', '');
    }
    if (!('IntersectionObserver' in window)) {
      for (var j = 0; j < els.length; j++) els[j].classList.add('visible');
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-animate]').forEach(function(el) { observer.observe(el); });
  })();
  </script>

  <script>
  // Form submission
  document.querySelectorAll('[data-promo-form]').forEach(function(wrapper) {
    var form = wrapper.querySelector('form');
    if (!form) return;
    var successMsg = wrapper.dataset.successMessage || 'Submitted!';
    var btn = form.querySelector('button[type="submit"]');
    var originalText = btn ? btn.textContent : '';
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (btn) { btn.disabled = true; btn.textContent = '...'; }
      var data = {};
      var fd = new FormData(form);
      fd.forEach(function(v, k) { data[k] = v; });
      fetch('${escapeAttr(meta.publicAppUrl)}/api/form/${escapeAttr(meta.pageId)}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function(r) { return r.json(); }).then(function(res) {
        if (res.ok) {
          wrapper.textContent = '';
          var d = document.createElement('div');
          d.style.cssText = 'padding:32px 16px;text-align:center';
          var p = document.createElement('p');
          p.style.cssText = 'font-size:18px;font-weight:600;color:#16a34a';
          p.textContent = successMsg;
          d.appendChild(p);
          wrapper.appendChild(d);
        } else {
          if (btn) { btn.disabled = false; btn.textContent = originalText; }
        }
      }).catch(function() {
        if (btn) { btn.disabled = false; btn.textContent = originalText; }
      });
    });
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
