import { Badge } from "@/components/ui/atoms/Badge";

interface UpgradeBannerProps {
  usedGB: number;
  totalGB: number;
  planTier: string;
}

export function UpgradeBanner({ usedGB, totalGB, planTier }: UpgradeBannerProps) {
  if (planTier === "pro" || usedGB / totalGB < 0.75) return null;

  const pct = Math.round((usedGB / totalGB) * 100);

  return (
    <div className="relative col-span-12 overflow-hidden rounded-xl border border-accent-tint2 bg-accent-tint p-6">
      {/* Decorative concentric circles */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4" aria-hidden="true">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="99" stroke="#A100FF" strokeOpacity="0.12" strokeWidth="2" />
          <circle cx="100" cy="100" r="74" stroke="#A100FF" strokeOpacity="0.12" strokeWidth="2" />
          <circle cx="100" cy="100" r="49" stroke="#A100FF" strokeOpacity="0.12" strokeWidth="2" />
          <circle cx="100" cy="100" r="24" stroke="#A100FF" strokeOpacity="0.18" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative flex items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="warning">{pct}% used</Badge>
          </div>
          <p className="text-[22px] font-bold tracking-tight text-accent-deep">
            Running low on data?
          </p>
          <p className="text-sm text-text-secondary">
            Upgrade to Pro and get unlimited data for just{" "}
            <span className="font-semibold text-text-primary">$99/mo</span>.
          </p>
        </div>
        <a
          href="#"
          className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Upgrade to Pro
        </a>
      </div>
    </div>
  );
}
