import { getComponent, type PageComponent } from "@project-promotion/components";
import type { ZodObject, ZodRawShape } from "zod";
import { useT } from "~/lib/i18n";
import { ImageUrlField } from "~/components/ui/image-url-field";
import { Tooltip } from "~/components/ui/tooltip";

const inputBase =
  "w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400";
const inputSmall =
  "w-full px-2 py-1.5 text-xs text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400";

interface PropertyPanelProps {
  component: PageComponent | null;
  onUpdateProps: (componentId: string, props: Record<string, unknown>) => void;
}

export function PropertyPanel({ component, onUpdateProps }: PropertyPanelProps) {
  const { t } = useT();

  if (!component) {
    return (
      <aside className="w-72 bg-white border-l border-gray-200 overflow-y-auto shrink-0">
        <div className="p-4 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 whitespace-pre-line">
            {t("editor.selectToEdit")}
          </p>
        </div>
      </aside>
    );
  }

  const definition = getComponent(component.type);
  if (!definition) return null;

  return (
    <aside className="w-72 bg-white border-l border-gray-200 overflow-y-auto shrink-0">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-sm">
            {iconMap[component.type] ?? "📦"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{definition.name}</p>
            <p className="text-[10px] text-gray-400">{component.type}</p>
          </div>
        </div>

        <SchemaFields
          schema={definition.schema as ZodObject<ZodRawShape>}
          props={component.props}
          onChange={(key, value) =>
            onUpdateProps(component.id, { [key]: value })
          }
        />
      </div>
    </aside>
  );
}

const iconMap: Record<string, string> = {
  "hero-image": "🖼️",
  image: "🌄",
  text: "📝",
  button: "🔘",
  spacer: "↕️",
  divider: "➖",
  carousel: "🎠",
  menu: "☰",
  footer: "🔻",
  countdown: "⏱️",
  "floating-cta": "🎯",
  form: "📋",
};

interface SchemaFieldsProps {
  schema: ZodObject<ZodRawShape>;
  props: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

function SchemaFields({ schema, props, onChange }: SchemaFieldsProps) {
  const { t } = useT();
  const shape = schema.shape;

  return (
    <div className="space-y-4">
      {Object.entries(shape).map(([key, zodType]) => {
        const typeName = getZodTypeName(zodType);
        const value = props[key];
        const label = t(`prop.label.${key}`) !== `prop.label.${key}` ? t(`prop.label.${key}`) : key;
        const hintKey = `prop.hint.${key}`;
        const hint = t(hintKey) !== hintKey ? t(hintKey) : undefined;

        if (typeName === "ZodArray") {
          return (
            <ArrayField
              key={key}
              label={label}
              fieldKey={key}
              value={value as unknown[]}
              onChange={(v) => onChange(key, v)}
            />
          );
        }

        if (typeName === "ZodEnum") {
          const options = getEnumValues(zodType);
          return (
            <FieldWrapper key={key} label={label} hint={hint}>
              <select
                value={String(value ?? "")}
                onChange={(e) => onChange(key, e.target.value)}
                className={inputBase}
              >
                {options.map((opt) => {
                  const enumKey = `prop.enum.${opt}`;
                  const enumLabel = t(enumKey) !== enumKey ? t(enumKey) : opt;
                  return (
                    <option key={opt} value={opt}>{enumLabel}</option>
                  );
                })}
              </select>
            </FieldWrapper>
          );
        }

        if (typeName === "ZodBoolean") {
          return (
            <label key={key} className="flex items-center gap-3 py-1 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) => onChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
            </label>
          );
        }

        if (typeName === "ZodNumber") {
          const numProps = getNumberConstraints(zodType);
          return (
            <FieldWrapper key={key} label={label} hint={hint}>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={numProps.min}
                  max={numProps.max}
                  value={Number(value ?? numProps.min)}
                  onChange={(e) => onChange(key, Number(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none accent-blue-600 cursor-pointer"
                />
                <input
                  type="number"
                  min={numProps.min}
                  max={numProps.max}
                  value={Number(value ?? numProps.min)}
                  onChange={(e) => onChange(key, Number(e.target.value))}
                  className="w-16 px-2 py-1.5 text-xs text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
            </FieldWrapper>
          );
        }

        const isColor =
          key.toLowerCase().includes("color") ||
          key.toLowerCase().includes("background");

        if (typeName === "ZodString" && isColor) {
          const colorValue = String(value ?? "#000000");
          return (
            <FieldWrapper key={key} label={label} hint={hint}>
              <div className="flex items-center gap-2">
                <label className="relative cursor-pointer group/color">
                  <input
                    type="color"
                    value={colorValue}
                    onChange={(e) => onChange(key, e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className="w-9 h-9 rounded-lg border-2 border-gray-200 group-hover/color:border-blue-400 transition-colors shadow-inner"
                    style={{ backgroundColor: colorValue }}
                  />
                </label>
                <input
                  type="text"
                  value={colorValue}
                  onChange={(e) => onChange(key, e.target.value)}
                  className={`flex-1 ${inputBase}`}
                  placeholder="#000000"
                />
              </div>
            </FieldWrapper>
          );
        }

        const isImageUrl = IMAGE_URL_KEYS.has(key);

        if (typeName === "ZodString" && isImageUrl) {
          return (
            <FieldWrapper key={key} label={label} hint={hint}>
              <ImageUrlField
                value={String(value ?? "")}
                onChange={(v) => onChange(key, v)}
                placeholder={hint ?? t("prop.inputPlaceholder", { label })}
              />
            </FieldWrapper>
          );
        }

        if (DATETIME_KEYS.has(key)) {
          return (
            <FieldWrapper key={key} label={label} hint={hint}>
              <input
                type="datetime-local"
                value={String(value ?? "").slice(0, 16)}
                onChange={(e) => onChange(key, e.target.value + ":00")}
                className={inputBase}
              />
            </FieldWrapper>
          );
        }

        if (key === "href" && props.linkType) {
          const lt = String(props.linkType);
          return (
            <FieldWrapper key={key} label={label} hint={hint}>
              <input
                type="text"
                value={String(value ?? "")}
                onChange={(e) => onChange(key, e.target.value)}
                className={inputBase}
                placeholder={LINK_TYPE_PLACEHOLDERS[lt] ?? hint ?? t("prop.inputPlaceholder", { label })}
              />
              {lt === "appScheme" && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {APP_SCHEME_PRESETS.map((p) => (
                    <button
                      key={p.scheme}
                      type="button"
                      onClick={() => onChange(key, p.scheme)}
                      className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded hover:bg-primary-light hover:text-primary transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </FieldWrapper>
          );
        }

        return (
          <FieldWrapper key={key} label={label} hint={hint}>
            <input
              type="text"
              value={String(value ?? "")}
              onChange={(e) => onChange(key, e.target.value)}
              className={inputBase}
              placeholder={hint ?? t("prop.inputPlaceholder", { label })}
            />
          </FieldWrapper>
        );
      })}
    </div>
  );
}

function FieldWrapper({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1.5">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        {hint && (
          <Tooltip content={hint}>
            <span className="text-gray-400 hover:text-gray-600 cursor-help transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
}

const wrapperTypes = new Set(["ZodDefault", "ZodOptional", "ZodNullable"]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getZodTypeName(zodType: any): string {
  const typeName = zodType._def?.typeName;
  if (typeName && wrapperTypes.has(typeName)) {
    return getZodTypeName(zodType._def.innerType);
  }
  if (typeName) return typeName;
  if (zodType._def?.innerType) return getZodTypeName(zodType._def.innerType);
  return "unknown";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEnumValues(zodType: any): string[] {
  if (zodType._def?.values) return zodType._def.values;
  if (zodType._def?.innerType) return getEnumValues(zodType._def.innerType);
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNumberConstraints(zodType: any): { min: number; max: number } {
  const checks = zodType._def?.checks ?? zodType._def?.innerType?._def?.checks ?? [];
  let min = 0;
  let max = 999;
  for (const check of checks) {
    if (check.kind === "min") min = check.value;
    if (check.kind === "max") max = check.value;
  }
  return { min, max };
}

interface ArrayFieldProps {
  label: string;
  fieldKey: string;
  value: unknown[];
  onChange: (value: unknown[]) => void;
}

function ArrayField({ label, fieldKey, value, onChange }: ArrayFieldProps) {
  const { t } = useT();
  const items = Array.isArray(value) ? value : [];

  function addItem() {
    if (fieldKey === "images") {
      onChange([...items, { src: "https://placehold.co/800x400", alt: "", link: "" }]);
    } else if (fieldKey === "fields") {
      const idx = items.length + 1;
      onChange([...items, { name: `field_${idx}`, type: "text", label: `항목 ${idx}`, placeholder: "", required: false, options: "" }]);
    } else if (fieldKey === "items" || fieldKey === "links") {
      onChange([...items, { label: t("prop.newItem"), href: "#" }]);
    } else {
      onChange([...items, ""]);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-600">
          {label}
          <span className="ml-1 text-gray-400 font-normal">({items.length})</span>
        </label>
        <button
          type="button"
          onClick={addItem}
          className="text-[10px] text-blue-600 hover:text-blue-800 font-medium"
        >
          {t("common.add")}
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
            {typeof item === "object" && item !== null
              ? Object.entries(item as Record<string, unknown>).map(([k, v]) => {
                  const subLabel = t(`prop.label.${k}`) !== `prop.label.${k}` ? t(`prop.label.${k}`) : k;
                  const subHintKey = `prop.hint.${k}`;
                  const subHint = t(subHintKey) !== subHintKey ? t(subHintKey) : undefined;
                  const isSubImageUrl = IMAGE_URL_KEYS.has(k);
                  const updateSub = (newVal: unknown) => {
                    const updated = [...items];
                    updated[i] = { ...(updated[i] as Record<string, unknown>), [k]: newVal };
                    onChange(updated);
                  };

                  if (typeof v === "boolean") {
                    return (
                      <label key={k} className="flex items-center gap-2 mb-2 last:mb-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={v}
                          onChange={(e) => updateSub(e.target.checked)}
                          className="accent-blue-600"
                        />
                        <span className="text-[10px] font-medium text-gray-500">{subLabel}</span>
                      </label>
                    );
                  }

                  if (FORM_FIELD_TYPE_OPTIONS[k]) {
                    return (
                      <div key={k} className="mb-2 last:mb-0">
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">{subLabel}</label>
                        <select
                          value={String(v ?? "")}
                          onChange={(e) => updateSub(e.target.value)}
                          className={inputSmall}
                        >
                          {FORM_FIELD_TYPE_OPTIONS[k].map((opt) => {
                            const enumKey = `prop.enum.${opt}`;
                            const enumLabel = t(enumKey) !== enumKey ? t(enumKey) : opt;
                            return <option key={opt} value={opt}>{enumLabel}</option>;
                          })}
                        </select>
                      </div>
                    );
                  }

                  if (k === "options" && (item as Record<string, unknown>).type !== "select") {
                    return null;
                  }

                  return (
                    <div key={k} className="mb-2 last:mb-0">
                      <label className="block text-[10px] font-medium text-gray-500 mb-1">
                        {subLabel}
                      </label>
                      {isSubImageUrl ? (
                        <ImageUrlField
                          value={String(v ?? "")}
                          onChange={(newVal) => updateSub(newVal)}
                          placeholder={subHint ?? t("prop.inputPlaceholder", { label: subLabel })}
                          compact
                        />
                      ) : (
                        <input
                          type="text"
                          value={String(v ?? "")}
                          onChange={(e) => updateSub(e.target.value)}
                          className={inputSmall}
                          placeholder={subHint ?? t("prop.inputPlaceholder", { label: subLabel })}
                        />
                      )}
                    </div>
                  );
                })
              : (
                <input
                  type="text"
                  value={String(item ?? "")}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i] = e.target.value;
                    onChange(updated);
                  }}
                  className={inputSmall}
                />
              )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="mt-1.5 text-[10px] text-red-400 hover:text-red-600 font-medium"
            >
              {t("common.delete")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const IMAGE_URL_KEYS = new Set(["src", "logoSrc", "seoOgImage"]);

const FORM_FIELD_TYPE_OPTIONS: Record<string, string[]> = {
  type: ["text", "email", "phone", "select", "textarea"],
};
const DATETIME_KEYS = new Set(["targetDate"]);

const APP_SCHEME_PRESETS = [
  { label: "카카오톡", scheme: "kakaotalk://" },
  { label: "Instagram", scheme: "instagram://" },
  { label: "LINE", scheme: "line://" },
  { label: "토스", scheme: "supertoss://" },
  { label: "네이버", scheme: "naversearchapp://" },
] as const;

const LINK_TYPE_PLACEHOLDERS: Record<string, string> = {
  url: "https://example.com",
  appScheme: "kakaotalk://",
  tel: "tel:010-1234-5678",
  sms: "sms:010-1234-5678",
  mailto: "mailto:hello@example.com",
};
