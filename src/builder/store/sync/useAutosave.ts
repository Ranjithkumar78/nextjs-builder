"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Project } from "../../types";
import { ApiError, AUTOSAVE_DELAY_MS } from "../../api";
import { errorText } from "../../lib/values";
import type { SyncState } from "../types";
import type { SyncRefs } from "./refs";
import { isEmptyPlan, planSync } from "./snapshot";
import { runPlan } from "./runPlan";

/**
 * Save what changed (theme settings, single pages, deletions) a moment after the last edit.
 * Returns a retry function: after a version conflict, retrying reloads the latest data instead.
 */
export function useAutosave({ syncedRef, versionsRef, syncingRef, latestRef }: SyncRefs, setSync: (s: SyncState) => void, project: Project, ready: boolean): () => void {
  const conflictRef = useRef(false);
  const runSync = useCallback(
    async function run(): Promise<void> {
      const snap = syncedRef.current;
      if (!snap || syncingRef.current || conflictRef.current) return;
      const current = latestRef.current;
      const plan = planSync(current, snap);
      if (isEmptyPlan(plan)) return;

      syncingRef.current = true;
      setSync({ status: "saving" });
      try {
        await runPlan(plan, snap, versionsRef.current);
        setSync({ status: "saved", at: Date.now() });
      } catch (e) {
        conflictRef.current = e instanceof ApiError && e.status === 409;
        setSync({ status: "error", message: errorText(e), conflict: conflictRef.current });
        syncingRef.current = false;
        return;
      }
      syncingRef.current = false;
      // Edits made while saving are picked up by another pass.
      if (latestRef.current !== current) void run();
    },
    [syncedRef, versionsRef, syncingRef, latestRef, setSync],
  );

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!ready || !syncedRef.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void runSync(), AUTOSAVE_DELAY_MS);
  }, [project, ready, runSync, syncedRef]);

  // Before the first load nothing has been compared yet, and after a conflict local edits can't be saved: reload.
  return useCallback(() => {
    if (syncedRef.current && !conflictRef.current) void runSync();
    else window.location.reload();
  }, [runSync, syncedRef]);
}
