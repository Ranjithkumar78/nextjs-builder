import type { ThemeColors, ThemeTokens } from "../types";
import { clean } from "./declarations";

export const COLOR_TOKENS: { key: keyof ThemeColors; label: string; hint: string; css: string }[] = [
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

const DEFAULT_COLORS: ThemeColors = {
  primary: "#4f46e5",
  secondary: "#7c3aed",
  accent: "#f59e0b",
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#0f172a",
  muted: "#475569",
  border: "#e2e8f0",
  dark: "#0f172a",
  onDark: "#f1f5f9",
};

/** Fill colors that older saved themes may not have. */
export function fullColors(c: Partial<ThemeColors>): ThemeColors {
  const out = { ...DEFAULT_COLORS };
  for (const k of Object.keys(DEFAULT_COLORS) as (keyof ThemeColors)[]) out[k] = c[k] ?? DEFAULT_COLORS[k];
  return out;
}

/** Theme color as a CSS value, e.g. tokenVar("primary") -> var(--tb-primary). */
export function tokenVar(key: keyof ThemeColors): string {
  return `var(${COLOR_TOKENS.find((t) => t.key === key)?.css ?? "--tb-primary"})`;
}

/** "var(--tb-on-dark)" -> "onDark" */
export function tokenOf(v: string): keyof ThemeColors | null {
  const m = v.trim().match(/^var\((--tb-[\w-]+)\)$/);
  if (!m) return null;
  return COLOR_TOKENS.find((t) => t.css === m[1])?.key ?? null;
}

/** Resolve a value (hex or theme variable) to a displayable color. */
export function resolveColor(v: string, colors: ThemeColors): string {
  const k = tokenOf(v);
  return k ? (colors[k] ?? v) : v;
}

/** The CSS custom properties that carry a theme's tokens. */
export function themeVars(tokens: ThemeTokens): string {
  const c = fullColors(tokens.colors);
  return [
    ...COLOR_TOKENS.map((t) => `${t.css}:${clean(c[t.key])}`),
    `--tb-heading-font:${clean(tokens.headingFont)}`,
    `--tb-body-font:${clean(tokens.bodyFont)}`,
    `--tb-radius:${clean(tokens.radius)}`,
    `--tb-container:${clean(tokens.containerWidth)}`,
    `--tb-base-size:${clean(tokens.baseFontSize)}`,
  ].join(";");
}
