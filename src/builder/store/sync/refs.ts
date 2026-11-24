import type { Project } from "../../types";
import type { Versions } from "../../api";
import { isEmptyPlan, planSync, type Snapshot } from "./snapshot";

/** Shared between the sync hooks of one BuilderProvider. */
export interface SyncRefs {
  /** What the API last saw (null until the first load). */
  syncedRef: { current: Snapshot | null };
  /** Saved version of each theme and page, sent with every save so stale saves are rejected. */
  versionsRef: { current: Versions };
  /** True while a save pass is running. */
  syncingRef: { current: boolean };
  /** The newest project, readable from async code. */
  latestRef: { current: Project };
}

/** Are there changes the API has not seen yet? */
export function isDirty({ syncedRef, latestRef }: SyncRefs): boolean {
  return !!syncedRef.current && !isEmptyPlan(planSync(latestRef.current, syncedRef.current));
}

/** Do two version maps describe the same saved state? */
export function sameVersions(a: Versions, b: Versions): boolean {
  return a.size === b.size && [...a].every(([id, v]) => b.get(id) === v);
}
