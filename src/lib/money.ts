/**
 * Convert a dollar float (from JSON files or any future API) to integer cents.
 * Single conversion seam — every external read passes through here.
 * dollarsToCents(65) → 6500
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Format integer cents as an AUD display string.
 * formatAUD(6500)  → "$65.00"
 * formatAUD(-6500) → "−$65.00"  (charge in activity feed — minus before dollar sign)
 */
export function formatAUD(cents: number): string {
  if (cents < 0) return `−$${(Math.abs(cents) / 100).toFixed(2)}`;
  return `$${(cents / 100).toFixed(2)}`;
}
