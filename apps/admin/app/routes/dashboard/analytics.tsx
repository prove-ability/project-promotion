import { Link } from "react-router";
import type { Route } from "./+types/analytics";
import { getDb } from "~/lib/db.server";
import { getAuth } from "~/lib/auth.server";
import { pages, pageEvents } from "@project-promotion/db/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Response("Unauthorized", { status: 401 });

  const db = getDb(context.cloudflare.env.DB);

  const page = await db
    .select()
    .from(pages)
    .where(and(eq(pages.id, params.id), eq(pages.userId, session.user.id)))
    .get();

  if (!page) throw new Response("Not found", { status: 404 });

  const totalPageviews = await db
    .select({ count: count() })
    .from(pageEvents)
    .where(
      and(eq(pageEvents.pageId, params.id), eq(pageEvents.eventType, "pageview"))
    )
    .get();

  const totalClicks = await db
    .select({ count: count() })
    .from(pageEvents)
    .where(
      and(eq(pageEvents.pageId, params.id), eq(pageEvents.eventType, "click"))
    )
    .get();

  const uniqueVisitors = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${pageEvents.visitorId})` })
    .from(pageEvents)
    .where(eq(pageEvents.pageId, params.id))
    .get();

  const recentEvents = await db
    .select()
    .from(pageEvents)
    .where(eq(pageEvents.pageId, params.id))
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
      and(eq(pageEvents.pageId, params.id), eq(pageEvents.eventType, "click"))
    )
    .groupBy(
      sql`json_extract(${pageEvents.eventData}, '$.text')`,
      sql`json_extract(${pageEvents.eventData}, '$.href')`
    )
    .orderBy(desc(count()))
    .limit(10);

  return {
    page,
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
  const { page, stats, recentEvents, clickDetails } = loaderData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← 대시보드
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{page.title}</h1>
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            page.status === "published"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {page.status === "published" ? "배포됨" : "작성 중"}
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">페이지뷰</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.pageviews.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">고유 방문자</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.uniqueVisitors.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">클릭 수</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.clicks.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            클릭 상세
          </h2>
          {clickDetails.length === 0 ? (
            <p className="text-sm text-gray-400">아직 클릭 데이터가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {clickDetails.map((click, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {click.text || "(텍스트 없음)"}
                    </p>
                    {click.href && (
                      <p className="text-xs text-gray-400 truncate max-w-[240px]">
                        {click.href}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {click.count}회
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            최근 이벤트
          </h2>
          {recentEvents.length === 0 ? (
            <p className="text-sm text-gray-400">아직 이벤트가 없습니다.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 py-1.5 text-sm"
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
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
                      ? new Date(event.createdAt).toLocaleString("ko-KR")
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
