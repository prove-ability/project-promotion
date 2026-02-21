import type { FooterProps } from "./schema";

export function Footer({ text, links, backgroundColor, textColor }: FooterProps) {
  return (
    <footer
      style={{
        backgroundColor,
        padding: "24px 16px",
        textAlign: "center",
      }}
    >
      {links.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              style={{
                color: textColor,
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      <p style={{ color: textColor, fontSize: "12px", margin: 0 }}>{text}</p>
    </footer>
  );
}
