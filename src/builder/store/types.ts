import type { Device, DropTarget, Page, Project, StyleMap, StyleState, TBNode, Theme, ThemeColors, ThemeTokens } from "../types";

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

export type SyncStatus = "loading" | "saving" | "saved" | "error";
export interface SyncState {
  status: SyncStatus;
  message?: string;
  at?: number;
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

export type NodeAction =
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
  | { type: "PASTE"; target: DropTarget };

export type ThemeAction =
  | { type: "ADD_THEME"; theme: Theme }
  | { type: "DUPLICATE_THEME"; id: string }
  | { type: "RENAME_THEME"; id: string; name: string }
  | { type: "DELETE_THEME"; id: string }
  | { type: "SET_THEME"; id: string }
  | { type: "UPDATE_TOKENS"; patch: Partial<Omit<ThemeTokens, "colors">>; colors?: Partial<ThemeColors>; key?: string }
  | { type: "SET_CUSTOM_CSS"; css: string }
  | { type: "SET_EVENT_ID"; eventId: string };

export type PageAction =
  | { type: "ADD_PAGE"; page: Page }
  | { type: "DUPLICATE_PAGE"; id: string }
  | { type: "UPDATE_PAGE"; id: string; patch: Partial<Omit<Page, "id" | "nodes">> }
  | { type: "DELETE_PAGE"; id: string }
  | { type: "SET_PAGE"; id: string }
  | { type: "MOVE_PAGE"; id: string; dir: -1 | 1 };

export type AppAction =
  | { type: "LOAD"; project: Project }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "UI"; patch: Partial<UIState> }
  | { type: "SYNC"; sync: SyncState }
  | { type: "REMOTE"; themes: Theme[] };

export type Action = AppAction | NodeAction | ThemeAction | PageAction;
