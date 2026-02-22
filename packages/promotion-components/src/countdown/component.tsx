import type { CountdownProps } from "./schema";

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({
  targetDate,
  expiredText,
  style,
  textColor,
  backgroundColor,
  showDays,
}: CountdownProps) {
  const time = getTimeLeft(targetDate);
  const isExpired = !time;

  const containerStyle: React.CSSProperties = {
    padding: "24px 16px",
    textAlign: "center",
    color: textColor,
    backgroundColor,
  };

  if (isExpired) {
    return (
      <div style={containerStyle}>
        <p style={{ fontSize: "16px", fontWeight: 500 }}>{expiredText}</p>
      </div>
    );
  }

  const units = [
    ...(showDays ? [{ value: time.days, label: "일" }] : []),
    { value: time.hours, label: "시" },
    { value: time.minutes, label: "분" },
    { value: time.seconds, label: "초" },
  ];

  if (style === "minimal") {
    const text = units
      .map((u) => `${pad(u.value)}${u.label}`)
      .join(" ");
    return (
      <div style={containerStyle}>
        <p
          data-countdown={targetDate}
          data-expired-text={expiredText}
          data-show-days={showDays}
          data-style={style}
          style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "2px", fontVariantNumeric: "tabular-nums" }}
        >
          {text}
        </p>
      </div>
    );
  }

  if (style === "flip") {
    return (
      <div
        style={containerStyle}
        data-countdown={targetDate}
        data-expired-text={expiredText}
        data-show-days={showDays}
        data-style={style}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {units.map((u, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "72px",
                  background: textColor === "#111827" ? "#1f2937" : textColor,
                  color: backgroundColor === "#f9fafb" ? "#ffffff" : backgroundColor,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pad(u.value)}
              </div>
              <span style={{ fontSize: "12px", marginTop: "4px", opacity: 0.6 }}>{u.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={containerStyle}
      data-countdown={targetDate}
      data-expired-text={expiredText}
      data-show-days={showDays}
      data-style={style}
    >
      <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
        {units.map((u, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 700,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {pad(u.value)}
            </span>
            <span style={{ fontSize: "12px", marginTop: "4px", opacity: 0.6 }}>{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
