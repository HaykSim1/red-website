"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/app/ui/button";
import { Field, SelectField, TextAreaField } from "@/components/app/ui/field";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { PhotoPicker, type PickedPhoto } from "@/components/app/ui/photo-picker";
import { Alert } from "@/components/app/ui/states";
import { apiJson } from "@/lib/app/api-client";
import { ARMENIAN_CITIES } from "@/lib/app/cities";
import { translateApiError } from "@/lib/app/error-msg";
import { qk } from "@/lib/app/query-keys";
import type { RequestListItem, Vehicle } from "@/lib/app/types";
import { isValidVinFormat, normalizeVin } from "@/lib/app/vin";
import type { Locale } from "@/lib/i18n";

export function NewRequestForm({ lang }: { lang: Locale }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [city, setCity] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [vin, setVin] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const vehiclesQ = useQuery({
    queryKey: qk.vehicles,
    queryFn: () => apiJson<Vehicle[]>("/vehicles"),
  });

  const vinNormalized = normalizeVin(vin);
  const vinLooksWrong = vinNormalized.length > 0 && !isValidVinFormat(vinNormalized);

  const createM = useMutation({
    mutationFn: () =>
      apiJson<RequestListItem>("/requests", {
        method: "POST",
        body: JSON.stringify({
          description: description.trim(),
          quantity,
          ...(city ? { city } : {}),
          ...(vehicleId ? { vehicle_id: vehicleId } : {}),
          ...(vinNormalized ? { vin_text: vinNormalized } : {}),
          ...(partNumber.trim() ? { part_number: partNumber.trim() } : {}),
          ...(photos.length > 0
            ? { photo_storage_keys: photos.map((p) => p.storageKey) }
            : {}),
        }),
      }),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: ["requests"] });
      void queryClient.invalidateQueries({ queryKey: qk.homeSummary });
      router.replace(`/${lang}/app/requests/${created.id}`);
    },
    onError: (e) => setError(translateApiError(e, i18n)),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) {
      setDescriptionError(t("requests.descriptionPlaceholder"));
      return;
    }
    setDescriptionError(null);
    setError(null);
    createM.mutate();
  }

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader title={t("requests.newRequest")} lead={t("requests.newRequestSubtitle")} />

      {error ? (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <TextAreaField
          label={t("requests.description")}
          placeholder={t("requests.descriptionPlaceholder")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={descriptionError ?? undefined}
          maxLength={4000}
          rows={5}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("requests.quantity")}
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          />

          <SelectField
            label={t("requests.city")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">{t("requests.cityPlaceholder")}</option>
            {ARMENIAN_CITIES.map((entry) => (
              <option key={entry.key} value={entry[lang]}>
                {entry[lang]}
              </option>
            ))}
          </SelectField>
        </div>

        <SelectField
          label={t("requests.vehicle")}
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          disabled={vehiclesQ.isPending}
        >
          <option value="">{t("requests.noVehicle")}</option>
          {(vehiclesQ.data ?? []).map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {[vehicle.brand, vehicle.model, vehicle.year].filter(Boolean).join(" ") ||
                vehicle.vin ||
                vehicle.id}
            </option>
          ))}
        </SelectField>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("requests.vin")}
            placeholder={t("vehicles.vinPlaceholder")}
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            maxLength={32}
            error={vinLooksWrong ? t("vehicles.vinTooShort") : undefined}
          />
          <Field
            label={t("requests.partNumber")}
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            maxLength={120}
          />
        </div>

        <div>
          <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant">
            {t("requests.photos")}
          </p>
          <p className="mb-3 text-xs text-on-surface-variant">{t("requests.photoHint")}</p>
          <PhotoPicker purpose="request_photo" photos={photos} onChange={setPhotos} />
        </div>

        <Button type="submit" size="lg" fullWidth loading={createM.isPending}>
          {t("requests.publish")}
        </Button>
      </form>
    </PageContainer>
  );
}
