import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";
import { Cluster } from "@/components/layout/Cluster";
import { Heading } from "@/components/ui/atoms/Heading";
import { AnnouncementPill } from "@/components/ui/molecules/AnnouncementPill";
import { TrustBar } from "@/components/TrustBar";
import { HeroIllustration } from "@/components/HeroIllustration";

export interface HeroSectionProps {
  headline: string;
  subcopy: string;
  ctaLabel: string;
  ctaUrl: string;
}

const ctaBase =
  "inline-flex h-[52px] items-center justify-center rounded-lg px-7 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

export function HeroSection({ headline, subcopy, ctaLabel, ctaUrl }: HeroSectionProps) {
  return (
    <section className="w-full overflow-hidden bg-panel">
      <Container>
        <div className="relative flex h-[440px] items-center">
          {/* Left column — 55% width, sits above the illustration */}
          <Stack gap={6} className="relative z-[2] w-[55%]">
            <AnnouncementPill label="5G Now Live Nationwide" />

            <Heading level={1} variant="hero" color="inverse">
              {headline}
            </Heading>

            <p className="max-w-[480px] text-lg leading-[1.6] text-text-onDarkMuted">
              {subcopy}
            </p>

            <Cluster gap={4} className="mt-2">
              <a
                href={ctaUrl}
                className={cn(
                  ctaBase,
                  "bg-accent text-text-inverse hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30"
                )}
              >
                {ctaLabel}
              </a>
              <a
                href="#"
                className={cn(
                  ctaBase,
                  "border-[1.5px] border-white/70 bg-transparent text-white hover:border-white hover:bg-white/10"
                )}
              >
                Check coverage
              </a>
            </Cluster>
          </Stack>

          {/* Right decorative illustration — absolute, clipped by overflow-hidden on section */}
          <div
            className="absolute inset-y-0 right-0 flex w-[45%] items-center justify-end"
            aria-hidden="true"
          >
            <HeroIllustration />
          </div>
        </div>
      </Container>

      <TrustBar />
    </section>
  );
}
