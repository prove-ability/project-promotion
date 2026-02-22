import { useState } from "react";
import { Link, Form, useSearchParams } from "react-router";
import type { Route } from "./+types/billing";
import { getAuth } from "~/lib/auth.server";
import { getDb } from "~/lib/db.server";
import { getUserPlan } from "~/lib/subscription.server";
import { PLAN_LIMITS } from "@project-promotion/db";
import { useT } from "~/lib/i18n";

type BillingInterval = "monthly" | "yearly";

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Response("Unauthorized", { status: 401 });

  const db = getDb(context.cloudflare.env.DB);
  const userPlan = await getUserPlan(db, session.user.id);

  return {
    plan: userPlan.plan,
    limits: userPlan.limits,
    cancelAtPeriodEnd: userPlan.subscription?.cancelAtPeriodEnd ?? false,
    currentPeriodEnd:
      userPlan.subscription?.currentPeriodEnd?.toISOString() ?? null,
  };
}

type PlanType = "free" | "pro";

function isIncludedInPlan(plan: PlanType, value: boolean | string): boolean {
  if (typeof value === "string") return true;
  return value;
}

function BillingToggle({
  interval,
  onChange,
  savePercent,
}: {
  interval: BillingInterval;
  onChange: (v: BillingInterval) => void;
  savePercent: number;
}) {
  const { t } = useT();
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
          interval === "monthly"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
      >
        {t("billing.monthly")}
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center gap-1.5 ${
          interval === "yearly"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
      >
        {t("billing.yearly")}
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            interval === "yearly"
              ? "bg-white/20 text-white"
              : "bg-green-100 text-green-700"
          }`}
        >
          {t("billing.discount", { percent: savePercent })}
        </span>
      </button>
    </div>
  );
}

function FeatureRow({
  label,
  desc,
  free,
  pro,
  business,
  currentPlan,
  isLast = false,
}: {
  label: string;
  desc: string;
  free: boolean | string;
  pro: boolean | string;
  business: boolean | string;
  currentPlan: PlanType;
  isLast?: boolean;
}) {
  const currentValue = currentPlan === "free" ? free : pro;
  const included = isIncludedInPlan(currentPlan, currentValue);

  const renderValue = (
    value: boolean | string,
    columnPlan: PlanType | "business",
  ) => {
    const isCurrent = columnPlan === currentPlan;
    const isBusiness = columnPlan === "business";

    if (typeof value === "string") {
      return (
        <span className={`text-sm font-semibold ${isCurrent ? "text-blue-700" : isBusiness ? "text-gray-400" : "text-gray-400"}`}>
          {value}
        </span>
      );
    }
    if (value) {
      if (isCurrent) {
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">
            &#10003;
          </span>
        );
      }
      return <span className={`text-lg ${isBusiness ? "text-gray-300" : "text-gray-300"}`}>&#10003;</span>;
    }
    return <span className="text-gray-200 text-lg">&mdash;</span>;
  };

  const currentCol = currentPlan === "free" ? 1 : 2;

  return (
    <div
      className={`grid grid-cols-4 gap-0 items-center ${!isLast ? "border-b border-gray-100" : ""}`}
    >
      <div className={`px-4 py-3 ${included ? "" : "opacity-50"}`}>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <div className={`text-center py-3 ${currentCol === 1 ? (included ? "bg-blue-50/70" : "bg-blue-50/30") : ""}`}>
        {renderValue(free, "free")}
      </div>
      <div className={`text-center py-3 ${currentCol === 2 ? (included ? "bg-blue-50/70" : "bg-blue-50/30") : ""}`}>
        {renderValue(pro, "pro")}
      </div>
      <div className="text-center py-3 bg-gray-50/40 relative">
        <div className="opacity-30">{renderValue(business, "business")}</div>
      </div>
    </div>
  );
}

export default function BillingPage({ loaderData }: Route.ComponentProps) {
  const { plan, limits, cancelAtPeriodEnd, currentPeriodEnd } = loaderData;
  const [searchParams] = useSearchParams();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("monthly");
  const { t, locale, formatPrice, pricing } = useT();

  const monthlyPrice = pricing.monthly;
  const yearlyPrice = pricing.yearly;
  const yearlyMonthlyEquiv = Math.round((yearlyPrice * 100) / 12) / 100;
  const yearlySavePercent = Math.round(
    (1 - yearlyPrice / (monthlyPrice * 12)) * 100,
  );

  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";
  const canceledSub = searchParams.get("canceled_sub") === "true";
  const checkoutError = searchParams.get("error") === "checkout_failed";

  const proPrice = formatPrice(
    billingInterval === "yearly" ? yearlyMonthlyEquiv : monthlyPrice,
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; {t("billing.back")}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{t("billing.title")}</h1>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          {t("billing.upgraded")}
        </div>
      )}
      {canceled && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
          {t("billing.paymentCanceled")}
        </div>
      )}
      {canceledSub && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          {t("billing.subCanceled")}
        </div>
      )}
      {checkoutError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {t("billing.checkoutError")}
        </div>
      )}

      {/* Current plan */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t("billing.currentPlan")}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 text-sm font-semibold rounded-full ${
                  plan === "pro"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {plan === "pro" ? "Pro" : "Free"}
              </span>
              {cancelAtPeriodEnd && (
                <span className="text-xs text-amber-600">{t("billing.cancelScheduled")}</span>
              )}
            </div>
          </div>
          {plan === "pro" && currentPeriodEnd && (
            <p className="text-sm text-gray-500">
              {t("billing.nextPayment")}{" "}
              {new Date(currentPeriodEnd).toLocaleDateString(locale)}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">{t("billing.pageLimit")}</p>
            <p className="font-semibold text-gray-900">{t("billing.pagesCount", { count: limits.maxPages })}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">{t("billing.loggingLabel")}</p>
            <p className="font-semibold text-gray-900">
              {t("billing.recentDays", { days: limits.loggingDays })}
            </p>
          </div>
        </div>
      </div>

      {/* Billing interval toggle */}
      <BillingToggle interval={billingInterval} onChange={setBillingInterval} savePercent={yearlySavePercent} />

      {/* Plan headers */}
      <div className="grid grid-cols-4 gap-0 mb-0">
        <div />
        <div
          className={`text-center p-4 rounded-t-xl border border-b-0 ${
            plan === "free"
              ? "border-blue-400 bg-blue-50 ring-2 ring-blue-400 ring-inset relative z-10"
              : "border-gray-200 bg-white"
          }`}
        >
          <h3
            className={`font-semibold ${plan === "free" ? "text-blue-700" : "text-gray-900"}`}
          >
            Free
          </h3>
          <p
            className={`text-xl font-bold mt-1 ${plan === "free" ? "text-blue-700" : "text-gray-900"}`}
          >
            {t("billing.freePrice")}
          </p>
          {plan === "free" && (
            <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
              {t("billing.currentPlan")}
            </span>
          )}
        </div>
        <div
          className={`text-center p-4 rounded-t-xl border border-b-0 ${
            plan === "pro"
              ? "border-blue-400 bg-blue-50 ring-2 ring-blue-400 ring-inset relative z-10"
              : "border-gray-200 bg-white"
          }`}
        >
          <h3
            className={`font-semibold ${plan === "pro" ? "text-blue-700" : "text-gray-500"}`}
          >
            Pro
          </h3>
          <div className="mt-1">
            <p
              className={`text-xl font-bold ${plan === "pro" ? "text-blue-700" : "text-gray-500"}`}
            >
              {proPrice}
              <span className="text-sm font-normal text-gray-400">{t("billing.perMonth")}</span>
            </p>
            {billingInterval === "yearly" && (
              <div className="mt-1 space-y-0.5">
                <p className="text-xs text-gray-400 line-through">
                  {t("billing.yearlyPrice", { price: formatPrice(monthlyPrice * 12) })}
                </p>
                <p className="text-xs font-semibold text-green-600">
                  {t("billing.yearlyDiscount", { price: formatPrice(yearlyPrice), percent: yearlySavePercent })}
                </p>
              </div>
            )}
          </div>
          {plan === "pro" && (
            <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
              {t("billing.currentPlan")}
            </span>
          )}
        </div>
        <div className="text-center p-4 rounded-t-xl border border-b-0 border-dashed border-gray-200 bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,rgba(0,0,0,0.02)_8px,rgba(0,0,0,0.02)_16px)] relative overflow-hidden">
          <h3 className="font-semibold text-gray-300">Business</h3>
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span className="text-xs font-medium text-gray-400">{t("billing.preparing")}</span>
          </div>
          <p className="text-[10px] text-gray-300 mt-1.5">{t("billing.notifyLaunch")}</p>
        </div>
      </div>

      {/* Feature comparison table */}
      <div className="bg-white border border-gray-200 rounded-b-xl overflow-hidden mb-6">
        <FeatureRow
          currentPlan={plan as PlanType}
          label={t("billing.feat.promoPages")}
          desc={t("billing.feat.promoPagesDesc")}
          free={t("billing.feat.count", { count: PLAN_LIMITS.free.maxPages })}
          pro={t("billing.feat.count", { count: PLAN_LIMITS.pro.maxPages })}
          business={t("billing.feat.unlimited")}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label={t("billing.feat.logging")}
          desc={t("billing.feat.loggingDesc")}
          free={t("billing.feat.days", { days: PLAN_LIMITS.free.loggingDays })}
          pro={t("billing.feat.days", { days: PLAN_LIMITS.pro.loggingDays })}
          business={t("billing.feat.allPeriod")}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label={t("billing.feat.pageview")}
          desc={t("billing.feat.pageviewDesc")}
          free={true}
          pro={true}
          business={true}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label={t("billing.feat.click")}
          desc={t("billing.feat.clickDesc")}
          free={false}
          pro={true}
          business={true}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label={t("billing.feat.scroll")}
          desc={t("billing.feat.scrollDesc")}
          free={false}
          pro={true}
          business={true}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label={t("billing.feat.branding")}
          desc={t("billing.feat.brandingDesc")}
          free={false}
          pro={true}
          business={true}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label={t("billing.feat.report")}
          desc={t("billing.feat.reportDesc")}
          free={false}
          pro={false}
          business={true}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label={t("billing.feat.domain")}
          desc={t("billing.feat.domainDesc")}
          free={false}
          pro={false}
          business={true}
          isLast
        />
      </div>

      {/* CTA */}
      {plan === "free" && (
        <div className="mb-6">
          <Form method="post" action="/api/create-checkout">
            <input type="hidden" name="interval" value={billingInterval} />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              {billingInterval === "yearly"
                ? t("billing.upgradeYearly", { price: formatPrice(yearlyPrice) })
                : t("billing.upgradeMonthly", { price: formatPrice(monthlyPrice) })}
            </button>
            {billingInterval === "yearly" && (
              <p className="text-center text-xs text-green-600 mt-2 font-medium">
                {t("billing.yearlySaving", {
                  amount: formatPrice(monthlyPrice * 12 - yearlyPrice),
                  percent: yearlySavePercent,
                })}
              </p>
            )}
          </Form>
        </div>
      )}

      {/* Cancel section */}
      {plan === "pro" && !cancelAtPeriodEnd && (
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">{t("billing.cancelTitle")}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {t("billing.cancelDesc")}
          </p>
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            {t("billing.cancelButton")}
          </button>
        </div>
      )}

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {t("billing.cancelConfirmTitle")}
            </h3>
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p>{t("billing.cancelConfirmDesc")}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  {t("billing.cancelKeepPro", {
                    date: currentPeriodEnd
                      ? `(${new Date(currentPeriodEnd).toLocaleDateString(locale)})`
                      : "",
                  })}
                </li>
                <li>
                  {t("billing.cancelOnePage")}
                </li>
                <li>
                  {t("billing.cancelDisable")}
                </li>
                <li>{t("billing.cancelRestore")}</li>
              </ul>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {t("common.cancel")}
              </button>
              <Form method="post" action="/api/cancel-subscription">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  {t("billing.cancelConfirm")}
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
