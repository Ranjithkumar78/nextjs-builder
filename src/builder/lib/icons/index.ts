import { BASE_ICON_PATHS } from "./base";
import { EXTRA_ICON_PATHS } from "./extra";

export { SITE_ICONS } from "./extra";

/** Every icon (editor and content), as SVG path data for a 24×24 viewBox; " M" starts a new <path>. */
export const ICON_PATHS: Record<string, string> = { ...BASE_ICON_PATHS, ...EXTRA_ICON_PATHS };

/** Path data split into one string per <path> element. */
export function iconPaths(name: string): string[] {
  const d = ICON_PATHS[name] ?? ICON_PATHS.box;
  return d.split(" M").map((seg, i) => (i === 0 ? seg : "M" + seg));
}
