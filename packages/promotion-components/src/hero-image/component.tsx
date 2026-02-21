import type { HeroImageProps } from "./schema";

export function HeroImage({ src, alt, height, objectFit, link }: HeroImageProps) {
  const img = (
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height: `${height}px`,
        objectFit,
        display: "block",
      }}
      loading="eager"
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
