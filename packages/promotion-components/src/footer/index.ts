import type { ComponentDefinition } from "../types";
import { Footer } from "./component";
import { footerSchema, type FooterProps } from "./schema";

export { Footer } from "./component";
export { footerSchema, type FooterProps } from "./schema";

export const footerDefinition: ComponentDefinition<FooterProps> = {
  type: "footer",
  name: "푸터",
  icon: "align-bottom",
  category: "navigation",
  schema: footerSchema,
  defaultProps: {
    text: "© 2026 Company. All rights reserved.",
    links: [],
    backgroundColor: "#111827",
    textColor: "#9ca3af",
  },
  component: Footer,
};
