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
| `lib/mock-db.ts` | ✅ Built | Two test users (Alex Chen / Plus, Sarah Chen / Starter); findCustomerByEmail + findCustomerById |
| `lib/mock-data.ts` | ✅ Specced | Split across `.claude/brief/usage-feature.md`, `billing-feature.md`, `addons-feature.md`, `support-feature.md` |
| `lib/money.ts` | ✅ Specced | In `.claude/brief/data-model.md` — `dollarsToCents()` + `formatAUD()` |
| `lib/auth.ts` | ✅ Built | CredentialsProvider + jwt/session callbacks; bcrypt compare; NEXTAUTH_SECRET from env |
| `lib/mock-db.ts` | ✅ Built | Two test users (Alex Chen / Plus, Sarah Chen / Starter); findCustomerByEmail + findCustomerById |
| `lib/rate-limit.ts` | ✅ Built | Bypasses when UPSTASH_REDIS_REST_URL unset (dev); uses Upstash sliding window in production |
| `lib/utils.ts` | ✅ Specced | In `.claude/brief/solution-architecture.md` — `cn()`, `formatDate()`, `getGreeting()` |
| `lib/contentful.ts` | ✅ Specced | In `.claude/brief/contentful-setup.md` — now includes `getBlogPosts()` |
| `app/api/auth/[...nextauth]/route.ts` | ✅ Specced | In `.claude/stubs/auth-scaffold.md` |
| `app/api/revalidate/route.ts` | ✅ Specced | In `.claude/brief/revalidation.md` |
| `app/dashboard/actions.ts` | ✅ Specced | In `.claude/brief/addons-feature.md` — `toggleAddonAction` Server Action |
| `middleware.ts` | ✅ Specced | In `.claude/stubs/auth-scaffold.md` |
| `tailwind.config.ts` | ✅ Specced | In `.claude/designs/tokens.md` — real purple palette |
| `components/SiteHeader.tsx` | ✅ Built | TN-001 — Server Component, uses NavLink + Container; NavLink updated to dark-bg colours |
| `components/SiteFooter.tsx` | ✅ Built | TN-002 — Server Component, uses Container + Stack + Cluster + Text + Link atoms |
| `components/TrustBar.tsx` | ✅ Built | No story yet — built from HeroSection AC + design HTML. 3 stats + dividers inside HeroSection |
| `components/HeroSection.tsx` | ✅ Built | TN-003 — Server Component; SVG extracted to HeroIllustration.tsx; TrustBar composed inside section |
| `components/HeroIllustration.tsx` | ✅ Built | Colocated SVG — aria-hidden, only used by HeroSection |
| `components/PlansSection.tsx` | ✅ Built | TN-004 — async Server Component; maps TContentfulPlan→TPlanCatalogueEntry; exports PlansSectionSkeleton |
| `lib/contentful.ts` | ✅ Built | getPlans / getHomepageSetting / getBlogPosts; cache tag "homepage" |
| `components/PromoBanner.tsx` | ✅ Built | TN-005 — static Server Component; gift SVG inlined; CTA is `<a href="#">` with button classes |
| `components/BlogSection.tsx` | ✅ Built | TN-006 — async Server Component; exports BlogSectionSkeleton; formatDateLong added to lib/utils.ts |
| `components/ui/button.tsx` | ✅ Specced | In `.claude/ui/button.md` — added `ghost-white` variant |
| `components/ui/card.tsx` | ✅ Specced | In `.claude/ui/card.md` — no changes needed, tokens stayed compatible |
| `components/ui/badge.tsx` | ✅ Specced | In `.claude/ui/badge.md` — 6 variants now (added `info`, renamed `accent`→`purple`) |
| `app/page.tsx` (Homepage) | ✅ Built | Composes SiteHeader + HeroSection + PlansSection + PromoBanner + BlogSection + SiteFooter; Suspense boundaries around async sections |
| `app/loading.tsx` | ✅ Built | Full-page skeleton matching hero + pricing grid dimensions |
| `app/login/page.tsx` | ✅ Built | TN-007 — Server Component; getServerSession redirect + Suspense wrapper for LoginPanel |
| `components/LoginPanel.tsx` | ✅ Built | TN-007 — "use client"; two-panel layout, email+password form, signIn("credentials"), callbackUrl passthrough |
| `app/dashboard/layout.tsx` | ✅ Built | Auth guard + Sidebar; `getServerSession` → redirect if no session |
| `app/dashboard/page.tsx` | ✅ Built | Composes all 9 widgets; `Promise.all` parallel data fetch |
| `app/dashboard/loading.tsx` | ✅ Built | Full skeleton matching widget grid layout |
| `app/dashboard/_components/PlanSummaryCard.tsx` | ✅ Built | Static `DATA_LIMIT` lookup by planTier (dataLimitGB not in TCustomerPlan) |
| `app/dashboard/_components/UsageMeterCard.tsx` | ✅ Built | Two-segment overage bar, 3 StatTiles |
| `app/dashboard/_components/BillingCard.tsx` | ✅ Built | Inline VisaIcon SVG; only Visa implemented (Mastercard/Amex flagged as gap) |
| `app/dashboard/_components/ActivityFeed.tsx` | ✅ Built | 4 activity types → icon tiles; Badge per type+status; "View all" → /dashboard/billing |
| `app/dashboard/_components/SupportTickets.tsx` | ✅ Built | Recent 3 tickets; status + priority badges; empty state with CTA |
| `app/dashboard/_components/UsageHistoryChart.tsx` | ✅ Built | Bar chart from TUsageHistoryPoint[]; overage bars use bg-warning-accent; tooltip on hover |
| `app/dashboard/_components/AddOnsCard.tsx` | ✅ Built | First 3 add-ons; composites AddonToggle client component |
| `app/dashboard/_components/UpgradeBanner.tsx` | ✅ Built | Renders null if planTier==="pro" OR usedGB/totalGB<0.75 |
| `components/Sidebar.tsx` | ✅ Built | Server Component; 6 nav items with lucide icons; UserChip + LogoutButton at bottom |
| `components/LogoutButton.tsx` | ✅ Built | "use client"; signOut with callbackUrl="/" |
| `app/dashboard/actions.ts` | ✅ Built | toggleAddonAction server action; revalidatePath /dashboard + /dashboard/addons |
| `app/dashboard/addons/_components/addon-toggle.tsx` | ✅ Built | "use client"; useTransition + toggleAddonAction |
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

