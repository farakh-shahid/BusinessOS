import { Mutex } from "async-mutex";
import { readdir, readFile, rm } from "fs/promises";
import { join } from "path";
import type { SignalDataSet, SignalDataTypeMap } from "@whiskeysockets/baileys";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../database/prisma.service";
import { tenantAuthDir } from "./baileys-auth-storage";

type BaileysModule = typeof import("@whiskeysockets/baileys");

interface StoredWhatsAppSession {
  creds?: import("@whiskeysockets/baileys").AuthenticationCreds;
  keys?: Record<string, unknown>;
}

const tenantLocks = new Map<string, Mutex>();

interface MemoryAuthSnapshot {
  creds: import("@whiskeysockets/baileys").AuthenticationCreds;
  keys: Record<string, unknown>;
}

/** Hot creds during pairing reconnect — avoids re-reading a half-written DB row. */
const memoryAuthCache = new Map<string, MemoryAuthSnapshot>();

function clearMemoryAuthCache(tenantId: string) {
  memoryAuthCache.delete(tenantId);
}

function tenantMutex(tenantId: string): Mutex {
  let lock = tenantLocks.get(tenantId);
  if (!lock) {
    lock = new Mutex();
    tenantLocks.set(tenantId, lock);
  }
  return lock;
}

function reviveJson<T>(value: T, baileys: BaileysModule): T {
  return JSON.parse(
    JSON.stringify(value, baileys.BufferJSON.replacer),
    baileys.BufferJSON.reviver,
  );
}

/** Handles legacy buffer shapes that Prisma/JSON may return without base64 encoding. */
function reviveBufferValue(value: unknown): Buffer | undefined {
  if (Buffer.isBuffer(value)) {
    return value;
  }
  if (value instanceof Uint8Array) {
    return Buffer.from(value);
  }
  if (typeof value === "object" && value !== null && "type" in value) {
    const typed = value as { type?: string; data?: unknown };
    if (typed.type !== "Buffer" || typed.data == null) {
      return undefined;
    }
    if (typeof typed.data === "string") {
      return Buffer.from(typed.data, "base64");
    }
    if (Array.isArray(typed.data)) {
      return Buffer.from(typed.data);
    }
    if (typeof typed.data === "object") {
      const nums = Object.values(typed.data as Record<string, number>);
      if (nums.every((n) => typeof n === "number")) {
        return Buffer.from(nums);
      }
    }
  }
  return undefined;
}

function isValidAuthenticationCreds(
  creds: import("@whiskeysockets/baileys").AuthenticationCreds,
): boolean {
  const noisePublic = reviveBufferValue(creds.noiseKey?.public);
  const noisePrivate = reviveBufferValue(creds.noiseKey?.private);
  return Boolean(
    noisePublic?.length &&
      noisePrivate?.length &&
      Number.isFinite(creds.registrationId),
  );
}

function snapshotAuth(
  creds: import("@whiskeysockets/baileys").AuthenticationCreds,
  keys: Record<string, unknown>,
  baileys: BaileysModule,
): MemoryAuthSnapshot {
  return reviveJson({ creds, keys }, baileys);
}

function isUsableAuthenticationCreds(
  creds: import("@whiskeysockets/baileys").AuthenticationCreds,
): boolean {
  if (isValidAuthenticationCreds(creds)) {
    return true;
  }
  // Mid-pairing creds after QR scan may not be fully registered yet.
  return Boolean(creds.me?.id && reviveBufferValue(creds.noiseKey?.public)?.length);
}

function sessionFromJson(
  raw: unknown,
  baileys: BaileysModule,
): {
  creds: import("@whiskeysockets/baileys").AuthenticationCreds;
  keys: Record<string, unknown>;
  valid: boolean;
} {
  if (!raw || typeof raw !== "object") {
    return { creds: baileys.initAuthCreds(), keys: {}, valid: false };
  }

  const revived = reviveJson(raw, baileys) as StoredWhatsAppSession;
  if (!revived.creds) {
    return { creds: baileys.initAuthCreds(), keys: {}, valid: false };
  }

  const creds = revived.creds;
  if (!isUsableAuthenticationCreds(creds)) {
    return { creds: baileys.initAuthCreds(), keys: {}, valid: false };
  }

  const keys: Record<string, unknown> = {};
  for (const [file, value] of Object.entries(revived.keys ?? {})) {
    keys[file] = reviveJson(value, baileys);
  }

  return { creds, keys, valid: true };
}

function sessionToJson(
  creds: import("@whiskeysockets/baileys").AuthenticationCreds,
  keys: Record<string, unknown>,
  baileys: BaileysModule,
): StoredWhatsAppSession {
  return reviveJson({ creds, keys }, baileys);
}

