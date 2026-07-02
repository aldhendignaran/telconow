import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { formatAUD } from "@/lib/money";
import { getPlans } from "@/lib/contentful";
import type { TPlanCatalogueEntry } from "@/types";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/atoms/Badge";
import { Divider } from "@/components/ui/atoms/Divider";
import { SkeletonBlock } from "@/components/ui/atoms/SkeletonBlock";
import { SectionHeader } from "@/components/ui/molecules/SectionHeader";

// ─── Check icon ──────────────────────────────────────────────────────────────
// Inline SVG — not a lucide icon. Circle + checkmark, two variants.

function CheckIcon({ featured }: { featured: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="9" cy="9" r="9" fill={featured ? "#A100FF" : "#F5EEFF"} />
      <path
        d="M5 9l3 3 5-5"
        stroke={featured ? "#fff" : "#A100FF"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── CTA link classes ─────────────────────────────────────────────────────────

const ctaBase =
  "flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: TPlanCatalogueEntry }) {
  const { name, monthlyAUD, description, features, highlighted } = plan;
  const priceDisplay = formatAUD(monthlyAUD).replace(/\.00$/, "");

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl bg-surface p-8 transition-all",
        highlighted
          ? "-my-2 border-2 border-accent shadow-[0_4px_24px_rgba(161,0,255,0.14)] hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(161,0,255,0.22)]"
          : "border border-border shadow-card hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(70,0,115,0.13)]"
      )}
    >
      {/* "Most popular" badge — absolute at top edge of featured card */}
      {highlighted && (
        <Badge
          variant="purple"
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1"
        >
          Most popular
        </Badge>
      )}

      {/* Plan name label */}
      <p
        className={cn(
          "mb-2 text-xs font-medium uppercase tracking-wide",
          highlighted ? "text-accent" : "text-text-secondary"
        )}
      >
        {name}
      </p>

      {/* Price */}
      <div className="mb-1 flex items-end gap-1">
        <span className="text-[48px] font-bold leading-none tracking-[-0.03em] text-accent-deep">
          {priceDisplay}
        </span>
        <span className="pb-2 text-base font-medium text-text-secondary">/month</span>
      </div>

      {/* Description */}
      <p className="mb-8 text-sm text-text-secondary">{description}</p>

      {/* Divider */}
      <Divider className="mb-7" />

      {/* Feature list — flex-1 pushes CTA to bottom */}
      <ul className="mb-9 flex flex-1 flex-col gap-[14px]">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <CheckIcon featured={highlighted} />
            <span
              className={cn(
                "text-[15px] text-text-primary",
                highlighted && "font-medium"
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <NextLink
        href="/login"
        className={cn(
          ctaBase,
          highlighted
            ? "bg-accent text-text-inverse hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30"
            : "border-[1.5px] border-accent bg-transparent text-accent hover:bg-accent-tint"
        )}
      >
        Get {name}
      </NextLink>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export async function PlansSection() {
  let plans: TPlanCatalogueEntry[] = [];
  let hasError = false;

  try {
    const raw = await getPlans();
    plans = raw
      .sort((a, b) => a.fields.sortOrder - b.fields.sortOrder)
      .map((p) => ({
        tier: p.fields.tier,
        name: p.fields.name,
        monthlyAUD: p.fields.monthlyPriceAUD,
        dataLimitGB: p.fields.dataLimitGB ?? null,
        description: p.fields.description ?? "",
        features: p.fields.features,
        highlighted: p.fields.highlighted,
      }));
  } catch {
    hasError = true;
  }

  return (
    <Section background="white" id="plans">
      <Container>
        <SectionHeader
          eyebrow="Pricing"
          heading="Simple, honest pricing."
          align="center"
          className="mb-12"
        />

        {hasError || plans.length === 0 ? (
          <p className="text-center text-sm text-text-secondary">
            Pricing temporarily unavailable — call us on 13 XX XX
          </p>
        ) : (
          <Grid cols={3} gap={6}>
            {plans.map((plan) => (
              <PlanCard key={plan.tier} plan={plan} />
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
// Export for use as <Suspense fallback={<PlansSectionSkeleton />}> in app/page.tsx.

export function PlansSectionSkeleton() {
  return (
    <Section background="white" id="plans">
      <Container>
        {/* Section header skeleton */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <SkeletonBlock width="w-16" height="h-3" />
          <SkeletonBlock width="w-56" height="h-8" />
        </div>

        <Grid cols={3} gap={6}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-xl border border-border p-8">
              <SkeletonBlock width="w-20" height="h-3" className="mb-2" />
              <SkeletonBlock width="w-28" height="h-12" className="mb-1" />
              <SkeletonBlock width="w-40" height="h-4" className="mb-8" />
              <SkeletonBlock width="w-full" height="h-px" className="mb-7" />
              <div className="mb-9 flex flex-col gap-[14px]">
                {Array.from({ length: 5 }).map((_, j) => (
                  <SkeletonBlock key={j} width="w-full" height="h-4" />
                ))}
              </div>
              <SkeletonBlock width="w-full" height="h-11" rounded="lg" />
            </div>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
