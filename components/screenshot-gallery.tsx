"use client";

import Image from "next/image";
import { useState } from "react";

import type { ScreenshotItem } from "@/content/types";

interface ScreenshotGalleryProps {
  sectionTitle: string;
  emptyMessage: string;
  items: ScreenshotItem[];
}

export function ScreenshotGallery({ sectionTitle, emptyMessage, items }: ScreenshotGalleryProps) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  if (!items.length) {
    return (
      <section id="screenshots" className="u-section u-page-padding">
        <div className="u-inner">
          <h2 className="u-section-title" style={{ marginBottom: "var(--space-md)" }}>
            {sectionTitle}
          </h2>
          <p className="u-muted" style={{ margin: 0 }}>
            {emptyMessage}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="screenshots" className="u-section u-page-padding">
      <div className="u-inner">
        <h2 className="u-section-title" style={{ marginBottom: "var(--space-xl)" }}>
          {sectionTitle}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "var(--space-xl)",
          }}
        >
          {items.map((item) => (
            <figure
              key={item.src}
              className="u-card"
              style={{ margin: 0, padding: "var(--space-md)" }}
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-chip)",
                  overflow: "hidden",
                  background: "var(--color-surface-container-low)",
                  aspectRatio: "10 / 19",
                }}
              >
                {!failed[item.src] ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    style={{ objectFit: "cover" }}
                    onError={() => setFailed((prev) => ({ ...prev, [item.src]: true }))}
                  />
                ) : (
                  <div
                    className="u-caption"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "var(--space-md)",
                      textAlign: "center",
                    }}
                  >
                    {emptyMessage}
                  </div>
                )}
              </div>
              <figcaption className="u-body" style={{ marginTop: "var(--space-md)" }}>
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
