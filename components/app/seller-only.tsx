"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { PageContainer } from "@/components/app/ui/page";
import { EmptyState, LoadingBlock } from "@/components/app/ui/states";
import { useMe } from "@/hooks/app/use-me";

/**
 * Seller-only surfaces fail closed: while GET /me is in flight the account is
 * treated as a buyer, so a seller screen never flashes into view for someone who
 * is not one. Same rule as mobile's (tabs)/_layout.tsx. The API enforces this
 * independently and returns 403 seller_feed_required.
 */
export function SellerOnly({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { isSeller, isPending } = useMe();

  if (isPending) {
    return (
      <PageContainer>
        <LoadingBlock rows={2} />
      </PageContainer>
    );
  }

  if (!isSeller) {
    return (
      <PageContainer>
        <EmptyState icon="storefront" title={t("web.sellerOnlyPage")} body={t("home.sellerOnlyMarket")} />
      </PageContainer>
    );
  }

  return <>{children}</>;
}
