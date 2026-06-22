"use client";

import type { Dictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { PakistanPhoneField } from "@/core/presentation/components/ui/pakistan-phone-field";
import { Label } from "@/core/presentation/components/ui/label";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import type { TenantSettings } from "@shared";
import { SettingsPanel } from "./settings-section-nav";

interface SettingsShopPanelProps {
  t: Dictionary;
  isRtl: boolean;
  isAdmin: boolean;
  name: string;
  phone: string;
  email: string;
  address: string;
  feedback: string | null;
  error: string | null;
  isSaving: boolean;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onSave: () => void;
  phoneShowError?: boolean;
}

export function SettingsShopPanel({
  t,
  isRtl,
  isAdmin,
  name,
  phone,
  email,
  address,
  feedback,
  error,
  isSaving,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onAddressChange,
  onSave,
  phoneShowError = false,
}: SettingsShopPanelProps) {
  return (
    <SettingsPanel
      title={t.settings.shopDetails}
      description={t.settings.shopDetailsHint}
      isRtl={isRtl}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="shop-name">{t.settings.shopName}</Label>
          <Input
            id="shop-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={!isAdmin}
            className="mt-1.5"
          />
        </div>
        <PakistanPhoneField
          id="shop-phone"
          label={t.form.phone}
          value={phone}
          onChange={onPhoneChange}
          placeholder={t.form.phonePlaceholder}
          hint={t.form.phoneHint}
          invalidMessage={t.validation.phoneInvalid}
          disabled={!isAdmin}
          forceShowError={phoneShowError}
        />
        <div>
          <Label htmlFor="shop-email">{t.form.email}</Label>
          <Input
            id="shop-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={!isAdmin}
            dir="ltr"
            className="mt-1.5"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="shop-address">{t.settings.address}</Label>
          <Textarea
            id="shop-address"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            disabled={!isAdmin}
            className="mt-1.5 min-h-[88px]"
          />
        </div>
      </div>

      {!isAdmin ? (
        <p className="mt-4 text-sm text-muted-slate">{t.settings.adminOnly}</p>
      ) : null}

      {feedback ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {feedback}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {isAdmin ? (
        <div className={cn("mt-5 flex justify-end", isRtl && "justify-start")}>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? t.settings.saving : t.settings.save}
          </Button>
        </div>
      ) : null}
    </SettingsPanel>
  );
}

export function SettingsShopPanelSkeleton() {
  return (
    <div className="rounded-[13px] border border-hairline bg-card p-6">
      <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
      <div className="mt-6 space-y-4">
        <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
        </div>
        <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

export type { TenantSettings };
