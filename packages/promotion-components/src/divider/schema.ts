import { z } from "zod";

export const dividerSchema = z.object({
  color: z.string().default("#e5e7eb"),
  thickness: z.number().min(1).max(8).default(1),
  marginY: z.number().min(0).max(64).default(16),
});

export type DividerProps = z.infer<typeof dividerSchema>;
