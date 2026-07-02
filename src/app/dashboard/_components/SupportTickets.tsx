import NextLink from "next/link";
import { Badge } from "@/components/ui/atoms/Badge";
import { CardHeader } from "@/components/ui/molecules/CardHeader";
import { formatDateMed } from "@/lib/utils";
import type { TTicket, TTicketStatus, TTicketPriority } from "@/types";

const STATUS_BADGE: Record<TTicketStatus, { variant: "success" | "warning" | "default" | "danger"; label: string }> = {
  open: { variant: "warning", label: "Open" },
  resolved: { variant: "success", label: "Resolved" },
  closed: { variant: "default", label: "Closed" },
};

const PRIORITY_BADGE: Record<TTicketPriority, { variant: "danger" | "warning" | "default"; label: string }> = {
  high: { variant: "danger", label: "High" },
  medium: { variant: "warning", label: "Medium" },
  low: { variant: "default", label: "Low" },
};

interface SupportTicketsProps {
  tickets: TTicket[];
}

export function SupportTickets({ tickets }: SupportTicketsProps) {
  const recent = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
      <CardHeader
        label="Support"
        action={
          <NextLink href="/dashboard/support" className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover">
            View all →
          </NextLink>
        }
      />

      {recent.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-text-secondary">No support tickets yet.</p>
          <NextLink
            href="/dashboard/support"
            className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
          >
            Raise a ticket →
          </NextLink>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {recent.map((ticket) => {
            const status = STATUS_BADGE[ticket.status];
            const priority = PRIORITY_BADGE[ticket.priority];
            return (
              <div
                key={ticket.id}
                className="flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-bg"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">{ticket.subject}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {ticket.id} · Opened {formatDateMed(ticket.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <Badge variant={priority.variant}>{priority.label}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
