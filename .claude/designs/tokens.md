# Design Tokens

Brand direction, colour palette, type scale, spacing. Pure tokens — no
component code. For component implementations using these tokens, see
`ui/button.md`, `ui/card.md`, `ui/badge.md`.

**Source of truth: approved design files** (`TelcoNow_Homepage_dc.html`,
`TelcoNow_Dashboard_dc.html`, `TelcoNow_Login_dc.html`). These tokens are
extracted directly from those files — if a colour needs to change, change
it in the design file first, then update this file to match.

---

## Brand direction

TelcoNow is a confident, modern Australian telco with a bold purple
identity — energetic without being garish, premium without being cold.
Deep purple (`#460073`) for structural/dark surfaces, vivid purple
(`#A100FF`) for action and emphasis, soft purple tint (`#F5EEFF`) as the
page background wash.

---

## Colour palette

```
--color-bg:           #F5EEFF   Page background — soft purple wash
--color-surface:      #FFFFFF   Cards, panels
--color-border:        #E8E8F0   Hairlines, dividers
--color-dark-panel:    #460073   Sidebar, header, hero background
--color-dark-panel-alt: #1E1E2E  Footer top border

--color-text-primary:    #0F0F1A  Body copy, headings
--color-text-secondary:  #4A4A5A  Labels, captions, muted
--color-text-inverse:    #FFFFFF  Text on dark backgrounds
--color-text-on-dark-muted: #E5CCFF  Muted text on dark purple panels (nav links, hero subcopy)

--color-accent:         #A100FF   Primary actions, links, active states
--color-accent-hover:   #7500C0   Darker on hover
--color-accent-deep:    #460073   Headings on light bg that want brand weight (prices, plan names)
--color-accent-tint:    #F5EEFF   Soft accent background — page bg, hover states
--color-accent-tint-2:  #E5CCFF   Stronger accent tint — badges, icon backgrounds, featured-plan badge

--color-success:       #00875F
--color-success-bg:    #E6F9F4
--color-warning:       #C94F10
--color-warning-bg:    #FFF2EC
--color-warning-accent: #FF6B35   Progress bar overage segment, alert icons
--color-danger:        #B5001F
--color-danger-bg:     #FFEDF0
--color-info:          #2A5CC7
--color-info-bg:       #EEF4FF
--color-neutral-badge: #4A4A5A
--color-neutral-badge-bg: #F0F0F6
```

`tailwind.config.ts` — this is the single source for the Tailwind colour
extension. Don't redefine these hex values anywhere else; reference the
Tailwind class names.

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5EEFF",
        surface: "#FFFFFF",
        border: { DEFAULT: "#E8E8F0" },
        panel: { DEFAULT: "#460073", alt: "#1E1E2E" },
        text: {
          primary: "#0F0F1A",
          secondary: "#4A4A5A",
          inverse: "#FFFFFF",
          onDarkMuted: "#E5CCFF",
        },
        accent: {
          DEFAULT: "#A100FF",
          hover: "#7500C0",
          deep: "#460073",
          tint: "#F5EEFF",
          tint2: "#E5CCFF",
        },
        success: { DEFAULT: "#00875F", bg: "#E6F9F4" },
        warning: { DEFAULT: "#C94F10", bg: "#FFF2EC", accent: "#FF6B35" },
        danger: { DEFAULT: "#B5001F", bg: "#FFEDF0" },
        info: { DEFAULT: "#2A5CC7", bg: "#EEF4FF" },
        neutralBadge: { DEFAULT: "#4A4A5A", bg: "#F0F0F6" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

---

## Typography

Font: **Inter** via `next/font/google`. No CDN link tag. Weights used in
design files: 400, 500, 600, 700.

```typescript
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
```

Scale — observed across all three design files:

| Role | Class | Size | Weight | Used for |
|---|---|---|---|---|
| Hero display | `text-[52px] font-bold tracking-tight` | 52px | 700 | Homepage hero h1 only |
| Display | `text-4xl font-bold` | 36px | 700 | Plan card price |
| Heading 1 | `text-[28px] font-bold tracking-tight` | 28px | 700 | Dashboard page greeting |
| Heading 2 | `text-2xl font-bold tracking-tight` | 32px | 700 | Section headers |
| Heading 3 | `text-lg font-semibold` | 18px | 600 | Card titles, blog titles |
| Body | `text-base font-normal` | 16px | 400 | Body copy |
| Body small | `text-sm font-normal` | 14px | 400 | Secondary copy, descriptions |
| Caption | `text-xs text-text-secondary` | 12px | 400–500 | Dates, meta info |
| Label | `text-xs font-medium uppercase tracking-wide text-text-secondary` | 12px | 500 | Section labels ("CURRENT PLAN", "PRICING") |

---

## Spacing system

Follow Tailwind defaults. Consistent usage observed in design files:

| Token | Value | Use |
|---|---|---|
| `gap-2` | 8px | Inline element gaps, icon-to-text |
| `gap-3.5` | 14px | List item internal gaps |
| `gap-4` | 16px | Form field spacing, card internal gaps |
| `gap-5` | 20px | Dashboard grid gap |
| `gap-6` | 24px | Card padding |
| `gap-8` | 32px | Section sub-element spacing, page padding |
| `gap-12` | 48px | Page horizontal padding (homepage) |
| `gap-16` | 64px | Page section spacing |
| `gap-20` | 80px | Homepage section vertical padding |

Border radius: `rounded-lg` (8px) for buttons/inputs, `rounded-xl` (12px)
for cards, `rounded-full` for badges/pills/avatars.

---

## Signature elements

- **Featured plan card** (homepage pricing): 2px solid accent border,
  `-8px` vertical offset (sits taller than siblings), "Most popular"
  pill badge in `accent-tint2` background with `accent-deep` text,
  positioned absolute at top, centred.
- **Dashboard sidebar**: deep purple (`panel`) background, white/muted
  nav items, active state gets `rgba(255,255,255,0.12)` background —
  this is an opacity overlay, not a flat colour; replicate with
  `bg-white/12` in Tailwind, not a new hex token.
- **Progress bar (data usage)**: two-segment gradient — purple up to the
  cap, `warning-accent` (#FF6B35) past it. This is the cap-overage
  visual signal, not a generic progress bar; see `brief/usage-feature.md`.
- **Upgrade banner**: 5px solid accent left border as an accent rail,
  light purple tint background, decorative concentric-circle SVG on
  the right edge — this pattern repeats (also in login left panel,
  homepage hero). Treat concentric rings + signal arcs as the brand's
  signature decorative motif, reusable across any promotional panel.
