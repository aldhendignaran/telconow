import { cn, formatDateLong } from "@/lib/utils";
import { getBlogPosts } from "@/lib/contentful";
import type { TContentfulBlogPost } from "@/types/contentful";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/ui/atoms/Heading";
import { Link } from "@/components/ui/atoms/Link";
import { SkeletonBlock } from "@/components/ui/atoms/SkeletonBlock";
import { ErrorState } from "@/components/ui/ErrorState";

// ─── Accent bar colours by card index ────────────────────────────────────────
// Design order: card 0 → #A100FF (bg-accent), 1 → #460073 (bg-panel),
// 2 → #7500C0 (bg-accent-hover). Story note has 1 and 2 swapped — design wins.
const accentBars = ["bg-accent", "bg-panel", "bg-accent-hover"] as const;

// ─── Blog card ────────────────────────────────────────────────────────────────

function BlogCard({ post, index }: { post: TContentfulBlogPost; index: number }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border shadow-card transition-all hover:-translate-y-[3px] hover:shadow-[0_8px_28px_rgba(70,0,115,0.12)]">
      <div className={cn("h-2 w-full", accentBars[index] ?? "bg-accent")} aria-hidden="true" />

      <Stack gap={4} className="flex-1 px-7 pb-6 pt-7">
        <div>
          <span className="inline-block rounded-full bg-accent-tint px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-deep">
            {post.fields.category}
          </span>
        </div>

        <div>
          <Heading level={3} className="mb-2.5 leading-[1.35] tracking-tight">
            {post.fields.title}
          </Heading>
          <p className="line-clamp-2 text-sm leading-[1.6] text-text-secondary">
            {post.fields.excerpt}
          </p>
        </div>

        {/* mt-auto pushes footer to card bottom regardless of title/excerpt height */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <Stack className="gap-0.5">
            <span className="text-[13px] font-semibold text-text-primary">
              {post.fields.author}
            </span>
            <span className="text-xs text-text-secondary">
              {formatDateLong(post.fields.publishDate)}
            </span>
          </Stack>
          <Link href="#" variant="default" className="text-sm font-semibold">
            Read more →
          </Link>
        </div>
      </Stack>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export async function BlogSection() {
  let posts: TContentfulBlogPost[] = [];
  let hasError = false;

  try {
    posts = await getBlogPosts();
    if (posts.length === 0) hasError = true;
  } catch {
    hasError = true;
  }

  return (
    <Section background="white">
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <Stack className="gap-2.5">
            <span className="text-xs font-medium uppercase tracking-wide text-accent">Blog</span>
            <Heading level={2} className="text-[32px]">
              From the TelcoNow blog
            </Heading>
          </Stack>
          <Link href="#" variant="default" className="mb-1.5 text-sm font-semibold">
            View all articles →
          </Link>
        </div>

        {hasError ? (
          <ErrorState message="Blog posts temporarily unavailable." />
        ) : (
          <Grid cols={3} gap={6}>
            {posts.map((post, index) => (
              <BlogCard key={post.sys.id} post={post} index={index} />
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
// Export for use as <Suspense fallback={<BlogSectionSkeleton />}> in app/page.tsx.

export function BlogSectionSkeleton() {
  return (
    <Section background="white">
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <Stack className="gap-2.5">
            <SkeletonBlock width="w-8" height="h-3" />
            <SkeletonBlock width="w-64" height="h-9" />
          </Stack>
          <SkeletonBlock width="w-32" height="h-4" />
        </div>

        <Grid cols={3} gap={6}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border border-border"
            >
              <SkeletonBlock height="h-2" rounded="sm" />
              <Stack gap={4} className="flex-1 px-7 pb-6 pt-7">
                <SkeletonBlock width="w-20" height="h-5" rounded="full" />
                <Stack className="gap-2.5">
                  <SkeletonBlock width="w-full" height="h-5" />
                  <SkeletonBlock width="w-4/5" height="h-5" />
                </Stack>
                <Stack gap={2}>
                  <SkeletonBlock width="w-full" height="h-4" />
                  <SkeletonBlock width="w-3/4" height="h-4" />
                </Stack>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                  <Stack className="gap-0.5">
                    <SkeletonBlock width="w-24" height="h-4" />
                    <SkeletonBlock width="w-20" height="h-3" />
                  </Stack>
                  <SkeletonBlock width="w-20" height="h-4" />
                </div>
              </Stack>
            </div>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
