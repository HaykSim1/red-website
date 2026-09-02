"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useMediaUrl } from "@/components/app/media-config-context";

type Photo = { storage_key: string };

/** Thumbnail strip that opens a keyboard-navigable lightbox. */
export function PhotoGrid({ photos, className = "" }: { photos: Photo[]; className?: string }) {
  const { t } = useTranslation();
  const mediaUrl = useMediaUrl();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <ul className={`grid grid-cols-3 gap-2 sm:grid-cols-4 ${className}`}>
        {photos.map((photo, i) => {
          const src = mediaUrl(photo.storage_key);
          return (
            <li key={photo.storage_key}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="block aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg bg-surface-container-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={t("web.photoCount", { index: i + 1, total: photos.length })}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="h-full w-full object-cover" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {openIndex !== null ? (
        <Lightbox
          photos={photos}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </>
  );
}

function Lightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const mediaUrl = useMediaUrl();
  const total = photos.length;

  const step = useCallback(
    (delta: number) => onIndexChange((index + delta + total) % total),
    [index, total, onIndexChange],
  );

  // The scroll lock belongs to the lightbox being mounted, not to the identity of
  // its callbacks. Tying the two together means a parent re-render releases and
  // re-takes the lock, and it is what let a re-running effect steal focus in
  // Modal — keep them separate.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Rebinding a key listener is cheap and side-effect free, so this one can
  // safely follow the callbacks.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, step]);

  const src = mediaUrl(photos[index].storage_key);

  return (
    <div
      role="dialog"
      aria-modal
      aria-label={t("web.photoCount", { index: index + 1, total })}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-inverse-surface/90 p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("web.closePhoto")}
        autoFocus
        className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="max-h-full max-w-full object-contain" />
      ) : null}

      {total > 1 ? (
        <>
          <NavButton side="left" label={t("web.previousPhoto")} onClick={() => step(-1)} />
          <NavButton side="right" label={t("web.nextPhoto")} onClick={() => step(1)} />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {t("web.photoCount", { index: index + 1, total })}
          </p>
        </>
      ) : null}
    </div>
  );
}

function NavButton({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      <span className="material-symbols-outlined">
        {side === "left" ? "chevron_left" : "chevron_right"}
      </span>
    </button>
  );
}
