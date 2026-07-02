import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAddons } from "@/lib/mock-data";
import { CardHeader } from "@/components/ui/molecules/CardHeader";
import { PageHeader } from "@/components/ui/molecules/PageHeader";
import { AddonToggle } from "./_components/addon-toggle";
import { formatAUD } from "@/lib/money";
import type { TAddonCategory } from "@/types";

const CATEGORY_LABEL: Record<TAddonCategory, string> = {
  travel: "Travel",
  data: "Data",
  entertainment: "Entertainment",
  insurance: "Insurance",
};

const CATEGORY_STYLE: Record<TAddonCategory, { bg: string; fg: string }> = {
  travel: { bg: "bg-accent-tint2", fg: "text-accent-deep" },
  data: { bg: "bg-info-bg", fg: "text-info" },
  entertainment: { bg: "bg-success-bg", fg: "text-success" },
  insurance: { bg: "bg-warning-bg", fg: "text-warning" },
};

export default async function AddonsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const addons = await getAddons(session.user.id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader greeting="Add-ons" subtitle="Activate or deactivate add-ons for your plan." />

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
        <CardHeader label="Available Add-ons" />

        {addons.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-secondary">No add-ons available for your plan.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {addons.map((addon) => {
              const style = CATEGORY_STYLE[addon.category];
              const price = formatAUD(addon.priceAUD).replace(/\.00$/, "");

              return (
                <div
                  key={addon.id}
                  className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition-colors ${
                    addon.active
                      ? "border-accent-tint2 bg-accent-tint"
                      : "border-border bg-surface"
                  }`}
                >
                  {/* Category tile */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${style.bg}`}>
                    <span className={`text-xs font-bold uppercase ${style.fg}`}>
                      {CATEGORY_LABEL[addon.category].slice(0, 2)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">{addon.name}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{addon.description}</p>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-text-primary">{price}</p>
                    <p className="text-xs text-text-secondary">/mo</p>
                  </div>

                  {/* Toggle */}
                  <AddonToggle addonId={addon.id} initialActive={addon.active} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-text-secondary">
        Changes take effect immediately. Add-ons are billed at your next renewal date.
      </p>
    </div>
  );
}
