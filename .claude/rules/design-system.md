# TelcoNow — Design System

> Single implementation source for every UI primitive (layout → atoms → molecules).
> Read this file before building any component in `src/components/layout/`,
> `src/components/ui/atoms/`, or `src/components/ui/molecules/`.
> See `src/ui/component-registry.md` for the import-path index and used-in tracking.

---

## Token reference

All Tailwind colour classes are defined in `tailwind.config.ts` — never use hex
values in component files. Full token documentation: `designs/tokens.md`.

| Role | Tailwind class |
|---|---|
| Page background | `bg-bg` |
| Card / panel background | `bg-surface` |
| Sidebar / hero background | `bg-panel` |
| Footer accent | `bg-panel-alt` |
| Hairlines, dividers | `border-border` |
| Body copy | `text-text-primary` |
| Labels, captions, muted | `text-text-secondary` |
| Text on dark backgrounds | `text-text-inverse` |
| Muted text on dark panel | `text-text-onDarkMuted` |
| Primary action | `bg-accent` / `text-accent` |
| Action hover | `bg-accent-hover` |
| Brand headings (light bg) | `text-accent-deep` |
| Soft accent tint | `bg-accent-tint` |
| Strong accent tint | `bg-accent-tint2` |
| Semantic success | `text-success` / `bg-success-bg` |
| Semantic warning | `text-warning` / `bg-warning-bg` / `bg-warning-accent` |
| Semantic danger | `text-danger` / `bg-danger-bg` |
| Semantic info | `text-info` / `bg-info-bg` |
| Card shadow | `shadow-card` |

Typography classes (from `designs/tokens.md`):

| Role | Classes |
|---|---|
| Hero (h1, homepage only) | `text-[52px] font-bold tracking-tight leading-tight` |
| Display (price, large stat) | `text-4xl font-bold` |
| Heading 1 (dashboard greeting) | `text-[28px] font-bold tracking-tight` |
| Heading 2 (section headers) | `text-2xl font-bold tracking-tight` |
| Heading 3 (card titles) | `text-lg font-semibold` |
| Body | `text-base font-normal` |
| Body small | `text-sm font-normal` |
| Caption | `text-xs text-text-secondary` |
| Label (uppercase, tracked) | `text-xs font-medium uppercase tracking-wide text-text-secondary` |

Border radius: `rounded-lg` (8px) for buttons/inputs, `rounded-xl` (12px) for
cards, `rounded-full` for badges/pills/avatars.

---

## New dependency

`lucide-react` is required for `Icon`, `SidebarNavItem`, and `ErrorState`.
Install it once before building those components:

```bash
npm install lucide-react
```

---

## Layout primitives

### Container

**File:** `src/components/layout/Container.tsx`

Max-width wrapper with responsive horizontal padding. Used on every page — always
wraps page content that should be constrained.

```tsx
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-4 md:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}
```

---

### Section

**File:** `src/components/layout/Section.tsx`

Full-width `<section>` with background colour and consistent vertical padding.
`Container` goes inside `Section`, never the other way round.

```tsx
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  background?: "white" | "tint" | "dark";
  className?: string;
}

export function Section({ children, background = "white", className }: SectionProps) {
  return (
    <section
      className={cn(
        "w-full py-16 md:py-20",
        {
          "bg-surface": background === "white",
          "bg-bg": background === "tint",
          "bg-panel": background === "dark",
        },
        className
      )}
    >
      {children}
    </section>
  );
}
```

