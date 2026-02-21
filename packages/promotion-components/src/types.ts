import type { ZodType, ZodTypeDef } from "zod";

export type ComponentCategory =
  | "layout"
  | "content"
  | "media"
  | "interactive"
  | "navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ComponentDefinition<P = any> {
  type: string;
  name: string;
  icon: string;
  category: ComponentCategory;
  schema: ZodType<P, ZodTypeDef, unknown>;
  defaultProps: P;
  component: React.ComponentType<P>;
}

export interface PageComponent {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: PageComponent[];
}

export interface PageData {
  version: number;
  components: PageComponent[];
}
