"use client";

import { Building2, MessageCircle, Users } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";

export type SettingsSection = "shop" | "whatsapp" | "team";

interface SettingsSectionNavProps {
  section: SettingsSection;
  t: Dictionary;
  isRtl?: boolean;
  showTeam?: boolean;
  onChange: (section: SettingsSection) => void;
}

const sections: {
  value: SettingsSection;
  labelKey: "sectionShop" | "sectionWhatsApp" | "sectionTeam";
  icon: typeof Building2;
}[] = [
  { value: "shop", labelKey: "sectionShop", icon: Building2 },
  { value: "whatsapp", labelKey: "sectionWhatsApp", icon: MessageCircle },
  { value: "team", labelKey: "sectionTeam", icon: Users },
];

export function SettingsSectionNav({
  section,
  t,
  isRtl,
  showTeam = true,
  onChange,
}: SettingsSectionNavProps) {
  const visible = showTeam
    ? sections
    : sections.filter((item) => item.value !== "team");

  return (
    <div
      className={cn(
        "inline-flex shrink-0 rounded-[10px] border border-hairline bg-card p-[3px]",
        isRtl && "flex-row-reverse",
      )}
      role="tablist"
      aria-label={t.settings.title}
    >
      {visible.map(({ value, labelKey, icon: Icon }) => {
        const active = section === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-[11px]",
              isRtl && "flex-row-reverse",
              active
                ? "bg-brand-700 text-white"
                : "text-muted-slate hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">{t.settings[labelKey]}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SettingsPanel({
  title,
  description,
  icon,
  children,
  isRtl,
  actions,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isRtl?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-[13px] border border-hairline bg-card p-5 shadow-sm sm:p-6">
      <div
        className={cn(
          "mb-5 flex flex-col gap-3 border-b border-hairline pb-4 sm:flex-row sm:items-start sm:justify-between",
          isRtl && "sm:flex-row-reverse",
        )}
      >
        <div className={cn("min-w-0", isRtl && "text-right")}>
          <div
            className={cn(
              "flex items-center gap-2",
              isRtl && "flex-row-reverse justify-end",
            )}
          >
            {icon ? (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                {icon}
              </span>
            ) : null}
            <h2 className="font-display text-lg font-bold text-foreground">
              {title}
            </h2>
          </div>
          {description ? (
            <p className="mt-1 text-sm text-muted-slate">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className={cn("shrink-0", isRtl && "self-end sm:self-start")}>
            {actions}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}
