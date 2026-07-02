import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUsage, getBilling, getActivity, getUsageHistory, getAddons, getTickets } from "@/lib/mock-data";
import { getGreeting } from "@/lib/utils";
import { PageHeader } from "@/components/ui/molecules/PageHeader";
import { PlanSummaryCard } from "./_components/PlanSummaryCard";
import { UsageMeterCard } from "./_components/UsageMeterCard";
import { BillingCard } from "./_components/BillingCard";
import { ActivityFeed } from "./_components/ActivityFeed";
import { UsageHistoryChart } from "./_components/UsageHistoryChart";
import { AddOnsCard } from "./_components/AddOnsCard";
import { SupportTickets } from "./_components/SupportTickets";
import { UpgradeBanner } from "./_components/UpgradeBanner";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { name, plan } = session.user;

  const [usage, billing, activities, history, addons, tickets] = await Promise.all([
    getUsage(),
    getBilling(),
    getActivity(),
    getUsageHistory(),
    getAddons(session.user.id),
    getTickets(),
  ]);

  const greeting = `${getGreeting()}, ${name.split(" ")[0]}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <PageHeader
        greeting={greeting}
        subtitle={`Here's a summary of your ${plan.planName} plan.`}
      />

      {/* Upgrade banner — spans full width, shown conditionally */}
      <UpgradeBanner
        usedGB={usage.usedGB}
        totalGB={usage.totalGB}
        planTier={plan.planTier}
      />

      {/* Row 1: Plan summary (4 cols) + Usage meter (8 cols) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-4">
          <PlanSummaryCard plan={plan} />
        </div>
        <div className="col-span-12 md:col-span-8">
          <UsageMeterCard usage={usage} />
        </div>
      </div>

      {/* Row 2: Billing (4 cols) + Activity feed (8 cols) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-4">
          <BillingCard billing={billing} />
        </div>
        <div className="col-span-12 md:col-span-8">
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Row 3: Usage history chart (full width) */}
      <UsageHistoryChart history={history} />

      {/* Row 4: Add-ons (4 cols) + Support (6 cols) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-4">
          <AddOnsCard addons={addons} />
        </div>
        <div className="col-span-12 md:col-span-6">
          <SupportTickets tickets={tickets} />
        </div>
      </div>
    </div>
  );
}
