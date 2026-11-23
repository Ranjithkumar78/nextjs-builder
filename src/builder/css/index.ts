import type { TBNode, Theme } from "../types";
import { treeCss, type QueryMode } from "./declarations";
import { baseRules } from "./base-rules";
import { eventCardRules } from "./event-card-rules";
import { eventLayoutRules } from "./event-layout-rules";

export * from "./declarations";
export * from "./fonts";
export * from "./tokens";

/** Base stylesheet for rendered content. Uses :where() so every node style wins. */
export function baseCss(theme: Theme, rootSelector = ".tb-root"): string {
  return baseRules(rootSelector, theme.tokens) + eventCardRules(rootSelector).slice(1) + eventLayoutRules(rootSelector).slice(1);
}

export function themeCss(theme: Theme, nodes: TBNode[], mode: QueryMode, rootSelector = ".tb-root"): string {
  return baseCss(theme, rootSelector) + treeCss(nodes, mode) + (theme.customCss ? `\n/* custom */\n${theme.customCss}\n` : "");
}
