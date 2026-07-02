# Story: SupportTickets

**Story ID:** TN-014
**Component:** `SupportTickets.tsx`
**Design reference:** `/designs/TelcoNow_Dashboard_dc.html` → "Support Tickets card (4-col, third row left)"
**Stub data:** `/stubs/data/tickets.json` via `GET /api/stub/tickets`

---

## Story

As an authenticated TelcoNow customer on the dashboard
I want to see my open support tickets and quickly raise a new one
So that I know the status of any ongoing issues without visiting the full support page

---

## Acceptance criteria

### Happy path

```
Given I am on /dashboard and ticket data loads successfully
When the SupportTickets card renders
Then I see a white card (bg-surface, border-border, shadow-card, rounded-xl)
  spanning 4 of 12 grid columns
```

```
Given the card renders with 1 open ticket
Then the header row shows:
  - Left: "SUPPORT TICKETS" — text-xs font-medium uppercase tracking-wide text-text-secondary (CardHeader label)
  - Right: a count badge — "1 open", Badge variant="warning"
    where count = number of tickets with status "open"
```

```
Given the card renders
Then up to 2 ticket cards are shown in a vertical Stack
  (the 2 most recently created tickets, sorted by createdAt descending)
And a "+ Raise a ticket" button renders below the ticket list
```

```
Given a ticket card renders
Then it shows:
  Top row (space-between):
    - Subject text: text-sm font-semibold text-text-primary (truncate with ellipsis if long)
    - Status badge (see status badge mapping below)
  Bottom row:
    - Priority badge: Badge variant="neutral", text "{Priority} priority" (e.g. "Medium priority")
    - Created date: text-xs text-text-secondary, formatted as DD MMM YYYY (e.g. "19 Jun 2026")
And each ticket card has a border (border-border), rounded-lg corners, and p-[14px] padding
```

```
Given status → badge mapping:
  "open"     → Badge variant="warning", text "Open"
  "resolved" → Badge variant="success", text "Resolved"
  "closed"   → Badge variant="neutral", text "Closed"
```

```
Given the "+ Raise a ticket" button renders
Then it is a secondary outlined button (Button variant="secondary", size="sm")
  rendered as a NextLink with href="/dashboard/support"
  and full width (className="w-full")
```

### Loading state

```
Given the dashboard page is fetching ticket data
Then the SupportTickets card slot shows a skeleton matching the card layout:
  - A short SkeletonBlock for the header
  - Two SkeletonBlock rows with internal layout matching the ticket card dimensions
  - A SkeletonBlock for the button
And no spinner is shown
```

_The skeleton is owned by the dashboard page's `loading.tsx`, not this component._

### Error state

```
Given GET /api/stub/tickets returns an error
Then the card renders an ErrorState component:
  message: "Unable to load support tickets."
  onRetry: not required (a page refresh is equivalent)
And the ErrorState is contained within the card boundary
And it does not break the surrounding grid
```

### Edge cases

```
Given all tickets have status "resolved" or "closed" (0 open)
Then the header badge shows "0 open"
```

> **Flag — 0 open badge styling:** the design only shows the warning badge for a non-zero open count. Whether "0 open" should use `variant="success"` (all clear) or `variant="neutral"` (informational) is not specced. Recommend `variant="success"` as a logical default — flag to design before shipping.

```
Given the ticket array is empty (no tickets at all)
Then the card shows an empty state message: "No support tickets."
  in text-sm text-text-secondary, centred in the list area
And the "+ Raise a ticket" button still renders
And no ErrorState is used — empty is a valid state
```

```
Given a ticket subject is long (e.g. "Network connectivity issue — home address")
Then it truncates with a trailing ellipsis rather than wrapping to a second line
  (Tailwind: truncate or text-ellipsis + overflow-hidden)
```

---

## Out of scope

- Ticket detail view — clicking a ticket card navigates to `/dashboard/support`, not a dedicated detail page
- Ticket creation form — handled by `/dashboard/support` page, not this dashboard widget
- Ticket reply or status update
- Pagination — 2 tickets maximum in this widget

---

## Notes for developer

- **Data source:** fetch `TTicket[]` from `GET /api/stub/tickets` in the dashboard page Server Component; sort by `createdAt` descending; slice to first 2; pass as `tickets: TTicket[]` prop. The component does no fetching or sorting.
- **Sort field — FLAG:** "2 most recent" is ambiguous — `createdAt` (creation order) or `updatedAt` (most recently active)? The design header shows "1 open" first (which is the newer ticket by `createdAt`), consistent with `createdAt` descending. Defaulting to `createdAt` descending — flag if `updatedAt` is the intended sort for a support context (surfacing recently-replied tickets first).
- **`description` field gap:** `tickets.json` is missing the `description` field required by `TTicket` in `data-model.md`. The dashboard widget does not display `description`, so this does not block building this story. However, the `/dashboard/support` raise-ticket form will need it — backfill `tickets.json` with placeholder descriptions (e.g. `"description": ""`) before building the support page.
- **Priority badge:** the design shows `badge-neutral` for both "medium" and "low" priority. "High" priority is in the `TTicketPriority` type but not shown in the design. Recommend: "high" → `Badge variant="warning"` (or "danger" for critical). Flag to design for confirmation.
- **Date:** use `formatDateLong(ticket.createdAt)` — the `createdAt` timestamp `"2026-06-19T10:15:00Z"` → "19 Jun 2026". The `formatDateLong()` function strips the time component. Do not show `updatedAt` in this widget.
- **"+ Raise a ticket" button:** the design's `btn-ticket` style (transparent background, accent border, accent text) maps to `Button variant="secondary"`. Render as a `NextLink` with Button classes applied directly (same NextLink-as-button pattern used in SiteHeader and PlansSection) to avoid `<button>` inside `<a>`. Use `size="sm"` (height 36px matches the design's 36px height).
- **CardHeader:** already built. Pass the open-count `Badge` as the `action` prop.
- **Server Component:** no interactivity. Keep it a Server Component — no `"use client"`.
- **Subject truncation:** Tailwind class `truncate` on the subject `<span>` or `<p>`. Ensure the parent flex container has `min-w-0` so flex children can shrink below content size.
