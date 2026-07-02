import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUsage, getUsageHistory } from "@/lib/mock-data";
import { PageHeader } from "@/components/ui/molecules/PageHeader";
import { UsageMeterCard } from "../_components/UsageMeterCard";
import { UsageHistoryChart } from "../_components/UsageHistoryChart";

export default async function UsagePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [usage, history] = await Promise.all([getUsage(), getUsageHistory()]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader greeting="Data Usage" subtitle="Your current cycle usage and 6-month history." />
      <UsageMeterCard usage={usage} />
      <UsageHistoryChart history={history} />
    </div>
  );
}
