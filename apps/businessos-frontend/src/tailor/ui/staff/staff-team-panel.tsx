"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { StaffMember } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { getAvatarPaletteClass } from "@/core/presentation/lib/avatar-utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import {
  useCreateStaffMutation,
  useRevokeStaffMutation,
  useStaffQuery,
  useUpdateStaffMutation,
} from "@/tailor/infrastructure/api/hooks/use-staff";
import {
  useMeQuery,
  useUpdateProfileMutation,
} from "@/tailor/infrastructure/api/hooks/use-auth";
import { nameInitials } from "@/tailor/infrastructure/data/assignment-board-utils";
import { StaffListSkeleton } from "@/tailor/ui/skeletons";
import { SettingsPanel } from "@/tailor/ui/settings/settings-section-nav";
import { RevokeAccessDialog } from "@/tailor/ui/staff/revoke-access-dialog";

const staffActionButtonClass = "h-9 min-h-9 px-3 text-xs";

type StaffRole = "ADMIN" | "STAFF" | "TAILOR";

const STAFF_ROLE_OPTIONS: StaffRole[] = ["STAFF", "TAILOR", "ADMIN"];

function staffRoleLabel(role: StaffRole, t: Dictionary) {
  if (role === "ADMIN") return t.staff.roleAdmin;
  if (role === "TAILOR") return t.staff.roleTailor;
  return t.staff.roleStaff;
}

function staffContactLabel(member: Pick<StaffMember, "email" | "phone">) {
  if (member.email && member.phone) return `${member.email} · ${member.phone}`;
  return member.email ?? member.phone ?? "—";
}

interface StaffTeamPanelProps {
  t: Dictionary;
  isRtl: boolean;
  showHeader?: boolean;
}

