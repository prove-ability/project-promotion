import { eq } from "drizzle-orm";
import { subscriptions, PLAN_LIMITS, type PlanType } from "@project-promotion/db";
import type { Database } from "./db.server";

export async function getUserPlan(db: Database, userId: string) {
  const sub = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .get();

  if (!sub || sub.plan === "free") {
    return { plan: "free" as PlanType, limits: PLAN_LIMITS.free, subscription: sub };
  }

  if (sub.currentPeriodEnd && sub.currentPeriodEnd < new Date()) {
    return { plan: "free" as PlanType, limits: PLAN_LIMITS.free, subscription: sub };
  }

  return { plan: sub.plan as PlanType, limits: PLAN_LIMITS[sub.plan as PlanType], subscription: sub };
}

export function getLoggingCutoffDate(plan: PlanType): Date {
  const now = new Date();
  const days = PLAN_LIMITS[plan].loggingDays;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}
