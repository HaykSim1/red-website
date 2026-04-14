/**
 * Canonical site origin for metadata (hreflang / OG). Override in production via env.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "https://redauto.example";
}
