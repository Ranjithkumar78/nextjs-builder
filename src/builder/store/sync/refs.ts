import type { Project, Theme } from "../../types";

/** Shared between the sync hooks of one BuilderProvider. */
export interface SyncRefs {
  /** JSON of each theme as last saved to / read from the API, keyed by theme id (null until loaded). */
  syncedRef: { current: Map<string, string> | null };
  /** True while a save pass is running. */
  syncingRef: { current: boolean };
  /** The newest project, readable from async code. */
  latestRef: { current: Project };
}

/** JSON per theme object. Edits replace only the edited theme, so unchanged themes are never serialized twice. */
const jsonCache = new WeakMap<Theme, string>();
function themeJson(t: Theme): string {
  let json = jsonCache.get(t);
  if (json === undefined) jsonCache.set(t, (json = JSON.stringify(t)));
  return json;
}

/** Comparable snapshot of a theme at a position in the list (same text as JSON.stringify([sort, t])). */
export function themeKey(t: Theme, sort: number): string {
  return `[${sort},${themeJson(t)}]`;
}

export function keysOf(themes: Theme[]): Map<string, string> {
  return new Map(themes.map((t, i) => [t.id, themeKey(t, i)]));
}

/** Are there changes the API has not seen yet? */
export function isDirty({ syncedRef, latestRef }: SyncRefs): boolean {
  const known = syncedRef.current;
  if (!known) return false;
  const themes = latestRef.current.themes;
  return known.size !== themes.length || themes.some((t, i) => known.get(t.id) !== themeKey(t, i));
}
