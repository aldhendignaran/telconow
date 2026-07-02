# Story: UsageHistoryChart

**Story ID:** TN-015
**Component:** `UsageHistoryChart.tsx`
**Design reference:** `/designs/TelcoNow_Dashboard_dc.html` → "Usage History chart (12-col, full-width)"
**Stub data:** `/stubs/data/usage-history.json` via `GET /api/stub/usage-history`

---

## Story

As an authenticated TelcoNow customer on the dashboard
I want to see 6 months of data usage as a bar chart
So that I can spot trends and understand whether I consistently approach or exceed my cap

---

## Acceptance criteria

### Happy path

```
Given I am on /dashboard and usage-history data loads successfully
When the UsageHistoryChart renders
Then I see a white card (bg-surface, border-border, shadow-card, rounded-xl)
  spanning all 12 grid columns
  with padding 28px top/bottom, 32px left/right
```

```
Given the card renders
Then the header row shows:
  Left side:
    - "USAGE HISTORY" label — text-xs font-medium uppercase tracking-wide text-text-secondary
    - Below it: "Monthly data consumption · Jan–Jun 2026" — text-[15px] font-semibold text-text-primary
      where "Jan–Jun 2026" is derived from the first and last month labels in the data
  Right side:
    - A legend row with 3 items (in order):
        1. A 12×12px rounded-sm purple square (bg-accent) + text "Data used"
        2. A 12×12px rounded-sm lavender square (bg-accent-tint2) + text "At cap"
        3. A 24×2px dashed line (repeating accent-deep pattern) + text "50GB cap"
      All legend text: text-xs text-text-secondary
```

```
Given the chart renders
Then a dashed reference line spans the full width at the top of the bar container
  using a repeating dashed pattern in text-accent-deep at 35% opacity
And a "50 GB cap" label sits absolute top-right:
  text-[10px] font-semibold text-accent-deep opacity-60
```

```
Given 6 months of data (Jan–Jun 2026)
Then 6 bars render in a flex row within a 128px tall container
Each bar is 28px wide with rounded-t corners (rounded-t-[4px])
Bar height is calculated as: min(usedGB / referenceCap, 1.0) × 100%
  where referenceCap = the current month's totalGB (50)
```

```
Given bar state rules:
  Normal bar (usedGB < point.totalGB):
    background: bg-accent (purple)
    value label: "{usedGB} GB" — text-xs text-text-secondary below bar
    month label: abbreviated month name — text-xs text-text-secondary

  Over-cap bar (usedGB >= point.totalGB, using each month's OWN totalGB):
    background: bg-accent-tint2 (lavender)
    value label: "{usedGB} GB" — text-xs font-semibold text-accent-deep below bar
    month label: abbreviated month name — text-xs text-text-secondary

  Current month bar (the last item in the array, in-progress):
    background: bg-bg
    border: 1.5px dashed, border-accent
    opacity: 65%
    value label: "{usedGB} GB" — text-xs font-semibold text-accent below bar
    month label: "{Mon} ▸" — text-xs font-semibold text-accent (▸ signals in-progress)
```

```
Given the stub data (Jan–Jun 2026):
  Jan 2026: usedGB=28.1, totalGB=15  → height 56%, OVER-CAP (28.1 > 15), lavender bar
  Feb 2026: usedGB=32.4, totalGB=50  → height 65%, normal, purple bar
  Mar 2026: usedGB=45.2, totalGB=50  → height 90%, normal, purple bar
  Apr 2026: usedGB=41.8, totalGB=50  → height 84%, normal, purple bar
  May 2026: usedGB=50.0, totalGB=50  → height 100%, OVER-CAP (50.0 >= 50), lavender bar
  Jun 2026: usedGB=38.4, totalGB=50  → height 77%, CURRENT MONTH, dashed bg-bg bar
```

> **Data note — January:** Jan has `totalGB: 15` (the customer was on a smaller plan). `usedGB: 28.1 > 15` triggers over-cap styling even though bar height (28.1/50 = 56%) is well below the cap line. This is confirmed deliberate in `brief/data-model.md` — render as over-cap bar.

### Loading state

