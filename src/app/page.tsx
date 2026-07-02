import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { PlansSection, PlansSectionSkeleton } from "@/components/PlansSection";
import { PromoBanner } from "@/components/PromoBanner";
import { BlogSection, BlogSectionSkeleton } from "@/components/BlogSection";
import { SiteFooter } from "@/components/SiteFooter";
import { getHomepageSetting } from "@/lib/contentful";

const HERO_FALLBACK = {
  headline: "Australia's fastest growing telco",
  subcopy: "Get connected on Australia's most reliable 5G network. No lock-in contracts, no surprises.",
  ctaLabel: "View plans",
  ctaUrl: "#plans",
};

export default async function HomePage() {
  let hero = HERO_FALLBACK;
  try {
    const setting = await getHomepageSetting();
    hero = {
      headline: setting.fields.heroHeadline,
      subcopy: setting.fields.heroSubcopy,
      ctaLabel: setting.fields.heroCtaLabel,
      ctaUrl: setting.fields.heroCtaUrl,
    };
  } catch {
    // Contentful unavailable — render with fallback copy
  }

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection {...hero} />
        <Suspense fallback={<PlansSectionSkeleton />}>
          <PlansSection />
        </Suspense>
        <PromoBanner />
        <Suspense fallback={<BlogSectionSkeleton />}>
          <BlogSection />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
