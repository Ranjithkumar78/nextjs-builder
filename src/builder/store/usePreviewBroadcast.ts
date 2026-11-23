"use client";

import { useEffect, useRef } from "react";
import type { Project } from "../types";
import { PREVIEW_CHANNEL } from "./types";

/** Send edits to open preview tabs straight away (they load from the API on open). */
export function usePreviewBroadcast(project: Project, ready: boolean): void {
  const channelRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channelRef.current = channel;
    return () => channel.close();
  }, []);
  useEffect(() => {
    if (ready) channelRef.current?.postMessage(project);
  }, [project, ready]);
}
