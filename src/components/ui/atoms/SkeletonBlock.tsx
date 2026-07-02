import { cn } from "@/lib/utils";

type SkeletonRounded = "sm" | "md" | "lg" | "full";

interface SkeletonBlockProps {
  width?: string;
  height?: string;
  rounded?: SkeletonRounded;
  className?: string;
}

const roundedMap: Record<SkeletonRounded, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function SkeletonBlock({
  width = "w-full",
  height = "h-4",
  rounded = "md",
  className,
}: SkeletonBlockProps) {
  return (
    <div
      className={cn("animate-pulse bg-border", width, height, roundedMap[rounded], className)}
      aria-hidden="true"
    />
  );
}
