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
:where(${r}) .tb-ev-grid{width:100%;display:grid;gap:var(--ev-gap,24px);grid-template-columns:repeat(auto-fill,minmax(max(var(--ev-min,200px),calc((100% - (var(--ev-cols,4) - 1) * var(--ev-gap,24px)) / var(--ev-cols,4))),1fr))}
:where(${r}) .tb-ev-stack{display:flex;flex-direction:column;gap:16px}
:where(${r}) .tb-ev-stack--lg{gap:40px}
:where(${r}) .tb-ev-group{display:flex;flex-direction:column;gap:18px}
:where(${r}) .tb-ev-group-title{font-size:1.35em;color:var(--tb-text)}
:where(${r}) .tb-ev-align-center{text-align:center;align-items:center}
:where(${r}) .tb-ev-align-left{text-align:left;align-items:flex-start}
:where(${r}) .tb-ev-card{position:relative;display:flex;flex-direction:column;gap:8px;padding:22px;border-radius:var(--tb-radius);background:color-mix(in srgb,var(--tb-surface) 55%,var(--tb-background));color:var(--tb-text);transition:transform .2s,box-shadow .2s}
:where(${r}) .tb-ev-card--elevated{box-shadow:0 1px 2px rgba(15,23,42,.06),0 8px 24px rgba(15,23,42,.08)}
:where(${r}) .tb-ev-card--elevated:hover{transform:translateY(-3px);box-shadow:0 2px 4px rgba(15,23,42,.08),0 16px 32px rgba(15,23,42,.12)}
:where(${r}) .tb-ev-card--bordered{border:1px solid var(--tb-border)}
:where(${r}) .tb-ev-card--filled{background:var(--tb-surface)}
:where(${r}) .tb-ev-card--flat{background:transparent;padding:0}
:where(${r}) .tb-ev-title{font-size:1.1em;line-height:1.3;color:inherit}
:where(${r}) .tb-ev-name{font-weight:600;line-height:1.3}
:where(${r}) .tb-ev-sub{font-size:.875em;color:var(--tb-muted)}
:where(${r}) .tb-ev-desc{font-size:.9em;color:var(--tb-muted);white-space:pre-line;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
:where(${r}) .tb-ev-body{display:flex;flex-direction:column;gap:6px;min-width:0;flex:1}
:where(${r}) .tb-ev-note{padding:18px 20px;border:1px dashed var(--tb-border);border-radius:var(--tb-radius);font-size:14px;color:var(--tb-muted);background:var(--tb-surface)}
:where(${r}) .tb-ev-note--error{border-color:#fca5a5;color:#b91c1c;background:#fef2f2}
:where(${r}) .tb-ev-empty{color:var(--tb-muted);text-align:center;padding:24px 0}
:where(${r}) .tb-ev-skel{height:220px;border-radius:var(--tb-radius);background:linear-gradient(90deg,var(--tb-surface) 25%,var(--tb-border) 50%,var(--tb-surface) 75%);background-size:200% 100%;animation:tb-ev-shine 1.4s linear infinite;opacity:.6}
@keyframes tb-ev-shine{to{background-position:-200% 0}}
:where(${r}) .tb-ev-photo{object-fit:cover;flex-shrink:0;background:var(--tb-surface)}
:where(${r}) .tb-ev-photo--circle{border-radius:50%}
:where(${r}) .tb-ev-photo--rounded{border-radius:calc(var(--tb-radius) + 4px)}
:where(${r}) .tb-ev-photo--square{border-radius:0}
:where(${r}) .tb-ev-photo--lg{width:120px;height:120px;margin-bottom:6px}
:where(${r}) .tb-ev-photo--md{width:84px;height:84px}
:where(${r}) .tb-ev-photo--xs{width:24px;height:24px;font-size:10px}
:where(${r}) .tb-ev-initials{display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:1.6em;color:var(--tb-primary);background:color-mix(in srgb,var(--tb-primary) 12%,transparent)}
:where(${r}) .tb-ev-align-center>.tb-ev-photo,:where(${r}) .tb-ev-align-center .tb-ev-compact>.tb-ev-photo{margin-left:auto;margin-right:auto}
:where(${r}) .tb-ev-row{flex-direction:row;align-items:flex-start;gap:20px}
:where(${r}) .tb-ev-compact{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
:where(${r}) .tb-ev-spot{padding:0;overflow:hidden}
:where(${r}) .tb-ev-spot-img{width:100%;aspect-ratio:4/5;object-fit:cover;display:flex;font-size:3em}
:where(${r}) .tb-ev-spot-text{display:flex;flex-direction:column;gap:6px;padding:16px 18px 20px}
:where(${r}) .tb-ev-scroll{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(220px,260px);gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px 2px 16px}
:where(${r}) .tb-ev-scroll>*{scroll-snap-align:start}
:where(${r}) .tb-ev-logo{height:var(--ev-logo-h,64px);width:auto;max-width:100%;object-fit:contain;display:block}
:where(${r}) .tb-ev-logo-text{display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--tb-muted)}
:where(${r}) .tb-ev-logo-card{align-items:center;justify-content:center;text-align:center;min-height:calc(var(--ev-logo-h,64px) + 44px)}
:where(${r}) .tb-ev-logo-box{display:flex;align-items:center;min-height:var(--ev-logo-h,64px)}
:where(${r}) .tb-ev-align-center .tb-ev-logo-box{justify-content:center}
:where(${r}) .tb-ev-grey .tb-ev-logo{filter:grayscale(1);opacity:.7;transition:filter .2s,opacity .2s}
:where(${r}) .tb-ev-grey :hover>.tb-ev-logo,:where(${r}) .tb-ev-grey .tb-ev-logo:hover{filter:none;opacity:1}
:where(${r}) .tb-ev-strip{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:28px 48px}
:where(${r}) .tb-ev-strip-item{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
:where(${r}) .tb-ev-marquee{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
:where(${r}) .tb-ev-marquee-track{display:flex;width:max-content;gap:56px;animation:tb-ev-marquee 30s linear infinite}
:where(${r}) .tb-ev-marquee:hover .tb-ev-marquee-track{animation-play-state:paused}
:where(${r}) .tb-ev-marquee-copy{display:flex;gap:56px}
@keyframes tb-ev-marquee{to{transform:translateX(calc(-50% - 28px))}}
:where(${r}) .tb-ev-chip{display:inline-flex;align-items:center;align-self:flex-start;gap:4px;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;color:var(--ev-chip,var(--tb-primary));background:color-mix(in srgb,var(--ev-chip,var(--tb-primary)) 12%,transparent)}
:where(${r}) .tb-ev-align-center .tb-ev-chip{align-self:center}
:where(${r}) .tb-ev-chip--off{--ev-chip:#dc2626}
:where(${r}) .tb-ev-link{font-size:.9em;font-weight:600;color:var(--tb-primary)}
:where(${r}) .tb-ev-ticket-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
:where(${r}) .tb-ev-align-center .tb-ev-ticket-head{justify-content:center}
:where(${r}) .tb-ev-price{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
:where(${r}) .tb-ev-align-center .tb-ev-price{justify-content:center}
:where(${r}) .tb-ev-price-now{font-family:var(--tb-heading-font);font-size:1.75em;font-weight:700;color:var(--tb-text)}
:where(${r}) .tb-ev-price-was{color:var(--tb-muted)}
:where(${r}) .tb-ev-pricing .tb-ev-price-now{font-size:2.4em}
:where(${r}) .tb-ev-pricing .tb-ev-card{padding:30px 26px}
:where(${r}) .tb-ev-push{margin-top:auto;padding-top:8px;display:flex}
:where(${r}) .tb-ev-align-center .tb-ev-push{justify-content:center}
:where(${r}) .tb-ev-btn{display:inline-flex;align-items:center;justify-content:center;padding:11px 22px;border-radius:var(--tb-radius);background:var(--tb-primary);color:var(--tb-background);font-weight:600;font-size:.95em;transition:opacity .2s;cursor:pointer}
:where(${r}) .tb-ev-btn:hover{opacity:.88}
:where(${r}) .tb-ev-btn--off{background:var(--tb-border);color:var(--tb-muted);cursor:not-allowed}
:where(${r}) .tb-ev-pricing .tb-ev-btn{width:100%}
:where(${r}) .tb-ev-hl{outline:2px solid var(--tb-primary);outline-offset:-2px}
:where(${r}) .tb-ev-ribbon{position:absolute;top:14px;right:14px;padding:3px 10px;border-radius:999px;background:var(--tb-primary);color:var(--tb-background);font-size:11px;font-weight:700;letter-spacing:.3px}
:where(${r}) .tb-ev-sold{opacity:.65}
:where(${r}) .tb-ev-left{color:var(--tb-accent);font-weight:600}
:where(${r}) .tb-ev-table{display:flex;flex-direction:column;border:1px solid var(--tb-border);border-radius:var(--tb-radius);overflow:hidden}
:where(${r}) .tb-ev-table-row{display:flex;align-items:center;gap:20px;padding:16px 20px;background:var(--tb-background)}
:where(${r}) .tb-ev-table-row+.tb-ev-table-row{border-top:1px solid var(--tb-border)}
:where(${r}) .tb-ev-table-row .tb-ev-price-now{font-size:1.2em}
:where(${r}) .tb-ev-time{font-size:.85em;font-weight:600;color:var(--tb-primary);white-space:nowrap}
:where(${r}) .tb-ev-meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px}
:where(${r}) .tb-ev-people{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin-top:2px}
:where(${r}) .tb-ev-person{display:inline-flex;align-items:center;gap:6px;font-size:.875em;font-weight:500}
:where(${r}) .tb-ev-person .tb-ev-initials{font-size:10px}
:where(${r}) .tb-ev-agenda{flex-direction:row;gap:24px}
:where(${r}) .tb-ev-agenda-time{flex:0 0 160px;padding-top:2px}
:where(${r}) .tb-ev-timeline{list-style:none;position:relative;display:flex;flex-direction:column;gap:22px;padding-left:28px}
:where(${r}) .tb-ev-timeline::before{content:"";position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:var(--tb-border)}
:where(${r}) .tb-ev-timeline-item{position:relative;display:flex;flex-direction:column;gap:8px}
:where(${r}) .tb-ev-dot{position:absolute;left:-27px;top:3px;width:14px;height:14px;border-radius:50%;background:var(--ev-chip,var(--tb-primary));box-shadow:0 0 0 4px var(--tb-background)}
:where(${r}) .tb-ev-timeline-card{gap:6px}
:where(${r}) .tb-ev-tabs{display:flex;flex-direction:column;gap:22px}
:where(${r}) .tb-ev-tabs>input{position:absolute;opacity:0;pointer-events:none;width:0;height:0}
:where(${r}) .tb-ev-tablist{display:flex;flex-wrap:wrap;gap:8px}
:where(${r}) .tb-ev-tablist>label{padding:9px 18px;border:1px solid var(--tb-border);border-radius:999px;font-weight:600;font-size:.95em;cursor:pointer;background:var(--tb-background);transition:background .2s,color .2s}
:where(${r}) .tb-ev-panel{display:none}
:where(${r}) .tb-ev-tabs>input:nth-of-type(1):checked~.tb-ev-panels>.tb-ev-panel:nth-child(1){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(1):checked~.tb-ev-tablist>label:nth-child(1){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(2):checked~.tb-ev-panels>.tb-ev-panel:nth-child(2){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(2):checked~.tb-ev-tablist>label:nth-child(2){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(3):checked~.tb-ev-panels>.tb-ev-panel:nth-child(3){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(3):checked~.tb-ev-tablist>label:nth-child(3){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(4):checked~.tb-ev-panels>.tb-ev-panel:nth-child(4){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(4):checked~.tb-ev-tablist>label:nth-child(4){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(5):checked~.tb-ev-panels>.tb-ev-panel:nth-child(5){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(5):checked~.tb-ev-tablist>label:nth-child(5){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(6):checked~.tb-ev-panels>.tb-ev-panel:nth-child(6){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(6):checked~.tb-ev-tablist>label:nth-child(6){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(7):checked~.tb-ev-panels>.tb-ev-panel:nth-child(7){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(7):checked~.tb-ev-tablist>label:nth-child(7){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(8):checked~.tb-ev-panels>.tb-ev-panel:nth-child(8){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(8):checked~.tb-ev-tablist>label:nth-child(8){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(9):checked~.tb-ev-panels>.tb-ev-panel:nth-child(9){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(9):checked~.tb-ev-tablist>label:nth-child(9){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(10):checked~.tb-ev-panels>.tb-ev-panel:nth-child(10){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(10):checked~.tb-ev-tablist>label:nth-child(10){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(11):checked~.tb-ev-panels>.tb-ev-panel:nth-child(11){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(11):checked~.tb-ev-tablist>label:nth-child(11){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:nth-of-type(12):checked~.tb-ev-panels>.tb-ev-panel:nth-child(12){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(12):checked~.tb-ev-tablist>label:nth-child(12){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}
:where(${r}) .tb-ev-tabs>input:focus-visible~.tb-ev-tablist{outline:2px solid var(--tb-primary);outline-offset:4px;border-radius:12px}
:where(${r}) .tb-ev-agenda,:where(${r}) .tb-ev-row,:where(${r}) .tb-ev-table-row{flex-wrap:wrap}
:where(${r}) .tb-ev-agenda>.tb-ev-body,:where(${r}) .tb-ev-row>.tb-ev-body,:where(${r}) .tb-ev-table-row>.tb-ev-body{flex:1 1 240px}
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
