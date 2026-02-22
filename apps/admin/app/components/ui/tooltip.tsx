import { useState, useRef, useEffect, type ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setVisible(true), 300);
  };
  const hide = () => {
    clearTimeout(timeout.current);
    setVisible(false);
  };

  useEffect(() => () => clearTimeout(timeout.current), []);

  const posClass =
    position === "bottom"
      ? "top-full mt-1.5"
      : "bottom-full mb-1.5";

  return (
    <div
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`absolute left-1/2 -translate-x-1/2 ${posClass} z-50 px-2.5 py-1.5 text-[11px] text-white bg-gray-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none max-w-[220px] text-center leading-relaxed`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
