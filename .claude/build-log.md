# Build Log

Claude reads this file at the start of every session to understand current
project state. Update the status table and add a session entry when work
is completed.

---

## Status

| File / Feature | Status | Notes |
|---|---|---|
| `types/data-model.ts` | ✅ Specced | In `.claude/brief/data-model.md` — single source, copy verbatim into code |
| `types/index.ts` | ✅ Specced | In `.claude/stubs/auth-scaffold.md` — re-exports data-model.ts |
| `lib/mock-db.ts` | ✅ Specced | In `.claude/stubs/auth-scaffold.md` — matches real account.json shape |
| `lib/mock-data.ts` | ✅ Specced | Split across `.claude/brief/usage-feature.md`, `billing-feature.md`, `addons-feature.md`, `support-feature.md` |
| `lib/money.ts` | ✅ Specced | In `.claude/brief/data-model.md` — `dollarsToCents()` + `formatAUD()` |
| `lib/auth.ts` | ✅ Specced | In `.claude/stubs/auth-scaffold.md` — ready to implement |
| `lib/rate-limit.ts` | ✅ Specced | In `.claude/brief/auth-spec.md` — Upstash sketch, wire before production |
| `lib/utils.ts` | ✅ Specced | In `.claude/brief/solution-architecture.md` — `cn()`, `formatDate()`, `getGreeting()` |
| `lib/contentful.ts` | ✅ Specced | In `.claude/brief/contentful-setup.md` — now includes `getBlogPosts()` |
| `app/api/auth/[...nextauth]/route.ts` | ✅ Specced | In `.claude/stubs/auth-scaffold.md` |
| `app/api/revalidate/route.ts` | ✅ Specced | In `.claude/brief/revalidation.md` |
| `app/dashboard/actions.ts` | ✅ Specced | In `.claude/brief/addons-feature.md` — `toggleAddonAction` Server Action |
| `middleware.ts` | ✅ Specced | In `.claude/stubs/auth-scaffold.md` |
| `tailwind.config.ts` | ✅ Specced | In `.claude/designs/tokens.md` — real purple palette |
| `components/ui/button.tsx` | ✅ Specced | In `.claude/ui/button.md` — added `ghost-white` variant |
| `components/ui/card.tsx` | ✅ Specced | In `.claude/ui/card.md` — no changes needed, tokens stayed compatible |
| `components/ui/badge.tsx` | ✅ Specced | In `.claude/ui/badge.md` — 6 variants now (added `info`, renamed `accent`→`purple`) |
| `app/page.tsx` (Homepage) | ✅ Specced | In `.claude/brief/build-spec.md` — header, hero, stats, pricing, promo, blog, footer |
| `app/login/page.tsx` | ✅ Specced | In `.claude/brief/build-spec.md` — matches original spec, palette only change |
| `app/login/_components/login-form.tsx` | ✅ Specced | In `.claude/brief/build-spec.md` |
| `app/dashboard/layout.tsx` | ✅ Specced | In `.claude/brief/solution-architecture.md` — sidebar nav, shared across all sub-routes |
| `app/dashboard/page.tsx` + `_components/*` | ✅ Specced | In `.claude/brief/build-spec.md` — 9 widgets, not 5 |
| `app/dashboard/usage/page.tsx` | ⚠️ Specced — minimum viable only | No dedicated design provided, see `.claude/brief/usage-feature.md` |
| `app/dashboard/billing/page.tsx` | ⚠️ Specced — minimum viable only | No dedicated design provided, see `.claude/brief/billing-feature.md` |
| `app/dashboard/addons/page.tsx` | ✅ Specced | In `.claude/brief/addons-feature.md` — includes Server Action toggle |
| `app/dashboard/support/page.tsx` | ⚠️ Specced — data model gap | `TTicket` needs a `description` field added before the raise-ticket form works, see `.claude/brief/support-feature.md` |
| `app/dashboard/settings/page.tsx` | 🔲 Not specced | No content exists anywhere — placeholder only |
| `app/not-found.tsx` | 🔲 Not started | |
| `app/error.tsx` | 🔲 Not started | |
| Contentful `blogPost` content type | 🔲 Not created in Contentful | Specced in `.claude/brief/contentful-setup.md`, needs to be created in the actual Contentful space |
| Contentful `plan` entries | ⚠️ Needs update | Existing spec used basic/standard/unlimited tiers at wrong prices — update to Starter $39 / Plus $65 / Pro $99 |

---

## Session log

### Session 1 — 29 Jun 2026

