import type { ComponentDefinition } from "../types";
import { Spacer } from "./component";
import { spacerSchema, type SpacerProps } from "./schema";

export { Spacer } from "./component";
export { spacerSchema, type SpacerProps } from "./schema";

export const spacerDefinition: ComponentDefinition<SpacerProps> = {
  type: "spacer",
  name: "여백",
  icon: "minus",
  category: "layout",
  schema: spacerSchema,
  defaultProps: { height: 32 },
  component: Spacer,
};
