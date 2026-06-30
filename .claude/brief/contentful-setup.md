# Contentful Setup

---

## Content types

Create these in Contentful → Content model.

### `plan`

| Field | Type | Notes |
|---|---|---|
| `name` | Short text | "Basic", "Standard", "Unlimited" |
| `tier` | Short text | Validation: starter \| plus \| pro |
| `monthlyPriceAUD` | Number | Integer — **enter in cents**, not dollars. Starter = 3900, Plus = 6500, Pro = 9900. Add this to the Contentful field help text to prevent editors entering dollar amounts. |
| `dataLimitGB` | Number | Leave empty for unlimited |
| `features` | Short text, list | One feature per item |
| `highlighted` | Boolean | Displays ring + badge in pricing grid |
| `sortOrder` | Number | Ascending order in pricing grid |

### `homepageSetting`

Single entry — one instance only.

| Field | Type | Notes |
|---|---|---|
| `heroHeadline` | Short text | Main hero heading |
| `heroSubcopy` | Short text | Hero supporting copy |
| `heroCtaLabel` | Short text | CTA button label |
| `heroCtaUrl` | Short text | CTA target — set to `/login` |
| `featureBlocks` | Rich text | Feature highlights section |

### `blogPost`

**NEW — added per `build-spec.md` homepage rebuild.** No article page is
specced yet; "Read more" links remain placeholders until one exists.

| Field | Type | Notes |
|---|---|---|
| `title` | Short text | "5G vs 4G: what actually changes for you" |
| `excerpt` | Short text | 2-line clamp in UI — keep under ~160 chars |
| `category` | Short text | "Technology" / "Tips" / "Company" observed in design — not a strict enum, marketing may add more |
| `author` | Short text | Display name only — no author bio/avatar in current design |
| `publishDate` | Date | Displayed as "14 June 2026" format |
| `slug` | Short text | For a future article page route — not used yet, but reserve the field now so content doesn't need re-entry later |

---

## TypeScript types — `types/contentful.ts`

Create this file alongside `types/index.ts`.

```typescript
// types/contentful.ts
// Hand-written Contentful entry types.
// If you add content types later, consider running the Contentful TypeScript generator.

export interface TContentfulPlan {
  sys: { id: string };
  fields: {
    name: string;
    tier: "starter" | "plus" | "pro";
    /** AUD cents */
    monthlyPriceAUD: number;
    /** undefined = unlimited */
    dataLimitGB?: number;
    features: string[];
    highlighted: boolean;
    sortOrder: number;
  };
}

/**
 * Map a fetched Contentful plan to TPlanCatalogueEntry for use in components.
 * Field name changes: monthlyPriceAUD → monthlyAUD (TPlanCatalogueEntry convention).
 * Import TPlanCatalogueEntry from "@/types" and use this mapping in app/page.tsx.
 *
 * const plans: TPlanCatalogueEntry[] = raw.map(p => ({
 *   tier: p.fields.tier,
 *   name: p.fields.name,
 *   monthlyAUD: p.fields.monthlyPriceAUD,   // ← rename here, not in the type
 *   dataLimitGB: p.fields.dataLimitGB ?? null,
 *   description: "",                          // not in Contentful schema — add field or hardcode
 *   features: p.fields.features,
 *   highlighted: p.fields.highlighted,
 * }));
 */

export interface TContentfulHomepageSetting {
  sys: { id: string };
  fields: {
    heroHeadline: string;
    heroSubcopy: string;
    heroCtaLabel: string;
    heroCtaUrl: string;
    featureBlocks: import("@contentful/rich-text-types").Document;
  };
}

export interface TContentfulBlogPost {
  sys: { id: string };
  fields: {
    title: string;
    excerpt: string;
    category: string;
    author: string;
    publishDate: string; // ISO date string
    slug: string;
  };
}
```

---

## Fetch utility — `lib/contentful.ts`

```typescript
import type { TContentfulPlan, TContentfulHomepageSetting, TContentfulBlogPost } from "@/types/contentful";

/**
 * Fetch all plans, sorted by sortOrder ascending.
 * Cache tag: 'homepage' — revalidated by Contentful webhook.
 */
export async function getPlans(): Promise<TContentfulPlan[]> {
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries?content_type=plan&order=fields.sortOrder`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      next: { tags: ["homepage"] },
    }
  );

  if (!res.ok) throw new Error(`Contentful fetch failed: ${res.status}`);

  const data = await res.json();
  return data.items as TContentfulPlan[];
}

