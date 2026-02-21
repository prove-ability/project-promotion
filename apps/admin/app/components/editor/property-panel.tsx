import { getComponent, type PageComponent } from "@project-promotion/components";
import type { ZodObject, ZodRawShape } from "zod";
import { useState } from "react";

interface PropertyPanelProps {
  component: PageComponent | null;
  onUpdateProps: (componentId: string, props: Record<string, unknown>) => void;
}

export function PropertyPanel({ component, onUpdateProps }: PropertyPanelProps) {
  if (!component) {
    return (
      <aside className="w-72 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            속성
          </h2>
          <p className="text-sm text-gray-400">
            컴포넌트를 선택하면 속성을 편집할 수 있습니다.
          </p>
        </div>
      </aside>
    );
  }

  const definition = getComponent(component.type);
  if (!definition) return null;

  return (
    <aside className="w-72 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          속성
        </h2>
        <p className="text-sm font-medium text-gray-800 mb-4">
          {definition.name}
        </p>

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

interface SchemaFieldsProps {
  schema: ZodObject<ZodRawShape>;
  props: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

function SchemaFields({ schema, props, onChange }: SchemaFieldsProps) {
  const shape = schema.shape;

  return (
    <div className="space-y-3">
      {Object.entries(shape).map(([key, zodType]) => {
        const typeName = getZodTypeName(zodType);
        const value = props[key];

        if (typeName === "ZodArray") {
          return (
            <ArrayField
              key={key}
              label={key}
              value={value as unknown[]}
              onChange={(v) => onChange(key, v)}
            />
          );
        }

        if (typeName === "ZodEnum") {
          const options = getEnumValues(zodType);
          return (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1">{key}</label>
              <select
                value={String(value ?? "")}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (typeName === "ZodBoolean") {
          return (
            <div key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => onChange(key, e.target.checked)}
                className="rounded"
              />
              <label className="text-xs text-gray-500">{key}</label>
            </div>
          );
        }

        if (typeName === "ZodNumber") {
          return (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1">{key}</label>
              <input
                type="number"
                value={Number(value ?? 0)}
                onChange={(e) => onChange(key, Number(e.target.value))}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md"
              />
            </div>
          );
        }

        if (
          typeName === "ZodString" &&
          (key.toLowerCase().includes("color") ||
            key.toLowerCase().includes("background"))
        ) {
          return (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1">{key}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={String(value ?? "#000000")}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={String(value ?? "")}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-md"
                />
              </div>
            </div>
          );
        }

        return (
          <div key={key}>
            <label className="block text-xs text-gray-500 mb-1">{key}</label>
            <input
              type="text"
              value={String(value ?? "")}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md"
            />
          </div>
        );
      })}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getZodTypeName(zodType: any): string {
  if (zodType._def?.typeName) return zodType._def.typeName;
  if (zodType._def?.innerType) return getZodTypeName(zodType._def.innerType);
  return "unknown";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEnumValues(zodType: any): string[] {
  if (zodType._def?.values) return zodType._def.values;
  if (zodType._def?.innerType) return getEnumValues(zodType._def.innerType);
  return [];
}

interface ArrayFieldProps {
  label: string;
  value: unknown[];
  onChange: (value: unknown[]) => void;
}

function ArrayField({ label, value, onChange }: ArrayFieldProps) {
  const items = Array.isArray(value) ? value : [];

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">
        {label} ({items.length}개)
      </label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="p-2 border border-gray-100 rounded-md text-xs">
            {typeof item === "object" && item !== null
              ? Object.entries(item as Record<string, unknown>).map(
                  ([k, v]) => (
                    <div key={k} className="mb-1">
                      <label className="text-gray-400">{k}: </label>
                      <input
                        type="text"
                        value={String(v ?? "")}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...(updated[i] as Record<string, unknown>), [k]: e.target.value };
                          onChange(updated);
                        }}
                        className="w-full px-1 py-0.5 border border-gray-200 rounded text-xs"
                      />
                    </div>
                  )
                )
              : String(item)}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-red-400 text-[10px] mt-1"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
