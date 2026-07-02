import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  background?: "default" | "tint";
  className?: string;
}

export function StatTile({ label, value, background = "default", className }: StatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg p-3",
        background === "tint" ? "bg-bg" : "bg-surface",
        className
      )}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </span>
      <span className="text-base font-semibold text-text-primary">{value}</span>
    </div>
  );
}
