import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getBilling, getActivity } from "@/lib/mock-data";
import { Badge } from "@/components/ui/atoms/Badge";
import { Divider } from "@/components/ui/atoms/Divider";
import { CardHeader } from "@/components/ui/molecules/CardHeader";
import { PageHeader } from "@/components/ui/molecules/PageHeader";
import { BillingCard } from "../_components/BillingCard";
import { formatAUD } from "@/lib/money";
import { formatDateMed } from "@/lib/utils";
import type { TActivityStatus } from "@/types";

const STATUS_BADGE: Record<TActivityStatus, { variant: "success" | "warning" | "danger" | "default"; label: string }> = {
  completed: { variant: "success", label: "Paid" },
  pending: { variant: "warning", label: "Pending" },
  failed: { variant: "danger", label: "Failed" },
};

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [billing, activities] = await Promise.all([getBilling(), getActivity()]);
  const payments = activities
    .filter((a) => a.type === "payment")
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col gap-6">
      <PageHeader greeting="Billing" subtitle="Manage your billing details and view payment history." />

      {/* Top row */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5">
          <BillingCard billing={billing} />
        </div>
        <div className="col-span-12 md:col-span-7">
          <div className="flex h-full flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
            <CardHeader label="Payment Method" />
            <div className="flex items-center gap-4 rounded-lg border border-border px-4 py-4">
              <div className="flex h-10 w-14 items-center justify-center rounded border border-border bg-bg">
                <svg width="28" height="18" viewBox="0 0 28 18" fill="none" aria-hidden="true">
                  <rect width="28" height="18" rx="3" fill="#1A1F71" />
                  <path d="M11 13H9.4l1-5.8H12L11 13zm7.8-5.6c-.4-.15-.95-.3-1.67-.3-1.84 0-3.13.9-3.14 2.18-.01.95.9 1.48 1.58 1.8.7.32.94.53.94.82 0 .44-.56.64-1.08.64-.72 0-1.1-.1-1.7-.33l-.23-.1-.25 1.45c.42.18 1.18.34 1.97.34 1.96 0 3.22-.9 3.24-2.27.01-.76-.48-1.33-1.52-1.8-.63-.31-1.02-.52-1.02-.83 0-.28.33-.57 1.04-.57.6-.01 1.03.12 1.36.25l.16.07.25-1.35zm2.43-.2h-1.43c-.44 0-.77.12-.96.57L17.4 13h1.96l.39-1h2.39l.23 1H24l-1.57-5.8zm-2.3 3.6l.74-1.88.43 1.88h-1.17zM8.6 7.2l-1.83 3.96-.2-.96C6.23 9.3 5.4 8.4 4.5 8l1.67 5H8.1L10.7 7.2H8.6z" fill="#FAFAFA" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  Visa ending in {billing.paymentMethod.last4}
                </p>
                <p className="text-xs text-text-secondary">Default payment method</p>
              </div>
              <button
                disabled
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary opacity-50 cursor-not-allowed"
              >
                Update
              </button>
            </div>
            <p className="text-xs text-text-secondary">
              Payment method management requires PCI-compliant integration — not available in this demo.
            </p>
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
        <CardHeader label="Payment History" />
        {payments.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-secondary">No payment history.</p>
        ) : (
          <div className="flex flex-col">
            {payments.map((payment, idx) => {
              const status = STATUS_BADGE[payment.status] ?? { variant: "default" as const, label: payment.status };
              const amount = payment.amountAUD !== null
                ? formatAUD(Math.abs(payment.amountAUD))
                : "—";
              return (
                <div key={payment.id}>
                  <div className="flex items-center gap-4 px-3 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary">{payment.description}</p>
                      <p className="text-xs text-text-secondary">{formatDateMed(payment.timestamp)}</p>
                    </div>
                    <p className="text-sm font-semibold text-text-primary">{amount}</p>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  {idx < payments.length - 1 && <Divider />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
