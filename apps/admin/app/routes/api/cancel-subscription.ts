import { redirect } from "react-router";
import type { Route } from "./+types/cancel-subscription";
import { getAuth } from "~/lib/auth.server";
import { getDb } from "~/lib/db.server";
import { getUserPlan } from "~/lib/subscription.server";
import { initLemonSqueezy, cancelLsSubscription } from "~/lib/lemonsqueezy.server";

export async function action({ request, context }: Route.ActionArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Response("Unauthorized", { status: 401 });

  const db = getDb(context.cloudflare.env.DB);
  const userPlan = await getUserPlan(db, session.user.id);

  if (!userPlan.subscription?.stripeSubscriptionId) {
    return redirect("/dashboard/billing");
  }

  try {
    initLemonSqueezy(context.cloudflare.env.LEMONSQUEEZY_API_KEY);
    await cancelLsSubscription(userPlan.subscription.stripeSubscriptionId);
  } catch (err) {
    console.error("LemonSqueezy cancel error:", err);
    return redirect("/dashboard/billing?error=cancel_failed");
  }

  return redirect("/dashboard/billing?canceled_sub=true");
}
