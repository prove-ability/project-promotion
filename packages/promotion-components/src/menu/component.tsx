import type { MenuProps } from "./schema";

export function Menu({
  logoSrc,
  logoText,
  items,
  backgroundColor,
  textColor,
}: MenuProps) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        backgroundColor,
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {logoSrc && (
          <img
            src={logoSrc}
            alt={logoText}
            style={{ height: "32px", width: "auto" }}
          />
        )}
        <span style={{ fontWeight: 700, fontSize: "18px", color: textColor }}>
          {logoText}
        </span>
      </div>

      {items.length > 0 && (
        <div style={{ display: "flex", gap: "16px" }}>
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              style={{
                color: textColor,
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
