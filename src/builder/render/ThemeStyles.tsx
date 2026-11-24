"use client";

import { useMemo } from "react";
import type { TBNode, Theme } from "../types";
import { customCss, googleFontsUrl, tokensCss, treeCss, type QueryMode } from "../css";

/**
 * The theme's stylesheet and Google Fonts link for a set of rendered nodes.
 * Split in two <style> tags so an edit to one element doesn't rebuild the theme's base CSS.
 */
export function ThemeStyles({ theme, nodes, mode, prefix = "" }: { theme: Theme; nodes: TBNode[]; mode: QueryMode; prefix?: string }) {
  const { tokens } = theme;
  const base = useMemo(() => tokensCss(tokens, ".tb-root", mode), [tokens, mode]);
  const tree = useMemo(() => treeCss(nodes, mode), [nodes, mode]);
  const fonts = useMemo(() => googleFontsUrl(tokens, nodes), [tokens, nodes]);
  return (
    <>
      {fonts ? <link rel="stylesheet" href={fonts} /> : null}
      <style>{prefix + base}</style>
      <style>{tree + customCss(theme)}</style>
    </>
  );
}
