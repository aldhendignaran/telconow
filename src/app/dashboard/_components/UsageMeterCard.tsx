import { Badge } from "@/components/ui/atoms/Badge";
import { ProgressBar } from "@/components/ui/atoms/ProgressBar";
import { CardHeader } from "@/components/ui/molecules/CardHeader";
import { StatTile } from "@/components/ui/molecules/StatTile";
import { formatCycleDate } from "@/lib/utils";
import type { TUsage } from "@/types";

interface UsageMeterCardProps {
  usage: TUsage;
}

function daysRemaining(cycleEndDate: string): number {
  const end = new Date(cycleEndDate + "T23:59:59Z");
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86_400_000));
}

export function UsageMeterCard({ usage }: UsageMeterCardProps) {
  const { usedGB, totalGB, cycleStartDate, cycleEndDate, overageRate } = usage;
  const pct = (usedGB / totalGB) * 100;
  const days = daysRemaining(cycleEndDate);
  const isOverCap = usedGB > totalGB;
  const remainingGB = Math.max(0, totalGB - usedGB).toFixed(1);

  const badgeVariant: "success" | "warning" | "danger" =
    pct >= 100 ? "danger" : pct >= 80 ? "warning" : "success";

  const cycleLabel = `${formatCycleDate(cycleStartDate)} – ${formatCycleDate(cycleEndDate)}`;

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-6 shadow-card">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <CardHeader label="Data Usage" />
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-[32px] font-bold tracking-tight text-text-primary">
              {usedGB} GB
            </span>
            <span className="text-base text-text-secondary">of {totalGB} GB</span>
          </div>
        </div>
        <div className="text-right">
          <Badge variant={badgeVariant}>{Math.round(pct)}% used</Badge>
          <p className="mt-1.5 text-xs text-text-secondary">{days} days remaining</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        {isOverCap ? (
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full bg-accent" style={{ width: `${(totalGB / usedGB) * 100}%` }} />
            <div className="h-full flex-1 bg-warning-accent" />
          </div>
        ) : (
          <ProgressBar percent={pct} variant={pct >= 80 ? "warning" : "default"} />
        )}
        <div className="mt-1.5 flex justify-between text-[11px] text-text-secondary">
          <span>0 GB</span>
          <span className="font-semibold text-warning">▲ 80% warning threshold</span>
          <span>{totalGB} GB</span>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-4">
        <StatTile label="Remaining" value={`${remainingGB} GB`} background="tint" />
        <StatTile label="Cycle" value={cycleLabel} background="tint" />
        <StatTile
          label="Overage rate"
          value={`$${overageRate.toFixed(2)}/MB`}
          background="tint"
        />
      </div>
    </div>
  );
}
