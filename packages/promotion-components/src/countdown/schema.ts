import { z } from "zod";

export const countdownSchema = z.object({
  targetDate: z.string().default("2026-12-31T23:59:59"),
  expiredText: z.string().default("이벤트가 종료되었습니다"),
  style: z.enum(["minimal", "card", "flip"]).default("card"),
  textColor: z.string().default("#111827"),
  backgroundColor: z.string().default("#f9fafb"),
  showDays: z.boolean().default(true),
});

export type CountdownProps = z.infer<typeof countdownSchema>;
