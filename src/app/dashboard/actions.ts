"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toggleAddon, createTicket } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";
import type { TAddon, TTicket, TTicketPriority } from "@/types";

export async function toggleAddonAction(addonId: string): Promise<TAddon> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const updated = await toggleAddon(session.user.id, addonId);
  revalidatePath("/dashboard/addons");
  revalidatePath("/dashboard");
  return updated;
}

export async function createTicketAction(input: {
  subject: string;
  priority: TTicketPriority;
  description: string;
}): Promise<TTicket> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const ticket = await createTicket(session.user.id, input);
  revalidatePath("/dashboard/support");
  revalidatePath("/dashboard");
  return ticket;
}
