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
import React, { useEffect } from "react";

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
      className={`relative group ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Drag handle + controls overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between bg-blue-500 text-white text-[11px] px-2 py-0.5">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            ⠿ {definition.name}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="hover:text-red-200 ml-2"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Component render */}
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
            <p className="text-lg mb-2">빈 캔버스</p>
            <p className="text-sm">
              왼쪽 팔레트에서 컴포넌트를 추가하세요
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
