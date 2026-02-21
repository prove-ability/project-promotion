import { useState } from "react";
import { Link, redirect } from "react-router";
import type { Route } from "./+types/index";
import { getDb } from "~/lib/db.server";
import { getAuth } from "~/lib/auth.server";
import { pages } from "@project-promotion/db/schema";
import { eq, desc } from "drizzle-orm";

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { pages: [], publicAppUrl: "" };

  const db = getDb(context.cloudflare.env.DB);
  const userPages = await db
    .select()
    .from(pages)
    .where(eq(pages.userId, session.user.id))
    .orderBy(desc(pages.updatedAt));

  return {
    pages: userPages,
    publicAppUrl: context.cloudflare.env.PUBLIC_APP_URL,
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
      {copied ? "복사됨!" : "링크 복사"}
    </button>
  );
}

export default function DashboardIndex({ loaderData }: Route.ComponentProps) {
  const { publicAppUrl } = loaderData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">내 페이지</h1>
        <form method="post">
          <input type="hidden" name="intent" value="create" />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + 새 페이지 만들기
          </button>
        </form>
      </div>

      {loaderData.pages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 mb-4">아직 만든 페이지가 없습니다.</p>
          <p className="text-sm text-gray-400">
            위의 "새 페이지 만들기" 버튼을 눌러 시작하세요.
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
                    ? "배포됨"
                    : page.status === "archived"
                      ? "보관됨"
                      : "작성 중"}
                </span>
              </div>
              <p className="text-sm text-gray-500">/{page.slug}</p>
              <div className="flex items-center gap-2 mt-3">
                <Link
                  to={`/dashboard/pages/${page.id}/analytics`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-blue-500 hover:underline"
                >
                  분석
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
                    ? new Date(page.updatedAt).toLocaleDateString("ko-KR")
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
