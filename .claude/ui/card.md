# Card

Tokens used (see `designs/tokens.md`): `border-border`, `bg-surface`.

---

## `components/ui/card.tsx`

```typescript
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6", className)}>
      {children}
    </div>
  );
}
```

---

## Usage

```tsx
<Card>
  <h2 className="text-xl font-semibold">Standard plan</h2>
  <p className="text-text-secondary">60 GB · $49.99/mo</p>
</Card>
```

Used in: pricing grid (homepage), dashboard widgets (account summary,
activity feed, quick actions).
