export function formatRs(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString()}`;
}

export function formatRsCompact(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 100_000) {
    const lakhs = amount / 100_000;
    return `Rs ${lakhs >= 10 ? Math.round(lakhs) : lakhs.toFixed(1)}L`;
  }
  if (abs >= 1_000) {
    return `Rs ${(amount / 1_000).toFixed(1)}k`;
  }
  return `Rs ${Math.round(amount).toLocaleString()}`;
}

export function formatTrend(percent: number | null): string {
  if (percent === null) return "—";
  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent}%`;
}
