import type { UserRole } from "../../generated/prisma/client";

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  role: UserRole;
  tenantId: string | null;
}
