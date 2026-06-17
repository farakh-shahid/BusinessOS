import { access, mkdir, rm } from "fs/promises";
import { constants } from "fs";
import { join } from "path";

const AUTH_ROOT = join(process.cwd(), "data", "whatsapp-sessions");

export function tenantAuthDir(tenantId: string): string {
  return join(AUTH_ROOT, tenantId);
}

export async function ensureAuthDir(tenantId: string): Promise<string> {
  const dir = tenantAuthDir(tenantId);
  await mkdir(dir, { recursive: true });
  return dir;
}

export async function clearTenantAuthDir(tenantId: string): Promise<void> {
  await rm(tenantAuthDir(tenantId), { recursive: true, force: true });
}

export async function hasTenantAuthCreds(tenantId: string): Promise<boolean> {
  try {
    await access(join(tenantAuthDir(tenantId), "creds.json"), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
