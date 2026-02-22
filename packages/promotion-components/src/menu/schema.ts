import { z } from "zod";

export const menuSchema = z.object({
  logoSrc: z.string().optional(),
  logoText: z.string().default("Brand"),
  items: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
      })
    )
    .default([]),
  backgroundColor: z.string().default("#ffffff"),
  textColor: z.string().default("#111827"),
});

export type MenuProps = z.infer<typeof menuSchema>;
