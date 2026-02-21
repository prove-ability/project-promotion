import { z } from "zod";

export const spacerSchema = z.object({
  height: z.number().min(4).max(200).default(32),
});

export type SpacerProps = z.infer<typeof spacerSchema>;
