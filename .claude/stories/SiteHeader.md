# Story: Site Header

**Story ID:** TN-001
**Component:** `SiteHeader.tsx`
**Design reference:** `/designs/TelcoNow_Homepage_dc.html` → "Header"
**Stub data:** None — static component, no data fetching

---

## Story

As a visitor to the TelcoNow marketing site
I want to see a persistent navigation bar at the top of every public page
So that I can identify the brand and navigate to key sections

---

## Acceptance criteria

### Happy path

```
Given a visitor loads any public page
When the page renders
Then the header is visible at the top of the viewport
And the header uses bg-panel (#460073) as its background
And there is a 1px bottom border at rgba(255,255,255,0.08)
And the header is sticky — it remains at the top when the user scrolls
```

```
Given the header is rendered
When a visitor views the wordmark
Then "Telco" is displayed in text-text-inverse
And "Now" is displayed in text-accent-tint2
And the wordmark is a link to "/"
```

```
Given the header is rendered
When a visitor views the centre nav
Then four links are visible: Plans, Coverage, Business, Support
And each link renders as a NavLink molecule
And the NavLink for the current route is shown in text-accent font-semibold
And all other NavLinks are in text-text-onDarkMuted with a hover state of text-text-inverse
```

```
Given the header is rendered
When a visitor views the right-hand actions
Then a "Log in" button is visible using the ghost-white variant
And a "Get started" button is visible using the primary variant
And "Log in" links to "/login"
And "Get started" links to "/login" — no signup flow is specced; confirmed in build-spec
```

### Loading state

Not applicable — SiteHeader has no data fetching. It renders synchronously as a Server Component.

### Error state

Not applicable — SiteHeader has no data fetching. There is no async operation that can fail.

### Edge cases

```
Given a visitor is already on "/login"
When the header renders
Then no NavLink appears active (none of the four nav items match "/login")
And the "Log in" and "Get started" buttons are still visible
```

```
Given a visitor is on "/plans" (or any sub-route such as "/plans/starter")
When the header renders
Then the "Plans" NavLink appears active (text-accent font-semibold)
```

---

## Out of scope

- Mobile / responsive nav behaviour — the approved design is desktop-only (1280px). Mobile breakpoints are flagged as a known gap in `build-log.md` and need a design pass before implementation.
- Authenticated state — the header design shows only the logged-out state ("Log in" + "Get started"). No authenticated header variant is specified for the marketing site. Flag with product before adding one.
- Mega-menus or dropdown sub-navigation — not shown in the design.

---

## Notes for developer

- SiteHeader is a Server Component. NavLink is `"use client"` — that boundary lives inside the molecule, not in SiteHeader itself.
- The header height is 64px; keep the inner Container to `max-w-[1280px]` with `px-4 md:px-8 lg:px-12` padding (Container primitive).
- The wordmark style (`text-xl font-bold tracking-tight`) does not map to a named type-scale token — apply Tailwind classes directly.
- "Get started" links to `/login` — confirmed by build-spec. No signup flow is in scope.
