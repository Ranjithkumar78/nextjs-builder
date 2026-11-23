import type { Project } from "../types";
import { blankTheme } from "../defaults";
import type { State, UIState } from "./types";

const HISTORY_LIMIT = 80;
/** Edits with the same key within this time are merged into one undo step (e.g. typing). */
const MERGE_MS = 1200;

export const initialUI: UIState = {
  selectedId: null,
  hoveredId: null,
  device: "desktop",
  hoverState: false,
  leftTab: "components",
  rightTab: "edit",
  clipboard: null,
  zoom: 1,
};

/** Shown only until the API answers; never saved. */
function placeholderProject(): Project {
  const t = blankTheme("Loading…");
  return { version: 1, themes: [t], activeThemeId: t.id, activePageId: t.pages[0].id };
}

export function initialState(): State {
  return { project: placeholderProject(), past: [], future: [], ui: initialUI, ready: false, lastKey: null, lastTime: 0, sync: { status: "loading" } };
}

/** Record an edit: push the previous project onto the undo stack (or merge with the last step). */
export function commit(state: State, project: Project, key?: string, ui?: Partial<UIState>): State {
  const now = Date.now();
  const merge = key && state.lastKey === key && now - state.lastTime < MERGE_MS;
  return {
    ...state,
    project,
    past: merge ? state.past : [...state.past.slice(-(HISTORY_LIMIT - 1)), state.project],
    future: [],
    lastKey: key ?? null,
    lastTime: now,
    ui: ui ? { ...state.ui, ...ui } : state.ui,
  };
}

/** A project change that is not an edit (switching theme/page): no undo step. */
export function select(state: State, project: Project): State {
  return { ...state, project, ui: { ...state.ui, selectedId: null } };
}

export function undo(state: State): State {
  if (!state.past.length) return state;
  const prev = state.past[state.past.length - 1];
  return { ...state, project: prev, past: state.past.slice(0, -1), future: [state.project, ...state.future], lastKey: null };
}

export function redo(state: State): State {
  if (!state.future.length) return state;
  const [next, ...rest] = state.future;
  return { ...state, project: next, past: [...state.past, state.project], future: rest, lastKey: null };
}
