import { useState } from "react";
import { Link, redirect } from "react-router";
import type { Route } from "./+types/index";
import { getDb } from "~/lib/db.server";
import { getAuth } from "~/lib/auth.server";
import { getUserPlan } from "~/lib/subscription.server";
import { pages } from "@project-promotion/db/schema";
import { eq, desc } from "drizzle-orm";
import { useT } from "~/lib/i18n";

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { pages: [], publicAppUrl: "", plan: "free" as const, maxPages: 1 };

  const db = getDb(context.cloudflare.env.DB);
  const [userPages, userPlan] = await Promise.all([
    db.select().from(pages).where(eq(pages.userId, session.user.id)).orderBy(desc(pages.updatedAt)),
    getUserPlan(db, session.user.id),
  ]);

  return {
    pages: userPages,
    publicAppUrl: context.cloudflare.env.PUBLIC_APP_URL,
    plan: userPlan.plan,
    maxPages: userPlan.limits.maxPages,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: "Unauthorized" };

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    const db = getDb(context.cloudflare.env.DB);

    const [userPlan, existingPages] = await Promise.all([
      getUserPlan(db, session.user.id),
      db.select({ id: pages.id }).from(pages).where(eq(pages.userId, session.user.id)),
    ]);

    if (existingPages.length >= userPlan.limits.maxPages) {
      return {
        errorCode: "page_limit" as const,
        plan: userPlan.plan === "free" ? "Free" : "Pro",
        maxPages: userPlan.limits.maxPages,
      };
    }

    const id = crypto.randomUUID();
    const slug = `page-${id.slice(0, 8)}`;

    await db.insert(pages).values({
      id,
      userId: session.user.id,
      slug,
      title: "새 프로모션 페이지",
      status: "draft",
      pageData: { version: 1, components: [] },
    });

    throw redirect(`/dashboard/pages/${id}/edit`);
  }

  return {};
}

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useT();

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-green-600 hover:text-green-800 hover:underline transition-colors"
    >
      {copied ? t("pages.copied") : t("pages.copyLink")}
    </button>
  );
}

export default function DashboardIndex({ loaderData, actionData }: Route.ComponentProps) {
  const { publicAppUrl, plan, maxPages } = loaderData;
  const canCreateMore = loaderData.pages.length < maxPages;
  const { t, locale } = useT();

  const error =
    actionData && "errorCode" in actionData && actionData.errorCode === "page_limit"
      ? t("pages.limitError", { plan: actionData.plan as string, max: actionData.maxPages as number })
      : actionData && "error" in actionData
        ? (actionData as { error: string }).error
        : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">{error}</p>
          <Link to="/dashboard/billing" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
            {t("pages.upgradePlan")} &rarr;
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{t("pages.title")}</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {loaderData.pages.length} / {maxPages} ({plan === "free" ? "Free" : "Pro"})
          </span>
        </div>
        <form method="post">
          <input type="hidden" name="intent" value="create" />
          <button
            type="submit"
            disabled={!canCreateMore}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              canCreateMore
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {t("pages.createNew")}
          </button>
        </form>
      </div>

      {loaderData.pages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 mb-4">{t("pages.empty")}</p>
          <p className="text-sm text-gray-400">
            {t("pages.emptyHint")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loaderData.pages.map((page) => (
            <Link
              key={page.id}
              to={`/dashboard/pages/${page.id}/edit`}
              className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {page.title}
                </h3>
                <span
                  className={`shrink-0 ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${
                    page.status === "published"
                      ? "bg-green-100 text-green-700"
                      : page.status === "archived"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {page.status === "published"
                    ? t("pages.published")
                    : page.status === "archived"
                      ? t("pages.archived")
                      : t("pages.draft")}
                </span>
              </div>
              <p className="text-sm text-gray-500">/{page.slug}</p>
              <div className="flex items-center gap-2 mt-3">
                <Link
                  to={`/dashboard/pages/${page.id}/analytics`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-blue-500 hover:underline"
                >
                  {t("pages.analytics")}
                </Link>
                {page.status === "published" && (
                  <>
                    <span className="text-xs text-gray-300">·</span>
                    <CopyLinkButton
                      url={`${publicAppUrl}/${page.slug}`}
                    />
                  </>
                )}
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">
                  {page.updatedAt
                    ? new Date(page.updatedAt).toLocaleDateString(locale)
                    : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
