"use client";

import { createContext, useContext } from "react";
import type { SyncState } from "./types";

export interface SyncCtx {
  sync: SyncState;
  /** Try sending unsaved changes to the API again. */
  retrySync: () => void;
}

/** Save status lives apart from the editor state, so "Saving…" / "Saved" only re-renders what shows it. */
export const SyncContext = createContext<SyncCtx | null>(null);

export function useSyncStatus(): SyncCtx {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error("useSyncStatus must be used inside BuilderProvider");
  return ctx;
}
