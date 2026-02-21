import { redirect } from "react-router";
import type { Route } from "./+types/create-checkout";
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

  if (userPlan.plan === "pro") {
    return redirect("/dashboard/billing");
  }

  const stripe = getStripe(context.cloudflare.env);
  const baseUrl = context.cloudflare.env.ADMIN_BASE_URL;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: context.cloudflare.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/billing?success=true`,
    cancel_url: `${baseUrl}/dashboard/billing?canceled=true`,
    customer_email: session.user.email,
    metadata: { userId: session.user.id },
    subscription_data: { metadata: { userId: session.user.id } },
  });

  if (!checkoutSession.url) {
    return new Response("Failed to create checkout session", { status: 500 });
  }

  return redirect(checkoutSession.url);
}
