/**
 * Server-side calls to the Red Auto API, used by the /api/auth/* route handlers.
 *
 * These run on the Next server, not in the browser, so they can fail in ways the
 * client never sees: the browser reaches the API over its public URL while the
 * server may sit behind different DNS, egress rules, or a private network.
 * That asymmetry is exactly what produced "api_unreachable" on sign-in while the
 * OTP request — which the browser sends directly — kept working.
 */

/**
 * Bases to try, in order.
 *
 * `API_INTERNAL_URL` is for deployments where the site and the API share a
 * private network and the hop should not leave it. It is optional, and it is
 * tried FIRST but never exclusively: if it is wrong, or right for one
 * environment and copied into another, the publicly-routable URL still works.
 *
 * Note `NEXT_PUBLIC_API_URL` is inlined at build time, so it is only present
 * here if it was set when the app was built.
 */
export function apiBaseCandidates(): string[] {
  const strip = (v: string | undefined) => v?.trim().replace(/\/$/, '') || undefined;
  const candidates = [strip(process.env.API_INTERNAL_URL), strip(process.env.NEXT_PUBLIC_API_URL)];
  const unique = [...new Set(candidates.filter((v): v is string => Boolean(v)))];
  return unique.length > 0 ? unique : ['http://localhost:3000'];
}

export class ApiUnreachableError extends Error {
  readonly attempts: { base: string; reason: string }[];

  constructor(attempts: { base: string; reason: string }[]) {
    super('Could not reach the API');
    this.name = 'ApiUnreachableError';
    this.attempts = attempts;
  }
}

/**
 * POSTs JSON to the API, trying each base until one answers.
 *
 * Only a thrown fetch — DNS failure, refused connection, TLS error — moves on to
 * the next base. An HTTP error response means the API was reached and is
 * returned as-is, so a 401 on a wrong OTP is never mistaken for an outage.
 */
export async function postToApi(
  path: string,
  body: unknown,
  init?: { timeoutMs?: number },
): Promise<Response> {
  const attempts: { base: string; reason: string }[] = [];

  for (const base of apiBaseCandidates()) {
    // Without a deadline a hung connection would sit until the platform kills
    // the whole request, turning a bad base into a timeout instead of a fallback.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), init?.timeoutMs ?? 10_000);
    try {
      return await fetch(`${base}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
        cache: 'no-store',
      });
    } catch (error) {
      const reason =
        error instanceof Error
          ? `${error.name}: ${error.message}${error.cause ? ` (cause: ${String(error.cause)})` : ''}`
          : String(error);
      attempts.push({ base, reason });
      // Logged rather than returned: the underlying reason can name internal
      // hosts, and this is a public endpoint.
      console.error(`[auth] API request to ${base}${path} failed — ${reason}`);
    } finally {
      clearTimeout(timer);
    }
  }

  throw new ApiUnreachableError(attempts);
}
