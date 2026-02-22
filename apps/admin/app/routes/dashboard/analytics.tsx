import { Link } from "react-router";
import type { Route } from "./+types/analytics";
import { getDb } from "~/lib/db.server";
import { getAuth } from "~/lib/auth.server";
import { getUserPlan, getLoggingCutoffDate } from "~/lib/subscription.server";
import { pages, pageEvents } from "@project-promotion/db/schema";
import { eq, and, desc, sql, count, gte } from "drizzle-orm";
import { useT } from "~/lib/i18n";
import { Badge } from "~/components/ui/badge";
import { Text } from "~/components/ui/text";

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Response("Unauthorized", { status: 401 });

  const db = getDb(context.cloudflare.env.DB);

  const [page, userPlan] = await Promise.all([
    db.select().from(pages).where(and(eq(pages.id, params.id), eq(pages.userId, session.user.id))).get(),
    getUserPlan(db, session.user.id),
  ]);

  if (!page) throw new Response("Not found", { status: 404 });

  const cutoffDate = getLoggingCutoffDate(userPlan.plan);
  const dateFilter = gte(pageEvents.createdAt, cutoffDate);

  const totalPageviews = await db
    .select({ count: count() })
    .from(pageEvents)
    .where(
      and(eq(pageEvents.pageId, params.id), eq(pageEvents.eventType, "pageview"), dateFilter)
    )
    .get();

  const totalClicks = await db
    .select({ count: count() })
    .from(pageEvents)
    .where(
      and(eq(pageEvents.pageId, params.id), eq(pageEvents.eventType, "click"), dateFilter)
    )
    .get();

  const uniqueVisitors = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${pageEvents.visitorId})` })
    .from(pageEvents)
    .where(and(eq(pageEvents.pageId, params.id), dateFilter))
    .get();

  const recentEvents = await db
    .select()
    .from(pageEvents)
    .where(and(eq(pageEvents.pageId, params.id), dateFilter))
    .orderBy(desc(pageEvents.createdAt))
    .limit(50);

  const clickDetails = await db
    .select({
      text: sql<string>`json_extract(${pageEvents.eventData}, '$.text')`,
      href: sql<string>`json_extract(${pageEvents.eventData}, '$.href')`,
      count: count(),
    })
    .from(pageEvents)
    .where(
      and(eq(pageEvents.pageId, params.id), eq(pageEvents.eventType, "click"), dateFilter)
    )
    .groupBy(
      sql`json_extract(${pageEvents.eventData}, '$.text')`,
      sql`json_extract(${pageEvents.eventData}, '$.href')`
    )
    .orderBy(desc(count()))
    .limit(10);

  return {
    page,
    plan: userPlan.plan,
    loggingDays: userPlan.limits.loggingDays,
    stats: {
      pageviews: totalPageviews?.count ?? 0,
      clicks: totalClicks?.count ?? 0,
      uniqueVisitors: uniqueVisitors?.count ?? 0,
    },
    recentEvents,
    clickDetails,
  };
}

export default function AnalyticsPage({ loaderData }: Route.ComponentProps) {
  const { page, plan, loggingDays, stats, recentEvents, clickDetails } = loaderData;
  const { t, locale } = useT();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-4">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; {t("analytics.back")}
        </Link>
        <Text variant="h1">{page.title}</Text>
        <Badge variant={page.status === "published" ? "success" : "warning"}>
          {page.status === "published" ? t("analytics.published") : t("analytics.draft")}
        </Badge>
      </div>

      <div className="mb-8 p-3 bg-gray-50 rounded-lg text-sm text-gray-500 flex items-center justify-between">
        <span>
          {t("analytics.dataRange", { days: loggingDays, plan: t(`plan.${plan}`) })}
        </span>
        {plan === "free" && (
          <Link to="/dashboard/billing" className="text-blue-600 hover:underline text-xs">
            {t("analytics.upgradeHint")}
          </Link>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Text color="muted">{t("analytics.pageviews")}</Text>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.pageviews.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Text color="muted">{t("analytics.uniqueVisitors")}</Text>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.uniqueVisitors.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Text color="muted">{t("analytics.clicks")}</Text>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.clicks.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Text variant="h2" className="mb-4">
            {t("analytics.clickDetails")}
          </Text>
          {clickDetails.length === 0 ? (
            <Text color="placeholder">{t("analytics.noClicks")}</Text>
          ) : (
            <div className="space-y-3">
              {clickDetails.map((click, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {click.text || t("analytics.noText")}
                    </p>
                    {click.href && (
                      <p className="text-xs text-gray-400 truncate max-w-[240px]">
                        {click.href}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {t("analytics.clickCount", { count: click.count })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Text variant="h2" className="mb-4">
            {t("analytics.recentEvents")}
          </Text>
          {recentEvents.length === 0 ? (
            <Text color="placeholder">{t("analytics.noEvents")}</Text>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 py-1.5 text-sm"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      event.eventType === "pageview"
                        ? "bg-blue-400"
                        : event.eventType === "click"
                          ? "bg-green-400"
                          : "bg-gray-400"
                    }`}
                  />
                  <span className="text-gray-600">{event.eventType}</span>
                  <span className="text-gray-400 text-xs ml-auto">
                    {event.createdAt
                      ? new Date(event.createdAt).toLocaleString(locale)
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
