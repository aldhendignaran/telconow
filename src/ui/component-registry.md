# TelcoNow — Component Registry

> Claude Code must read this file before building any component.
> If what you need already exists — import it. Do not rebuild it.
> When you create a new reusable component — add it here before committing.

---

## How to use this registry

**Before building:** search this file for the component you need.
- If it exists → import from the path listed. Do not create a duplicate.
- If it doesn't exist → build it, then add a row to this file.

**After building a reusable component:** add a row to the correct section below.
- Path must be the exact import path from `src/`
- "Used in" must list every component that imports it

---

## Layout primitives
`src/components/layout/`

| Component | Path | Props | Used in |
|-----------|------|-------|---------|
| `Container` | `components/layout/Container.tsx` | `children` | All pages |
| `Section` | `components/layout/Section.tsx` | `background?` | All pages |
| `Grid` | `components/layout/Grid.tsx` | `cols?, gap?` | Dashboard, PlansSection |
| `Stack` | `components/layout/Stack.tsx` | `gap?` | Widespread |
| `Cluster` | `components/layout/Cluster.tsx` | `gap?, align?` | Widespread |

---

## Atoms
`src/components/ui/atoms/`

| Component | Path | Props | Used in |
|-----------|------|-------|---------|
| `Heading` | `components/ui/atoms/Heading.tsx` | `level, variant, color?` | — |
| `Text` | `components/ui/atoms/Text.tsx` | `variant, color?` | — |
| `Link` | `components/ui/atoms/Link.tsx` | `variant, href` | — |
| `Icon` | `components/ui/atoms/Icon.tsx` | `name, size?, color?` | — |
| `Button` | `components/ui/atoms/Button.tsx` | `variant, size?, fullWidth?` | — |
| `Badge` | `components/ui/atoms/Badge.tsx` | `variant, dot?` | — |
| `Input` | `components/ui/atoms/Input.tsx` | `type, placeholder?, error?, suffix?` | — |
| `Label` | `components/ui/atoms/Label.tsx` | `htmlFor` | — |
| `Divider` | `components/ui/atoms/Divider.tsx` | — | — |
| `Avatar` | `components/ui/atoms/Avatar.tsx` | `initials, size?` | — |
| `Toggle` | `components/ui/atoms/Toggle.tsx` | `checked, onChange, aria-label` | — |
| `ProgressBar` | `components/ui/atoms/ProgressBar.tsx` | `percent, showThreshold?` | — |
| `SkeletonBlock` | `components/ui/atoms/SkeletonBlock.tsx` | `width?, height?, rounded?` | — |
| `StatusDot` | `components/ui/atoms/StatusDot.tsx` | `color` | — |

---

## Molecules
`src/components/ui/molecules/`

| Component | Path | Props | Used in |
|-----------|------|-------|---------|
| `FormField` | `components/ui/molecules/FormField.tsx` | `id, label, type, error?` | LoginPanel |
| `NavLink` | `components/ui/molecules/NavLink.tsx` | `href, label` | SiteHeader |
| `SidebarNavItem` | `components/ui/molecules/SidebarNavItem.tsx` | `href, label, icon, active?` | Sidebar |
| `StatTile` | `components/ui/molecules/StatTile.tsx` | `label, value, background?` | UsageMeterCard |
| `KeyValueRow` | `components/ui/molecules/KeyValueRow.tsx` | `label, value` | BillingCard, PlanSummaryCard |
| `SectionHeader` | `components/ui/molecules/SectionHeader.tsx` | `eyebrow?, heading, align?` | PlansSection, BlogSection |
| `PageHeader` | `components/ui/molecules/PageHeader.tsx` | `greeting, subtitle` | DashboardPage |
| `AnnouncementPill` | `components/ui/molecules/AnnouncementPill.tsx` | `label` | HeroSection |
| `UserChip` | `components/ui/molecules/UserChip.tsx` | `name, planName, initials` | Sidebar |
| `CardHeader` | `components/ui/molecules/CardHeader.tsx` | `label, action?` | All dashboard cards |

---

## Components
`src/components/`

> Components have data-fetching behaviour and require a story file.
> Story path listed for each — create the story before building the component.

| Component | Path | Story | Data source | Used in |
|-----------|------|-------|-------------|---------|
| `SiteHeader` | `components/SiteHeader.tsx` | `stories/SiteHeader.md` | None | HomePage | ✅ Built |
| `SiteFooter` | `components/SiteFooter.tsx` | `stories/SiteFooter.md` | None | HomePage | ✅ Built |
| `HeroSection` | `components/HeroSection.tsx` | `stories/HeroSection.md` | None | HomePage | ✅ Built |
| `TrustBar` | `components/TrustBar.tsx` | `stories/TrustBar.md` | None | HeroSection | ✅ Built |
| `PlansSection` | `components/PlansSection.tsx` | `stories/PlansSection.md` | Contentful: Plan | HomePage | ✅ Built |
| `PromoBanner` | `components/PromoBanner.tsx` | `stories/PromoBanner.md` | None | HomePage | ✅ Built |
| `BlogSection` | `components/BlogSection.tsx` | `stories/BlogSection.md` | Contentful: BlogPost | HomePage | ✅ Built |
| `LoginPanel` | `components/LoginPanel.tsx` | `stories/LoginPanel.md` | NextAuth | LoginPage |
| `Sidebar` | `components/Sidebar.tsx` | `stories/Sidebar.md` | None | AppShell |
| `AppShell` | `components/AppShell.tsx` | `stories/AppShell.md` | None | DashboardPage |
| `PlanSummaryCard` | `components/PlanSummaryCard.tsx` | `stories/PlanSummaryCard.md` | `/api/stub/account` | DashboardPage |
| `UsageMeterCard` | `components/UsageMeterCard.tsx` | `stories/UsageMeterCard.md` | `/api/stub/usage` | DashboardPage |
| `BillingCard` | `components/BillingCard.tsx` | `stories/BillingCard.md` | `/api/stub/billing` | DashboardPage |
| `ActivityFeed` | `components/ActivityFeed.tsx` | `stories/ActivityFeed.md` | `/api/stub/activity` | DashboardPage |
| `SupportTickets` | `components/SupportTickets.tsx` | `stories/SupportTickets.md` | `/api/stub/tickets` | DashboardPage |
| `UsageHistoryChart` | `components/UsageHistoryChart.tsx` | `stories/UsageHistoryChart.md` | `/api/stub/usage-history` | DashboardPage |
| `AddOnsCard` | `components/AddOnsCard.tsx` | `stories/AddOnsCard.md` | `/api/stub/addons` | DashboardPage |
| `UpgradeBanner` | `components/UpgradeBanner.tsx` | `stories/UpgradeBanner.md` | Derived from usage + account | DashboardPage |

---

## Error + loading states

These are shared across all data-fetching components. Build once, import everywhere.

| Component | Path | Used in |
|-----------|------|---------|
| `ErrorState` | `components/ui/ErrorState.tsx` | All data-fetching components |

`ErrorState` props: `message?: string, onRetry?: () => void`
Never render null or a blank div on error. Always use `ErrorState`.
Never use a spinner on loading. Always use `SkeletonBlock`.

---

*Owner: Tech Lead*
*Update this file every time a reusable component is created.*
*Last updated: auto — keep current*
