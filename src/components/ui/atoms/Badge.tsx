import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "purple" | "success" | "warning" | "danger" | "info";
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", dot = false, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          "bg-neutralBadge-bg text-neutralBadge": variant === "default",
          "bg-accent-tint2 text-accent-deep": variant === "purple",
          "bg-success-bg text-success": variant === "success",
          "bg-warning-bg text-warning": variant === "warning",
          "bg-danger-bg text-danger": variant === "danger",
          "bg-info-bg text-info": variant === "info",
        },
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-success": variant === "success",
            "bg-warning": variant === "warning",
            "bg-danger": variant === "danger",
            "bg-info": variant === "info",
            "bg-accent": variant === "purple",
            "bg-neutralBadge": variant === "default",
          })}
        />
      )}
      {children}
    </span>
  );
}
