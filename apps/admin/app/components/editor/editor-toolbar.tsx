interface EditorToolbarProps {
  title: string;
  isDirty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onOpenSeo: () => void;
  onPublish: () => void;
}

export function EditorToolbar({
  title,
  isDirty,
  canUndo,
  canRedo,
  isSaving,
  onUndo,
  onRedo,
  onSave,
  onOpenSeo,
  onPublish,
}: EditorToolbarProps) {
  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
          {title}
        </span>
        {isDirty && (
          <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
            변경됨
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
          title="실행 취소 (Ctrl+Z)"
        >
          ↩
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
          title="다시 실행 (Ctrl+Shift+Z)"
        >
          ↪
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={onOpenSeo}
          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          SEO 설정
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {isSaving ? "저장 중..." : "저장"}
        </button>

        <button
          type="button"
          onClick={onPublish}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          배포
        </button>
      </div>
    </div>
  );
}
