import { cn } from "@/lib/utils";

type ProgressBarVariant = "default" | "warning";

interface ProgressBarProps {
  percent: number;
  variant?: ProgressBarVariant;
  className?: string;
}

export function ProgressBar({ percent, variant = "default", className }: ProgressBarProps) {
  const width = Math.min(Math.max(percent, 0), 100);
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-border", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-[width]",
          variant === "warning" ? "bg-warning-accent" : "bg-accent"
        )}
        style={{ width: `${width}%` }}
        role="progressbar"
        aria-valuenow={width}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
