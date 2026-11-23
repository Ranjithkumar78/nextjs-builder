"use client";

import { useEffect, type Dispatch } from "react";
import { fetchThemes } from "../../api";
import type { Action } from "../types";
import { isDirty, keysOf, type SyncRefs } from "./refs";

/** Pick up changes made in other tabs, and warn before closing the tab with unsaved changes. */
export function useRemoteChanges(refs: SyncRefs, dispatch: Dispatch<Action>): void {
  const { syncedRef, syncingRef } = refs;
  // When the tab comes back into view with nothing unsaved, load the latest themes.
  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== "visible" || !syncedRef.current || syncingRef.current || isDirty(refs)) return;
      try {
        const themes = await fetchThemes();
        if (!themes.length || syncingRef.current || isDirty(refs)) return;
        const keys = keysOf(themes);
        const known = syncedRef.current;
        if (!known) return;
        const same = keys.size === known.size && [...keys].every(([id, k]) => known.get(id) === k);
        if (same) return;
        syncedRef.current = keys;
        dispatch({ type: "REMOTE", themes });
      } catch {}
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refs, syncedRef, syncingRef, dispatch]);

  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (isDirty(refs)) e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [refs]);
}
