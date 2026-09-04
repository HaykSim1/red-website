"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { OfferCard } from "@/components/app/offer-card";
import { RateSellerModal } from "@/components/app/rate-seller-modal";
import { Badge } from "@/components/app/ui/badge";
import { Button } from "@/components/app/ui/button";
import { TextAreaField } from "@/components/app/ui/field";
import { ConfirmDialog, Modal } from "@/components/app/ui/modal";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { PhotoGrid } from "@/components/app/ui/photo-grid";
import { Alert, EmptyState, ErrorState, LoadingBlock } from "@/components/app/ui/states";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import { formatDateTime } from "@/lib/app/format";
import { qk } from "@/lib/app/query-keys";
import type { RequestAuthorDetail, SelectionResponse } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

import { DealPanel } from "./deal-panel";

export function RequestDetailView({ lang, requestId }: { lang: Locale; requestId: string }) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const [confirmComplete, setConfirmComplete] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showOthers, setShowOthers] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [rateOpen, setRateOpen] = useState(false);

  const requestQ = useQuery({
    queryKey: qk.requestAuthor(requestId, false),
    queryFn: () => apiJson<RequestAuthorDetail>(`/requests/${requestId}?include_hidden=false`),
  });

  const request = requestQ.data;
  const activeOfferId = request?.active_acceptance_offer_id ?? null;

  // Before any acceptance the endpoint 404s, so only ask once there is a deal —
  // but keep asking after the request closes: finalising clears
  // active_acceptance_offer_id, and the selection is the only remaining record of
  // which offer won and how to reach the seller.
  const selectionQ = useQuery({
    queryKey: qk.selection(requestId),
    queryFn: () => apiJson<SelectionResponse>(`/requests/${requestId}/selection`),
    enabled: Boolean(activeOfferId) || request?.status === "closed",
    retry: false,
  });
  const selection = selectionQ.data ?? null;

  function invalidateAll() {
    void queryClient.invalidateQueries({ queryKey: ["requests"] });
    void queryClient.invalidateQueries({ queryKey: qk.selection(requestId) });
    void queryClient.invalidateQueries({ queryKey: qk.homeSummary });
  }

  const completeM = useMutation({
    mutationFn: () =>
      apiJson(`/requests/${requestId}/selection`, {
        method: "POST",
        body: JSON.stringify({ offer_id: activeOfferId }),
      }),
    onSuccess: () => {
      setConfirmComplete(false);
      setActionError(null);
      invalidateAll();
    },
    onError: (e) => {
      setConfirmComplete(false);
      setActionError(translateApiError(e, i18n));
    },
  });

  const cancelM = useMutation({
    mutationFn: (reason: string) =>
      apiJson(`/requests/${requestId}/cancel-accepted-offer`, {
        method: "POST",
        body: JSON.stringify({ cancel_reason: reason }),
      }),
    onSuccess: () => {
      setCancelOpen(false);
      setCancelReason("");
      setActionError(null);
      invalidateAll();
    },
    onError: (e) => setCancelError(translateApiError(e, i18n)),
  });

  const cancelRequestM = useMutation({
    mutationFn: () =>
      apiJson(`/requests/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "cancelled" }),
      }),
    onSuccess: invalidateAll,
    onError: (e) => setActionError(translateApiError(e, i18n)),
  });
  const [confirmCancelRequest, setConfirmCancelRequest] = useState(false);

  if (requestQ.isPending) {
    return (
      <PageContainer>
        <LoadingBlock rows={4} />
      </PageContainer>
    );
  }

  if (requestQ.isError || !request) {
    return (
      <PageContainer>
        <ErrorState
          message={translateApiError(requestQ.error, i18n)}
          onRetry={() => requestQ.refetch()}
        />
      </PageContainer>
    );
  }

  const offers = request.offers ?? [];
  const dealOfferId = activeOfferId ?? selection?.offer_id ?? null;
  const acceptedOffer = offers.find((o) => o.id === dealOfferId) ?? null;
  const otherOffers = dealOfferId ? offers.filter((o) => o.id !== dealOfferId) : offers;
  const busy = completeM.isPending || cancelM.isPending;

  return (
    <PageContainer>
      <PageHeader
        title={t("requests.detailBuyer")}
        actions={
          request.status === "open" && !activeOfferId ? (
            <Button
              variant="secondary"
              onClick={() => setConfirmCancelRequest(true)}
              loading={cancelRequestM.isPending}
            >
              {t("requests.cancelRequest")}
            </Button>
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

      {/* Nothing in either client creates a deal any more — the Accept action was
          removed so the web matches mobile. This panel therefore only ever renders for
          deals accepted before that change, so the two parties can still finish or
          cancel them instead of being stranded mid-transaction. Once none are left in
          the wild, DealPanel and its mutations can go too. */}
      {selection ? (
        <div className="mt-6">
          <DealPanel
            selection={selection}
            busy={busy}
            onMarkComplete={() => setConfirmComplete(true)}
            onProposeCancel={() => {
              setCancelError(null);
              setCancelOpen(true);
            }}
            onRateSeller={acceptedOffer ? () => setRateOpen(true) : undefined}
          />
        </div>
      ) : null}

      <section className="mt-8">
        <h3 className="font-headline text-lg font-semibold tracking-tight text-on-surface">
          {t("requests.offers")}{" "}
          <span className="text-on-surface-variant">({offers.length})</span>
        </h3>

        {offers.length === 0 ? (
          <EmptyState icon="local_offer" title={t("requests.noOffers")} />
        ) : (
          <ul className="mt-4 space-y-3">
            {acceptedOffer ? <OfferCard lang={lang} offer={acceptedOffer} accepted /> : null}

            {/* After acceptance the losing offers are collapsed but never removed —
                docs/product.md requires a "show other offers" affordance. */}
            {acceptedOffer && otherOffers.length > 0 ? (
              <li>
                <button
                  type="button"
                  onClick={() => setShowOthers((v) => !v)}
                  className="cursor-pointer text-sm font-semibold text-primary"
                >
                  {showOthers
                    ? t("deal.hideOtherOffers")
                    : `${t("deal.showOtherOffers")} (${otherOffers.length})`}
                </button>
              </li>
            ) : null}

            {(!acceptedOffer || showOthers) &&
              otherOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  lang={lang}
                  offer={offer}
                  dimmed={Boolean(acceptedOffer)}
                />
              ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={confirmComplete}
        onClose={() => setConfirmComplete(false)}
        onConfirm={() => completeM.mutate()}
        title={t("deal.markCompleteTitle")}
        body={t("deal.markCompleteBody")}
        confirmLabel={t("deal.markComplete")}
        loading={completeM.isPending}
      />

      <ConfirmDialog
        open={confirmCancelRequest}
        onClose={() => setConfirmCancelRequest(false)}
        onConfirm={() => {
          setConfirmCancelRequest(false);
          cancelRequestM.mutate();
        }}
        title={t("requests.confirmCancel")}
        confirmLabel={t("requests.cancelRequest")}
        danger
        loading={cancelRequestM.isPending}
      />

      {acceptedOffer?.seller?.id ? (
        <RateSellerModal
          open={rateOpen}
          onClose={() => setRateOpen(false)}
          sellerId={acceptedOffer.seller.id}
        />
      ) : null}

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title={t("deal.proposeCancelTitle")}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>
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
                cancelM.mutate(reason);
              }}
            >
              {t("deal.proposeCancel")}
            </Button>
          </>
        }
      >
        <p className="mb-4 text-sm text-on-surface-variant">{t("deal.proposeCancelBody")}</p>
        <TextAreaField
          label={t("deal.cancelReasonLabel")}
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
