"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { RequestRow } from "@/app/[lang]/app/requests/request-row";
import { useMediaUrl } from "@/components/app/media-config-context";
import { Badge } from "@/components/app/ui/badge";
import { InfiniteList } from "@/components/app/ui/infinite-list";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/app/ui/states";
import { Tabs } from "@/components/app/ui/tabs";
import { useMe } from "@/hooks/app/use-me";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import { formatAmd, formatDateTime } from "@/lib/app/format";
import type { Paginated, RequestListItem, SellerOfferHistoryItem } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

const PAGE_SIZE = 20;
type Tab = "requests" | "offers";

/**
 * The Stitch design calls this "My Orders". There are no orders on this platform,
 * so it shows what actually closes: a buyer's finished requests, and — for a
 * seller — their terminal offers. The seller half is the screen that exists in
 * the mobile app as (tabs)/history.tsx but was never given a tab to reach it.
 */
export function HistoryView({ lang }: { lang: Locale }) {
  const { t, i18n } = useTranslation();
  const { isSeller } = useMe();
  const [tab, setTab] = useState<Tab>("requests");
  const activeTab: Tab = isSeller ? tab : "requests";

  const requestsQ = useInfiniteQuery({
    queryKey: ["requests", "mine", "history"],
    queryFn: ({ pageParam }) =>
      apiJson<Paginated<RequestListItem>>(
        `/requests/mine?scope=history&limit=${PAGE_SIZE}` +
          (pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ""),
      ),
    initialPageParam: "",
    getNextPageParam: (last) => last.next_cursor ?? undefined,
    enabled: activeTab === "requests",
  });

  const offersQ = useInfiniteQuery({
    queryKey: ["offers", "mine", "history"],
    queryFn: ({ pageParam }) =>
      apiJson<Paginated<SellerOfferHistoryItem>>(
        `/offers/mine/history?limit=${PAGE_SIZE}` +
          (pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ""),
      ),
    initialPageParam: "",
    getNextPageParam: (last) => last.next_cursor ?? undefined,
    enabled: isSeller && activeTab === "offers",
  });

  const query = activeTab === "requests" ? requestsQ : offersQ;

  return (
    <PageContainer>
      <PageHeader title={t("tabs.history")} />

      {isSeller ? (
        <Tabs
          value={activeTab}
          onChange={(v) => setTab(v as Tab)}
          options={[
            { value: "requests", label: t("tabs.myRequests") },
            { value: "offers", label: t("history.yourOffer") },
          ]}
        />
      ) : null}

      <div className={isSeller ? "mt-6" : ""}>
        {query.isPending ? (
          <LoadingBlock />
        ) : query.isError ? (
          <ErrorState message={translateApiError(query.error, i18n)} onRetry={() => query.refetch()} />
        ) : activeTab === "requests" ? (
          <RequestHistory lang={lang} query={requestsQ} />
        ) : (
          <OfferHistory lang={lang} query={offersQ} />
        )}
      </div>
    </PageContainer>
  );
}

function RequestHistory({
  lang,
  query,
}: {
  lang: Locale;
  query: ReturnType<typeof useInfiniteQuery<Paginated<RequestListItem>>>;
}) {
  const { t } = useTranslation();
  const items = query.data?.pages.flatMap((p) => p.items) ?? [];
  if (items.length === 0) return <EmptyState icon="inventory_2" title={t("common.empty")} />;

  return (
    <InfiniteList
      hasNextPage={Boolean(query.hasNextPage)}
      isFetchingNextPage={query.isFetchingNextPage}
      fetchNextPage={() => void query.fetchNextPage()}
    >
      <ul className="space-y-3">
        {items.map((item) => (
          <RequestRow key={item.id} lang={lang} item={item} />
        ))}
      </ul>
    </InfiniteList>
  );
}

function OfferHistory({
  lang,
  query,
}: {
  lang: Locale;
  query: ReturnType<typeof useInfiniteQuery<Paginated<SellerOfferHistoryItem>>>;
}) {
  const { t } = useTranslation();
  const mediaUrl = useMediaUrl();
  const items = query.data?.pages.flatMap((p) => p.items) ?? [];
  if (items.length === 0) return <EmptyState icon="inventory_2" title={t("common.empty")} />;

  return (
    <InfiniteList
      hasNextPage={Boolean(query.hasNextPage)}
      isFetchingNextPage={query.isFetchingNextPage}
      fetchNextPage={() => void query.fetchNextPage()}
    >
      <ul className="space-y-3">
        {items.map((item) => {
          const cover = mediaUrl(item.cover_storage_key);
          return (
            <li key={item.offer_id}>
              <Link
                href={`/${lang}/app/market/${item.request_id}`}
                className="flex gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md"
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
                    <Badge tone={item.outcome === "success" ? "success" : "danger"}>
                      {item.outcome === "success"
                        ? t("history.offerOutcomeSuccess")
                        : t("history.offerOutcomeCanceled")}
                    </Badge>
                    <span className="text-sm font-bold text-on-surface">
                      {formatAmd(item.price_amount, lang)}
                    </span>
                    {item.variant_label ? (
                      <span className="text-xs text-on-surface-variant">{item.variant_label}</span>
                    ) : null}
                  </span>
                  <span className="mt-2 line-clamp-2 block text-sm text-on-surface">
                    {item.description}
                  </span>
                  <span className="mt-1 block text-xs text-on-surface-variant">
                    {formatDateTime(item.closed_at, lang)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </InfiniteList>
  );
}
