"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type Dispatch, type ReactNode } from "react";
import type { Device, DropTarget, Page, Project, StyleMap, StyleState, TBNode, Theme, ThemeColors, ThemeTokens, Zone } from "./types";
import { cloneNode, containsId, getZoneNodes, insertNode, locate, removeNode, setZoneNodes, updateNode } from "./tree";
import { isUlid, ulid } from "./ulid";
import { AUTOSAVE_DELAY_MS, deleteTheme, fetchThemes, saveTheme } from "./api";
import { blankTheme } from "./defaults";

/** Live preview tabs listen on this channel for unsaved edits. */
export const PREVIEW_CHANNEL = "custom-theme-builder:preview";

export type LeftTab = "components" | "layers" | "pages" | "themes";
export type RightTab = "edit" | "style" | "content" | "advanced";

export interface UIState {
  selectedId: string | null;
  hoveredId: string | null;
  device: Device;
  hoverState: boolean;
  leftTab: LeftTab;
  rightTab: RightTab;
  clipboard: TBNode | null;
  zoom: number;
}

export interface State {
  project: Project;
  past: Project[];
  future: Project[];
  ui: UIState;
  ready: boolean;
  lastKey: string | null;
  lastTime: number;
  sync: SyncState;
}

export type SyncStatus = "loading" | "saving" | "saved" | "error";
export interface SyncState {
  status: SyncStatus;
  message?: string;
  at?: number;
}

export type Action =
  | { type: "LOAD"; project: Project }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "UI"; patch: Partial<UIState> }
  | { type: "SYNC"; sync: SyncState }
  | { type: "REMOTE"; themes: Theme[] }
  | { type: "ADD_NODE"; node: TBNode; target: DropTarget }
  | { type: "MOVE_NODE"; id: string; target: DropTarget }
  | { type: "DELETE_NODE"; id: string }
  | { type: "DUPLICATE_NODE"; id: string }
  | { type: "MOVE_SIBLING"; id: string; dir: -1 | 1 }
  | { type: "UPDATE_PROPS"; id: string; props: Record<string, unknown>; key?: string }
  | { type: "UPDATE_STYLE"; id: string; state: StyleState; patch: StyleMap; key?: string }
  | { type: "CLEAR_STYLE"; id: string; state: StyleState }
  | { type: "RENAME_NODE"; id: string; name: string }
  | { type: "TOGGLE_HIDDEN"; id: string }
  | { type: "COPY"; id: string }
  | { type: "PASTE"; target: DropTarget }
  | { type: "ADD_THEME"; theme: Theme }
  | { type: "DUPLICATE_THEME"; id: string }
  | { type: "RENAME_THEME"; id: string; name: string }
  | { type: "DELETE_THEME"; id: string }
  | { type: "SET_THEME"; id: string }
  | { type: "UPDATE_TOKENS"; patch: Partial<Omit<ThemeTokens, "colors">>; colors?: Partial<ThemeColors>; key?: string }
  | { type: "SET_CUSTOM_CSS"; css: string }
  | { type: "SET_EVENT_ID"; eventId: string }
  | { type: "ADD_PAGE"; page: Page }
  | { type: "DUPLICATE_PAGE"; id: string }
  | { type: "UPDATE_PAGE"; id: string; patch: Partial<Omit<Page, "id" | "nodes">> }
  | { type: "DELETE_PAGE"; id: string }
  | { type: "SET_PAGE"; id: string }
  | { type: "MOVE_PAGE"; id: string; dir: -1 | 1 };

export function activeTheme(p: Project): Theme {
  return p.themes.find((t) => t.id === p.activeThemeId) ?? p.themes[0];
}
export function activePage(p: Project): Page {
  const t = activeTheme(p);
  return t.pages.find((pg) => pg.id === p.activePageId) ?? t.pages[0];
}

const initialUI: UIState = {
  selectedId: null,
  hoveredId: null,
  device: "desktop",
  hoverState: false,
  leftTab: "components",
  rightTab: "edit",
  clipboard: null,
  zoom: 1,
};

function mapTheme(p: Project, fn: (t: Theme) => Theme): Project {
  return { ...p, themes: p.themes.map((t) => (t.id === p.activeThemeId ? fn(t) : t)) };
}

function mapZone(p: Project, zone: Zone, fn: (nodes: TBNode[]) => TBNode[]): Project {
  const page = activePage(p);
  return mapTheme(p, (t) => setZoneNodes(t, page.id, zone, fn(getZoneNodes(t, page, zone))));
}

