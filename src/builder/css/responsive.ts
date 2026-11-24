import { BREAKPOINTS, type QueryMode } from "./declarations";

type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Rules for screens up to a breakpoint. In preview/export ("media") they go in a media query;
 * in the editor canvas they apply directly when the device being edited is that size or smaller.
 */
export function atMost(mode: QueryMode, bp: Breakpoint, css: string): string {
  if (mode === "media") return `@media (max-width: ${BREAKPOINTS[bp]}px){${css}}\n`;
  const applies = mode === "mobile" || (mode === "tablet" && bp === "tablet");
  return applies ? css + "\n" : "";
}
