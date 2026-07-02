import { cn } from "@/lib/utils";

type StatusColor = "success" | "warning" | "danger" | "info" | "default";

interface StatusDotProps {
  color: StatusColor;
  className?: string;
}

const colorClasses: Record<StatusColor, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  default: "bg-text-secondary",
};

export function StatusDot({ color, className }: StatusDotProps) {
  return (
    <span
      className={cn("inline-block h-2 w-2 rounded-full", colorClasses[color], className)}
      aria-hidden="true"
    />
  );
}
