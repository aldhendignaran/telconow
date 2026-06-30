# Solution Architecture

---

## Folder structure

Five real routes added under `/dashboard` (was a single page) — sidebar
nav in the approved design implies Usage, Billing, Add-ons, Support,
Settings as full pages, not modals. See `brief/build-spec.md` for each
page's content.

```
telconow/
├── CLAUDE.md                          # Claude Code root context (read first)
├── build-log.md                       # Session state — Claude reads every session
│
├── app/
│   ├── layout.tsx                     # Root layout — font, SessionProvider
│   ├── page.tsx                       # Homepage /
│   ├── loading.tsx                    # Homepage skeleton — matches layout, no layout shift
│   ├── not-found.tsx                  # Custom 404
│   ├── error.tsx                      # "use client" error boundary
│   │
│   ├── login/
│   │   ├── page.tsx                   # Login page
│   │   └── _components/
│   │       └── login-form.tsx         # "use client" — form, signIn(), error state
│   │
│   └── dashboard/
│       ├── layout.tsx                 # Sidebar nav, shared across all dashboard/* pages
│       ├── page.tsx                   # Dashboard home — getServerSession + overview widgets
│       ├── loading.tsx                # Dashboard skeleton — matches widget layout
│       ├── _components/
│       │   ├── account-summary.tsx
│       │   ├── data-usage-bar.tsx
│       │   ├── activity-feed.tsx
│       │   ├── usage-history-chart.tsx
│       │   ├── upgrade-banner.tsx
│       │   └── sidebar-nav.tsx
│       │
│       ├── usage/
│       │   ├── page.tsx               # Full usage page — see brief/usage-feature.md
│       │   └── loading.tsx
│       │
│       ├── billing/
│       │   ├── page.tsx               # Full billing page — see brief/billing-feature.md
│       │   └── loading.tsx
│       │
│       ├── addons/
│       │   ├── page.tsx               # Add-ons marketplace — see brief/addons-feature.md
│       │   ├── loading.tsx
│       │   └── _components/
│       │       └── addon-toggle.tsx   # "use client" — Server Action wrapper
│       │
│       ├── support/
│       │   ├── page.tsx               # Ticket list + raise-ticket — see brief/support-feature.md
│       │   ├── loading.tsx
│       │   └── _components/
│       │       └── raise-ticket-form.tsx  # "use client"
│       │
│       └── settings/
│           ├── page.tsx               # Account settings — NOT YET SPECCED, see open question below
│           └── loading.tsx
│
└── app/api/
    ├── auth/[...nextauth]/route.ts    # NextAuth handler (thin wrapper)
    ├── revalidate/route.ts            # Contentful webhook revalidation
    # No addons toggle route — toggle uses a Server Action (app/dashboard/actions.ts)

components/                            # Shared across 2+ pages
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   └── badge.tsx
├── nav.tsx                            # Homepage header nav
└── footer.tsx

lib/
├── auth.ts                            # authOptions — imported by route + getServerSession
├── contentful.ts                      # Typed Contentful client + fetch helpers
├── mock-db.ts                         # Dev customer store (swap for real DB)
├── mock-data.ts                       # Dev usage/billing/activity/addon/ticket stores
├── money.ts                           # dollarsToCents(), formatAUD() — see brief/data-model.md
├── rate-limit.ts                      # Upstash login + revalidate rate limiting
└── utils.ts                           # cn(), formatDate(), getGreeting()

types/
├── index.ts                           # Re-exports data-model.ts + NextAuth module augmentation
├── data-model.ts                      # All T* interfaces — implementation of brief/data-model.md
└── contentful.ts                      # TContentfulPlan, TContentfulHomepageSetting, TContentfulBlogPost

middleware.ts                          # Route protection — Edge Runtime
.env.local                             # Never committed
.env.local.example                     # Committed — template for new devs
```

### ASSUMPTION — `/dashboard/settings` has no content spec

The sidebar nav in the dashboard design includes a "Settings" item, but
no design file, JSON, or brief covers what settings exist (profile
edit? notification preferences? password change?). Scaffolding the
route and folder now so the structure is correct, but `page.tsx` content
is an open question — flag to design/product before building beyond a
placeholder "Settings coming soon" page.

---

## Data flow

### Public pages (homepage)

