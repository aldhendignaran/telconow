import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PageHeader } from "@/components/ui/molecules/PageHeader";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader greeting="Settings" subtitle="Manage your account preferences." />

      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-6 py-16 text-center shadow-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="9" r="3.5" stroke="#9CA3AF" strokeWidth="1.5" />
            <path d="M3 20c0-4.142 4.029-7.5 9-7.5s9 3.358 9 7.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">Settings coming soon</p>
          <p className="mt-1 text-xs text-text-secondary">
            Account settings are not yet available. Check back in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
