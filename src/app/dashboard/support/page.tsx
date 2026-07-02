import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getTickets } from "@/lib/mock-data";
import { Badge } from "@/components/ui/atoms/Badge";
import { CardHeader } from "@/components/ui/molecules/CardHeader";
import { PageHeader } from "@/components/ui/molecules/PageHeader";
import { RaiseTicketForm } from "./_components/raise-ticket-form";
import { formatDateMed } from "@/lib/utils";
import type { TTicketStatus, TTicketPriority } from "@/types";

const STATUS_BADGE: Record<TTicketStatus, { variant: "warning" | "success" | "default"; label: string }> = {
  open: { variant: "warning", label: "Open" },
  resolved: { variant: "success", label: "Resolved" },
  closed: { variant: "default", label: "Closed" },
};

const PRIORITY_BADGE: Record<TTicketPriority, { variant: "danger" | "warning" | "default"; label: string }> = {
  high: { variant: "danger", label: "High" },
  medium: { variant: "default", label: "Medium" },
  low: { variant: "default", label: "Low" },
};

export default async function SupportPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tickets = await getTickets();
  const sorted = [...tickets].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        greeting="Support"
        subtitle="View your open tickets or raise a new one."
      />

      <div className="grid grid-cols-12 gap-5">
        {/* Ticket list */}
        <div className="col-span-12 md:col-span-7">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
            <CardHeader
              label="Your Tickets"
              action={
                openCount > 0 ? (
                  <Badge variant="warning">{openCount} open</Badge>
                ) : undefined
              }
            />

            {sorted.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-text-secondary">No tickets yet.</p>
                <p className="mt-1 text-xs text-text-secondary">Use the form to raise your first ticket.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {sorted.map((ticket) => {
                  const status = STATUS_BADGE[ticket.status];
                  const priority = PRIORITY_BADGE[ticket.priority];
                  return (
                    <div
                      key={ticket.id}
                      className="flex items-start gap-3 rounded-lg px-3 py-3.5 transition-colors hover:bg-bg"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary">{ticket.subject}</p>
                        <p className="mt-0.5 text-xs text-text-secondary">
                          {ticket.id} · Updated {formatDateMed(ticket.updatedAt)}
                        </p>
                        {ticket.description && (
                          <p className="mt-1 text-xs text-text-secondary line-clamp-1">{ticket.description}</p>
                        )}
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
        </div>

        {/* Raise a ticket form */}
        <div className="col-span-12 md:col-span-5">
          <RaiseTicketForm />
        </div>
      </div>
    </div>
  );
}