Defined full project architecture and data shapes (pre-real-design —
all values were placeholders). Chose NextAuth v4. Specced auth scaffold,
Contentful content types, design system, folder structure.

### Session 2 — 30 Jun 2026

Fixed one-topic-per-file violations: extracted `revalidation.md`,
removed duplicated type blocks.

### Session 3 — 30 Jun 2026 — Gap review

Structured gap-finding pass: 3 critical, 4 warning, 2 assumptions found
and fixed (rate limiting, empty states, Contentful fallback, account
lockout policy, session invalidation, `loading.tsx` coverage, etc).

### Session 4 — 30 Jun 2026 — Restructure to `.claude/` convention

Moved project context under `.claude/`, split into `brief/`, `designs/`,
`rules/`, `stubs/`, `ui/` to match Claude Code's auto-discovery
convention and a reference project structure.

### Session 5 — 30 Jun 2026 — Real design files + client data integration

**This was a full rebuild against real approved assets, not an
incremental update.** Three HTML design files and seven JSON data files
were provided, replacing every placeholder value from Sessions 1–4.

**What changed and why:**

1. **Brand colour was wrong.** Spec had warm orange (`#E85D04`). Real
   design is purple (`#A100FF` accent, `#460073` dark panel). Rewrote
   `designs/tokens.md` entirely — extracted every hex value directly
   from the three HTML files rather than re-guessing. Font (Inter) was
   already correct, no change there.

2. **Data shape was invented, not real.** Original `TCustomer` was one
   nested mock object. Real data is seven separate JSON files
   (`account`, `usage`, `billing`, `activity`, `usage-history`,
   `addons`, `tickets`). Created `brief/data-model.md` as the new single
   source for all types — `stubs/auth-scaffold.md` now imports from it
   instead of defining its own shape. Session shape shrank to identity +
   plan only; usage/billing/activity moved to per-page fetches (see
   decision table in `solution-architecture.md`).

3. **Money representation conflicted with our own rule.** Real JSON
   uses dollar floats (`"amount": 65`). Our rule says cents-as-integers,
   never floats. **Decision: convert at the API boundary** —
   `dollarsToCents()` in `lib/money.ts` is the single seam; everything
   downstream stays in cents, rule intact.

4. **Scope tripled.** Original spec: 3 pages (`/`, `/login`,
   `/dashboard`). Real design: 8 pages — dashboard sidebar nav implies 5
   real sub-routes (`usage`, `billing`, `addons`, `support`, `settings`),
   confirmed as real routes per explicit instruction, not modals. Two of
   these (`usage`, `billing`) have no dedicated design beyond the
   dashboard-home widget — specced as "minimum viable, flag as known gap"
   rather than inventing UI. `settings` has zero content anywhere —
   placeholder only.

5. **Three entirely new features surfaced with real data and real UI
   patterns:** usage history (6-month bar chart), add-ons (toggle
   switches — the one mutating, non-read-only feature in the app), and
   support tickets (list + raise-ticket flow). Wrote four new feature
   briefs: `usage-feature.md`, `billing-feature.md`, `addons-feature.md`,
   `support-feature.md`.

6. **Found a new content type need:** homepage blog section requires a
   Contentful `blogPost` content type, not previously specced. Added to
   `contentful-setup.md` with a `getBlogPosts()` fetch function.

**Gaps flagged during this rebuild — need a decision before the
affected feature ships:**

- `TTicket` has no `description` field but the raise-ticket form needs
  one — data model gap, not just a UI gap (`support-feature.md`)
- Add-on toggle has no confirmation step despite being billing-affecting
  — recommended accepting toggle-as-confirm given inline pricing, but
  this was a default that was never explicitly chosen before now
  (`addons-feature.md`)
