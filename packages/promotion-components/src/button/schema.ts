import { z } from "zod";

export const buttonSchema = z.object({
  text: z.string().default("버튼"),
  href: z.string().url().optional(),
  variant: z.enum(["primary", "secondary", "outline"]).default("primary"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
  fullWidth: z.boolean().default(false),
  backgroundColor: z.string().default("#2563eb"),
  textColor: z.string().default("#ffffff"),
  borderRadius: z.number().min(0).max(32).default(8),
});

export type ButtonProps = z.infer<typeof buttonSchema>;
