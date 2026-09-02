"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { useMediaUrl } from "@/components/app/media-config-context";
import { SellerOnly } from "@/components/app/seller-only";
import { Badge } from "@/components/app/ui/badge";
import { InfiniteList } from "@/components/app/ui/infinite-list";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/app/ui/states";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import { formatDateTime } from "@/lib/app/format";
import type { Paginated, RequestListItem } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

const PAGE_SIZE = 20;

export function MarketView({ lang }: { lang: Locale }) {
  return (
    <SellerOnly>
      <MarketFeed lang={lang} />
    </SellerOnly>
  );
}

/**
 * The Stitch mockup pairs this with a "Refine Search" panel (make, model, year,
 * categories). GET /requests/open takes only cursor and limit and there is no
 * category taxonomy, so the filters are deliberately absent rather than faked.
 */
function MarketFeed({ lang }: { lang: Locale }) {
  const { t, i18n } = useTranslation();
  const mediaUrl = useMediaUrl();

  const query = useInfiniteQuery({
    queryKey: ["requests", "open"],
    queryFn: ({ pageParam }) =>
      apiJson<Paginated<RequestListItem>>(
        `/requests/open?limit=${PAGE_SIZE}` +
          (pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ""),
      ),
    initialPageParam: "",
    getNextPageParam: (last) => last.next_cursor ?? undefined,
  });

  const items = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <PageContainer>
      <PageHeader title={t("web.marketplace")} lead={t("web.marketplaceLead")} />

      {query.isPending ? (
        <LoadingBlock />
      ) : query.isError ? (
        <ErrorState message={translateApiError(query.error, i18n)} onRetry={() => query.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState icon="storefront" title={t("common.empty")} />
      ) : (
        <InfiniteList
          hasNextPage={Boolean(query.hasNextPage)}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={() => void query.fetchNextPage()}
        >
          <ul className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => {
              const cover = mediaUrl(item.cover_storage_key);
              return (
                <li key={item.id}>
                  <Link
                    href={`/${lang}/app/market/${item.id}`}
                    className="flex h-full gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container-high">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant/40">
                          photo_camera
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        {item.buyer_is_special ? (
                          <Badge tone="warning">{t("requests.specialBuyerListBadge")}</Badge>
                        ) : null}
                        {item.offers_count > 0 ? (
                          <Badge>{t("requests.offerCount", { count: item.offers_count })}</Badge>
                        ) : (
                          <Badge tone="success">{t("requests.noOffers")}</Badge>
                        )}
                      </span>
                      <span className="mt-2 line-clamp-2 block text-sm font-semibold text-on-surface">
                        {item.description}
                      </span>
                      <span className="mt-1 block truncate text-xs text-on-surface-variant">
                        {[
                          item.vehicle
                            ? [item.vehicle.brand, item.vehicle.model, item.vehicle.year]
                                .filter(Boolean)
                                .join(" ")
                            : null,
                          item.city,
                          formatDateTime(item.created_at, lang),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </InfiniteList>
      )}
    </PageContainer>
  );
}
