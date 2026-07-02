import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { NavLink } from "@/components/ui/molecules/NavLink";

const NAV_ITEMS = [
  { href: "/plans", label: "Plans" },
  { href: "/coverage", label: "Coverage" },
  { href: "/business", label: "Business" },
  { href: "/support", label: "Support" },
] as const;

const linkButtonBase =
  "inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-panel">
      <Container>
        <div className="flex h-16 items-center">
          <NextLink href="/" className="shrink-0 text-xl font-bold tracking-tight">
            <span className="text-text-inverse">Telco</span>
            <span className="text-accent-tint2">Now</span>
          </NextLink>

          <nav className="mx-auto flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <NextLink
              href="/login"
              className={cn(
                linkButtonBase,
                "border-[1.5px] border-white/70 bg-transparent text-white hover:border-white hover:bg-white/10"
              )}
            >
              Log in
            </NextLink>
            <NextLink
              href="/login"
              className={cn(
                linkButtonBase,
                "bg-accent text-text-inverse hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30"
              )}
            >
              Get started
            </NextLink>
          </div>
        </div>
      </Container>
    </header>
  );
}
