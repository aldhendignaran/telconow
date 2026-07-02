import NextLink from "next/link";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";
import { Cluster } from "@/components/layout/Cluster";
import { Text } from "@/components/ui/atoms/Text";
import { Link } from "@/components/ui/atoms/Link";

type TFooterLink = { label: string; href: string };
type TFooterColumn = { heading: string; links: TFooterLink[] };

const FOOTER_COLUMNS: TFooterColumn[] = [
  {
    heading: "Plans",
    links: [
      { label: "Starter", href: "#" },
      { label: "Plus", href: "#" },
      { label: "Pro", href: "#" },
      { label: "Business", href: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help centre", href: "#" },
      { label: "Contact us", href: "#" },
      { label: "Coverage map", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-panel-alt pt-16">
      <Container>
        {/* Four-column layout */}
        <Cluster align="start" className="gap-12 pb-14">
          {/* Brand column — wider than the three link columns */}
          <Stack gap={4} className="flex-[1.4]">
            <NextLink href="/" className="text-xl font-bold tracking-tight">
              <span className="text-text-inverse">Telco</span>
              <span className="text-accent-tint2">Now</span>
            </NextLink>
            <Text variant="body-sm" color="onDarkMuted">
              Fast. Simple. Yours.
            </Text>
            <Text variant="body-sm" color="onDarkMuted">
              Australia&#39;s fastest growing 5G network. Built for real people, priced fairly.
            </Text>
          </Stack>

          {/* Plans, Support, Legal columns */}
          {FOOTER_COLUMNS.map(({ heading, links }) => (
            <Stack key={heading} gap={2} className="flex-1">
              <Text variant="label" color="secondary" className="mb-2">
                {heading}
              </Text>
              {links.map(({ label, href }) => (
                <Link key={label} href={href} variant="inverse" className="text-sm">
                  {label}
                </Link>
              ))}
            </Stack>
          ))}
        </Cluster>

        {/* Bottom bar */}
        <Cluster className="justify-between border-t border-panel-alt py-5">
          <Text variant="body-sm" color="onDarkMuted">
            © 2026 TelcoNow Pty Ltd
          </Text>
          <Text variant="body-sm" color="onDarkMuted">
            All prices include GST
          </Text>
        </Cluster>
      </Container>
    </footer>
  );
}
