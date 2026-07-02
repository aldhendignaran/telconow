# Story: AddOnsCard

**Story ID:** TN-016
**Component:** `AddOnsCard.tsx`
**Design reference:** `/designs/TelcoNow_Dashboard_dc.html` → "Add-ons & Extras card (6-col, third row right)"
**Stub data:** `/stubs/data/addons.json` via `GET /api/stub/addons`

---

## Story

As an authenticated TelcoNow customer on the dashboard
I want to see and toggle my active add-ons at a glance
So that I can manage subscriptions without leaving the overview page

---

## Acceptance criteria

### Happy path

```
Given I am on /dashboard and add-ons data loads successfully
When the AddOnsCard renders
Then I see a white card (bg-surface, border-border, shadow-card, rounded-xl)
  spanning 6 of 12 grid columns
```

```
Given the card renders
Then the header row shows:
  - Left: "ADD-ONS & EXTRAS" — text-xs font-medium uppercase tracking-wide text-text-secondary (CardHeader label)
  - Right: "Explore more →" link — text-accent, text-sm, font-semibold, href="/dashboard/addons" (CardHeader action)
```

```
Given addons.json contains 4 add-ons
Then the card shows the first 3 add-ons in their JSON array order:
  1. International Roaming  (active)
  2. Extra Data — 5GB       (inactive)
  3. Netflix Bundle         (active)
And the 4th add-on (Device Protection) is not shown in this dashboard widget
```

```
Given an add-on row renders
Then it shows in order (left to right):
  - Icon tile: 40×40px, rounded-[10px]
      active add-on:   bg-accent-tint2 background, accent-deep icon stroke
      inactive add-on: bg-border background, text-text-secondary icon stroke
  - Name: text-sm font-semibold text-text-primary
  - Price below name: text-xs text-text-secondary (see price format flag below)
  - AddonToggle (right side): active=true shows purple toggle, active=false shows grey
  - "Manage"/"Add" text link: text-xs font-semibold text-accent, href="/dashboard/addons"
      active add-on:   link text "Manage"
      inactive add-on: link text "Add"
```

```
Given an add-on row is inactive (active: false)
Then the entire row renders at 70% opacity (opacity-70)
```

```
Given I click a toggle on an active add-on
Then the toggle shows a pending/disabled state (opacity-50, pointer-events-none)
And toggleAddonAction(addonId) is called via the AddonToggle "use client" sub-component
And when the Server Action completes, the toggle reflects the new state
And revalidatePath reloads the card with fresh data from the server
And no confirmation dialog is shown — toggle is the confirm (deliberate UX decision, see addons-feature.md)
```

```
Given I click a toggle on an inactive add-on
Then the same pending → action → revalidate flow applies as above
And the add-on becomes active with no intermediate confirmation
```

### Loading state

```
Given the dashboard page is fetching add-ons data
Then the AddOnsCard slot shows a skeleton matching the card layout:
  - A short SkeletonBlock for the header
  - 3 skeleton rows, each with:
      A SkeletonBlock (40×40, rounded-lg) for the icon tile
      Two stacked SkeletonBlocks for name + price
      A SkeletonBlock for the toggle area
And no spinner is shown
```

_The skeleton is owned by the dashboard page's `loading.tsx`, not this component._

### Error state

```
Given GET /api/stub/addons returns an error
Then the card renders an ErrorState component:
  message: "Unable to load add-ons."
  onRetry: not required (read-only display; toggle requires a page interaction)
And the ErrorState is contained within the card boundary
```

### Edge cases

```
Given the addons array is empty
Then the card renders the header row normally
And the list area shows: "No add-ons available."
  in text-sm text-text-secondary
And no ErrorState is used — empty is valid
```

```
Given a toggle action is in-flight (isPending = true)
Then that specific toggle is disabled and visually dimmed (opacity-50)
And other toggles on the card remain interactive
And the user cannot double-trigger the same toggle mid-request
```

---

## Out of scope

- Full add-ons marketplace — that is `/dashboard/addons`, not this card
- Confirmation modal on toggle — accepted as toggle-as-confirm per `brief/addons-feature.md`; do not add a dialog unless the product decision changes
- Filtering or sorting add-ons by category
- Displaying all 4 add-ons — dashboard widget shows first 3 only

---

## Notes for developer

- **Data source:** fetch `TAddon[]` from `GET /api/stub/addons` in the dashboard page Server Component; slice to first 3; pass as `addons: TAddon[]` prop. The component does no fetching.
- **Toggle sub-component:** `AddonToggle` is a `"use client"` component defined in `app/dashboard/addons/_components/addon-toggle.tsx` (full implementation stub in `brief/addons-feature.md`). Import it into `AddOnsCard` — a Server Component can render a Client Component without becoming client itself.
- **`AddOnsCard` Server Component:** the card itself has no hooks or browser APIs. Keep it a Server Component. Only `AddonToggle` carries the `"use client"` boundary.
- **Price format — FLAG:** the design shows `"$15.00/mo"` for monthly add-ons and `"$8.00 one-off"` for one-off add-ons. `TAddon` has no `billingType` or `isMonthly` field. Resolve before building: either (a) add `billingType: "monthly" | "once"` to `TAddon` type and `addons.json` — recommended, (b) infer from category (`data` → one-off, others → monthly) — fragile. Do not hardcode per add-on name.
- **Price conversion:** `addons.json` has `price: 15.00` (dollars). `TAddon.priceAUD` is cents after `dollarsToCents()`. Format: `formatAUD(addon.priceAUD).replace(/\.00$/, '')` → `"$15"`. Then append `"/mo"` or `" one-off"` depending on the resolved billing type.
- **Sub-detail text — FLAG:** the design shows `"$15.00/mo · Asia Pacific"` and `"$18.00/mo · Standard HD"` below the add-on name. These sub-details are **not in `addons.json`** — `description` contains different copy ("Calls, texts and data in 40+ countries"). For the dashboard widget, display the `description` field below the name, or display price only. Do not invent a `region` or `tier` field.
- **Icon tile SVGs:** copy the 3 SVGs verbatim from the design HTML (section G, lines ~456, ~470, ~484 in `TelcoNow_Dashboard_dc.html`). Convert HTML attrs to JSX camelCase. Implement as a lookup by `category`: `iconMap["travel"]`, `iconMap["data"]`, `iconMap["entertainment"]`. The 4th category `"insurance"` (Device Protection) is not shown in the dashboard widget but will appear on the full addons page — include it in the lookup now using a sensible SVG placeholder.
- **Inactive row opacity:** apply `opacity-70` to the entire row `<div>` when `addon.active === false`. This is a CSS class, not a JS condition — no `"use client"` needed.
- **"Manage"/"Add" link text:** `addon.active ? "Manage" : "Add"`. Both link to `href="/dashboard/addons"`. These are `NextLink` not `<button>` — they navigate, they don't trigger the toggle directly.
- **Toggle atom:** a `Toggle` atom already exists at `components/ui/atoms/Toggle.tsx`. However, for the Server Action pattern, use `AddonToggle` from `brief/addons-feature.md` which wraps the toggle with `useTransition` and the Server Action call — do not use the bare `Toggle` atom directly for add-on rows, as it lacks the pending state and action wiring.
- **`CardHeader` molecule:** already built. Use it for the "ADD-ONS & EXTRAS" label + "Explore more →" NextLink as the `action` prop.
