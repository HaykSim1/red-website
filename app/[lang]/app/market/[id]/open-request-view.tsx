"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SellerOnly } from "@/components/app/seller-only";
import { Badge } from "@/components/app/ui/badge";
import { Button } from "@/components/app/ui/button";
import { TextAreaField } from "@/components/app/ui/field";
import { ConfirmDialog, Modal } from "@/components/app/ui/modal";
import { LinkButton } from "@/components/app/ui/link-button";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { PhotoGrid } from "@/components/app/ui/photo-grid";
import { Alert, EmptyState, ErrorState, LoadingBlock } from "@/components/app/ui/states";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import { formatAmd, formatDateTime, offerConditionLabel, offerDeliveryLabel } from "@/lib/app/format";
import { qk } from "@/lib/app/query-keys";
import type { RequestPublic } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

import { SellerDealActions } from "./seller-deal-actions";

export function OpenRequestView({ lang, requestId }: { lang: Locale; requestId: string }) {
  return (
    <SellerOnly>
      <OpenRequestDetail lang={lang} requestId={requestId} />
    </SellerOnly>
  );
}

function OpenRequestDetail({ lang, requestId }: { lang: Locale; requestId: string }) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const [completeOfferId, setCompleteOfferId] = useState<string | null>(null);
  const [cancelOfferId, setCancelOfferId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const requestQ = useQuery({
    queryKey: qk.requestPublic(requestId),
    queryFn: () => apiJson<RequestPublic>(`/requests/${requestId}/public`),
  });

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: qk.requestPublic(requestId) });
    void queryClient.invalidateQueries({ queryKey: ["requests", "open"] });
    void queryClient.invalidateQueries({ queryKey: ["offers", "mine", "history"] });
    void queryClient.invalidateQueries({ queryKey: qk.homeSummary });
  }

  const completeM = useMutation({
    mutationFn: (offerId: string) =>
      apiJson(`/offers/${offerId}/confirm-deal-complete`, { method: "POST" }),
    onSuccess: () => {
      setCompleteOfferId(null);
      setActionError(null);
      invalidate();
    },
    onError: (e) => {
      setCompleteOfferId(null);
      setActionError(translateApiError(e, i18n));
    },
  });

  const cancelM = useMutation({
    mutationFn: ({ offerId, reason }: { offerId: string; reason: string }) =>
      apiJson(`/offers/${offerId}/cancel-accepted-offer`, {
        method: "POST",
        body: JSON.stringify({ cancel_reason: reason }),
      }),
    onSuccess: () => {
      setCancelOfferId(null);
      setCancelReason("");
      setActionError(null);
      invalidate();
    },
    onError: (e) => setCancelError(translateApiError(e, i18n)),
  });

  const acknowledgeM = useMutation({
    mutationFn: (offerId: string) => apiJson(`/offers/${offerId}/acknowledge`, { method: "POST" }),
    onSuccess: invalidate,
    onError: (e) => setActionError(translateApiError(e, i18n)),
  });

  if (requestQ.isPending) {
    return (
      <PageContainer>
        <LoadingBlock rows={4} />
      </PageContainer>
    );
  }

  if (requestQ.isError || !requestQ.data) {
    return (
      <PageContainer>
        <ErrorState
          message={translateApiError(requestQ.error, i18n)}
          onRetry={() => requestQ.refetch()}
        />
      </PageContainer>
    );
  }

  const request = requestQ.data;
  const myOffers = request.my_offers ?? [];
  const busy = completeM.isPending || cancelM.isPending || acknowledgeM.isPending;
  const canOffer = request.status === "open";

  return (
    <PageContainer>
      <PageHeader
        title={t("requests.detailSeller")}
        actions={
          canOffer ? (
            <LinkButton
              href={`/${lang}/app/market/${requestId}/offer`}
              icon={<span className="material-symbols-outlined">add_circle</span>}
            >
              {myOffers.length > 0 ? t("offers.addAnother") : t("offers.submit")}
            </LinkButton>
          ) : undefined
        }
      />

      {actionError ? (
        <div className="mb-4">
          <Alert>{actionError}</Alert>
        </div>
      ) : null}

      <section className="rounded-xl bg-surface-container-lowest p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={request.status === "open" ? "success" : "neutral"}>
            {t(`requests.status_${request.status}`)}
          </Badge>
          {request.buyer_is_special ? (
            <Badge tone="warning">{t("requests.specialBuyerBadge")}</Badge>
          ) : null}
          <span className="text-xs text-on-surface-variant">
            {formatDateTime(request.created_at, lang)}
          </span>
        </div>

        <p className="mt-3 whitespace-pre-wrap text-base text-on-surface">{request.description}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          <Detail label={t("requests.quantity")} value={String(request.quantity ?? 1)} />
          <Detail label={t("requests.city")} value={request.city} />
          <Detail label={t("requests.partNumber")} value={request.part_number} />
          <Detail label={t("requests.vin")} value={request.vin_text} />
          <Detail
            label={t("requests.vehicle")}
            value={
              request.vehicle
                ? [request.vehicle.brand, request.vehicle.model, request.vehicle.year]
                    .filter(Boolean)
                    .join(" ")
                : null
            }
          />
        </dl>

        {request.photos.length > 0 ? <PhotoGrid photos={request.photos} className="mt-5" /> : null}
      </section>

      <section className="mt-8">
        <h3 className="font-headline text-lg font-semibold tracking-tight text-on-surface">
          {t("offers.newTitle")}{" "}
          <span className="text-on-surface-variant">({myOffers.length})</span>
        </h3>

        {myOffers.length === 0 ? (
          <EmptyState icon="local_offer" title={t("requests.sellerNoOwnOffers")} />
        ) : (
          <ul className="mt-4 space-y-3">
            {myOffers.map((offer) => (
              <li
                key={offer.id}
                className={`rounded-xl bg-surface-container-lowest p-4 shadow-sm sm:p-5 ${
                  offer.deal_active ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-headline text-xl font-bold tracking-tight text-on-surface">
                      {formatAmd(offer.price_amount, lang)}
                    </p>
                    {offer.variant_label ? (
                      <p className="mt-0.5 text-xs text-on-surface-variant">{offer.variant_label}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {offer.deal_active ? <Badge tone="success">{t("deal.accepted")}</Badge> : null}
                    <Badge>{offerConditionLabel(offer.condition, t)}</Badge>
                    <Badge tone={offer.delivery === "available" ? "info" : "neutral"}>
                      {offerDeliveryLabel(offer.delivery, t)}
                    </Badge>
                  </div>
                </div>

                {offer.description ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-on-surface-variant">
                    {offer.description}
                  </p>
                ) : null}

                {offer.photos.length > 0 ? (
                  <PhotoGrid photos={offer.photos} className="mt-3" />
                ) : null}

                <div className="mt-4 flex flex-col gap-3 border-t border-outline-variant/20 pt-4">
                  <SellerDealActions
                    offer={offer}
                    busy={busy}
                    onConfirmComplete={() => setCompleteOfferId(offer.id)}
                    onProposeCancel={() => {
                      setCancelError(null);
                      setCancelOfferId(offer.id);
                    }}
                    onAcknowledge={() => acknowledgeM.mutate(offer.id)}
                  />
                  {/* The API refuses edits to an offer with a live deal (400). */}
                  {canOffer && !offer.deal_active ? (
                    <LinkButton
                      href={`/${lang}/app/market/${requestId}/offer?offerId=${offer.id}`}
                      variant="secondary"
                      size="sm"
                      className="self-start"
                    >
                      {t("offers.update")}
                    </LinkButton>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={completeOfferId !== null}
        onClose={() => setCompleteOfferId(null)}
        onConfirm={() => completeOfferId && completeM.mutate(completeOfferId)}
        title={t("requests.confirmCompleteOfferSeller")}
        confirmLabel={t("requests.completeOfferSeller")}
        loading={completeM.isPending}
      />

      <Modal
        open={cancelOfferId !== null}
        onClose={() => setCancelOfferId(null)}
        title={t("requests.cancelDealTitleSeller")}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelOfferId(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="danger"
              loading={cancelM.isPending}
              onClick={() => {
                const reason = cancelReason.trim();
                if (!reason) {
                  setCancelError(t("deal.cancelReasonRequired"));
                  return;
                }
                if (cancelOfferId) cancelM.mutate({ offerId: cancelOfferId, reason });
              }}
            >
              {t("requests.cancelDealSeller")}
            </Button>
          </>
        }
      >
        <p className="mb-4 text-sm text-on-surface-variant">
          {t("requests.confirmCancelDealSeller")}
        </p>
        <TextAreaField
          label={t("requests.cancelReason")}
          placeholder={t("deal.cancelReasonPlaceholder")}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          error={cancelError ?? undefined}
        />
      </Modal>
    </PageContainer>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-on-surface">{value}</dd>
    </div>
  );
}