### Session 16 — 2 Jul 2026 — Dashboard page + all 9 widgets built

Completed the full dashboard implementation. All 6 remaining files written:
`ActivityFeed.tsx`, `SupportTickets.tsx`, `UsageHistoryChart.tsx`, `AddOnsCard.tsx`,
`UpgradeBanner.tsx`, and `app/dashboard/page.tsx`.

TypeScript checked clean (0 errors). Dev server confirmed: all 7 widget labels
render in HTML after authenticated session (`admin@admin` / `admin`).

Known gaps carried forward:
- Mastercard/Amex SVGs not implemented in BillingCard — only Visa
- ActivityFeed "View all →" routes to `/dashboard/billing` as fallback (no dedicated activity page)
- UsageHistoryChart uses simple bar divs, not a charting library — acceptable for MVP

### Session 15 — 2 Jul 2026 — UpgradeBanner story (TN-017)

Completed `stories/UpgradeBanner.md` (TN-017). Purely presentational component — no data fetching, no loading/error state of its own.

Key flags raised:
- Dynamic plan copy ("Upgrade to Pro") is hardcoded in design — if Starter-tier users also need the banner, copy must become a prop
- "$99/mo" price is hardcoded — may need to derive from plan catalog prop
- "Upgrade now" and "Compare plans →" CTA destinations are `href="#"` in design — need product decision before building
- Pro-tier suppression: banner must also check `planTier === "pro"` and render nothing even if usage ≥ 75%

All 10 dashboard stories now complete (TN-008 through TN-017).

### Session 14 — 2 Jul 2026 — Dashboard component stories (TN-008 to TN-016)

Completed story files for all 9 dashboard components. TN-008 through TN-015 were written in the previous context window; TN-016 (AddOnsCard) completed at the start of this session.

Stories written:

