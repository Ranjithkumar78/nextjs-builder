import type { ThemeTokens } from "../types";
import { themeVars } from "./tokens";

/** Reset, typography and form/countdown/embed basics for rendered content. Uses :where() so every node style wins. */
export function baseRules(r: string, tokens: ThemeTokens): string {
  return `
${r}{${themeVars(tokens)};font-family:var(--tb-body-font);font-size:var(--tb-base-size);color:var(--tb-text);background:var(--tb-background);line-height:1.5;-webkit-font-smoothing:antialiased}
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
