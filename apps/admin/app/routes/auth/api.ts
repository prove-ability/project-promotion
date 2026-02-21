import type { Route } from "./+types/api";
import { getAuth } from "~/lib/auth.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  return auth.handler(request);
}

export async function action({ request, context }: Route.ActionArgs) {
  const auth = getAuth(context.cloudflare.env);
  return auth.handler(request);
}