Note: `background="dark"` sets `bg-panel` (#460073). All child text must use
`text-text-inverse` or `text-text-onDarkMuted`.

---

### Grid

**File:** `src/components/layout/Grid.tsx`

CSS grid with configurable column count and gap. Uses a lookup map so Tailwind
sees static class strings at build time — do not interpolate col/gap values.

```tsx
import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 4 | 5 | 6 | 8;
  className?: string;
}

const colsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

const gapMap: Record<number, string> = {
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
};

export function Grid({ children, cols = 3, gap = 6, className }: GridProps) {
  return (
    <div className={cn("grid", colsMap[cols], gapMap[gap], className)}>
      {children}
    </div>
  );
}
```

---

### Stack

**File:** `src/components/layout/Stack.tsx`

Vertical flex column. The workhorse for stacking form fields, card rows, and
list items. Use instead of raw `<div className="flex flex-col gap-*">`.

```tsx
import { cn } from "@/lib/utils";

interface StackProps {
  children: React.ReactNode;
  gap?: 2 | 3 | 4 | 5 | 6 | 8;
  className?: string;
}

const gapMap: Record<number, string> = {
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
};

export function Stack({ children, gap = 4, className }: StackProps) {
  return (
    <div className={cn("flex flex-col", gapMap[gap], className)}>
      {children}
    </div>
  );
}
```

---

### Cluster

**File:** `src/components/layout/Cluster.tsx`

Horizontal flex row with configurable gap and alignment. Use for inline groups:
icon + label, badge + text, button pairs. Use instead of raw
`<div className="flex items-center gap-*">`.

```tsx
import { cn } from "@/lib/utils";

interface ClusterProps {
  children: React.ReactNode;
  gap?: 2 | 3 | 4 | 6 | 8;
  align?: "start" | "center" | "end";
  wrap?: boolean;
  className?: string;
}

const gapMap: Record<number, string> = {
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

const alignMap: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

export function Cluster({ children, gap = 2, align = "center", wrap = false, className }: ClusterProps) {
  return (
    <div className={cn("flex flex-row", gapMap[gap], alignMap[align], wrap && "flex-wrap", className)}>
      {children}
    </div>
  );
}
```

---

## Atoms

### Button

**File:** `src/components/ui/atoms/Button.tsx`

Full spec and implementation: `.claude/ui/button.md`. Copy the code exactly
as written there. No changes needed.

---

### Badge

**File:** `src/components/ui/atoms/Badge.tsx`

Full spec and implementation: `.claude/ui/badge.md`. Copy the code exactly
as written there. No changes needed.

---

### Heading

**File:** `src/components/ui/atoms/Heading.tsx`

Renders `h1`–`h4` with the project type scale. `variant` controls visual size
(defaults to match `level` when omitted). Use `Heading` for all headings in
reusable components — do not use raw `<h1>–<h4>` tags.

```tsx
import { cn } from "@/lib/utils";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingVariant = "hero" | "display" | "h1" | "h2" | "h3";
type HeadingColor = "primary" | "inverse" | "accent-deep" | "secondary";

interface HeadingProps {
  level: HeadingLevel;
  variant?: HeadingVariant;
  color?: HeadingColor;
  children: React.ReactNode;
  className?: string;
}

const defaultVariant: Record<HeadingLevel, HeadingVariant> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h3",
};

const variantClasses: Record<HeadingVariant, string> = {
  hero: "text-[52px] font-bold tracking-tight leading-tight",
  display: "text-4xl font-bold",
  h1: "text-[28px] font-bold tracking-tight",
  h2: "text-2xl font-bold tracking-tight",
  h3: "text-lg font-semibold",
};

const colorClasses: Record<HeadingColor, string> = {
  primary: "text-text-primary",
  inverse: "text-text-inverse",
  "accent-deep": "text-accent-deep",
  secondary: "text-text-secondary",
};

export function Heading({ level, variant, color = "primary", children, className }: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  const resolvedVariant = variant ?? defaultVariant[level];
  return (
    <Tag className={cn(variantClasses[resolvedVariant], colorClasses[color], className)}>
      {children}
    </Tag>
  );
}
```

---

### Text

**File:** `src/components/ui/atoms/Text.tsx`

Inline or block text in the project's body scale. Renders `<p>` by default;
pass `as="span"` for inline use.

```tsx
import { cn } from "@/lib/utils";

type TextVariant = "body" | "body-sm" | "caption" | "label";
type TextColor = "primary" | "secondary" | "inverse" | "onDarkMuted";

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  as?: "p" | "span" | "div";
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<TextVariant, string> = {
  body: "text-base font-normal",
  "body-sm": "text-sm font-normal",
  caption: "text-xs",
  label: "text-xs font-medium uppercase tracking-wide",
};

const colorClasses: Record<TextColor, string> = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  inverse: "text-text-inverse",
  onDarkMuted: "text-text-onDarkMuted",
};

export function Text({ variant = "body", color = "primary", as: Tag = "p", children, className }: TextProps) {
  return (
    <Tag className={cn(variantClasses[variant], colorClasses[color], className)}>
      {children}
    </Tag>
  );
}
```

---

### Link

**File:** `src/components/ui/atoms/Link.tsx`

Wraps `next/link`. `variant` controls colour and underline behaviour. Use
`variant="nav"` for site-header navigation items.

```tsx
import NextLink from "next/link";
import { cn } from "@/lib/utils";

type LinkVariant = "default" | "muted" | "inverse" | "nav";

interface LinkProps {
  href: string;
  variant?: LinkVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<LinkVariant, string> = {
  default: "text-accent underline-offset-4 hover:underline",
  muted: "text-text-secondary hover:text-text-primary transition-colors",
  inverse: "text-text-onDarkMuted hover:text-text-inverse transition-colors",
  nav: "text-sm font-medium text-text-primary hover:text-accent transition-colors",
};

export function Link({ href, variant = "default", children, className }: LinkProps) {
  return (
    <NextLink href={href} className={cn(variantClasses[variant], className)}>
      {children}
    </NextLink>
  );
}
```

---

### Icon

**File:** `src/components/ui/atoms/Icon.tsx`

Wraps `lucide-react` icons for consistent sizing and colour. Pass the icon
component directly — do not use string names.

Dependency: `lucide-react` (see top of file).

```tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconSize = "sm" | "md" | "lg";
type IconColor =
  | "primary"
  | "secondary"
  | "inverse"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "onDarkMuted";

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: IconColor;
  className?: string;
  "aria-label"?: string;
}

const sizeMap: Record<IconSize, number> = { sm: 16, md: 20, lg: 24 };

const colorClasses: Record<IconColor, string> = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  inverse: "text-text-inverse",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  onDarkMuted: "text-text-onDarkMuted",
};

export function Icon({
  icon: IconComponent,
  size = "md",
  color = "primary",
  className,
  "aria-label": ariaLabel,
}: IconProps) {
  const px = sizeMap[size];
  return (
    <IconComponent
      width={px}
      height={px}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      className={cn(colorClasses[color], className)}
    />
  );
}
```

---

### Input

**File:** `src/components/ui/atoms/Input.tsx`

Controlled or uncontrolled. `error` renders a red ring and message below the
field. `suffix` renders inside the right edge (e.g. a show-password toggle —
use a plain icon button or ghost Button).

```tsx
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password";
  error?: string;
  suffix?: React.ReactNode;
}

export function Input({ type, error, suffix, className, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "w-full rounded-lg border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0",
          "disabled:pointer-events-none disabled:opacity-50",
          error
            ? "border-danger focus:ring-danger"
            : "border-border hover:border-text-secondary",
          suffix && "pr-12",
          className
        )}
        {...props}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {suffix}
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
```

---

### Label

**File:** `src/components/ui/atoms/Label.tsx`

Form label. Always pair with an `Input` via `htmlFor`. For non-form labels
(section eyebrows, card sub-labels) use `Text variant="label"` instead.

```tsx
interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

export function Label({ htmlFor, children, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-text-primary ${className ?? ""}`}
    >
      {children}
    </label>
  );
}
```

---

### Divider

**File:** `src/components/ui/atoms/Divider.tsx`

Full-width horizontal rule using the `border-border` token.

```tsx
interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return <hr className={`border-t border-border ${className ?? ""}`} />;
}
```

---

### Avatar

**File:** `src/components/ui/atoms/Avatar.tsx`

Initials-based avatar. Background `bg-accent-tint2`, text `text-accent-deep`.
Always uppercase, always max 2 characters. Sizes: sm (32px), md (40px), lg (56px).

```tsx
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({ initials, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex select-none items-center justify-center rounded-full bg-accent-tint2 font-semibold text-accent-deep",
        sizeClasses[size],
        className
      )}
      aria-label={`Avatar: ${initials}`}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