export function StaffTeamPanel({
  t,
  isRtl,
  showHeader = true,
}: StaffTeamPanelProps) {
  const { data: currentUser } = useMeQuery();
  const { data: staff = [], isLoading, isError } = useStaffQuery();
  const createStaff = useCreateStaffMutation();
  const updateStaff = useUpdateStaffMutation();
  const updateProfile = useUpdateProfileMutation();
  const revokeStaff = useRevokeStaffMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSpecialty, setEditSpecialty] = useState("");
  const [editRole, setEditRole] = useState<StaffRole>("STAFF");

  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState<StaffRole>("STAFF");
  const [addSpecialty, setAddSpecialty] = useState("");

  function openEdit(member: StaffMember) {
    setEditingId(member.id);
    setEditName(member.name);
    setEditSpecialty(member.specialty ?? "");
    setEditRole(member.role);
    setError(null);
    setFeedback(null);
  }

  function closeEdit() {
    setEditingId(null);
  }

  async function handleSaveEdit(member: StaffMember) {
    setError(null);
    setFeedback(null);
    const isSelf = member.id === currentUser?.id;

    try {
      if (isSelf) {
        await updateProfile.mutateAsync({
          name: editName.trim(),
          specialty: editSpecialty.trim() || undefined,
        });
      } else {
        await updateStaff.mutateAsync({
          staffId: member.id,
          payload: {
            name: editName.trim(),
            role: editRole,
            specialty: editSpecialty.trim() || undefined,
          },
        });
      }
      setFeedback(t.staff.memberSaved);
      closeEdit();
    } catch (err) {
      setError(resolveApiErrorMessage(err, t));
    }
  }

  async function handleCreate() {
    setError(null);
    if (!addName.trim() || addPassword.length < 8) {
      setError(t.staff.invalidForm);
      return;
    }
    if (!addEmail.trim() && !addPhone.trim()) {
      setError(t.staff.emailOrPhoneRequired);
      return;
    }
    try {
      await createStaff.mutateAsync({
        name: addName.trim(),
        email: addEmail.trim() || undefined,
        phone: addPhone.trim() || undefined,
        password: addPassword,
        role: addRole,
        specialty: addSpecialty.trim() || undefined,
      });
      setShowAddForm(false);
      setAddName("");
      setAddEmail("");
      setAddPhone("");
      setAddPassword("");
      setAddRole("STAFF");
      setAddSpecialty("");
      setFeedback(t.staff.memberCreated);
    } catch (err) {
      setError(resolveApiErrorMessage(err, t));
    }
  }

  async function handleRevokeConfirm() {
    if (!revokeTarget || revokeTarget.id === currentUser?.id) return;
    setError(null);
    try {
      await revokeStaff.mutateAsync(revokeTarget.id);
      setRevokeTarget(null);
      setFeedback(t.staff.accessRevoked);
    } catch (err) {
      setError(resolveApiErrorMessage(err, t));
    }
  }

  const saving =
    updateStaff.isPending || updateProfile.isPending || createStaff.isPending;

  return (
    <>
      <SettingsPanel
        title={showHeader ? t.staff.title : t.settings.sectionTeam}
        description={t.staff.gridSubtitle}
        isRtl={isRtl}
        actions={
          <Button className="gap-2" onClick={() => setShowAddForm((v) => !v)}>
            <Plus className="h-4 w-4" />
            {t.staff.addStaff}
          </Button>
        }
      >
        {showAddForm ? (
          <div className="mb-5 rounded-[13px] border border-dashed border-brand-200 bg-brand-50/30 p-4 sm:p-5">
            <h3 className="font-semibold text-foreground">{t.staff.addStaff}</h3>
            <p className="mt-1 text-sm text-muted-slate">{t.staff.loginHint}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="add-staff-name">{t.form.name}</Label>
                <Input
                  id="add-staff-name"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="add-staff-specialty">{t.staff.specialty}</Label>
                <Input
                  id="add-staff-specialty"
                  value={addSpecialty}
                  onChange={(e) => setAddSpecialty(e.target.value)}
                  placeholder={t.staff.specialtyPlaceholder}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="add-staff-role">{t.staff.role}</Label>
                <SearchableCombobox
                  id="add-staff-role"
                  value={addRole}
                  onChange={(value) => setAddRole(value as StaffRole)}
                  options={STAFF_ROLE_OPTIONS.map((value) => ({
                    value,
                    label: staffRoleLabel(value, t),
                  }))}
                  placeholder={t.staff.role}
                  emptyMessage={t.form.noOptions}
                  isRtl={isRtl}
                  aria-label={t.staff.role}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="add-staff-email">{t.form.email}</Label>
                <Input
                  id="add-staff-email"
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder={t.staff.emailOptional}
                  dir="ltr"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="add-staff-phone">{t.form.phone}</Label>
                <Input
                  id="add-staff-phone"
                  type="tel"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  placeholder={t.staff.phoneOptional}
                  dir="ltr"
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="add-staff-password">{t.staff.password}</Label>
                <Input
                  id="add-staff-password"
                  type="password"
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  dir="ltr"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div
              className={cn(
                "mt-4 flex items-center gap-2",
                isRtl && "flex-row-reverse",
              )}
            >
              <Button
                variant="outline"
                className={staffActionButtonClass}
                onClick={() => setShowAddForm(false)}
              >
                {t.form.cancel}
              </Button>
              <Button
                className={staffActionButtonClass}
                onClick={() => void handleCreate()}
                disabled={createStaff.isPending}
              >
                {createStaff.isPending ? t.staff.saving : t.staff.create}
              </Button>
            </div>
          </div>
        ) : null}

        {feedback ? (
          <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {feedback}
          </p>
        ) : null}
        {error ? (
          <p className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <StaffListSkeleton />
        ) : isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
            {t.common.error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {staff.map((member) => {
              const isSelf = member.id === currentUser?.id;
              const isEditing = editingId === member.id;
              const displaySpecialty =
                member.specialty?.trim() || t.staff.specialtyEmpty;

              return (
                <article
                  key={member.id}
                  className={cn(
                    "flex h-full flex-col rounded-[13px] border border-hairline bg-background p-4 transition-shadow hover:shadow-sm",
                    isSelf && "ring-1 ring-brand-100",
                    isRtl && "text-right",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-start justify-between gap-3",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    <div
                      className={cn(
                        "flex min-w-0 items-center gap-3",
                        isRtl && "flex-row-reverse",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                          getAvatarPaletteClass(member.name),
                        )}
                      >
                        {nameInitials(member.name)}
                      </div>
                      <div className="min-w-0">
                        <div
                          className={cn(
                            "flex flex-wrap items-center gap-2",
                            isRtl && "flex-row-reverse justify-end",
                          )}
                        >
                          <p className="truncate font-display text-base font-bold text-foreground">
                            {member.name}
                          </p>
                          {isSelf ? (
                            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                              {t.staff.you}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 truncate text-xs font-medium text-brand-700">
                          {displaySpecialty}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
                      {staffRoleLabel(member.role, t)}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-muted-slate" dir="ltr">
                    {staffContactLabel(member)}
                  </p>

                  {isEditing ? (
                    <div className="mt-4 space-y-3 border-t border-hairline pt-4">
                      <div>
                        <Label htmlFor={`edit-name-${member.id}`}>{t.form.name}</Label>
                        <Input
                          id={`edit-name-${member.id}`}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-specialty-${member.id}`}>
                          {t.staff.specialty}
                        </Label>
                        <Input
                          id={`edit-specialty-${member.id}`}
                          value={editSpecialty}
                          onChange={(e) => setEditSpecialty(e.target.value)}
                          placeholder={t.staff.specialtyPlaceholder}
                          className="mt-1.5"
                        />
                      </div>
                      {!isSelf ? (
                        <div>
                          <Label htmlFor={`edit-role-${member.id}`}>{t.staff.role}</Label>
                          <SearchableCombobox
                            id={`edit-role-${member.id}`}
                            value={editRole}
                            onChange={(value) => setEditRole(value as StaffRole)}
                            disabled={saving}
                            options={STAFF_ROLE_OPTIONS.map((value) => ({
                              value,
                              label: staffRoleLabel(value, t),
                            }))}
                            placeholder={t.staff.role}
                            emptyMessage={t.form.noOptions}
                            isRtl={isRtl}
                            aria-label={t.staff.role}
                            className="mt-1.5"
                          />
                        </div>
                      ) : null}
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          isRtl && "flex-row-reverse",
                        )}
                      >
                        <Button
                          variant="outline"
                          className={staffActionButtonClass}
                          onClick={closeEdit}
                          disabled={saving}
                        >
                          {t.form.cancel}
                        </Button>
                        <Button
                          className={staffActionButtonClass}
                          onClick={() => void handleSaveEdit(member)}
                          disabled={saving}
                        >
                          {saving ? t.staff.savingChanges : t.staff.saveMember}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "mt-4 flex items-center gap-2 border-t border-hairline pt-4",
                        isRtl && "flex-row-reverse",
                      )}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(staffActionButtonClass, "gap-1.5")}
                        onClick={() => openEdit(member)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {t.staff.editMember}
                      </Button>
                      {!isSelf ? (
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            staffActionButtonClass,
                            "gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50",
                          )}
                          disabled={revokeStaff.isPending}
                          onClick={() =>
                            setRevokeTarget({ id: member.id, name: member.name })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {t.staff.revokeAccess}
                        </Button>
                      ) : null}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </SettingsPanel>

      <RevokeAccessDialog
        memberName={revokeTarget?.name ?? null}
        isPending={revokeStaff.isPending}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => void handleRevokeConfirm()}
      />
    </>
  );
}
