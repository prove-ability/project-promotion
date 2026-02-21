import {
  getAllComponents,
  type ComponentCategory,
  type ComponentDefinition,
  type PageComponent,
} from "@project-promotion/components";

const categoryLabels: Record<ComponentCategory, string> = {
  media: "미디어",
  content: "콘텐츠",
  interactive: "인터랙티브",
  navigation: "네비게이션",
  layout: "레이아웃",
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
  const allComponents = getAllComponents();
  const grouped = categoryOrder
    .map((category) => ({
      category,
      label: categoryLabels[category],
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
    <aside className="w-60 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          컴포넌트
        </h2>
        {grouped.map(({ category, label, components }) => (
          <div key={category} className="mb-4">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">
              {label}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {components.map((def) => (
                <button
                  key={def.type}
                  type="button"
                  onClick={() => handleAdd(def)}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                >
                  <span className="text-lg">
                    {iconMap[def.type] ?? "📦"}
                  </span>
                  <span className="text-[11px] text-gray-600 leading-tight">
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
};