```

---

### Toggle

**File:** `src/components/ui/atoms/Toggle.tsx`

Accessible on/off switch. Must be `"use client"` — it owns interactive state.
Used by the `AddonToggle` in the addons feature (`brief/addons-feature.md`).

```tsx
"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  "aria-label": string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, "aria-label": ariaLabel, disabled = false }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        checked ? "bg-accent" : "bg-border"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform translate-y-0.5",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
```

---

### ProgressBar

**File:** `src/components/ui/atoms/ProgressBar.tsx`

Single-track horizontal bar. Width is clamped to 100%. `variant="warning"`
turns the fill `bg-warning-accent` (used when data usage reaches the cap).
The two-segment overage visual in `UsageMeterCard` composes two instances of
this atom — that assembly lives at the card level, not inside this atom.

```tsx
import { cn } from "@/lib/utils";

type ProgressBarVariant = "default" | "warning";

interface ProgressBarProps {
  percent: number;
  variant?: ProgressBarVariant;
  className?: string;
}

export function ProgressBar({ percent, variant = "default", className }: ProgressBarProps) {
  const width = Math.min(Math.max(percent, 0), 100);
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-border", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-[width]",
          variant === "warning" ? "bg-warning-accent" : "bg-accent"
        )}
        style={{ width: `${width}%` }}
        role="progressbar"
        aria-valuenow={width}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
