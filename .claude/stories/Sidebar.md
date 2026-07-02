# Story: Sidebar

**Story ID:** TN-009
**Component:** `Sidebar.tsx`
**Design reference:** `/designs/TelcoNow_Dashboard_dc.html` → "Sidebar panel"
**Stub data:** None — `name`, `planName`, and `initials` are props passed in from `AppShell`, which derives them from `getServerSession` in `app/dashboard/layout.tsx`

---

## Story

As an authenticated TelcoNow customer
I want a persistent sidebar panel showing navigation and my account identity
So that I can move between account sections and know I'm signed in

---

## Acceptance criteria

### Happy path

```
Given the sidebar renders
Then it has a bg-panel background and a fixed width of 240px
And it occupies the full viewport height as a flex column
And it does not scroll with the main content
```

```
Given the sidebar renders
Then the top section shows:
  - Wordmark: "TelcoNow" — "Telco" in text-text-inverse, "Now" in text-accent-tint2, 18px, font-weight 700
  - Subtext: "MY ACCOUNT" in text-text-onDarkMuted, 12px, uppercase, letter-spacing 0.04em
  - A border-white/[0.08] hairline at the bottom of this section
```

```
Given the sidebar renders
Then the nav section shows 6 items in this exact order:
  1. Dashboard  → href /dashboard
  2. Usage      → href /dashboard/usage
  3. Billing    → href /dashboard/billing
  4. Add-ons    → href /dashboard/addons
  5. Support    → href /dashboard/support
  6. Settings   → href /dashboard/settings
Each item uses the SidebarNavItem molecule with its matching icon SVG
```

```
Given I am currently on /dashboard
Then the "Dashboard" nav item renders in the active style:
  bg-white/12 text-text-inverse
And all other items render in the inactive style:
  text-text-onDarkMuted
```

```
Given I navigate to /dashboard/addons
Then the "Add-ons" nav item renders in the active style
And all other items render in the inactive style
And no prop or state is needed — SidebarNavItem reads usePathname() internally
```

```
Given I am on /dashboard/billing/some-nested-path (hypothetical sub-route)
Then the "Billing" nav item remains active
Because SidebarNavItem matches on pathname.startsWith(href)
```

```
Given the sidebar renders
Then the bottom section shows:
  - UserChip: avatar (initials, size sm) + name + plan name
  - A "← Log out" button below the chip
  - A border-white/[0.08] hairline at the top of this section
And the bottom section is pushed to the bottom of the column (not inline with the nav)
```

```
Given I click "← Log out"
Then signOut({ callbackUrl: "/" }) is called
And I am redirected to the homepage
```

### Loading state

```
The Sidebar has no loading state. It receives all required props
synchronously from AppShell (which has already resolved the session).
No skeleton or spinner is required.
```

### Error state

```
The Sidebar has no error state. It renders static navigation and
session-derived identity — neither can fail at this layer.
If the session is missing, middleware redirects before Sidebar renders.
```

### Edge cases

```
Given session.user.name is a single word (e.g. "Alex")
Then the avatar shows the first character only: "A"
```

```
Given session.user.name is very long (e.g. "Alexandra Weatherington-Clarke")
Then the avatar still shows max 2 initials: "AW"
And the name text in UserChip is truncated with ellipsis rather than wrapping
```

```
Given I am on /dashboard/settings
Then the "Settings" nav item is active
Even though the settings page currently shows placeholder content
```

---

## Out of scope

- Mobile sidebar / drawer — no responsive breakpoints are specced. The sidebar is always visible at desktop widths. Flag as an open design gap.
- Sidebar collapse / expand toggle — not in the design.
- Notification badges on any nav item — not in the design.
- Sign-out confirmation — log out is immediate, no confirm modal.

---

## Notes for developer

- **Server Component:** `Sidebar` itself has no hooks and requires no `"use client"`. The client boundary lives inside `SidebarNavItem` (already built — `usePathname()`) and a small inline `LogoutButton` (`"use client"`, calls `signOut()`). Extract `LogoutButton` as a file-private sub-component or a separate file in `app/dashboard/_components/` rather than marking the whole Sidebar client.
- **Props shape:**
  ```ts
  interface SidebarProps {
    name: string;       // session.user.name
    planName: string;   // display label derived from session.user.plan tier slug
    initials: string;   // derived by caller: "Alex Chen" → "AC"
  }
  ```
  Initials and plan label derivation belong in `app/dashboard/layout.tsx`, not inside Sidebar — keeps the component dumb and testable.
- **Plan display label:** `session.user.plan` is a tier slug (`"starter"` | `"plus"` | `"pro"`). Map to display label in `layout.tsx` before passing: `{ starter: "Starter plan", plus: "Plus plan", pro: "Pro plan" }`.
- **Nav icon SVGs:** the design HTML (`TelcoNow_Dashboard_dc.html`, sidebar `<nav>` block) contains the exact inline SVG for each of the 6 items. Copy each verbatim and convert HTML attrs to JSX camelCase only. Do not substitute lucide-react icons — the design SVGs are not exact lucide matches.
- **`SidebarNavItem` molecule:** already built at `components/ui/molecules/SidebarNavItem.tsx`. Pass `href`, `label`, and `icon` prop. Active state is handled internally — no `active` prop needed.
- **`UserChip` molecule:** already built at `components/ui/molecules/UserChip.tsx`. Pass `name`, `planName`, `initials`. Note: `UserChip`'s `Avatar` uses `bg-accent-tint2`; the design shows `bg-accent` (#A100FF) for the sidebar avatar. Override with `className` on `UserChip` or accept the minor deviation — document the decision.
- **Logout button colour:** design shows `rgba(255,255,255,0.5)`. Use `text-text-onDarkMuted` (close match) with `hover:text-text-inverse transition-colors` and `text-sm font-medium`.
- **Layout:** top section (`shrink-0`) + nav (`flex-1 overflow-y-auto`) + bottom section (`shrink-0`). This three-zone flex column matches the design and handles overflow if nav items ever exceed the sidebar height.
