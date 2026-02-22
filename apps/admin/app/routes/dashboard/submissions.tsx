import { Link } from "react-router";
import type { Route } from "./+types/submissions";
import { getDb } from "~/lib/db.server";
import { getAuth } from "~/lib/auth.server";
import { pages, formSubmissions } from "@project-promotion/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { useT } from "~/lib/i18n";
import { Badge } from "~/components/ui/badge";
import { Text } from "~/components/ui/text";

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

  const submissions = await db
    .select()
    .from(formSubmissions)
    .where(eq(formSubmissions.pageId, params.id))
    .orderBy(desc(formSubmissions.createdAt))
    .limit(200)
    .all();

  return { page, submissions };
}

export default function SubmissionsPage({ loaderData }: Route.ComponentProps) {
  const { page, submissions } = loaderData;
  const { t, locale } = useT();

  const allKeys = new Set<string>();
  for (const sub of submissions) {
    const data = sub.formData as Record<string, string>;
    for (const key of Object.keys(data)) {
      allKeys.add(key);
    }
  }
  const columns = Array.from(allKeys);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; {t("common.back")}
        </Link>
        <Text variant="h1">{page.title}</Text>
        <Badge variant="primary">{t("submissions.title")}</Badge>
        <Badge>{submissions.length}{t("submissions.count")}</Badge>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <Text color="muted">{t("submissions.empty")}</Text>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    #
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("submissions.date")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub, idx) => {
                  const data = sub.formData as Record<string, string>;
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">
                        {submissions.length - idx}
                      </td>
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-3 text-gray-700 max-w-[200px] truncate">
                          {data[col] ?? "-"}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                        {sub.createdAt
                          ? new Date(sub.createdAt).toLocaleString(locale)
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