| ID | Story file | Key flags |
|---|---|---|
| TN-008 | `stories/AppShell.md` | Mobile sidebar not specced — known gap |
| TN-009 | `stories/Sidebar.md` | Avatar bg: design uses bg-accent, atom uses bg-accent-tint2 — override with className |
| TN-010 | `stories/PlanSummaryCard.md` | `dataLimitGB` not in TCustomerPlan — add to account.json + type before building |
| TN-011 | `stories/UsageMeterCard.md` | `formatCycleDate()` needed for "D MMM" format; badge at 76.8% shows warning (inconsistent with 80% threshold label) |
| TN-012 | `stories/BillingCard.md` | Mastercard/Amex SVGs not in design — resolve before building BillingCard |
| TN-013 | `stories/ActivityFeed.md` | "View all →" destination undefined in build-spec; subtitle context text (e.g. "5GB added") not in activity.json |
| TN-014 | `stories/SupportTickets.md` | "high" priority badge colour undefined; 0 open badge variant unspecced |
| TN-015 | `stories/UsageHistoryChart.md` | current-month + over-cap visual conflict not shown in design; current-month style takes precedence per AC |
| TN-016 | `stories/AddOnsCard.md` | `billingType` field missing from TAddon — needed for "/mo" vs "one-off" price suffix; sub-detail text ("Asia Pacific", "Standard HD") not in addons.json |

**Pending before building any dashboard component:**
- Add `formatCycleDate()` to `lib/utils.ts` (needed by UsageMeterCard — TN-011)
- Add `dataLimitGB` to `account.json` + `TCustomerPlan` type (needed by PlanSummaryCard — TN-010)
- Add `billingType: "monthly" | "once"` to `addons.json` + `TAddon` type (needed by AddOnsCard — TN-016)
- Decide "View all →" destination for ActivityFeed (TN-013)
- Source/decide Mastercard + Amex SVGs for BillingCard (TN-012)

### Session 13 — 2 Jul 2026 — app/page.tsx + Contentful setup

Built `app/page.tsx` (composes all homepage components with Suspense boundaries) and `app/loading.tsx` (full-page skeleton).

Fixed Contentful: space had wrong content types (basic/plus/premium schema, wrong field names). Deleted old plan entries + content type, recreated all three content types (`plan`, `homepageSetting`, `blogPost`) via Management API, populated with correct entries (Starter/Plus/Pro plans, 1 homepage setting, 3 blog posts), published all. Fixed `CONTENTFUL_ACCESS_TOKEN` in `.env.local` — was set to CFPAT personal access token, now set to correct CDA token.

### Session 12 — 1 Jul 2026 — BlogSection (TN-006)

Built `components/BlogSection.tsx` (async Server Component) and added `formatDateLong()` to `lib/utils.ts`.

**Design vs story deviations (design won both):**
- Header h2 is 32px in the design; `SectionHeader` molecule renders `text-2xl` (24px) — built the left header column manually with `text-[32px]`, overriding `Heading level={2}` default via className/tailwind-merge. Did not use `SectionHeader`.
- Accent bar colour order: story note says `[accent, accent-hover, panel]`; design shows `[accent, panel, accent-hover]` — used design order.

