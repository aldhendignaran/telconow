import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

const PLAN_DISPLAY: Record<string, string> = {
  starter: "Starter plan",
  plus: "Plus plan",
  pro: "Pro plan",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { name, plan } = session.user;
  const planName = PLAN_DISPLAY[plan.planTier] ?? plan.planName;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar name={name} planName={planName} initials={getInitials(name)} />
      <main className="min-w-0 flex-1 overflow-y-auto bg-bg p-8">
        {children}
      </main>
    </div>
  );
}
