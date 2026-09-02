"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/app/ui/button";
import { ConfirmDialog, Modal } from "@/components/app/ui/modal";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/app/ui/states";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import { qk } from "@/lib/app/query-keys";
import type { Vehicle } from "@/lib/app/types";

import { draftToPayload, toDraft, VehicleForm, type VehicleDraft } from "./vehicle-form";

export function VehiclesView() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<VehicleDraft>(toDraft());
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const vehiclesQ = useQuery({
    queryKey: qk.vehicles,
    queryFn: () => apiJson<Vehicle[]>("/vehicles"),
  });

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setFormError(null);
  }

  const saveM = useMutation({
    mutationFn: () => {
      const payload = draftToPayload(draft);
      return editing
        ? apiJson<Vehicle>(`/vehicles/${editing.id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          })
        : apiJson<Vehicle>("/vehicles", { method: "POST", body: JSON.stringify(payload) });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.vehicles });
      closeForm();
    },
    onError: (e) => setFormError(translateApiError(e, i18n)),
  });

  const deleteM = useMutation({
    mutationFn: (id: string) => apiJson(`/vehicles/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.vehicles });
      setDeleteTarget(null);
    },
  });

  const vehicles = vehiclesQ.data ?? [];

  return (
    <PageContainer>
      <PageHeader
        title={t("vehicles.title")}
        lead={t("vehicles.manageSubtitle")}
        actions={
          <Button
            onClick={() => {
              setDraft(toDraft());
              setFormError(null);
              setCreating(true);
            }}
            icon={<span className="material-symbols-outlined">add_circle</span>}
          >
            {t("vehicles.new")}
          </Button>
        }
      />

      {vehiclesQ.isPending ? (
        <LoadingBlock />
      ) : vehiclesQ.isError ? (
        <ErrorState
          message={translateApiError(vehiclesQ.error, i18n)}
          onRetry={() => vehiclesQ.refetch()}
        />
      ) : vehicles.length === 0 ? (
        <EmptyState icon="directions_car" title={t("common.empty")} body={t("vehicles.manageSubtitle")} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <li
              key={vehicle.id}
              className="flex flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm"
            >
              <p className="font-headline text-base font-semibold text-on-surface">
                {[vehicle.brand, vehicle.model, vehicle.year].filter(Boolean).join(" ") ||
                  vehicle.vin ||
                  t("vehicles.title")}
              </p>
              {vehicle.label ? (
                <p className="mt-0.5 text-xs text-on-surface-variant">{vehicle.label}</p>
              ) : null}
              <dl className="mt-3 space-y-1 text-xs text-on-surface-variant">
                {vehicle.vin ? (
                  <div className="flex gap-2">
                    <dt className="font-bold uppercase tracking-widest">{t("vehicles.vin")}</dt>
                    <dd className="truncate font-mono">{vehicle.vin}</dd>
                  </div>
                ) : null}
                {vehicle.engine ? (
                  <div className="flex gap-2">
                    <dt className="font-bold uppercase tracking-widest">{t("vehicles.engine")}</dt>
                    <dd className="truncate">{vehicle.engine}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="mt-4 flex gap-2 pt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDraft(toDraft(vehicle));
                    setFormError(null);
                    setEditing(vehicle);
                  }}
                >
                  {t("vehicles.edit")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(vehicle)}>
                  {t("common.delete")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={creating || editing !== null}
        onClose={closeForm}
        title={editing ? t("vehicles.edit") : t("vehicles.new")}
      >
        <VehicleForm
          draft={draft}
          onChange={setDraft}
          onSubmit={() => saveM.mutate()}
          submitLabel={t("common.save")}
          loading={saveM.isPending}
          error={formError}
        >
          <Button type="button" variant="ghost" size="lg" onClick={closeForm}>
            {t("common.cancel")}
          </Button>
        </VehicleForm>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteM.mutate(deleteTarget.id)}
        title={t("vehicles.deleteConfirm")}
        confirmLabel={t("common.delete")}
        danger
        loading={deleteM.isPending}
      />
    </PageContainer>
  );
}
