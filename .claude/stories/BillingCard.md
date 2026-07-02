# Story: BillingCard

**Story ID:** TN-012
**Component:** `BillingCard.tsx`
**Design reference:** `/designs/TelcoNow_Dashboard_dc.html` → "Billing Overview card (4-col, second row left)"
**Stub data:** `/stubs/data/billing.json` via `GET /api/stub/billing`

---

## Story

As an authenticated TelcoNow customer on the dashboard
I want to see my upcoming payment, last payment status, and payment method at a glance
So that I can stay on top of my billing without navigating away from the dashboard

---

## Acceptance criteria

### Happy path

```
Given I am on /dashboard and billing data loads successfully
When the BillingCard renders
Then I see a white card (bg-surface, border-border, shadow-card, rounded-xl)
  spanning 4 of 12 grid columns
```

```
Given the card renders
Then the header shows:
  CardHeader label "BILLING" — text-xs font-medium uppercase tracking-wide text-text-secondary
  (No action/badge in the header — CardHeader action prop is omitted)
```

```
Given nextPayment.amount = 65 (dollars) and nextPayment.date = "2026-07-15"
Then below the header:
  A caption "Next payment" in text-xs text-text-secondary
  The amount "$65" in text-accent-deep at approximately 36px font-weight 700
    (amount converted: dollarsToCents(65) → formatAUD(6500).replace(/\.00$/, '') → "$65")
  Inline to the right: "due 15 Jul 2026" in text-sm text-text-secondary (baseline-aligned)
    (date formatted as DD MMM YYYY via formatDateLong())
```

```
Given the card renders
Then a Divider separates the next payment block from the detail rows below
```

```
Given lastPayment = { date: "2026-06-15", amount: 65, status: "paid" }
Then a KeyValueRow renders:
  label: "Last payment"
  value: "15 Jun 2026" in text-sm font-semibold text-text-primary
         + a Badge inline to its right, variant driven by status:
           "paid"    → Badge variant="success", text "Paid"
           "failed"  → Badge variant="danger",  text "Failed"
           "pending" → Badge variant="warning",  text "Pending"
```

```
Given paymentMethod = { type: "visa", last4: "4242" }
Then a KeyValueRow renders:
  label: "Payment method"
  value: a Visa card icon SVG + "•••• 4242" in text-sm font-semibold text-text-primary
    — the icon and masked number are inline (flex row, gap-1.5)
```

```
Given the card renders
Then a "Billing history →" link appears at the bottom:
  styled as text-accent, text-sm, font-semibold
  href: /dashboard/billing
```

### Loading state

```
Given the dashboard page is fetching billing data
Then the BillingCard slot shows a skeleton matching the card layout:
  - A short SkeletonBlock for the "BILLING" label
  - A tall SkeletonBlock for the next payment amount (approx h-10 or h-12)
  - A SkeletonBlock for the divider area
  - Two SkeletonBlock rows for the last payment and payment method rows
  - A short SkeletonBlock for the "Billing history →" link
And no spinner is shown
```

_The skeleton is owned by the dashboard page's `loading.tsx`, not this component._

### Error state

```
Given GET /api/stub/billing returns an error
Then the card renders an ErrorState component:
  message: "Unable to load billing details."
  onRetry: not required (read-only display — a page refresh is equivalent)
And the ErrorState is contained within the card boundary
And it does not break the surrounding grid
```

### Edge cases

```
Given lastPayment.status is "failed"
Then the last payment Badge renders with variant="danger" and text "Failed"
And no other layout change occurs — the failed state is badge-only
```

```
Given lastPayment.status is "pending"
Then the last payment Badge renders with variant="warning" and text "Pending"
```

```
Given nextPayment.date is today's date
Then the due date still renders as "DD MMM YYYY"
And no special "due today" copy or urgent styling is applied
```

> **Edge case gap:** the design does not show behaviour when a payment is overdue (nextPayment.date in the past). Flag to product — possible approach: apply text-danger to the due date. Build the simple version (always formatted date, no conditional styling) unless told otherwise.

---

## Out of scope

- Payment action (pay now, update payment method) — billing management is on `/dashboard/billing`, not this card
- Invoice download
- Payment amount breakdown (GST, addons) — single amount display only

---

## Notes for developer

- **Data source:** fetch `TBilling` from `GET /api/stub/billing` in the dashboard page Server Component; pass as `billing: TBilling` prop to `BillingCard`. The component itself does no fetching.
- **Money conversion:** `nextPayment.amount` and `lastPayment.amount` arrive in dollars from the JSON. Convert at the data-loading layer: `dollarsToCents(amount)`. Components only receive integer cents. The `lastPayment.amount` is not shown in the design card (only date + status badge) — do not display it unless a future spec asks for it.
- **Date format:** both dates use "DD MMM YYYY" (e.g. "15 Jun 2026" and "15 Jul 2026"). Use `formatDateLong()` from `lib/utils.ts` (added in TN-006) for both.
- **`KeyValueRow` with ReactNode value:** the `value` prop on `KeyValueRow` accepts `React.ReactNode`, so you can pass a `<Cluster>` or `<>date text <Badge /></>` fragment for the last-payment row and a `<Cluster>` of icon + text for the payment method row. The `<span>` wrapper inside `KeyValueRow` is inline, so inline-flex children (Badge, icon) compose correctly.
- **Visa SVG:** the design HTML contains the exact Visa brand SVG at line 271 (`width="28" height="18"`). Copy verbatim, convert attrs to JSX camelCase. Render conditionally: `paymentMethod.type === "visa"`.
- **Mastercard / Amex SVGs — FLAG:** the design only includes a Visa card SVG. `TPaymentMethod.type` supports `"visa" | "mastercard" | "amex"`. The SVGs for mastercard and amex are not in any design file. Options: (a) source official brand SVGs, (b) render a generic card icon (lucide `CreditCard`) for non-Visa types, (c) render text-only ("Mastercard ••••") for non-Visa. Do not invent brand-coloured SVGs — flag this gap first.
- **Masked number format:** the design shows "•••• 4242" (4 bullet-dots + space + last4). Use U+2022 bullets or the literal "••••" string. Render as `•••• ${paymentMethod.last4}`.
- **`CardHeader` molecule:** already built. Use it for the "BILLING" label; omit the `action` prop (no right-side action in this card's header, unlike some other dashboard cards).
- **`Divider` atom:** already built. Use it between the next payment block and the detail rows.
- **`KeyValueRow` molecule:** already built. Use it for both detail rows.
- **Server Component:** no interactivity. Keep it a Server Component — no `"use client"`.
