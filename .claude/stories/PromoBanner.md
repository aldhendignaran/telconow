# Story: Promo Banner

**Story ID:** TN-005
**Component:** `PromoBanner.tsx`
**Design reference:** `/designs/TelcoNow_Homepage_dc.html` → "Promo Banner"
**Stub data:** None — static component, no data fetching

---

## Story

As a visitor on the TelcoNow homepage
I want to see the referral offer clearly between the plans and the blog
So that I'm prompted to refer a friend while the plans are still fresh in mind

---

## Acceptance criteria

### Happy path

```
Given a visitor scrolls past the plans section
When the banner renders
Then the banner background is bg-accent-tint
And there is a 1px top border and 1px bottom border using border-accent-tint2
And the banner height is fixed at 120px
And the content is split: left side holds the icon and copy, right side holds the CTA button
```

```
Given the banner renders
When a visitor views the left side
Then a 48px square icon container is shown with bg-accent-tint2 and rounded-xl
And the container holds a gift SVG icon (24px, stroke colour text-accent-deep)
And the heading "Refer a friend, get one month free." is displayed to the right of the icon
And the sub-copy "Share your code. When they sign up, you both win." is displayed below the heading
```

```
Given the banner renders
When a visitor views the right side
Then a "Refer now" button is displayed using variant="primary" size="md"
And the button does not wrap or shrink — it stays on one line
And the "Refer now" button href is "#" — no referral page is specced in the current build-spec
```

### Loading state

Not applicable — PromoBanner has no data fetching. It renders synchronously as a Server Component.

### Error state

Not applicable — PromoBanner has no data fetching. There is no async operation that can fail.

### Edge cases

```
Given a visitor views the banner on a viewport narrower than the max-width container
When the layout reflows
Then the left copy and right button remain on the same row and do not overlap
```

---

## Out of scope

- Any referral code display or personalised copy — the banner is the same for all visitors (logged in or not).
- Mobile / responsive stacking — the approved design is desktop-only (1280px). Mobile breakpoints need a design pass.

---

## Notes for developer

- PromoBanner is a Server Component — no interactivity, no hooks.
- Use the `Container` primitive for the inner max-width wrapper.
- The heading uses `font-size: 22px` in the design — this falls between named type-scale tokens. Use `text-[22px] font-bold tracking-tight` directly; there is no named token for this size.
- The gift icon is a custom SVG — it is not a `lucide-react` icon. Inline it or extract it to a colocated `_components/GiftIcon.tsx`.
- The top and bottom border colour `#E5CCFF` maps to the `accent.tint2` token — use `border-accent-tint2` (confirmed in `tailwind.config.ts`).
- "Refer now" uses `href="#"` — no referral page is in the build-spec. Wire up when that feature is scoped.
