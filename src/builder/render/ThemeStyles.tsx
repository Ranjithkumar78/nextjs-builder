"use client";

import { useMemo } from "react";
import type { TBNode, Theme } from "../types";
import { googleFontsUrl, themeCss, type QueryMode } from "../css";

/** The theme's stylesheet and Google Fonts link for a set of rendered nodes. */
export function ThemeStyles({ theme, nodes, mode, prefix = "" }: { theme: Theme; nodes: TBNode[]; mode: QueryMode; prefix?: string }) {
  const css = useMemo(() => themeCss(theme, nodes, mode), [theme, nodes, mode]);
  const fonts = useMemo(() => googleFontsUrl(theme, nodes), [theme, nodes]);
  return (
    <>
      {fonts ? <link rel="stylesheet" href={fonts} /> : null}
      <style>{prefix + css}</style>
    </>
  );
}
