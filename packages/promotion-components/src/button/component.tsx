import type { ButtonProps } from "./schema";

const sizeStyles = {
  sm: { padding: "8px 16px", fontSize: "14px" },
  md: { padding: "12px 24px", fontSize: "16px" },
  lg: { padding: "16px 32px", fontSize: "18px" },
};

export function Button({
  text,
  linkType = "url",
  href,
  variant,
  size,
  fullWidth,
  backgroundColor,
  textColor,
  borderRadius,
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: fullWidth ? "block" : "inline-block",
    width: fullWidth ? "100%" : "auto",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: 600,
    cursor: "pointer",
    border: variant === "outline" ? `2px solid ${backgroundColor}` : "none",
    borderRadius: `${borderRadius}px`,
    ...sizeStyles[size],
    backgroundColor: variant === "outline" ? "transparent" : backgroundColor,
    color: variant === "outline" ? backgroundColor : textColor,
    margin: "8px auto",
    boxSizing: "border-box",
  };

  const openInNewTab = linkType === "url";

  if (href) {
    return (
      <div style={{ textAlign: "center", padding: "8px 16px" }}>
        <a
          href={href}
          {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          style={baseStyle}
        >
          {text}
        </a>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "8px 16px" }}>
      <button type="button" style={baseStyle}>
        {text}
      </button>
    </div>
  );
}
