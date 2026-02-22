import type { Route } from "./+types/upload-image";
import { getAuth } from "~/lib/auth.server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export async function action({ request, context }: Route.ActionArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return Response.json({ error: "Invalid content type" }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return Response.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 },
    );
  }

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const key = `images/${session.user.id}/${id}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  await context.cloudflare.env.R2.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  const baseUrl = context.cloudflare.env.ADMIN_BASE_URL ?? "";
  const publicUrl = `${baseUrl}/api/images/${key.replace("images/", "")}`;

  return Response.json({ url: publicUrl, key });
}
