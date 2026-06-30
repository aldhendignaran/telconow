# Badge

Tokens used (see `designs/tokens.md`): `bg-success-bg`/`text-success`,
`bg-warning-bg`/`text-warning`, `bg-danger-bg`/`text-danger`,
`bg-neutralBadge-bg`/`text-neutralBadge`, `bg-accent-tint2`/`text-accent-deep`,
`bg-info-bg`/`text-info`.

**Source:** `.badge-success`, `.badge-warning`, `.badge-error`,
`.badge-neutral`, `.badge-purple`, `.badge-info` in
`TelcoNow_Dashboard_dc.html`. Six variants, not five — our original spec
was missing `info` and used a generic `accent` name where the design
calls it `purple`.

---

## `components/ui/badge.tsx`

```typescript
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "purple" | "success" | "warning" | "danger" | "info";
  /** Renders a small status dot before the text — used for "Active" states */
  dot?: boolean;
  children: React.ReactNode;
}

export function Badge({ variant = "default", dot = false, children }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
      {
        "bg-neutralBadge-bg text-neutralBadge": variant === "default",
        "bg-accent-tint2 text-accent-deep": variant === "purple",
        "bg-success-bg text-success": variant === "success",
        "bg-warning-bg text-warning": variant === "warning",
        "bg-danger-bg text-danger": variant === "danger",
        "bg-info-bg text-info": variant === "info",
      }
    )}>
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
```

---

## Usage

```tsx
<Badge variant="success" dot>Active</Badge>          {/* plan summary card status */}
<Badge variant="purple">50GB</Badge>                  {/* plan data allowance pill */}
<Badge variant="purple">Most popular</Badge>          {/* featured plan card */}
<Badge variant="warning">76.8% used</Badge>           {/* data usage badge */}
<Badge variant="warning">1 open</Badge>               {/* support tickets count */}
<Badge variant="success">Paid</Badge>                 {/* billing — last payment status */}
<Badge variant="success">Completed</Badge>            {/* activity feed item status */}
<Badge variant="default">Medium priority</Badge>      {/* ticket priority */}
```

Used in: dashboard plan summary (status), data usage meter (threshold
badge), billing card (payment status), activity feed (per-item status —
maps to `TActivityStatus`, see `brief/auth-spec.md` types), support
tickets (status + priority — see `brief/support-feature.md`), pricing
cards (featured badge).
