import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  KV_PAGES: KVNamespace;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/*", cors());

const notFoundHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>페이지를 찾을 수 없습니다</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; color: #111827; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .container { text-align: center; padding: 2rem; }
    .code { font-size: 6rem; font-weight: 800; color: #e5e7eb; line-height: 1; }
    .message { font-size: 1.25rem; color: #6b7280; margin-top: 0.5rem; }
    .link { display: inline-block; margin-top: 1.5rem; color: #2563eb; text-decoration: none; font-size: 0.875rem; }
    .link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="code">404</div>
    <p class="message">요청하신 페이지를 찾을 수 없습니다</p>
  </div>
</body>
</html>`;

app.get("/", (c) => c.html(notFoundHtml, 404));

app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
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
