# Billing Feature

Covers `billing.json`. Types in `brief/data-model.md` (`TBilling`,
`TPayment`, `TLastPayment`, `TPaymentMethod`).

---

## Data fetch

```typescript
// lib/mock-data.ts
import type { TBilling } from "@/types";
import { dollarsToCents } from "@/lib/money";

const BILLING: TBilling = {
  nextPayment: { date: "2026-07-15", amountAUD: dollarsToCents(65) },
  lastPayment: { date: "2026-06-15", amountAUD: dollarsToCents(65), status: "paid" },
  paymentMethod: { type: "visa", last4: "4242" },
};

export async function getBilling(customerId: string): Promise<TBilling> {
  // Swap: return db.billing.findUnique({ where: { customerId } })
  return BILLING;
}
```

---

## Card brand icon

Design shows a hand-drawn Visa SVG inline. For a real build, don't hand-
draw every card brand — use a small icon set (`react-payment-icons` or
similar) keyed off `paymentMethod.type`, falling back to a generic card
glyph for unrecognised types. Confirm which card brands TelcoNow
actually needs to support (the mock only has `visa`, but `TPaymentMethod.type`
in `data-model.md` also lists `mastercard`/`amex` — verify those are
real requirements, not just speculative typing).

---

## "Days until next bill" calculation

Used in the dashboard header ("Your next bill is in 22 days"):

```typescript
const daysUntilBill = Math.ceil(
  (new Date(billing.nextPayment.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
);
```

---

## `/dashboard/billing` full page — minimum viable scope

No dedicated design provided beyond the dashboard widget. Build:

1. Billing overview widget (same as dashboard home) at full width
2. Payment method management — "Update payment method" action,
   currently a placeholder (no real payment processor integrated, see
   PCI note in `data-model.md`)
3. Payment history — **inferred data source**: filter `activity.json`
   to `type === "payment"` entries. This is an assumption, not a stated
   requirement — billing history might warrant its own JSON/API in a
   real system rather than being derived from the general activity log.
   Flag to product: should billing history be its own data source?

### ASSUMPTION — payment history via activity filter

Treating `activity.json` as the source for billing history because no
separate `billing-history.json` was provided and `activity.json` already
contains `payment`-typed entries with amounts. If a real backend has a
dedicated billing/invoices API, switch to that — this is a reasonable
placeholder, not a confirmed architecture decision.
