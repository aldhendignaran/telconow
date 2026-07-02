import { cn } from "@/lib/utils";

type TextVariant = "body" | "body-sm" | "caption" | "label";
type TextColor = "primary" | "secondary" | "inverse" | "onDarkMuted";

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  as?: "p" | "span" | "div";
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<TextVariant, string> = {
  body: "text-base font-normal",
  "body-sm": "text-sm font-normal",
  caption: "text-xs",
  label: "text-xs font-medium uppercase tracking-wide",
};

const colorClasses: Record<TextColor, string> = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  inverse: "text-text-inverse",
  onDarkMuted: "text-text-onDarkMuted",
};

export function Text({ variant = "body", color = "primary", as: Tag = "p", children, className }: TextProps) {
  return (
    <Tag className={cn(variantClasses[variant], colorClasses[color], className)}>
      {children}
    </Tag>
  );
}