```

---

### SkeletonBlock

**File:** `src/components/ui/atoms/SkeletonBlock.tsx`

Animated shimmer placeholder. Compose multiple `SkeletonBlock`s to skeleton
an entire card. Never show a spinner — always use `SkeletonBlock` for loading.

```tsx
import { cn } from "@/lib/utils";

type SkeletonRounded = "sm" | "md" | "lg" | "full";

interface SkeletonBlockProps {
  width?: string;
  height?: string;
  rounded?: SkeletonRounded;
  className?: string;
}

const roundedMap: Record<SkeletonRounded, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function SkeletonBlock({
  width = "w-full",
  height = "h-4",
  rounded = "md",
  className,
}: SkeletonBlockProps) {
  return (
    <div
      className={cn("animate-pulse bg-border", width, height, roundedMap[rounded], className)}
      aria-hidden="true"
    />
  );
}
```

---

### StatusDot

**File:** `src/components/ui/atoms/StatusDot.tsx`

8px coloured dot for inline status indication. The `Badge` component uses its
own internal dot — this atom is for use outside badges (e.g. sidebar active
indicator, table row status).

```tsx
import { cn } from "@/lib/utils";

type StatusColor = "success" | "warning" | "danger" | "info" | "default";

interface StatusDotProps {
  color: StatusColor;
  className?: string;
}

const colorClasses: Record<StatusColor, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  default: "bg-text-secondary",
};

export function StatusDot({ color, className }: StatusDotProps) {
  return (
    <span
      className={cn("inline-block h-2 w-2 rounded-full", colorClasses[color], className)}
      aria-hidden="true"
    />
  );
}
```

---

## Molecules

### FormField

**File:** `src/components/ui/molecules/FormField.tsx`

Composes `Label` + `Input` into one vertical unit. `error` propagates to both
the red ring on the input and the message below it. Always prefer `FormField`
over bare `Label` + `Input` pairs in forms.

```tsx
import { Label } from "@/components/ui/atoms/Label";
import { Input } from "@/components/ui/atoms/Input";
import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  error?: string;
}

export function FormField({ id, label, type, error, ...inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} error={error} {...inputProps} />
    </div>
  );
}
```

---

### NavLink

**File:** `src/components/ui/molecules/NavLink.tsx`

Horizontal navigation link for `SiteHeader`. Active state: `text-accent font-semibold`.
Must be `"use client"` to read `usePathname()`.

```tsx
"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
}

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <NextLink
      href={href}
      className={cn(
        "text-sm font-medium transition-colors",
        active ? "font-semibold text-accent" : "text-text-primary hover:text-accent"
      )}
    >
      {label}
    </NextLink>
  );
}
```

---

### SidebarNavItem

**File:** `src/components/ui/molecules/SidebarNavItem.tsx`

Full-width sidebar nav row with icon and label. Active: `bg-white/12 text-text-inverse`.
Inactive: `text-text-onDarkMuted hover:bg-white/[0.08] hover:text-text-inverse`.
The overlay is opacity-based (`bg-white/12`) — not a hex token (see `designs/tokens.md`
sidebar note). Must be `"use client"` to read `usePathname()`.

Dependency: `lucide-react` (see top of file).

```tsx
"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function SidebarNavItem({ href, label, icon: IconComponent }: SidebarNavItemProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <NextLink
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-white/12 text-text-inverse"
          : "text-text-onDarkMuted hover:bg-white/[0.08] hover:text-text-inverse"
      )}
    >
      <IconComponent width={18} height={18} aria-hidden />
      {label}
    </NextLink>
  );
}
```

---

### StatTile

**File:** `src/components/ui/molecules/StatTile.tsx`

Small label + value display tile. Used below the progress bar in `UsageMeterCard`
to show Used / Remaining / Total data stats.

```tsx
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  background?: "default" | "tint";
  className?: string;
}

