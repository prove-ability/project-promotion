import { useState } from "react";

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

export function SeoPanel({ data, onUpdate, isOpen, onClose }: SeoPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">페이지 설정 & SEO</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              페이지 제목
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="프로모션 페이지 제목"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL 슬러그
            </label>
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-1">/</span>
              <input
                type="text"
                value={data.slug}
                onChange={(e) =>
                  onUpdate({
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-"),
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="my-promotion"
              />
            </div>
          </div>

          <hr className="my-4" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO 제목
            </label>
            <input
              type="text"
              value={data.seoTitle}
              onChange={(e) => onUpdate({ seoTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="검색엔진에 표시될 제목"
            />
            <p className="text-xs text-gray-400 mt-1">
              {data.seoTitle.length}/60자 권장
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO 설명
            </label>
            <textarea
              value={data.seoDescription}
              onChange={(e) => onUpdate({ seoDescription: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
              placeholder="검색엔진에 표시될 설명"
            />
            <p className="text-xs text-gray-400 mt-1">
              {data.seoDescription.length}/160자 권장
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OG 이미지 URL
            </label>
            <input
              type="text"
              value={data.seoOgImage}
              onChange={(e) => onUpdate({ seoOgImage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="https://example.com/og-image.jpg"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
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
