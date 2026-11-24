import { deletePage, deleteTheme, savePage, saveThemeSettings, type Versions } from "../../api";
import { forget, pageSnap, themeSnap, type Snapshot, type SyncPlan } from "./snapshot";

/**
 * Run the API calls of a plan in order. The snapshot and versions are updated after each call,
 * so a failure part-way leaves them matching what the server really has.
 */
export async function runPlan(plan: SyncPlan, snap: Snapshot, versions: Versions): Promise<void> {
  for (const { theme, sort } of plan.themes) {
    versions.set(theme.id, await saveThemeSettings(theme, sort, versions.get(theme.id) ?? null));
    snap.themes.set(theme.id, themeSnap(theme, sort));
  }
  for (const { themeId, page, sort } of plan.pages) {
    versions.set(page.id, await savePage(themeId, page, sort, versions.get(page.id) ?? null));
    snap.pages.set(page.id, pageSnap(themeId, page, sort));
  }
  for (const { themeId, pageId } of plan.deletedPages) {
    await deletePage(themeId, pageId);
    forget(snap, pageId).forEach((g) => versions.delete(g));
  }
  for (const id of plan.deletedThemes) {
    await deleteTheme(id);
    forget(snap, id).forEach((g) => versions.delete(g));
  }
}
