import { redirect } from "react-router";
import type { Route } from "./+types/create-checkout";
import { getAuth } from "~/lib/auth.server";
import { getDb } from "~/lib/db.server";
import { getUserPlan } from "~/lib/subscription.server";
import { initLemonSqueezy, createLsCheckout } from "~/lib/lemonsqueezy.server";

export async function loader() {
  return redirect("/dashboard/billing");
}

export async function action({ request, context }: Route.ActionArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Response("Unauthorized", { status: 401 });

  const db = getDb(context.cloudflare.env.DB);
  const userPlan = await getUserPlan(db, session.user.id);

  if (userPlan.plan === "pro") {
    return redirect("/dashboard/billing");
  }

  try {
    const formData = await request.formData();
    const interval = formData.get("interval") === "yearly" ? "yearly" : "monthly";

    const env = context.cloudflare.env as unknown as Record<string, string>;
    const apiKey = env.LEMONSQUEEZY_API_KEY;
    const storeId = env.LEMONSQUEEZY_STORE_ID;
    const variantIdMonthly = env.LEMONSQUEEZY_VARIANT_ID_MONTHLY;
    const variantIdYearly = env.LEMONSQUEEZY_VARIANT_ID_YEARLY;

    if (!apiKey || !storeId || !variantIdMonthly || !variantIdYearly) {
      console.error("LemonSqueezy secrets not configured");
      return redirect("/dashboard/billing?error=checkout_failed");
    }

    initLemonSqueezy(apiKey);
    const baseUrl = context.cloudflare.env.ADMIN_BASE_URL;

    const variantId = interval === "yearly" ? variantIdYearly : variantIdMonthly;

    const checkoutUrl = await createLsCheckout({
      storeId,
      variantId,
      userId: session.user.id,
      userEmail: session.user.email,
      redirectUrl: `${baseUrl}/dashboard/billing?success=true`,
    });

    if (!checkoutUrl) {
      console.error("LemonSqueezy checkout created but no URL returned");
      return redirect("/dashboard/billing?error=checkout_failed");
    }

    return redirect(checkoutUrl);
  } catch (err) {
    console.error("LemonSqueezy checkout error:", err);
    return redirect("/dashboard/billing?error=checkout_failed");
  }
}
