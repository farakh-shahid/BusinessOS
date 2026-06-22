import { ApiError } from "@/core/infrastructure/api/api-client";

const API_ROOT =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export function resolveMediaUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const origin = API_ROOT.replace(/\/api$/, "");
  return path.startsWith("/") ? `${origin}${path}` : `${origin}/${path}`;
}

/** Cloudinary thumbnail for dress/color swatch (detail header, list chips). */
export function dressImageThumbUrl(
  url: string | undefined,
  size = 96,
): string | undefined {
  const resolved = resolveMediaUrl(url);
  if (!resolved) return undefined;
  if (
    resolved.includes("res.cloudinary.com") &&
    resolved.includes("/upload/")
  ) {
    return resolved.replace(
      "/upload/",
      `/upload/w_${size},h_${size},c_fill,f_auto,q_auto/`,
    );
  }
  return resolved;
}

export type UploadDressImageOptions = {
  orderId?: string;
  customerId?: string;
  draftKey?: string;
  suitIndex?: number;
};

export async function uploadDressImage(
  file: File,
  options: UploadDressImageOptions = {},
): Promise<{ url: string; publicId: string }> {
  const form = new FormData();
  form.append("file", file);

  const params = new URLSearchParams();
  if (options.orderId) {
    params.set("orderId", options.orderId);
  }
  if (options.customerId) {
    params.set("customerId", options.customerId);
  }
  if (options.draftKey) {
    params.set("draftKey", options.draftKey);
  }
  if (options.suitIndex != null) {
    params.set("suitIndex", String(options.suitIndex));
  }

  const query = params.toString();
  const { getAccessToken } = await import("@/core/auth/auth-storage");
  const token = getAccessToken();
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${API_ROOT}/tailor/uploads/dress-image${query ? `?${query}` : ""}`,
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

  return response.json() as Promise<{ url: string; publicId: string }>;
}
