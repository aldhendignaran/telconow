import NextLink from "next/link";
import { Badge } from "@/components/ui/atoms/Badge";
import { Divider } from "@/components/ui/atoms/Divider";
import { CardHeader } from "@/components/ui/molecules/CardHeader";
import { KeyValueRow } from "@/components/ui/molecules/KeyValueRow";
import { formatAUD } from "@/lib/money";
import { formatDateMed } from "@/lib/utils";
import type { TCustomerPlan } from "@/types";

const DATA_LIMIT: Record<string, string> = {
  starter: "25GB",
  plus: "50GB",
  pro: "Unlimited",
};

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  active: "success",
  suspended: "warning",
  cancelled: "danger",
};

interface PlanSummaryCardProps {
  plan: TCustomerPlan;
}

export function PlanSummaryCard({ plan }: PlanSummaryCardProps) {
  const price = formatAUD(plan.monthlyCostAUD).replace(/\.00$/, "");
  const dataLabel = DATA_LIMIT[plan.planTier] ?? "—";
  const statusLabel = plan.status.charAt(0).toUpperCase() + plan.status.slice(1);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
      <CardHeader
        label="Current Plan"
        action={
          <Badge variant={STATUS_VARIANT[plan.status] ?? "default"} dot>
            {statusLabel}
          </Badge>
        }
      />

      {/* Plan name + price */}
      <div>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-[26px] font-bold tracking-tight text-accent-deep">
            {plan.planName}
          </span>
          <Badge variant="purple">{dataLabel}</Badge>
        </div>
        <div className="text-[28px] font-bold tracking-tight text-text-primary">
          {price}
          <span className="text-sm font-normal text-text-secondary">/mo</span>
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-2">
        <KeyValueRow label="Renews" value={formatDateMed(plan.renewalDate)} />
        <KeyValueRow label="Contract" value="No lock-in" />
      </div>

      <NextLink
        href="/dashboard/billing"
        className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
      >
        Manage plan →
      </NextLink>
    </div>
  );
}
