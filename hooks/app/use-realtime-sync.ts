"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

import { useAuth } from "@/components/app/auth-context";
import { getApiBaseUrl } from "@/lib/app/api-base";
import { qk } from "@/lib/app/query-keys";

/**
 * Socket.IO path must match the Nest RealtimeGateway (`path: '/realtime'`).
 *
 * Events carry ids, not payloads — they are cache-invalidation triggers, so the
 * refetch goes through the normal authenticated REST path and no data arrives
 * over the socket that the API would not have served anyway. On mobile push
 * notifications drive a second invalidation channel; on web the socket is the
 * only live path.
 */
export function useRealtimeSync(): void {
  const { token, ready } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!ready || !token) return;

    let socket: Socket;
    try {
      socket = io(getApiBaseUrl(), {
        path: "/realtime",
        transports: ["websocket"],
        auth: { token },
      });
    } catch {
      return;
    }

    const bumpMine = () => {
      void queryClient.invalidateQueries({ queryKey: ["requests", "mine"] });
    };
    const bumpOpen = () => {
      void queryClient.invalidateQueries({ queryKey: ["requests", "open"] });
    };
    const bumpHome = () => {
      void queryClient.invalidateQueries({ queryKey: qk.homeSummary });
    };
    const bumpRequest = (requestId?: string) => {
      if (!requestId) return;
      void queryClient.invalidateQueries({ queryKey: ["requests", "author", requestId] });
      void queryClient.invalidateQueries({ queryKey: ["requests", "public", requestId] });
    };

    socket.on("offer.created", (p: { request_id?: string }) => {
      bumpRequest(p?.request_id);
      bumpMine();
      bumpHome();
    });

    socket.on("offer.updated", (p: { request_id?: string }) => {
      bumpRequest(p?.request_id);
      bumpHome();
    });

    socket.on("selection.created", (p: { request_id?: string }) => {
      bumpRequest(p?.request_id);
      if (p?.request_id) {
        void queryClient.invalidateQueries({ queryKey: qk.selection(p.request_id) });
      }
      bumpMine();
      bumpHome();
    });

    socket.on("request.created", () => {
      bumpOpen();
      bumpHome();
    });

    return () => {
      socket.disconnect();
    };
  }, [ready, token, queryClient]);
}
