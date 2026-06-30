# Build Spec

Public marketing site (1 page) + authenticated customer portal (6 pages).
Rewritten against approved design files (`TelcoNow_Homepage_dc.html`,
`TelcoNow_Dashboard_dc.html`, `TelcoNow_Login_dc.html`) — supersedes the
original spec, which predated real designs and used generic placeholder
content.

---

## Page 1 — `/` Homepage (public)

### Sections (in order, top to bottom)

| Section | Content source | Notes |
|---|---|---|
| Header | Hardcoded | Sticky, dark purple bg. Wordmark, nav (Plans/Coverage/Business/Support), Log in + Get started buttons |
| Hero | Contentful `homepageSetting` | Headline "Australia's fastest 5G network", subcopy, two CTAs (View plans / Check coverage), decorative network SVG illustration, "5G Now Live Nationwide" pill badge |
| Trust stats bar | Hardcoded | 3 stats: 99.8% uptime, 4.2M+ customers, ★4.8 rating — embedded in hero section, not separate Contentful content |
| Pricing | Contentful `plan` entries | 3 plans: Starter $39, Plus $65 (featured), Pro $99 — see `TPlanCatalogueEntry` in `brief/data-model.md` |
| Referral promo banner | Hardcoded | "Refer a friend, get one month free" + CTA button |
| Blog section | Contentful `blogPost` entries (NEW content type — see below) | 3 cards: category tag, title, excerpt, author, date, "Read more" link |
| Footer | Hardcoded | 4 columns: brand, Plans, Support, Legal links. Bottom bar: copyright + "All prices include GST" |

### NEW — Contentful `blogPost` content type required

Not in the original `contentful-setup.md`. Needed fields, inferred from
the design: `title` (short text), `excerpt` (short text, 2-line clamp in
UI), `category` (short text — "Technology"/"Tips"/"Company" observed),
`author` (short text), `publishDate` (date), `slug` (short text, for
future article pages — no article page is specced yet, "Read more"
links can be `#` placeholders for now). Add to `contentful-setup.md` as
a follow-up — flagging here so it's not lost.

### Acceptance criteria

