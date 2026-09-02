"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ContactLinks } from "@/components/app/contact-links";
import { RateSellerModal } from "@/components/app/rate-seller-modal";
import { useMediaUrl } from "@/components/app/media-config-context";
import { Badge } from "@/components/app/ui/badge";
import { Button } from "@/components/app/ui/button";
import { PageContainer } from "@/components/app/ui/page";
import { Stars } from "@/components/app/ui/star-rating";
import { Alert, EmptyState, ErrorState, LoadingBlock } from "@/components/app/ui/states";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import { formatDateTime } from "@/lib/app/format";
import type { ShopDetailResponse } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

export function ShopDetailView({ lang, shopId }: { lang: Locale; shopId: string }) {
  const { t, i18n } = useTranslation();
  const mediaUrl = useMediaUrl();

  const [reviewOpen, setReviewOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const shopQ = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => apiJson<ShopDetailResponse>(`/shops/${shopId}`),
  });

  if (shopQ.isPending) {
    return (
      <PageContainer>
        <LoadingBlock rows={3} />
      </PageContainer>
    );
  }

  if (shopQ.isError || !shopQ.data) {
    return (
      <PageContainer>
        <ErrorState message={translateApiError(shopQ.error, i18n)} onRetry={() => shopQ.refetch()} />
      </PageContainer>
    );
  }

  const shop = shopQ.data;
  const logo = mediaUrl(shop.shop_logo_storage_key);
  const reviews = shop.reviews ?? [];

  return (
    <PageContainer>
      <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-container-high">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant/40">storefront</span>
            )}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
                {shop.shop_name}
              </h2>
              {shop.is_featured ? <Badge tone="success">{t("shop.verifiedShop")}</Badge> : null}
            </div>

            <div className="mt-2 flex items-center gap-2">
              {shop.rating_count > 0 ? (
                <>
                  <Stars score={shop.rating_avg ?? 0} />
                  <span className="text-sm text-on-surface-variant">
                    {shop.rating_avg?.toFixed(1)} · {t("home.featuredReviewCount", { count: shop.rating_count })}
                  </span>
                </>
              ) : (
                <span className="text-sm text-on-surface-variant">{t("home.shopNoRating")}</span>
              )}
            </div>

            {shop.description ? (
              <p className="mt-3 text-sm text-on-surface-variant">{shop.description}</p>
            ) : null}
          </div>

          <Button
            variant="secondary"
            onClick={() => setReviewOpen(true)}
          >
            {t("shop.writeReview")}
          </Button>
        </div>

        <div className="mt-5 grid gap-4 border-t border-outline-variant/20 pt-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant">
              {t("shop.phoneLabel")}
            </p>
            <ContactLinks phone={shop.seller_phone} telegram={shop.seller_telegram} />
          </div>
          <div>
            <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant">
              {t("shop.locationLabel")}
            </p>
            {shop.shop_address ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.shop_address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-on-surface hover:underline"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">place</span>
                {shop.shop_address}
              </a>
            ) : (
              <p className="text-sm text-on-surface-variant">{t("shop.locationUnknown")}</p>
            )}
          </div>
        </div>
      </section>

      {submitted ? (
        <div className="mt-4">
          <Alert tone="info">{t("shop.reviewSubmitted")}</Alert>
        </div>
      ) : null}

      <section className="mt-8">
        <h3 className="font-headline text-lg font-semibold tracking-tight text-on-surface">
          {t("shop.reviews")}
        </h3>
        {reviews.length === 0 ? (
          <EmptyState icon="reviews" title={t("shop.noReviews")} />
        ) : (
          <ul className="mt-4 space-y-3">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Stars score={review.score} size={14} />
                  <span className="text-sm font-medium text-on-surface">
                    {review.rater_name || t("shop.reviewerAnonymous")}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {formatDateTime(review.created_at, lang)}
                  </span>
                </div>
                {review.comment ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-on-surface-variant">
                    {review.comment}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <RateSellerModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        sellerId={shopId}
        onRated={() => setSubmitted(true)}
      />
    </PageContainer>
  );
}
