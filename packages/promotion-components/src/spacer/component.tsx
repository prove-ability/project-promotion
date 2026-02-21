import type { SpacerProps } from "./schema";

export function Spacer({ height }: SpacerProps) {
  return <div style={{ height: `${height}px` }} aria-hidden="true" />;
}
