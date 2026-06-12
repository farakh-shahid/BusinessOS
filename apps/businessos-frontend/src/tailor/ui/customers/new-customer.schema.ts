import { isValidPakistanPhone } from "@business-os/shared";
import { z } from "zod";

export function createNewCustomerSchema(messages: {
  nameRequired: string;
  phoneRequired: string;
  phoneInvalid: string;
  emailInvalid: string;
}) {
  return z.object({
    customerName: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .min(2, messages.nameRequired),
    customerPhone: z
      .string()
      .trim()
      .min(1, messages.phoneRequired)
      .refine((value) => isValidPakistanPhone(value), messages.phoneInvalid),
    customerEmail: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        messages.emailInvalid,
      ),
  });
}

export type NewCustomerFormValues = z.infer<
  ReturnType<typeof createNewCustomerSchema>
>;
