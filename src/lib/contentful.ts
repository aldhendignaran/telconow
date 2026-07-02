import type {
  TContentfulPlan,
  TContentfulHomepageSetting,
  TContentfulBlogPost,
} from "@/types/contentful";

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

function contentfulUrl(params: string) {
  return `https://cdn.contentful.com/spaces/${SPACE}/entries?${params}`;
}

function headers() {
  return { Authorization: `Bearer ${TOKEN}` };
}

// In development, bypass the fetch cache so Contentful edits show immediately.
// In production, cache with the "homepage" tag — revalidated by the /api/revalidate webhook.
const fetchOptions: RequestInit =
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : { next: { tags: ["homepage"] } };

/**
 * Fetch all plans ordered by sortOrder ascending.
 * Cache tag: "homepage" — revalidated by the /api/revalidate webhook.
 */
export async function getPlans(): Promise<TContentfulPlan[]> {
  const res = await fetch(
    contentfulUrl("content_type=plan&order=fields.sortOrder"),
    { headers: headers(), ...fetchOptions }
  );
  if (!res.ok) throw new Error(`Contentful getPlans failed: ${res.status}`);
  const data = await res.json();
  return data.items as TContentfulPlan[];
}

/**
 * Fetch the single homepageSetting entry.
 * Cache tag: "homepage".
 */
export async function getHomepageSetting(): Promise<TContentfulHomepageSetting> {
  const res = await fetch(
    contentfulUrl("content_type=homepageSetting&limit=1"),
    { headers: headers(), ...fetchOptions }
  );
  if (!res.ok) throw new Error(`Contentful getHomepageSetting failed: ${res.status}`);
  const data = await res.json();
  if (!data.items?.[0]) throw new Error("homepageSetting entry missing in Contentful");
  return data.items[0] as TContentfulHomepageSetting;
}

/**
 * Fetch the 3 most recent blog posts, newest first.
 * Cache tag: "homepage".
 */
export async function getBlogPosts(): Promise<TContentfulBlogPost[]> {
  const res = await fetch(
    contentfulUrl("content_type=blogPost&order=-fields.publishDate&limit=3"),
    { headers: headers(), ...fetchOptions }
  );
  if (!res.ok) throw new Error(`Contentful getBlogPosts failed: ${res.status}`);
  const data = await res.json();
  return data.items as TContentfulBlogPost[];
}
