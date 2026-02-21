import type { TextProps } from "./schema";

const fontWeightMap = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export function Text({
  content,
  tag: Tag,
  fontSize,
  fontWeight,
  textAlign,
  color,
  paddingX,
  paddingY,
}: TextProps) {
  return (
    <Tag
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: fontWeightMap[fontWeight],
        textAlign,
        color,
        padding: `${paddingY}px ${paddingX}px`,
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      {content}
    </Tag>
  );
}
