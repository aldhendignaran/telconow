# Support Feature

Covers `tickets.json`. Types in `brief/data-model.md` (`TTicket`,
`TTicketStatus`, `TTicketPriority`).

---

## Data fetch

```typescript
// lib/mock-data.ts
import type { TTicket } from "@/types";

const TICKETS: TTicket[] = [
  {
    id: "TKT-4821",
    subject: "Billing query — June invoice",
    status: "open",
    priority: "medium",
    createdAt: "2026-06-19T10:15:00Z",
    updatedAt: "2026-06-20T09:30:00Z",
  },
  {
    id: "TKT-4756",
    subject: "Network connectivity issue — home address",
    status: "resolved",
    priority: "low",
    createdAt: "2026-06-10T16:45:00Z",
    updatedAt: "2026-06-12T14:20:00Z",
  },
];

export async function getTickets(customerId: string): Promise<TTicket[]> {
  // Swap: return db.ticket.findMany({ where: { customerId }, orderBy: { updatedAt: 'desc' } })
  return TICKETS;
}

export async function createTicket(
  customerId: string,
  input: { subject: string; priority: "low" | "medium" | "high"; description: string }
): Promise<TTicket> {
  // Swap: return db.ticket.create({ data: { customerId, ...input, status: 'open' } })
  const ticket: TTicket = {
    id: `TKT-${Math.floor(Math.random() * 9000 + 1000)}`,
    subject: input.subject,
    status: "open",
    priority: input.priority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  TICKETS.unshift(ticket);
  return ticket;
}
```

### WARNING — `Math.random()` ticket ID generation is dev-only

The mock `createTicket` generates a 4-digit ID with `Math.random()` —
fine for local dev, but has a real collision chance at low volume and
no uniqueness guarantee. A real DB-backed implementation should use the
DB's own auto-increment/UUID, not carry this pattern forward. Flagging
explicitly so it isn't copy-pasted into a production data layer later.

---

## Dashboard widget (summary view)

Shows: open-ticket count badge, 2 most recent tickets (subject, status
badge, priority badge, date), "+ Raise a ticket" button linking to
`/dashboard/support`.

```typescript
const openCount = tickets.filter((t) => t.status === "open").length;
const recentTickets = tickets
  .slice()
  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  .slice(0, 2);
```

---

## `/dashboard/support` full page

1. Full ticket list (all tickets, not just 2) — status + priority badges
   per `ui/badge.md`, sorted by `updatedAt` descending
2. "Raise a ticket" form: subject (text), priority (select: low/medium/high),
   description (textarea) — **description is required for ticket
   creation but `TTicket` has no description field**, see below
3. Filter/sort controls — **not specced anywhere**, reasonable to add
   a status filter (All/Open/Resolved) given the design implies this is
   a list view, but treat as nice-to-have, not a blocking requirement

### CRITICAL — `TTicket` has no `description` field but a raise-ticket form needs one

The provided `tickets.json` only has `subject`, not a longer description
— but any real "raise a ticket" form needs more than a one-line subject
to be useful to a support agent. This is a genuine data model gap, not
just a missing UI nicety.

**Fix:** add `description: string` to `TTicket` in `data-model.md`
before building the raise-ticket form. Since the provided JSON predates
this field, treat the two existing mock tickets as needing a
backfilled placeholder description when added to `mock-data.ts` — don't
leave the field undefined for them, since `TTicket.description` should
be required, not optional (every ticket, including future ones, needs
one).

---

## Status → badge variant mapping

```typescript
const statusBadgeVariant: Record<TTicketStatus, "warning" | "success" | "default"> = {
  open: "warning",
  resolved: "success",
  closed: "default",
};

const priorityBadgeVariant: Record<TTicketPriority, "danger" | "warning" | "default"> = {
  high: "danger",
  medium: "default",  // design shows medium as neutral/default, not warning
  low: "default",
};
```

Note: the design only shows `medium` and `low` priority examples, both
rendered as `badge-neutral`. `high` priority has no example in the
provided design — `danger` variant above is a reasonable inference, not
a confirmed design decision. Flag if a `high`-priority ticket ever needs
to render and look visually wrong against intent.
