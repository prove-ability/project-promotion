import type { ComponentDefinition } from "../types";
import { Divider } from "./component";
import { dividerSchema, type DividerProps } from "./schema";

export { Divider } from "./component";
export { dividerSchema, type DividerProps } from "./schema";

export const dividerDefinition: ComponentDefinition<DividerProps> = {
  type: "divider",
  name: "구분선",
  icon: "minus",
  category: "layout",
  schema: dividerSchema,
  defaultProps: {
    color: "#e5e7eb",
    thickness: 1,
    marginY: 16,
  },
  component: Divider,
};
