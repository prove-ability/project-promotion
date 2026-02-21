import type { Route } from "./+types/stripe-webhook";
import { getStripe } from "~/lib/stripe.server";
import { getDb } from "~/lib/db.server";
import { subscriptions } from "@project-promotion/db/schema";
import { eq } from "drizzle-orm";

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const stripe = getStripe(context.cloudflare.env);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      context.cloudflare.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const db = getDb(context.cloudflare.env.DB);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (!userId || !session.subscription || !session.customer) break;

      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
      const customerId = typeof session.customer === "string" ? session.customer : session.customer.id;
      const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

      await db
        .insert(subscriptions)
        .values({
          id: crypto.randomUUID(),
          userId,
          plan: "pro",
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          cancelAtPeriodEnd: false,
          currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            plan: "pro",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            cancelAtPeriodEnd: false,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
            updatedAt: new Date(),
          },
        });
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      if (!invoice.subscription) break;

      const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription.id;
      const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

      await db
        .update(subscriptions)
        .set({
          plan: "pro",
          currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          cancelAtPeriodEnd: false,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object;

      await db
        .update(subscriptions)
        .set({
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;

      await db
        .update(subscriptions)
        .set({
          plan: "free",
          cancelAtPeriodEnd: false,
          currentPeriodEnd: null,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));

      // TODO: Deactivate extra pages (keep only the most recent one)
      break;
    }
  }

  return new Response("ok", { status: 200 });
}
