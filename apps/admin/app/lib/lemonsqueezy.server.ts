import {
  lemonSqueezySetup,
  createCheckout,
  cancelSubscription,
  getSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";
import crypto from "node:crypto";

export function initLemonSqueezy(apiKey: string) {
  lemonSqueezySetup({ apiKey });
}

export async function createLsCheckout(opts: {
  storeId: string;
  variantId: string;
  userId: string;
  userEmail: string;
  redirectUrl: string;
}) {
  const checkout = await createCheckout(opts.storeId, opts.variantId, {
    checkoutData: {
      email: opts.userEmail,
      custom: { user_id: opts.userId },
    },
    productOptions: {
      redirectUrl: opts.redirectUrl,
    },
  });

  return checkout.data?.data.attributes.url;
}

export async function cancelLsSubscription(subscriptionId: string) {
  return cancelSubscription(subscriptionId);
}

export async function getLsSubscription(subscriptionId: string) {
  return getSubscription(subscriptionId);
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest),
  );
}
