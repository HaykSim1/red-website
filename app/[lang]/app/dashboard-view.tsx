"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useMediaUrl } from "@/components/app/media-config-context";
import { LinkButton } from "@/components/app/ui/link-button";
import { PageContainer } from "@/components/app/ui/page";
import { Skeleton } from "@/components/app/ui/states";
import { StatTile } from "@/components/app/ui/stat-tile";
import { useMe } from "@/hooks/app/use-me";
import { apiJson } from "@/lib/app/api-client";
import { qk } from "@/lib/app/query-keys";
import type {
  FeaturedShopItem,
  HomeBannerListResponse,
  HomeSummaryResponse,
  Vehicle,
} from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

import { BannerCarousel } from "./banner-carousel";

export function DashboardView({ lang }: { lang: Locale }) {
  const { t } = useTranslation();
  const { isSeller } = useMe();

  const summaryQ = useQuery({
    queryKey: qk.homeSummary,
    queryFn: () => apiJson<HomeSummaryResponse>("/home/summary"),
  });
  const vehiclesQ = useQuery({
    queryKey: qk.vehicles,
    queryFn: () => apiJson<Vehicle[]>("/vehicles"),
  });
  const bannersQ = useQuery({
    queryKey: ["home", "banners"],
    queryFn: () => apiJson<HomeBannerListResponse>("/home/banners"),
  });
  const shopsQ = useQuery({
    queryKey: ["shops", "featured"],
    queryFn: () => apiJson<FeaturedShopItem[]>("/shops/featured"),
  });

  const summary = summaryQ.data;
  // The counter deep-links to the request holding the newest untouched offer,
  // exactly like the mobile tile; without one it falls back to the list.
  const pendingHref = summary?.latest_pending_offer_request_id
    ? `/${lang}/app/requests/${summary.latest_pending_offer_request_id}`
    : `/${lang}/app/requests`;

  return (
    <PageContainer>
      <BannerCarousel items={bannersQ.data?.items ?? []} loading={bannersQ.isLoading} />

      <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile
          label={t("home.statOpenRequests")}
          value={summaryQ.isLoading ? "—" : (summary?.my_open_requests_count ?? 0)}
          icon="list_alt"
          href={`/${lang}/app/requests`}
        />
        <StatTile
          label={t("home.statPendingOffers")}
          value={summaryQ.isLoading ? "—" : (summary?.pending_offers_on_my_requests ?? 0)}
          icon="local_offer"
          href={pendingHref}
        />
        <StatTile
          label={t("home.statSavedCars")}
          value={vehiclesQ.isLoading ? "—" : (vehiclesQ.data?.length ?? 0)}
          icon="directions_car"
          href={`/${lang}/app/vehicles`}
        />
        {isSeller ? (
          <StatTile
            label={t("home.statMyOffersMarket")}
            value={summaryQ.isLoading ? "—" : (summary?.my_open_offers_count ?? 0)}
            icon="storefront"
            href={`/${lang}/app/market`}
          />
        ) : null}
      </section>

      <FeaturedShops lang={lang} shops={shopsQ.data ?? []} loading={shopsQ.isLoading} />

      <section className="mt-8 overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-sm sm:p-8">
        <h3 className="font-headline text-lg font-bold tracking-tight text-on-surface sm:text-xl">
          {t("home.ctaTitle")}
        </h3>
        <p className="mt-2 max-w-md text-sm text-on-surface-variant">{t("home.ctaBody")}</p>
        <LinkButton
          href={`/${lang}/app/requests/new`}
          className="mt-6"
          size="lg"
          icon={<span className="material-symbols-outlined">add_circle</span>}
        >
          {t("home.ctaButton")}
        </LinkButton>
      </section>
    </PageContainer>
  );
}

function FeaturedShops({
  lang,
  shops,
  loading,
}: {
  lang: Locale;
  shops: FeaturedShopItem[];
  loading: boolean;
}) {
  const { t } = useTranslation();
  const mediaUrl = useMediaUrl();

  if (loading) {
    return (
      <section className="mt-8">
        <Skeleton className="h-6 w-40" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </section>
    );
  }

  if (shops.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="font-headline text-lg font-semibold tracking-tight text-on-surface">
        {t("home.featuredShops")}
      </h3>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shops.map((shop) => {
          const logo = mediaUrl(shop.shop_logo_storage_key);
          return (
            <li key={shop.id}>
              <Link
                href={`/${lang}/app/shops/${shop.id}`}
                className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-surface-container-high">
                  {logo ? (
                    // Storage hosts vary by deployment, so next/image optimisation
                    // is not worth the remotePatterns coupling here.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant/40">
                      storefront
                    </span>
                  )}
                </span>
                <span className="mt-3 line-clamp-2 text-sm font-semibold text-on-surface">
                  {shop.shop_name}
                </span>
                <span className="mt-auto pt-2 text-xs text-on-surface-variant">
                  {shop.rating_count > 0 ? (
                    <>
                      <span className="material-symbols-outlined align-middle text-[14px] text-primary">
                        star
                      </span>{" "}
                      {shop.rating_avg?.toFixed(1)} ·{" "}
                      {t("home.featuredReviewCount", { count: shop.rating_count })}
                    </>
                  ) : (
                    t("home.shopNoRating")
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
