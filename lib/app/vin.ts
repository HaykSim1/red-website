/**
 * VIN format rules. Decoding lives in `vpic-decode-vin.ts` — this module only
 * answers "is this string shaped like a VIN?", with no network involved.
 */

/** Since 1981 every VIN is exactly 17 characters. */
export const VIN_LENGTH = 17;

/**
 * I, O and Q are excluded from the VIN alphabet so they cannot be confused
 * with 1 and 0.
 */
const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

/** Uppercase and strip whitespace/dashes so pasted VINs are accepted. */
export function normalizeVin(raw: string): string {
  return raw.toUpperCase().replace(/[\s-]/g, '');
}

/** True when the string is a well-formed 17-character VIN. */
export function isValidVinFormat(raw: string): boolean {
  return VIN_RE.test(normalizeVin(raw));
}
