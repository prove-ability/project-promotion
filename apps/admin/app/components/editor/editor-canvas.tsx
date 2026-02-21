import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  getComponent,
  setupComponents,
  type PageComponent,
} from "@project-promotion/components";
import React from "react";

setupComponents();

interface SortableItemProps {
  component: PageComponent;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function SortableItem({
  component,
  isSelected,
  onSelect,
  onRemove,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const definition = getComponent(component.type);
  if (!definition) return null;

  const Component = definition.component;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group cursor-pointer ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="absolute top-0 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-sm text-white text-[11px] px-2 py-1 rounded-b-md">
          <button
            {...attributes}
            {...listeners}
            className="flex items-center gap-1 cursor-grab active:cursor-grabbing"
          >
            <svg className="w-3.5 h-3.5 opacity-60" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
              <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
              <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
            </svg>
            {definition.name}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-0.5 hover:bg-white/20 rounded transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pointer-events-none">
        <Component {...component.props} />
      </div>
    </div>
  );
}

interface EditorCanvasProps {
  components: PageComponent[];
  selectedComponentId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
}

export function EditorCanvas({
  components,
  selectedComponentId,
  onSelect,
  onMove,
  onRemove,
}: EditorCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = components.findIndex((c) => c.id === active.id);
    const toIndex = components.findIndex((c) => c.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      onMove(fromIndex, toIndex);
    }
  }

  return (
    <div
      className="flex-1 bg-gray-100 p-6 overflow-y-auto"
      onClick={() => onSelect(null)}
    >
      <div className="max-w-[480px] mx-auto bg-white min-h-[640px] shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[640px] text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">빈 캔버스</p>
            <p className="text-xs text-gray-400">
              왼쪽 팔레트에서 컴포넌트를 드래그하여 추가하세요
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={components.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {components.map((component) => (
                <SortableItem
                  key={component.id}
                  component={component}
                  isSelected={selectedComponentId === component.id}
                  onSelect={() => onSelect(component.id)}
                  onRemove={() => onRemove(component.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
