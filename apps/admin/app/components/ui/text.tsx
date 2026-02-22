type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "body-sm"
  | "caption"
  | "label";

type TextColor =
  | "default"
  | "secondary"
  | "muted"
  | "placeholder"
  | "primary"
  | "danger"
  | "success"
  | "warning"
  | "inherit";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  color?: TextColor;
  as?: React.ElementType;
}

const defaultElements: Record<TextVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  "body-sm": "p",
  caption: "span",
  label: "span",
};

const variantStyles: Record<TextVariant, string> = {
  h1: "text-2xl font-bold leading-tight",
  h2: "text-lg font-semibold leading-snug",
  h3: "text-base font-semibold leading-normal",
  body: "text-sm leading-normal",
  "body-sm": "text-xs leading-normal",
  caption: "text-[10px] leading-tight",
  label: "text-sm font-medium leading-normal",
};

const defaultColors: Record<TextVariant, string> = {
  h1: "text-gray-900",
  h2: "text-gray-900",
  h3: "text-gray-900",
  body: "text-gray-600",
  "body-sm": "text-gray-500",
  caption: "text-gray-400",
  label: "text-gray-700",
};

const colorStyles: Record<TextColor, string> = {
  default: "",
  secondary: "text-gray-600",
  muted: "text-gray-500",
  placeholder: "text-gray-400",
  primary: "text-primary",
  danger: "text-danger",
  success: "text-success",
  warning: "text-warning",
  inherit: "text-inherit",
};

export function Text({
  variant = "body",
  color,
  as,
  className,
  children,
  ...props
}: TextProps) {
  const Component = as ?? defaultElements[variant];
  const colorClass = color ? colorStyles[color] : defaultColors[variant];

  return (
    <Component
      className={[variantStyles[variant], colorClass, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
