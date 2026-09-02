import { getMediaBaseUrl } from './api-base';

/**
 * Build public URL for a storage key.
 * Pass `resolvedBase` from MediaConfig (server `S3_PUBLIC_URL` + env override); otherwise only
 * `EXPO_PUBLIC_MEDIA_BASE_URL` is used.
 */
export function storageKeyToUrl(
  storageKey: string,
  resolvedBase?: string | null,
): string | null {
  const fromContext =
    resolvedBase != null && resolvedBase !== ''
      ? resolvedBase.replace(/\/$/, '')
      : null;
  const base = fromContext ?? getMediaBaseUrl();
  if (!base) return null;
  const path = storageKey.replace(/^\//, '');
  return `${base}/${encodeURI(path)}`;
}
