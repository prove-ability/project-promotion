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
    initLemonSqueezy(context.cloudflare.env.LEMONSQUEEZY_API_KEY);
    const baseUrl = context.cloudflare.env.ADMIN_BASE_URL;

    const checkoutUrl = await createLsCheckout({
      storeId: context.cloudflare.env.LEMONSQUEEZY_STORE_ID,
      variantId: context.cloudflare.env.LEMONSQUEEZY_VARIANT_ID,
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
