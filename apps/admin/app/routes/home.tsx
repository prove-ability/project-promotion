import { redirect } from "react-router";
import type { Route } from "./+types/home";
import { getAuth } from "~/lib/auth.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });

  if (session) {
    throw redirect("/dashboard");
  }

  throw redirect("/login");
}
