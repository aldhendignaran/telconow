# Usage Feature

Covers `usage.json` (current cycle) and `usage-history.json` (6-month
trend). Types in `brief/data-model.md` (`TUsage`, `TUsageHistoryPoint`).

---

## Data fetch

```typescript
// lib/mock-data.ts
import type { TUsage, TUsageHistory } from "@/types";

const USAGE: TUsage = {
  usedGB: 38.4,
  totalGB: 50,
  cycleStartDate: "2026-06-01",
  cycleEndDate: "2026-06-30",
  overageRate: 0.02,
};

const USAGE_HISTORY: TUsageHistory = [
  { month: "Jan 2026", usedGB: 28.1, totalGB: 15, costAUD: dollarsToCents(39) },
  { month: "Feb 2026", usedGB: 32.4, totalGB: 50, costAUD: dollarsToCents(65) },
  { month: "Mar 2026", usedGB: 45.2, totalGB: 50, costAUD: dollarsToCents(65) },
  { month: "Apr 2026", usedGB: 41.8, totalGB: 50, costAUD: dollarsToCents(65) },
  { month: "May 2026", usedGB: 50.0, totalGB: 50, costAUD: dollarsToCents(65) },
  { month: "Jun 2026", usedGB: 38.4, totalGB: 50, costAUD: dollarsToCents(65) },
];

export async function getUsage(customerId: string): Promise<TUsage> {
  // Swap: return db.usage.findUnique({ where: { customerId } })
  return USAGE;
}

export async function getUsageHistory(customerId: string): Promise<TUsageHistory> {
  return USAGE_HISTORY;
}
```

---

## Computed values (don't store, derive at render)

```typescript
// Percentage used, capped at 100 for the progress bar fill width
const percentUsed = Math.min((usage.usedGB / usage.totalGB) * 100, 100);

// Remaining, floored at 0 (don't show negative remaining if over cap)
const remainingGB = Math.max(usage.totalGB - usage.usedGB, 0);

// Days remaining in cycle
const daysRemaining = Math.ceil(
  (new Date(usage.cycleEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
);

// Is the customer over their cap?
const isOverCap = usage.usedGB > usage.totalGB;
```

---

## Progress bar — two-segment fill

Matches `.progress-fill` in the dashboard design: gradient from purple
(0–100% of cap) to `warning-accent` (#FF6B35) for any usage past 100%.
With `Math.min(..., 100)` capping the fill width as above, the over-cap
segment only becomes visually relevant if you choose to extend the bar
past its container — **for this build, cap the bar visually at 100%**
and surface "over cap" via the badge/text instead (e.g. "104% used,
$X.XX overage applies" once the overage billing question below is
resolved). Don't build a bar that visually extends past its own
container — that's a layout bug waiting to happen.

---

## WARNING — overage billing logic is unspecified

Flagged already in `brief/data-model.md`. Repeating here because this
is the file someone will open when building this feature, and the
warning needs to be unmissable at the point of implementation:

**Do not calculate or charge an overage amount.** Display `overageRate`
as static information only ("$0.02/MB over cap"). If `usedGB > totalGB`
on the mock data, show the usage as over-cap visually (bar colour, "over
cap" label) but do not compute a dollar figure for the overage charge —
that requires a product decision (auto-charge vs. opt-in, notification
flow, billing cycle timing) that hasn't been made.

---

## Usage history chart — rendering notes

- 6 bars, one per month, height = `(usedGB / totalGB) * 100%` of the
  chart's max height, capped at 100%
- Current month (last in array): dashed border, `accent` colour label,
  slightly reduced opacity (matches design's "Jun ▸" treatment)
- Months at or over their own cap (`usedGB >= totalGB`): `over-cap` bar
  style (lighter purple, per `designs/tokens.md`)
- Dashed horizontal reference line at the *current* cycle's cap (50GB in
  the mock) — note this is visually comparing different months' actual
  caps against one fixed line, which is only correct if the cap hasn't
  changed across the 6 months. January's data (`totalGB: 15`) breaks
  this assumption — see the ASSUMPTION note in `data-model.md` about
  January's data. The reference line should arguably be per-bar if caps
  changed historically, not one fixed line. Flag to design: confirm
  whether the reference line should move per month or stay fixed.
