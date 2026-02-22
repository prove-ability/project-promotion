import { useState, useRef } from "react";
import { useT } from "~/lib/i18n";

const inputBase =
  "w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400";
const inputSmall =
  "w-full px-2 py-1.5 text-xs text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400";

interface ImageUrlFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export function ImageUrlField({
  value,
  onChange,
  placeholder,
  compact,
}: ImageUrlFieldProps) {
  const { t } = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputCls = compact ? inputSmall : inputBase;

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload-image", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? t("prop.uploadFailed"));
        return;
      }
      onChange(data.url);
    } catch {
      setError(t("prop.uploadFailed"));
    } finally {
      setUploading(false);
    }
  }

  const showPreview =
    value && !value.startsWith("https://placehold.co") && !value.startsWith("data:");

  return (
    <div>
      {showPreview && (
        <div className="mb-1.5 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={value}
            alt=""
            className="w-full h-20 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 ${inputCls}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className={[
            "shrink-0 px-2 rounded-lg border transition-colors",
            compact ? "py-1" : "py-2",
            uploading
              ? "border-gray-200 text-gray-300 cursor-wait"
              : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary",
          ].join(" ")}
          title={t("prop.uploadImage")}
        >
          {uploading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
      {error && <p className="text-[10px] text-danger mt-1">{error}</p>}
    </div>
  );
}
