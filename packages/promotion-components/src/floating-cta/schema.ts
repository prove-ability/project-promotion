import { z } from "zod";

export const floatingCtaSchema = z.object({
  text: z.string().default("지금 바로 시작하기"),
  linkType: z
    .enum(["url", "appScheme", "tel", "sms", "mailto"])
    .default("url"),
  href: z.string().optional(),
  position: z.enum(["bottom-center", "bottom-right"]).default("bottom-center"),
  backgroundColor: z.string().default("#2563eb"),
  textColor: z.string().default("#ffffff"),
  borderRadius: z.number().min(0).max(32).default(24),
  icon: z.enum(["none", "cart", "phone", "arrow", "chat"]).default("none"),
});

export type FloatingCtaProps = z.infer<typeof floatingCtaSchema>;
