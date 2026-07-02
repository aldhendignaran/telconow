# Story: ActivityFeed

**Story ID:** TN-013
**Component:** `ActivityFeed.tsx`
**Design reference:** `/designs/TelcoNow_Dashboard_dc.html` → "Recent Activity card (8-col, second row right)"
**Stub data:** `/stubs/data/activity.json` via `GET /api/stub/activity`

---

## Story

As an authenticated TelcoNow customer on the dashboard
I want to see my 4 most recent account events at a glance
So that I can quickly check whether recent payments and changes have processed

---

## Acceptance criteria

### Happy path

```
Given I am on /dashboard and activity data loads successfully
When the ActivityFeed renders
Then I see a white card (bg-surface, border-border, shadow-card, rounded-xl)
  spanning 8 of 12 grid columns
```

```
Given the card renders
Then the header row shows:
  - Left: "RECENT ACTIVITY" — text-xs font-medium uppercase tracking-wide text-text-secondary
  - Right: "View all →" link — text-accent, text-sm, font-semibold
    (see "View all destination" flag in Notes before implementing the href)
```

```
Given activity data contains 4 items
Then the 4 most recent items are shown, sorted by timestamp descending (newest first)
And no more than 4 items are ever rendered in this component
```

```
Given an activity item renders
Then each row shows:
  - Left: a 36×36px icon tile (rounded-[10px], bg and icon colour determined by activity type — see icon tile mapping below)
  - Centre: description text (text-sm font-semibold text-text-primary) + date + context subtitle (text-xs text-text-secondary)
  - Right: amount (text-sm font-bold text-text-primary) + status badge below it
And each row has a hover state: bg-bg on hover, transparent otherwise
```

```
Given activity type → icon tile mapping (copy SVGs verbatim from design HTML, convert attrs to JSX camelCase):
  data_topup  → bg-accent-tint2  background, accent-deep stroke  (plus/cross SVG)
  payment     → bg-success-bg    background, text-success stroke  (credit card SVG)
  plan_change → bg-bg            background, text-accent stroke   (star/upgrade SVG)
  addon       → bg-warning-bg    background, text-warning stroke  (circle-question SVG)
```

```
Given activity item amount is non-null (e.g. amount = -65 dollars converted to -6500 cents)
Then the display shows the absolute value: "$65.00"
  (use formatAUD(Math.abs(amountAUD)) — charges display as positive amounts matching the design)
```

```
Given activity item amount is null (e.g. plan_change events)
Then the amount column displays "—" (em dash)
```

```
Given status and type → badge mapping:
  type "payment",    status "completed" → Badge variant="success", text "Paid"
  type "data_topup", status "completed" → Badge variant="success", text "Completed"
  type "addon",      status "completed" → Badge variant="success", text "Completed"
  type "plan_change" (any status)       → Badge variant="purple",  text "Upgrade"
  any type,          status "pending"   → Badge variant="warning",  text "Pending"
  any type,          status "failed"    → Badge variant="danger",   text "Failed"
```

```
Given the subtitle line below the description
Then it shows the formatted date of the event
  timestamp "2026-06-15T09:23:00Z" → "15 Jun 2026" (DD MMM YYYY via formatDateLong())
  (the subtitle context text in the design — "5GB added", "Auto-pay Visa ••4242", "Starter → Plus" — is NOT in activity.json;
   the description field from the JSON is what's available; see Notes flag below)
```

### Loading state

```
Given the dashboard page is fetching activity data
Then the ActivityFeed card slot shows a skeleton matching the card layout:
  - A short SkeletonBlock for the header row
  - 4 skeleton rows, each with:
      A SkeletonBlock (36×36, rounded-lg) for the icon tile
      Two stacked SkeletonBlocks for description + subtitle
      A SkeletonBlock for the amount on the right
And no spinner is shown
```

_The skeleton is owned by the dashboard page's `loading.tsx`, not this component._

### Error state

