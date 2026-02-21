import { useState, useEffect } from "react";

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
  "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all placeholder:text-gray-300";

export function SeoPanel({ data, onUpdate, isOpen, onClose }: SeoPanelProps) {
  const [snapshot, setSnapshot] = useState<SeoData | null>(null);

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
            <h2 className="text-lg font-bold text-gray-900">페이지 설정 & SEO</h2>
            <p className="text-xs text-gray-400 mt-0.5">검색엔진과 SNS 공유에 표시되는 정보입니다</p>
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
              페이지 제목
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className={inputClass}
              placeholder="예: 여름 세일 프로모션"
            />
            <p className="text-[10px] text-gray-400 mt-1">대시보드에서 구분하기 위한 내부 제목입니다</p>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL 슬러그
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
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-r-lg text-sm focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all placeholder:text-gray-300"
                placeholder="summer-sale"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다</p>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">SEO 설정</p>

            {/* SEO Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO 제목
              </label>
              <input
                type="text"
                value={data.seoTitle}
                onChange={(e) => onUpdate({ seoTitle: e.target.value })}
                className={inputClass}
                placeholder="예: 최대 70% 할인! 여름 세일 프로모션"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-gray-400">Google 검색결과에 제목으로 표시됩니다</p>
                <span className={`text-[10px] font-medium ${titleLen > 60 ? "text-amber-500" : "text-gray-400"}`}>
                  {titleLen}/60
                </span>
              </div>
            </div>

            {/* SEO Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO 설명
              </label>
              <textarea
                value={data.seoDescription}
                onChange={(e) => onUpdate({ seoDescription: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="예: 인기 상품 최대 70% 할인 이벤트. 7월 31일까지 한정 특가!"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-gray-400">Google 검색결과에 설명으로 표시됩니다</p>
                <span className={`text-[10px] font-medium ${descLen > 160 ? "text-amber-500" : "text-gray-400"}`}>
                  {descLen}/160
                </span>
              </div>
            </div>

            {/* OG Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG 이미지 URL
              </label>
              <input
                type="text"
                value={data.seoOgImage}
                onChange={(e) => onUpdate({ seoOgImage: e.target.value })}
                className={inputClass}
                placeholder="https://example.com/og-image.jpg"
              />
              <p className="text-[10px] text-gray-400 mt-1">카카오톡, 페이스북 등에서 링크 공유 시 표시되는 이미지입니다 (권장: 1200x630)</p>
            </div>
          </div>

          {/* Search preview */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">검색결과 미리보기</p>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-blue-700 font-medium leading-snug truncate">
                {data.seoTitle || data.title || "페이지 제목"}
              </p>
              <p className="text-xs text-green-700 mt-0.5 truncate">
                promotion.ccoshong.top/{data.slug || "page-slug"}
              </p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {data.seoDescription || "SEO 설명이 여기에 표시됩니다. 검색결과에서 사용자가 가장 먼저 보게 되는 텍스트입니다."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 rounded-b-2xl px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
