"use client";

import { useTranslation } from "react-i18next";

import { ContactLinks } from "@/components/app/contact-links";
import { Badge } from "@/components/app/ui/badge";
import { PhotoGrid } from "@/components/app/ui/photo-grid";
import { formatAmd, offerConditionLabel, offerDeliveryLabel } from "@/lib/app/format";
import type { Offer } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

/**
 * One offer as the buyer sees it.
 *
 * Seller contact is shown immediately, on every offer, matching the mobile card
 * (`mobile/components/ui/StitchedOfferCard.tsx`) — a deliberate product choice to
 * keep the two clients identical rather than have the web ask for an extra step
 * the app does not.
 *
 * This is not a gate that was removed: the API returns `seller_phone` and
 * `seller_telegram` on every offer regardless of acceptance, so withholding them
 * here only ever hid them from the screen, not from the response. If contact is
 * to be earned by accepting, that has to be enforced in `serializeOffer()` — see
 * docs/decisions.md D-018.
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

      {/* The accepted offer's contact is already in the deal panel directly above,
          together with the actions — showing it twice on one screen is noise.
          Mobile has no such panel, which is why every card carries it there. */}
      {accepted ? null : (
        <ContactLinks
          phone={seller?.seller_phone}
          telegram={seller?.seller_telegram}
          emptyBehaviour="hide"
          className="mt-3"
        />
      )}

      {actions ? <div className="mt-4 flex flex-col gap-2 sm:flex-row">{actions}</div> : null}
    </li>
  );
}
