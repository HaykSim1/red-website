"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import { useMediaUrl } from "@/components/app/media-config-context";
import { SellerOnly } from "@/components/app/seller-only";
import { Button } from "@/components/app/ui/button";
import { Field, SelectField, TextAreaField } from "@/components/app/ui/field";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { PhotoPicker, type PickedPhoto } from "@/components/app/ui/photo-picker";
import { Alert, ErrorState, LoadingBlock } from "@/components/app/ui/states";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import { qk } from "@/lib/app/query-keys";
import type { RequestPublic } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

export function OfferEditor({ lang, requestId }: { lang: Locale; requestId: string }) {
  return (
    <SellerOnly>
      {/* useSearchParams needs a Suspense boundary during prerender. */}
      <Suspense
        fallback={
          <PageContainer>
            <LoadingBlock rows={3} />
          </PageContainer>
        }
      >
        <OfferForm lang={lang} requestId={requestId} />
      </Suspense>
    </SellerOnly>
  );
}

function OfferForm({ lang, requestId }: { lang: Locale; requestId: string }) {
  const { t, i18n } = useTranslation();
  const offerId = useSearchParams().get("offerId");

  const requestQ = useQuery({
    queryKey: qk.requestPublic(requestId),
    queryFn: () => apiJson<RequestPublic>(`/requests/${requestId}/public`),
  });

  const existing = offerId ? requestQ.data?.my_offers?.find((o) => o.id === offerId) : undefined;

  if (requestQ.isPending) {
    return (
      <PageContainer>
        <LoadingBlock rows={3} />
      </PageContainer>
    );
  }

  if (requestQ.isError) {
    return (
      <PageContainer>
        <ErrorState
          message={translateApiError(requestQ.error, i18n)}
          onRetry={() => requestQ.refetch()}
        />
      </PageContainer>
    );
  }

  if (offerId && !existing) {
    return (
      <PageContainer>
        <Alert>{t("offers.offerNotFound")}</Alert>
      </PageContainer>
    );
  }

  // Keyed on the offer being edited (or "new"), so the fields below seed
  // themselves from useState initialisers instead of an effect that would fight
  // a background refetch for control of the form.
  return (
    <OfferFields
      key={offerId ?? "new"}
      lang={lang}
      requestId={requestId}
      offerId={offerId}
      existing={existing}
      requestDescription={requestQ.data?.description}
    />
  );
}

type MyOffer = NonNullable<RequestPublic["my_offers"]>[number];

function OfferFields({
  lang,
  requestId,
  offerId,
  existing,
  requestDescription,
}: {
  lang: Locale;
  requestId: string;
  offerId: string | null;
  existing?: MyOffer;
  requestDescription?: string;
}) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const mediaUrl = useMediaUrl();

  const [price, setPrice] = useState(existing ? String(Number(existing.price_amount)) : "");
  const [condition, setCondition] = useState(existing?.condition ?? "used");
  const [delivery, setDelivery] = useState(existing?.delivery ?? "available");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [variantLabel, setVariantLabel] = useState(existing?.variant_label ?? "");
  const [photos, setPhotos] = useState<PickedPhoto[]>(() =>
    (existing?.photos ?? []).map((p) => ({
      storageKey: p.storage_key,
      previewUrl: mediaUrl(p.storage_key) ?? "",
    })),
  );
  const [error, setError] = useState<string | null>(null);

  const saveM = useMutation({
    mutationFn: () => {
      const body = JSON.stringify({
        price_amount: Number(price),
        condition,
        delivery,
        description: description.trim(),
        ...(variantLabel.trim() ? { variant_label: variantLabel.trim() } : {}),
        photo_storage_keys: photos.map((p) => p.storageKey),
      });
      return offerId
        ? apiJson(`/offers/${offerId}`, { method: "PATCH", body })
        : apiJson(`/requests/${requestId}/offers`, { method: "POST", body });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.requestPublic(requestId) });
      void queryClient.invalidateQueries({ queryKey: ["requests", "open"] });
      void queryClient.invalidateQueries({ queryKey: qk.homeSummary });
      router.replace(`/${lang}/app/market/${requestId}`);
    },
    onError: (e) => setError(translateApiError(e, i18n)),
  });

  const priceValid = price.trim() !== "" && Number(price) >= 0;

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader
        title={offerId ? t("offers.editTitle") : t("offers.newTitle")}
        lead={requestDescription}
      />

      {error ? (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      ) : null}

      <form
        noValidate
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!priceValid || !description.trim()) return;
          setError(null);
          saveM.mutate();
        }}
      >
        <Field
          label={t("offers.price")}
          type="number"
          min={0}
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label={t("offers.condition")}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="new">{t("offers.condition_new")}</option>
            <option value="used">{t("offers.condition_used")}</option>
          </SelectField>

          <SelectField
            label={t("offers.delivery")}
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
          >
            <option value="available">{t("offers.delivery_available")}</option>
            <option value="pickup_only">{t("offers.delivery_pickup")}</option>
          </SelectField>
        </div>

        <TextAreaField
          label={t("offers.description")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={4000}
          required
        />

        <Field
          label={t("offers.variantLabel")}
          value={variantLabel}
          onChange={(e) => setVariantLabel(e.target.value)}
          maxLength={120}
        />

        <div>
          <p className="mb-3 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant">
            {t("requests.photos")}
          </p>
          <PhotoPicker purpose="offer_photo" photos={photos} onChange={setPhotos} />
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={saveM.isPending}
          disabled={!priceValid || !description.trim()}
        >
          {offerId ? t("offers.update") : t("offers.submit")}
        </Button>
      </form>
    </PageContainer>
  );
}
