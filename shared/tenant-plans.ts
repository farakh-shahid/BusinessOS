export const TENANT_PLANS = ["STANDARD", "PREMIUM", "ENTERPRISE"] as const;
export type TenantPlan = (typeof TENANT_PLANS)[number];

export interface TenantPlanLimits {
  /** Max active users including the shop admin; null = no cap */
  maxTotalMembers: number | null;
  /** Max active STAFF users (admin excluded); null = no cap */
  maxStaff: number | null;
  /** Max active TAILOR users; null = derived from total on Standard */
  maxTailors: number | null;
}

export const TENANT_PLAN_LIMITS: Record<TenantPlan, TenantPlanLimits> = {
  STANDARD: {
    maxTotalMembers: 10,
    maxStaff: 2,
    maxTailors: null,
  },
  PREMIUM: {
    maxTotalMembers: null,
    maxStaff: 5,
    maxTailors: 8,
  },
  ENTERPRISE: {
    maxTotalMembers: null,
    maxStaff: null,
    maxTailors: null,
  },
};

export interface TenantMemberCounts {
  total: number;
  staff: number;
  tailors: number;
}

export function getEffectiveTailorCap(
  plan: TenantPlan,
  staffCount: number,
): number | null {
  const limits = TENANT_PLAN_LIMITS[plan];
  if (limits.maxTailors !== null) return limits.maxTailors;
  if (limits.maxTotalMembers === null) return null;
  const adminSlots = 1;
  const staffCap = limits.maxStaff ?? staffCount;
  const staffUsed = Math.min(staffCount, staffCap);
  return limits.maxTotalMembers - adminSlots - staffUsed;
}

export function checkMemberLimits(
  plan: TenantPlan,
  counts: TenantMemberCounts,
): { ok: true } | { ok: false; reason: string } {
  if (plan === "ENTERPRISE") return { ok: true };

  const limits = TENANT_PLAN_LIMITS[plan];

  if (limits.maxTotalMembers !== null && counts.total > limits.maxTotalMembers) {
    return {
      ok: false,
      reason: `Your plan allows up to ${limits.maxTotalMembers} team members including you.`,
    };
  }

  if (limits.maxStaff !== null && counts.staff > limits.maxStaff) {
    return {
      ok: false,
      reason: `Your plan allows up to ${limits.maxStaff} staff members.`,
    };
  }

  const tailorCap = getEffectiveTailorCap(plan, counts.staff);
  if (tailorCap !== null && counts.tailors > tailorCap) {
    return {
      ok: false,
      reason: `Your plan allows up to ${tailorCap} tailor${tailorCap === 1 ? "" : "s"}.`,
    };
  }

  if (limits.maxTailors !== null && counts.tailors > limits.maxTailors) {
    return {
      ok: false,
      reason: `Your plan allows up to ${limits.maxTailors} tailors.`,
    };
  }

  return { ok: true };
}

export function checkMemberAddition(
  plan: TenantPlan,
  counts: TenantMemberCounts,
  role: "STAFF" | "TAILOR",
): { ok: true } | { ok: false; reason: string } {
  return checkMemberLimits(plan, {
    total: counts.total + 1,
    staff: counts.staff + (role === "STAFF" ? 1 : 0),
    tailors: counts.tailors + (role === "TAILOR" ? 1 : 0),
  });
}

export function checkRoleChange(
  plan: TenantPlan,
  counts: TenantMemberCounts,
  currentRole: "STAFF" | "TAILOR",
  newRole: "STAFF" | "TAILOR",
): { ok: true } | { ok: false; reason: string } {
  if (currentRole === newRole) return { ok: true };

  return checkMemberLimits(plan, {
    total: counts.total,
    staff:
      counts.staff +
      (newRole === "STAFF" ? 1 : 0) -
      (currentRole === "STAFF" ? 1 : 0),
    tailors:
      counts.tailors +
      (newRole === "TAILOR" ? 1 : 0) -
      (currentRole === "TAILOR" ? 1 : 0),
  });
}
