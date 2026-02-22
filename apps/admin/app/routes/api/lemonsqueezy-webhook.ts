import type { Route } from "./+types/lemonsqueezy-webhook";
import { verifyWebhookSignature } from "~/lib/lemonsqueezy.server";
import { getDb } from "~/lib/db.server";
import { subscriptions } from "@project-promotion/db/schema";
import { eq } from "drizzle-orm";

interface LsWebhookPayload {
  meta: {
    event_name: string;
    custom_data?: { user_id?: string };
  };
  data: {
    id: string;
    attributes: {
      store_id: number;
      customer_id: number;
      status: string;
      cancelled: boolean;
      renews_at: string | null;
      ends_at: string | null;
      trial_ends_at: string | null;
    };
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-signature") ?? "";

  if (
    !signature ||
    !verifyWebhookSignature(
      body,
      signature,
      context.cloudflare.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    )
  ) {
    return new Response("Invalid signature", { status: 400 });
  }

  let payload: LsWebhookPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  const eventName = payload.meta.event_name;
  const sub = payload.data;
  const userId = payload.meta.custom_data?.user_id;
  const db = getDb(context.cloudflare.env.DB);

  const lsSubscriptionId = String(sub.id);
  const lsCustomerId = String(sub.attributes.customer_id);
  const renewsAt = sub.attributes.renews_at
    ? new Date(sub.attributes.renews_at)
    : null;
  const endsAt = sub.attributes.ends_at
    ? new Date(sub.attributes.ends_at)
    : null;

  switch (eventName) {
    case "subscription_created": {
      if (!userId) break;

      await db
        .insert(subscriptions)
        .values({
          id: crypto.randomUUID(),
          userId,
          plan: "pro",
          stripeCustomerId: lsCustomerId,
          stripeSubscriptionId: lsSubscriptionId,
          cancelAtPeriodEnd: false,
          currentPeriodEnd: renewsAt,
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            plan: "pro",
            stripeCustomerId: lsCustomerId,
            stripeSubscriptionId: lsSubscriptionId,
            cancelAtPeriodEnd: false,
            currentPeriodEnd: renewsAt,
            updatedAt: new Date(),
          },
        });
      break;
    }

    case "subscription_updated": {
      const isCancelled = sub.attributes.cancelled;

      await db
        .update(subscriptions)
        .set({
          cancelAtPeriodEnd: isCancelled,
          currentPeriodEnd: renewsAt ?? endsAt,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, lsSubscriptionId));
      break;
    }

    case "subscription_payment_success": {
      await db
        .update(subscriptions)
        .set({
          plan: "pro",
          currentPeriodEnd: renewsAt,
          cancelAtPeriodEnd: false,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, lsSubscriptionId));
      break;
    }

    case "subscription_expired": {
      await db
        .update(subscriptions)
        .set({
          plan: "free",
          cancelAtPeriodEnd: false,
          currentPeriodEnd: null,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, lsSubscriptionId));
      break;
    }
  }

  return new Response("ok", { status: 200 });
}
