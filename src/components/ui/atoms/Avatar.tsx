import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({ initials, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex select-none items-center justify-center rounded-full bg-accent-tint2 font-semibold text-accent-deep",
        sizeClasses[size],
        className
      )}
      aria-label={`Avatar: ${initials}`}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
