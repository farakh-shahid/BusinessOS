"use client";

import { useId, useState } from "react";
import { cn } from "@/core/presentation/lib/utils";
import {
  phoneInputErrorClass,
  validatePakistanPhoneField,
} from "@/core/presentation/lib/pakistan-phone-input";
import { FormFieldError } from "./form-field-error";
import { Label } from "./label";
import { PakistanPhoneInput } from "./pakistan-phone-input";

interface PakistanPhoneFieldProps {
  id?: string;
  label?: React.ReactNode;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalidMessage: string;
  required?: boolean;
  requiredMessage?: string;
  externalError?: string;
  forceShowError?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function PakistanPhoneField({
  id,
  label,
  hint,
  value,
  onChange,
  onBlur,
  invalidMessage,
  required = false,
  requiredMessage,
  externalError,
  forceShowError = false,
  disabled,
  placeholder,
  className,
  inputClassName,
}: PakistanPhoneFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [touched, setTouched] = useState(false);

  const validationError = validatePakistanPhoneField(value, {
    required,
    requiredMessage,
    invalidMessage,
  });
  const showErrors = touched || forceShowError;
  const displayError =
    externalError ?? (showErrors ? validationError : undefined);
  const invalid = Boolean(displayError);

  return (
    <div className={className}>
      {label ? <Label htmlFor={fieldId}>{label}</Label> : null}
      <PakistanPhoneInput
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => {
          setTouched(true);
          onBlur?.();
        }}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={invalid}
        className={cn(
          label ? "mt-1.5" : undefined,
          phoneInputErrorClass(invalid),
          inputClassName,
        )}
      />
      {hint && !displayError ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
      <FormFieldError message={displayError} />
    </div>
  );
}
