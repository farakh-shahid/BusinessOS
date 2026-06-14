import {
  bookingGarmentTypes,
  emptyMeasurementsForGarment,
  emptyStyleForGarment,
  type BookingGarmentType,
} from "@business-os/tailor";

export { bookingGarmentTypes, type BookingGarmentType };

export const bookingGarmentOptions = bookingGarmentTypes.map((value) => ({
  value,
  labelKey: value as
    | "shalwarQameez"
    | "dressPantCoat"
    | "sherwani"
    | "kurta"
    | "waistcoat",
}));

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function newDraftUploadKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export interface NewOrderDraft {
  customerMode: "existing" | "new";
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  garmentType: BookingGarmentType;
  measurements: Record<string, string>;
  style: Record<string, string>;
  dressCode: string;
  suitCount: string;
  dressImageUrl: string;
  dressImagePublicId: string;
  /** Stable key for Cloudinary draft folder before order is saved. */
  draftUploadKey: string;
  fabricSource: "customer" | "shop";
  fabricNotes: string;
  bookingDate: string;
  deliveryDate: string;
  advancePaid: string;
  totalPrice: string;
  isRush: boolean;
  assignedToName: string;
}

export const emptyNewOrderDraft = (): NewOrderDraft => ({
  customerMode: "existing",
  customerId: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  garmentType: "shalwarQameez",
  measurements: emptyMeasurementsForGarment("shalwarQameez"),
  style: emptyStyleForGarment("shalwarQameez"),
  dressCode: "",
  suitCount: "1",
  dressImageUrl: "",
  dressImagePublicId: "",
  draftUploadKey: newDraftUploadKey(),
  fabricSource: "customer",
  fabricNotes: "",
  bookingDate: todayIsoDate(),
  deliveryDate: "",
  advancePaid: "",
  totalPrice: "",
  isRush: false,
  assignedToName: "",
});

export const MAX_DRESS_IMAGE_BYTES = 5_000_000;

export function validateDressImageFile(file: File): void {
  if (!file.type.startsWith("image/")) {
    throw new Error("invalid_image");
  }
  if (file.size > MAX_DRESS_IMAGE_BYTES) {
    throw new Error("image_too_large");
  }
}

export async function readDressImageFile(file: File): Promise<string> {
  validateDressImageFile(file);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("read_failed"));
      }
    };
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });
}
