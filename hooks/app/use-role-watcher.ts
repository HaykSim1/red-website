"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useAuth } from "@/components/app/auth-context";
import { refreshAccessToken } from "@/lib/app/api-client";
import { getJwtRole } from "@/lib/app/jwt-payload";
import { qk } from "@/lib/app/query-keys";

import { useMe } from "./use-me";

const POLL_MS = 15_000;

/**
 * Picks up a seller approval without asking the user to sign in again.
 *
 * The JWT's `role` claim is frozen at issue time, but seller-only routes are
 * guarded on it. When /me reports a role the token does not yet carry, refresh
 * to mint one that does, then drop the cache so every screen re-reads with the
 * new permissions. Polls only while an application is actually pending.
 */
export function useRoleWatcher(): void {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { me } = useMe();
  const refreshing = useRef(false);

  const pending = me?.seller_application?.status === "pending";
  const jwtRole = token ? getJwtRole(token) : null;
  const roleMismatch = Boolean(me?.role && jwtRole && me.role !== jwtRole);

  useEffect(() => {
    if (!pending) return;
    const id = setInterval(() => {
      void queryClient.invalidateQueries({ queryKey: qk.me });
    }, POLL_MS);
    return () => clearInterval(id);
  }, [pending, queryClient]);

  useEffect(() => {
    if (!roleMismatch || refreshing.current) return;
    refreshing.current = true;
    void (async () => {
      const ok = await refreshAccessToken();
      if (ok) await queryClient.invalidateQueries();
      refreshing.current = false;
    })();
  }, [roleMismatch, queryClient]);
}
