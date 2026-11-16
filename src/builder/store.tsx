"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type Dispatch, type ReactNode } from "react";
import type { Device, DropTarget, Page, Project, StyleMap, StyleState, TBNode, Theme, ThemeColors, ThemeTokens, Zone } from "./types";
import { cloneNode, containsId, getZoneNodes, insertNode, locate, removeNode, setZoneNodes, uid, updateNode } from "./tree";
import { defaultProject, mahatmaTheme } from "./defaults";
import { fullColors } from "./css";

export const STORAGE_KEY = "custom-theme-builder:project:v1";

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
  savedAt: number;
}

export type Action =
  | { type: "LOAD"; project: Project }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "UI"; patch: Partial<UIState> }
  | { type: "SAVED" }
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

function reIdTheme(t: Theme): Theme {
  return {
    ...JSON.parse(JSON.stringify(t)),
    id: uid("t"),
    header: t.header.map(cloneNode),
    footer: t.footer.map(cloneNode),
    pages: t.pages.map((pg) => ({ ...pg, id: uid("p"), nodes: pg.nodes.map(cloneNode) })),
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
      return { ...state, project: a.project, past: [], future: [], ready: true, ui: { ...state.ui, selectedId: null } };
    case "SAVED":
      return { ...state, savedAt: Date.now() };
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
      const copy: Page = { ...src, id: uid("p"), name: src.name + " copy", slug: src.slug + "-copy", nodes: src.nodes.map(cloneNode) };
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

export function loadProject(): Project | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidProject(parsed)) return null;
    // older saves may miss newer palette colors
    return { ...parsed, themes: parsed.themes.map((t) => ({ ...t, tokens: { ...t.tokens, colors: fullColors(t.tokens.colors) } })) };
  } catch {
    return null;
  }
}

interface Ctx {
  state: State;
  dispatch: Dispatch<Action>;
  theme: Theme;
  page: Page;
}

const BuilderContext = createContext<Ctx | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    project: defaultProject(),
    past: [],
    future: [],
    ui: initialUI,
    ready: false,
    lastKey: null,
    lastTime: 0,
    savedAt: 0,
  }));

  useEffect(() => {
    let saved = loadProject();
    try {
      // v1 added the Mahatma theme; v2 replaces it with the version whose colors follow the theme palette.
      const SEED1 = "custom-theme-builder:seed:mahatma";
      const SEED2 = "custom-theme-builder:seed:mahatma-v2";
      if (saved && !localStorage.getItem(SEED2)) {
        const m = mahatmaTheme();
        const idx = saved.themes.findIndex((t) => t.name === m.name);
        if (idx >= 0) {
          const themes = [...saved.themes];
          const wasActive = saved.activeThemeId === themes[idx].id;
          themes[idx] = m;
          saved = { ...saved, themes, ...(wasActive ? { activeThemeId: m.id, activePageId: m.pages[0].id } : {}) };
        } else if (!localStorage.getItem(SEED1)) {
          saved = { ...saved, themes: [m, ...saved.themes], activeThemeId: m.id, activePageId: m.pages[0].id };
        }
      }
      localStorage.setItem(SEED1, "1");
      localStorage.setItem(SEED2, "1");
    } catch {}
    dispatch({ type: "LOAD", project: saved ?? state.project });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!state.ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.project));
        dispatch({ type: "SAVED" });
      } catch (e) {
        console.warn("Could not save project", e);
      }
    }, 400);
  }, [state.project, state.ready]);

  const value = useMemo<Ctx>(() => ({ state, dispatch, theme: activeTheme(state.project), page: activePage(state.project) }), [state]);
  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder(): Ctx {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used inside BuilderProvider");
  return ctx;
}
