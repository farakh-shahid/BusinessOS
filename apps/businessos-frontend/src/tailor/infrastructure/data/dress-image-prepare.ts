import imageCompression from "browser-image-compression";

/** Server upload limit — keep in sync with upload.controller.ts */
export const MAX_DRESS_IMAGE_BYTES = 5_000_000;

const MAX_DRESS_IMAGE_MB = MAX_DRESS_IMAGE_BYTES / (1024 * 1024);

export function isDressImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Validates type and ensures the file fits the 5 MB upload cap.
 * Files larger than 5 MB are compressed in the browser before upload.
 */
export async function prepareDressImageForUpload(file: File): Promise<File> {
  if (!isDressImageFile(file)) {
    throw new Error("invalid_image");
  }

  if (file.size <= MAX_DRESS_IMAGE_BYTES) {
    return file;
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: MAX_DRESS_IMAGE_MB,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    initialQuality: 0.85,
    fileType: file.type === "image/png" ? "image/png" : "image/jpeg",
  });

  if (compressed.size > MAX_DRESS_IMAGE_BYTES) {
    throw new Error("image_too_large");
  }

  return compressed;
}

export function dressImageUploadErrorKey(
  err: unknown,
): "image_too_large" | "invalid_image" | "unknown" {
  if (err instanceof Error) {
    if (err.message === "image_too_large") return "image_too_large";
    if (err.message === "invalid_image") return "invalid_image";
  }
  return "unknown";
}
