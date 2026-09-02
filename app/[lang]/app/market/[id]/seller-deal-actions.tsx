"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/app/ui/button";
import type { RequestPublic } from "@/lib/app/types";

type MyOffer = NonNullable<RequestPublic["my_offers"]>[number];

/**
 * The seller half of the deal, mirroring mobile's open-request screen.
 *
 * A deal only ends when both parties agree: completion needs both confirmations,
 * and cancellation needs a reason from each side. The API rejects starting one
 * while the other is under way (`deal_action_conflict`), so only one path is
 * offered at a time.
 */
export function SellerDealActions({
  offer,
  onConfirmComplete,
  onProposeCancel,
  onAcknowledge,
  busy,
}: {
  offer: MyOffer;
  onConfirmComplete: () => void;
  onProposeCancel: () => void;
  onAcknowledge: () => void;
  busy: boolean;
}) {
  const { t } = useTranslation();

  // Legacy single-party cancel: the buyer cancelled before mutual cancel existed,
  // and the row waits on a seller acknowledgement.
  if (offer.buyer_cancel_pending_ack) {
    return (
      <Button variant="secondary" onClick={onAcknowledge} disabled={busy}>
        {t("requests.acknowledgeCancel")}
      </Button>
    );
  }

  if (!offer.deal_active) return null;

  const cancelInProgress = offer.buyer_marked_cancel || offer.seller_marked_cancel;
  const completeInProgress = offer.buyer_marked_complete || offer.seller_marked_complete;

  return (
    <div className="w-full">
      <p className="mb-3 text-sm text-on-surface-variant">
        {cancelInProgress
          ? offer.seller_marked_cancel
            ? t("requests.waitingBuyerCancelReason")
            : t("requests.buyerProposedCancelSeller")
          : offer.seller_marked_complete
            ? t("requests.waitingBuyerComplete")
            : t("requests.dealActiveSellerBanner")}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        {!cancelInProgress ? (
          <Button onClick={onConfirmComplete} disabled={busy || offer.seller_marked_complete}>
            {t("requests.completeOfferSeller")}
          </Button>
        ) : null}
        {!completeInProgress ? (
          <Button
            variant="secondary"
            onClick={onProposeCancel}
            disabled={busy || offer.seller_marked_cancel}
          >
            {t("requests.cancelDealSeller")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
