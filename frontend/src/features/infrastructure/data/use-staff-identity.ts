"use client";

import { useMemo } from "react";
import type { Dictionary } from "@/i18n";
import { useMeQuery } from "@/features/infrastructure/api/hooks/use-auth";
import { useStaffQuery } from "@/features/infrastructure/api/hooks/use-staff";

export type StaffBadgeTone = "you" | "admin" | "staff" | "tailor";

export interface StaffIdentityBadgeItem {
  tone: StaffBadgeTone;
  label: string;
}

function roleToBadgeTone(role: string): StaffBadgeTone {
  if (role === "ADMIN" || role === "SUPER_ADMIN") return "admin";
  if (role === "TAILOR") return "tailor";
  return "staff";
}

function roleToLabel(role: string, t: Dictionary): string {
  if (role === "ADMIN" || role === "SUPER_ADMIN") return t.staff.roleAdmin;
  if (role === "TAILOR") return t.staff.roleTailor;
  return t.staff.roleStaff;
}

export function useStaffIdentity(t: Dictionary) {
  const { data: user } = useMeQuery();
  const { data: staff = [] } = useStaffQuery();

  const roleByName = useMemo(() => {
    const map = new Map<string, string>();
    for (const member of staff) {
      map.set(member.name.trim(), member.role);
    }
    if (user?.name?.trim() && user.role) {
      map.set(user.name.trim(), user.role);
    }
    return map;
  }, [staff, user]);

  function isCurrentUser(name: string): boolean {
    const trimmed = name.trim();
    return Boolean(trimmed && user?.name?.trim() === trimmed);
  }

  function badgesForName(name: string): StaffIdentityBadgeItem[] {
    const trimmed = name.trim();
    if (!trimmed) return [];

    const badges: StaffIdentityBadgeItem[] = [];
    const isYou = isCurrentUser(trimmed);
    const role = roleByName.get(trimmed);

    if (isYou) {
      badges.push({ tone: "you", label: t.staff.you });
    }

    if (role) {
      badges.push({
        tone: roleToBadgeTone(role),
        label: roleToLabel(role, t),
      });
    }

    return badges;
  }

  return { badgesForName, isCurrentUser, roleByName };
}
