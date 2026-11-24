import type { TBNode, Theme, ThemeTokens } from "../types";
import { treeCss, type QueryMode } from "./declarations";
import { baseRules } from "./base-rules";
import { eventCardRules } from "./event-card-rules";
import { eventLayoutRules } from "./event-layout-rules";
import { componentRules } from "./components";

export * from "./declarations";
export * from "./fonts";
export * from "./tokens";
export { atMost } from "./responsive";

/** Base stylesheet for rendered content; depends only on the theme tokens. Uses :where() so every node style wins. */
export function tokensCss(tokens: ThemeTokens, rootSelector = ".tb-root", mode: QueryMode = "media"): string {
  const r = rootSelector;
  return baseRules(r, tokens) + eventCardRules(r).slice(1) + eventLayoutRules(r).slice(1) + componentRules(r, mode);
}

export function baseCss(theme: Theme, rootSelector = ".tb-root", mode: QueryMode = "media"): string {
  return tokensCss(theme.tokens, rootSelector, mode);
}

/** The theme's own CSS, added after everything else. */
export function customCss(theme: Theme): string {
  return theme.customCss ? `\n/* custom */\n${theme.customCss}\n` : "";
}

export function themeCss(theme: Theme, nodes: TBNode[], mode: QueryMode, rootSelector = ".tb-root"): string {
  return baseCss(theme, rootSelector, mode) + treeCss(nodes, mode) + customCss(theme);
}
