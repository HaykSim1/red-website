"use client";

import { useTranslation } from "react-i18next";

import { Badge } from "@/components/app/ui/badge";
import { PhotoGrid } from "@/components/app/ui/photo-grid";
import { formatAmd, offerConditionLabel, offerDeliveryLabel } from "@/lib/app/format";
import type { Offer } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

/**
 * One offer as the buyer sees it.
 *
 * Deliberately renders no seller contact. The product rule is that contact is
 * revealed only after the buyer accepts an offer, and the accepted deal already
 * shows it in DealPanel, sourced from GET /requests/:id/selection. Note that the
 * `seller_identity_hidden` flag on OfferDto currently comes back `false` even for
 * un-accepted offers — the API withholds contact by nulling seller_phone and
 * seller_telegram instead — so trusting that flag here would have been wrong.
 */
export function OfferCard({
  lang,
  offer,
  accepted = false,
  dimmed = false,
  actions,
}: {
  lang: Locale;
  offer: Offer;
  accepted?: boolean;
  dimmed?: boolean;
  actions?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const seller = offer.seller;

  return (
    <li
      className={[
        "rounded-xl bg-surface-container-lowest p-4 shadow-sm sm:p-5",
        accepted ? "ring-2 ring-primary" : "",
        dimmed ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-headline text-xl font-bold tracking-tight text-on-surface">
            {formatAmd(offer.price_amount, lang)}
          </p>
          {offer.variant_label ? (
            <p className="mt-0.5 text-xs text-on-surface-variant">{offer.variant_label}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {accepted ? <Badge tone="success">{t("deal.accepted")}</Badge> : null}
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

      {offer.photos.length > 0 ? <PhotoGrid photos={offer.photos} className="mt-3" /> : null}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-outline-variant/20 pt-3">
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
          storefront
        </span>
        <span className="text-sm font-medium text-on-surface">
          {seller?.shop_name || seller?.display_name || t("requests.unknownSeller")}
        </span>
        {seller?.rating_count ? (
          <span className="text-xs text-on-surface-variant">
            <span className="material-symbols-outlined align-middle text-[14px] text-primary">
              star
            </span>{" "}
            {seller.rating_avg?.toFixed(1)} ({seller.rating_count})
          </span>
        ) : null}
      </div>

      {actions ? <div className="mt-4 flex flex-col gap-2 sm:flex-row">{actions}</div> : null}
    </li>
  );
}
