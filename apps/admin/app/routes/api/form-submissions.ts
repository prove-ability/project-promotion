import type { Route } from "./+types/form-submissions";
import { getDb } from "~/lib/db.server";
import { getAuth } from "~/lib/auth.server";
import { formSubmissions, pages } from "@project-promotion/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");
  if (!pageId) {
    return Response.json({ error: "Missing pageId" }, { status: 400 });
  }

  const db = getDb(context.cloudflare.env.DB);

  const page = await db
    .select({ id: pages.id })
    .from(pages)
    .where(and(eq(pages.id, pageId), eq(pages.userId, session.user.id)))
    .get();

  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 });
  }

  const submissions = await db
    .select()
    .from(formSubmissions)
    .where(eq(formSubmissions.pageId, pageId))
    .orderBy(desc(formSubmissions.createdAt))
    .limit(200)
    .all();

  return Response.json({ submissions });
}