export function reIdTheme(t: Theme): Theme {
  return {
    ...JSON.parse(JSON.stringify(t)),
    id: ulid(),
    header: t.header.map(cloneNode),
    footer: t.footer.map(cloneNode),
    pages: t.pages.map((pg) => ({ ...pg, id: ulid(), nodes: pg.nodes.map(cloneNode) })),
  };
}

function commit(state: State, project: Project, key?: string, ui?: Partial<UIState>): State {
  const now = Date.now();
  const merge = key && state.lastKey === key && now - state.lastTime < 1200;
  return {
    ...state,
    project,
    past: merge ? state.past : [...state.past.slice(-79), state.project],
    future: [],
    lastKey: key ?? null,
    lastTime: now,
    ui: ui ? { ...state.ui, ...ui } : state.ui,
  };
}

function reducer(state: State, a: Action): State {
  const p = state.project;
  const theme = activeTheme(p);
  const page = activePage(p);

  switch (a.type) {
    case "LOAD":
      return { ...state, project: withValidSelection(a.project), past: [], future: [], ready: true, ui: { ...state.ui, selectedId: null } };
    case "REMOTE": {
      // Newer copy from the API (e.g. saved from another tab); undo history no longer applies.
      const np = withValidSelection({ ...p, themes: a.themes });
      return { ...state, project: np, past: [], future: [], ui: { ...state.ui, selectedId: null } };
    }
    case "SYNC":
      return { ...state, sync: a.sync };
    case "UI":
      return { ...state, ui: { ...state.ui, ...a.patch } };
    case "UNDO": {
      if (!state.past.length) return state;
      const prev = state.past[state.past.length - 1];
      return { ...state, project: prev, past: state.past.slice(0, -1), future: [state.project, ...state.future], lastKey: null };
    }
    case "REDO": {
      if (!state.future.length) return state;
      const [next, ...rest] = state.future;
      return { ...state, project: next, past: [...state.past, state.project], future: rest, lastKey: null };
    }

    // ---------------- nodes
    case "ADD_NODE": {
      const np = mapZone(p, a.target.zone, (nodes) => insertNode(nodes, a.target.parentId, a.target.index, a.node));
      return commit(state, np, undefined, { selectedId: a.node.id });
    }
    case "MOVE_NODE": {
      const loc = locate(theme, page, a.id);
      if (!loc) return state;
      if (a.target.parentId && containsId(loc.node, a.target.parentId)) return state;
      let index = a.target.index;
      const sameParent = loc.zone === a.target.zone && (loc.parent?.id ?? null) === a.target.parentId;
      if (sameParent && loc.index < index) index -= 1;
      if (sameParent && loc.index === index) return state;
      let np = mapZone(p, loc.zone, (nodes) => removeNode(nodes, a.id).nodes);
      np = mapZone(np, a.target.zone, (nodes) => insertNode(nodes, a.target.parentId, index, loc.node));
      return commit(state, np, undefined, { selectedId: a.id });
    }
    case "DELETE_NODE": {
      const loc = locate(theme, page, a.id);
      if (!loc) return state;
      const np = mapZone(p, loc.zone, (nodes) => removeNode(nodes, a.id).nodes);
      return commit(state, np, undefined, { selectedId: loc.parent?.id ?? null });
    }
    case "DUPLICATE_NODE": {
      const loc = locate(theme, page, a.id);
      if (!loc) return state;
      const copy = cloneNode(loc.node);
      const np = mapZone(p, loc.zone, (nodes) => insertNode(nodes, loc.parent?.id ?? null, loc.index + 1, copy));
      return commit(state, np, undefined, { selectedId: copy.id });
    }
    case "MOVE_SIBLING": {
      const loc = locate(theme, page, a.id);
      if (!loc) return state;
      const siblings = loc.parent ? loc.parent.children ?? [] : getZoneNodes(theme, page, loc.zone);
      const to = loc.index + a.dir;
      if (to < 0 || to >= siblings.length) return state;
      let np = mapZone(p, loc.zone, (nodes) => removeNode(nodes, a.id).nodes);
      np = mapZone(np, loc.zone, (nodes) => insertNode(nodes, loc.parent?.id ?? null, to, loc.node));
      return commit(state, np);
    }
    case "UPDATE_PROPS": {
      const loc = locate(theme, page, a.id);
      if (!loc) return state;
      const np = mapZone(p, loc.zone, (nodes) => updateNode(nodes, a.id, (n) => ({ ...n, props: { ...n.props, ...(a.props as TBNode["props"]) } })));
      return commit(state, np, a.key);
    }
    case "UPDATE_STYLE": {
      const loc = locate(theme, page, a.id);
      if (!loc) return state;
      const np = mapZone(p, loc.zone, (nodes) =>
        updateNode(nodes, a.id, (n) => {
          const current: StyleMap = { ...(n.styles[a.state] ?? {}) };
          for (const [k, v] of Object.entries(a.patch)) {
            if (v === "" || v === undefined || v === null) delete current[k];
            else current[k] = v;
          }
          return { ...n, styles: { ...n.styles, [a.state]: current } };
        })
      );
      return commit(state, np, a.key);
    }
    case "CLEAR_STYLE": {
      const loc = locate(theme, page, a.id);
      if (!loc) return state;
      const np = mapZone(p, loc.zone, (nodes) => updateNode(nodes, a.id, (n) => ({ ...n, styles: { ...n.styles, [a.state]: {} } })));
      return commit(state, np);
    }
    case "RENAME_NODE": {
      const loc = locate(theme, page, a.id);
      if (!loc) return state;
      const np = mapZone(p, loc.zone, (nodes) => updateNode(nodes, a.id, (n) => ({ ...n, name: a.name || undefined })));
      return commit(state, np, "rename:" + a.id);
    }
    case "TOGGLE_HIDDEN": {
      const loc = locate(theme, page, a.id);
      if (!loc) return state;
      const np = mapZone(p, loc.zone, (nodes) => updateNode(nodes, a.id, (n) => ({ ...n, hidden: !n.hidden })));
      return commit(state, np);
    }
    case "COPY": {
      const loc = locate(theme, page, a.id);
      if (!loc) return state;
      return { ...state, ui: { ...state.ui, clipboard: JSON.parse(JSON.stringify(loc.node)) } };
    }
    case "PASTE": {
      if (!state.ui.clipboard) return state;
      const node = cloneNode(state.ui.clipboard);
      const np = mapZone(p, a.target.zone, (nodes) => insertNode(nodes, a.target.parentId, a.target.index, node));
      return commit(state, np, undefined, { selectedId: node.id });
    }

    // ---------------- themes
    case "ADD_THEME": {
      const np = { ...p, themes: [...p.themes, a.theme], activeThemeId: a.theme.id, activePageId: a.theme.pages[0].id };
      return commit(state, np, undefined, { selectedId: null });
    }
    case "DUPLICATE_THEME": {
      const src = p.themes.find((t) => t.id === a.id);
      if (!src) return state;
      const copy = reIdTheme(src);
      copy.name = src.name + " copy";
      const np = { ...p, themes: [...p.themes, copy], activeThemeId: copy.id, activePageId: copy.pages[0].id };
      return commit(state, np, undefined, { selectedId: null });
    }
    case "RENAME_THEME":
      return commit(state, { ...p, themes: p.themes.map((t) => (t.id === a.id ? { ...t, name: a.name } : t)) }, "theme-name:" + a.id);
    case "DELETE_THEME": {
      if (p.themes.length <= 1) return state;
      const themes = p.themes.filter((t) => t.id !== a.id);
      const active = p.activeThemeId === a.id ? themes[0] : activeTheme(p);
      const np = { ...p, themes, activeThemeId: active.id, activePageId: p.activeThemeId === a.id ? active.pages[0].id : p.activePageId };
      return commit(state, np, undefined, { selectedId: null });
    }
    case "SET_THEME": {
      const t = p.themes.find((x) => x.id === a.id);
      if (!t) return state;
      return { ...state, project: { ...p, activeThemeId: t.id, activePageId: t.pages[0].id }, ui: { ...state.ui, selectedId: null } };
    }
    case "UPDATE_TOKENS": {
      const np = mapTheme(p, (t) => ({ ...t, tokens: { ...t.tokens, ...a.patch, colors: { ...t.tokens.colors, ...(a.colors ?? {}) } } }));
      return commit(state, np, a.key);
    }
    case "SET_EVENT_ID":
      return commit(state, mapTheme(p, (t) => ({ ...t, eventId: a.eventId })), "event-id");
    case "SET_CUSTOM_CSS":
      return commit(state, mapTheme(p, (t) => ({ ...t, customCss: a.css })), "custom-css");

    // ---------------- pages
    case "ADD_PAGE": {
      const np = { ...mapTheme(p, (t) => ({ ...t, pages: [...t.pages, a.page] })), activePageId: a.page.id };
      return commit(state, np, undefined, { selectedId: null });
    }
    case "DUPLICATE_PAGE": {
      const src = theme.pages.find((x) => x.id === a.id);
      if (!src) return state;
      const copy: Page = { ...src, id: ulid(), name: src.name + " copy", slug: src.slug + "-copy", nodes: src.nodes.map(cloneNode) };
      const idx = theme.pages.findIndex((x) => x.id === a.id);
      const np = { ...mapTheme(p, (t) => ({ ...t, pages: [...t.pages.slice(0, idx + 1), copy, ...t.pages.slice(idx + 1)] })), activePageId: copy.id };
      return commit(state, np, undefined, { selectedId: null });
    }
    case "UPDATE_PAGE":
      return commit(state, mapTheme(p, (t) => ({ ...t, pages: t.pages.map((x) => (x.id === a.id ? { ...x, ...a.patch } : x)) })), "page:" + a.id);
    case "DELETE_PAGE": {
      if (theme.pages.length <= 1) return state;
      const pages = theme.pages.filter((x) => x.id !== a.id);
      const np = { ...mapTheme(p, (t) => ({ ...t, pages })), activePageId: p.activePageId === a.id ? pages[0].id : p.activePageId };
      return commit(state, np, undefined, { selectedId: null });
    }
    case "SET_PAGE":
      return { ...state, project: { ...p, activePageId: a.id }, ui: { ...state.ui, selectedId: null } };
    case "MOVE_PAGE": {
      const idx = theme.pages.findIndex((x) => x.id === a.id);
      const to = idx + a.dir;
      if (idx < 0 || to < 0 || to >= theme.pages.length) return state;
      const pages = [...theme.pages];
      const [moved] = pages.splice(idx, 1);
      pages.splice(to, 0, moved);
      return commit(state, mapTheme(p, (t) => ({ ...t, pages })));
    }
    default:
      return state;
  }
}

