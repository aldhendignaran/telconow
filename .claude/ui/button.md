# Button

Tokens used (see `designs/tokens.md`): `bg-accent`, `text-text-inverse`,
`border-border`, `bg-surface`, `text-text-primary`, `bg-bg`, `bg-accent-tint`.

**Source:** matches `.btn-primary`, `.btn-primary-lg`, `.btn-ghost-purple`,
`.btn-ghost-white`, `.btn-ghost-hero` classes across all three design files.
Five visual variants observed — consolidated into `variant` + `size` props
below rather than five separate components.

---

## `components/ui/button.tsx`

```typescript
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "ghost-white";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          // .btn-primary / .btn-primary-lg — solid purple, white text
          "bg-accent text-text-inverse hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30":
            variant === "primary",
          // .btn-ghost-purple — purple border/text on light bg
          "border-[1.5px] border-accent bg-transparent text-accent hover:bg-accent-tint":
            variant === "secondary",
          // .btn-ghost-hero / .btn-ghost-white — white border/text on dark bg
          "border-[1.5px] border-white/70 bg-transparent text-white hover:border-white hover:bg-white/10":
            variant === "ghost-white",
          // plain ghost — no border, text only
          "text-text-primary hover:bg-bg": variant === "ghost",
          "h-9 px-3 text-sm": size === "sm",
          "h-11 px-5 text-sm": size === "md",
          "h-[52px] px-7 text-base": size === "lg",
        },
        className
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
          </svg>
          {children}
        </span>
      ) : children}
    </button>
  );
}
```

---

## Usage

```tsx
<Button variant="primary" size="lg">View plans</Button>           {/* homepage hero CTA */}
<Button variant="ghost-white" size="lg">Check coverage</Button>   {/* homepage hero secondary, on dark bg */}
<Button variant="secondary" size="md">Get Starter</Button>        {/* pricing card CTA, non-featured */}
<Button variant="primary" size="md" loading>Signing in…</Button>  {/* login submit */}
```

Used in: homepage hero (primary + ghost-white pair), homepage header
("Log in" ghost-white, "Get started" primary), pricing cards (primary
for featured plan, secondary for others), login form submit, dashboard
upgrade banner ("Upgrade now" — primary), dashboard quick actions
(see `brief/build-spec.md` for placeholder-click behaviour).

**Not covered here:** the dashboard's small ticket/upload buttons
(`.btn-ticket`, `.btn-upgrade`) use slightly different fixed heights
(36px, 38px) than this component's `sm`/`md` sizes. Either accept the
visual rounding to the nearest size prop, or add exact-height variants
if pixel-perfect matching to the design file is required — flag to
design review before deciding.
