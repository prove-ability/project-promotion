import { z } from "zod";

export const footerSchema = z.object({
  text: z.string().default("© 2026 Company. All rights reserved."),
  links: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
      })
    )
    .default([]),
  backgroundColor: z.string().default("#111827"),
  textColor: z.string().default("#9ca3af"),
});

export type FooterProps = z.infer<typeof footerSchema>;
