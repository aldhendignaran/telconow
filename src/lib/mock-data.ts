import { readFileSync } from "fs";
import { join } from "path";
import { dollarsToCents } from "@/lib/money";
import type {
  TUsage,
  TBilling,
  TActivity,
  TActivityType,
  TActivityStatus,
  TUsageHistoryPoint,
  TAddon,
  TAddonCategory,
  TTicket,
  TTicketStatus,
  TTicketPriority,
} from "@/types";

function readStub<T>(name: string): T {
  const raw = readFileSync(join(process.cwd(), "stubs", `${name}.json`), "utf-8");
  return JSON.parse(raw) as T;
}

// ─── Usage ────────────────────────────────────────────────────────────────────

export async function getUsage(): Promise<TUsage> {
  return readStub<TUsage>("usage");
}

// ─── Billing ─────────────────────────────────────────────────────────────────

export async function getBilling(): Promise<TBilling> {
  const raw = readStub<{
    nextPayment: { date: string; amount: number };
    lastPayment: { date: string; amount: number; status: "paid" | "failed" | "pending" };
    paymentMethod: { type: "visa" | "mastercard" | "amex"; last4: string };
  }>("billing");

  return {
    nextPayment: {
      date: raw.nextPayment.date,
      amountAUD: dollarsToCents(raw.nextPayment.amount),
    },
    lastPayment: {
      date: raw.lastPayment.date,
      amountAUD: dollarsToCents(raw.lastPayment.amount),
      status: raw.lastPayment.status,
    },
    paymentMethod: raw.paymentMethod,
  };
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export async function getActivity(): Promise<TActivity[]> {
  const raw = readStub<
    { id: string; type: string; description: string; timestamp: string; amount: number | null; status: string }[]
  >("activity");

  return raw.map((item) => ({
    id: item.id,
    type: item.type as TActivityType,
    description: item.description,
    timestamp: item.timestamp,
    amountAUD: item.amount !== null ? dollarsToCents(item.amount) : null,
    status: item.status as TActivityStatus,
  }));
}

// ─── Usage history ────────────────────────────────────────────────────────────

export async function getUsageHistory(): Promise<TUsageHistoryPoint[]> {
  const raw = readStub<
    { month: string; usedGB: number; totalGB: number; cost: number }[]
  >("usage-history");

  return raw.map((point) => ({
    month: point.month,
    usedGB: point.usedGB,
    totalGB: point.totalGB,
    costAUD: dollarsToCents(point.cost),
  }));
}

// ─── Add-ons ──────────────────────────────────────────────────────────────────

// In-memory mutable store so toggleAddon persists within the process lifetime.
// Swap: replace with a real DB call.
let addonsStore: TAddon[] | null = null;

function getAddonsStore(): TAddon[] {
  if (!addonsStore) {
    const raw = readStub<
      { id: string; name: string; description: string; price: number; active: boolean; category: string }[]
    >("addons");
    addonsStore = raw.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      priceAUD: dollarsToCents(a.price),
      active: a.active,
      category: a.category as TAddonCategory,
    }));
  }
  return addonsStore;
}

export async function getAddons(_customerId: string): Promise<TAddon[]> {
  return getAddonsStore();
}

export async function toggleAddon(_customerId: string, addonId: string): Promise<TAddon> {
  const store = getAddonsStore();
  const addon = store.find((a) => a.id === addonId);
  if (!addon) throw new Error(`Addon not found: ${addonId}`);
  addon.active = !addon.active;
  return addon;
}

// ─── Tickets ──────────────────────────────────────────────────────────────────

export async function getTickets(): Promise<TTicket[]> {
  const raw = readStub<
    { id: string; subject: string; status: string; priority: string; createdAt: string; updatedAt: string }[]
  >("tickets");

  return raw.map((t) => ({
    id: t.id,
    subject: t.subject,
    description: "",
    status: t.status as TTicketStatus,
    priority: t.priority as TTicketPriority,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));
}
