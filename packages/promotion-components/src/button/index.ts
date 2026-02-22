import type { ComponentDefinition } from "../types";
import { Button } from "./component";
import { buttonSchema, type ButtonProps } from "./schema";

export { Button } from "./component";
export { buttonSchema, type ButtonProps } from "./schema";

export const buttonDefinition: ComponentDefinition<ButtonProps> = {
  type: "button",
  name: "버튼",
  icon: "mouse-pointer",
  category: "interactive",
  schema: buttonSchema,
  defaultProps: {
    text: "버튼",
    linkType: "url",
    variant: "primary",
    size: "md",
    fullWidth: false,
    backgroundColor: "#2563eb",
    textColor: "#ffffff",
    borderRadius: 8,
  },
  component: Button,
};
