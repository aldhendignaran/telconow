import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  heading: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, heading, align = "left", className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2", align === "center" && "items-center text-center", className)}>
      {eyebrow && (
        <span className="text-xs font-medium uppercase tracking-wide text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-text-primary">{heading}</h2>
    </div>
  );
}
