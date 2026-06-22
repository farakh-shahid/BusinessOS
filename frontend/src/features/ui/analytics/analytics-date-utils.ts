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

/** ISO week input value e.g. 2026-W24 → anchor date (Monday of that week) */
export function parseWeekInput(value: string): string {
  const match = value.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return toDateInputValue(new Date());
  const year = Number(match[1]);
  const week = Number(match[2]);
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setDate(jan4.getDate() - dayOfWeek + 1);
  const monday = addDays(mondayWeek1, (week - 1) * 7);
  return toDateInputValue(monday);
}

export function toWeekInputValue(date: Date): string {
  const d = startOfDay(date);
  d.setHours(12, 0, 0, 0);
  const dayNum = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - dayNum);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** Month input value e.g. 2026-06 → first day of month */
export function parseMonthInput(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return toDateInputValue(new Date());
  const year = Number(match[1]);
  const month = Number(match[2]);
  return toDateInputValue(new Date(year, month - 1, 1));
}

export function toMonthInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
