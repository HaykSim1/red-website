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
  /**
   * What to do when the seller has filled in neither. A labelled block (shop
   * page, deal panel) says so explicitly; an offer card renders nothing at all,
   * so a seller without contact details does not get an empty row — same as the
   * mobile card.
   */
  emptyBehaviour = "message",
  className = "",
}: {
  phone?: string | null;
  telegram?: string | null;
  emptyBehaviour?: "message" | "hide";
  className?: string;
}) {
  const { t } = useTranslation();
  const handle = telegram?.trim().replace(/^@/, "");

  if (!phone && !handle) {
    if (emptyBehaviour === "hide") return null;
    return <p className="text-sm text-on-surface-variant">{t("shop.phoneNotProvided")}</p>;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
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
