"use client";

import { useCallback, useEffect, useRef, type Dispatch } from "react";
import type { Project } from "../../types";
import { AUTOSAVE_DELAY_MS, deleteTheme, saveTheme } from "../../api";
import { errorText } from "../../lib/values";
import type { Action } from "../types";
import { themeKey, type SyncRefs } from "./refs";

/** Save changed themes to the API (and delete removed ones) a moment after the last edit. Returns a retry function. */
export function useAutosave({ syncedRef, syncingRef, latestRef }: SyncRefs, dispatch: Dispatch<Action>, project: Project, ready: boolean): () => void {
  const runSync = useCallback(
    async function run(): Promise<void> {
      const known = syncedRef.current;
      if (!known || syncingRef.current) return;
      const current = latestRef.current;
      const changed = current.themes.map((t, i) => ({ t, i, key: themeKey(t, i) })).filter((x) => known.get(x.t.id) !== x.key);
      const removed = [...known.keys()].filter((id) => !current.themes.some((t) => t.id === id));
      if (!changed.length && !removed.length) return;

      syncingRef.current = true;
      dispatch({ type: "SYNC", sync: { status: "saving" } });
      try {
        for (const { t, i, key } of changed) {
          await saveTheme(t, i);
          known.set(t.id, key);
        }
        for (const id of removed) {
          await deleteTheme(id);
          known.delete(id);
        }
        dispatch({ type: "SYNC", sync: { status: "saved", at: Date.now() } });
      } catch (e) {
        dispatch({ type: "SYNC", sync: { status: "error", message: errorText(e) } });
        syncingRef.current = false;
        return;
      }
      syncingRef.current = false;
      // Edits made while saving are picked up by another pass.
      if (latestRef.current !== current) void run();
    },
    [syncedRef, syncingRef, latestRef, dispatch],
  );

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!ready || !syncedRef.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void runSync(), AUTOSAVE_DELAY_MS);
  }, [project, ready, runSync, syncedRef]);

  // Before the first successful load from the API nothing has been compared yet, so reload instead.
  return useCallback(() => {
    if (syncedRef.current) void runSync();
    else window.location.reload();
  }, [runSync, syncedRef]);
}
