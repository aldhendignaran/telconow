# Coding Standards

Always apply. Referenced by `CLAUDE.md` — this is the single source for
these rules; don't restate them elsewhere.

---

## Architecture

- Server Components by default. `"use client"` only for interactivity, hooks, or browser APIs.
- No `any`. Strict TypeScript throughout.
- All props interfaces defined and exported from `types/index.ts`.
- Tailwind only — no inline styles. Use `cn()` (clsx + tailwind-merge) for conditional classes.
- Mobile-first: base styles mobile, `md:`/`lg:` for desktop.
- `next/image` for all images (width, height, alt always set).
- One component per file. Kebab-case filenames, PascalCase component names.
- Page-specific components in `app/(route)/_components/`. Shared (2+ pages) in `components/`.
- Loading and error states for every async component (see `brief/solution-architecture.md` for `loading.tsx` placement).
- Semantic HTML, one `h1` per page, `aria-label` on icon-only buttons.

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `account-summary.tsx` |
| Components | PascalCase | `AccountSummary` |
| Hooks | camelCase, `use` prefix | `useAccountData` |
| Types/interfaces | PascalCase, `T` prefix | `TCustomer` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |

## Before writing any code

1. Check `build-log.md` — what's already built, what's in progress.
2. State the file name and its path.
3. List any new dependencies required.
4. Flag if the task touches auth, Contentful schema, or env vars.
5. Update `build-log.md` when a task is complete.
