import { z } from "zod";

export const textSchema = z.object({
  content: z.string().default("텍스트를 입력하세요"),
  tag: z.enum(["p", "h1", "h2", "h3", "span"]).default("p"),
  fontSize: z.number().min(10).max(72).default(16),
  fontWeight: z
    .enum(["normal", "medium", "semibold", "bold"])
    .default("normal"),
  textAlign: z.enum(["left", "center", "right"]).default("left"),
  color: z.string().default("#000000"),
  paddingX: z.number().min(0).max(64).default(16),
  paddingY: z.number().min(0).max(64).default(8),
});

export type TextProps = z.infer<typeof textSchema>;
