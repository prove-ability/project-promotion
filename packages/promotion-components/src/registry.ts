import type { ComponentDefinition } from "./types";

const registry = new Map<string, ComponentDefinition>();

export function registerComponent(definition: ComponentDefinition): void {
  registry.set(definition.type, definition);
}

export function getComponent(type: string): ComponentDefinition | undefined {
  return registry.get(type);
}

export function getAllComponents(): ComponentDefinition[] {
  return Array.from(registry.values());
}

export function getComponentsByCategory(
  category: ComponentDefinition["category"]
): ComponentDefinition[] {
  return getAllComponents().filter((c) => c.category === category);
}
