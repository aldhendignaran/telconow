import { cn } from "@/lib/utils";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingVariant = "hero" | "display" | "h1" | "h2" | "h3";
type HeadingColor = "primary" | "inverse" | "accent-deep" | "secondary";

interface HeadingProps {
  level: HeadingLevel;
  variant?: HeadingVariant;
  color?: HeadingColor;
  children: React.ReactNode;
  className?: string;
}

const defaultVariant: Record<HeadingLevel, HeadingVariant> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h3",
};

const variantClasses: Record<HeadingVariant, string> = {
  hero: "text-[52px] font-bold tracking-tight leading-tight",
  display: "text-4xl font-bold",
  h1: "text-[28px] font-bold tracking-tight",
  h2: "text-2xl font-bold tracking-tight",
  h3: "text-lg font-semibold",
};

const colorClasses: Record<HeadingColor, string> = {
  primary: "text-text-primary",
  inverse: "text-text-inverse",
  "accent-deep": "text-accent-deep",
  secondary: "text-text-secondary",
};

export function Heading({ level, variant, color = "primary", children, className }: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  const resolvedVariant = variant ?? defaultVariant[level];
  return (
    <Tag className={cn(variantClasses[resolvedVariant], colorClasses[color], className)}>
      {children}
    </Tag>
  );
}
