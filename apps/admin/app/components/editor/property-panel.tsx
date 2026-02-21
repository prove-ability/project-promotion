import { getComponent, type PageComponent } from "@project-promotion/components";
import type { ZodObject, ZodRawShape } from "zod";

const fieldLabels: Record<string, string> = {
  src: "이미지 URL",
  alt: "대체 텍스트",
  height: "높이",
  width: "너비",
  objectFit: "맞춤",
  link: "링크 URL",
  content: "내용",
  text: "텍스트",
  tag: "HTML 태그",
  fontSize: "글자 크기",
  fontWeight: "글자 두께",
  textAlign: "정렬",
  color: "글자 색",
  textColor: "글자 색",
  backgroundColor: "배경 색",
  paddingX: "좌우 여백",
  paddingY: "상하 여백",
  href: "링크 URL",
  variant: "스타일",
  size: "크기",
  fullWidth: "전체 너비",
  borderRadius: "모서리 둥글기",
  images: "이미지 목록",
  autoPlay: "자동 재생",
  autoPlayInterval: "재생 간격(ms)",
  showDots: "인디케이터 표시",
  thickness: "두께",
  marginY: "상하 여백",
  logoSrc: "로고 이미지 URL",
  logoText: "로고 텍스트",
  items: "메뉴 항목",
  links: "링크 목록",
  label: "라벨",
};

const fieldHints: Record<string, string> = {
  src: "이미지 주소를 입력하세요",
  alt: "이미지를 설명하는 텍스트 (접근성)",
  link: "클릭 시 이동할 URL",
  href: "클릭 시 이동할 URL",
  content: "표시할 텍스트 내용",
  text: "버튼에 표시할 텍스트",
  seoTitle: "검색엔진에 표시될 제목",
  backgroundColor: "배경 색상",
  textColor: "텍스트 색상",
  color: "색상",
  logoSrc: "비워두면 텍스트 로고만 표시",
  autoPlayInterval: "밀리초 단위 (1000 = 1초)",
};

const inputBase =
  "w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400";
const inputSmall =
  "w-full px-2 py-1.5 text-xs text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400";

interface PropertyPanelProps {
  component: PageComponent | null;
  onUpdateProps: (componentId: string, props: Record<string, unknown>) => void;
}

export function PropertyPanel({ component, onUpdateProps }: PropertyPanelProps) {
  if (!component) {
    return (
      <aside className="w-72 bg-white border-l border-gray-200 overflow-y-auto shrink-0">
        <div className="p-4 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">
            컴포넌트를 선택하면<br />속성을 편집할 수 있습니다
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
};

interface SchemaFieldsProps {
  schema: ZodObject<ZodRawShape>;
  props: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

function SchemaFields({ schema, props, onChange }: SchemaFieldsProps) {
  const shape = schema.shape;

  return (
    <div className="space-y-4">
      {Object.entries(shape).map(([key, zodType]) => {
        const typeName = getZodTypeName(zodType);
        const value = props[key];
        const label = fieldLabels[key] ?? key;
        const hint = fieldHints[key];

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
                {options.map((opt) => (
                  <option key={opt} value={opt}>{enumLabels[opt] ?? opt}</option>
                ))}
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

        return (
          <FieldWrapper key={key} label={label} hint={hint}>
            <input
              type="text"
              value={String(value ?? "")}
              onChange={(e) => onChange(key, e.target.value)}
              className={inputBase}
              placeholder={hint ?? `${label} 입력`}
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
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const enumLabels: Record<string, string> = {
  cover: "채우기 (Cover)",
  contain: "맞추기 (Contain)",
  fill: "늘리기 (Fill)",
  primary: "기본 (Primary)",
  secondary: "보조 (Secondary)",
  outline: "외곽선 (Outline)",
  sm: "작게",
  md: "보통",
  lg: "크게",
  full: "전체",
  p: "본문 (p)",
  h1: "제목 1 (h1)",
  h2: "제목 2 (h2)",
  h3: "제목 3 (h3)",
  span: "인라인 (span)",
  left: "왼쪽",
  center: "가운데",
  right: "오른쪽",
  normal: "보통",
  bold: "굵게",
  light: "얇게",
};

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
  const items = Array.isArray(value) ? value : [];

  function addItem() {
    if (fieldKey === "images") {
      onChange([...items, { src: "https://placehold.co/800x400", alt: "", link: "" }]);
    } else if (fieldKey === "items" || fieldKey === "links") {
      onChange([...items, { label: "새 항목", href: "#" }]);
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
          + 추가
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
            {typeof item === "object" && item !== null
              ? Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                  <div key={k} className="mb-2 last:mb-0">
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">
                      {fieldLabels[k] ?? k}
                    </label>
                    <input
                      type="text"
                      value={String(v ?? "")}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...(updated[i] as Record<string, unknown>), [k]: e.target.value };
                        onChange(updated);
                      }}
                      className={inputSmall}
                      placeholder={fieldHints[k] ?? `${fieldLabels[k] ?? k} 입력`}
                    />
                  </div>
                ))
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
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