/**
 * Fetch the single homepageSetting entry.
 * Cache tag: 'homepage'.
 */
export async function getHomepageSetting(): Promise<TContentfulHomepageSetting> {
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries?content_type=homepageSetting&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      next: { tags: ["homepage"] },
    }
  );

  if (!res.ok) throw new Error(`Contentful fetch failed: ${res.status}`);

  const data = await res.json();
  if (!data.items?.[0]) throw new Error("homepageSetting entry not found in Contentful");

  return data.items[0] as TContentfulHomepageSetting;
}

/**
 * Fetch the 3 most recent blog posts, newest first.
 * Cache tag: 'homepage'.
 */
export async function getBlogPosts(): Promise<TContentfulBlogPost[]> {
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries?content_type=blogPost&order=-fields.publishDate&limit=3`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      next: { tags: ["homepage"] },
    }
  );

  if (!res.ok) throw new Error(`Contentful fetch failed: ${res.status}`);

  const data = await res.json();
  return data.items as TContentfulBlogPost[];
}
```

**Note:** Uses the raw Contentful CDN fetch rather than the Contentful SDK
so Next.js `fetch` cache tagging works. The SDK wraps `node-fetch` and
bypasses Next.js's extended fetch — you'd lose `next: { tags }` entirely.

---

## CRITICAL — no fallback if Contentful is down

Both `getPlans()` and `getHomepageSetting()` throw on a non-OK response
or missing entry. As specced, an Error Component or Server Component
that calls these with no try/catch means **a Contentful outage takes
the entire homepage down** — the one page that should be most resilient
since it's the public front door.

**Fix:** `app/page.tsx` (Server Component) wraps both calls. Next.js
`error.tsx` will catch the throw and render the error boundary — but a
generic error boundary on the homepage looks broken, not "we're having
a temporary issue." Two options:

- **Minimum:** catch in `page.tsx`, render a degraded but functional
  homepage (hero with hardcoded fallback copy, pricing section replaced
  with "Pricing temporarily unavailable — call us on 13 XX XX") rather
  than letting the whole page 500.
- **Better:** Next.js `fetch` cache means a successful previous fetch is
  served stale-while-revalidate on next request even if Contentful is
  briefly down — confirm `revalidate` isn't set to `0` anywhere, since
  that would disable this safety net entirely. Don't add `{ cache: 'no-store' }`
  to these fetches.

Add explicit catch blocks in `getPlans()` / `getHomepageSetting()` callers,
not inside the functions themselves — let the functions throw, handle
the throw at the call site where you control the fallback UI.

---

## WARNING — rich text embedded assets not handled

`documentToReactComponents(document)` as specced uses the renderer's
defaults, which render embedded entries/assets (images dropped into the
Contentful rich text editor) as nothing or a broken reference — the
default renderer doesn't know how to render a Contentful asset without
an explicit `renderNode` override.

If `featureBlocks` content ever includes an inline image (likely — it's
a marketing feature section), it will silently disappear with the
current setup.

**Fix:** pass `renderNode` options for `EMBEDDED_ASSET_BLOCK`:

```typescript
import { BLOCKS } from "@contentful/rich-text-types";
import Image from "next/image";

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { url, width, height, description } = node.data.target.fields.file;
      return (
        <Image
          src={`https:${url}`}
          width={width}
          height={height}
          alt={description || ""}
        />
      );
    },
  },
};

documentToReactComponents(document, options);
```

Confirm `images.ctfassets.net` is in `next.config.ts` remotePatterns
(it already is — see `vercel-setup.md`).

---

## Rich text rendering

Install:

```bash
npm install @contentful/rich-text-react-renderer @contentful/rich-text-types
```

Usage in a Server Component:

```typescript
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";

interface Props {
  document: Document;
}

export function RichText({ document }: Props) {
  return (
    <div className="prose prose-neutral max-w-none">
      {documentToReactComponents(document)}
    </div>
  );
}
```
