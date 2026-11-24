"use client";

import { useEffect, type Dispatch } from "react";
import { fetchThemesWithVersions } from "../../api";
import { blankTheme } from "../../defaults";
import { errorText } from "../../lib/values";
import type { Action, SyncState } from "../types";
import type { SyncRefs } from "./refs";
import { snapshotOf } from "./snapshot";

/** The open theme/page live in the URL (?theme=…&page=…), not in browser storage. */
function selectionFromUrl(): { theme: string; page: string } {
  const q = new URLSearchParams(window.location.search);
  return { theme: q.get("theme") ?? "", page: q.get("page") ?? "" };
}

/** Load every theme from the API once. */
export function useThemeLoader({ syncedRef, versionsRef }: SyncRefs, dispatch: Dispatch<Action>, setSync: (s: SyncState) => void): void {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await fetchThemesWithVersions();
        if (cancelled) return;
        let themes = loaded.themes;
        syncedRef.current = snapshotOf(themes);
        versionsRef.current = loaded.versions;
        // The builder needs at least one theme: start a blank one, which autosave then creates in the API.
        if (!themes.length) themes = [blankTheme("My theme")];
        const sel = selectionFromUrl();
        setSync({ status: "saved" });
        dispatch({ type: "LOAD", project: { version: 1, themes, activeThemeId: sel.theme, activePageId: sel.page } });
      } catch (e) {
        if (!cancelled) setSync({ status: "error", message: `Could not load themes from the API (${errorText(e)}).` });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [syncedRef, versionsRef, dispatch, setSync]);
}
