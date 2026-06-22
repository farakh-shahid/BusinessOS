"use client";

import type { Dictionary } from "@/i18n";
import type { CustomerDetail } from "@shared";
import { cn } from "@/core/presentation/lib/utils";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { hasStyleContent } from "@/features/infrastructure/data/style-field-display";

interface CustomerAboutPanelProps {
  data: CustomerDetail;
  t: Dictionary;
  isRtl: boolean;
}

function collectStyleNotes(data: CustomerDetail): string[] {
  const notes = new Set<string>();

  for (const profile of data.lastOrderStyles ?? []) {
    const note = profile.style.notes?.trim();
    if (note) notes.add(note);
  }

  for (const saved of data.savedMeasurements ?? []) {
    const note = saved.style.notes?.trim();
    if (note) notes.add(note);
  }

  return Array.from(notes);
}

export function CustomerAboutPanel({ data, t, isRtl }: CustomerAboutPanelProps) {
  const { customer, summary } = data;
  const styleNotes = collectStyleNotes(data);
  const hasAnyStyle = (data.lastOrderStyles ?? []).some((profile) =>
    hasStyleContent(
      Object.fromEntries(
        Object.entries(profile.style).filter(
          (entry): entry is [string, string] =>
            typeof entry[1] === "string" && entry[1].trim().length > 0,
        ),
      ),
    ),
  );

  const rows = [
    { label: t.form.phone, value: customer.phone, dir: "ltr" as const },
    customer.email
      ? { label: t.form.email, value: customer.email, dir: "ltr" as const }
      : null,
    {
      label: t.customers.totalOrdersLabel,
      value: String(summary.totalOrders),
    },
    {
      label: t.customers.preferredLanguage,
      value:
        customer.preferredLocale === "ur"
          ? t.customers.languageUrdu
          : t.customers.languageEnglish,
    },
  ].filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <Card className="border-hairline">
      <CardTitle>{t.customers.about}</CardTitle>
      <dl className="mt-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              "flex items-start justify-between gap-3 border-b border-hairline py-2.5 text-sm last:border-b-0",
              isRtl && "flex-row-reverse",
            )}
          >
            <dt className="text-muted-slate">{row.label}</dt>
            <dd
              className={cn(
                "font-semibold text-foreground",
                isRtl ? "text-left" : "text-right",
              )}
              dir={"dir" in row ? row.dir : undefined}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {styleNotes.length > 0 || hasAnyStyle ? (
        <div className="mt-4 rounded-xl border border-hairline bg-background px-3.5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-slate">
            {t.customers.notesLabel}
          </p>
          {styleNotes.length > 0 ? (
            <p
              className={cn(
                "mt-1.5 text-sm leading-relaxed text-foreground",
                isRtl && "text-right",
              )}
            >
              {styleNotes.join(" · ")}
            </p>
          ) : (
            <p className="mt-1.5 text-sm text-muted-slate">
              {t.customers.styleNotesInMeasurements}
            </p>
          )}
        </div>
      ) : null}
    </Card>
  );
}