async function readStoredSession(
  prisma: PrismaService,
  tenantId: string,
): Promise<unknown> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { whatsappSession: true },
  });
  return tenant?.whatsappSession ?? null;
}

export async function hasTenantAuthCreds(
  prisma: PrismaService,
  tenantId: string,
): Promise<boolean> {
  const baileys = await import("@whiskeysockets/baileys");
  const raw = await readStoredSession(prisma, tenantId);
  if (raw && typeof raw === "object" && "creds" in (raw as object)) {
    const loaded = sessionFromJson(raw, baileys);
    if (loaded.valid) {
      return true;
    }
    return false;
  }
  return migrateLegacyFileAuthIfPresent(prisma, tenantId);
}

export async function clearTenantAuthSession(
  prisma: PrismaService,
  tenantId: string,
): Promise<void> {
  await tenantMutex(tenantId).runExclusive(async () => {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { whatsappSession: Prisma.DbNull },
    });
  });
  clearMemoryAuthCache(tenantId);
  await rm(tenantAuthDir(tenantId), { recursive: true, force: true }).catch(
    () => undefined,
  );
}

/** One-time import from old on-disk multi-file sessions (pre-DB storage). */
export async function migrateLegacyFileAuthIfPresent(
  prisma: PrismaService,
  tenantId: string,
): Promise<boolean> {
  const baileys = await import("@whiskeysockets/baileys");
  const dir = tenantAuthDir(tenantId);

  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return false;
  }

  if (!files.includes("creds.json")) {
    return false;
  }

  const keys: Record<string, unknown> = {};
  for (const file of files) {
    if (file === "creds.json") continue;
    if (!file.endsWith(".json")) continue;
    try {
      const text = await readFile(join(dir, file), "utf-8");
      keys[file] = JSON.parse(text, baileys.BufferJSON.reviver);
    } catch {
      // skip corrupt legacy key files
    }
  }

  let creds: import("@whiskeysockets/baileys").AuthenticationCreds;
  try {
    const text = await readFile(join(dir, "creds.json"), "utf-8");
    creds = JSON.parse(text, baileys.BufferJSON.reviver) as import("@whiskeysockets/baileys").AuthenticationCreds;
  } catch {
    return false;
  }

  if (!isValidAuthenticationCreds(creds)) {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
    return false;
  }

  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      whatsappSession: sessionToJson(creds, keys, baileys) as Prisma.InputJsonValue,
    },
  });

  await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  return true;
}

export async function useDatabaseAuthState(
  prisma: PrismaService,
  tenantId: string,
  baileys: BaileysModule,
) {
  await migrateLegacyFileAuthIfPresent(prisma, tenantId);

  const lock = tenantMutex(tenantId);
  const loaded = await lock.runExclusive(async () => {
    const cached = memoryAuthCache.get(tenantId);
    if (cached && isUsableAuthenticationCreds(cached.creds)) {
      return {
        creds: cached.creds,
        keys: cached.keys,
        valid: true,
      };
    }

    const raw = await readStoredSession(prisma, tenantId);
    return sessionFromJson(raw, baileys);
  });

  let creds = loaded.creds;
  const keys = loaded.keys;
  memoryAuthCache.set(tenantId, snapshotAuth(creds, keys, baileys));

  const persist = async () => {
    memoryAuthCache.set(tenantId, snapshotAuth(creds, keys, baileys));
    await lock.runExclusive(async () => {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          whatsappSession: sessionToJson(
            creds,
            keys,
            baileys,
          ) as Prisma.InputJsonValue,
        },
      });
    });
  };

  const readKey = async (file: string) => {
    const value = keys[file];
    if (value === undefined || value === null) {
      return null;
    }

    let parsed = reviveJson(value, baileys);

    if (file.startsWith("app-state-sync-key-") && parsed) {
      parsed = baileys.proto.Message.AppStateSyncKeyData.fromObject(parsed);
    }

    return parsed;
  };

  return {
    state: {
      creds,
      keys: {
        get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
          const data = {} as { [id: string]: SignalDataTypeMap[T] };
          await Promise.all(
            ids.map(async (id) => {
              data[id] = (await readKey(`${String(type)}-${id}.json`)) as SignalDataTypeMap[T];
            }),
          );
          return data;
        },
        set: async (data: SignalDataSet) => {
          for (const category of Object.keys(data)) {
            const bucket = data[category as keyof SignalDataSet];
            if (!bucket) continue;
            for (const id of Object.keys(bucket)) {
              const value = bucket[id];
              const file = `${category}-${id}.json`;
              if (value) {
                keys[file] = reviveJson(value, baileys);
              } else {
                delete keys[file];
              }
            }
          }
          await persist();
        },
      },
    },
    saveCreds: async () => {
      await persist();
    },
  };
}
