# Data Model

Single source for all data types. Supersedes the inline mock types
previously in `stubs/auth-scaffold.md` — those were a placeholder shape
invented before real data existed. **These types match the actual
client-provided JSON files** (`account.json`, `usage.json`, `billing.json`,
`usage-history.json`, `activity.json`, `addons.json`, `tickets.json`).

`stubs/auth-scaffold.md` now imports `TCustomerPublic` from here rather
than defining its own customer shape.

---

## CRITICAL — money representation

The real JSON files represent money as **floats in dollars**
(`"amount": 65`, `"price": 15.00`), not cents. This directly conflicts
with our existing rule ("AUD cents as integers, never floats") from
`solution-architecture.md`.

**Decision: convert to cents at the API boundary, keep cents internally.**
The float-safety rule stays intact for everything downstream of the
boundary — components, calculations, display formatting all work with
integer cents exactly as before. The conversion happens once, in one
place, for every external read.

```typescript
// lib/money.ts
/**
 * Convert a dollar float (from JSON files, or any future API) to
 * integer cents. Single seam — every external read passes through here.
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Format integer cents as a display string.
 * formatAUD(6500)  → "$65.00"   (credit / price display)
 * formatAUD(-6500) → "−$65.00"  (charge in activity feed — minus sign before dollar sign)
 */
export function formatAUD(cents: number): string {
  if (cents < 0) return `−$${(Math.abs(cents) / 100).toFixed(2)}`;
  return `$${(cents / 100).toFixed(2)}`;
}
```

Apply `dollarsToCents()` in the data-loading layer (wherever the JSON
files — or later, a real API — are read), never in components. Components
only ever see cents.

---

## `TPlan` — from `account.json`

Real shape has no `features` array or `highlighted` flag on the customer's
*current* plan — those only exist on the homepage's plan catalogue
(`Starter`/`Plus`/`Pro`, hardcoded in the homepage design, not from this
JSON). Split into two types: the customer's current plan state, and the
catalogue entry used for upgrade comparisons.

```typescript
export type TPlanTier = "starter" | "plus" | "pro";

/** The customer's current plan — from account.json */
export interface TCustomerPlan {
  planName: string;        // "Plus"
  planTier: TPlanTier;
  renewalDate: string;     // ISO date string, e.g. "2026-07-15"
  /** AUD cents — converted from account.json's monthlyCost via dollarsToCents() */
  monthlyCostAUD: number;
  status: "active" | "suspended" | "cancelled";
}

/** A plan catalogue entry — used on homepage pricing + dashboard upgrade prompts */
export interface TPlanCatalogueEntry {
  tier: TPlanTier;
  name: string;
  /** AUD cents */
  monthlyAUD: number;
  /** null = unlimited */
  dataLimitGB: number | null;
  description: string;     // "Perfect for everyday use."
  features: string[];
  highlighted: boolean;     // true for "Plus" — drives "Most popular" badge
}
```

`TPlanCatalogueEntry` is not in any provided JSON file — it's homepage
content. Candidate for Contentful (`brief/contentful-setup.md` already
specs a `plan` content type with this exact shape) rather than a new
static JSON file, since marketing will want to edit pricing without a
deploy.

---

## `TUsage` — from `usage.json`

```typescript
export interface TUsage {
  usedGB: number;
  totalGB: number;
  cycleStartDate: string;   // ISO date, "2026-06-01"
  cycleEndDate: string;     // ISO date, "2026-06-30"
  /** AUD per MB over the cap — e.g. 0.02. NOT yet converted to cents; see note below */
  overageRate: number;
}
```

### WARNING — overage rate is a new billable feature with no spec

`overageRate` implies the customer can be charged for usage past
`totalGB`, at a per-MB rate. This is a real billing feature — nothing in
`build-spec.md` accounts for overage charges anywhere (not in the
dashboard widget spec, not in the billing display, not in activity).

**Open questions, must be answered before building this:**
- Is overage charged automatically and added to `nextPayment`, or does
  it require the customer to opt in / get notified first?
- Does the dashboard need to *display* a projected overage charge if
  the customer is trending over cap mid-cycle, or only show it after
  the fact in billing history?
- `overageRate` is dollars-per-MB, a much smaller unit than the
  cents-per-whole-amounts pattern used everywhere else — decide whether
  to store this as cents-per-MB (consistent, but sub-cent precision
  issues at low usage) or keep it as a float specifically for this one
  field with a comment explaining why it's an exception.

**Until answered:** the data usage widget displays `overageRate` as
read-only information ("$0.02/MB over cap") per the dashboard design —
it does not calculate or project an overage charge. That's the only
behaviour currently specced; anything beyond display is out of scope
until the questions above are resolved.

---

## `TBilling` — from `billing.json`

```typescript
export interface TPayment {
  date: string;              // ISO date
  /** AUD cents — converted via dollarsToCents() */
  amountAUD: number;
}

export interface TLastPayment extends TPayment {
  status: "paid" | "failed" | "pending";
}

export interface TPaymentMethod {
  type: "visa" | "mastercard" | "amex";
  last4: string;
}

export interface TBilling {
  nextPayment: TPayment;
  lastPayment: TLastPayment;
  paymentMethod: TPaymentMethod;
}
```

