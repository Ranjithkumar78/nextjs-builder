import type { NodeStyles, StyleMap, StyleState, TBNode } from "../types";
import { walkNodes } from "../tree/find";

export const BREAKPOINTS = { tablet: 1024, mobile: 640 } as const;
export const DEVICE_WIDTH = { desktop: 0, tablet: 820, mobile: 390 } as const;

/**
 * "media" wraps responsive overrides in real media queries (preview/export).
 * A device name is used inside the editor canvas: overrides for that device are applied directly,
 * so what you see matches the device you are editing regardless of the canvas width.
 */
export type QueryMode = "media" | "desktop" | "tablet" | "mobile";

export function kebab(prop: string): string {
  if (prop.startsWith("--")) return prop;
  return prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}

/** Strip characters that could break out of a CSS declaration block. */
export function clean(v: string): string {
  return String(v).replace(/[{}<>]/g, "").trim();
}

export function declarations(map: StyleMap | undefined): string {
  if (!map) return "";
  const parts: string[] = [];
  for (const [k, v] of Object.entries(map)) {
    if (k === "__custom") continue;
    if (v === undefined || v === null || String(v).trim() === "") continue;
    parts.push(`${kebab(k)}:${clean(v)}`);
  }
  const custom = map.__custom ? clean(map.__custom).replace(/\n/g, " ") : "";
  let out = parts.join(";");
  if (custom) out += (out ? ";" : "") + custom;
  return out;
}

export function nodeClass(id: string): string {
  return `tb-n-${id}`;
}

export function stylesToCss(id: string, styles: NodeStyles, mode: QueryMode): string {
  const sel = `.${nodeClass(id)}`;
  let css = "";
  const d = declarations(styles.desktop);
  if (d) css += `${sel}{${d}}\n`;
  const h = declarations(styles.hover);
  if (h) css += `${sel}:hover{${h}}\n`;
  const t = declarations(styles.tablet);
  const m = declarations(styles.mobile);
  if (mode === "media") {
    if (t) css += `@media (max-width: ${BREAKPOINTS.tablet}px){${sel}{${t}}}\n`;
    if (m) css += `@media (max-width: ${BREAKPOINTS.mobile}px){${sel}{${m}}}\n`;
  } else {
    if (t && mode !== "desktop") css += `${sel}{${t}}\n`;
    if (m && mode === "mobile") css += `${sel}{${m}}\n`;
  }
  return css;
}

export function treeCss(nodes: TBNode[], mode: QueryMode): string {
  let css = "";
  walkNodes(nodes, (n) => {
    css += stylesToCss(n.id, n.styles, mode);
    if (n.props.accentColor) css += `.${nodeClass(n.id)} em{color:${clean(String(n.props.accentColor))}}\n`;
  });
  return css;
}

/** Styles in effect for a state: each device inherits from the larger ones, hover from desktop. */
export function mergedStyle(styles: NodeStyles, state: StyleState): StyleMap {
  if (state === "desktop") return { ...styles.desktop };
  if (state === "hover") return { ...styles.desktop, ...(styles.hover ?? {}) };
  if (state === "tablet") return { ...styles.desktop, ...(styles.tablet ?? {}) };
  return { ...styles.desktop, ...(styles.tablet ?? {}), ...(styles.mobile ?? {}) };
}

/** What a state inherits before its own overrides (empty for desktop). */
export function inheritedStyle(styles: NodeStyles, state: StyleState): StyleMap {
  if (state === "desktop") return {};
  if (state === "hover" || state === "tablet") return styles.desktop;
  return mergedStyle(styles, "tablet");
}
