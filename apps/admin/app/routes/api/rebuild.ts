import type { Route } from "./+types/rebuild";
import { getDb } from "~/lib/db.server";
import { getAuth } from "~/lib/auth.server";
import { pages } from "@project-promotion/db/schema";
import { eq } from "drizzle-orm";
import { generatePageHtml } from "~/lib/html-generator.server";
import type { PageData } from "@project-promotion/components";

export async function action({ request, context }: Route.ActionArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const db = getDb(context.cloudflare.env.DB);
  const publishedPages = await db
    .select()
    .from(pages)
    .where(eq(pages.status, "published"));

  const publicAppUrl =
    context.cloudflare.env.PUBLIC_APP_URL ?? "https://promo.example.com";

  let rebuilt = 0;
  for (const page of publishedPages) {
    const html = generatePageHtml(page.pageData as PageData, {
      title: page.title,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      seoOgImage: page.seoOgImage,
      pageId: page.id,
      slug: page.slug,
      publicAppUrl,
    });

    await context.cloudflare.env.KV_PAGES.put(page.slug, html, {
      metadata: { pageId: page.id, publishedAt: Date.now() },
    });

    rebuilt++;
  }

  return Response.json({ ok: true, rebuilt });
}
