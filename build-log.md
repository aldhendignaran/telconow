# TelcoNow — Project Build Log

Track implementation progress here. Update status as each item is completed.

---

## Setup Checklist

- [ ] `npm run dev` running locally — `http://localhost:3000` loads without errors
- [ ] Vercel URL live — project deployed and accessible at production URL
- [ ] `.env.local` has Contentful keys — `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` filled in
- [ ] `tailwind.config.ts` has brand tokens — all accent/panel/text/state colours present, `npm run dev` shows correct purple palette
- [ ] `component-registry.md` copied to `src/ui/` — shared component usage reference in place

---

## Implementation Status

| File / Feature | Status | Notes |
|---|---|---|
| Project scaffold | ✅ Done | package.json, tsconfig, next.config, tailwind, postcss, middleware |
| `tailwind.config.ts` | ✅ Done | All brand tokens + shadow-card from `.claude/designs/tokens.md` |
| `src/app/layout.tsx` | ✅ Done | Inter font via next/font/google, --font-inter CSS var |
| `src/app/globals.css` | ✅ Done | Tailwind base/components/utilities |
| Folder structure | ✅ Done | All routes + lib + types + components scaffolded |
| `stubs/` JSON files | ✅ Done | 7 files copied from .claude/stubs/data/ |
| `src/app/api/stub/[name]/route.ts` | ✅ Done | Serves all 7 stub JSON files at /api/stub/:name |
| `src/app/api/auth/[...nextauth]/route.ts` | ✅ Done | Handler wired; authOptions placeholder in src/lib/auth.ts |
| `middleware.ts` | ✅ Done | Protects /dashboard and /dashboard/:path* |
| `.env.local` | ✅ Done | All 7 required env vars with instructions |
| `.env.local.example` | ✅ Done | Committed template for new devs |
| `src/lib/auth.ts` | 🔲 Placeholder | Full implementation: .claude/stubs/auth-scaffold.md File 3 |
| `src/lib/mock-db.ts` | 🔲 Not started | Spec: .claude/stubs/auth-scaffold.md File 2 |
| `src/lib/mock-data.ts` | 🔲 Not started | Spec: .claude/brief/usage-feature.md, billing-feature.md, addons-feature.md, support-feature.md |
| `src/lib/money.ts` | ✅ Done | dollarsToCents(), formatAUD() with signed-amount support |
| `src/lib/rate-limit.ts` | 🔲 Not started | Spec: .claude/brief/auth-spec.md |
| `src/lib/contentful.ts` | 🔲 Not started | Spec: .claude/brief/contentful-setup.md |
| `src/lib/utils.ts` | ✅ Done | cn(), formatDate() (datetime-safe), getGreeting() |
| `src/types/data-model.ts` | ✅ Done | All T* interfaces from .claude/brief/data-model.md |
| `src/types/index.ts` | ✅ Done | Re-exports + NextAuth module augmentation |
| `src/types/contentful.ts` | ✅ Done | TContentfulPlan, TContentfulHomepageSetting, TContentfulBlogPost |
| `src/components/ui/button.tsx` | 🔲 Not started | Spec: .claude/ui/button.md |
| `src/components/ui/card.tsx` | 🔲 Not started | Spec: .claude/ui/card.md |
| `src/components/ui/badge.tsx` | 🔲 Not started | Spec: .claude/ui/badge.md |
| `src/components/nav.tsx` | 🔲 Not started | Homepage header nav |
| `src/components/footer.tsx` | 🔲 Not started | Homepage footer |
| `src/app/page.tsx` | 🔲 Not started | Spec: .claude/brief/build-spec.md Page 1 |
| `src/app/login/page.tsx` | 🔲 Not started | Spec: .claude/brief/build-spec.md Page 2 |
| `src/app/dashboard/layout.tsx` | 🔲 Not started | Sidebar nav, SessionProvider wrapper |
| `src/app/dashboard/page.tsx` | 🔲 Not started | Spec: .claude/brief/build-spec.md Page 3 |
| `src/app/dashboard/usage/page.tsx` | 🔲 Not started | Spec: .claude/brief/usage-feature.md |
| `src/app/dashboard/billing/page.tsx` | 🔲 Not started | Spec: .claude/brief/billing-feature.md |
| `src/app/dashboard/addons/page.tsx` | 🔲 Not started | Spec: .claude/brief/addons-feature.md |
| `src/app/dashboard/support/page.tsx` | 🔲 Not started | Spec: .claude/brief/support-feature.md |
| `src/app/dashboard/settings/page.tsx` | 🔲 Not started | Placeholder only — no spec |
| `src/app/api/revalidate/route.ts` | 🔲 Not started | Spec: .claude/brief/revalidation.md |
| `src/app/dashboard/actions.ts` | 🔲 Not started | toggleAddonAction Server Action |

---

## Implementation Order

Start here — each item unblocks the next:

1. `src/lib/money.ts` — `dollarsToCents()` + `formatAUD()` — everything depends on this
2. `src/types/data-model.ts` — all T* interfaces, copy from .claude/brief/data-model.md
3. `src/types/index.ts` — re-exports + NextAuth module augmentation
4. `src/lib/utils.ts` — cn(), formatDate(), getGreeting()
5. `src/lib/mock-db.ts` — dev customer store
6. `src/lib/auth.ts` — full authOptions (replace placeholder)
7. `src/components/ui/` — Button, Card, Badge
8. Homepage (`src/app/page.tsx`) — fully specced, no open gaps
9. Login (`src/app/login/page.tsx`)
10. Dashboard and sub-routes
