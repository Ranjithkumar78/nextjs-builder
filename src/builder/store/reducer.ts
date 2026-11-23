import type { Action, NodeAction, PageAction, State, ThemeAction } from "./types";
import { redo, undo } from "./history";
import { withValidSelection } from "./selectors";
import { nodesReducer } from "./reducers/nodes";
import { themesReducer } from "./reducers/themes";
import { pagesReducer } from "./reducers/pages";

const THEME_ACTIONS = new Set<Action["type"]>(["ADD_THEME", "DUPLICATE_THEME", "RENAME_THEME", "DELETE_THEME", "SET_THEME", "UPDATE_TOKENS", "SET_CUSTOM_CSS", "SET_EVENT_ID"]);
const PAGE_ACTIONS = new Set<Action["type"]>(["ADD_PAGE", "DUPLICATE_PAGE", "UPDATE_PAGE", "DELETE_PAGE", "SET_PAGE", "MOVE_PAGE"]);

export function reducer(state: State, a: Action): State {
  switch (a.type) {
    case "LOAD":
      return { ...state, project: withValidSelection(a.project), past: [], future: [], ready: true, ui: { ...state.ui, selectedId: null } };
    case "REMOTE":
      // Newer copy from the API (e.g. saved from another tab); undo history no longer applies.
      return { ...state, project: withValidSelection({ ...state.project, themes: a.themes }), past: [], future: [], ui: { ...state.ui, selectedId: null } };
    case "UI":
      return { ...state, ui: { ...state.ui, ...a.patch } };
    case "UNDO":
      return undo(state);
    case "REDO":
      return redo(state);
  }
  if (THEME_ACTIONS.has(a.type)) return themesReducer(state, a as ThemeAction);
  if (PAGE_ACTIONS.has(a.type)) return pagesReducer(state, a as PageAction);
  return nodesReducer(state, a as NodeAction);
}
