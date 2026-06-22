"use client";

import type { Dictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import {
  useStaffIdentity,
  type StaffBadgeTone,
  type StaffIdentityBadgeItem,
} from "@/features/infrastructure/data/use-staff-identity";

function badgeClassName(tone: StaffBadgeTone): string {
  switch (tone) {
    case "you":
      return "bg-brand-50 text-brand-700 ring-1 ring-brand-100";
    case "admin":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-100";
    case "tailor":
      return "bg-amber-50 text-amber-800 ring-1 ring-amber-100";
    default:
      return "bg-slate-100 text-muted-slate ring-1 ring-hairline";
  }
}

export function StaffIdentityBadge({
  tone,
  children,
  className,
}: {
  tone: StaffBadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        badgeClassName(tone),
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StaffIdentityBadgeList({
  badges,
  isRtl,
  className,
}: {
  badges: StaffIdentityBadgeItem[];
  isRtl?: boolean;
  className?: string;
}) {
  if (badges.length === 0) return null;

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-1",
        isRtl && "flex-row-reverse justify-end",
        className,
      )}
    >
      {badges.map((badge) => (
        <StaffIdentityBadge key={`${badge.tone}-${badge.label}`} tone={badge.tone}>
          {badge.label}
        </StaffIdentityBadge>
      ))}
    </span>
  );
}

export function StaffNameWithBadges({
  name,
  t,
  isRtl,
  nameClassName,
  className,
}: {
  name: string;
  t: Dictionary;
  isRtl?: boolean;
  nameClassName?: string;
  className?: string;
}) {
  const { badgesForName } = useStaffIdentity(t);
  const badges = badgesForName(name);

  return (
    <span
      className={cn(
        "inline-flex min-w-0 flex-wrap items-center gap-1.5",
        isRtl && "flex-row-reverse justify-end",
        className,
      )}
    >
      <span className={cn("truncate font-medium", nameClassName)}>{name}</span>
      <StaffIdentityBadgeList badges={badges} isRtl={isRtl} />
    </span>
  );
}
