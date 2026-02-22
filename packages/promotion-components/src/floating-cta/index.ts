import type { ComponentDefinition } from "../types";
import { FloatingCta } from "./component";
import { floatingCtaSchema, type FloatingCtaProps } from "./schema";

export { FloatingCta } from "./component";
export { floatingCtaSchema, type FloatingCtaProps } from "./schema";

export const floatingCtaDefinition: ComponentDefinition<FloatingCtaProps> = {
  type: "floating-cta",
  name: "플로팅 버튼",
  icon: "target",
  category: "interactive",
  schema: floatingCtaSchema,
  defaultProps: {
    text: "지금 바로 시작하기",
    linkType: "url",
    position: "bottom-center",
    backgroundColor: "#2563eb",
    textColor: "#ffffff",
    borderRadius: 24,
    icon: "none",
  },
  component: FloatingCta,
};
