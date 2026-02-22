import { Hono } from "hono";
import { cors } from "hono/cors";
import { introHtml } from "./pages/intro";
import { pricingHtml } from "./pages/pricing";
import { guideHtml } from "./pages/guide";
import { introEnHtml } from "./pages/en/intro";
import { pricingEnHtml } from "./pages/en/pricing";
import { guideEnHtml } from "./pages/en/guide";
import { introJaHtml } from "./pages/ja/intro";
import { pricingJaHtml } from "./pages/ja/pricing";
import { guideJaHtml } from "./pages/ja/guide";
import { introZhHtml } from "./pages/zh/intro";
import { pricingZhHtml } from "./pages/zh/pricing";
import { guideZhHtml } from "./pages/zh/guide";
import { notFoundHtml } from "./pages/not-found";

type Bindings = {
  KV_PAGES: KVNamespace;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/*", cors());

const FAVICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#2563eb"/><text x="16" y="23" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="700" fill="white" text-anchor="middle">P</text></svg>';
const BASE = "https://promotion.ccoshong.top";

app.get("/favicon.svg", (c) => {
  return c.body(FAVICON_SVG, 200, {
    "Content-Type": "image/svg+xml",
    "Cache-Control": "public, max-age=86400",
  });
});

app.get("/favicon.ico", (c) => {
  return c.redirect("/favicon.svg", 301);
});

app.get("/robots.txt", (c) => {
  return c.text(
    `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml`,
    200,
    { "Content-Type": "text/plain" },
  );
});

app.get("/sitemap.xml", (c) => {
  const pages = [
    { path: "/", ko: "/", en: "/en", ja: "/ja", zh: "/zh" },
    { path: "/pricing", ko: "/pricing", en: "/en/pricing", ja: "/ja/pricing", zh: "/zh/pricing" },
    { path: "/guide", ko: "/guide", en: "/en/guide", ja: "/ja/guide", zh: "/zh/guide" },
  ];

  const langs = ["ko", "en", "ja", "zh"] as const;

  const entries = pages
    .flatMap((p) =>
      langs.map(
        (lang) => `  <url>
    <loc>${BASE}${p[lang]}</loc>
    ${langs.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${BASE}${p[l]}"/>`).join("\n    ")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${p.ko}"/>
  </url>`,
      ),
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>`;
  return c.body(xml, 200, { "Content-Type": "application/xml" });
});

// Korean pages (default)
app.get("/", (c) => c.html(introHtml));
app.get("/pricing", (c) => c.html(pricingHtml));
app.get("/guide", (c) => c.html(guideHtml));

// English pages
app.get("/en", (c) => c.html(introEnHtml));
app.get("/en/pricing", (c) => c.html(pricingEnHtml));
app.get("/en/guide", (c) => c.html(guideEnHtml));

// Japanese pages
app.get("/ja", (c) => c.html(introJaHtml));
app.get("/ja/pricing", (c) => c.html(pricingJaHtml));
app.get("/ja/guide", (c) => c.html(guideJaHtml));

// Chinese pages
app.get("/zh", (c) => c.html(introZhHtml));
app.get("/zh/pricing", (c) => c.html(pricingZhHtml));
app.get("/zh/guide", (c) => c.html(guideZhHtml));

app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (slug === "en") return c.html(introEnHtml);
  if (slug === "ja") return c.html(introJaHtml);
  if (slug === "zh") return c.html(introZhHtml);
  const html = await c.env.KV_PAGES.get(slug, "text");

  if (!html) {
    return c.html(notFoundHtml, 404);
  }

  return c.html(html);
});

app.post("/api/events", async (c) => {
  try {
    const body = await c.req.json<{
      pageId: string;
      visitorId: string;
      eventType: string;
      eventData?: Record<string, unknown>;
    }>();

    const id = crypto.randomUUID();
    const referrer = c.req.header("referer") ?? null;
    const userAgent = c.req.header("user-agent") ?? null;

    await c.env.DB.prepare(
      `INSERT INTO page_events (id, page_id, visitor_id, event_type, event_data, referrer, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        body.pageId,
        body.visitorId,
        body.eventType,
        body.eventData ? JSON.stringify(body.eventData) : null,
        referrer,
        userAgent,
        Math.floor(Date.now() / 1000)
      )
      .run();

    return c.json({ ok: true });
  } catch {
    return c.json({ ok: false, error: "Failed to record event" }, 500);
  }
});

export default app;
