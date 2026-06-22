import { forwardRef } from "react";
import { sanitizePakistanPhoneInput } from "@/core/presentation/lib/pakistan-phone-input";
import { Input } from "./input";

export const PakistanPhoneInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function PakistanPhoneInput({ onChange, ...props }, ref) {
  return (
    <Input
      {...props}
      ref={ref}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      maxLength={11}
      dir="ltr"
      onChange={(event) => {
        const sanitized = sanitizePakistanPhoneInput(event.target.value);
        onChange?.({
          ...event,
          target: { ...event.target, value: sanitized },
          currentTarget: { ...event.currentTarget, value: sanitized },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    />
  );
});
