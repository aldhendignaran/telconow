import NextLink from "next/link";
import { cn } from "@/lib/utils";

type LinkVariant = "default" | "muted" | "inverse" | "nav";

interface LinkProps {
  href: string;
  variant?: LinkVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<LinkVariant, string> = {
  default: "text-accent underline-offset-4 hover:underline",
  muted: "text-text-secondary hover:text-text-primary transition-colors",
  inverse: "text-text-onDarkMuted hover:text-text-inverse transition-colors",
  nav: "text-sm font-medium text-text-primary hover:text-accent transition-colors",
};

export function Link({ href, variant = "default", children, className }: LinkProps) {
  return (
    <NextLink href={href} className={cn(variantClasses[variant], className)}>
      {children}
    </NextLink>
  );
}
