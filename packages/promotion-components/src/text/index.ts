import type { ComponentDefinition } from "../types";
import { Text } from "./component";
import { textSchema, type TextProps } from "./schema";

export { Text } from "./component";
export { textSchema, type TextProps } from "./schema";

export const textDefinition: ComponentDefinition<TextProps> = {
  type: "text",
  name: "텍스트",
  icon: "type",
  category: "content",
  schema: textSchema,
  defaultProps: {
    content: "텍스트를 입력하세요",
    tag: "p",
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "left",
    color: "#000000",
    paddingX: 16,
    paddingY: 8,
  },
  component: Text,
};
