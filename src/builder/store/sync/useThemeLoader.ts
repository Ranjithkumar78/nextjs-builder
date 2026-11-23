"use client";

import { useEffect, type Dispatch } from "react";
import { fetchThemes } from "../../api";
import { blankTheme } from "../../defaults";
import { errorText } from "../../lib/values";
import type { Action, SyncState } from "../types";
import { keysOf, type SyncRefs } from "./refs";

/** The open theme/page live in the URL (?theme=…&page=…), not in browser storage. */
function selectionFromUrl(): { theme: string; page: string } {
  const q = new URLSearchParams(window.location.search);
  return { theme: q.get("theme") ?? "", page: q.get("page") ?? "" };
}

/** Load every theme from the API once. */
export function useThemeLoader({ syncedRef }: SyncRefs, dispatch: Dispatch<Action>, setSync: (s: SyncState) => void): void {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let themes = await fetchThemes();
        if (cancelled) return;
        syncedRef.current = keysOf(themes);
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
  }, [syncedRef, dispatch, setSync]);
}
