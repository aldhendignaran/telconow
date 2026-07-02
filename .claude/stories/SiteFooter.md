# Story: Site Footer

**Story ID:** TN-002
**Component:** `SiteFooter.tsx`
**Design reference:** `/designs/TelcoNow_Homepage_dc.html` → "Footer"
**Stub data:** None — static component, no data fetching

---

## Story

As a visitor to the TelcoNow marketing site
I want to see a footer at the bottom of every public page
So that I can find supporting links, legal information, and understand the brand

---

## Acceptance criteria

### Happy path

```
Given a visitor reaches the bottom of any public page
When the footer renders
Then the footer background is bg-panel-alt
And the footer contains four columns: Brand, Plans, Support, Legal
And a bottom bar is visible below the columns, separated by a 1px border-panel-alt divider
```

```
Given the footer renders
When a visitor views the Brand column
Then the TelcoNow wordmark is visible — "Telco" in text-text-inverse, "Now" in text-accent-tint2
And the tagline "Fast. Simple. Yours." is displayed in text-text-onDarkMuted below the wordmark
And a short descriptor paragraph is displayed below the tagline in text-text-onDarkMuted
```

```
Given the footer renders
When a visitor views the Plans column
Then a column heading "Plans" is displayed in the label style (text-xs font-medium uppercase tracking-wide)
And four links are listed: Starter, Plus, Pro, Business
And each link uses the inverse link variant (text-text-onDarkMuted, hover text-text-inverse)
```

```
Given the footer renders
When a visitor views the Support column
Then a column heading "Support" is displayed in the label style
And four links are listed: Help centre, Contact us, Coverage map, FAQs
And each link uses the inverse link variant
```

```
Given the footer renders
When a visitor views the Legal column
Then a column heading "Legal" is displayed in the label style
And three links are listed: Privacy policy, Terms, Accessibility
And each link uses the inverse link variant
```

```
Given the footer renders
When a visitor views the bottom bar
Then "© 2026 TelcoNow Pty Ltd" is displayed on the left in text-text-onDarkMuted
And "All prices include GST" is displayed on the right in text-text-onDarkMuted
```

### Loading state

Not applicable — SiteFooter has no data fetching. It renders synchronously as a Server Component.

### Error state

Not applicable — SiteFooter has no data fetching. There is no async operation that can fail.

### Edge cases

```
Given any footer link is hovered
When the cursor moves over the link
Then the link text transitions to text-text-inverse
```

---

## Out of scope

- Mobile / responsive column stacking — the approved design is desktop-only (1280px). Mobile breakpoints need a design pass before implementation.
- Any interactive elements (newsletter signup, language switcher, etc.) — none shown in the design.

---

## Notes for developer

- SiteFooter is a Server Component — no interactivity, no hooks.
- Use the `Container` primitive (`max-w-[1280px]`) for the inner content wrapper.
- Column headings match the `Text variant="label" color="secondary"` style — use that atom rather than raw markup.
- Footer links map to `Link variant="inverse"` (`text-text-onDarkMuted hover:text-text-inverse`).
- The bottom bar divider is `border-panel-alt` — `#1E1E2E` is the `panel.alt` token in `tailwind.config.ts`. Use `border-t border-panel-alt`.
- All footer links (Plans, Support, Legal columns) use `href="#"` — none of the destinations (Coverage map, Help centre, FAQs, Business, Privacy policy, Terms, Accessibility) have corresponding pages in the current build-spec. Wire up real routes when those pages are scoped.
