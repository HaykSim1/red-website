"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/app/ui/button";
import { Field } from "@/components/app/ui/field";
import { Alert } from "@/components/app/ui/states";
import { VinField } from "@/components/app/ui/vin-field";
import type { Vehicle } from "@/lib/app/types";
import { isValidVinFormat, normalizeVin } from "@/lib/app/vin";

export type VehicleDraft = {
  brand: string;
  model: string;
  year: string;
  engine: string;
  vin: string;
  label: string;
};

export function toDraft(vehicle?: Vehicle | null): VehicleDraft {
  return {
    brand: vehicle?.brand ?? "",
    model: vehicle?.model ?? "",
    year: vehicle?.year ? String(vehicle.year) : "",
    engine: vehicle?.engine ?? "",
    vin: vehicle?.vin ?? "",
    label: vehicle?.label ?? "",
  };
}

/**
 * A vehicle must be identifiable either by VIN alone, or by brand + model + year
 * together (docs/product.md). The API enforces it; checking here saves a round
 * trip and lets us say which half is missing.
 */
export function isIdentifiable(draft: VehicleDraft): boolean {
  const byVin = isValidVinFormat(draft.vin);
  const byTriple = Boolean(draft.brand.trim() && draft.model.trim() && draft.year.trim());
  return byVin || byTriple;
}

export function draftToPayload(draft: VehicleDraft) {
  const vin = normalizeVin(draft.vin);
  return {
    brand: draft.brand.trim() || null,
    model: draft.model.trim() || null,
    year: draft.year ? Number(draft.year) : null,
    engine: draft.engine.trim() || null,
    vin: vin || null,
    label: draft.label.trim() || null,
  };
}

export function VehicleForm({
  draft,
  onChange,
  onSubmit,
  submitLabel,
  loading,
  error,
  children,
}: {
  draft: VehicleDraft;
  onChange: (draft: VehicleDraft) => void;
  onSubmit: () => void;
  submitLabel: string;
  loading: boolean;
  error?: string | null;
  children?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [touched, setTouched] = useState(false);

  const identifiable = isIdentifiable(draft);
  const set = (key: keyof VehicleDraft) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...draft, [key]: e.target.value });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (!identifiable) return;
        onSubmit();
      }}
      className="space-y-5"
    >
      {error ? <Alert>{error}</Alert> : null}

      <VinField
        value={draft.vin}
        onChange={(vin) => onChange({ ...draft, vin })}
        onAutofill={(decoded) =>
          onChange({
            ...draft,
            // Only fill blanks: a lookup must never overwrite something the
            // owner typed themselves, and vPIC's model strings are often
            // coarser than what a person would write.
            brand: draft.brand.trim() || decoded.brand,
            model: draft.model.trim() || decoded.model,
            year: draft.year.trim() || decoded.year,
            engine: draft.engine.trim() || decoded.engine,
          })
        }
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("vehicles.brand")} value={draft.brand} onChange={set("brand")} maxLength={120} />
        <Field label={t("vehicles.model")} value={draft.model} onChange={set("model")} maxLength={120} />
        <Field
          label={t("vehicles.year")}
          type="number"
          min={1900}
          max={2100}
          value={draft.year}
          onChange={set("year")}
        />
        <Field label={t("vehicles.engine")} value={draft.engine} onChange={set("engine")} maxLength={120} />
      </div>

      <Field label={t("vehicles.label")} value={draft.label} onChange={set("label")} maxLength={120} />

      {touched && !identifiable ? (
        <Alert>{`${t("vehicles.vin")} — ${t("vehicles.vinTooShort")}`}</Alert>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" loading={loading}>
          {submitLabel}
        </Button>
        {children}
      </div>
    </form>
  );
}
