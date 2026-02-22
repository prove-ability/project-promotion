type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "primary"
  | "danger";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-500",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  primary: "bg-blue-100 text-blue-700",
  danger: "bg-red-100 text-red-700",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
