import type { DividerProps } from "./schema";

export function Divider({ color, thickness, marginY }: DividerProps) {
  return (
    <hr
      style={{
        border: "none",
        borderTop: `${thickness}px solid ${color}`,
        margin: `${marginY}px 16px`,
      }}
    />
  );
}
