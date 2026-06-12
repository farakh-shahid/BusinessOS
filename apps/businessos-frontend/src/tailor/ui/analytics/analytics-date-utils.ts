export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
}

export function shiftAnchor(
  anchor: string,
  view: "week" | "month",
  direction: -1 | 1,
): string {
  const base = startOfDay(new Date(anchor));
  const shifted =
    view === "week" ? addDays(base, direction * 7) : addMonths(base, direction);
  return toDateInputValue(shifted);
}

export function clampAnchorToTenant(
  anchor: string,
  tenantCreatedAt: string,
): string {
  const anchorDate = startOfDay(new Date(anchor));
  const minDate = startOfDay(new Date(tenantCreatedAt));
  if (anchorDate < minDate) return toDateInputValue(minDate);
  return toDateInputValue(anchorDate);
}
