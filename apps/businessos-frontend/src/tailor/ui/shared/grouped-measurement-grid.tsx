"use client";

import type { Dictionary } from "@business-os/i18n";
import {
  getGarmentSchema,
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@business-os/tailor";
import { cn } from "@/core/presentation/lib/utils";

const GROUP_ORDER = ["body", "upper", "lower"] as const;

const groupTitleKeys: Record<
  (typeof GROUP_ORDER)[number],
  keyof Dictionary["orderDetail"]
> = {
  body: "measurementGroupUpperBody",
  upper: "measurementGroupLengths",
  lower: "measurementGroupLowerBody",
};

interface GroupedMeasurementGridProps {
  garmentType: string;
  measurements: Record<string, string | number | undefined>;
  t: Dictionary;
  isRtl?: boolean;
  className?: string;
}

export function GroupedMeasurementGrid({
  garmentType,
  measurements,
  t,
  isRtl,
  className,
}: GroupedMeasurementGridProps) {
  const schema = getGarmentSchema(
    normalizeBookingGarmentType(garmentType as BookingGarmentType),
  );
  const labelFor = (key: string) => {
    const m = t.measurements as Record<string, string>;
    return m[key] ?? key;
  };

  const groups = GROUP_ORDER.map((group) => {
    const fields = schema.measurementFields.filter(
      (field) => (field.group ?? "body") === group,
    );
    const items = fields
      .map((field) => {
        const raw = measurements[field.key];
        const text =
          raw === undefined || raw === null ? "" : String(raw).trim();
        if (!text) return null;
        return {
          key: field.key,
          label: labelFor(field.labelKey),
          value: `${text}"`,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    return { group, items };
  }).filter((section) => section.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {groups.map(({ group, items }) => (
        <section key={group}>
          <h3
            className={cn(
              "mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-slate",
              isRtl && "text-right",
            )}
          >
            {String(t.orderDetail[groupTitleKeys[group]])}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.key}
                className="rounded-xl border border-hairline/90 bg-gradient-to-b from-card to-slate-50/70 px-3 py-3 text-center shadow-sm"
              >
                <p className="font-display text-[1.35rem] font-bold leading-none tabular-nums text-foreground">
                  {item.value}
                </p>
                <p className="mt-1.5 text-[10px] font-medium text-muted-slate">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
