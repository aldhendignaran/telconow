# Story: UpgradeBanner

**Story ID:** TN-017
**Component:** `UpgradeBanner.tsx`
**Design reference:** `/designs/TelcoNow_Dashboard_dc.html` → "Upgrade prompt banner (section H, 6-col, bottom row right)"
**Stub data:** Derived from `usage.json` (`usedGB`, `totalGB`) + `session.user.plan` (`planTier`)

---

## Story

As an authenticated TelcoNow customer who is approaching their data cap
I want to see a contextual nudge to upgrade my plan
So that I can proactively avoid overage charges before my cycle ends

---

## Acceptance criteria

### Happy path

```
Given I am on /dashboard
And my usage is 76.8% (usedGB=38.4, totalGB=50) — above the 75% threshold
And my current plan tier is "plus"
When the UpgradeBanner renders
Then I see a card spanning 6 of 12 grid columns:
  - Background: bg-accent-tint (#F5EEFF)
  - Border: 1px solid border-accent-tint2 (#E5CCFF)
  - Border-radius: rounded-xl
  - Shadow: shadow-card
  - Overflow: hidden (clips the left accent bar and right SVG)
```

```
Given the banner is visible
Then a 5px-wide accent bar spans the full height of the left edge (bg-accent, flex-shrink-0)
```

```
Given the banner content area renders (padding 28px on all sides)
Then it shows in order (top to bottom):
  Row 1 (flex row, gap-[10px], items-center):
    - Badge variant="warning" text "{rounded}% used"
        where rounded = Math.round(usedGB / totalGB * 100)
    - Muted label: "You're approaching your data limit"
        text-xs text-text-secondary
  Row 2 (heading):
    - h3: "You've used {rounded}% of your data. / Upgrade to Pro for unlimited."
        text-lg font-semibold text-text-primary
        two-line layout (line break between sentences — see note on dynamic copy below)
  Row 3 (body copy):
    - p: "Pro gives you unlimited data, Ultra 5G speeds, and 24/7 support — from $99/mo with no lock-in."
        text-sm text-text-secondary leading-relaxed
  Row 4 (CTA row, flex row, gap-4, items-center):
    - "Upgrade now" button: bg-accent, h-[38px], px-5, rounded-lg, text-sm font-semibold text-text-inverse
        href: see "CTA destinations" flag in Notes
    - "Compare plans →" link: text-[13px] font-medium text-text-secondary, hover:text-text-primary transition-colors
        href: see "CTA destinations" flag in Notes
```

```
Given the banner renders
Then a decorative SVG (140×200px) is flush to the right edge of the card:
  - Fixed 140px width, flex-shrink-0
  - Concentric circle composition (copy verbatim from design HTML, section H, lines ~518-524)
  - Convert HTML attrs to JSX camelCase only — do not change values
  - The SVG is decorative only: aria-hidden="true"
```

### Visibility threshold

```
Given usage is below the threshold (usedGB / totalGB < 0.75)
Then the UpgradeBanner renders nothing at all — not a blank div, not a collapsed card
And the 6 columns it would have occupied are removed from the grid entirely
```

```
Given usage is exactly at the threshold (usedGB / totalGB = 0.75)
Then the banner renders (≥ 0.75 is inclusive)
```

```
Given usage is above 100% (usedGB > totalGB — overage state)
Then the banner still renders — overage is a stronger signal to upgrade than approaching-cap
And the badge shows e.g. "102% used" (rounded %)
And the heading copy still reads "You've used {X}% of your data."
```

### Loading state

```
Given the dashboard page is fetching usage data
Then the UpgradeBanner slot shows nothing (no skeleton in the banner itself)
And the dashboard page's loading.tsx handles the slot skeleton for this 6-column area
```

_This component receives computed props — it does no fetching and owns no loading state._

### Error state

```
Given the usage data fetch at the dashboard-page level fails
Then the UpgradeBanner receives no props and renders nothing
And the error is surfaced by UsageMeterCard's ErrorState, not by this component
```

_There is no component-level error state for UpgradeBanner. It is purely presentational._

### Edge cases

```
Given the user's current plan tier is "pro" (the highest tier — no upgrade available)
Then the UpgradeBanner renders nothing even if usage % is above the threshold
And no fallback message is shown in its place
```

