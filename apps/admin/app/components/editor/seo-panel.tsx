import { useState, useEffect } from "react";
import { useT } from "~/lib/i18n";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ImageUrlField } from "~/components/ui/image-url-field";

interface SeoData {
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string;
  slug: string;
  title: string;
}

interface SeoPanelProps {
  data: SeoData;
  onUpdate: (data: Partial<SeoData>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400";

export function SeoPanel({ data, onUpdate, isOpen, onClose }: SeoPanelProps) {
  const [snapshot, setSnapshot] = useState<SeoData | null>(null);
  const { t } = useT();

  useEffect(() => {
    if (isOpen) setSnapshot({ ...data });
  }, [isOpen]);

  if (!isOpen) return null;

  function handleCancel() {
    if (snapshot) onUpdate(snapshot);
    onClose();
  }

  const titleLen = data.seoTitle.length;
  const descLen = data.seoDescription.length;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <Text variant="h2">{t("seo.title")}</Text>
            <Text variant="body-sm" color="placeholder" className="mt-0.5">
              {t("seo.desc")}
            </Text>
          </div>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Page title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("seo.pageTitle")}
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className={inputClass}
              placeholder={t("seo.pageTitlePlaceholder")}
            />
            <Text variant="caption" className="mt-1">{t("seo.pageTitleHint")}</Text>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("seo.slug")}
            </label>
            <div className="flex items-center gap-0">
              <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-400 select-none whitespace-nowrap">
                promotion.ccoshong.top/
              </span>
              <input
                type="text"
                value={data.slug}
                onChange={(e) =>
                  onUpdate({
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  })
                }
                className="flex-1 px-3 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-r-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
                placeholder="summer-sale"
              />
            </div>
            <Text variant="caption" className="mt-1">{t("seo.slugHint")}</Text>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{t("seo.settings")}</p>

            {/* SEO Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("seo.seoTitle")}
              </label>
              <input
                type="text"
                value={data.seoTitle}
                onChange={(e) => onUpdate({ seoTitle: e.target.value })}
                className={inputClass}
                placeholder={t("seo.seoTitlePlaceholder")}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-gray-400">{t("seo.seoTitleHint")}</p>
                <span className={`text-[10px] font-medium ${titleLen > 60 ? "text-amber-500" : "text-gray-400"}`}>
                  {titleLen}/60
                </span>
              </div>
            </div>

            {/* SEO Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("seo.seoDesc")}
              </label>
              <textarea
                value={data.seoDescription}
                onChange={(e) => onUpdate({ seoDescription: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder={t("seo.seoDescPlaceholder")}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-gray-400">{t("seo.seoDescHint")}</p>
                <span className={`text-[10px] font-medium ${descLen > 160 ? "text-amber-500" : "text-gray-400"}`}>
                  {descLen}/160
                </span>
              </div>
            </div>

            {/* OG Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("seo.ogImage")}
              </label>
              <ImageUrlField
                value={data.seoOgImage}
                onChange={(v) => onUpdate({ seoOgImage: v })}
                placeholder="https://example.com/og-image.jpg"
              />
              <Text variant="caption" className="mt-1">{t("seo.ogImageHint")}</Text>
            </div>
          </div>

          {/* Previews */}
          <div className="border-t border-gray-100 pt-5 space-y-5">
            {/* Google search preview */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t("seo.googlePreview")}</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm text-blue-700 font-medium leading-snug truncate">
                  {data.seoTitle || data.title || t("seo.pageTitleFallback")}
                </p>
                <p className="text-xs text-green-700 mt-0.5 truncate">
                  promotion.ccoshong.top/{data.slug || "page-slug"}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {data.seoDescription || t("seo.seoDescFallback")}
                </p>
              </div>
            </div>

            {/* SNS share preview */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t("seo.snsPreview")}</p>
              <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden max-w-[360px]">
                <div className="aspect-[1.91/1] bg-gray-200 relative">
                  {data.seoOgImage ? (
                    <img
                      src={data.seoOgImage}
                      alt={t("seo.ogPreviewAlt")}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                        <p className="text-[10px]">{t("seo.noOgImage")}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-gray-400 uppercase">promotion.ccoshong.top</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-2">
                    {data.seoTitle || data.title || t("seo.pageTitleFallback")}
                  </p>
                  {(data.seoDescription) && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {data.seoDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 rounded-b-2xl px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onClose}>
            {t("common.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
