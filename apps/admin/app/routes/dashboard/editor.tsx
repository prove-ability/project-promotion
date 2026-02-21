import { useCallback, useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/editor";
import { getDb } from "~/lib/db.server";
import { getAuth } from "~/lib/auth.server";
import { pages } from "@project-promotion/db/schema";
import { eq, and } from "drizzle-orm";
import { setupComponents, type PageData } from "@project-promotion/components";
import { generatePageHtml } from "~/lib/html-generator.server";

import { useEditorStore } from "~/components/editor/use-editor-store";
import { ComponentPalette } from "~/components/editor/component-palette";
import { EditorCanvas } from "~/components/editor/editor-canvas";
import { PropertyPanel } from "~/components/editor/property-panel";
import { EditorToolbar } from "~/components/editor/editor-toolbar";
import { SeoPanel } from "~/components/editor/seo-panel";
import { PublishConfirmModal } from "~/components/editor/publish-confirm-modal";

setupComponents();

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

  return { page };
}

export async function action({ params, request, context }: Route.ActionArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Response("Unauthorized", { status: 401 });

  const db = getDb(context.cloudflare.env.DB);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "save") {
    const pageData = JSON.parse(formData.get("pageData") as string);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const seoOgImage = formData.get("seoOgImage") as string;

    await db
      .update(pages)
      .set({
        pageData,
        title,
        slug,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoOgImage: seoOgImage || null,
        updatedAt: new Date(),
      })
      .where(and(eq(pages.id, params.id), eq(pages.userId, session.user.id)));

    return { ok: true, action: "save" };
  }

  if (intent === "publish") {
    const pageData = JSON.parse(formData.get("pageData") as string);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const seoOgImage = formData.get("seoOgImage") as string;

    await db
      .update(pages)
      .set({
        pageData,
        title,
        slug,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoOgImage: seoOgImage || null,
        status: "published",
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(pages.id, params.id), eq(pages.userId, session.user.id)));

    const publicAppUrl =
      context.cloudflare.env.PUBLIC_APP_URL ?? "https://promo.example.com";

    const html = generatePageHtml(pageData as PageData, {
      title,
      seoTitle,
      seoDescription,
      seoOgImage,
      pageId: params.id,
      slug,
      publicAppUrl,
    });

    await context.cloudflare.env.KV_PAGES.put(slug, html, {
      metadata: { pageId: params.id, publishedAt: Date.now() },
    });

    return { ok: true, action: "publish", slug };
  }

  return { ok: false };
}

export default function EditorPage({ loaderData }: Route.ComponentProps) {
  const { page } = loaderData;
  const fetcher = useFetcher();

  const {
    state: editorState,
    selectedComponent,
    addComponent,
    removeComponent,
    moveComponent,
    updateProps,
    selectComponent,
    undo,
    redo,
    markSaved,
  } = useEditorStore(page.pageData);

  const [seoData, setSeoData] = useState({
    title: page.title,
    slug: page.slug,
    seoTitle: page.seoTitle ?? "",
    seoDescription: page.seoDescription ?? "",
    seoOgImage: page.seoOgImage ?? "",
  });

  const [showSeo, setShowSeo] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.data && typeof fetcher.data === "object" && "action" in fetcher.data) {
      const data = fetcher.data as { action: string; slug?: string; ok: boolean };
      if (data.ok && data.action === "save") {
        markSaved();
      }
      if (data.ok && data.action === "publish" && data.slug) {
        setPublishedUrl(`/${data.slug}`);
      }
    }
  }, [fetcher.data, markSaved]);

  const handleSave = useCallback(() => {
    const formData = new FormData();
    formData.set("intent", "save");
    formData.set("pageData", JSON.stringify(editorState.pageData));
    formData.set("title", seoData.title);
    formData.set("slug", seoData.slug);
    formData.set("seoTitle", seoData.seoTitle);
    formData.set("seoDescription", seoData.seoDescription);
    formData.set("seoOgImage", seoData.seoOgImage);
    fetcher.submit(formData, { method: "post" });
  }, [editorState.pageData, seoData, fetcher]);

  const handlePublish = useCallback(() => {
    const formData = new FormData();
    formData.set("intent", "publish");
    formData.set("pageData", JSON.stringify(editorState.pageData));
    formData.set("title", seoData.title);
    formData.set("slug", seoData.slug);
    formData.set("seoTitle", seoData.seoTitle);
    formData.set("seoDescription", seoData.seoDescription);
    formData.set("seoOgImage", seoData.seoOgImage);
    fetcher.submit(formData, { method: "post" });
  }, [editorState.pageData, seoData, fetcher]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (
          editorState.selectedComponentId &&
          !(e.target instanceof HTMLInputElement) &&
          !(e.target instanceof HTMLTextAreaElement) &&
          !(e.target instanceof HTMLSelectElement)
        ) {
          e.preventDefault();
          removeComponent(editorState.selectedComponentId);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, handleSave, editorState.selectedComponentId, removeComponent]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <EditorToolbar
        title={seoData.title}
        isDirty={editorState.isDirty}
        canUndo={editorState.undoStack.length > 0}
        canRedo={editorState.redoStack.length > 0}
        isSaving={isSaving}
        onUndo={undo}
        onRedo={redo}
        onSave={handleSave}
        onOpenSeo={() => setShowSeo(true)}
        onPublish={() => setShowPublishConfirm(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <ComponentPalette onAddComponent={addComponent} />

        <EditorCanvas
          components={editorState.pageData.components}
          selectedComponentId={editorState.selectedComponentId}
          onSelect={selectComponent}
          onMove={moveComponent}
          onRemove={removeComponent}
        />

        <PropertyPanel
          component={selectedComponent}
          onUpdateProps={updateProps}
        />
      </div>

      <SeoPanel
        data={seoData}
        onUpdate={(partial) => setSeoData((prev) => ({ ...prev, ...partial }))}
        isOpen={showSeo}
        onClose={() => setShowSeo(false)}
      />

      <PublishConfirmModal
        isOpen={showPublishConfirm}
        seoData={seoData}
        onCancel={() => setShowPublishConfirm(false)}
        onConfirm={() => {
          setShowPublishConfirm(false);
          handlePublish();
        }}
      />

      {publishedUrl && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-4 rounded-xl shadow-lg z-50 max-w-sm">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold">배포 완료!</p>
              <p className="text-xs mt-1 opacity-90 break-all">
                promotion.ccoshong.top/{seoData.slug}
              </p>
            </div>
            <button
              onClick={() => setPublishedUrl(null)}
              className="text-white/60 hover:text-white shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
