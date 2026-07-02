# Story: PlanSummaryCard

**Story ID:** TN-010
**Component:** `PlanSummaryCard.tsx`
**Design reference:** `/designs/TelcoNow_Dashboard_dc.html` → "Plan Summary card (4-col, top-left)"
**Stub data:** `session.user.plan` (`TCustomerPlan`) — passed as a prop from the dashboard page Server Component; no additional fetch required

> **Data source note:** The component registry lists `/api/stub/account` as the data source, but `build-spec.md` specifies `session.user.plan` — the plan data is already encoded in the JWT session. Using the session is consistent with the solution architecture (no extra fetch, no stale data). The registry entry should be updated to `session.user.plan`.

---

## Story

As an authenticated TelcoNow customer on the dashboard
I want to see a clear summary of my current plan
So that I know what I'm paying, when it renews, and how to manage it

---

## Acceptance criteria

### Happy path

```
Given I am on /dashboard with an active Plus plan
When the PlanSummaryCard renders
Then I see a white card (bg-surface, border-border, shadow-card, rounded-xl) spanning 4 of 12 grid columns
```

```
Given the card renders
Then the card header row shows:
  - Left: "CURRENT PLAN" label — text-xs font-medium uppercase tracking-wide text-text-secondary (CardHeader molecule)
  - Right: a status badge — variant driven by plan status:
      "active"    → Badge variant="success", dot, text "Active"
      "suspended" → Badge variant="warning", text "Suspended"
      "cancelled" → Badge variant="danger", text "Cancelled"
```

```
Given the plan status is "active"
Then the plan name is displayed in text-accent-deep at approximately 26px font-weight 700
And a Badge variant="purple" showing the data allowance (e.g. "50GB") sits inline to the right of the plan name
And below that, the monthly price is displayed at approximately 28px font-weight 700 in text-text-primary
  with "/mo" in text-sm font-normal text-text-secondary immediately after
```

```
Given the card renders
Then a Divider separates the plan name / price block from the key-value rows below it
```

```
Given the card renders
Then two KeyValueRow molecules appear below the divider:
  Row 1 — label: "Renews", value: renewal date formatted as "15 Jul 2026" (DD MMM YYYY)
  Row 2 — label: "Contract", value: "No lock-in"
```

```
Given the card renders
Then a "Manage plan →" link appears at the bottom
  styled as text-accent, text-sm, font-semibold
  href: /dashboard/billing
```

```
Given the price in the session is 6500 cents (representing $65)
When the card renders
Then the price displays as "$65" — the trailing ".00" is stripped
  (formatAUD(6500) → "$65.00" → strip → "$65")
```

### Loading state

```
Given the dashboard page is loading
Then the PlanSummaryCard slot shows a skeleton that matches the card layout:
  - A short SkeletonBlock for the "CURRENT PLAN" label row
  - A wider SkeletonBlock for the plan name
  - A SkeletonBlock for the price
  - A SkeletonBlock for the divider area
  - Two SkeletonBlock rows for the key-value pairs
And no spinner is shown
```

_Note: the skeleton is owned by the dashboard page's `loading.tsx`, not by this component. The component does not render its own skeleton._

### Error state

```
Given session.user.plan is missing or malformed when the dashboard page renders
Then the card slot renders an ErrorState component
  message: "Unable to load plan details."
And the ErrorState is visible but does not break the surrounding grid layout
```

_Note: because this card consumes data from the session (not a network fetch), a missing plan is unlikely in normal flow — middleware guarantees a valid session. This AC covers the defensive case in the dashboard page's Server Component._

### Edge cases

```
Given the plan status is "suspended"
Then the status badge renders with variant="warning" and text "Suspended"
And the plan name and price are still displayed (card does not hide on suspended status)
```

```
Given the plan status is "cancelled"
Then the status badge renders with variant="danger" and text "Cancelled"
```

```
Given the renewal date is the current day
Then the date still renders as a formatted date string (e.g. "2 Jul 2026")
And no special "renews today" copy is shown — formatting only, no conditional copy
```

---

## Out of scope

- Plan upgrade / change flow — the "Manage plan →" link goes to `/dashboard/billing`; no inline upgrade action is specced on this card.
- Cancellation or suspension flow — status is display-only.
- Plan comparison UI — belongs on `/dashboard/billing`, not here.

---

## Notes for developer

- **Props:** the component receives `plan: TCustomerPlan` as a prop from the dashboard page Server Component (`app/dashboard/page.tsx`), which gets it from `getServerSession(authOptions).user.plan`. No fetch in this component.
- **`dataLimitGB` gap — FLAG:** the design shows a "50GB" data badge beside the plan name, but `TCustomerPlan` (from `account.json`) has no `dataLimitGB` field. This needs to be resolved before building. Two options:
    1. _(Recommended)_ Add `dataLimitGB: number | null` to `account.json` and to the `TCustomerPlan` type in `types/data-model.ts`. Simple; keeps data co-located with plan state.
    2. Derive from `planTier` using a static lookup (`{ starter: 20, plus: 50, pro: 100 }`). Works, but the lookup is invented — it should match Contentful plan entries exactly.
  Do not silently omit the badge or use a placeholder value — flag this gap first and get a decision.
- **"Contract: No lock-in"** — not in `account.json` or `TCustomerPlan`. The design hardcodes this value, consistent with TelcoNow's brand promise ("No lock-in contracts" appears on the homepage too). Hardcode `"No lock-in"` in the component for now. Add a `contractType` field to `account.json` and `TCustomerPlan` if the product ever needs to show a different value for legacy contracted customers.
- **Date format:** the design shows `15 Jul 2026` (DD MMM YYYY). Use `formatDateLong()` from `lib/utils.ts` (added in TN-006) — **not** `formatDate()`, which returns `DD/MM/YYYY`.
- **Price formatting:** `monthlyCostAUD` is already in cents when it reaches this component (converted at the API/session boundary via `dollarsToCents()`). Call `formatAUD(plan.monthlyCostAUD).replace(/\.00$/, "")` to get `"$65"` not `"$65.00"`.
- **Molecules to use:** `CardHeader` (label + badge action), `KeyValueRow` (Renews, Contract), `Divider` — all already built. Do not build raw replacements.
- **`Badge` variants:** `success` (active), `warning` (suspended), `danger` (cancelled), `purple` (data allowance). All already built in `components/ui/atoms/Badge.tsx`.
- **Card padding:** the design shows `padding: 24px` on the card — use `p-6` (24px).
- **Server Component:** this component has no interactivity and no browser API usage. Keep it a Server Component — no `"use client"`.
