import type { ComponentDefinition } from "../types";
import { HeroImage } from "./component";
import { heroImageSchema, type HeroImageProps } from "./schema";

export { HeroImage } from "./component";
export { heroImageSchema, type HeroImageProps } from "./schema";

export const heroImageDefinition: ComponentDefinition<HeroImageProps> = {
  type: "hero-image",
  name: "히어로 이미지",
  icon: "image",
  category: "media",
  schema: heroImageSchema,
  defaultProps: {
    src: "https://placehold.co/800x400/e2e8f0/94a3b8?text=Hero+Image",
    alt: "",
    height: 400,
    objectFit: "cover",
  },
  component: HeroImage,
};