```
Contentful CMS
  → lib/contentful.ts (Delivery API, cache tag: 'homepage')
  → app/page.tsx (Server Component)
  → Pricing / Hero / Features / Blog components (Server Components)
```

### Authentication

```
/login form (Client Component)
  → signIn("credentials", { email, password })
  → app/api/auth/[...nextauth]/route.ts
  → lib/auth.ts → authorize() → lib/rate-limit.ts (check) → lib/mock-db.ts
  → JWT encoded (httpOnly cookie) — identity + plan only, see data-model.md
  → redirect /dashboard
```

### Protected pages (dashboard and all sub-routes)

```
Request hits middleware.ts (Edge)
  → withAuth checks JWT → valid: pass through | invalid: redirect /login
  → app/dashboard/layout.tsx (Server Component, wraps SessionProvider) — renders sidebar, wraps all sub-pages
  → each app/dashboard/{route}/page.tsx (Server Component):
      getServerSession(authOptions) → session.user (identity + plan)
      + page-specific data fetch (lib/mock-data.ts — usage/billing/activity/addons/tickets)
  → page components receive data as props (no client fetch)
```

This is a change from the original single-dashboard-page design: each
sub-route now does its own `getServerSession` + its own data fetch,
rather than one page fetching everything and passing it down through
widget props. Six separate JSON-backed concerns don't belong in one
mega-fetch — each page only loads what it needs.

### Add-on toggle (Server Action)

```
addon-toggle.tsx (Client Component, renders the switch)
  → toggleAddonAction() Server Action (app/dashboard/actions.ts)
  → lib/mock-data.ts — update addon.active
  → revalidatePath('/dashboard/addons')
  → UI reflects new state
```

Full spec in `brief/addons-feature.md` — flagging the shape here since
it's the one interactive (not just read-only) feature outside auth.

### Contentful revalidation

```
Contentful publish webhook
  → POST /api/revalidate (Authorization: Bearer secret)
  → revalidateTag('homepage')
  → Next.js purges cached Contentful fetches
```

---

## Shared utilities — `lib/utils.ts`

Note: `formatAUD()` moved to `lib/money.ts` alongside `dollarsToCents()`
since they're the same concern (money representation) — see
`brief/data-model.md`. `lib/utils.ts` keeps only the generic helpers.

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely — use everywhere for conditional classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO date or datetime string as DD/MM/YYYY for display.
 * formatDate("2026-07-15") → "15/07/2026"
 * formatDate("2026-06-19T10:15:00Z") → "19/06/2026"
 */
export function formatDate(isoDate: string): string {
  const datePart = isoDate.split("T")[0]; // strips time component from datetime strings
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Time-aware greeting.
 * getGreeting() → "Good morning" | "Good afternoon" | "Good evening"
 * "Australia/Sydney" handles AEST/AEDT DST automatically — no manual adjustment needed.
 */
export function getGreeting(): string {
  const hour = new Date(
    new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })
  ).getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
```

`lib/money.ts` content is specced in full in `brief/data-model.md` —
single source, don't duplicate here.

---

## `loading.tsx` coverage

Every route with a Server Component data fetch needs a matching
`loading.tsx` so the skeleton renders during fetch rather than a blank
screen. With six dashboard sub-routes now, this is six skeleton files,
not two. Each skeleton should match its real page's grid layout
(`grid-cols-12` spans per `brief/build-spec.md`) so there's no layout
shift when content arrives.

---

| Decision | Rationale |
|---|---|
| Server Components by default | No client bundle, no waterfall, data at TTFB |
| Per-route data fetch, not one mega-fetch | Six real data sources (account/usage/billing/activity/usage-history/addons/tickets) don't belong in one JWT or one page fetch — each route loads only what it needs |
| `authOptions` in `lib/auth.ts` not in the route | Importable by Server Components and Server Actions without pulling the route module |
| Contentful Delivery API only | Management API is write-only; no reason to expose write credentials to the app |
| Monetary values as AUD cents (integers), converted at the boundary | Real JSON data arrives as dollar floats — `dollarsToCents()` is the single conversion seam; float-safety rule holds everywhere downstream |
| Mock DB repository pattern | `findCustomerByEmail` / `findCustomerById` are the only data-access interface. Swap implementations for Prisma/Drizzle — nothing else changes |
| Add-on toggle via Server Action | Avoids a full client-side data-fetching library for one mutation; `revalidatePath` keeps it simple |
