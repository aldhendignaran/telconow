# Story: UsageMeterCard

**Story ID:** TN-011
**Component:** `UsageMeterCard.tsx`
**Design reference:** `/designs/TelcoNow_Dashboard_dc.html` → "Data Usage Meter card (8-col, top-right)"
**Stub data:** `/stubs/data/usage.json` via `GET /api/stub/usage`

---

## Story

As an authenticated TelcoNow customer on the dashboard
I want to see how much data I have used this cycle
So that I can manage my usage before hitting my cap or incurring overage charges

---

## Acceptance criteria

### Happy path

```
Given I am on /dashboard and usage data loads successfully
When the UsageMeterCard renders
Then I see a white card (bg-surface, border-border, shadow-card, rounded-xl)
  spanning 8 of 12 grid columns
```

```
Given the card renders with usedGB: 38.4, totalGB: 50
Then the header row shows:
  - Left side:
      CardHeader label: "DATA USAGE" — text-xs font-medium uppercase tracking-wide text-text-secondary
      Below the label: "38.4 GB" in text-4xl font-bold text-text-primary
      Inline to its right: "of 50 GB" in text-base text-text-secondary (baseline-aligned)
  - Right side:
      A percentage badge: "76.8% used" — variant driven by usage level (see badge rules below)
      Below the badge: "7 days remaining" in text-xs text-text-secondary
```

```
Given usedGB / totalGB × 100 = 76.8%
And the cycle ends in 7 days (computed server-side from cycleEndDate)
Then the badge variant rules are:
  usedPercent < 80%  → Badge variant="success"  (green)
  usedPercent >= 80% → Badge variant="warning"  (orange)
  usedPercent >= 100% → Badge variant="danger"  (red)
```

> **Design note — badge ambiguity:** the design file shows badge-warning at 76.8%, but also labels the bar "▲ 80% warning threshold". These two signals conflict. The AC above uses the 80% threshold as the canonical rule. If the intent is an earlier warning (e.g., ≥75%), confirm with design before building.

```
Given usedGB < totalGB (no overage)
When the progress bar section renders
Then a single ProgressBar atom renders with variant="default" (bg-accent, purple fill)
  at percent = usedGB / totalGB × 100, clamped to 100
Below the bar, a 3-column annotation row shows:
  - Left:   "0 GB" in text-xs text-text-secondary
  - Centre: "▲ 80% warning threshold" in text-xs font-semibold text-warning
  - Right:  "{totalGB} GB" in text-xs text-text-secondary
```

```
Given usedGB > totalGB (overage state)
When the progress bar section renders
Then two ProgressBar atoms are composited to form a two-segment bar:
  Segment 1 (left): variant="default" (bg-accent, purple), percent = 100 — represents the cap
  Segment 2 (right): variant="warning" (bg-warning-accent, orange) — represents overage,
    sized proportionally to show overageGB relative to totalGB
The annotation row still renders below with "0 GB", "▲ 80% warning threshold", and "{totalGB} GB"
```

> **Implementation note:** the two-segment bar is assembled at the card level from two ProgressBar atoms. It is not handled inside the ProgressBar atom itself. See `design-system.md` → ProgressBar for the confirmed approach.

```
Given the card renders
Then below the progress bar section, three StatTile molecules render in a 3-column grid (background="tint"):
  Tile 1 — label: "REMAINING", value: "{remainingGB} GB"
    where remainingGB = max(totalGB − usedGB, 0), formatted to one decimal place
  Tile 2 — label: "CYCLE",     value: "1 Jun – 30 Jun"
    start and end dates formatted as "D MMM" (day without leading zero, abbreviated month, no year)
  Tile 3 — label: "OVERAGE RATE", value: "$0.02/MB"
    overageRate displayed as a dollar float with 2 decimal places + "/MB" suffix
    (overageRate is NOT converted to cents — it is kept as a float per data-model.md)
```

### Loading state

```
Given the dashboard page is fetching usage data
Then the UsageMeterCard slot shows a skeleton matching the card layout:
  - A short SkeletonBlock for the "DATA USAGE" label row
  - A wide SkeletonBlock for the used/total headline (32px height)
  - A full-width SkeletonBlock for the progress bar track
  - Three equal SkeletonBlock tiles for the stat row
And no spinner is shown
```

