"use client";

import { useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { Project } from "../types";
import { reducer } from "./reducer";
import { initialState } from "./history";
import { activePage, activeTheme } from "./selectors";
import { BuilderContext, type BuilderCtx } from "./context";
import type { SyncRefs } from "./sync/refs";
import type { SyncState } from "./types";
import { SyncContext, type SyncCtx } from "./SyncStatus";
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

  const [sync, setSync] = useState<SyncState>({ status: "loading" });
  useThemeLoader(refs, dispatch, setSync);
  const retrySync = useAutosave(refs, setSync, project, ready);
  useRemoteChanges(refs, dispatch);
  usePreviewBroadcast(activeTheme(project), ready);
  useUrlSelection(ready, project.activeThemeId, project.activePageId);

  const value = useMemo<BuilderCtx>(() => ({ state, dispatch, theme: activeTheme(state.project), page: activePage(state.project) }), [state]);
  const syncValue = useMemo<SyncCtx>(() => ({ sync, retrySync }), [sync, retrySync]);
  return (
    <SyncContext.Provider value={syncValue}>
      <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
    </SyncContext.Provider>
  );
}
