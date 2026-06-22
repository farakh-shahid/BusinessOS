const MEASUREMENT_MIN = 0;
const MEASUREMENT_MAX = 999.99;

const DECIMAL_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Strip letters/symbols while typing — keeps digits, one decimal, up to 2 fractional digits. */
export function sanitizeMeasurementInput(raw: string): string {
  const filtered = raw.replace(/[^\d.]/g, "");
  const dotIndex = filtered.indexOf(".");
  if (dotIndex === -1) return filtered;

  const intPart = filtered.slice(0, dotIndex);
  const decPart = filtered
    .slice(dotIndex + 1)
    .replace(/\./g, "")
    .slice(0, 2);
  const endsWithDot =
    filtered.endsWith(".") && decPart.length === 0;

  if (endsWithDot) return `${intPart}.`;
  if (decPart.length > 0) return `${intPart}.${decPart}`;
  return intPart;
}

export function isValidMeasurementInput(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (!DECIMAL_PATTERN.test(trimmed)) return false;
  const n = Number.parseFloat(trimmed);
  return Number.isFinite(n) && n >= MEASUREMENT_MIN && n <= MEASUREMENT_MAX;
}

export function findInvalidMeasurement(
  measurements: Record<string, string>,
): string | null {
  for (const [key, value] of Object.entries(measurements)) {
    if (!value.trim()) continue;
    if (!isValidMeasurementInput(value)) return key;
  }
  return null;
}