_The skeleton is owned by the dashboard page's `loading.tsx`, not this component._

### Error state

```
Given GET /api/stub/usage returns an error
Then the card renders an ErrorState component:
  message: "Unable to load usage data."
  onRetry: not required (read-only display — a page refresh achieves the same result)
And the ErrorState is contained within the card boundary
And it does not break the surrounding grid
```

### Edge cases

```
Given usedGB equals totalGB exactly (100% used, no overage)
Then the progress bar renders at 100% with variant="default" (purple, single segment)
And the badge shows "100.0% used" with variant="danger"
And the "Remaining" stat tile shows "0.0 GB"
And no overage segment is rendered (two-segment only applies when usedGB > totalGB)
```

```
Given usedGB > totalGB (e.g. usedGB: 55, totalGB: 50)
Then the "Remaining" stat tile shows "0.0 GB" (clamped — not negative)
And the two-segment bar renders with an overage segment for 5GB
```

> **Edge case gap:** the design does not show what the "Remaining" tile label becomes when usedGB > totalGB. "Remaining" at 0 GB is technically correct but potentially confusing. Flag to design — possible alternative: change label to "Over cap" with value "+5.0 GB" when in overage. Build the simpler version (clamped 0) unless told otherwise.

```
Given cycleEndDate has passed (mid-cycle data reset is pending)
Then "days remaining" shows "0 days remaining"
And no error or special state is shown
```

> **Flag:** what happens after the cycle ends but before usage resets? The data may briefly show stale cycle dates. This is a data/API concern, not a UI concern — the component displays whatever the API returns.

---

## Out of scope

- Overage charge calculation or projection — `overageRate` is display-only per `data-model.md` open questions
- Cycle reset notifications
- Usage alerts or push notifications
- Link to `/dashboard/usage` — the card is self-contained; the Usage page is a separate route (no "View more" link shown in this card in the design)

---

## Notes for developer

- **Data source:** fetch `TUsage` from `GET /api/stub/usage` in the dashboard page Server Component; pass as `usage: TUsage` prop to `UsageMeterCard`. The component itself does no fetching.
- **`overageRate` money rule exception:** `overageRate` is a dollar float ($0.02/MB) and must NOT be passed through `dollarsToCents()`. Display as `$${usage.overageRate.toFixed(2)}/MB`. This is an explicit exception documented in `brief/data-model.md`.
- **Percentage computation:** `(usedGB / totalGB * 100).toFixed(1)` → "76.8". Use `Math.round` only for display rounding; keep the unrounded float for the ProgressBar `percent` prop.
- **"Days remaining" computation:** `Math.max(0, differenceInCalendarDays(new Date(cycleEndDate), new Date()))` — server-side only; no browser `Date.now()`. Use a plain date difference; no need for a date library.
- **Cycle date format "D MMM":** neither `formatDate()` (→ DD/MM/YYYY) nor `formatDateLong()` (→ DD MMM YYYY) produces the required "1 Jun" format (no leading zero, no year). Add a `formatCycleDate(isoDate: string): string` helper to `lib/utils.ts`, or use `new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short" }).format(new Date(date))`. Do not hardcode the format string in the component.
- **StatTile:** already built at `components/ui/molecules/StatTile.tsx`. Use `background="tint"` for all three tiles — the design's `bg-bg` (#F5EEFF) matches the `tint` variant.
- **CardHeader:** already built. Use it for the "DATA USAGE" label. The right-side badge + days text is not a standard CardHeader action — render the right side as a custom `<div>` with the badge and days text stacked.
- **ProgressBar:** already built at `components/ui/atoms/ProgressBar.tsx`. `variant="default"` for normal, `variant="warning"` for overage segment. Compose two at the card level for the two-segment state — do not modify the atom.
- **Server Component:** no interactivity. Keep it a Server Component — no `"use client"`.
- **Design CSS discrepancy — bar colour:** the design HTML uses `#00B388` (green) for the normal fill. The build-spec and ProgressBar atom use `bg-accent` (purple). Follow the build-spec and atom — the design CSS was not updated to match the final token palette.
