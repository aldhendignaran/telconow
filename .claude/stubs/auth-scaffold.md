# Auth Scaffold

Ready-to-implement. Five files in dependency order.
Run install first, then create files top to bottom.

**Types come from `brief/data-model.md`** — that file is the single
source for `TCustomerPublic`, `TCustomer`, `TCustomerPlan`, etc. This
file no longer defines its own customer shape; File 1 below just
re-exports the NextAuth module augmentation alongside imports from the
data model.

---

## Install

Pin versions explicitly — several packages in this stack have major releases with breaking APIs.

```bash
npm install next@14 next-auth@4 bcryptjs clsx tailwind-merge @upstash/ratelimit @upstash/redis
npm install -D @types/bcryptjs @tailwindcss/typography tailwindcss@3 autoprefixer postcss typescript @types/node @types/react @types/react-dom
```

For Contentful (run when starting the homepage):

```bash
npm install @contentful/rich-text-react-renderer @contentful/rich-text-types
```

---

## File 1 — `types/index.ts`

```typescript
// Re-export the data model so `@/types` stays the single import path
// used across the app — components import from here, not from
// `brief/data-model.md` (that's documentation, not a real file path).
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

import type { TCustomerPublic } from "./data-model";
import type { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session { user: TCustomerPublic & DefaultSession["user"]; }
  interface User extends TCustomerPublic {}
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT { customer: TCustomerPublic; }
}
```

## File 1b — `types/data-model.ts`

Copy the full type definitions from `brief/data-model.md` into this file
verbatim — that document is the spec; this is the implementation. Don't
hand-retype them, copy-paste to avoid drift between spec and code.

---

## File 2 — `lib/mock-db.ts`

Dev-only customer store, now matching the real `account.json` shape
(`planName`, `planTier`, `renewalDate`, `monthlyCostAUD`, `status`) —
not the old invented `TPlan` shape with `features`/`highlighted` (those
moved to `TPlanCatalogueEntry`, a homepage/Contentful concern, not part
of the customer record).

`findCustomerByEmail` and `findCustomerById` are the only data-access
interface — swap implementations for Prisma/Drizzle, nothing else changes.

**Dev credentials:**
- `alex.chen@example.com` / `Password1!` (matches dashboard design's "Alex Chen")
- `sarah.chen@example.com` / `Password2!`

```typescript
import type { TCustomer } from "@/types";
import { dollarsToCents } from "@/lib/money";

// Hashes generated at bcrypt cost factor 12.
// Regenerate: node -e "const b=require('bcryptjs');console.log(b.hashSync('Password1!',12))"
const CUSTOMERS: TCustomer[] = [
  {
    id: "cust_01",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oGYZmVTAi",
    plan: {
      planName: "Plus",
      planTier: "plus",
      renewalDate: "2026-07-15",
      monthlyCostAUD: dollarsToCents(65),
      status: "active",
    },
  },
  {
    id: "cust_02",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    passwordHash: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    plan: {
      planName: "Starter",
      planTier: "starter",
      renewalDate: "2026-07-20",
      monthlyCostAUD: dollarsToCents(39),
      status: "active",
    },
  },
];

export async function findCustomerByEmail(email: string): Promise<TCustomer | null> {
  // Swap: return db.customer.findUnique({ where: { email } })
  return CUSTOMERS.find((c) => c.email === email.toLowerCase()) ?? null;
}

export async function findCustomerById(id: string): Promise<TCustomer | null> {
  return CUSTOMERS.find((c) => c.id === id) ?? null;
}
```

**Note:** `usage.json`, `billing.json`, `activity.json`,
`usage-history.json`, `addons.json`, `tickets.json` are NOT part of this
file — per `data-model.md`'s reasoning, those are fetched per-page, not
carried on the session. Each page-level data fetch function lives
alongside its feature spec: see `brief/usage-feature.md`,
`brief/billing-feature.md`, `brief/addons-feature.md`,
`brief/support-feature.md`.

---

## File 3 — `lib/auth.ts`

Unchanged in structure from the original spec — `authorize()`,
`jwt()`, `session()` callbacks work the same way regardless of what
shape `TCustomerPublic` is, since they just pass it through. Only the
import path changed.

```typescript
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findCustomerByEmail, findCustomerById } from "@/lib/mock-db";
import type { TCustomerPublic } from "@/types";
import { checkLoginRateLimit } from "@/lib/rate-limit"; // see brief/auth-spec.md

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,  // 30 days
    updateAge: 24 * 60 * 60,     // rotate every 24 h
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const allowed = await checkLoginRateLimit(credentials.email);
        if (!allowed) return null;

        const customer = await findCustomerByEmail(credentials.email);
        if (!customer) return null;

        const valid = await bcrypt.compare(credentials.password, customer.passwordHash);
        if (!valid) return null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...safeCustomer } = customer;
        return safeCustomer;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.customer = user as TCustomerPublic;
        return token;
      }
      if (token.customer?.id) {
        const fresh = await findCustomerById(token.customer.id);
        if (!fresh) return { ...token, customer: undefined as unknown as TCustomerPublic };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...safeCustomer } = fresh;
        token.customer = safeCustomer;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.customer) session.user = token.customer;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
```

---

## File 4 — `app/api/auth/[...nextauth]/route.ts`

Unchanged.

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## File 5 — `middleware.ts` (project root)

Matcher extended — five real routes now exist beyond `/dashboard` itself
(see `brief/solution-architecture.md` for the route list).

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
```

Both entries are required. `/dashboard/:path*` matches sub-routes but **does not** match `/dashboard` itself (the root segment requires at least one path token). The root entry covers the dashboard home page. The page-level `redirect("/login")` in `dashboard/page.tsx` is belt-and-suspenders on top of this — not a substitute for it.

---

## Usage reference

### Server Component

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const { name, plan } = session.user; // identity + plan only — see data-model.md
  // Usage, billing, activity fetched separately — see respective feature briefs
}
```

### Client Component

```typescript
"use client";
import { useSession } from "next-auth/react";

export function AccountBadge() {
  const { data: session, status } = useSession();
  if (status === "loading") return <Skeleton />;
  if (!session) return null;
  return <span>{session.user.name}</span>;
}
```
