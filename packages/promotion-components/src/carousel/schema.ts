import { z } from "zod";

export const carouselSchema = z.object({
  images: z
    .array(
      z.object({
        src: z.string().url(),
        alt: z.string().default(""),
        link: z.string().optional(),
      })
    )
    .min(1)
    .default([
      { src: "https://placehold.co/800x400/e2e8f0/94a3b8?text=Slide+1", alt: "" },
      { src: "https://placehold.co/800x400/dbeafe/3b82f6?text=Slide+2", alt: "" },
      { src: "https://placehold.co/800x400/fef3c7/f59e0b?text=Slide+3", alt: "" },
    ]),
  height: z.number().min(100).max(800).default(400),
  autoPlay: z.boolean().default(true),
  autoPlayInterval: z.number().min(1000).max(10000).default(3000),
  showDots: z.boolean().default(true),
});

export type CarouselProps = z.infer<typeof carouselSchema>;