export function StatTile({ label, value, background = "default", className }: StatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg p-3",
        background === "tint" ? "bg-bg" : "bg-surface",
        className
      )}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </span>
      <span className="text-base font-semibold text-text-primary">{value}</span>
    </div>
  );
}
```

---

### KeyValueRow

**File:** `src/components/ui/molecules/KeyValueRow.tsx`

Inline label-value pair with space between. Used in `BillingCard` (next payment
date, amount) and `PlanSummaryCard` (plan name, renew date). `value` accepts a
`ReactNode` so a `Badge` can be passed directly.

```tsx
interface KeyValueRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function KeyValueRow({ label, value, className }: KeyValueRowProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className ?? ""}`}>
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}
```

---

### SectionHeader

**File:** `src/components/ui/molecules/SectionHeader.tsx`

Optional eyebrow label + heading. Used to open `PlansSection` and `BlogSection`
on the homepage. `align="center"` centres both elements.

```tsx
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  heading: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, heading, align = "left", className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2", align === "center" && "items-center text-center", className)}>
      {eyebrow && (
        <span className="text-xs font-medium uppercase tracking-wide text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-text-primary">{heading}</h2>
    </div>
  );
}
```

---

### PageHeader

**File:** `src/components/ui/molecules/PageHeader.tsx`

Dashboard page greeting (time-of-day + name) and subtitle. Greeting is computed
by the caller via `getGreeting()` from `lib/utils.ts`. Purely presentational —
no data fetching.

```tsx
interface PageHeaderProps {
  greeting: string;
  subtitle: string;
  className?: string;
}

export function PageHeader({ greeting, subtitle, className }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <h1 className="text-[28px] font-bold tracking-tight text-text-primary">{greeting}</h1>
      <p className="text-sm text-text-secondary">{subtitle}</p>
    </div>
  );
}
```

---

### AnnouncementPill

**File:** `src/components/ui/molecules/AnnouncementPill.tsx`

Rounded announcement chip displayed above the homepage hero headline. Intended
for use on the dark `bg-panel` hero surface — uses glass-effect styling.

```tsx
interface AnnouncementPillProps {
  label: string;
}

export function AnnouncementPill({ label }: AnnouncementPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-accent-tint2" aria-hidden="true" />
      <span className="text-xs font-medium text-text-onDarkMuted">{label}</span>
    </div>
  );
}
```

---

### UserChip

**File:** `src/components/ui/molecules/UserChip.tsx`

Sidebar user block — avatar + name + plan name. Sits at the bottom of `Sidebar`.
Props are derived from the NextAuth session (`TCustomerPublic.name` and plan
display name).

```tsx
import { Avatar } from "@/components/ui/atoms/Avatar";

interface UserChipProps {
  name: string;
  planName: string;
  initials: string;
  className?: string;
}

export function UserChip({ name, planName, initials, className }: UserChipProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <Avatar initials={initials} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-inverse">{name}</p>
        <p className="truncate text-xs text-text-onDarkMuted">{planName}</p>
      </div>
    </div>
  );
}
```

---

### CardHeader

**File:** `src/components/ui/molecules/CardHeader.tsx`

Top row of a dashboard card — left-aligned uppercase label and optional
right-aligned action (a "View all" link or small button). Used by all
dashboard cards.

```tsx
interface CardHeaderProps {
  label: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ label, action, className }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className ?? ""}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </span>
      {action}
    </div>
  );
}
```

---

## ErrorState

**File:** `src/components/ui/ErrorState.tsx`

Shared error state for every data-fetching component. See `component-registry.md` —
never render `null` or a blank `<div>` on error.

```tsx
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message = "Something went wrong.", onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-danger-bg bg-danger-bg p-6 text-center",
        className
      )}
    >
      <p className="text-sm text-danger">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-medium text-danger underline underline-offset-2 hover:no-underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
```

---

## Composition rules

1. Layout wraps everything: `Section > Container > Stack | Grid | Cluster`.
2. Never nest `Container` inside `Container`.
3. Never write raw `<div className="flex flex-col gap-*">` — use `Stack`.
4. Never write raw `<div className="flex items-center gap-*">` — use `Cluster`.
5. Never write raw `<h1>–<h4>` tags inside reusable components — use `Heading`
   (exception: `SectionHeader` and `PageHeader`, which have a single fixed heading
   role and embed the classes directly for clarity).
6. `SkeletonBlock` for all loading states. `ErrorState` for all error states.
   Never return `null` or an empty element.
7. Atoms are always Server Components unless they own interactivity (`Toggle`,
   `NavLink`, `SidebarNavItem`). Mark those with `"use client"`.
8. Molecules are Server Components unless they import a Client Component atom.
