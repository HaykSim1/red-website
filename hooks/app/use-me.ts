"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/components/app/auth-context";
import { apiJson } from "@/lib/app/api-client";
import { qk } from "@/lib/app/query-keys";
import type { MeResponse } from "@/lib/app/types";

/**
 * GET /me is the source of truth for role — the JWT claim can lag behind an
 * admin approving a seller application.
 */
export function useMe() {
  const { token, ready } = useAuth();
  const query = useQuery({
    queryKey: qk.me,
    queryFn: () => apiJson<MeResponse>("/me"),
    enabled: ready && Boolean(token),
    staleTime: 60_000,
  });

  // Fail closed: treat an unconfirmed account as a buyer so seller-only surfaces
  // never flash into view while /me is in flight. Same rule as (tabs)/_layout.tsx.
  const role = query.data?.role;
  const isSeller = query.isSuccess && (role === "seller" || role === "admin");

  return { ...query, me: query.data, role, isSeller, isBuyer: !isSeller };
}
