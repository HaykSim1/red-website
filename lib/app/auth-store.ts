/**
 * The access token lives in memory only — never localStorage, never a cookie
 * readable by script. The refresh token is held in an httpOnly cookie that only
 * the /api/auth/* route handlers can see, so a script injected into the page has
 * nothing long-lived to steal.
 *
 * Module scope is the right home for it: api-client.ts needs the token outside
 * of React (it retries requests from inside a fetch wrapper), and AuthProvider
 * subscribes so that React state stays in step.
 */

let accessToken: string | null = null;
const listeners = new Set<(token: string | null) => void>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  for (const listener of listeners) listener(token);
}

export function subscribeToAccessToken(listener: (token: string | null) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Registered by AuthProvider so the fetch wrapper can force a logout without importing the router. */
let sessionExpiredHandler: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null): void {
  sessionExpiredHandler = handler;
}

export function notifySessionExpired(): void {
  sessionExpiredHandler?.();
}
