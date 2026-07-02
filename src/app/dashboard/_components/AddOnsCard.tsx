import NextLink from "next/link";
import { CardHeader } from "@/components/ui/molecules/CardHeader";
import { AddonToggle } from "@/app/dashboard/addons/_components/addon-toggle";
import { formatAUD } from "@/lib/money";
import type { TAddon } from "@/types";

interface AddOnsCardProps {
  addons: TAddon[];
}

export function AddOnsCard({ addons }: AddOnsCardProps) {
  const preview = addons.slice(0, 3);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
      <CardHeader
        label="Add-ons"
        action={
          <NextLink href="/dashboard/addons" className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover">
            Manage →
          </NextLink>
        }
      />

      {preview.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-secondary">No add-ons available.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {preview.map((addon) => (
            <div
              key={addon.id}
              className={`flex items-center gap-3.5 rounded-lg px-3 py-3 transition-colors ${
                addon.active ? "" : "opacity-70"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${
                  addon.active ? "bg-accent-tint2" : "bg-border"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" stroke={addon.active ? "#460073" : "#9CA3AF"} strokeWidth="1.4" />
                  <path d="M8 5v6M5 8h6" stroke={addon.active ? "#460073" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">{addon.name}</p>
                <p className="text-xs text-text-secondary">
                  {formatAUD(addon.priceAUD).replace(/\.00$/, "")}/mo
                </p>
              </div>
              <AddonToggle addonId={addon.id} initialActive={addon.active} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
