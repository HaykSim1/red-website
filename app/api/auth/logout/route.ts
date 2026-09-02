import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { clearRefreshCookie, REFRESH_COOKIE } from '@/lib/app/auth-cookie';
import { postToApi } from '@/lib/app/server-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Revokes the refresh session upstream and drops the cookie. Revocation is
 * best-effort — the cookie is cleared either way, so a user who presses Sign out
 * is signed out locally even if the API is unreachable.
 */
export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    try {
      await postToApi('/v1/auth/logout', { refresh_token: refreshToken });
    } catch {
      /* ignore — the cookie is cleared regardless */
    }
  }

  const res = new NextResponse(null, { status: 204 });
  clearRefreshCookie(res);
  return res;
}
