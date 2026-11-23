import type { Theme } from "../../types";
import { commit, select } from "../history";
import { activeTheme, mapTheme, reIdTheme } from "../selectors";
import type { State, ThemeAction } from "../types";

/** Add a theme and open its first page. */
function addTheme(state: State, theme: Theme): State {
  const p = state.project;
  return commit(state, { ...p, themes: [...p.themes, theme], activeThemeId: theme.id, activePageId: theme.pages[0].id }, undefined, { selectedId: null });
}

export function themesReducer(state: State, a: ThemeAction): State {
  const p = state.project;
  switch (a.type) {
    case "ADD_THEME":
      return addTheme(state, a.theme);
    case "DUPLICATE_THEME": {
      const src = p.themes.find((t) => t.id === a.id);
      return src ? addTheme(state, { ...reIdTheme(src), name: src.name + " copy" }) : state;
    }
    case "RENAME_THEME":
      return commit(state, { ...p, themes: p.themes.map((t) => (t.id === a.id ? { ...t, name: a.name } : t)) }, "theme-name:" + a.id);
    case "DELETE_THEME": {
      if (p.themes.length <= 1) return state;
      const themes = p.themes.filter((t) => t.id !== a.id);
      const wasActive = p.activeThemeId === a.id;
      const active = wasActive ? themes[0] : activeTheme(p);
      const np = { ...p, themes, activeThemeId: active.id, activePageId: wasActive ? active.pages[0].id : p.activePageId };
      return commit(state, np, undefined, { selectedId: null });
    }
    case "SET_THEME": {
      const t = p.themes.find((x) => x.id === a.id);
      return t ? select(state, { ...p, activeThemeId: t.id, activePageId: t.pages[0].id }) : state;
    }
    case "UPDATE_TOKENS": {
      const np = mapTheme(p, (t) => ({ ...t, tokens: { ...t.tokens, ...a.patch, colors: { ...t.tokens.colors, ...(a.colors ?? {}) } } }));
      return commit(state, np, a.key);
    }
    case "SET_EVENT_ID":
      return commit(state, mapTheme(p, (t) => ({ ...t, eventId: a.eventId })), "event-id");
    case "SET_CUSTOM_CSS":
      return commit(state, mapTheme(p, (t) => ({ ...t, customCss: a.css })), "custom-css");
  }
}
