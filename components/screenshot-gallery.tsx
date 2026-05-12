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
        <div className="u-inner" style={{ textAlign: "center" }}>
          <h2 className="u-display-lg" style={{ marginBottom: 16 }}>
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
      <div className="u-inner" style={{ textAlign: "center" }}>
        <h2 className="u-display-lg" style={{ marginBottom: 64 }}>
          {sectionTitle}
        </h2>
        <div className="screenshots-grid">
          {items.map((item, index) => (
            <div key={item.src} className="screenshot-col">
              {/* Phone frame */}
              <div className="phone-frame">
                {!failed[item.src] ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 767px) 90vw, 300px"
                    style={{ objectFit: "cover" }}
                    quality={90}
                    priority={index === 0}
                    onError={() => setFailed((prev) => ({ ...prev, [item.src]: true }))}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 16,
                      textAlign: "center",
                      fontSize: 12,
                      color: "var(--color-on-surface-muted)",
                    }}
                  >
                    {emptyMessage}
                  </div>
                )}
              </div>
              <p style={{ marginTop: 16, fontSize: 14, color: "var(--color-on-surface-variant)", fontWeight: 500 }}>
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .screenshots-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 768px) {
          .screenshots-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 48px;
          }
        }
        .screenshot-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .phone-frame {
          position: relative;
          width: 100%;
          max-width: 300px;
          aspect-ratio: 9 / 19;
          border-radius: 2.5rem;
          border: 8px solid #1b1c1b;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
          overflow: hidden;
          background: #e4e2e1;
        }
      `}</style>
    </section>
  );
}
