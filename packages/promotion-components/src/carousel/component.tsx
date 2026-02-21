import type { CarouselProps } from "./schema";

/**
 * CSS-only carousel for published pages (no JS framework dependency).
 * Uses scroll-snap for smooth swiping. Autoplay handled via vanilla JS in tracker.
 */
export function Carousel({
  images,
  height,
  showDots,
  autoPlay,
  autoPlayInterval,
}: CarouselProps) {
  const carouselId = `carousel-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      data-carousel={carouselId}
      data-autoplay={autoPlay}
      data-interval={autoPlayInterval}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        className="carousel-track"
      >
        {images.map((image, i) => {
          const slide = (
            <img
              key={i}
              src={image.src}
              alt={image.alt}
              style={{
                flex: "0 0 100%",
                width: "100%",
                height: `${height}px`,
                objectFit: "cover",
                scrollSnapAlign: "start",
              }}
              loading={i === 0 ? "eager" : "lazy"}
            />
          );

          if (image.link) {
            return (
              <a key={i} href={image.link} target="_blank" rel="noopener noreferrer"
                style={{ flex: "0 0 100%" }}>
                {slide}
              </a>
            );
          }
          return slide;
        })}
      </div>

      {showDots && images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
          }}
        >
          {images.map((_, i) => (
            <span
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