export function isValidProject(x: unknown): x is Project {
  const p = x as Project;
  return !!p && Array.isArray(p.themes) && p.themes.length > 0 && p.themes.every((t) => Array.isArray(t.pages) && t.pages.length > 0 && Array.isArray(t.header) && Array.isArray(t.footer));
}

/**
 * Themes and pages are stored by the API under ULID ids. Older saves used short
 * random ids, so give those (and any duplicates) new ULIDs, keeping the active selection.
 */
export function withUlidIds(p: Project): Project {
  const seen = new Set<string>();
  const remap = new Map<string, string>();
  const fix = (id: string) => {
    if (isUlid(id) && !seen.has(id)) {
      seen.add(id);
      return id;
    }
    const next = ulid();
    if (!remap.has(id)) remap.set(id, next);
    seen.add(next);
    return next;
  };
  const themes = p.themes.map((t) => ({ ...t, id: fix(t.id), pages: t.pages.map((pg) => ({ ...pg, id: fix(pg.id) })) }));
  if (!remap.size) return p;
  return { ...p, themes, activeThemeId: remap.get(p.activeThemeId) ?? p.activeThemeId, activePageId: remap.get(p.activePageId) ?? p.activePageId };
}

/** Keep the active theme/page if they still exist, otherwise fall back to the first ones. */
function withValidSelection(p: Project): Project {
  const theme = p.themes.find((t) => t.id === p.activeThemeId) ?? p.themes[0];
  const page = theme.pages.find((pg) => pg.id === p.activePageId) ?? theme.pages[0];
  return { ...p, activeThemeId: theme.id, activePageId: page.id };
}

