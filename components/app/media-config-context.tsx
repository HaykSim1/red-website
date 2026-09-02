"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";

import { apiJson } from "@/lib/app/api-client";
import { storageKeyToUrl } from "@/lib/app/media-url";

type ClientConfig = { media_base_url: string | null };

const MediaConfigContext = createContext<string | null>(null);

/**
 * GET /v1/client-config is public and tells clients where uploaded media lives
 * (S3_PUBLIC_URL, or the MinIO path-style fallback). NEXT_PUBLIC_MEDIA_BASE_URL
 * overrides it when a CDN sits in front.
 */
export function MediaConfigProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery({
    queryKey: ["client-config"],
    queryFn: () => apiJson<ClientConfig>("/client-config", { skipAuth: true }),
    staleTime: Infinity,
    retry: 1,
  });

  return (
    <MediaConfigContext.Provider value={data?.media_base_url ?? null}>
      {children}
    </MediaConfigContext.Provider>
  );
}

/** Resolves a storage key to a public URL, or null when media is unconfigured. */
export function useMediaUrl(): (storageKey: string | null | undefined) => string | null {
  const base = useContext(MediaConfigContext);
  return (storageKey) => (storageKey ? storageKeyToUrl(storageKey, base) : null);
}
