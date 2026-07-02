# Story: Hero Section

**Story ID:** TN-003
**Component:** `HeroSection.tsx`
**Design reference:** `/designs/TelcoNow_Homepage_dc.html` → "Hero"
**Stub data:** None — static component, no data fetching

---

## Story

As a visitor landing on the TelcoNow homepage
I want to see a compelling hero that communicates the brand value proposition
So that I immediately understand what TelcoNow offers and can take action

---

## Acceptance criteria

### Happy path

```
Given a visitor loads the homepage
When the hero section renders
Then the section background is bg-panel (#460073)
And the section height is 440px
And the content is split into a left column (55% width) and a right decorative illustration (45% width)
```

```
Given the hero renders
When a visitor views the left column
Then an AnnouncementPill is displayed at the top with the label "5G Now Live Nationwide"
And the pill uses its glass-effect styling (bg-white/10 border border-white/20 backdrop-blur-sm)
```

```
Given the hero renders
When a visitor views the h1 heading
Then the text "Australia's fastest 5G network." is displayed
And it uses the hero type scale (text-[52px] font-bold tracking-tight leading-tight)
And the colour is text-text-inverse
And there is one h1 on the page — this is it
```

```
Given the hero renders
When a visitor views the sub-copy
Then the text "Flexible plans. No lock-in contracts. Cancel any time." is displayed below the h1
And the colour is text-text-onDarkMuted
And the font size is text-lg (18px)
```

```
Given the hero renders
When a visitor views the CTA buttons
Then a "View plans" button is displayed using variant="primary" size="lg"
And a "Check coverage" button is displayed using variant="ghost-white" size="lg"
And both buttons are on the same horizontal row
And "View plans" links to "#plans" — a same-page anchor scroll to PlansSection
And "Check coverage" links to "#" — placeholder, no /coverage page is specced
```

```
Given the hero renders
When a visitor views the right side
Then a decorative SVG network illustration is displayed
And the illustration is aria-hidden — it conveys no information and is purely visual
```

```
Given the hero renders
When the full section is visible
Then a trust stats bar is rendered below the main content, separated by a 1px white/10 border-top
And the stats bar displays three values: "99.8%" (Network uptime), "4.2M+" (Customers), "★ 4.8" (Award-winning support)
And the three stats are separated by 1px vertical dividers at white/15 opacity
And all stat values are text-text-inverse and all stat labels are text-text-onDarkMuted
And the trust stats bar is rendered by the TrustBar component, composed inside HeroSection
```

### Loading state

Not applicable — HeroSection has no data fetching. It renders synchronously as a Server Component.

### Error state

Not applicable — HeroSection has no data fetching. There is no async operation that can fail.

### Edge cases

```
Given a visitor views the hero on a viewport narrower than the max-width container
When the layout reflows
Then the left column content remains readable and does not overflow
```

---

## Out of scope

- Mobile / responsive layout — the approved design is desktop-only (1280px). Mobile breakpoints need a design pass.
- Any animation on the SVG illustration — the design is static, no animation is specified.

---

## Notes for developer

- HeroSection is a Server Component — no interactivity, no hooks.
- Use the `Container` primitive for the inner max-width wrapper.
- The `AnnouncementPill` molecule is already specced in the design system — import it directly, do not rebuild.
- The decorative SVG can be extracted to a colocated `_components/HeroIllustration.tsx` Server Component if the file becomes large — not required, use judgement.
- `TrustBar` is a separate registered component but is rendered inside `HeroSection` (build-spec: "embedded in hero section"). HeroSection owns the outer `<section>` wrapper; TrustBar sits inside it below the main content. No composition concern at the page level — the background is seamless because both share `bg-panel`.
