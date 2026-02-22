import { useState } from "react";
import { Link, Form, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/index";
import { getDb } from "~/lib/db.server";
import { getAuth } from "~/lib/auth.server";
import { getUserPlan } from "~/lib/subscription.server";
import { pages } from "@project-promotion/db/schema";
import { eq, desc } from "drizzle-orm";
import { useT } from "~/lib/i18n";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Text } from "~/components/ui/text";

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return { pages: [], publicAppUrl: "", plan: "free" as const, maxPages: 1 };

  const db = getDb(context.cloudflare.env.DB);
  const [userPages, userPlan] = await Promise.all([
    db
      .select()
      .from(pages)
      .where(eq(pages.userId, session.user.id))
      .orderBy(desc(pages.updatedAt)),
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
      db
        .select({ id: pages.id })
        .from(pages)
        .where(eq(pages.userId, session.user.id)),
    ]);

    if (existingPages.length >= userPlan.limits.maxPages) {
      return {
        errorCode: "page_limit" as const,
        plan: userPlan.plan,
        maxPages: userPlan.limits.maxPages,
      };
    }

    const id = crypto.randomUUID();
    const slug = `page-${id.slice(0, 8)}`;

    await db.insert(pages).values({
      id,
      userId: session.user.id,
      slug,
      title: (formData.get("title") as string) || "New Page",
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
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
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

export default function DashboardIndex({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { publicAppUrl, plan, maxPages } = loaderData;
  const canCreateMore = loaderData.pages.length < maxPages;
  const { t, locale } = useT();
  const navigation = useNavigation();
  const isCreating =
    navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "create";

  const error =
    actionData &&
    "errorCode" in actionData &&
    actionData.errorCode === "page_limit"
      ? t("pages.limitError", {
          plan: t(`plan.${actionData.plan as string}`),
          max: actionData.maxPages as number,
        })
      : actionData && "error" in actionData
        ? (actionData as { error: string }).error
        : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <Text color="inherit">{error}</Text>
          <Link
            to="/dashboard/billing"
            className="text-sm text-blue-600 hover:underline mt-1 inline-block"
          >
            {t("pages.upgradePlan")} &rarr;
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Text variant="h1">{t("pages.title")}</Text>
          <Badge>
            {loaderData.pages.length} / {maxPages} ({t(`plan.${plan}`)})
          </Badge>
        </div>
        <Form method="post">
          <input type="hidden" name="intent" value="create" />
          <input type="hidden" name="title" value={t("pages.defaultTitle")} />
          <Button type="submit" disabled={!canCreateMore} loading={isCreating}>
            {t("pages.createNew")}
          </Button>
        </Form>
      </div>

      {loaderData.pages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Text color="muted" className="mb-4">
            {t("pages.empty")}
          </Text>
          <Text color="placeholder">{t("pages.emptyHint")}</Text>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loaderData.pages.map((page) => (
            <Link
              key={page.id}
              to={`/dashboard/pages/${page.id}/edit`}
              className="block bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all overflow-hidden"
            >
              {/* OG Image Preview */}
              <div className="aspect-1200/630 bg-gray-100 relative overflow-hidden">
                {page.seoOgImage ? (
                  <img
                    src={page.seoOgImage}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <svg className="w-10 h-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                    <span className="text-[10px]">{t("pages.noOgImage")}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      page.status === "published"
                        ? "success"
                        : page.status === "archived"
                          ? "default"
                          : "warning"
                    }
                  >
                    {page.status === "published"
                      ? t("pages.published")
                      : page.status === "archived"
                        ? t("pages.archived")
                        : t("pages.draft")}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <Text variant="h3" className="truncate mb-0.5">
                  {page.seoTitle || page.title}
                </Text>
                {page.seoDescription && (
                  <Text variant="caption" color="muted" className="line-clamp-2 mb-1">
                    {page.seoDescription}
                  </Text>
                )}
                <Text variant="caption" color="placeholder">/{page.slug}</Text>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Link
                    to={`/dashboard/pages/${page.id}/analytics`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    {t("pages.analytics")}
                  </Link>
                  <span className="text-xs text-gray-300">·</span>
                  <Link
                    to={`/dashboard/pages/${page.id}/submissions`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-purple-500 hover:underline"
                  >
                    {t("pages.submissions")}
                  </Link>
                  {page.status === "published" && (
                    <>
                      <span className="text-xs text-gray-300">·</span>
                      <CopyLinkButton url={`${publicAppUrl}/${page.slug}`} />
                    </>
                  )}
                  <Text variant="caption" as="span" color="placeholder" className="ml-auto">
                    {page.updatedAt
                      ? new Date(page.updatedAt).toLocaleDateString(locale)
                      : ""}
                  </Text>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
