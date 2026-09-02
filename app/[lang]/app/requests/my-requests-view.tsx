"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { InfiniteList } from "@/components/app/ui/infinite-list";
import { LinkButton } from "@/components/app/ui/link-button";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/app/ui/states";
import { Tabs } from "@/components/app/ui/tabs";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import type { Paginated, RequestListItem } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

import { RequestRow } from "./request-row";

const PAGE_SIZE = 20;
type Scope = "active" | "history";

export function MyRequestsView({ lang }: { lang: Locale }) {
  const { t, i18n } = useTranslation();
  const [scope, setScope] = useState<Scope>("active");

  const query = useInfiniteQuery({
    // Scope is part of the key: the two tabs are different lists, not
    // different filters over one cached list.
    queryKey: ["requests", "mine", scope],
    queryFn: ({ pageParam }) =>
      apiJson<Paginated<RequestListItem>>(
        `/requests/mine?scope=${scope}&limit=${PAGE_SIZE}` +
          (pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ""),
      ),
    initialPageParam: "",
    getNextPageParam: (last) => last.next_cursor ?? undefined,
  });

  const items = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <PageContainer>
      <PageHeader
        title={t("tabs.myRequests")}
        actions={
          <LinkButton
            href={`/${lang}/app/requests/new`}
            icon={<span className="material-symbols-outlined">add_circle</span>}
          >
            {t("web.newRequest")}
          </LinkButton>
        }
      />

      <Tabs
        value={scope}
        onChange={(v) => setScope(v as Scope)}
        options={[
          { value: "active", label: t("requests.filterActive") },
          { value: "history", label: t("requests.filterCompleted") },
        ]}
      />

      <div className="mt-6">
        {query.isPending ? (
          <LoadingBlock />
        ) : query.isError ? (
          <ErrorState message={translateApiError(query.error, i18n)} onRetry={() => query.refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            icon="list_alt"
            title={t("common.empty")}
            body={scope === "active" ? t("home.ctaBody") : undefined}
            action={
              scope === "active" ? (
                <LinkButton href={`/${lang}/app/requests/new`}>{t("home.ctaButton")}</LinkButton>
              ) : undefined
            }
          />
        ) : (
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
        )}
      </div>
    </PageContainer>
  );
}
