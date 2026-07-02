# Story: Blog Section

**Story ID:** TN-006
**Component:** `BlogSection.tsx`
**Design reference:** `/designs/TelcoNow_Homepage_dc.html` → "Blog Cards"
**Stub data:** Contentful `blogPost` content type via `getBlogPosts()` → `TContentfulBlogPost[]`

---

## Story

As a visitor on the TelcoNow homepage
I want to see recent blog posts from TelcoNow
So that I can discover helpful content and build trust in the brand

---

## Acceptance criteria

### Happy path

```
Given Contentful returns blog post entries
When the section renders
Then the section background is bg-surface (white)
And the section header shows the eyebrow "Blog" in text-accent (left-aligned)
And the h2 heading reads "From the TelcoNow blog" (left-aligned)
And a "View all articles →" link is right-aligned in the header row, in text-accent font-semibold
And the "View all articles →" link href is "#" — placeholder until article pages are scoped
```

```
Given Contentful returns blog post entries
When the cards render
Then exactly three blog cards are displayed in a horizontal row with equal width
And the cards are the 3 most recent posts sorted by publishDate descending (newest left)
And all three cards have equal height regardless of content length
```

```
Given a blog card renders
When a visitor views it
Then an 8px coloured top accent bar is displayed at the top of the card
And the card has a 1px border-border, rounded-xl, shadow-card, and overflow-hidden
And a category pill is shown below the accent bar, in bg-accent-tint with text-accent-deep, rounded-full, uppercase text-xs
And the post title is displayed as an h3 in text-lg font-semibold text-text-primary
And the excerpt is displayed below the title in text-sm text-text-secondary, clamped to 2 lines
And a footer row is separated from the body by a 1px border-border divider
And the footer row shows author name (font-semibold text-text-primary) and publish date (text-xs text-text-secondary) on the left
And a "Read more →" link in text-accent font-semibold is on the right of the footer row
And the "Read more →" link href is "#" — placeholder until article pages are scoped
```

```
Given a visitor hovers a blog card
When the cursor enters the card
Then the card lifts slightly (translateY -3px) and the shadow deepens
```

```
Given a blog post date is returned from Contentful as an ISO date string
When it is displayed on the card
Then it is formatted as "14 June 2026" (D MMMM YYYY)
And this format is produced by formatDateLong() from lib/utils.ts — not the existing formatDate() which produces DD/MM/YYYY
```

### Loading state

```
Given the Contentful fetch is in-flight
When the section renders
Then three skeleton cards are displayed in the same 3-column layout
And each skeleton card contains SkeletonBlock placeholders for: accent bar, category pill, title (2 lines), excerpt (2 lines), and the footer row (author + date + link)
And no spinner is shown
```

### Error state

```
Given the Contentful fetch fails or returns no blog post entries
When the section renders
Then the section heading row is still visible
And the card grid is replaced with an ErrorState component showing "Blog posts temporarily unavailable."
And no retry button is shown (this is a cached public page — the visitor should try refreshing)
```

### Edge cases

```
Given a blog post title is longer than two lines
When the card renders
Then the title is not clamped — it wraps fully (only the excerpt is 2-line clamped)
And equal card heights are maintained by flexbox, not fixed pixel heights
```

```
Given a category value is returned from Contentful that is not one of the three observed values (Technology / Tips / Company)
When the pill renders
Then the pill renders with whatever category string Contentful returns — there is no hardcoded enum guard
```

---

## Out of scope

- Article detail pages — no `/blog/[slug]` page is specced. "Read more" and "View all articles" links remain `href="#"` placeholders.
- Author avatars or bios — the design shows name and date only.
- Pagination or a "load more" pattern — the section always shows exactly 3 posts.
- Mobile / responsive card stacking — the approved design is desktop-only (1280px). Mobile breakpoints need a design pass.

---

## Notes for developer

- BlogSection is an async Server Component — it calls `getBlogPosts()` directly. The parent `app/page.tsx` wraps it with a `<Suspense>` boundary for the loading skeleton.
- Error handling belongs in `app/page.tsx` (the caller), same pattern as PlansSection — let `getBlogPosts()` throw, catch at the call site.
- The section header is a custom flex row (left heading block + right link), not the `SectionHeader` molecule alone — `SectionHeader` has no right action slot. Compose using `SectionHeader` on the left and a `Link` atom on the right.
- Publish date formatting: `formatDate()` in `lib/utils.ts` produces DD/MM/YYYY only. Add a `formatDateLong(isoDate: string): string` helper to `lib/utils.ts` that produces "14 June 2026" format. Example implementation: `new Date(isoDate).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })`.
- The top accent bar colour is positional by card index — the three brand purple tones applied in order: index 0 → `bg-accent` (#A100FF), index 1 → `bg-accent-hover` (#7500C0), index 2 → `bg-panel` (#460073). Since the section always shows exactly 3 posts, this covers the full set and matches the design exactly. No category mapping is required.
