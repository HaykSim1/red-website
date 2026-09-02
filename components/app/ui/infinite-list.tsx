"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "./button";

/**
 * Cursor pagination with an IntersectionObserver sentinel. The button stays in
 * the DOM rather than being replaced by the sentinel: it is the keyboard path,
 * and it is what a viewer sees if the observer never fires.
 */
export function InfiniteList({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  children,
}: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {children}
      {hasNextPage ? (
        <div ref={sentinel} className="flex justify-center py-6">
          <Button variant="secondary" size="sm" loading={isFetchingNextPage} onClick={fetchNextPage}>
            {isFetchingNextPage ? t("web.loadingMore") : t("web.loadMore")}
          </Button>
        </div>
      ) : null}
    </>
  );
}
