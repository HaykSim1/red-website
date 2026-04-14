"use client";

import type { CSSProperties } from "react";

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8A3.6 3.6 0 0 0 20 16.4V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H15v6.95c4.56-.93 8-4.96 8-9.95z"
      />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
      />
    </svg>
  );
}

interface SocialLinksProps {
  heading: string;
}

const linkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "var(--radius-chip)",
  background: "var(--color-surface-container-lowest)",
  color: "var(--color-on-surface)",
  boxShadow: "var(--shadow-card)",
};

export function SocialLinks({ heading }: SocialLinksProps) {
  const instagram = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM?.trim();
  const facebook = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK?.trim();
  const tiktok = process.env.NEXT_PUBLIC_SOCIAL_TIKTOK?.trim();

  if (!instagram && !facebook && !tiktok) return null;

  return (
    <div style={{ marginTop: "var(--space-lg)" }}>
      <p className="u-section-title" style={{ marginBottom: "var(--space-sm)" }}>
        {heading}
      </p>
      <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap" }}>
        {instagram ? (
          <a href={instagram} rel="noopener noreferrer" target="_blank" style={linkStyle} aria-label="Instagram">
            <InstagramIcon />
          </a>
        ) : null}
        {facebook ? (
          <a href={facebook} rel="noopener noreferrer" target="_blank" style={linkStyle} aria-label="Facebook">
            <FacebookIcon />
          </a>
        ) : null}
        {tiktok ? (
          <a href={tiktok} rel="noopener noreferrer" target="_blank" style={linkStyle} aria-label="TikTok">
            <TiktokIcon />
          </a>
        ) : null}
      </div>
    </div>
  );
}
