import {
  bookingGarmentTypes,
  emptyMeasurementsForGarment,
  emptyStyleForGarment,
  type BookingGarmentType,
} from "@shared";

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

export {
  MAX_DRESS_IMAGE_BYTES,
  prepareDressImageForUpload,
  dressImageUploadErrorKey,
} from "./dress-image-prepare";
