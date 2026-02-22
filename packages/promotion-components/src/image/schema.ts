import { z } from "zod";

export const imageSchema = z.object({
  src: z.string().url(),
  alt: z.string().default(""),
  width: z.enum(["full", "lg", "md", "sm"]).default("full"),
  borderRadius: z.number().min(0).max(32).default(0),
  link: z.string().optional(),
});

export type ImageProps = z.infer<typeof imageSchema>;
