import { Hono } from "hono";
import { cors } from "hono/cors";
import { introHtml } from "./pages/intro";
import { pricingHtml } from "./pages/pricing";
import { guideHtml } from "./pages/guide";
import { notFoundHtml } from "./pages/not-found";

type Bindings = {
  KV_PAGES: KVNamespace;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/*", cors());

app.get("/", (c) => c.html(introHtml));
app.get("/pricing", (c) => c.html(pricingHtml));
app.get("/guide", (c) => c.html(guideHtml));

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
