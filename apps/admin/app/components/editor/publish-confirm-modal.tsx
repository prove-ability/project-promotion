interface PublishConfirmProps {
  isOpen: boolean;
  onConfirm: () => void;
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
  if (!isOpen) return null;

  const displayTitle = seoData.seoTitle || seoData.title || "제목 없음";
  const hasWarnings =
    !seoData.seoTitle || !seoData.seoDescription || !seoData.seoOgImage;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">배포 확인</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            아래 정보로 페이지가 배포됩니다
          </p>
        </div>
        <div className="p-6 space-y-5">
          {/* Page info */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              페이지 정보
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-gray-400 shrink-0 w-16">제목</span>
                <span className="text-gray-900 font-medium">
                  {seoData.title || "제목 없음"}
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
              SEO 설정 상태
            </p>
            <div className="space-y-1.5">
              <SeoStatusRow label="SEO 제목" value={seoData.seoTitle} />
              <SeoStatusRow label="SEO 설명" value={seoData.seoDescription} />
              <SeoStatusRow label="OG 이미지" value={seoData.seoOgImage} />
            </div>
          </div>

          {hasWarnings && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                SEO 설정이 일부 비어있습니다. 검색엔진과 SNS 공유에서 최적의
                결과를 얻으려면 모든 항목을 입력하는 것을 권장합니다.
              </p>
            </div>
          )}

          {/* SNS share preview */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              공유 미리보기
            </p>
            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden max-w-[340px] mx-auto">
              <div className="aspect-[1.91/1] bg-gray-200 relative">
                {seoData.seoOgImage ? (
                  <img
                    src={seoData.seoOgImage}
                    alt="OG 미리보기"
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
                      <p className="text-[10px]">OG 이미지 없음</p>
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

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 rounded-b-2xl px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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
            배포하기
          </button>
        </div>
      </div>
    </div>
  );
}

function SeoStatusRow({ label, value }: { label: string; value: string }) {
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
      {!filled && <span className="text-xs text-gray-400 ml-auto">미설정</span>}
    </div>
  );
}