- Overage billing (`usage.json`'s `overageRate`) has no charge
  calculation logic — display-only for now, deliberately not built
  further until product answers the open questions (`usage-feature.md`,
  `data-model.md`)
- `/dashboard/usage` and `/dashboard/billing` pages have no dedicated
  design — built to minimum viable spec reusing dashboard-home widgets,
  flagged as needing real design before considered done
- `/dashboard/settings` has zero spec — placeholder page only
- Homepage mobile breakpoints are not in the design files (1280px fixed
  desktop mockups) — responsive behaviour needs a design pass, not
  invented silently
- Payment history on `/dashboard/billing` inferred from filtering
  `activity.json` — reasonable placeholder, not a confirmed architecture
  decision; flag if a dedicated billing-history API exists later

**Next session should start with:**

- Implement `lib/money.ts` and `types/data-model.ts` first — everything
  else depends on these
- Then the auth scaffold (`stubs/auth-scaffold.md`)
- Then homepage (`build-spec.md` Page 1) since it's fully specced with
  no open gaps
- Defer `/dashboard/usage`, `/dashboard/billing`, `/dashboard/settings`
  until real design exists, or build the minimum-viable versions and
  flag clearly in the UI that they're provisional

### Session 6 — 30 Jun 2026 — Pre-build spec audit and fixes

Full audit of all `.claude/` files against each other and against
framework/package realities. All blocking issues resolved before code
implementation begins.

**Fixes applied:**

| File | Fix |
|---|---|
| `stubs/auth-scaffold.md` | Install block now pins `next@14`, `next-auth@4`, `tailwindcss@3`; adds all missing packages (`clsx`, `tailwind-merge`, `@tailwindcss/typography`, `@upstash/ratelimit`, `@upstash/redis`) |
| `stubs/auth-scaffold.md` | Middleware matcher changed to `["/dashboard", "/dashboard/:path*"]` — root was not covered by `:path*` alone |
| `brief/auth-spec.md` | v5 rationale corrected — v5 is stable (2025) but a breaking API rewrite; v4 pinned deliberately |
| `brief/solution-architecture.md` | `formatDate()` fixed to strip time component before splitting — datetime strings no longer return garbage |
| `brief/solution-architecture.md` | `getGreeting()` comment fixed — `"Australia/Sydney"` handles DST automatically, no manual adjustment |
| `brief/solution-architecture.md` | Folder map: removed `app/api/addons/[id]/toggle/route.ts` (Server Action used instead), added `types/contentful.ts` |
| `brief/solution-architecture.md` | Add-on data flow updated — removed "OR POST /api/…" wording |
| `brief/contentful-setup.md` | Removed dead `createClient` import and unused `client` variable from `lib/contentful.ts` stub |
| `brief/contentful-setup.md` | `monthlyPriceAUD` field notes corrected — example was wrong price; now shows actual values (3900/6500/9900) with explicit "enter in cents" instruction |
| `brief/contentful-setup.md` | Added `TContentfulPlan` → `TPlanCatalogueEntry` field-name mapping block |
| `brief/data-model.md` | `TTicket` — added required `description: string` field |
| `brief/data-model.md` | `formatAUD()` — handles signed (negative) amounts; `−$65.00` not `$-65.00` |
| `brief/build-spec.md` | Supplementary section — replaced wrong API route entry with Server Action clarification |
| `brief/revalidation.md` | Secret comparison changed to `crypto.timingSafeEqual()` |
| `ui/badge.md` | Stale `brief/tickets-feature.md` reference corrected to `brief/support-feature.md` |
| `brief/addons-feature.md` | Added missing `import { cn } from "@/lib/utils"` to `AddonToggle` stub |
| `build-log.md` | Key decisions — v4 rationale corrected |

---

## Key decisions (do not re-litigate without strong reason)

| Decision | Rationale |
|---|---|
| NextAuth v4 | v5 is stable (shipped 2025) but a complete API rewrite — migration is breaking mid-project. v4 is maintenance-mode stable; pinned with `next-auth@4` |
| JWT session | No DB session table; token is httpOnly, never client-readable |
| Session = identity + plan only (not usage/billing/activity) | Six real data sources don't belong in one JWT; each is fetched per-page instead |
| Convert dollars→cents at the API boundary (`lib/money.ts`) | Real JSON data is float dollars; this preserves the cents-as-integer rule everywhere downstream of the conversion |
| Raw Contentful CDN fetch | SDK wraps node-fetch → bypasses Next.js fetch cache tagging |
| `authOptions` in `lib/auth.ts` | Importable by Server Components without pulling route module |
| Mock DB / mock-data repository pattern | `findCustomerByEmail`, `getUsage`, `getBilling`, etc. are the only data-access interfaces. Swap implementations for a real DB/API — nothing else changes |
| `.claude/` folder structure | Matches Claude Code's auto-discovery convention |
| Add-on toggle via Server Action, accept toggle-as-confirm | Avoids a separate REST route for one mutation; inline pricing next to the toggle is enough friction for a low-stakes subscription add-on |
| Dashboard sub-routes are real pages, not modals | Explicit instruction — confirmed over the alternative of anchors/modals on a single page |
| Design files and JSON data are the source of truth over prior briefs | Briefs predated real assets and used placeholder values; any conflict, the design/data wins |
