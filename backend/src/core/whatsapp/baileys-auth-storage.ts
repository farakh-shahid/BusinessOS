import { join } from "path";

/** Legacy on-disk path — only used for one-time migration into the database. */
const AUTH_ROOT = join(process.cwd(), "data", "whatsapp-sessions");

export function tenantAuthDir(tenantId: string): string {
  return join(AUTH_ROOT, tenantId);
}
