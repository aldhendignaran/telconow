import { CardHeader } from "@/components/ui/molecules/CardHeader";
import { formatAUD } from "@/lib/money";
import type { TUsageHistoryPoint } from "@/types";

interface UsageHistoryChartProps {
  history: TUsageHistoryPoint[];
}

export function UsageHistoryChart({ history }: UsageHistoryChartProps) {
  const maxGB = Math.max(...history.map((h) => h.usedGB), 1);

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-6 shadow-card">
      <CardHeader label="Usage History" />

      <div className="flex items-end justify-between gap-2" style={{ height: "120px" }}>
        {history.map((point) => {
          const barPct = (point.usedGB / maxGB) * 100;
          const isOver = point.usedGB > point.totalGB;

          return (
            <div key={point.month} className="group relative flex flex-1 flex-col items-center gap-1.5">
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-14 left-1/2 z-10 hidden min-w-[96px] -translate-x-1/2 rounded-lg border border-border bg-surface px-2.5 py-2 shadow-card group-hover:block">
                <p className="text-xs font-semibold text-text-primary">{point.usedGB} GB</p>
                <p className="text-xs text-text-secondary">{formatAUD(point.costAUD).replace(/\.00$/, "")}</p>
              </div>

              {/* Bar */}
              <div className="relative flex w-full items-end rounded-t" style={{ height: "96px" }}>
                <div
                  className={`w-full rounded-t transition-all ${isOver ? "bg-warning-accent" : "bg-accent"}`}
                  style={{ height: `${barPct}%` }}
                  role="img"
                  aria-label={`${point.month}: ${point.usedGB} GB`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between gap-2">
        {history.map((point) => (
          <span key={point.month} className="flex-1 text-center text-[10px] text-text-secondary">
            {point.month.split(" ")[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