- [ ] Contentful fetch uses `{ next: { tags: ['homepage'] } }` cache tag
- [ ] Pricing grid renders all plans sorted ascending by price; Plus is visually featured (2px accent border, "Most popular" badge, -8px vertical offset per `designs/tokens.md`)
- [ ] Header CTA "Get started" and hero CTAs navigate to `/login` (no signup flow specced yet — signup is out of scope, "Get started" and "Get Starter/Plus/Pro" all currently route to login)
- [ ] Fully responsive — design files are fixed-width (1280px) desktop mockups; mobile breakpoints are NOT specced in the design and need a responsive pass before this ships (flag as open work, don't invent breakpoints silently)
- [ ] No layout shift on load — `loading.tsx` skeleton matches hero + pricing grid dimensions
- [ ] Blog "Read more" and "View all articles" links are placeholders (`href="#"`) until article pages are scoped

---

## Page 2 — `/login` (public)

Matches original spec closely — design file confirms the same structure
with no material behaviour changes, just the palette swap (now purple,
not orange) and a left decorative panel with brand messaging.

### Layout

Two-panel: left 45% dark purple panel (wordmark, "Your account. Your
data. Always in control." headline, 3 checkmark bullets, decorative
ring/hex SVG), right 55% white panel with the form.

### Behaviour

- Email + password fields
- Submit calls NextAuth `signIn("credentials", { email, password, callbackUrl: "/dashboard" })`
- On success → redirect to `/dashboard` (or `callbackUrl` if set)
- On failure → inline error message beneath the form (from `?error=` query param)
- "Forgot password" → placeholder link, no functionality required
- "Get started" link (bottom) → placeholder, no signup flow specced
- Already-authenticated users visiting `/login` → redirect to `/dashboard`

### Acceptance criteria

- [ ] No full-page reload on error — error surfaces inline via query param
- [ ] Password field has show/hide toggle (eye icon, matches design exactly)
- [ ] Submit button shows loading state during auth
- [ ] Form is accessible: labels, error announced via `aria-live`
- [ ] Left panel collapses/hides below a reasonable breakpoint (not specced exactly — design is desktop-only; a sensible default is hiding the left panel under 768px and centering the form, confirm with design before shipping)
- [ ] `NEXTAUTH_URL` correctly set so redirect lands on `/dashboard`

---

## Page 3 — `/dashboard` (authenticated — overview)

Protected by `middleware.ts`. Redirect to `/login?callbackUrl=/dashboard`
if not authenticated. Shared `dashboard/layout.tsx` renders the sidebar
(Dashboard/Usage/Billing/Add-ons/Support/Settings nav + user avatar +
logout) across this and all sub-routes.

### Widgets (12-column grid, spans noted)

| Widget | Span | Data source | Notes |
|---|---|---|---|
| Page header | full | `session.user.name` + current date | "Good morning, Alex." + "Monday, 23 June 2026 · Your next bill is in 22 days" — the "X days" is computed from `billing.nextPayment.date` |
| Plan summary | 4 | `session.user.plan` | Plan name, badge (data allowance), price, renewal date, contract status, "Manage plan →" link to `/dashboard/billing` |
| Data usage meter | 8 | `usage.json` | Used/total GB, % badge, progress bar (purple → warning-accent past cap), 3 stat tiles: Remaining, Cycle dates, Overage rate |
| Billing overview | 4 | `billing.json` | Next payment amount + due date, last payment + status badge, payment method (card type icon + last4), "Billing history →" link to `/dashboard/billing` |
| Recent activity | 8 | `activity.json` (latest 4) | Icon + description + date, amount (or "—" if null), status badge. "View all →" link to a future activity page (not yet specced — currently just links to `/dashboard/billing` as the closest existing page, or omit the link until a dedicated activity view exists — flag this as an open question, don't invent a destination) |
| Usage history chart | 12 | `usage-history.json` | 6-month bar chart, current month dashed/highlighted, cap reference line, legend (Data used / At cap / 50GB cap line) |
| Support tickets | 4 | `tickets.json` (summary) | Open count badge, 2 most recent ticket cards (subject, status, priority, date), "+ Raise a ticket" button to `/dashboard/support` |
| Add-ons | 6 | `addons.json` (summary) | 3 add-ons shown with icon, name, price, toggle switch, "Explore more →" link to `/dashboard/addons` |
| Upgrade banner | 6 | Computed from `usage.json` | Shows only if usage % exceeds a threshold (design shows it at 77% used) — see open question below |

### ASSUMPTION — upgrade banner trigger threshold

The design shows the upgrade banner at "77% used" with copy "You've used
77% of your data." This implies the banner is conditional, not always
shown. No threshold is specified anywhere.

**Decision: show the banner when usage ≥ 75%** of `totalGB`, hide it
otherwise. 75% is a reasonable round-number guess matching the "warning"
badge state already used elsewhere at a similar threshold — confirm with
product before relying on this exact number for a real launch.

### Acceptance criteria

- [ ] `getServerSession(authOptions)` for identity; separate fetches for usage/billing/activity/usage-history/tickets/addons (see `solution-architecture.md` data flow)
- [ ] Belt-and-suspenders `redirect("/login")` if session is null
- [ ] All monetary values formatted via `formatAUD()` from `lib/money.ts`
- [ ] Data usage bar's overage segment only renders if `usedGB > totalGB`
- [ ] Activity feed shows 4 most recent, sorted by `timestamp` descending
- [ ] Usage history bars: current month gets dashed border + `accent` text colour per design; months at/over cap get `over-cap` bar style
- [ ] Sign out (sidebar) calls `signOut({ callbackUrl: "/" })`
- [ ] Upgrade banner hidden entirely (not just empty) when usage is below threshold

---

## Page 4 — `/dashboard/usage`

Full usage detail page — referenced by sidebar "Usage" nav item but not
shown in the provided dashboard design (the design only shows the
dashboard-home usage *widget*, not a dedicated usage page).

**Open question — minimum viable spec:** until a dedicated usage-page
design exists, build this page reusing the dashboard's data usage meter
+ usage history chart widgets at full width, with no additional content
invented. Don't design new UI for this page speculatively — extend with
real design once provided. Track in `build-log.md` as a known gap.

Full data + feature notes in `brief/usage-feature.md`.

---

## Page 5 — `/dashboard/billing`

Full billing page — sidebar nav item, not shown in detail in the
provided design beyond the dashboard-home billing *widget*.

**Open question — same as usage page.** Minimum viable: billing overview
widget at full width + a payment history list (using `activity.json`
filtered to `type: "payment"`, since no dedicated billing-history JSON
was provided — confirm this is the intended data source, it's an
inference, not a stated fact).

Full data + feature notes in `brief/billing-feature.md`.

---

## Page 6 — `/dashboard/addons`

Full add-ons marketplace. This page has a real design pattern (toggle
switches, active/inactive states) even though no dedicated full-page
mockup was provided — the dashboard widget shows the interaction pattern
clearly enough to extend to a full marketplace view.

Full spec in `brief/addons-feature.md`.

---

## Page 7 — `/dashboard/support`

Ticket list + raise-ticket flow. Dashboard widget shows ticket card
pattern (subject, status badge, priority badge, date) and a "+ Raise a
ticket" button — full page extends this to the complete list + a form.

Full spec in `brief/support-feature.md`.

---

## Page 8 — `/dashboard/settings`

**No content specced anywhere.** Sidebar nav item exists, nothing else
does. Build only a placeholder page ("Settings coming soon") until
design/product scope this. Do not invent settings fields.

---

## Supplementary

### `app/api/revalidate/route.ts`

Specced in `brief/revalidation.md` — single source for this route.

### Add-on toggle — Server Action, not a route file

The toggle uses `toggleAddonAction()` in `app/dashboard/actions.ts`. Do **not** create `app/api/addons/[id]/toggle/route.ts` — that file was removed in favour of a Server Action. See `brief/addons-feature.md` for the full implementation.

### `app/not-found.tsx`

Custom 404 page. TelcoNow branding (purple), link back to `/`.

### `app/error.tsx`

`"use client"` error boundary. Generic message + retry button.
