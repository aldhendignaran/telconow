"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toggleAddon } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";
import type { TAddon } from "@/types";

export async function toggleAddonAction(addonId: string): Promise<TAddon> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const updated = await toggleAddon(session.user.id, addonId);
  revalidatePath("/dashboard/addons");
  revalidatePath("/dashboard");
  return updated;
}
