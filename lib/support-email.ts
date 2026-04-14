/**
 * Public support / display email (home contact column + mailto). Set in production via env.
 */
export function getSupportEmail(): string {
  const raw = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();
  if (raw) return raw;
  return "info@red-auto.store";
}
