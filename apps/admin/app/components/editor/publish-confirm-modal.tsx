import { useState } from "react";
import { useT } from "~/lib/i18n";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

interface PublishConfirmProps {
  isOpen: boolean;
  onConfirm: (scheduledAt?: string) => void;
  onCancel: () => void;
  seoData: {
    title: string;
    slug: string;
    seoTitle: string;
    seoDescription: string;
    seoOgImage: string;
  };
}

export function PublishConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  seoData,
}: PublishConfirmProps) {
  const { t } = useT();
  const [publishMode, setPublishMode] = useState<"now" | "scheduled">("now");
  const [scheduledDate, setScheduledDate] = useState("");

  if (!isOpen) return null;

  const displayTitle =
    seoData.seoTitle || seoData.title || t("publish.noTitle");
  const hasWarnings =
    !seoData.seoTitle || !seoData.seoDescription || !seoData.seoOgImage;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100">
          <Text variant="h2">{t("publish.title")}</Text>
          <Text variant="body-sm" color="placeholder" className="mt-0.5">
            {t("publish.desc")}
          </Text>
        </div>
        <div className="p-6 space-y-5">
          {/* Page info */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {t("publish.pageInfo")}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-gray-400 shrink-0 w-16">
                  {t("publish.titleLabel")}
                </span>
                <span className="text-gray-900 font-medium">
                  {seoData.title || t("publish.noTitle")}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-400 shrink-0 w-16">URL</span>
                <span className="text-blue-600 font-mono text-xs">
                  promotion.ccoshong.top/{seoData.slug}
                </span>
              </div>
            </div>
          </div>

          {/* SEO status */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {t("publish.seoStatus")}
            </p>
            <div className="space-y-1.5">
              <SeoStatusRow
                label={t("publish.seoTitle")}
                value={seoData.seoTitle}
              />
              <SeoStatusRow
                label={t("publish.seoDesc")}
                value={seoData.seoDescription}
              />
              <SeoStatusRow
                label={t("publish.ogImage")}
                value={seoData.seoOgImage}
              />
            </div>
          </div>

          {hasWarnings && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                {t("publish.seoWarning")}
              </p>
            </div>
          )}

          {/* SNS share preview */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {t("publish.sharePreview")}
            </p>
            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden max-w-[340px] mx-auto">
              <div className="aspect-[1.91/1] bg-gray-200 relative">
                {seoData.seoOgImage ? (
                  <img
                    src={seoData.seoOgImage}
                    alt={t("publish.ogPreviewAlt")}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 mx-auto mb-1 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                        />
                      </svg>
                      <p className="text-[10px]">{t("publish.noOgImage")}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-[10px] text-gray-400 uppercase">
                  promotion.ccoshong.top
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-2">
                  {displayTitle}
                </p>
                {seoData.seoDescription && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {seoData.seoDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled publish */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="publishMode"
                checked={publishMode === "now"}
                onChange={() => setPublishMode("now")}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{t("publish.now")}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="publishMode"
                checked={publishMode === "scheduled"}
                onChange={() => setPublishMode("scheduled")}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{t("publish.scheduled")}</span>
            </label>
          </div>
          {publishMode === "scheduled" && (
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 rounded-b-2xl px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={() =>
              onConfirm(
                publishMode === "scheduled" && scheduledDate
                  ? scheduledDate
                  : undefined
              )
            }
            disabled={publishMode === "scheduled" && !scheduledDate}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            {publishMode === "scheduled" ? t("publish.scheduleButton") : t("publish.button")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SeoStatusRow({ label, value }: { label: string; value: string }) {
  const { t } = useT();
  const filled = Boolean(value);
  return (
    <div className="flex items-center gap-2 text-sm">
      {filled ? (
        <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
          &#10003;
        </span>
      ) : (
        <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">
          &mdash;
        </span>
      )}
      <span className={filled ? "text-gray-700" : "text-gray-400"}>
        {label}
      </span>
      {filled && (
        <span className="text-xs text-gray-400 truncate max-w-[200px] ml-auto">
          {value}
        </span>
      )}
      {!filled && (
        <span className="text-xs text-gray-400 ml-auto">
          {t("common.notSet")}
        </span>
      )}
    </div>
  );
}
