import NextLink from "next/link";
import { LayoutGrid, Clock, CreditCard, PlusCircle, AlignLeft, User } from "lucide-react";
import { SidebarNavItem } from "@/components/ui/molecules/SidebarNavItem";
import { UserChip } from "@/components/ui/molecules/UserChip";
import { LogoutButton } from "@/components/LogoutButton";

interface SidebarProps {
  name: string;
  planName: string;
  initials: string;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/usage", label: "Usage", icon: Clock },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/addons", label: "Add-ons", icon: PlusCircle },
  { href: "/dashboard/support", label: "Support", icon: AlignLeft },
  { href: "/dashboard/settings", label: "Settings", icon: User },
] as const;

export function Sidebar({ name, planName, initials }: SidebarProps) {
  return (
    <aside className="flex w-[240px] shrink-0 flex-col overflow-y-auto bg-panel">
      {/* Wordmark */}
      <div className="border-b border-white/[0.08] px-5 pb-5 pt-6">
        <NextLink href="/" className="block">
          <div className="text-lg font-bold tracking-tight text-text-inverse">
            Telco<span className="text-accent-tint2">Now</span>
          </div>
        </NextLink>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.04em] text-accent-tint2">
          My Account
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </nav>

      {/* User chip + logout */}
      <div className="flex flex-col gap-3 border-t border-white/[0.08] px-5 py-4">
        <UserChip name={name} planName={planName} initials={initials} />
        <LogoutButton />
      </div>
    </aside>
  );
}
