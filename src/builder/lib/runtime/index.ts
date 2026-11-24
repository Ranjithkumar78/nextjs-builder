import { runtimeUi } from "./ui";
import { runtimeScroll } from "./scroll";
import { runtimeSlider } from "./slider";
import { runtimeLightbox } from "./lightbox";

/**
 * Behaviour for published pages: menu, popups, accordions, slider, lightbox, animations, counters, share.
 * Each part is a self-contained function, so the preview calls them and exports inline their source.
 */
const PARTS = [runtimeUi, runtimeScroll, runtimeSlider, runtimeLightbox];

/** Start everything on the current page; returns a function that stops it (used by the live preview). */
export function startRuntime(): () => void {
  const stops = PARTS.map((start) => start());
  return () => stops.forEach((stop) => stop());
}

/** The same code as an inline script for exported HTML. */
export function runtimeScript(): string {
  return PARTS.map((fn) => `(${fn.toString()})();`).join("\n");
}
