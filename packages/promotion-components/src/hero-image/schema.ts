import { z } from "zod";

export const heroImageSchema = z.object({
  src: z.string().url(),
  alt: z.string().default(""),
  height: z.number().min(100).max(800).default(400),
  objectFit: z.enum(["cover", "contain", "fill"]).default("cover"),
  link: z.string().url().optional(),
});

export type HeroImageProps = z.infer<typeof heroImageSchema>;
