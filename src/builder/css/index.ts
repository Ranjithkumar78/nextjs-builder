import type { TBNode, Theme, ThemeTokens } from "../types";
import { treeCss, type QueryMode } from "./declarations";
import { baseRules } from "./base-rules";
import { eventCardRules } from "./event-card-rules";
import { eventLayoutRules } from "./event-layout-rules";

export * from "./declarations";
export * from "./fonts";
export * from "./tokens";

/** Base stylesheet for rendered content; depends only on the theme tokens. Uses :where() so every node style wins. */
export function tokensCss(tokens: ThemeTokens, rootSelector = ".tb-root"): string {
  return baseRules(rootSelector, tokens) + eventCardRules(rootSelector).slice(1) + eventLayoutRules(rootSelector).slice(1);
}

export function baseCss(theme: Theme, rootSelector = ".tb-root"): string {
  return tokensCss(theme.tokens, rootSelector);
}

/** The theme's own CSS, added after everything else. */
export function customCss(theme: Theme): string {
  return theme.customCss ? `\n/* custom */\n${theme.customCss}\n` : "";
}

export function themeCss(theme: Theme, nodes: TBNode[], mode: QueryMode, rootSelector = ".tb-root"): string {
  return baseCss(theme, rootSelector) + treeCss(nodes, mode) + customCss(theme);
}
