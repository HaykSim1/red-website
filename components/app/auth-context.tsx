"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { refreshAccessToken } from "@/lib/app/api-client";
import {
  getAccessToken,
  setAccessToken,
  setSessionExpiredHandler,
  subscribeToAccessToken,
} from "@/lib/app/auth-store";
import type { Locale } from "@/lib/i18n";

/** Mirrors SESSION_MARKER_COOKIE in lib/app/auth-cookie.ts — value carries no secret. */
const SESSION_MARKER = "ra_session";

function hasSessionMarker(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${SESSION_MARKER}=1`));
}

type AuthState = {
  /** null until the initial refresh settles; distinguishes "signed out" from "still checking". */
  token: string | null;
  ready: boolean;
  signIn: (accessToken: string) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [ready, setReady] = useState(false);
  const bootstrapped = useRef(false);

  // Mirror the module-level token (which api-client writes to on silent refresh)
  // into React state so the guard re-renders when a session appears or dies.
  useEffect(() => subscribeToAccessToken(setToken), []);

  // One attempt at resuming the session from the httpOnly refresh cookie.
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    let alive = true;
    void (async () => {
      // Skip the call entirely when there is no session to resume — otherwise
      // every logged-out visitor pays for a guaranteed 401.
      if (!getAccessToken() && hasSessionMarker()) await refreshAccessToken();
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const signIn = useCallback((accessToken: string) => {
    setAccessToken(accessToken);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } catch {
      /* the cookie is cleared server-side regardless; carry on */
    }
    setAccessToken(null);
    queryClient.clear();
    router.replace(`/${lang}/login`);
  }, [lang, queryClient, router]);

  // api-client calls this when a refresh fails mid-request.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      queryClient.clear();
      router.replace(`/${lang}/login`);
    });
    return () => setSessionExpiredHandler(null);
  }, [lang, queryClient, router]);

  return (
    <AuthContext.Provider value={{ token, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
