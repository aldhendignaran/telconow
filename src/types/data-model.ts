// ─── Plan ────────────────────────────────────────────────────────────────────

export type TPlanTier = "starter" | "plus" | "pro";

/** The customer's current plan — sourced from account.json */
export interface TCustomerPlan {
  planName: string;       // "Plus"
  planTier: TPlanTier;
  renewalDate: string;    // ISO date string e.g. "2026-07-15"
  /** AUD cents — converted from account.json's monthlyCost via dollarsToCents() */
  monthlyCostAUD: number;
  status: "active" | "suspended" | "cancelled";
}

/** Homepage pricing catalogue entry — sourced from Contentful, not account.json */
export interface TPlanCatalogueEntry {
  tier: TPlanTier;
  name: string;
  /** AUD cents */
  monthlyAUD: number;
  /** null = unlimited */
  dataLimitGB: number | null;
  description: string;
  features: string[];
  highlighted: boolean;   // true for "Plus" — drives "Most popular" badge
}

// ─── Usage ───────────────────────────────────────────────────────────────────

export interface TUsage {
  usedGB: number;
  totalGB: number;
  cycleStartDate: string;   // ISO date "2026-06-01"
  cycleEndDate: string;     // ISO date "2026-06-30"
  /** AUD per MB over the cap — kept as float; display only, never charged here */
  overageRate: number;
}

// ─── Billing ─────────────────────────────────────────────────────────────────

export interface TPayment {
  date: string;             // ISO date
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

// ─── Activity ────────────────────────────────────────────────────────────────

export type TActivityType =
  | "payment"
  | "data_topup"
  | "plan_change"
  | "addon";

export type TActivityStatus = "completed" | "pending" | "failed";

export interface TActivity {
  id: string;
  type: TActivityType;
  description: string;
  timestamp: string;        // ISO 8601 datetime — format with formatDate() for display
  /** AUD cents, signed (negative = charge, positive = credit).
   *  null for non-monetary events like plan_change. */
  amountAUD: number | null;
  status: TActivityStatus;
}

// ─── Usage History ───────────────────────────────────────────────────────────

export interface TUsageHistoryPoint {
  month: string;            // "Jan 2026" — display label only, not a parseable date
  usedGB: number;
  totalGB: number;
  /** AUD cents — converted via dollarsToCents() */
  costAUD: number;
}

export type TUsageHistory = TUsageHistoryPoint[];

// ─── Add-ons ─────────────────────────────────────────────────────────────────

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

// ─── Support Tickets ─────────────────────────────────────────────────────────

export type TTicketStatus = "open" | "resolved" | "closed";
export type TTicketPriority = "low" | "medium" | "high";

export interface TTicket {
  id: string;
  subject: string;
  description: string;      // required — raise-ticket form always collects this
  status: TTicketStatus;
  priority: TTicketPriority;
  createdAt: string;        // ISO 8601 datetime
  updatedAt: string;        // ISO 8601 datetime
}

// ─── Customer / Session ──────────────────────────────────────────────────────

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
