/**
 * Read JWT role claim without verifying signature (client-side UX only; API validates).
 */
export function getJwtRole(token: string | null): string | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = base64 + (pad ? '='.repeat(4 - pad) : '');
    const json = atob(padded);
    const parsed = JSON.parse(json) as { role?: string };
    return typeof parsed.role === 'string' ? parsed.role : null;
  } catch {
    return null;
  }
}
