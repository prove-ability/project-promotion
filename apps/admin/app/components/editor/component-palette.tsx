import {
  getAllComponents,
  type ComponentCategory,
  type ComponentDefinition,
  type PageComponent,
} from "@project-promotion/components";
import { useT } from "~/lib/i18n";

const CATEGORY_KEYS: Record<ComponentCategory, string> = {
  media: "palette.media",
  content: "palette.content",
  interactive: "palette.interactive",
  navigation: "palette.navigation",
  layout: "palette.layout",
};

const categoryOrder: ComponentCategory[] = [
  "media",
  "content",
  "interactive",
  "navigation",
  "layout",
];

interface ComponentPaletteProps {
  onAddComponent: (component: PageComponent) => void;
}

export function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  const { t } = useT();
  const allComponents = getAllComponents();
  const grouped = categoryOrder
    .map((category) => ({
      category,
      label: t(CATEGORY_KEYS[category]),
      components: allComponents.filter((c) => c.category === category),
    }))
    .filter((g) => g.components.length > 0);

  function handleAdd(definition: ComponentDefinition) {
    const component: PageComponent = {
      id: `comp_${crypto.randomUUID().slice(0, 8)}`,
      type: definition.type,
      props: { ...definition.defaultProps },
    };
    onAddComponent(component);
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
      <div className="p-3">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
          {t("editor.components")}
        </h2>
        {grouped.map(({ category, label, components }) => (
          <div key={category} className="mb-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
              {label}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {components.map((def) => (
                <button
                  key={def.type}
                  type="button"
                  onClick={() => handleAdd(def)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm active:scale-95 transition-all text-center group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {iconMap[def.type] ?? "📦"}
                  </span>
                  <span className="text-[11px] text-gray-600 leading-tight group-hover:text-blue-700">
                    {def.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
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
