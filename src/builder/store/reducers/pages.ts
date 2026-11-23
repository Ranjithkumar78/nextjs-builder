import type { Page } from "../../types";
import { cloneNode } from "../../tree";
import { moveItem } from "../../lib/values";
import { ulid } from "../../ulid";
import { commit, select } from "../history";
import { activeTheme, mapTheme } from "../selectors";
import type { PageAction, State } from "../types";

/** Replace the active theme's pages, open `activePageId` and clear the selection. */
function setPages(state: State, pages: Page[], activePageId: string): State {
  const np = { ...mapTheme(state.project, (t) => ({ ...t, pages })), activePageId };
  return commit(state, np, undefined, { selectedId: null });
}

export function pagesReducer(state: State, a: PageAction): State {
  const p = state.project;
  const pages = activeTheme(p).pages;
  switch (a.type) {
    case "ADD_PAGE":
      return setPages(state, [...pages, a.page], a.page.id);
    case "DUPLICATE_PAGE": {
      const idx = pages.findIndex((x) => x.id === a.id);
      if (idx < 0) return state;
      const src = pages[idx];
      const copy: Page = { ...src, id: ulid(), name: src.name + " copy", slug: src.slug + "-copy", nodes: src.nodes.map(cloneNode) };
      return setPages(state, [...pages.slice(0, idx + 1), copy, ...pages.slice(idx + 1)], copy.id);
    }
    case "UPDATE_PAGE":
      return commit(state, mapTheme(p, (t) => ({ ...t, pages: t.pages.map((x) => (x.id === a.id ? { ...x, ...a.patch } : x)) })), "page:" + a.id);
    case "DELETE_PAGE": {
      if (pages.length <= 1) return state;
      const rest = pages.filter((x) => x.id !== a.id);
      return setPages(state, rest, p.activePageId === a.id ? rest[0].id : p.activePageId);
    }
    case "SET_PAGE":
      return select(state, { ...p, activePageId: a.id });
    case "MOVE_PAGE": {
      const idx = pages.findIndex((x) => x.id === a.id);
      const moved = moveItem(pages, idx, idx + a.dir);
      return moved === pages ? state : commit(state, mapTheme(p, (t) => ({ ...t, pages: moved })));
    }
  }
}
