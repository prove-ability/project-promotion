import type { FloatingCtaProps } from "./schema";

const ICONS: Record<string, string> = {
  cart: "🛒",
  phone: "📞",
  arrow: "→",
  chat: "💬",
};

export function FloatingCta({
  text,
  linkType = "url",
  href,
  position,
  backgroundColor,
  textColor,
  borderRadius,
  icon,
}: FloatingCtaProps) {
  const isCenter = position === "bottom-center";
  const iconText = icon !== "none" ? ICONS[icon] ?? "" : "";

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px 28px",
    backgroundColor,
    color: textColor,
    borderRadius: `${borderRadius}px`,
    fontSize: "16px",
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
    whiteSpace: "nowrap",
  };

  const wrapperStyle: React.CSSProperties = {
    textAlign: isCenter ? "center" : "right",
    padding: "16px",
  };

  const content = (
    <>
      {iconText && <span>{iconText}</span>}
      {text}
    </>
  );

  const openInNewTab = linkType === "url";

  if (href) {
    return (
      <div data-floating-cta data-position={position} style={wrapperStyle}>
        <a
          href={href}
          {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          style={style}
        >
          {content}
        </a>
      </div>
    );
  }

  return (
    <div data-floating-cta data-position={position} style={wrapperStyle}>
      <button type="button" style={style}>
        {content}
      </button>
    </div>
  );
}
