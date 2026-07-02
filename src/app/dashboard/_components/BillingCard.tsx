import NextLink from "next/link";
import { Badge } from "@/components/ui/atoms/Badge";
import { Divider } from "@/components/ui/atoms/Divider";
import { CardHeader } from "@/components/ui/molecules/CardHeader";
import { KeyValueRow } from "@/components/ui/molecules/KeyValueRow";
import { formatAUD } from "@/lib/money";
import { formatDateMed } from "@/lib/utils";
import type { TBilling } from "@/types";

const PAYMENT_STATUS: Record<string, { variant: "success" | "warning" | "danger"; label: string }> = {
  paid: { variant: "success", label: "Paid" },
  pending: { variant: "warning", label: "Pending" },
  failed: { variant: "danger", label: "Failed" },
};

function VisaIcon() {
  return (
    <svg width="28" height="18" viewBox="0 0 28 18" fill="none" aria-hidden="true">
      <rect width="28" height="18" rx="3" fill="#1A1F71" />
      <path d="M11 13H9.4l1-5.8H12L11 13zm7.8-5.6c-.4-.15-.95-.3-1.67-.3-1.84 0-3.13.9-3.14 2.18-.01.95.9 1.48 1.58 1.8.7.32.94.53.94.82 0 .44-.56.64-1.08.64-.72 0-1.1-.1-1.7-.33l-.23-.1-.25 1.45c.42.18 1.18.34 1.97.34 1.96 0 3.22-.9 3.24-2.27.01-.76-.48-1.33-1.52-1.8-.63-.31-1.02-.52-1.02-.83 0-.28.33-.57 1.04-.57.6-.01 1.03.12 1.36.25l.16.07.25-1.35zm2.43-.2h-1.43c-.44 0-.77.12-.96.57L17.4 13h1.96l.39-1h2.39l.23 1H24l-1.57-5.8zm-2.3 3.6l.74-1.88.43 1.88h-1.17zM8.6 7.2l-1.83 3.96-.2-.96C6.23 9.3 5.4 8.4 4.5 8l1.67 5H8.1L10.7 7.2H8.6z" fill="#FAFAFA" />
    </svg>
  );
}

interface BillingCardProps {
  billing: TBilling;
}

export function BillingCard({ billing }: BillingCardProps) {
  const { nextPayment, lastPayment, paymentMethod } = billing;
  const nextAmount = formatAUD(nextPayment.amountAUD).replace(/\.00$/, "");
  const status = PAYMENT_STATUS[lastPayment.status] ?? { variant: "default" as const, label: lastPayment.status };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
      <CardHeader label="Billing" />

      {/* Next payment */}
      <div>
        <p className="mb-1 text-xs text-text-secondary">Next payment</p>
        <div className="flex items-baseline gap-1">
          <span className="text-[36px] font-bold tracking-tight text-accent-deep">{nextAmount}</span>
          <span className="text-sm text-text-secondary">due {formatDateMed(nextPayment.date)}</span>
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-2.5">
        <KeyValueRow
          label="Last payment"
          value={
            <span className="flex items-center gap-2">
              <span>{formatDateMed(lastPayment.date)}</span>
              <Badge variant={status.variant}>{status.label}</Badge>
            </span>
          }
        />
        <KeyValueRow
          label="Payment method"
          value={
            <span className="flex items-center gap-1.5">
              {paymentMethod.type === "visa" && <VisaIcon />}
              <span>•••• {paymentMethod.last4}</span>
            </span>
          }
        />
      </div>

      <NextLink
        href="/dashboard/billing"
        className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
      >
        Billing history →
      </NextLink>
    </div>
  );
}
