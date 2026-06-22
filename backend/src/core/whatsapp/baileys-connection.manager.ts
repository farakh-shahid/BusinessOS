import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { lookup } from "node:dns/promises";
import { setDefaultResultOrder } from "node:dns";
import { Boom } from "@hapi/boom";
import QRCode from "qrcode";
import type { WASocket } from "@whiskeysockets/baileys";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../database/prisma.service";
import {
  clearTenantAuthSession,
  hasTenantAuthCreds,
  useDatabaseAuthState,
} from "./baileys-database-auth-storage";
import type {
  WhatsAppConnectionView,
  WhatsAppRuntimeStatus,
} from "./baileys-types";
import { normalizePhoneForWhatsApp } from "../notifications/notification.templates";

type BaileysModule = typeof import("@whiskeysockets/baileys");

interface TenantRuntime {
  status: WhatsAppRuntimeStatus;
  phone?: string;
  qrDataUrl?: string;
  lastError?: string;
  socket?: WASocket;
  startPromise?: Promise<void>;
  reconnectAttempts?: number;
  pairingRestartAttempts?: number;
  reconnectTimer?: ReturnType<typeof setTimeout>;
  connectingWatchdog?: ReturnType<typeof setTimeout>;
  sessionEpoch?: number;
  connectingSince?: number;
  /** True after QR scan until connection fully opens */
  awaitingPairingRestart?: boolean;
  /** True once creds are saved mid-pairing — survives reconnect attempts */
  pairingInProgress?: boolean;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const MAX_PAIRING_RESTART_ATTEMPTS = 5;
const SEND_TIMEOUT_MS = 25_000;
const PAIRING_RESTART_DELAY_MS = 2_500;
const QR_WAIT_TIMEOUT_MS = 90_000;
const PAIRING_FINISH_TIMEOUT_MS = 120_000;
const SOCKET_CONNECT_TIMEOUT_MS = 60_000;
const WA_CONNECTION_CLOSED_CODE = 428;
const NETWORK_RETRY_BASE_MS = 5_000;

@Injectable()
export class BaileysConnectionManager
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(BaileysConnectionManager.name);
  private readonly runtime = new Map<string, TenantRuntime>();
  private readonly shuttingDown = new Set<string>();
  private baileys?: BaileysModule;
  private baileysLogger?: import("pino").Logger;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    setDefaultResultOrder("ipv4first");

    const tenants = await this.prisma.tenant.findMany({
      where: { whatsappConnected: true },
      select: { id: true },
    });

