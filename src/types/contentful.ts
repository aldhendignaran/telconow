// Hand-written Contentful entry types.
// If more content types are added later, consider running the Contentful TS generator.

export interface TContentfulPlan {
  sys: { id: string };
  fields: {
    name: string;
    tier: "starter" | "plus" | "pro";
    /** AUD cents — content editors must enter cents, not dollars (e.g. Plus = 6500) */
    monthlyPriceAUD: number;
    /** undefined = unlimited */
    dataLimitGB?: number;
    /** Marketing copy — e.g. "Perfect for everyday use." Add to Contentful plan content type before going live. */
    description?: string;
    features: string[];
    highlighted: boolean;
    sortOrder: number;
  };
}

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
