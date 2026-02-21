import { redirect } from "react-router";
import type { Route } from "./+types/cancel-subscription";
import { getAuth } from "~/lib/auth.server";
import { getStripe } from "~/lib/stripe.server";
import { getDb } from "~/lib/db.server";
import { getUserPlan } from "~/lib/subscription.server";

export async function action({ request, context }: Route.ActionArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Response("Unauthorized", { status: 401 });

  const db = getDb(context.cloudflare.env.DB);
  const userPlan = await getUserPlan(db, session.user.id);

  if (!userPlan.subscription?.stripeSubscriptionId) {
    return redirect("/dashboard/billing");
  }

  const stripe = getStripe(context.cloudflare.env);

  await stripe.subscriptions.update(userPlan.subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  return redirect("/dashboard/billing?canceled_sub=true");
}
