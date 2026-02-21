import type { ComponentDefinition } from "../types";
import { Carousel } from "./component";
import { carouselSchema, type CarouselProps } from "./schema";

export { Carousel } from "./component";
export { carouselSchema, type CarouselProps } from "./schema";

export const carouselDefinition: ComponentDefinition<CarouselProps> = {
  type: "carousel",
  name: "캐러셀",
  icon: "layers",
  category: "media",
  schema: carouselSchema,
  defaultProps: {
    images: [
      { src: "https://placehold.co/800x400/e2e8f0/94a3b8?text=Slide+1", alt: "" },
      { src: "https://placehold.co/800x400/dbeafe/3b82f6?text=Slide+2", alt: "" },
      { src: "https://placehold.co/800x400/fef3c7/f59e0b?text=Slide+3", alt: "" },
    ],
    height: 400,
    autoPlay: true,
    autoPlayInterval: 3000,
    showDots: true,
  },
  component: Carousel,
};
