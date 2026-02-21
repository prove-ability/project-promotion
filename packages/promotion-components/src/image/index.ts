import type { ComponentDefinition } from "../types";
import { Image } from "./component";
import { imageSchema, type ImageProps } from "./schema";

export { Image } from "./component";
export { imageSchema, type ImageProps } from "./schema";

export const imageDefinition: ComponentDefinition<ImageProps> = {
  type: "image",
  name: "이미지",
  icon: "photo",
  category: "media",
  schema: imageSchema,
  defaultProps: {
    src: "https://placehold.co/600x400/e2e8f0/94a3b8?text=Image",
    alt: "",
    width: "full",
    borderRadius: 0,
  },
  component: Image,
};