### WARNING — card last 4 digits is a PCI-adjacent concern

`paymentMethod.last4` is the last 4 digits of a card number. This is low
risk on its own (last-4 display is industry standard, not regulated PCI
data), but flag now: if a real payment processor is integrated later
(Stripe, etc.), **never store full card numbers or CVVs anywhere in this
app's database** — `last4` and `type` should be the only card data this
app ever persists, sourced directly from the processor's tokenised
response. This is a "don't build it wrong later" flag, not a current
blocker — the mock JSON is already correctly scoped to last-4 only.

---

## `TActivity` — from `activity.json`

```typescript
export type TActivityType =
  | "payment" | "data_topup" | "plan_change" | "addon";

export type TActivityStatus = "completed" | "pending" | "failed";

export interface TActivity {
  id: string;
  type: TActivityType;
  description: string;
  timestamp: string;        // ISO 8601 datetime, ServerComponent formats to DD/MM/YYYY
  /** AUD cents, signed (negative = charge, positive = credit). null for non-monetary events like plan_change */
  amountAUD: number | null;
  status: TActivityStatus;
}
```

Note: real activity types differ from our original mock (`payment`,
`data_topup`, `plan_change`, `addon` — not `data_alert`, `support`,
`credit`). `amountAUD` can be `null` (plan changes have no charge), not
just optional/undefined — components must explicitly handle the null
case, not just the empty-array case already specced in `build-spec.md`.

---

## `TUsageHistoryPoint` — from `usage-history.json`

```typescript
export interface TUsageHistoryPoint {
  month: string;        // "Jan 2026" — display label, not a parseable date
  usedGB: number;
  totalGB: number;
  /** AUD cents — converted via dollarsToCents() */
  costAUD: number;
}

export type TUsageHistory = TUsageHistoryPoint[];
```

### ASSUMPTION — first month's data exceeds its own cap

`usage-history.json`'s January entry: `usedGB: 28.1, totalGB: 15` — usage
is nearly double the cap. Two readings: (a) this is a deliberate test
case for the "over cap" bar styling (`.bar.over-cap` exists in the
dashboard CSS), or (b) it's a data entry error in the source JSON (15GB
total for a `Starter` plan doesn't match June's `totalGB: 50`, suggesting
the customer was on a smaller plan in January and upgraded — which the
activity log's `plan_change` entry for June 1st doesn't fully explain
since that's a different upgrade).

**Treat as deliberate** — render it as an over-cap bar exactly like May
(`usedGB: 50.0, totalGB: 50`). Both get the `over-cap` bar style from
`designs/tokens.md`. If this turns out to be a data error, it's a content
fix in the JSON, not a logic bug in the component.

---

## `TAddon` — from `addons.json`

```typescript
export type TAddonCategory = "travel" | "data" | "entertainment" | "insurance";

export interface TAddon {
  id: string;
  name: string;
  description: string;
  /** AUD cents — converted via dollarsToCents() */
  priceAUD: number;
  active: boolean;
  category: TAddonCategory;
}
```

Full feature spec (toggle behaviour, activation flow) in
`brief/addons-feature.md`.

---

## `TTicket` — from `tickets.json`

```typescript
export type TTicketStatus = "open" | "resolved" | "closed";
export type TTicketPriority = "low" | "medium" | "high";

export interface TTicket {
  id: string;
  subject: string;
  description: string; // required — raise-ticket form always collects this; backfill existing mock tickets with a placeholder
  status: TTicketStatus;
  priority: TTicketPriority;
  createdAt: string;   // ISO 8601 datetime
  updatedAt: string;   // ISO 8601 datetime
}
```

Full feature spec (ticket creation, status flow) in
`brief/support-feature.md`.

---

## `TCustomerPublic` — composed customer session shape

Replaces the old single-object `TCustomer` from `stubs/auth-scaffold.md`.
The real data model is six separate concerns, not one nested object —
the session only needs identity + plan summary; everything else
(usage, billing, activity, addons, tickets) is fetched per-page, not
carried in the JWT.

```typescript
/** What goes in the session/JWT — identity + plan only, nothing else */
export interface TCustomerPublic {
  id: string;
  name: string;
  email: string;
  plan: TCustomerPlan;
}

/** Full customer record in the data layer — passwordHash never leaves authorize() */
export interface TCustomer extends TCustomerPublic {
  passwordHash: string;
}
```

**Why the session shape shrank:** the old design put `usageGB` and
`recentActivity` directly on the JWT-encoded customer object. With six
real data sources, encoding all of them into the JWT bloats the cookie
and means a 24-hour-stale view of fast-changing data (usage updates
constantly; a JWT only refreshes every `updateAge` interval). Each
dashboard page now fetches its own slice of data server-side via
`getServerSession` for identity + a per-page data fetch for content —
see `brief/solution-architecture.md` for the updated data flow.
