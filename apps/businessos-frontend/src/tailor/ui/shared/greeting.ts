import type { Dictionary } from "@business-os/i18n";

export function timeGreeting(t: Dictionary): string {
  const hour = new Date().getHours();
  if (hour < 12) return t.hero.goodMorning;
  if (hour < 17) return t.hero.goodAfternoon;
  return t.hero.goodEvening;
}

export function formatTodayDate(locale: string): string {
  return new Date().toLocaleDateString(locale === "ur" ? "ur-PK" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
