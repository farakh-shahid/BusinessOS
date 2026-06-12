export function formatRs(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString()}`;
}

export function formatTrend(percent: number | null): string {
  if (percent === null) return "—";
  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent}%`;
}
