import type { ImageProps } from "./schema";

const widthMap = {
  full: "100%",
  lg: "80%",
  md: "60%",
  sm: "40%",
};

export function Image({ src, alt, width, borderRadius, link }: ImageProps) {
  const img = (
    <img
      src={src}
      alt={alt}
      style={{
        width: widthMap[width],
        borderRadius: `${borderRadius}px`,
        display: "block",
        margin: "0 auto",
      }}
      loading="lazy"
    />
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {img}
      </a>
    );
  }

  return img;
}
