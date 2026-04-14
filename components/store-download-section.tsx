import Image from "next/image";
import Link from "next/link";

import { getMarketing } from "@/content";
import type { Locale } from "@/lib/i18n";

interface StoreDownloadSectionProps {
  lang: Locale;
}

export function StoreDownloadSection({ lang }: StoreDownloadSectionProps) {
  const c = getMarketing(lang);
  const iosUrl = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() ?? "";
  const androidUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ?? "";
  const hasAny = Boolean(iosUrl || androidUrl);

  return (
    <section className="u-section u-section--tint u-page-padding" id="download">
      <div className="u-inner">
        <h2 className="u-section-title" style={{ marginBottom: "var(--space-lg)" }}>
          {c.downloadSectionTitle}
        </h2>
        {!hasAny ? (
          <p className="u-muted" style={{ margin: 0 }}>
            {c.downloadSoon}
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-xl)",
              alignItems: "center",
            }}
          >
            {iosUrl ? (
              <Link href={iosUrl} rel="noopener noreferrer" target="_blank" style={{ lineHeight: 0 }}>
                <Image
                  src="/badges/app-store.svg"
                  alt={c.downloadAppStoreBadgeAlt}
                  width={250}
                  height={83}
                  unoptimized
                />
              </Link>
            ) : null}
            {androidUrl ? (
              <Link href={androidUrl} rel="noopener noreferrer" target="_blank" style={{ lineHeight: 0 }}>
                <Image
                  src="/badges/google-play.png"
                  alt={c.downloadGooglePlayBadgeAlt}
                  width={646}
                  height={250}
                  style={{ height: 56, width: "auto" }}
                  unoptimized
                />
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
