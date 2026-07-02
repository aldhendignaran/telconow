# Story: Plans Section

**Story ID:** TN-004
**Component:** `PlansSection.tsx`
**Design reference:** `/designs/TelcoNow_Homepage_dc.html` → "Plans"
**Stub data:** Contentful `plan` content type via `getPlans()` → `TPlanCatalogueEntry[]`

---

## Story

As a visitor on the TelcoNow homepage
I want to compare available plans and their pricing
So that I can choose the right plan and sign up

---

## Acceptance criteria

### Happy path

```
Given Contentful returns plan entries
When the section renders
Then the section background is bg-surface (white)
And a centred section header is shown with eyebrow "Pricing" in text-accent
And the h2 heading reads "Simple, honest pricing."
And the section has id="plans" so the hero "View plans" anchor link scrolls to it
```

```
Given Contentful returns plan entries
When the cards render
Then exactly three plan cards are displayed in a horizontal row
And the cards are sorted ascending by price (Starter → Plus → Pro)
And each card shows: plan name label, price, "/month" suffix, description, a divider, a feature list, and a CTA button
```

```
Given a standard (non-featured) plan card renders
When a visitor views it
Then the card has a 1px border-border, rounded-xl, and shadow-card
And the plan name is in the label style (text-xs uppercase tracking-wide) in text-text-secondary
And the price is displayed as a large number (text-[48px] font-bold) in text-accent-deep
And each feature item has a check icon with bg-accent-tint circle and text-accent checkmark
And the CTA button uses variant="secondary" — "Get [PlanName]" — linking to "/login"
```

```
Given the Plus plan card renders
When a visitor views it
Then the card has a 2px border-accent, stronger accent-tinted shadow, and is offset -8px top and bottom relative to its siblings (appears taller)
And a "Most popular" pill badge is centred at the top edge of the card, in bg-accent-tint2 with text-accent-deep
And the plan name label is in text-accent (not text-text-secondary)
And each feature item has a solid bg-accent circle with a white checkmark (not the tint variant)
And feature text is font-medium (slightly bolder than standard cards)
And the CTA button uses variant="primary" — "Get Plus" — linking to "/login"
```

```
Given the Pro plan card renders
When a visitor views the data field
Then "Unlimited data" is displayed as a feature (dataLimitGB is null — render as "Unlimited data")
```

### Loading state

```
Given the Contentful fetch is in-flight
When the section renders
Then three skeleton cards are displayed in the same 3-column grid layout
And each skeleton card contains SkeletonBlock placeholders for: plan name, price, description, divider, feature rows (5), and CTA button
And no spinner is shown
```

### Error state

```
Given the Contentful fetch fails or returns no plan entries
When the section renders
Then the section heading is still visible
And the card grid is replaced with a degraded message: "Pricing temporarily unavailable — call us on 13 XX XX"
And no blank layout or broken grid is shown
And no retry button is shown (this is a cached public page — the visitor should try refreshing)
```

### Edge cases

```
Given Contentful returns plans in a different order than expected
When the cards render
Then the cards are always sorted ascending by the sortOrder field — the component never assumes Contentful order
```

```
Given a plan has dataLimitGB as null
When the feature list renders
Then the data allowance feature reads "Unlimited data" — never renders "null GB data"
```

```
Given a visitor hovers a plan card
When the cursor enters the card
Then the card lifts slightly (translateY -3px) and the shadow deepens
And the featured Plus card has a stronger hover shadow than standard cards
```

---

## Out of scope

- A `/plans` page — no dedicated plans page is specced; PlansSection is the only plan comparison surface.
- Plan comparison table or feature toggle — not in the design.
- Mobile / responsive card stacking — the approved design is desktop-only (1280px). Mobile breakpoints need a design pass.

---

## Notes for developer

- PlansSection is an async Server Component — it calls `getPlans()` directly. The parent `app/page.tsx` wraps it with a `<Suspense>` boundary for the loading skeleton.
- Error handling belongs in `app/page.tsx` (the caller), not inside PlansSection — per `brief/contentful-setup.md`. If `getPlans()` throws, `page.tsx` should catch and render the degraded pricing message in place of this component.
- Use the `SectionHeader` molecule (`eyebrow="Pricing"` `heading="Simple, honest pricing."` `align="center"`) for the section header — do not write raw markup.
- The Contentful field is `monthlyPriceAUD`; the component type is `TPlanCatalogueEntry.monthlyAUD` — mapping happens at the fetch boundary in `page.tsx`, not inside this component.
- `TPlanCatalogueEntry.description` ("Great for light users." / "Perfect for everyday use." / "For power users & families.") is not yet in the Contentful `plan` schema. Add a `description` Short text field to the `plan` content type in Contentful — this is marketing copy that editors should be able to update without a deploy. Also add `description: string` to `TContentfulPlan.fields` in `types/contentful.ts` and map it through to `TPlanCatalogueEntry.description` in the fetch boundary.
- All plan CTAs currently route to `/login` — no signup flow is specced. This is a confirmed placeholder per `build-spec.md`.
- The check icon is an inline SVG in the design — it is not a `lucide-react` icon. Build it as a local SVG or a small colocated component.
