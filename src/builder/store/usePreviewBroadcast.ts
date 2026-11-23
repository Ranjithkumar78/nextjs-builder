"use client";

import { useEffect, useRef } from "react";
import type { Theme } from "../types";
import { PREVIEW_CHANNEL, PREVIEW_DELAY_MS } from "./types";

/**
 * Send the edited theme to open preview tabs (they load everything else from the API on open).
 * Typing is batched: only the latest version is sent, shortly after the last change.
 */
export function usePreviewBroadcast(theme: Theme, ready: boolean): void {
  const channelRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channelRef.current = channel;
    return () => channel.close();
  }, []);
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => channelRef.current?.postMessage({ theme }), PREVIEW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [theme, ready]);
}