    await Promise.all(
      tenants.map(async (tenant) => {
        if (!(await hasTenantAuthCreds(this.prisma, tenant.id))) {
          await this.markDisconnected(tenant.id);
          return;
        }
        return this.startConnection(tenant.id).catch(async (error) => {
          this.logger.warn(
            `Failed to restore WhatsApp for tenant ${tenant.id}`,
            error,
          );
          await clearTenantAuthSession(this.prisma, tenant.id);
          await this.markDisconnected(tenant.id);
        });
      }),
    );
  }

  async onModuleDestroy() {
    for (const entry of this.runtime.values()) {
      this.clearReconnectTimer(entry);
      entry.sessionEpoch = (entry.sessionEpoch ?? 0) + 1;
    }

    const sockets = [...this.runtime.values()]
      .map((entry) => entry.socket)
      .filter(Boolean) as WASocket[];

    await Promise.all(
      sockets.map((socket) =>
        socket.end(undefined).catch(() => undefined),
      ),
    );
    this.runtime.clear();
  }

  getStatus(tenantId: string): WhatsAppConnectionView {
    const entry = this.runtime.get(tenantId);
    if (entry) {
      return {
        status: entry.status,
        phone: entry.phone,
        qrDataUrl: entry.qrDataUrl,
        lastError: entry.lastError,
      };
    }

    return { status: "disconnected" };
  }

  isConnected(tenantId: string): boolean {
    return this.runtime.get(tenantId)?.status === "connected";
  }

  /**
   * Stops runtime, deletes on-disk auth files, and clears DB session flags.
   * Use `logout: true` when unlinking from WhatsApp; `false` before a fresh QR.
   */
  async destroySession(
    tenantId: string,
    options: { logout: boolean } = { logout: false },
  ): Promise<void> {
    this.logger.log(
      `Destroying WhatsApp session for tenant ${tenantId}${options.logout ? " (logout)" : ""}`,
    );
    this.shuttingDown.add(tenantId);
    try {
      await this.stopRuntime(tenantId, { logout: options.logout });
      await clearTenantAuthSession(this.prisma, tenantId);
      await this.markDisconnected(tenantId);
    } finally {
      this.shuttingDown.delete(tenantId);
    }
  }

  /** @deprecated Use destroySession — kept for internal callers */
  async prepareForNewConnection(tenantId: string): Promise<void> {
    await this.destroySession(tenantId, { logout: false });
  }

  async startConnection(tenantId: string): Promise<WhatsAppConnectionView> {
    const existing = this.runtime.get(tenantId);
    if (existing?.status === "connected") {
      return this.getStatus(tenantId);
    }
    if (existing?.startPromise) {
      await existing.startPromise;
      return this.getStatus(tenantId);
    }

    const entry: TenantRuntime = existing ?? { status: "connecting" };
    await this.beginSocketAttempt(tenantId, entry, { resetCounters: true });
    return this.getStatus(tenantId);
  }

  async disconnect(tenantId: string): Promise<WhatsAppConnectionView> {
    await this.destroySession(tenantId, { logout: true });
    return { status: "disconnected" };
  }

  async sendText(tenantId: string, phone: string, message: string) {
    const socket = await this.requireSocket(tenantId);
    const jid = this.toJid(phone);
    await this.withSendTimeout(
      socket.sendMessage(jid, { text: message }),
      tenantId,
      phone,
    );
    return { jid };
  }

  async sendDocument(
    tenantId: string,
    phone: string,
    pdfBuffer: Buffer,
    filename: string,
    caption: string,
  ) {
    const socket = await this.requireSocket(tenantId);
    const jid = this.toJid(phone);
    await this.withSendTimeout(
      socket.sendMessage(jid, {
        document: pdfBuffer,
        mimetype: "application/pdf",
        fileName: filename,
        caption,
      }),
      tenantId,
      phone,
    );
    return { jid };
  }

  private async stopRuntime(
    tenantId: string,
    options: { logout: boolean },
  ): Promise<void> {
    const entry = this.runtime.get(tenantId);
    if (!entry) return;

    entry.sessionEpoch = (entry.sessionEpoch ?? 0) + 1;
    this.clearReconnectTimer(entry);
    this.clearConnectingWatchdog(entry);

    if (entry.socket) {
      try {
        if (options.logout) {
          await entry.socket.logout();
        } else {
          await entry.socket.end(undefined);
        }
      } catch {
        // ignore cleanup errors
      }
      entry.socket = undefined;
    }

    this.runtime.delete(tenantId);
  }

  private async withSendTimeout<T>(
    promise: Promise<T>,
    tenantId: string,
    phone: string,
  ): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error("whatsapp_send_timeout"));
          }, SEND_TIMEOUT_MS);
        }),
      ]);
    } catch (error) {
      this.logger.warn(
        `WhatsApp send failed for tenant ${tenantId} → ${phone}: ${
          error instanceof Error ? error.message : "unknown"
        }`,
      );
      throw error;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  private async requireSocket(tenantId: string): Promise<WASocket> {
    if (!this.isConnected(tenantId)) {
      await this.startConnection(tenantId);
    }

    const socket = this.runtime.get(tenantId)?.socket;
    if (!socket || this.runtime.get(tenantId)?.status !== "connected") {
      throw new Error("whatsapp_not_connected");
    }
    return socket;
  }

  private async loadBaileys(): Promise<BaileysModule> {
    if (!this.baileys) {
      this.baileys = await import("@whiskeysockets/baileys");
    }
    return this.baileys;
  }

  private async loadBaileysLogger(): Promise<import("pino").Logger> {
    if (!this.baileysLogger) {
      const pino = await import("pino");
      this.baileysLogger = pino.default({ level: "silent" });
    }
    return this.baileysLogger;
  }

  private async assertWhatsAppReachable(tenantId: string): Promise<void> {
    try {
      await lookup("web.whatsapp.com");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "DNS lookup failed";
      this.logger.error(
        `Cannot resolve web.whatsapp.com for tenant ${tenantId}: ${message}`,
      );
      throw new Error("whatsapp_dns_unreachable");
    }
  }

  private classifyConnectionError(error: unknown): string {
    const message = this.disconnectMessage(error);
    if (
      message.includes("ENOTFOUND") ||
      message.includes("EAI_AGAIN") ||
      message.includes("getaddrinfo")
    ) {
      return "dns_error";
    }
    return "network_error";
  }

  private networkRetryDelayMs(attempt: number): number {
    return NETWORK_RETRY_BASE_MS * attempt;
  }

  private async markDisconnected(tenantId: string) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        whatsappConnected: false,
        whatsappPhone: null,
        whatsappSession: Prisma.DbNull,
      },
    });
  }

  private async resetAfterBadSession(tenantId: string, entry: TenantRuntime) {
    this.logger.warn(`Resetting WhatsApp session for tenant ${tenantId}`);
    entry.sessionEpoch = (entry.sessionEpoch ?? 0) + 1;
    this.clearReconnectTimer(entry);
    this.clearConnectingWatchdog(entry);
    if (entry.socket) {
      try {
        await entry.socket.end(undefined);
      } catch {
        // ignore
      }
      entry.socket = undefined;
    }
    await clearTenantAuthSession(this.prisma, tenantId);
    await this.markDisconnected(tenantId);
    entry.status = "disconnected";
    entry.qrDataUrl = undefined;
    entry.reconnectAttempts = 0;
    entry.pairingRestartAttempts = 0;
    entry.awaitingPairingRestart = false;
    entry.pairingInProgress = false;
    entry.connectingSince = undefined;
    entry.lastError = "session_invalid_reconnect";
  }

  private clearReconnectTimer(entry: TenantRuntime) {
    if (entry.reconnectTimer) {
      clearTimeout(entry.reconnectTimer);
      entry.reconnectTimer = undefined;
    }
  }

  private clearConnectingWatchdog(entry: TenantRuntime) {
    if (entry.connectingWatchdog) {
      clearTimeout(entry.connectingWatchdog);
      entry.connectingWatchdog = undefined;
    }
  }

  private async beginSocketAttempt(
    tenantId: string,
    entry: TenantRuntime,
    options: { resetCounters: boolean },
  ): Promise<void> {
    this.clearReconnectTimer(entry);
    this.clearConnectingWatchdog(entry);
    entry.sessionEpoch = (entry.sessionEpoch ?? 0) + 1;

    if (entry.socket) {
      try {
        await entry.socket.end(undefined);
      } catch {
        // ignore stale socket cleanup
      }
      entry.socket = undefined;
    }

    entry.status = "connecting";
    entry.qrDataUrl = undefined;
    entry.connectingSince = Date.now();

    if (options.resetCounters) {
      entry.lastError = undefined;
      entry.reconnectAttempts = 0;
      entry.pairingRestartAttempts = 0;
      entry.awaitingPairingRestart = false;
      entry.pairingInProgress = false;
    }

    this.runtime.set(tenantId, entry);

    entry.startPromise = this.openSocket(tenantId, entry).finally(() => {
      entry.startPromise = undefined;
    });

    await entry.startPromise;
  }

  private async reopenConnection(tenantId: string): Promise<void> {
    const entry = this.runtime.get(tenantId);
    if (!entry || entry.status === "connected") {
      return;
    }
    if (entry.startPromise) {
      await entry.startPromise;
      return;
    }

    await this.beginSocketAttempt(tenantId, entry, { resetCounters: false });
  }

  private armConnectingWatchdog(
    tenantId: string,
    entry: TenantRuntime,
    epoch: number,
  ) {
    this.clearConnectingWatchdog(entry);

    const timeoutMs =
      entry.pairingInProgress || entry.awaitingPairingRestart
        ? PAIRING_FINISH_TIMEOUT_MS
        : QR_WAIT_TIMEOUT_MS;

    entry.connectingWatchdog = setTimeout(() => {
      entry.connectingWatchdog = undefined;
      if ((this.runtime.get(tenantId)?.sessionEpoch ?? 0) !== epoch) {
        return;
      }

      const current = this.runtime.get(tenantId);
      if (
        !current ||
        current.status === "connected" ||
        current.status === "qr"
      ) {
        return;
      }

      this.logger.warn(
        `WhatsApp connection timed out for tenant ${tenantId} (${timeoutMs}ms)`,
      );
      void this.failConnecting(tenantId, current, "connection_timeout", {
        clearAuth:
          Boolean(current.pairingInProgress) ||
          Boolean(current.awaitingPairingRestart),
      });
    }, timeoutMs);
  }

  private async failConnecting(
    tenantId: string,
    entry: TenantRuntime,
    lastError: string,
    options: { clearAuth: boolean },
  ) {
    entry.sessionEpoch = (entry.sessionEpoch ?? 0) + 1;
    this.clearReconnectTimer(entry);
    this.clearConnectingWatchdog(entry);

    if (entry.socket) {
      try {
        await entry.socket.end(undefined);
      } catch {
        // ignore
      }
      entry.socket = undefined;
    }

    entry.status = "disconnected";
    entry.qrDataUrl = undefined;
    entry.lastError = lastError;
    entry.pairingInProgress = false;
    entry.awaitingPairingRestart = false;
    entry.connectingSince = undefined;
    this.runtime.set(tenantId, entry);

    if (options.clearAuth) {
      await clearTenantAuthSession(this.prisma, tenantId);
    }
    await this.markDisconnected(tenantId);
  }

  private disconnectMessage(error: unknown): string {
    const boom = error as Boom | undefined;
    return boom?.message ?? (error instanceof Error ? error.message : "");
  }

  private isConflictError(error: unknown): boolean {
    const message = this.disconnectMessage(error).toLowerCase();
    return (
      message.includes("conflict") ||
      message.includes("device_removed") ||
      message.includes("replaced")
    );
  }

  private isIntentionalLogout(
    error: unknown,
    baileys: BaileysModule,
    entry?: TenantRuntime,
  ): boolean {
    if (entry?.pairingInProgress || entry?.awaitingPairingRestart) {
      return false;
    }

    const boom = error as Boom | undefined;
    const statusCode = boom?.output?.statusCode;
    const message = this.disconnectMessage(error);

    if (statusCode !== baileys.DisconnectReason.loggedOut) {
      return false;
    }

    if (this.isConflictError(error)) {
      return false;
    }

    return (
      message.includes("Intentional Logout") ||
      message.toLowerCase().includes("logged out")
    );
  }

  private isNetworkError(error: unknown, entry?: TenantRuntime): boolean {
    if (entry?.pairingInProgress || entry?.awaitingPairingRestart) {
      return false;
    }

    const boom = error as Boom | undefined;
    const statusCode = boom?.output?.statusCode;
    const message = this.disconnectMessage(error);

    if (statusCode === WA_CONNECTION_CLOSED_CODE) {
      return false;
    }

    return (
      statusCode === 408 ||
      message.includes("ENOTFOUND") ||
      message.includes("ETIMEDOUT") ||
      message.includes("ECONNREFUSED") ||
      message.includes("EAI_AGAIN") ||
      message.includes("getaddrinfo") ||
      message.includes("handshake has timed out")
    );
  }

  private isBadSessionError(
    error: unknown,
    baileys: BaileysModule,
    entry?: TenantRuntime,
  ): boolean {
    if (entry?.pairingInProgress || entry?.awaitingPairingRestart) {
      return false;
    }

    if (this.isConflictError(error)) {
      return false;
    }

    const boom = error as Boom | undefined;
    const statusCode = boom?.output?.statusCode;
    const message = this.disconnectMessage(error);

    return (
      statusCode === baileys.DisconnectReason.badSession ||
      this.isIntentionalLogout(error, baileys, entry) ||
      message.includes("Invalid private key") ||
      message.includes("Invalid session")
    );
  }

  private requiresPairingRestart(
    statusCode: number | undefined,
    baileys: BaileysModule,
    entry: TenantRuntime,
  ): boolean {
    return (
      entry.pairingInProgress ||
      entry.awaitingPairingRestart ||
      entry.status === "qr" ||
      statusCode === baileys.DisconnectReason.restartRequired ||
      statusCode === 515
    );
  }

  private scheduleReconnect(
    tenantId: string,
    entry: TenantRuntime,
    epoch: number,
    delayMs: number,
    baileys: BaileysModule,
  ) {
    entry.status = "connecting";
    entry.qrDataUrl = undefined;

    if (entry.socket) {
      void entry.socket.end(undefined).catch(() => undefined);
      entry.socket = undefined;
    }

    this.clearReconnectTimer(entry);
    entry.reconnectTimer = setTimeout(() => {
      entry.reconnectTimer = undefined;
      if ((this.runtime.get(tenantId)?.sessionEpoch ?? 0) !== epoch) {
        return;
      }
      void this.reopenConnection(tenantId).catch((error) => {
        this.logger.error(
          `WhatsApp reconnect failed for tenant ${tenantId}`,
          error,
        );
        const current = this.runtime.get(tenantId);
        if (!current) return;
        if (this.isBadSessionError(error, baileys, current)) {
          void this.resetAfterBadSession(tenantId, current);
          return;
        }
        current.lastError = this.isNetworkError(error, current)
          ? this.classifyConnectionError(error)
          : error instanceof Error
            ? error.message
            : "reconnect_failed";
        current.status = "disconnected";
      });
    }, delayMs);
  }

  private async openSocket(tenantId: string, entry: TenantRuntime) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { whatsappPhone: true },
    });
    if (!tenant) {
      entry.status = "disconnected";
      entry.lastError = "tenant_not_found";
      return;
    }

    if (this.shuttingDown.has(tenantId)) {
      return;
    }

    try {
      await this.assertWhatsAppReachable(tenantId);
    } catch (error) {
      entry.status = "disconnected";
      entry.lastError =
        error instanceof Error && error.message === "whatsapp_dns_unreachable"
          ? "dns_error"
          : "network_error";
      return;
    }

    const baileys = await this.loadBaileys();
    const baileysLogger = await this.loadBaileysLogger();
    const { state, saveCreds } = await useDatabaseAuthState(
      this.prisma,
      tenantId,
      baileys,
    );

    if (state.creds.me && !state.creds.registered) {
      entry.pairingInProgress = true;
      entry.awaitingPairingRestart = true;
    }

    const { version, isLatest } = await baileys.fetchLatestWaWebVersion();
    this.logger.log(
      `WhatsApp socket for tenant ${tenantId} using WA Web version ${version.join(".")}${isLatest ? "" : " (bundled fallback)"}`,
    );

    const socket = baileys.default({
      version,
      auth: {
        creds: state.creds,
        keys: baileys.makeCacheableSignalKeyStore(state.keys, baileysLogger),
      },
      browser: baileys.Browsers.macOS("BusinessOS"),
      logger: baileysLogger,
      markOnlineOnConnect: false,
      syncFullHistory: false,
      printQRInTerminal: false,
      connectTimeoutMs: SOCKET_CONNECT_TIMEOUT_MS,
      defaultQueryTimeoutMs: SOCKET_CONNECT_TIMEOUT_MS,
      keepAliveIntervalMs: 30_000,
      getMessage: async () => undefined,
    });

    entry.socket = socket;
    const epoch = entry.sessionEpoch ?? 0;
    this.armConnectingWatchdog(tenantId, entry, epoch);

    socket.ev.on("creds.update", async () => {
      await saveCreds();
      if (state.creds.me && !state.creds.registered) {
        entry.awaitingPairingRestart = true;
        entry.pairingInProgress = true;
      } else if (state.creds.registered) {
        entry.awaitingPairingRestart = false;
        entry.pairingInProgress = false;
      }
    });

    socket.ev.on("connection.update", async (update) => {
      if (this.shuttingDown.has(tenantId)) {
        return;
      }
      if ((this.runtime.get(tenantId)?.sessionEpoch ?? 0) !== epoch) {
        return;
      }

      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        entry.status = "qr";
        entry.reconnectAttempts = 0;
        entry.pairingRestartAttempts = 0;
        entry.lastError = undefined;
        entry.awaitingPairingRestart = false;
        entry.pairingInProgress = false;
        entry.qrDataUrl = await QRCode.toDataURL(qr, { margin: 1, width: 280 });
        this.clearConnectingWatchdog(entry);
        this.armConnectingWatchdog(tenantId, entry, epoch);
      }

      if (connection === "open") {
        const phone = socket.user?.id?.split(":")[0]?.split("@")[0];
        entry.status = "connected";
        entry.qrDataUrl = undefined;
        entry.phone = phone ?? tenant.whatsappPhone ?? undefined;
        entry.lastError = undefined;
        entry.reconnectAttempts = 0;
        entry.pairingRestartAttempts = 0;
        entry.awaitingPairingRestart = false;
        entry.pairingInProgress = false;
        entry.connectingSince = undefined;
        this.clearConnectingWatchdog(entry);

        this.logger.log(
          `WhatsApp connected for tenant ${tenantId} (${entry.phone ?? "unknown"})`,
        );

        await this.prisma.tenant.update({
          where: { id: tenantId },
          data: {
            whatsappConnected: true,
            whatsappPhone: entry.phone ?? null,
          },
        });
      }

      if (connection === "close") {
        if (this.shuttingDown.has(tenantId)) {
          return;
        }

        const disconnectError = lastDisconnect?.error;
        const statusCode = (disconnectError as Boom | undefined)?.output
          ?.statusCode;

        this.logger.warn(
          `WhatsApp connection closed for tenant ${tenantId} (code ${statusCode ?? "unknown"}${this.isConflictError(disconnectError) ? ", conflict" : ""})`,
        );

        if (this.isIntentionalLogout(disconnectError, baileys, entry)) {
          await this.resetAfterBadSession(tenantId, entry);
          return;
        }

        if (this.isBadSessionError(disconnectError, baileys, entry)) {
          await this.resetAfterBadSession(tenantId, entry);
          return;
        }

        if (this.isConflictError(disconnectError)) {
          if (
            (entry.pairingInProgress ||
              entry.awaitingPairingRestart ||
              entry.status === "connecting") &&
            (entry.pairingRestartAttempts ?? 0) < MAX_PAIRING_RESTART_ATTEMPTS
          ) {
            entry.pairingRestartAttempts =
              (entry.pairingRestartAttempts ?? 0) + 1;
            this.logger.log(
              `WhatsApp pairing conflict for tenant ${tenantId}, retry ${entry.pairingRestartAttempts}/${MAX_PAIRING_RESTART_ATTEMPTS}`,
            );
            this.scheduleReconnect(
              tenantId,
              entry,
              epoch,
              PAIRING_RESTART_DELAY_MS,
              baileys,
            );
            return;
          }

          await this.resetAfterBadSession(tenantId, entry);
          return;
        }

        if (
          this.requiresPairingRestart(statusCode, baileys, entry) &&
          (entry.pairingRestartAttempts ?? 0) < MAX_PAIRING_RESTART_ATTEMPTS
        ) {
          entry.pairingRestartAttempts = (entry.pairingRestartAttempts ?? 0) + 1;
          entry.awaitingPairingRestart = true;
          this.logger.log(
            `WhatsApp pairing restart for tenant ${tenantId} (${entry.pairingRestartAttempts}/${MAX_PAIRING_RESTART_ATTEMPTS})`,
          );
          this.scheduleReconnect(
            tenantId,
            entry,
            epoch,
            PAIRING_RESTART_DELAY_MS,
            baileys,
          );
          return;
        }

        if (this.isNetworkError(disconnectError, entry)) {
          entry.reconnectAttempts = (entry.reconnectAttempts ?? 0) + 1;
          if (entry.reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
            const delayMs = this.networkRetryDelayMs(entry.reconnectAttempts);
            this.logger.warn(
              `WhatsApp network blip for tenant ${tenantId}, retry ${entry.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delayMs}ms`,
            );
            this.scheduleReconnect(tenantId, entry, epoch, delayMs, baileys);
            return;
          }

          this.clearReconnectTimer(entry);
          entry.status = "disconnected";
          entry.qrDataUrl = undefined;
          entry.lastError = this.classifyConnectionError(disconnectError);
          if (entry.socket) {
            try {
              await entry.socket.end(undefined);
            } catch {
              // ignore
            }
            entry.socket = undefined;
          }
          this.logger.error(
            `WhatsApp network error for tenant ${tenantId}: ${this.disconnectMessage(disconnectError)}`,
          );
          return;
        }

        entry.reconnectAttempts = (entry.reconnectAttempts ?? 0) + 1;
        if (entry.reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
          entry.status = "disconnected";
          entry.lastError = "connection_failed";
          this.logger.error(
            `WhatsApp reconnect limit reached for tenant ${tenantId}`,
          );
          return;
        }

        const restartRequired =
          statusCode === baileys.DisconnectReason.restartRequired ||
          statusCode === 515;
        const delayMs = restartRequired ? PAIRING_RESTART_DELAY_MS : 1_500;
        this.scheduleReconnect(tenantId, entry, epoch, delayMs, baileys);
      }
    });
  }

  private toJid(phone: string): string {
    const normalized = normalizePhoneForWhatsApp(phone);
    return `${normalized}@s.whatsapp.net`;
  }
}
