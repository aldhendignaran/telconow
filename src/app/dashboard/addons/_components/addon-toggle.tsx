"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleAddonAction } from "../../actions";

interface AddonToggleProps {
  addonId: string;
  initialActive: boolean;
}

export function AddonToggle({ addonId, initialActive }: AddonToggleProps) {
  const [active, setActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const updated = await toggleAddonAction(addonId);
      setActive(updated.active);
    });
  }

  return (
    <button
      role="switch"
      aria-checked={active}
      aria-label={active ? "Deactivate add-on" : "Activate add-on"}
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "relative h-5 w-[34px] shrink-0 rounded-full transition-colors disabled:opacity-50",
        active ? "bg-accent" : "bg-border"
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-3.5 w-3.5 rounded-full bg-white transition-[left]",
          active ? "left-[17px]" : "left-[3px]"
        )}
      />
    </button>
  );
}
