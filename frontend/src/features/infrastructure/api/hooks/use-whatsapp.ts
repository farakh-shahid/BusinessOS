"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Dictionary } from "@/i18n";
import { useToast } from "@/core/presentation/components/ui/toast";
import { fetchWhatsAppStatus } from "@/features/infrastructure/api/whatsapp.api";
import {
  sendWhatsAppTextWithFallback,
  whatsAppTextFeedback,
} from "@/features/ui/orders/whatsapp-send";

export function useWhatsAppStatusQuery() {
  return useQuery({
    queryKey: ["whatsapp", "status"],
    queryFn: fetchWhatsAppStatus,
    staleTime: 30_000,
  });
}

export function useWhatsAppTextAction() {
  const { showSuccess, showToast } = useToast();
  const [sending, setSending] = useState(false);

  async function send(params: { phone: string; message: string; t: Dictionary }) {
    if (sending) return;
    setSending(true);
    try {
      const result = await sendWhatsAppTextWithFallback({
        phone: params.phone,
        message: params.message,
      });
      const feedback = whatsAppTextFeedback(result, params.t);
      if (result.sent) showSuccess(feedback);
      else showToast(feedback, "info");
    } finally {
      setSending(false);
    }
  }

  return { send, sending };
}