> **Flag — Pro-tier suppression:** the design only shows the banner for a Plus-tier user. The component must check plan tier in addition to usage %. Confirm: should "starter" → banner suggest "Plus" or skip straight to "Pro"? The design hardcodes "Pro" — flag this before building if multi-tier upgrade copy is required.

```
Given my usage is at exactly 75.0% (boundary case)
Then Math.round(75.0) = 75 → badge shows "75% used"
And the heading reads "You've used 75% of your data."
```

---

## Out of scope

- Dismiss / close / "remind me later" interaction — the banner has no dismiss button and no persistent preference stored
- Plan price comparison table — "Compare plans" links to the pricing page, not an inline table
- Personalised plan recommendation logic beyond "Starter/Plus → suggest Pro" — current design hardcodes Pro copy
- Overage charge calculation or a "pay now for extra data" flow — see `brief/addons-feature.md` for the Extra Data add-on as an alternative to upgrading

---

## Notes for developer

- **Data source:** the dashboard page Server Component fetches `usage.json` and reads `session.user.plan`. It passes `usedGB: number`, `totalGB: number`, and `planTier: string` (or equivalent) as props. `UpgradeBanner` does no fetching — keep it a Server Component with no async operations.
- **Threshold check:** render nothing (return `null`) when `usedGB / totalGB < 0.75` OR when `planTier === "pro"`. The surrounding dashboard grid must handle the absent element gracefully — the 6-column span disappears from the row.
- **Computed badge text:** `Math.round((usedGB / totalGB) * 100)` → `"76% used"` or `"77% used"`. Do not store a pre-computed string in the data layer — compute inline in the component from the raw GB values.
- **Heading two-line layout:** the design puts a `<br/>` between the two sentences. Reproduce as a JSX `<br />` inside the `<h3>` string, not as two separate paragraphs.
- **Dynamic copy — FLAG:** the design hardcodes "Pro" and "$99/mo". If the user is on Starter, should the banner say "Upgrade to Plus" or "Upgrade to Pro"? For now, the stub data is always Plus, so the design copy is always correct. If multi-tier copy is required later, add a `upgradePlanName: string` prop and pass it from the parent. Do not invent a plan-lookup inside this component.
- **"$99/mo" copy — FLAG:** this price matches the Contentful Pro plan entry. It is currently hardcoded in the design copy string. Do not fetch Contentful from inside this component. Either hardcode the string or have the parent derive `upgradePlanPrice` from the fetched plan list and pass it as a prop. Decision deferred — flag before building.
- **"Upgrade now" CTA destination — FLAG:** the design uses `href="#"`. Natural destinations: `/#plans` (homepage pricing section) or `/dashboard/billing` for plan management. Confirm with product before implementing.
- **"Compare plans →" destination — FLAG:** also `href="#"` in the design. Natural: `/#plans`. Confirm.
- **`btn-upgrade` class in design:** `bg: #A100FF = bg-accent`, `h: 38px`, `px: 20px`, `rounded-lg`, text-sm font-semibold text-white. The Button atom's `size="md"` gives `h-11` (44px) — slightly taller than the design's 38px. Either (a) use the Button atom with `className="h-[38px]"` override, (b) render as a plain `<a>`/`NextLink` with Tailwind classes matching the design. The NextLink-with-button-classes pattern is already established in this project — use that.
- **Left accent bar:** a raw `<div className="w-[5px] shrink-0 bg-accent self-stretch" />` — the `self-stretch` (or `h-full` on the parent's flex container) ensures it spans the card's full height including the padding content.
- **Right SVG:** copy verbatim from lines ~518-524 of `TelcoNow_Dashboard_dc.html`. Wrap in `<div className="w-[140px] shrink-0 flex items-center justify-center overflow-hidden" aria-hidden="true">`. No className on the SVG itself — all sizing is via the container.
- **Server Component:** no interactivity. Keep it a Server Component — no `"use client"`.
- **`border-accent-tint2` token:** the design uses `#E5CCFF` for the banner border. `accent-tint2` maps to `#E5CCFF` in `tailwind.config.ts` — use `border-accent-tint2` as the Tailwind class.
