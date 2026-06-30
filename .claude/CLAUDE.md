# TelcoNow — Claude Code Context

You are working on **TelcoNow**, a fictional Australian telco marketing site
and authenticated customer portal. Read this file first, then check
`.claude/build-log.md` for current session state before touching any code.

---

## Stack (locked — do not suggest alternatives)

| Layer | Choice |
|---|---|
| Framework | Next.js 14, App Router only |
| Language | TypeScript strict mode |
| Styling | Tailwind CSS — no CSS-in-JS |
| CMS | Contentful (Delivery API) |
| Auth | NextAuth.js v4 |
| Deploy | Vercel |

## Locale

Australia — AUD cents for all monetary values, DD/MM/YYYY dates, AEST/AEDT timezone.

## Source of truth for design and data

Three approved design files in `.claude/designs/`
(`TelcoNow_Homepage_dc.html`, `TelcoNow_Dashboard_dc.html`,
`TelcoNow_Login_dc.html`) and seven JSON files in `.claude/stubs/data/`
(`account.json`, `usage.json`, `billing.json`, `activity.json`,
`usage-history.json`, `addons.json`, `tickets.json`) define the actual
brand, layout, and data shape. All briefs in `.claude/` are written
against these — if a brief and a design or data file ever disagree, the
design/data file wins and the brief needs updating, not the other way
around.

---

## `.claude/` folder map

| Folder | Contains | Read when |
|---|---|---|
| `.claude/brief/` | Specs, decisions, architecture, security | Starting any feature; touching auth, data flow, or env vars |
| `.claude/designs/` | Colour palette, type scale, spacing tokens, and the 3 raw approved HTML design files | Any UI work, before reaching for Tailwind classes; check the raw HTML when tokens.md is ambiguous |
| `.claude/rules/` | Coding standards, naming conventions | Every session — these always apply |
| `.claude/stubs/` | Ready-to-paste implementation code | Implementing something already fully specced |
| `.claude/ui/` | Button/Card/Badge component code + usage | Building any UI that needs a shared primitive |

### `.claude/brief/`

| File | Read when |
|---|---|
| `build-spec.md` | Starting any new feature or page — now covers 8 pages, not 3 |
| `data-model.md` | **Read first for any data work.** Single source for all types, matches real client JSON |
| `solution-architecture.md` | Touching folder structure, data flow, or shared utilities |
| `auth-spec.md` | Anything touching auth, session, or protected routes |
| `usage-feature.md` | `/dashboard` usage widget or `/dashboard/usage` page |
| `billing-feature.md` | `/dashboard` billing widget or `/dashboard/billing` page |
| `addons-feature.md` | `/dashboard/addons` — the one interactive/mutating feature |
| `support-feature.md` | `/dashboard/support` — ticket list + raise-ticket form |
| `vercel-setup.md` | Env vars, deployment config |
| `contentful-setup.md` | Contentful content types, fetch utilities, cache tags |
| `revalidation.md` | Implementing or touching the `/api/revalidate` webhook route |

### `.claude/stubs/`

| File | Contains |
|---|---|
| `auth-scaffold.md` | All 5 auth files: types, mock-db, authOptions, route handler, middleware |

### `.claude/ui/`

| File | Contains |
|---|---|
| `button.md` | `components/ui/button.tsx` |
| `card.md` | `components/ui/card.tsx` |
| `badge.md` | `components/ui/badge.tsx` |

---

## Coding rules

Always apply — full detail in `.claude/rules/coding-standards.md`. Don't
restate them here; that file is the single source.

---

## Before writing any code

1. Check `.claude/build-log.md` — what's already built, what's in progress.
2. Check `.claude/rules/coding-standards.md` if it's been more than a
   few turns since you last looked.
3. State the file name and its path.
4. List any new dependencies required.
5. Flag if the task touches auth, Contentful schema, or env vars.
6. Update `.claude/build-log.md` when a task is complete.
