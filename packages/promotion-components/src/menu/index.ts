import type { ComponentDefinition } from "../types";
import { Menu } from "./component";
import { menuSchema, type MenuProps } from "./schema";

export { Menu } from "./component";
export { menuSchema, type MenuProps } from "./schema";

export const menuDefinition: ComponentDefinition<MenuProps> = {
  type: "menu",
  name: "메뉴/헤더",
  icon: "menu",
  category: "navigation",
  schema: menuSchema,
  defaultProps: {
    logoText: "Brand",
    items: [],
    backgroundColor: "#ffffff",
    textColor: "#111827",
  },
  component: Menu,
};
