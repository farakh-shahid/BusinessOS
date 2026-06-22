"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getDictionary } from "@/i18n";
import { useLocale } from "@/core/i18n/locale-context";
import { cn } from "@/core/presentation/lib/utils";
import { Input } from "@/core/presentation/components/ui/input";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  isRtl?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, isRtl, ...props }, ref) {
    const { locale } = useLocale();
    const t = getDictionary(locale);
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn(isRtl ? "pl-11" : "pr-11", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-slate transition hover:text-foreground",
            isRtl ? "left-3" : "right-3",
          )}
          aria-label={
            showPassword ? t.auth.hidePassword : t.auth.showPassword
          }
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
    );
  },
);