**Component decisions:**
- try/catch inside the component — same PlansSection pattern — because "section heading still visible on error" AC can't be met by page.tsx-level error handling.
- `TContentfulBlogPost` used directly — no mapped type needed, fields map 1:1 to display requirements.
- `BlogCard` as a local function (same pattern as PlansSection's `PlanCard`).
- Card footer: raw `<div className="flex items-center justify-between …">` — no `gap-*` class so the "use Cluster" composition rule doesn't apply.
- Author block: `Stack className="gap-0.5"` (2px, overrides Stack default via tailwind-merge).
- `cn("h-2 w-full", accentBars[index])` — complete static class strings in the array, Tailwind scans them correctly.
- `BlogSectionSkeleton` exported as named export for `<Suspense fallback>` in app/page.tsx.

### Session 11 — 1 Jul 2026 — PromoBanner (TN-005)

Built `components/PromoBanner.tsx`. Static Server Component — no data fetching, no loading/error states.

Key decisions:
- Outer `<section>` used directly (not `Section` layout primitive) because `Section` forces `py-16/20` padding and this component needs a fixed `h-[120px]` flex-centred layout.
- Left side: `Cluster className="gap-5"` — `gap-5` (20px) overrides the Cluster default `gap-2` via tailwind-merge. Established override pattern.
- Copy block: plain `<div>` with `mb-1` on the heading — not a flex-col div, so the Stack composition rule doesn't apply.
- Heading: `text-[22px] font-bold tracking-tight text-text-primary` per story note (no named token at 22px).
- Sub-copy: `text-[15px] text-text-secondary` (design: 15px / `#4A4A5A`).
- CTA: `<a href="#">` with Button primary/md Tailwind classes + `shrink-0` (story AC: "does not wrap or shrink"). Never wrap Button in anchor — established project pattern.
- Gift SVG: inlined as local `GiftIcon` function. Stroke colour `#460073` as hex — SVG stroke attrs can't use CSS custom properties.

### Session 10 — 1 Jul 2026 — PlansSection (TN-004)

Built `components/PlansSection.tsx` (async Server Component), created
`lib/contentful.ts` (getPlans/getHomepageSetting/getBlogPosts), and made
three minor non-breaking additions to existing files.

**Modifications to existing files:**
- `Section.tsx` — added `id?: string` prop (needed for `id="plans"` anchor scroll)
- `Badge.tsx` — added `className?: string` prop (needed for absolute-positioning the "Most popular" pill)
- `types/contentful.ts` — added `description?: string` to TContentfulPlan.fields (per story note — must also add the field in Contentful UI)

**PlansSection decisions:**
- Error handling via try/catch inside the component — not page.tsx — because the AC requires "section heading is still visible on error", which only works if the component renders the fallback itself. The note saying "error handling in page.tsx" contradicts the AC; AC wins.
- `PlanCard` extracted as a local function (not a registered component — only used inside PlansSection).
- Check icon built as local inline SVG per story note ("not a lucide icon").
- CTA buttons rendered as NextLink with button Tailwind classes (established project pattern).
- `formatAUD(monthlyAUD).replace(/\.00$/, "")` for price display → `$39` not `$39.00`.
- Featured card uses `-my-2` offset inside CSS Grid; grid overflow visible by default makes the protrude-above/below effect work.
- `PlansSectionSkeleton` exported as a named export — used by page.tsx as `<Suspense fallback={<PlansSectionSkeleton />}>`.
- `description` field maps to `p.fields.description ?? ""` — defaults to empty string until Contentful field is added. The Contentful plan content type still needs a `description` Short text field added in the Contentful UI.

### Session 9 — 1 Jul 2026 — HeroSection (TN-003) + TrustBar

Built `components/TrustBar.tsx` (no story file — built entirely from HeroSection
AC + design HTML data), `components/HeroIllustration.tsx` (SVG extraction,
aria-hidden), and `components/HeroSection.tsx`.

Key decisions:
- CTA links use plain `<a>` elements with button Tailwind classes (same pattern
  as SiteHeader) — `href="#plans"` is a same-page anchor, not a Next.js route.
- SVG extracted to HeroIllustration.tsx as the story notes suggest; avoids a
  100-line HeroSection. All SVG camelCase attribute conversions applied.
- TrustBar owns its own `border-t border-white/10` outer wrapper and its own
  Container — placed inside `<section>` after Container so the border spans
  full width while content aligns with the max-w constraint.
- Stack gap-0.5 (2px) override used for stat value+label pairs in TrustBar.
- `Cluster gap={4} className="mt-2"` for CTA row: 16px gap between buttons,
  8px extra top margin on top of Stack's 24px gap = 32px total from sub-copy
  to CTAs (matches design's gap+margin-top stack).

### Session 8 — 1 Jul 2026 — SiteFooter (TN-002)

Built `components/SiteFooter.tsx`. Pure Server Component. Four-column layout
uses Cluster (outer row, `gap-12`, `items-start`) + Stack (per-column, brand
`flex-[1.4]`, others `flex-1`). Column headings use `Text variant="label"
color="secondary"`. Links use `Link variant="inverse"`. Bottom bar uses a
`Cluster className="justify-between"` with `border-t border-panel-alt`.
Wordmark uses `NextLink` directly (same pattern as SiteHeader — avoids
fighting Link atom's variant colour classes).

Token note: `bg-panel-alt` and `border-panel-alt` both resolve to `#1E1E2E`.
The HTML design uses `#0F0F1A` for the footer bg (slightly darker) and
`#1E1E2E` for the bottom bar hairline — making the divider visible in the
design. Our token system doesn't have a separate bg token for `#0F0F1A`,
so the divider will be invisible at the token level. Flag for a future token
pass if pixel-fidelity is required.

### Session 7 — 1 Jul 2026 — SiteHeader (TN-001)

Built `components/SiteHeader.tsx`. Server Component; `"use client"` boundary
lives inside NavLink as specified. Fixed NavLink inactive colours from
`text-text-primary hover:text-accent` (light-bg) to `text-text-onDarkMuted
hover:text-text-inverse` — NavLink is documented as SiteHeader-specific so
the correction is in-scope. CTA buttons rendered as NextLink to avoid invalid
`<a><button>` HTML; ghost-white and primary button classes applied directly.

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
