"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useMediaUrl } from "@/components/app/media-config-context";
import { Skeleton } from "@/components/app/ui/states";
import type { HomeBannerItem } from "@/lib/app/types";

const AUTOPLAY_MS = 5000;

/**
 * Home hero. GET /home/banners returns an empty list when none are configured,
 * and the contract says clients hide the hero rather than show a placeholder.
 */
export function BannerCarousel({ items, loading }: { items: HomeBannerItem[]; loading: boolean }) {
  const { t } = useTranslation();
  const mediaUrl = useMediaUrl();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [count, paused]);

  if (loading) return <Skeleton className="h-40 w-full sm:h-56" />;
  if (count === 0) return null;

  // Clamped rather than corrected in an effect: if an admin removes a banner the
  // stored index can point past the end for one render, and clamping on read
  // handles that without a second render pass.
  const safeIndex = Math.min(index, count - 1);
  const current = items[safeIndex];
  const src = mediaUrl(current.storage_key);

  return (
    <section
      className="relative overflow-hidden rounded-xl bg-surface-container-highest"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative h-40 w-full sm:h-56 lg:h-64">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={current.title} className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="font-headline text-lg font-bold text-white sm:text-2xl">{current.title}</p>
          {current.subtitle ? (
            <p className="mt-1 text-sm text-white/80">{current.subtitle}</p>
          ) : null}
        </div>
      </div>

      {count > 1 ? (
        <>
          <CarouselButton side="left" label={t("web.previousPhoto")} onClick={() => go(safeIndex - 1)} />
          <CarouselButton side="right" label={t("web.nextPhoto")} onClick={() => go(safeIndex + 1)} />
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {items.map((item, i) => (
              <span
                key={item.id}
                aria-hidden
                className={`h-1.5 rounded-full transition-all ${
                  i === safeIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

function CarouselButton({
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
      className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-inverse-surface/40 text-white backdrop-blur-sm hover:bg-inverse-surface/60 ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      <span className="material-symbols-outlined">
        {side === "left" ? "chevron_left" : "chevron_right"}
      </span>
    </button>
  );
}
