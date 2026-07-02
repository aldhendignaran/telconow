import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";
import { Cluster } from "@/components/layout/Cluster";
import { Text } from "@/components/ui/atoms/Text";

export function TrustBar() {
  return (
    <div className="border-t border-white/10">
      <Container>
        <div className="flex h-20 items-center">
          <Cluster gap={8}>
            <Stack className="gap-0.5">
              <span className="text-xl font-bold tracking-tight text-text-inverse">
                99.8%
              </span>
              <Text as="span" variant="label" color="onDarkMuted">
                Network uptime
              </Text>
            </Stack>

            <div className="h-8 w-px bg-white/[0.15]" aria-hidden="true" />

            <Stack className="gap-0.5">
              <span className="text-xl font-bold tracking-tight text-text-inverse">
                4.2M+
              </span>
              <Text as="span" variant="label" color="onDarkMuted">
                Customers
              </Text>
            </Stack>

            <div className="h-8 w-px bg-white/[0.15]" aria-hidden="true" />

            <Stack className="gap-0.5">
              <span className="text-xl font-bold tracking-tight text-text-inverse">
                ★ 4.8
              </span>
              <Text as="span" variant="label" color="onDarkMuted">
                Award-winning support
              </Text>
            </Stack>
          </Cluster>
        </div>
      </Container>
    </div>
  );
}
