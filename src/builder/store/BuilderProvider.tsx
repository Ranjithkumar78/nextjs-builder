"use client";

import { useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import type { Project } from "../types";
import { reducer } from "./reducer";
import { initialState } from "./history";
import { activePage, activeTheme } from "./selectors";
import { BuilderContext, type BuilderCtx } from "./context";
import type { SyncRefs } from "./sync/refs";
import { useThemeLoader } from "./sync/useThemeLoader";
import { useAutosave } from "./sync/useAutosave";
import { useRemoteChanges } from "./sync/useRemoteChanges";
import { usePreviewBroadcast } from "./usePreviewBroadcast";
import { useUrlSelection } from "./useUrlSelection";

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const { project, ready } = state;

  const syncedRef = useRef<Map<string, string> | null>(null);
  const syncingRef = useRef(false);
  const latestRef = useRef<Project>(project);
  const refs = useMemo<SyncRefs>(() => ({ syncedRef, syncingRef, latestRef }), []);
  useEffect(() => {
    latestRef.current = project;
  }, [project]);

  useThemeLoader(refs, dispatch);
  const retrySync = useAutosave(refs, dispatch, project, ready);
  useRemoteChanges(refs, dispatch);
  usePreviewBroadcast(project, ready);
  useUrlSelection(ready, project.activeThemeId, project.activePageId);

  const value = useMemo<BuilderCtx>(() => ({ state, dispatch, theme: activeTheme(state.project), page: activePage(state.project), retrySync }), [state, retrySync]);
  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}
