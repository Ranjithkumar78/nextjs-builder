import type { NodeStyles, StyleMap, TBNode, Theme, ThemeTokens } from "./types";
import { walkNodes } from "./tree";

export const BREAKPOINTS = { tablet: 1024, mobile: 640 } as const;
export const DEVICE_WIDTH = { desktop: 0, tablet: 820, mobile: 390 } as const;

/**
 * "media" wraps responsive overrides in real media queries (preview/export).
 * A device name is used inside the editor canvas: overrides for that device are applied directly,
 * so what you see matches the device you are editing regardless of the canvas width.
 */
export type QueryMode = "media" | "desktop" | "tablet" | "mobile";

export interface FontOption {
  label: string;
  value: string;
  google?: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { label: "System UI", value: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif", google: "Inter:wght@300;400;500;600;700;800" },
  { label: "Jost", value: "'Jost', sans-serif", google: "Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400" },
  { label: "Poppins", value: "'Poppins', sans-serif", google: "Poppins:wght@300;400;500;600;700;800" },
  { label: "Montserrat", value: "'Montserrat', sans-serif", google: "Montserrat:wght@300;400;500;600;700;800" },
  { label: "DM Sans", value: "'DM Sans', sans-serif", google: "DM+Sans:wght@300;400;500;600;700" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif", google: "Space+Grotesk:wght@300;400;500;600;700" },
  { label: "Roboto", value: "'Roboto', sans-serif", google: "Roboto:wght@300;400;500;700;900" },
  { label: "Open Sans", value: "'Open Sans', sans-serif", google: "Open+Sans:wght@300;400;600;700;800" },
  { label: "Lato", value: "'Lato', sans-serif", google: "Lato:wght@300;400;700;900" },
  { label: "Nunito", value: "'Nunito', sans-serif", google: "Nunito:wght@300;400;600;700;800" },
  { label: "Playfair Display", value: "'Playfair Display', serif", google: "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600" },
  { label: "Merriweather", value: "'Merriweather', serif", google: "Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,400" },
  { label: "Lora", value: "'Lora', serif", google: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif", google: "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500" },
  { label: "Bodoni Moda", value: "'Bodoni Moda', serif", google: "Bodoni+Moda:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "JetBrains Mono", value: "'JetBrains Mono', monospace", google: "JetBrains+Mono:wght@400;500;700" },
  { label: "Courier", value: "'Courier New', monospace" },
];

export const THEME_FONT_VARS: FontOption[] = [
  { label: "Theme heading font", value: "var(--tb-heading-font)" },
  { label: "Theme body font", value: "var(--tb-body-font)" },
];

export const COLOR_TOKENS: { key: keyof ThemeTokens["colors"]; label: string; hint: string; css: string }[] = [
  { key: "primary", label: "Primary", hint: "Buttons, highlights, accents", css: "--tb-primary" },
  { key: "secondary", label: "Secondary", hint: "Hover states, gradients", css: "--tb-secondary" },
  { key: "accent", label: "Accent", hint: "Small headings & labels", css: "--tb-accent" },
  { key: "background", label: "Background", hint: "Main page background", css: "--tb-background" },
  { key: "surface", label: "Surface", hint: "Cards & light sections", css: "--tb-surface" },
  { key: "text", label: "Text", hint: "Headings & main text", css: "--tb-text" },
  { key: "muted", label: "Muted text", hint: "Paragraphs & captions", css: "--tb-muted" },
  { key: "border", label: "Border", hint: "Lines & card outlines", css: "--tb-border" },
  { key: "dark", label: "Dark", hint: "Dark section backgrounds", css: "--tb-dark" },
  { key: "onDark", label: "On dark", hint: "Text on dark sections", css: "--tb-on-dark" },
];

/** Fill colors that older saved themes may not have. */
export function fullColors(c: Partial<ThemeTokens["colors"]>): ThemeTokens["colors"] {
  return {
    primary: c.primary ?? "#4f46e5",
    secondary: c.secondary ?? "#7c3aed",
    accent: c.accent ?? "#f59e0b",
    background: c.background ?? "#ffffff",
    surface: c.surface ?? "#f8fafc",
    text: c.text ?? "#0f172a",
    muted: c.muted ?? "#475569",
    border: c.border ?? "#e2e8f0",
    dark: c.dark ?? "#0f172a",
    onDark: c.onDark ?? "#f1f5f9",
  };
}

/** Theme color as a CSS value, e.g. tokenVar("primary") -> var(--tb-primary). */
export function tokenVar(key: keyof ThemeTokens["colors"]): string {
  return `var(${COLOR_TOKENS.find((t) => t.key === key)?.css ?? "--tb-primary"})`;
}

export function kebab(prop: string): string {
  if (prop.startsWith("--")) return prop;
  return prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}

function clean(v: string): string {
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

export function themeVars(tokens: ThemeTokens): string {
  const c = fullColors(tokens.colors);
  return [
    `--tb-primary:${clean(c.primary)}`,
    `--tb-secondary:${clean(c.secondary)}`,
    `--tb-accent:${clean(c.accent)}`,
    `--tb-background:${clean(c.background)}`,
    `--tb-surface:${clean(c.surface)}`,
    `--tb-text:${clean(c.text)}`,
    `--tb-muted:${clean(c.muted)}`,
    `--tb-border:${clean(c.border)}`,
    `--tb-dark:${clean(c.dark)}`,
    `--tb-on-dark:${clean(c.onDark)}`,
    `--tb-heading-font:${clean(tokens.headingFont)}`,
    `--tb-body-font:${clean(tokens.bodyFont)}`,
    `--tb-radius:${clean(tokens.radius)}`,
    `--tb-container:${clean(tokens.containerWidth)}`,
    `--tb-base-size:${clean(tokens.baseFontSize)}`,
  ].join(";");
}

/** Base stylesheet for rendered content. Uses :where() so every node style wins. */
export function baseCss(theme: Theme, rootSelector = ".tb-root"): string {
  const r = rootSelector;
  return `
${r}{${themeVars(theme.tokens)};font-family:var(--tb-body-font);font-size:var(--tb-base-size);color:var(--tb-text);background:var(--tb-background);line-height:1.5;-webkit-font-smoothing:antialiased}
:where(${r}) *,:where(${r}) *::before,:where(${r}) *::after{box-sizing:border-box;margin:0;padding:0;border:0 solid}
:where(${r}) img,:where(${r}) video,:where(${r}) iframe{display:block;max-width:100%}
:where(${r}) a{color:inherit;text-decoration:none}
:where(${r}) h1,:where(${r}) h2,:where(${r}) h3,:where(${r}) h4,:where(${r}) h5,:where(${r}) h6{font-family:var(--tb-heading-font);font-size:inherit;font-weight:700}
:where(${r}) input,:where(${r}) textarea,:where(${r}) select,:where(${r}) button{font:inherit;color:inherit}
:where(${r}) .tb-t-navmenu a,:where(${r}) .tb-t-socials a{color:inherit;transition:opacity .2s}
:where(${r}) .tb-t-navmenu a:hover,:where(${r}) .tb-t-socials a:hover{opacity:.7}
:where(${r}) .tb-field{display:flex;flex-direction:column;gap:6px;width:100%}
:where(${r}) .tb-field-label{font-size:14px;font-weight:600}
:where(${r}) .tb-field-input{width:100%;padding:12px 14px;border:1px solid var(--tb-border);border-radius:var(--tb-radius);background:var(--tb-background);outline:none}
:where(${r}) .tb-field-input:focus{border-color:var(--tb-primary)}
:where(${r}) .tb-cd-box{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:60px;padding:10px 8px 8px;border:1px solid color-mix(in srgb, currentColor 30%, transparent);border-radius:8px;background:color-mix(in srgb, currentColor 6%, transparent)}
:where(${r}) .tb-cd-num{font-family:var(--tb-heading-font);font-size:2em;line-height:1}
:where(${r}) .tb-cd-label{font-size:10px;letter-spacing:1.2px;text-transform:uppercase;opacity:.75;margin-top:6px}
:where(${r}) .tb-embed-ratio{position:relative;width:100%;height:100%}
:where(${r}) .tb-embed-ratio iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
`;
}

export function themeCss(theme: Theme, nodes: TBNode[], mode: QueryMode, rootSelector = ".tb-root"): string {
  return baseCss(theme, rootSelector) + treeCss(nodes, mode) + (theme.customCss ? `\n/* custom */\n${theme.customCss}\n` : "");
}

/** Find every Google font used by the theme tokens and node styles. */
export function googleFontsUrl(theme: Theme, nodes: TBNode[]): string | null {
  const used = new Set<string>();
  const check = (v?: string) => {
    if (!v) return;
    for (const f of FONT_OPTIONS) if (f.google && v.includes(f.value.split(",")[0])) used.add(f.google);
  };
  check(theme.tokens.headingFont);
  check(theme.tokens.bodyFont);
  walkNodes(nodes, (n) => {
    check(n.styles.desktop.fontFamily);
    check(n.styles.tablet?.fontFamily);
    check(n.styles.mobile?.fontFamily);
  });
  if (used.size === 0) return null;
  return `https://fonts.googleapis.com/css2?${[...used].map((g) => `family=${g}`).join("&")}&display=swap`;
}

export function mergedStyle(styles: NodeStyles, state: "desktop" | "tablet" | "mobile" | "hover"): StyleMap {
  if (state === "desktop") return { ...styles.desktop };
  if (state === "hover") return { ...styles.desktop, ...(styles.hover ?? {}) };
  if (state === "tablet") return { ...styles.desktop, ...(styles.tablet ?? {}) };
  return { ...styles.desktop, ...(styles.tablet ?? {}), ...(styles.mobile ?? {}) };
}
