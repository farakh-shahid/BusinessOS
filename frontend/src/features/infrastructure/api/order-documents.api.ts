import type { OrderDocumentType, OrderDocumentWhatsAppResult } from "@shared";
import { ApiError } from "@/core/infrastructure/api/api-client";

const API_ROOT =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export async function sendOrderDocumentWhatsApp(
  orderId: string,
  type: OrderDocumentType,
  file: File,
): Promise<OrderDocumentWhatsAppResult> {
  const form = new FormData();
  form.append("file", file);

  const params = new URLSearchParams({ type });
  const { getAccessToken } = await import("@/core/auth/auth-storage");
  const token = getAccessToken();
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${API_ROOT}/tailor/orders/${orderId}/documents/whatsapp?${params.toString()}`,
    {
      method: "POST",
      headers,
      body: form,
    },
  );

  if (!response.ok) {
    let message = `Upload failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) {
        message = body.message.join(", ");
      } else if (body.message) {
        message = body.message;
      }
    } catch {
      // ignore
    }
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<OrderDocumentWhatsAppResult>;
}
