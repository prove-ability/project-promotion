import type { ComponentDefinition } from "../types";
import { Countdown } from "./component";
import { countdownSchema, type CountdownProps } from "./schema";

export { Countdown } from "./component";
export { countdownSchema, type CountdownProps } from "./schema";

export const countdownDefinition: ComponentDefinition<CountdownProps> = {
  type: "countdown",
  name: "카운트다운",
  icon: "clock",
  category: "interactive",
  schema: countdownSchema,
  defaultProps: {
    targetDate: "2026-12-31T23:59:59",
    expiredText: "이벤트가 종료되었습니다",
    style: "card",
    textColor: "#111827",
    backgroundColor: "#f9fafb",
    showDays: true,
  },
  component: Countdown,
};
