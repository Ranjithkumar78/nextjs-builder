"use client";

import { useEffect, type Dispatch } from "react";
import { fetchThemesWithVersions } from "../../api";
import type { Action } from "../types";
import { isDirty, sameVersions, type SyncRefs } from "./refs";
import { snapshotOf } from "./snapshot";

/** Pick up changes made in other tabs, and warn before closing the tab with unsaved changes. */
export function useRemoteChanges(refs: SyncRefs, dispatch: Dispatch<Action>): void {
  const { syncedRef, syncingRef, versionsRef } = refs;
  // When the tab comes back into view with nothing unsaved, load the latest themes.
  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== "visible" || !syncedRef.current || syncingRef.current || isDirty(refs)) return;
      try {
        const { themes, versions } = await fetchThemesWithVersions();
        // Versions change on every save, so equal versions mean nothing changed elsewhere.
        if (!themes.length || syncingRef.current || isDirty(refs) || sameVersions(versions, versionsRef.current)) return;
        syncedRef.current = snapshotOf(themes);
        versionsRef.current = versions;
        dispatch({ type: "REMOTE", themes });
      } catch {}
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refs, syncedRef, syncingRef, versionsRef, dispatch]);

  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (isDirty(refs)) e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [refs]);
}
