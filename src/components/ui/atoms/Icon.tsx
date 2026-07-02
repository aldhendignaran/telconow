import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconSize = "sm" | "md" | "lg";
type IconColor =
  | "primary"
  | "secondary"
  | "inverse"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "onDarkMuted";

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: IconColor;
  className?: string;
  "aria-label"?: string;
}

const sizeMap: Record<IconSize, number> = { sm: 16, md: 20, lg: 24 };

const colorClasses: Record<IconColor, string> = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  inverse: "text-text-inverse",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  onDarkMuted: "text-text-onDarkMuted",
};

export function Icon({
  icon: IconComponent,
  size = "md",
  color = "primary",
  className,
  "aria-label": ariaLabel,
}: IconProps) {
  const px = sizeMap[size];
  return (
    <IconComponent
      width={px}
      height={px}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      className={cn(colorClasses[color], className)}
    />
  );
}
