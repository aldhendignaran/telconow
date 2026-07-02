import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely — use everywhere for conditional classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO date or datetime string as DD/MM/YYYY for display.
 * formatDate("2026-07-15")           → "15/07/2026"
 * formatDate("2026-06-19T10:15:00Z") → "19/06/2026"
 */
export function formatDate(isoDate: string): string {
  const datePart = isoDate.split("T")[0]; // strips time component from datetime strings
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Format an ISO date string as "14 June 2026" for display (blog post dates).
 * Use formatDate() for DD/MM/YYYY (account/billing contexts).
 */
export function formatDateLong(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Time-aware greeting using AEST/AEDT.
 * "Australia/Sydney" handles DST automatically — no manual offset needed.
 * Returns "Good morning" | "Good afternoon" | "Good evening"
 */
export function getGreeting(): string {
  const hour = new Date(
    new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })
  ).getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
