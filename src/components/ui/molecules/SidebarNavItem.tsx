"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function SidebarNavItem({ href, label, icon: IconComponent }: SidebarNavItemProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <NextLink
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-white/12 text-text-inverse"
          : "text-text-onDarkMuted hover:bg-white/[0.08] hover:text-text-inverse"
      )}
    >
      <IconComponent width={18} height={18} aria-hidden />
      {label}
    </NextLink>
  );
}