```
Given GET /api/stub/activity returns an error
Then the card renders an ErrorState component:
  message: "Unable to load recent activity."
  onRetry: not required (read-only display)
And the ErrorState is contained within the card boundary
And it does not break the surrounding grid
```

### Edge cases

```
Given the activity array is empty
Then the card renders the header row normally
And the item list area shows a text message: "No recent activity."
  in text-sm text-text-secondary, centred vertically in the list area
And no ErrorState is used — empty is a valid state
```

```
Given there are fewer than 4 activity items (e.g. 2)
Then only those 2 items render
And no placeholder or "no more items" row fills the remaining space
```

```
Given an activity item has type "addon" and status "pending"
Then the badge renders as variant="warning", text "Pending"
  (pending wins over the type-based "Completed" mapping)
```

---

## Out of scope

- Pagination or infinite scroll — dashboard shows 4 items only; the full list belongs on a future activity page
- Filtering by activity type
- Clicking a row to see detail — no detail view is specced

---

## Notes for developer

- **Data source:** fetch `TActivity[]` from `GET /api/stub/activity` in the dashboard page Server Component; sort by `timestamp` descending; slice to first 4; pass as `activities: TActivity[]` prop. The component does no fetching or sorting.
- **Money conversion:** `activity.json` amounts are dollar floats (`-65.00`). Convert at the data-loading layer: `dollarsToCents(item.amount)` → the component receives `amountAUD: number | null` in cents. Display: `formatAUD(Math.abs(amountAUD))` — charges display as positive amounts per the design.
- **Amount sign convention — FLAG:** the design only shows charge (negative) and null amounts. If a future activity type ever produces a credit (positive amount, e.g. a refund), the current display would show it identically to a charge. Add a "+" prefix or green colour for credits when that use case arises — don't design for it now.
- **Subtitle context text — FLAG:** the design shows rich subtitle lines like "5GB added", "Auto-pay Visa ••4242", and "Starter → Plus". These sub-details are **not fields in `activity.json`** — `description` is the only text field and it contains higher-level copy ("Monthly bill payment", "Data top-up — 5GB"). The subtitle below the description should display the formatted date only (`formatDateLong(timestamp)`), or optionally render `description` as the first line and the date as the second. Do not invent sub-detail fields. Confirm with product whether to enrich `activity.json` with a `detail` field for these sub-lines before building.
- **Badge label mapping:** the `TActivityStatus` enum has `completed | pending | failed`, but the design uses type-aware badge labels ("Paid" vs "Completed" vs "Upgrade"). The AC table above defines the mapping. Implement it as a utility function or lookup, not inline ternaries.
- **"View all →" link — FLAG:** `build-spec.md` explicitly flags this as an open question — no dedicated activity page is specced. Options: render `href="/dashboard/billing"` as a temporary closest-match destination, or omit the link until a real destination exists. Do not invent a route. Get a decision before building.
- **Icon tile SVGs:** copy all 4 SVGs verbatim from the design HTML (`TelcoNow_Dashboard_dc.html`, section D, lines 290, 305, 320, 335). Convert HTML attrs to JSX camelCase only. Each SVG is 16×16. Implement as a lookup: `activityIconMap[type]` → `{ bg: string, svgPath: string }`.
- **Hover background:** `hover:bg-bg` is a Tailwind utility class — no `"use client"` needed. The hover effect is CSS-only.
- **`formatDateLong()`:** from `lib/utils.ts` (added in TN-006). Converts "2026-06-15T09:23:00Z" → "15 Jun 2026". The time component is stripped — display date only, consistent with other dashboard cards.
- **Server Component:** no interactivity. Keep it a Server Component — no `"use client"`. Hover state is Tailwind CSS, not JS.
- **Design amounts vs data:** the design shows $10, $65, $15 — these are the design's placeholder amounts. `activity.json` has -8.00, -65.00, -15.00. The JSON is truth; ignore the design amounts.
