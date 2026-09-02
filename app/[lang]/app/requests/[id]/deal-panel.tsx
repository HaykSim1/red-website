"use client";

import { useTranslation } from "react-i18next";

import { ContactLinks } from "@/components/app/contact-links";
import { Button } from "@/components/app/ui/button";
import type { SelectionResponse } from "@/lib/app/types";

/**
 * The buyer half of the two-phase deal, which only ever existed server-side.
 *
 * Completion and cancellation are both mutual: the request closes when buyer and
 * seller have each confirmed, and the deal is cancelled when each has submitted
 * a reason. The API refuses to start one while the other is in progress
 * (`deal_action_conflict`), so the panel offers exactly one path at a time.
 */
export function DealPanel({
  selection,
  onMarkComplete,
  onProposeCancel,
  onRateSeller,
  busy,
}: {
  selection: SelectionResponse;
  onMarkComplete: () => void;
  onProposeCancel: () => void;
  onRateSeller?: () => void;
  busy: boolean;
}) {
  const { t } = useTranslation();

  const cancelInProgress = selection.buyer_marked_cancel || selection.seller_marked_cancel;
  const completeInProgress = selection.buyer_marked_complete || selection.seller_marked_complete;

  // Finalised deals come back as non-provisional. The seller's contact stays on
  // screen — the buyer may still need to reach them after the request closes —
  // and rating is the one action left.
  if (selection.provisional === false) {
    return (
      <section className="rounded-xl bg-surface-container-lowest p-4 shadow-sm sm:p-5">
        <p className="text-sm font-medium text-on-verified">
          <span className="material-symbols-outlined mr-1 align-middle text-[18px]">
            check_circle
          </span>
          {t("deal.dealClosed")}
        </p>

        <div className="mt-4 rounded-lg bg-surface-container-low p-3">
          <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant">
            {t("deal.sellerContact")}
          </p>
          <ContactLinks
            phone={selection.seller_contact?.seller_phone}
            telegram={selection.seller_contact?.seller_telegram}
          />
        </div>

        {onRateSeller ? (
          <Button variant="secondary" className="mt-4" onClick={onRateSeller}>
            {t("deal.rateSeller")}
          </Button>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-surface-container-lowest p-4 shadow-sm sm:p-5">
      <p className="text-sm text-on-surface-variant">
        {cancelInProgress
          ? selection.buyer_marked_cancel
            ? t("deal.waitingSellerCancel")
            : t("deal.sellerProposedCancel")
          : selection.buyer_marked_complete
            ? t("deal.waitingSellerComplete")
            : selection.seller_marked_complete
              ? t("deal.waitingYourComplete")
              : t("deal.activeBannerBuyer")}
      </p>

      <div className="mt-4 rounded-lg bg-surface-container-low p-3">
        <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant">
          {t("deal.sellerContact")}
        </p>
        <ContactLinks
          phone={selection.seller_contact?.seller_phone}
          telegram={selection.seller_contact?.seller_telegram}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {!cancelInProgress ? (
          <Button onClick={onMarkComplete} disabled={busy || selection.buyer_marked_complete}>
            {t("deal.markComplete")}
          </Button>
        ) : null}
        {!completeInProgress ? (
          <Button
            variant="secondary"
            onClick={onProposeCancel}
            disabled={busy || selection.buyer_marked_cancel}
          >
            {t("deal.proposeCancel")}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
