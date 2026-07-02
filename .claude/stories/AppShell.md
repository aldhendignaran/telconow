# Story: AppShell

**Story ID:** TN-008
**Component:** `AppShell.tsx`
**Design reference:** `/designs/TelcoNow_Dashboard_dc.html` → "Sidebar + main content wrapper"
**Stub data:** None — session identity comes from `getServerSession(authOptions)` in `app/dashboard/layout.tsx`; AppShell itself receives it as props

---

## Story

As an authenticated TelcoNow customer
I want a consistent navigation shell around every dashboard page
So that I can move between my account sections without losing context

---

## Acceptance criteria

### Happy path

```
Given I am authenticated and on any /dashboard/* route
When the page renders
Then I see a full-viewport layout:
  - Left: sidebar 240px wide, bg-panel background, non-scrollable as a column
  - Right: main content area, flex-1, bg-bg background, scrollable on overflow
And the layout never wraps or collapses the sidebar (desktop only)
```

```
Given the sidebar is rendered
Then the top section shows the wordmark:
  - "TelcoNow" in text-text-inverse, 18px, font-weight 700
  - "Now" in text-accent-tint2
  - "MY ACCOUNT" below the wordmark in text-text-onDarkMuted, 12px, uppercase, tracking-wide
  - Separated from the nav by a border-white/[0.08] hairline
```

```
Given the sidebar is rendered
Then the nav section shows 6 items in order:
  Dashboard → /dashboard
  Usage     → /dashboard/usage
  Billing   → /dashboard/billing
  Add-ons   → /dashboard/addons
  Support   → /dashboard/support
  Settings  → /dashboard/settings
Each item renders with its icon (from lucide-react or inline SVG — see Notes) and label
```

```
Given I am on /dashboard
When I look at the nav
Then the "Dashboard" item is in the active state:
  bg-white/12 text-text-inverse
And all other items are in the inactive state:
  text-text-onDarkMuted with hover:bg-white/[0.08] hover:text-text-inverse
```

```
Given I navigate to /dashboard/billing
When I look at the nav
Then the "Billing" item is in the active state
And "Dashboard" and all other items are in the inactive state
And the active state is derived from usePathname() — no prop needed
```

```
Given I am on any /dashboard/* route
Then the bottom of the sidebar shows the user chip:
  - Initials avatar (36px, bg-accent, text-text-inverse) — initials from session.user.name
  - Name: session.user.name in text-text-inverse, 14px, font-weight 600
  - Plan: session.user.plan display name in text-text-onDarkMuted/70, 12px
  - "← Log out" link below the chip
  - Separated from the nav by a border-white/[0.08] hairline
```

```
Given I click "← Log out"
When the action is confirmed
Then signOut({ callbackUrl: "/" }) is called
And I am redirected to the homepage
```

```
Given the layout renders
Then {children} is rendered inside the main content area
And the main content has padding: p-8 (32px)
And the main content area scrolls independently of the sidebar
```

### Loading state

```
The AppShell shell itself has no loading state — the sidebar and chrome
are always present once the layout renders. Loading states are the
responsibility of per-route loading.tsx files that fill the {children}
slot with a skeleton while the page's Server Component fetches data.

The shell must render immediately: do not conditionally hide the sidebar
or main padding while children are loading.
```

### Error state

```
The AppShell shell itself has no error state. Middleware guarantees the
session is valid before reaching any /dashboard/* route. If getServerSession
returns null in layout.tsx (belt-and-suspenders), redirect to /login —
do not render an error UI.

Per-page errors (data fetch failures inside {children}) are handled by
each page's own ErrorState component — not by AppShell.
```

### Edge cases

```
Given the main content is very tall (e.g. the usage history chart page)
When I scroll
Then only the main content area scrolls
And the sidebar remains fixed in place
```

```
Given session.user.name is "Alex Chen"
Then the avatar shows initials "AC"
And the name is truncated with text-overflow ellipsis if it exceeds the chip width
```

```
Given I am on /dashboard/settings
Then the "Settings" nav item is active
Even though the settings page renders "coming soon" placeholder content
```

---

## Out of scope

- Mobile/responsive sidebar — the design is desktop-only (1280px fixed). No mobile drawer or hamburger menu is specced. Do not invent a responsive sidebar. Flag as a known gap when shipping.
- Sign-out confirmation modal — log out is immediate, matching the design's `← Log out` link with no confirmation step.
- Notification badges on nav items — not in the design.
- Sidebar collapse/expand toggle — not in the design.

---

## Notes for developer

- **File split:** `app/dashboard/layout.tsx` is the Next.js layout (Server Component — calls `getServerSession`, redirects if null, passes session to `<AppShell>`). `components/AppShell.tsx` is the visual wrapper (Server Component — composes `<Sidebar>` + `<main>`). Keep framework concerns in layout.tsx, layout concerns in AppShell.tsx.
- **`"use client"` boundary:** `AppShell` and `Sidebar` can be Server Components. The `"use client"` boundary lives inside `SidebarNavItem` (already built — uses `usePathname()`) and a small `LogoutButton` sub-component (`"use client"`, calls `signOut()`). Do not mark the whole Sidebar "use client".
- **Avatar initials:** derive from `session.user.name` — split on space, take first character of each word, max 2 characters. "Alex Chen" → "AC". Pass as a prop to `UserChip` (already built).
- **Nav icons:** the design HTML contains inline SVGs for all 6 nav items — copy verbatim and convert attrs to JSX camelCase. Do not use lucide-react icons for these; the design SVGs are not exact lucide matches.
- **Avatar background:** the design shows `#A100FF` (`bg-accent`) for the sidebar avatar. The `Avatar` atom uses `bg-accent-tint2`. For the sidebar context use `Avatar` with a `className="bg-accent"` override, or implement the sidebar avatar as a plain `div` matching the design exactly — document the deviation.
- **Plan display name:** `session.user.plan` is the tier slug (e.g. `"plus"`). Map to the display label ("Plus plan") using a local lookup — do not fetch Contentful here. A simple `const planLabels = { starter: "Starter plan", plus: "Plus plan", pro: "Pro plan" }` in the component is sufficient.
- **Log out link style:** the design shows `rgba(255,255,255,0.5)` — use `text-text-inverse opacity-50` or `text-text-onDarkMuted hover:text-text-inverse transition-colors`.
- **Token:** `border-white/[0.08]` for the top and bottom hairlines inside the sidebar — this is an opacity-based overlay, not a design token.
- **`min-w-0` on main:** required to prevent a flex child from overflowing its container when content is wide (e.g. the usage history chart).
