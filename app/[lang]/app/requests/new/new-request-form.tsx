"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { decodeVinFromVpic, type VpicDecodeOk } from "@/lib/app/vpic-decode-vin";
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

  /**
   * Decoded in the background, never shown. A VIN typed here that is not already
   * one of the saved vehicles gets turned into one after the request is created,
   * and this is what fills in its brand/model/year/engine. Failure is silent:
   * the lookup is a convenience, and the request must not depend on it.
   *
   * The result is stored with the VIN it came from, so a decode that lands after
   * the user has edited the field can never be attributed to the new VIN.
   */
  const [decoded, setDecoded] = useState<{ vin: string; data: VpicDecodeOk } | null>(null);

  useEffect(() => {
    // 11 characters is enough for the WMI + VDS that identify make and model;
    // waiting for all 17 would miss partially-typed VINs the service can still
    // resolve. Same threshold as the mobile screen.
    if (vinNormalized.length < 11) return;
    let cancelled = false;
    void decodeVinFromVpic(vinNormalized).then((result) => {
      if (cancelled) return;
      setDecoded(result.ok ? { vin: vinNormalized, data: result } : null);
    });
    return () => {
      cancelled = true;
    };
  }, [vinNormalized]);

  /** Only trust a decode that belongs to the VIN currently in the field. */
  const decodedForVin = decoded?.vin === vinNormalized ? decoded.data : null;

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

      // Save a VIN the user typed by hand as a vehicle, so the next request can
      // just pick it. Skipped when it merely repeats the vehicle they selected.
      const selectedVin = vehiclesQ.data?.find((v) => v.id === vehicleId)?.vin ?? "";
      if (vinNormalized && vinNormalized !== normalizeVin(selectedVin)) {
        void apiJson("/vehicles", {
          method: "POST",
          body: JSON.stringify({
            vin: vinNormalized,
            brand: decodedForVin?.brand || null,
            model: decodedForVin?.model || null,
            year: decodedForVin?.year ? Number(decodedForVin.year) : null,
            engine: decodedForVin?.engine || null,
          }),
        })
          .then(() => queryClient.invalidateQueries({ queryKey: qk.vehicles }))
          // Best effort: the request is already created and is what the user
          // came for. A duplicate or rejected vehicle must not surface as an error.
          .catch(() => {});
      }

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
