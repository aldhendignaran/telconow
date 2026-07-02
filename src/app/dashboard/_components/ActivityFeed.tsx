import NextLink from "next/link";
import { Badge } from "@/components/ui/atoms/Badge";
import { CardHeader } from "@/components/ui/molecules/CardHeader";
import { formatAUD } from "@/lib/money";
import { formatDateMed } from "@/lib/utils";
import type { TActivity, TActivityType, TActivityStatus } from "@/types";

const ICON_TILES: Record<TActivityType, { bg: string; svgPath: React.ReactNode }> = {
  data_topup: {
    bg: "bg-accent-tint2",
    svgPath: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2v12M2 8h12" stroke="#460073" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  payment: {
    bg: "bg-success-bg",
    svgPath: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="#00875F" strokeWidth="1.4" />
        <path d="M1.5 6.5h13" stroke="#00875F" strokeWidth="1.4" />
      </svg>
    ),
  },
  plan_change: {
    bg: "bg-bg",
    svgPath: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2L10 6l4.5.65-3.25 3.17.77 4.48L8 12.1l-4.02 2.2.77-4.48L1.5 6.65 6 6 8 2z" stroke="#A100FF" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  addon: {
    bg: "bg-warning-bg",
    svgPath: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="#C94F10" strokeWidth="1.4" />
        <path d="M5 8c0-1.657 1.343-3 3-3M8 11v.5" stroke="#C94F10" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
};

function getBadge(type: TActivityType, status: TActivityStatus) {
  if (status === "pending") return <Badge variant="warning">Pending</Badge>;
  if (status === "failed") return <Badge variant="danger">Failed</Badge>;
  if (type === "plan_change") return <Badge variant="purple">Upgrade</Badge>;
  if (type === "payment") return <Badge variant="success">Paid</Badge>;
  return <Badge variant="success">Completed</Badge>;
}

interface ActivityFeedProps {
  activities: TActivity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const sorted = [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
      <CardHeader
        label="Recent Activity"
        action={
          <NextLink href="/dashboard/billing" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
            View all →
          </NextLink>
        }
      />

      {sorted.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-secondary">No recent activity.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {sorted.map((item) => {
            const tile = ICON_TILES[item.type];
            const amount = item.amountAUD !== null
              ? formatAUD(Math.abs(item.amountAUD))
              : "—";

            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 rounded-lg px-3 py-3 transition-colors hover:bg-bg"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${tile.bg}`}>
                  {tile.svgPath}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">{item.description}</p>
                  <p className="text-xs text-text-secondary">{formatDateMed(item.timestamp)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-text-primary">{amount}</p>
                  <div className="mt-0.5">{getBadge(item.type, item.status)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
