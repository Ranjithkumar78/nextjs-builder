import type { DropTarget, Page, Project, TBNode, Theme, Zone } from "../types";
import { cloneNode, getZoneNodes, locate, setZoneNodes } from "../tree";
import { isContainer } from "../registry";
import { isUlid, ulid } from "../ulid";
import { deepClone } from "../lib/values";
import type { State } from "./types";

export function activeTheme(p: Project): Theme {
  return p.themes.find((t) => t.id === p.activeThemeId) ?? p.themes[0];
}

export function activePage(p: Project): Page {
  const t = activeTheme(p);
  return t.pages.find((pg) => pg.id === p.activePageId) ?? t.pages[0];
}

/** Keep the active theme/page if they still exist, otherwise fall back to the first ones. */
export function withValidSelection(p: Project): Project {
  const theme = activeTheme(p);
  const page = theme.pages.find((pg) => pg.id === p.activePageId) ?? theme.pages[0];
  return { ...p, activeThemeId: theme.id, activePageId: page.id };
}

/** Change the active theme. */
export function mapTheme(p: Project, fn: (t: Theme) => Theme): Project {
  return { ...p, themes: p.themes.map((t) => (t.id === p.activeThemeId ? fn(t) : t)) };
}

/** Change the nodes of one zone (header, active page, footer) of the active theme. */
export function mapZone(p: Project, zone: Zone, fn: (nodes: TBNode[]) => TBNode[]): Project {
  const page = activePage(p);
  return mapTheme(p, (t) => setZoneNodes(t, page.id, zone, fn(getZoneNodes(t, page, zone))));
}

/** Copy of a theme with new ids for the theme, its pages and every node. */
export function reIdTheme(t: Theme): Theme {
  return {
    ...deepClone(t),
    id: ulid(),
    header: t.header.map(cloneNode),
    footer: t.footer.map(cloneNode),
    pages: t.pages.map((pg) => ({ ...pg, id: ulid(), nodes: pg.nodes.map(cloneNode) })),
  };
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

/** Where a clicked (not dragged) component should be inserted. */
export function smartTarget(state: State): DropTarget {
  const theme = activeTheme(state.project);
  const page = activePage(state.project);
  const id = state.ui.selectedId;
  const loc = id ? locate(theme, page, id) : null;
  if (loc) {
    if (isContainer(loc.node.type)) return { zone: loc.zone, parentId: loc.node.id, index: loc.node.children?.length ?? 0 };
    return { zone: loc.zone, parentId: loc.parent?.id ?? null, index: loc.index + 1 };
  }
  return { zone: "page", parentId: null, index: page.nodes.length };
}