```
Given the dashboard page is fetching usage-history data
Then the UsageHistoryChart card slot shows a skeleton matching the card layout:
  - A short SkeletonBlock for the "USAGE HISTORY" header
  - A medium SkeletonBlock for the subtitle line
  - A full-width SkeletonBlock (height approx 160px) for the chart area
And no spinner is shown
```

_The skeleton is owned by the dashboard page's `loading.tsx`, not this component._

### Error state

```
Given GET /api/stub/usage-history returns an error
Then the card renders an ErrorState component:
  message: "Unable to load usage history."
  onRetry: not required (read-only display)
And the ErrorState is contained within the card boundary
And it does not collapse the card — the card still occupies its full 12-column span
```

### Edge cases

```
Given all 6 months are below cap
Then no lavender (bg-accent-tint2) bars appear
And the legend still renders all 3 items including "At cap"
```

```
Given the current month bar (last item) also qualifies as over-cap
  (e.g. usedGB=52, totalGB=50 — hypothetical)
Then the current month bar style takes precedence: dashed bg-bg, opacity-65
And its value label uses text-accent (current month colour, not over-cap colour)
```

> **Flag — current month + over-cap conflict:** the design does not show this state. The AC above prioritises the current-month visual over the over-cap visual, since the dashed bar already signals "in progress". Confirm with design if it ever arises.

---

## Out of scope

- Hover tooltips on bars — not in the design
- Clicking a bar to drill into that month's detail
- Displaying the `cost` field from usage-history data — the chart is usage-only; cost is not shown
- Animated bar grow-in on mount
- More or fewer than 6 months — the stub always provides exactly 6

---

## Notes for developer

- **No chart library required:** the chart is a pure CSS flex bar implementation. Do not install recharts, chart.js, or similar. The design uses a flex row with `align-items: flex-end` and percentage heights — this is exactly how Tailwind flex works.
- **Bar height:** each bar is a `<div>` inside a fixed-height wrapper. Set the wrapper to `h-[128px] flex items-end` and each bar's height as an inline style: `style={{ height: \`${barHeightPercent}%\` }}`. Inline style is acceptable here — dynamic percentage heights cannot be expressed as Tailwind utility classes.
- **Current month identification:** the last item in the array (index = `history.length - 1`) is the current month. This assumes the API returns data in chronological order (oldest first), which the stub data does. Alternatively, compare `month` to the current server-side date — flag if the ordering assumption feels fragile.
- **Over-cap check:** `point.usedGB >= point.totalGB` using each month's OWN `totalGB` (not the referenceCap). Jan over-cap: `28.1 >= 15` → true. May over-cap: `50.0 >= 50` → true.
- **referenceCap:** use the current month's `totalGB` (last item in array = 50) as the scale reference. The cap line always represents this value. Do not use `Math.max` across all months — that produces the same result with the current data but is semantically wrong (the cap line represents the current plan, not a historical high).
- **Cap line:** absolute positioned `<div>` at the top of the chart container. Use `style={{ background: "repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 12px)" }}` with `text-accent-deep opacity-35` on the element. Inline style required for the repeating gradient — cannot express in Tailwind.
- **Legend dashed swatch:** same repeating-gradient pattern for the legend's cap line indicator. Width 24px, height 2px.
- **Subtitle date range:** derive dynamically from data: `"${history[0].month.split(' ')[0]}–${history[history.length-1].month.split(' ')[0]} ${history[history.length-1].month.split(' ')[1]}"` → "Jan–Jun 2026".
- **`cost` field mapping:** `usage-history.json` has `cost: 39` but `TUsageHistoryPoint` type uses `costAUD: number` (cents). The data-loading layer must rename the key AND convert: `costAUD: dollarsToCents(point.cost)`. The chart component never uses `costAUD` — this is a type-safety concern, not a rendering concern.
- **Server Component:** no interactivity. Keep it a Server Component — no `"use client"`. CSS hover opacity on bars (`.hover:opacity-80`) via Tailwind is sufficient.
- **`"▸"` character:** this is U+25B8 BLACK RIGHT-POINTING SMALL TRIANGLE. Render as a literal string in JSX: `{month} ▸`.
