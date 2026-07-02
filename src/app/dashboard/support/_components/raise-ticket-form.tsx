"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createTicketAction } from "../../actions";

type Priority = "low" | "medium" | "high";

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function RaiseTicketForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!subject.trim() || !description.trim()) {
      setError("Subject and description are required.");
      return;
    }

    startTransition(async () => {
      try {
        await createTicketAction({ subject: subject.trim(), priority, description: description.trim() });
        setSuccess(true);
        setSubject("");
        setPriority("medium");
        setDescription("");
        router.refresh();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-success-bg bg-success-bg p-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3.75 9l3.75 3.75 6.75-7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">Ticket raised successfully</p>
          <p className="mt-0.5 text-xs text-text-secondary">We'll get back to you as soon as possible.</p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="text-xs font-medium text-accent underline underline-offset-2 hover:no-underline"
        >
          Raise another ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
      <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Raise a Ticket</span>

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="block text-sm font-medium text-text-primary">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Briefly describe your issue"
          disabled={isPending}
          className={cn(
            "w-full rounded-lg border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0",
            "disabled:pointer-events-none disabled:opacity-50",
            "border-border hover:border-text-secondary"
          )}
        />
      </div>

      {/* Priority */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="priority" className="block text-sm font-medium text-text-primary">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          disabled={isPending}
          className={cn(
            "w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0",
            "disabled:pointer-events-none disabled:opacity-50",
            "hover:border-text-secondary"
          )}
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="block text-sm font-medium text-text-primary">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide more detail about your issue"
          rows={4}
          disabled={isPending}
          className={cn(
            "w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0",
            "disabled:pointer-events-none disabled:opacity-50",
            "hover:border-text-secondary"
          )}
        />
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors",
          "hover:bg-accent-hover",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        {isPending ? "Submitting…" : "Submit ticket"}
      </button>
    </form>
  );
}
