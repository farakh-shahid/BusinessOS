"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { isValidPakistanPhone } from "@shared";
import { getDictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { PasswordInput } from "@/core/presentation/components/ui/password-input";
import { PakistanPhoneField } from "@/core/presentation/components/ui/pakistan-phone-field";
import { Label } from "@/core/presentation/components/ui/label";
import { useLocale } from "@/core/i18n/locale-context";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import {
  useMeQuery,
  useUpdateProfileMutation,
} from "@/features/infrastructure/api/hooks/use-auth";
import { SettingsPanel } from "@/features/ui/settings/settings-section-nav";

interface SettingsMyProfilePanelProps {
  isRtl: boolean;
}

export function SettingsMyProfilePanel({ isRtl }: SettingsMyProfilePanelProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const { data: user } = useMeQuery();
  const updateProfile = useUpdateProfileMutation();
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setSpecialty(user.specialty ?? "");
    setPhone(user.phone ?? "");
    setPhone2(user.phone2 ?? "");
  }, [user]);

  const phonesMatchError =
    phone.trim() && phone2.trim() && phone.trim() === phone2.trim()
      ? t.staff.phonesMustDiffer
      : undefined;

  async function handleSave() {
    setFeedback(null);
    setError(null);
    setSubmitted(true);

    if (!name.trim()) {
      setError(t.staff.invalidForm);
      return;
    }

    if (
      (phone.trim() && !isValidPakistanPhone(phone.trim())) ||
      (phone2.trim() && !isValidPakistanPhone(phone2.trim())) ||
      phonesMatchError
    ) {
      return;
    }

    if (newPassword.trim() && newPassword.trim().length < 8) {
      setError(t.staff.invalidForm);
      return;
    }

    if (newPassword.trim() && !currentPassword.trim()) {
      setError(t.staff.currentPasswordRequired);
      return;
    }

    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        specialty: specialty.trim() || undefined,
        phone: phone.trim(),
        phone2: phone2.trim(),
        ...(newPassword.trim()
          ? {
              currentPassword: currentPassword.trim(),
              newPassword: newPassword.trim(),
            }
          : {}),
      });
      setCurrentPassword("");
      setNewPassword("");
      setSubmitted(false);
      setFeedback(
        newPassword.trim() ? t.staff.passwordUpdated : t.staff.profileSaved,
      );
    } catch (err) {
      setError(resolveApiErrorMessage(err, t));
    }
  }

  if (!user) return null;

  return (
    <SettingsPanel
      title={t.settings.myProfile}
      description={t.settings.myProfileHint}
      icon={<UserRound className="h-4 w-4" />}
      isRtl={isRtl}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="my-name">{t.form.name}</Label>
          <Input
            id="my-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="my-specialty">{t.staff.specialty}</Label>
          <Input
            id="my-specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder={t.staff.specialtyPlaceholder}
            className="mt-1.5"
          />
        </div>
        <PakistanPhoneField
          id="my-phone"
          label={t.form.phone}
          value={phone}
          onChange={setPhone}
          placeholder={t.form.phonePlaceholder}
          hint={t.staff.phoneLoginHint}
          invalidMessage={t.validation.phoneInvalid}
          forceShowError={submitted}
        />
        <PakistanPhoneField
          id="my-phone2"
          label={t.staff.phone2}
          value={phone2}
          onChange={setPhone2}
          placeholder={t.staff.phone2Optional}
          invalidMessage={t.validation.phoneInvalid}
          externalError={submitted ? phonesMatchError : undefined}
          forceShowError={submitted}
        />
        {user.email ? (
          <div className="sm:col-span-2">
            <Label htmlFor="my-email">{t.form.email}</Label>
            <Input
              id="my-email"
              value={user.email}
              disabled
              dir="ltr"
              className="mt-1.5 bg-slate-50 text-muted-slate"
            />
            <p className="mt-1 text-xs text-muted-slate">{t.staff.emailReadOnly}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 border-t border-hairline pt-5">
        <h3 className="font-semibold text-foreground">{t.staff.changePassword}</h3>
        <p className="mt-1 text-sm text-muted-slate">{t.staff.changePasswordHint}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="my-current-password">{t.staff.currentPassword}</Label>
            <PasswordInput
              id="my-current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              dir="ltr"
              autoComplete="current-password"
              isRtl={isRtl}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="my-new-password">{t.staff.newPassword}</Label>
            <PasswordInput
              id="my-new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              dir="ltr"
              autoComplete="new-password"
              isRtl={isRtl}
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

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

      <div className={cn("mt-5 flex justify-end", isRtl && "justify-start")}>
        <Button onClick={() => void handleSave()} disabled={updateProfile.isPending}>
          {updateProfile.isPending ? t.staff.savingChanges : t.staff.saveMember}
        </Button>
      </div>
    </SettingsPanel>
  );
}
