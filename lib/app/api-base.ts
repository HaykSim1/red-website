/**
 * Web counterpart of mobile/lib/api-base.ts. Same contract, different env vars:
 * Next needs NEXT_PUBLIC_* and inlines them at build time, so both must be
 * referenced as full static property accesses — `process.env[name]` does not work.
 */

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
  return raw.replace(/\/$/, '');
}

export function getMediaBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  if (!raw) return null;
  return raw.replace(/\/$/, '');
}
