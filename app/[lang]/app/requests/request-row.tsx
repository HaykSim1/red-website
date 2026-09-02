"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { useMediaUrl } from "@/components/app/media-config-context";
import { Badge } from "@/components/app/ui/badge";
import { formatDateTime } from "@/lib/app/format";
import type { RequestListItem } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

const STATUS_TONE = {
  open: "success",
  closed: "neutral",
  cancelled: "danger",
} as const;

export function RequestRow({ lang, item }: { lang: Locale; item: RequestListItem }) {
  const { t } = useTranslation();
  const mediaUrl = useMediaUrl();
  const cover = mediaUrl(item.cover_storage_key);
  const tone = STATUS_TONE[item.status as keyof typeof STATUS_TONE] ?? "neutral";

  return (
    <li>
      <Link
        href={`/${lang}/app/requests/${item.id}`}
        className="flex gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container-high">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant/40">
              photo_camera
            </span>
          )}
          {item.photo_count > 1 ? (
            <span className="absolute bottom-1 right-1 rounded bg-inverse-surface/70 px-1 text-[10px] font-bold text-white">
              {item.photo_count}
            </span>
          ) : null}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone={tone}>{t(`requests.status_${item.status}`)}</Badge>
            {item.offers_count > 0 ? (
              <Badge tone="brand">{t("requests.offerCount", { count: item.offers_count })}</Badge>
            ) : (
              <span className="text-xs text-on-surface-variant">{t("requests.noOffers")}</span>
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

        <span className="material-symbols-outlined self-center text-on-surface-variant/50">
          chevron_right
        </span>
      </Link>
    </li>
  );
}
