// Re-export the full data model so `@/types` is the single import path
// across the app — components import from here, not from data-model.ts directly.
export type {
  TPlanTier,
  TCustomerPlan,
  TPlanCatalogueEntry,
  TUsage,
  TPayment,
  TLastPayment,
  TPaymentMethod,
  TBilling,
  TActivityType,
  TActivityStatus,
  TActivity,
  TUsageHistoryPoint,
  TUsageHistory,
  TAddonCategory,
  TAddon,
  TTicketStatus,
  TTicketPriority,
  TTicket,
  TCustomerPublic,
  TCustomer,
} from "./data-model";

// ─── NextAuth module augmentation ────────────────────────────────────────────
// Extends the default Session and JWT shapes so TypeScript knows about our
// custom customer fields without type assertions throughout the app.

import type { TCustomerPublic } from "./data-model";
import type { DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: TCustomerPublic & DefaultSession["user"];
  }
  interface User extends TCustomerPublic {}
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    customer: TCustomerPublic;
  }
}
