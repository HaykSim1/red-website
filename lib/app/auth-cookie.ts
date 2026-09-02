import type { NextResponse } from 'next/server';

/**
 * Server-only helpers for the refresh-token cookie.
 *
 * The API hands out a rotating refresh token (30 days by default) and expects it
 * back in a JSON body. We never let that value reach client JavaScript: it lives
 * in an httpOnly cookie that only the /api/auth/* handlers read.
 */
export const REFRESH_COOKIE = 'ra_refresh';

/**
 * Readable companion to the httpOnly refresh cookie. It carries no secret — it
 * exists only so the client can tell "signed out" from "session to resume" and
 * skip a guaranteed-401 refresh call on every cold load for logged-out visitors.
 */
export const SESSION_MARKER_COOKIE = 'ra_session';

/** Matches JWT_REFRESH_EXPIRES_IN's default of 30d in api/src/config/env.schema.ts. */
const REFRESH_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export function setRefreshCookie(res: NextResponse, token: string): void {
  res.cookies.set(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: REFRESH_MAX_AGE_SECONDS,
  });
  res.cookies.set(SESSION_MARKER_COOKIE, '1', {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: REFRESH_MAX_AGE_SECONDS,
  });
}

export function clearRefreshCookie(res: NextResponse): void {
  for (const [name, httpOnly] of [
    [REFRESH_COOKIE, true],
    [SESSION_MARKER_COOKIE, false],
  ] as const) {
    res.cookies.set(name, '', {
      httpOnly,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });
  }
}
