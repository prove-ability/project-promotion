import type { Route } from "./+types/images";

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/images/", "");

  if (!path) {
    return new Response("Not found", { status: 404 });
  }

  const key = `images/${path}`;
  const object = await context.cloudflare.env.R2.get(key);

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    object.httpMetadata?.contentType ?? "application/octet-stream",
  );
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body, { status: 200, headers });
}
