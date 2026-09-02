"use client";

import { useTranslation } from "react-i18next";

/**
 * Phone and Telegram as plain links. The platform deliberately keeps the
 * transaction off-app (docs/product.md), so this is the handoff point.
 * `tel:` is live on a phone and inert on a desktop, which is why the number is
 * always shown as text rather than hidden behind an icon.
 */
export function ContactLinks({
  phone,
  telegram,
}: {
  phone?: string | null;
  telegram?: string | null;
}) {
  const { t } = useTranslation();
  const handle = telegram?.trim().replace(/^@/, "");

  if (!phone && !handle) {
    return <p className="text-sm text-on-surface-variant">{t("shop.phoneNotProvided")}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {phone ? (
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">call</span>
          {phone}
        </a>
      ) : null}
      {handle ? (
        <a
          href={`https://t.me/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[18px] text-tertiary">send</span>@{handle}
        </a>
      ) : null}
    </div>
  );
}
