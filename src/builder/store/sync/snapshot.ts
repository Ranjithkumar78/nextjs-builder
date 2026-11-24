import type { Page, Project, Theme } from "../../types";

/**
 * What the API last saw, kept as object references: edits always create new objects, so comparing
 * references finds every change without serializing anything.
 */
export interface Snapshot {
  themes: Map<string, ThemeSnap>;
  /** By page id (page ids are unique across themes). */
  pages: Map<string, PageSnap>;
}

type ThemeSnap = Pick<Theme, "name" | "eventId" | "tokens" | "header" | "footer" | "customCss"> & { sort: number };
type PageSnap = { themeId: string; page: Page; sort: number };

/** The API calls needed to bring the server in line with the project, in the order they must run. */
export interface SyncPlan {
  themes: { theme: Theme; sort: number }[];
  pages: { themeId: string; page: Page; sort: number }[];
  deletedPages: { themeId: string; pageId: string }[];
  deletedThemes: string[];
}

export const themeSnap = (t: Theme, sort: number): ThemeSnap => ({ name: t.name, eventId: t.eventId, tokens: t.tokens, header: t.header, footer: t.footer, customCss: t.customCss, sort });
export const pageSnap = (themeId: string, page: Page, sort: number): PageSnap => ({ themeId, page, sort });

export function snapshotOf(themes: Theme[]): Snapshot {
  const snap: Snapshot = { themes: new Map(), pages: new Map() };
  themes.forEach((t, i) => {
    snap.themes.set(t.id, themeSnap(t, i));
    t.pages.forEach((p, j) => snap.pages.set(p.id, pageSnap(t.id, p, j)));
  });
  return snap;
}

function sameTheme(a: ThemeSnap | undefined, b: ThemeSnap): boolean {
  return !!a && (Object.keys(b) as (keyof ThemeSnap)[]).every((k) => a[k] === b[k]);
}

/** New/changed themes first (pages need their theme), then pages, then deletions. */
export function planSync(project: Project, snap: Snapshot): SyncPlan {
  const plan: SyncPlan = { themes: [], pages: [], deletedPages: [], deletedThemes: [] };
  const livePages = new Set<string>();
  project.themes.forEach((theme, sort) => {
    if (!sameTheme(snap.themes.get(theme.id), themeSnap(theme, sort))) plan.themes.push({ theme, sort });
    theme.pages.forEach((page, i) => {
      livePages.add(page.id);
      const known = snap.pages.get(page.id);
      if (!known || known.page !== page || known.sort !== i || known.themeId !== theme.id) plan.pages.push({ themeId: theme.id, page, sort: i });
    });
  });
  const liveThemes = new Set(project.themes.map((t) => t.id));
  snap.themes.forEach((_, id) => !liveThemes.has(id) && plan.deletedThemes.push(id));
  // Pages of a deleted theme go with it on the server.
  snap.pages.forEach((p, id) => !livePages.has(id) && liveThemes.has(p.themeId) && plan.deletedPages.push({ themeId: p.themeId, pageId: id }));
  return plan;
}

export const isEmptyPlan = (p: SyncPlan): boolean => !p.themes.length && !p.pages.length && !p.deletedPages.length && !p.deletedThemes.length;

/** Forget deleted records (pages of a deleted theme included); returns every id forgotten. */
export function forget(snap: Snapshot, id: string): string[] {
  const gone = [id];
  snap.themes.delete(id);
  snap.pages.delete(id);
  snap.pages.forEach((p, pageId) => p.themeId === id && gone.push(pageId));
  gone.forEach((g) => snap.pages.delete(g));
  return gone;
}