interface Ctx {
  state: State;
  dispatch: Dispatch<Action>;
  theme: Theme;
  page: Page;
  /** Try sending unsaved changes to the API again. */
  retrySync: () => void;
}

const BuilderContext = createContext<Ctx | null>(null);

/** The open theme/page live in the URL (?theme=…&page=…), not in browser storage. */
function selectionFromUrl(): { theme: string | null; page: string | null } {
  const q = new URLSearchParams(window.location.search);
  return { theme: q.get("theme"), page: q.get("page") };
}

/** Shown only until the API answers; never saved. */
function placeholderProject(): Project {
  const t = blankTheme("Loading…");
  return { version: 1, themes: [t], activeThemeId: t.id, activePageId: t.pages[0].id };
}

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    project: placeholderProject(),
    past: [],
    future: [],
    ui: initialUI,
    ready: false,
    lastKey: null,
    lastTime: 0,
    sync: { status: "loading" } as SyncState,
  }));

  /** JSON of each theme as last saved to / read from the API, keyed by theme id. */
  const synced = useRef<Map<string, string> | null>(null);
  const syncing = useRef(false);
  const latest = useRef(state.project);
  useEffect(() => {
    latest.current = state.project;
  }, [state.project]);

  const isDirty = useCallback(() => {
    const known = synced.current;
    if (!known) return false;
    const themes = latest.current.themes;
    return known.size !== themes.length || themes.some((t, i) => known.get(t.id) !== themeKey(t, i));
  }, []);

  // Load every theme from the API.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let themes = await fetchThemes();
        if (cancelled) return;
        synced.current = new Map(themes.map((t, i) => [t.id, themeKey(t, i)]));
        // The builder needs at least one theme: start a blank one, which autosave then creates in the API.
        if (!themes.length) themes = [blankTheme("My theme")];
        const sel = selectionFromUrl();
        const project = { version: 1 as const, themes, activeThemeId: sel.theme ?? "", activePageId: sel.page ?? "" };
        dispatch({ type: "SYNC", sync: { status: "saved" } });
        dispatch({ type: "LOAD", project });
      } catch (e) {
        if (!cancelled) dispatch({ type: "SYNC", sync: { status: "error", message: `Could not load themes from the API (${errorText(e)}).` } });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the URL pointing at the open theme and page.
  const { activeThemeId, activePageId } = state.project;
  useEffect(() => {
    if (!state.ready) return;
    const q = new URLSearchParams(window.location.search);
    if (q.get("theme") === activeThemeId && q.get("page") === activePageId) return;
    q.set("theme", activeThemeId);
    q.set("page", activePageId);
    window.history.replaceState(null, "", `${window.location.pathname}?${q}`);
  }, [state.ready, activeThemeId, activePageId]);

  // Send edits to open preview tabs straight away (they load from the API on open).
  const channel = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    channel.current = new BroadcastChannel(PREVIEW_CHANNEL);
    return () => channel.current?.close();
  }, []);
  useEffect(() => {
    if (state.ready) channel.current?.postMessage(state.project);
  }, [state.project, state.ready]);

  // Save changed themes to the API, and delete removed ones.
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runSync = useCallback(async function run(): Promise<void> {
    const known = synced.current;
    if (!known || syncing.current) return;
    const project = latest.current;
    const changed = project.themes.map((t, i) => ({ t, i, key: themeKey(t, i) })).filter((x) => known.get(x.t.id) !== x.key);
    const removed = [...known.keys()].filter((id) => !project.themes.some((t) => t.id === id));
    if (!changed.length && !removed.length) return;

    syncing.current = true;
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
      syncing.current = false;
      return;
    }
    syncing.current = false;
    // Edits made while saving are picked up by another pass.
    if (latest.current !== project) void run();
  }, []);

  useEffect(() => {
    if (!state.ready || !synced.current) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => void runSync(), AUTOSAVE_DELAY_MS);
  }, [state.project, state.ready, runSync]);

  // When the tab comes back into view with nothing unsaved, pick up changes made elsewhere.
  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== "visible" || !synced.current || syncing.current || isDirty()) return;
      try {
        const themes = await fetchThemes();
        if (!themes.length || syncing.current || isDirty()) return;
        const keys = new Map(themes.map((t, i) => [t.id, themeKey(t, i)]));
        const same = keys.size === synced.current.size && [...keys].every(([id, k]) => synced.current?.get(id) === k);
        if (same) return;
        synced.current = keys;
        dispatch({ type: "REMOTE", themes });
      } catch {}
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [isDirty]);

  // Warn before closing the tab while changes are still being sent.
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (isDirty()) e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [isDirty]);

  // Before the first successful load from the API nothing has been compared yet, so reload instead.
  const retrySync = useCallback(() => {
    if (synced.current) void runSync();
    else window.location.reload();
  }, [runSync]);

  const value = useMemo<Ctx>(() => ({ state, dispatch, theme: activeTheme(state.project), page: activePage(state.project), retrySync }), [state, retrySync]);
  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

function themeKey(t: Theme, sort: number): string {
  return JSON.stringify([sort, t]);
}

function errorText(e: unknown): string {
  return e instanceof Error ? e.message : "unknown error";
}

export function useBuilder(): Ctx {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used inside BuilderProvider");
  return ctx;
}
