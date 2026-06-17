"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { useLocale } from "@/core/i18n/locale-context";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import {
  useMeQuery,
  useUpdateProfileMutation,
} from "@/tailor/infrastructure/api/hooks/use-auth";
import { SettingsPanel } from "@/tailor/ui/settings/settings-section-nav";

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
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setSpecialty(user.specialty ?? "");
  }, [user]);

  async function handleSave() {
    setFeedback(null);
    setError(null);
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        specialty: specialty.trim() || undefined,
      });
      setFeedback(t.staff.profileSaved);
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
