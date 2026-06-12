"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import {
  useCreateStaffMutation,
  useStaffQuery,
  useUpdateStaffMutation,
} from "@/tailor/infrastructure/api/hooks/use-staff";
import { StaffListSkeleton } from "@/tailor/ui/skeletons";

function staffContactLabel(member: {
  email?: string;
  phone?: string;
}): string {
  if (member.email && member.phone) {
    return `${member.email} · ${member.phone}`;
  }
  return member.email ?? member.phone ?? "—";
}

export function StaffView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: currentUser } = useMeQuery();
  const { data: staff = [], isLoading, isError } = useStaffQuery();
  const createStaff = useCreateStaffMutation();
  const updateStaff = useUpdateStaffMutation();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setError(null);
    if (!name.trim() || password.length < 8) {
      setError(t.staff.invalidForm);
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError(t.staff.emailOrPhoneRequired);
      return;
    }
    try {
      await createStaff.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
        role,
      });
      setShowForm(false);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("STAFF");
    } catch (err) {
      setError(resolveApiErrorMessage(err, t));
    }
  }

  async function handleRoleChange(
    staffId: string,
    nextRole: "ADMIN" | "STAFF",
    currentName: string,
  ) {
    if (staffId === currentUser?.id) return;
    setError(null);
    try {
      await updateStaff.mutateAsync({
        staffId,
        payload: { name: currentName, role: nextRole },
      });
    } catch (err) {
      setError(resolveApiErrorMessage(err, t));
    }
  }

  return (
    <>
      <div className="mb-4">
        <Link
          href={routes.settings}
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          ← {t.settings.title}
        </Link>
        <div
          className={cn(
            "mt-2 flex items-start justify-between gap-4",
            isRtl && "flex-row-reverse",
          )}
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900 md:text-2xl">
              {t.staff.title}
            </h2>
            <p className="text-sm text-slate-500">{t.staff.subtitle}</p>
          </div>
          <Button className="gap-2" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" />
            {t.staff.addStaff}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardTitle>{t.staff.addStaff}</CardTitle>
          <p className="mt-1 text-sm text-slate-500">{t.staff.loginHint}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="staff-name">{t.form.name}</Label>
              <Input
                id="staff-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="staff-email">{t.form.email}</Label>
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.staff.emailOptional}
                dir="ltr"
              />
            </div>
            <div>
              <Label htmlFor="staff-phone">{t.form.phone}</Label>
              <Input
                id="staff-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.staff.phoneOptional}
                dir="ltr"
              />
            </div>
            <div>
              <Label htmlFor="staff-password">{t.staff.password}</Label>
              <Input
                id="staff-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
              />
            </div>
            <div>
              <Label htmlFor="staff-role">{t.staff.role}</Label>
              <SearchableCombobox
                id="staff-role"
                value={role}
                onChange={(value) => setRole(value as "ADMIN" | "STAFF")}
                options={[
                  { value: "STAFF", label: t.staff.roleStaff },
                  { value: "ADMIN", label: t.staff.roleAdmin },
                ]}
                placeholder={t.staff.role}
                emptyMessage={t.form.noOptions}
                isRtl={isRtl}
                aria-label={t.staff.role}
              />
            </div>
          </div>
          {error && (
            <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}
          <div className={cn("mt-4 flex gap-2", isRtl && "flex-row-reverse")}>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              {t.form.cancel}
            </Button>
            <Button onClick={handleCreate} disabled={createStaff.isPending}>
              {createStaff.isPending ? t.staff.saving : t.staff.create}
            </Button>
          </div>
        </Card>
      )}

      {error && !showForm && (
        <p className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      {isLoading ? (
        <StaffListSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      ) : (
        <ul className="space-y-3">
          {staff.map((member) => {
            const isSelf = member.id === currentUser?.id;
            return (
              <li
                key={member.id}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between",
                  isRtl && "sm:flex-row-reverse",
                )}
              >
                <div className={cn(isRtl && "text-right")}>
                  <div
                    className={cn(
                      "flex flex-wrap items-center gap-2",
                      isRtl && "flex-row-reverse justify-end",
                    )}
                  >
                    <p className="font-semibold text-slate-900">{member.name}</p>
                    {isSelf ? (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                        {t.staff.you}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-500" dir="ltr">
                    {staffContactLabel(member)}
                  </p>
                </div>
                {isSelf ? (
                  <div
                    className={cn(
                      "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 sm:w-44 sm:text-center",
                      isRtl && "text-right sm:text-center",
                    )}
                  >
                    {member.role === "ADMIN"
                      ? t.staff.roleAdmin
                      : t.staff.roleStaff}
                  </div>
                ) : (
                  <SearchableCombobox
                    value={member.role}
                    onChange={(value) =>
                      handleRoleChange(
                        member.id,
                        value as "ADMIN" | "STAFF",
                        member.name,
                      )
                    }
                    disabled={updateStaff.isPending}
                    className="sm:w-44"
                    options={[
                      { value: "STAFF", label: t.staff.roleStaff },
                      { value: "ADMIN", label: t.staff.roleAdmin },
                    ]}
                    placeholder={t.staff.role}
                    emptyMessage={t.form.noOptions}
                    isRtl={isRtl}
                    aria-label={t.staff.role}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
