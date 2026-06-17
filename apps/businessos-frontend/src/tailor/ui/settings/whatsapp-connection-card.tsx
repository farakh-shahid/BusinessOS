"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Unplug } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { cn } from "@/core/presentation/lib/utils";
import {
  useConnectWhatsAppMutation,
  useDisconnectWhatsAppMutation,
  useWhatsAppConnectionQuery,
} from "@/tailor/infrastructure/api/hooks/use-settings";

interface WhatsAppConnectionCardProps {
  t: Dictionary;
  isRtl?: boolean;
  isAdmin: boolean;
  /** When true, renders without outer Card margin — for settings section layout */
  embedded?: boolean;
}

export function WhatsAppConnectionCard({
  t,
  isRtl,
  isAdmin,
  embedded = false,
}: WhatsAppConnectionCardProps) {
  const [error, setError] = useState<string | null>(null);
  const sawQrRef = useRef(false);
  const { data, isLoading } = useWhatsAppConnectionQuery({ poll: true });
  const connect = useConnectWhatsAppMutation();
  const disconnect = useDisconnectWhatsAppMutation();

  const busy = connect.isPending || disconnect.isPending;
  const status = data?.status ?? "disconnected";

  useEffect(() => {
    if (status === "qr") sawQrRef.current = true;
    if (status === "disconnected") sawQrRef.current = false;
  }, [status]);

  function disconnectedMessage() {
    switch (data?.lastError) {
      case "session_invalid_reconnect":
        return t.settings.whatsappSessionInvalid;
      case "network_error":
        return t.settings.whatsappNetworkError;
      case "dns_error":
        return t.settings.whatsappDnsError;
      case "connection_timeout":
        return t.settings.whatsappConnectionTimeout;
      case "connection_failed":
        return t.settings.whatsappConnectionFailed;
      default:
        return t.settings.whatsappDisconnected;
    }
  }

  async function handleConnect() {
    if (!isAdmin) return;
    setError(null);
    try {
      await connect.mutateAsync();
    } catch {
      setError(t.settings.whatsappError);
    }
  }

  async function handleDisconnect() {
    if (!isAdmin) return;
    if (!window.confirm(t.settings.whatsappDisconnectConfirm)) return;
    setError(null);
    try {
      await disconnect.mutateAsync();
    } catch {
      setError(t.settings.whatsappError);
    }
  }

  return (
    <Card className={embedded ? undefined : "mt-4"}>
      <CardTitle className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-emerald-600" />
        {t.settings.whatsappConnection}
      </CardTitle>
      <p className="mt-1 text-sm text-slate-500">
        {t.settings.whatsappConnectionSubtitle}
      </p>

      <div className="mt-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.common.loading}
          </div>
        ) : status === "connected" ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-800">
              {t.settings.whatsappConnectedAs.replace(
                "{phone}",
                data?.phone ?? "—",
              )}
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              {t.settings.whatsappConnectedHint}
            </p>
            {isAdmin ? (
              <Button
                type="button"
                variant="outline"
                className="mt-3 h-9 px-3 text-xs"
                onClick={() => void handleDisconnect()}
                disabled={busy}
              >
                <Unplug className="mr-1.5 h-3.5 w-3.5" />
                {t.settings.whatsappDisconnect}
              </Button>
            ) : null}
          </div>
        ) : status === "qr" && data?.qrDataUrl ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-hairline bg-slate-50 px-4 py-5">
            <p className="text-center text-sm font-semibold text-slate-800">
              {t.settings.whatsappScanQr}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.qrDataUrl}
              alt="WhatsApp QR code"
              className="h-[280px] w-[280px] rounded-lg bg-white p-2 shadow-sm"
            />
            <p className="max-w-sm text-center text-xs text-slate-500">
              {t.settings.whatsappScanSteps}
            </p>
            {isAdmin ? (
              <Button
                type="button"
                variant="outline"
                className="h-9 px-3 text-xs"
                onClick={() => void handleDisconnect()}
                disabled={busy}
              >
                <Unplug className="mr-1.5 h-3.5 w-3.5" />
                {t.settings.whatsappCancel}
              </Button>
            ) : null}
          </div>
        ) : status === "connecting" ? (
          <div className="rounded-xl border border-hairline bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              {sawQrRef.current
                ? t.settings.whatsappFinishing
                : t.settings.whatsappConnecting}
            </div>
            {isAdmin ? (
              <Button
                type="button"
                variant="outline"
                className="mt-3 h-9 px-3 text-xs"
                onClick={() => void handleDisconnect()}
                disabled={busy}
              >
                <Unplug className="mr-1.5 h-3.5 w-3.5" />
                {t.settings.whatsappCancel}
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="rounded-xl border border-hairline bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-600">{disconnectedMessage()}</p>
            {isAdmin ? (
              <Button
                type="button"
                className={cn("mt-3", isRtl && "flex-row-reverse")}
                onClick={() => void handleConnect()}
                disabled={busy}
              >
                {busy ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                )}
                {t.settings.whatsappConnect}
              </Button>
            ) : null}
          </div>
        )}

        {error ? (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
