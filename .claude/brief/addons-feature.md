# Add-ons Feature

Covers `addons.json`. Types in `brief/data-model.md` (`TAddon`,
`TAddonCategory`). The one genuinely interactive (mutating) feature in
this rebuild — everything else so far has been read-only display.

---

## Data fetch

```typescript
// lib/mock-data.ts
import type { TAddon } from "@/types";
import { dollarsToCents } from "@/lib/money";

const ADDONS: TAddon[] = [
  { id: "addon_001", name: "International Roaming", description: "Calls, texts and data in 40+ countries", priceAUD: dollarsToCents(15), active: true, category: "travel" },
  { id: "addon_002", name: "Extra Data — 5GB", description: "One-off 5GB data boost, valid for 30 days", priceAUD: dollarsToCents(8), active: false, category: "data" },
  { id: "addon_003", name: "Netflix Bundle", description: "Netflix Standard included with your plan", priceAUD: dollarsToCents(18), active: true, category: "entertainment" },
  { id: "addon_004", name: "Device Protection", description: "Accidental damage and theft cover for your phone", priceAUD: dollarsToCents(12), active: false, category: "insurance" },
];

export async function getAddons(customerId: string): Promise<TAddon[]> {
  // Swap: return db.addon.findMany({ where: { customerId } })
  return ADDONS;
}

export async function toggleAddon(customerId: string, addonId: string): Promise<TAddon> {
  // Swap: return db.addon.update({ where: { id: addonId }, data: { active: !current } })
  const addon = ADDONS.find((a) => a.id === addonId);
  if (!addon) throw new Error("Addon not found");
  addon.active = !addon.active;
  return addon;
}
```

---

## Toggle interaction — Server Action, not client fetch

```typescript
// app/dashboard/addons/_components/addon-toggle.tsx
"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleAddonAction } from "../actions";

interface Props {
  addonId: string;
  initialActive: boolean;
}

export function AddonToggle({ addonId, initialActive }: Props) {
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
        "relative h-5 w-[34px] rounded-full transition-colors disabled:opacity-50",
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
```

```typescript
// app/dashboard/actions.ts
"use server";

import { toggleAddon } from "@/lib/mock-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleAddonAction(addonId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const updated = await toggleAddon(session.user.id, addonId);
  revalidatePath("/dashboard/addons");
  revalidatePath("/dashboard"); // addon summary widget also lives here
  return updated;
}
```

**Server Action over a REST route:** for a single mutation triggered
from one component, a Server Action co-locates the mutation with the UI
and avoids a separate `/api/addons/[id]/toggle/route.ts` file entirely —
revisit only if a non-Next.js client (mobile app, etc.) needs to call
this same mutation externally.

---

## CRITICAL — toggle needs a confirmation or undo, not instant silent activation

Activating an add-on with a real price (`$15/mo`, `$18/mo`) via a single
click with no confirmation is a billing-affecting action with no
friction. The design shows a plain toggle switch with no confirmation
step.

**Decide before shipping:** either (a) accept the toggle-is-the-confirm
pattern (common for low-stakes subscriptions, e.g. streaming add-ons —
reasonable if add-ons are trivially cancellable and clearly priced
inline, which they are here), or (b) add a confirm step for activation
(not deactivation) since adding a charge deserves more friction than
removing one. **Recommendation: accept the toggle-as-confirm pattern**
given price is always visible inline next to the toggle — but log this
as a deliberate UX decision, not a default that was never considered.

---

## Empty/loading states

- Toggle shows a disabled/pending state during the Server Action
  (`isPending` above) — don't let the user double-toggle mid-request
- If `getAddons()` returns an empty array (no add-ons available to this
  customer/region), show "No add-ons available" rather than an empty
  card — same empty-state principle already established for the
  activity feed in the original `build-spec.md`
