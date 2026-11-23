"use client";

import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import type { Page, Theme } from "../types";
import { googleFontsUrl, themeCss } from "../css";
import { SiteBody, type RenderCtx } from "../render";
import { COUNTDOWN_SCRIPT } from "../lib/countdown";
import { escapeHtml } from "../lib/html";
import { pageForHref, pageNodes } from "../tree/pages";

/** File name of a page in an exported site (the first/home page is index.html). */
export function pageFileName(p: Page, theme: Theme): string {
  return theme.pages[0].id === p.id || p.slug === "home" || p.slug === "index" ? "index.html" : `${p.slug}.html`;
}

/** Site links ("/about#team") point at the exported files ("about.html#team"). */
function hrefMapper(theme: Theme) {
  return (href: string) => {
    const target = pageForHref(theme, href);
    return target ? pageFileName(target.page, theme) + (target.hash ? "#" + target.hash : "") : href;
  };
}

/** Render a page to static HTML (event data must already be cached, see prefetchEventData). */
function renderBody(theme: Theme, page: Page): string {
  const host = document.createElement("div");
  const root = createRoot(host);
  const rc: RenderCtx = { edit: false, mapHref: hrefMapper(theme), eventId: theme.eventId };
  flushSync(() => root.render(<SiteBody theme={theme} page={page} rc={rc} />));
  const html = host.innerHTML;
  root.unmount();
  return html;
}

const fontLinks = (url: string) => `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="${url}" />`;

/** A complete, standalone HTML document for one page. */
export function pageHtml(theme: Theme, page: Page): string {
  const nodes = pageNodes(theme, page);
  const fonts = googleFontsUrl(theme.tokens, nodes);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(page.name)} · ${escapeHtml(theme.name)}</title>
${fonts ? fontLinks(fonts) : ""}
<style>
html,body{margin:0;padding:0}
html{scroll-behavior:smooth}
${themeCss(theme, nodes, "media")}
</style>
</head>
<body>
${renderBody(theme, page)}
<script>${COUNTDOWN_SCRIPT}</script>
</body>
</html>
`;
}
