"use client";

import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import type { Page, Project, Theme } from "./types";
import { googleFontsUrl, themeCss } from "./css";
import { COUNTDOWN_SCRIPT, ZoneView, type RenderCtx } from "./render/NodeView";
import { prefetchEventData } from "./eventData";

export function pageFileName(p: Page, theme: Theme): string {
  return theme.pages[0].id === p.id || p.slug === "home" || p.slug === "index" ? "index.html" : `${p.slug}.html`;
}

function hrefMapper(theme: Theme) {
  return (href: string) => {
    if (!href.startsWith("/")) return href;
    const [path, hash] = href.split("#");
    const slug = path.replace(/^\/+|\/+$/g, "");
    const page = slug === "" ? theme.pages[0] : theme.pages.find((p) => p.slug === slug);
    if (!page) return href;
    return pageFileName(page, theme) + (hash ? "#" + hash : "");
  };
}

function renderBody(theme: Theme, page: Page): string {
  const host = document.createElement("div");
  const root = createRoot(host);
  const rc: RenderCtx = { edit: false, mapHref: hrefMapper(theme), eventId: theme.eventId };
  flushSync(() => {
    root.render(
      <div className="tb-root">
        {page.showHeader ? <ZoneView nodes={theme.header} rc={rc} /> : null}
        <main>
          <ZoneView nodes={page.nodes} rc={rc} />
        </main>
        {page.showFooter ? <ZoneView nodes={theme.footer} rc={rc} /> : null}
      </div>
    );
  });
  const html = host.innerHTML;
  root.unmount();
  return html;
}

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}

export function pageHtml(theme: Theme, page: Page): string {
  const nodes = [...(page.showHeader ? theme.header : []), ...page.nodes, ...(page.showFooter ? theme.footer : [])];
  const css = themeCss(theme, nodes, "media");
  const fonts = googleFontsUrl(theme, nodes);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(page.name)} · ${esc(theme.name)}</title>
${fonts ? `<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n<link rel="stylesheet" href="${fonts}" />` : ""}
<style>
html,body{margin:0;padding:0}
html{scroll-behavior:smooth}
${css}
</style>
</head>
<body>
${renderBody(theme, page)}
<script>${COUNTDOWN_SCRIPT}</script>
</body>
</html>
`;
}

// ---------------------------------------------------------------- tiny ZIP writer (store, no compression)
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function makeZip(files: { name: string; content: string }[]): Blob {
  const enc = new TextEncoder();
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const data = enc.encode(f.content);
    const crc = crc32(data);
    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, dosTime, true);
    lv.setUint16(12, dosDate, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, data.length, true);
    lv.setUint16(26, name.length, true);
    local.set(name, 30);
    chunks.push(local, data);

    const cen = new Uint8Array(46 + name.length);
    const cv = new DataView(cen.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(12, dosTime, true);
    cv.setUint16(14, dosDate, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, name.length, true);
    cv.setUint32(42, offset, true);
    cen.set(name, 46);
    central.push(cen);
    offset += local.length + data.length;
  }
  const cenSize = central.reduce((s, c) => s + c.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, cenSize, true);
  ev.setUint32(16, offset, true);
  return new Blob([...chunks, ...central, end] as BlobPart[], { type: "application/zip" });
}

export function download(name: string, data: Blob | string, type = "text/plain") {
  const blob = typeof data === "string" ? new Blob([data], { type }) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safe(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "theme";
}

/** Event data is fetched first so speakers, tickets etc. are written into the HTML. */
async function prefetchFor(theme: Theme, pages: Page[]) {
  await prefetchEventData([...theme.header, ...theme.footer, ...pages.flatMap((p) => p.nodes)], theme.eventId ?? "");
}

export async function exportPage(theme: Theme, page: Page) {
  await prefetchFor(theme, [page]);
  download(`${safe(theme.name)}-${pageFileName(page, theme)}`, pageHtml(theme, page), "text/html");
}

export async function exportThemeZip(theme: Theme) {
  await prefetchFor(theme, theme.pages);
  const files = theme.pages.map((p) => ({ name: pageFileName(p, theme), content: pageHtml(theme, p) }));
  files.push({ name: "theme.json", content: JSON.stringify(theme, null, 2) });
  download(`${safe(theme.name)}-site.zip`, makeZip(files));
}

export function exportProjectJson(project: Project) {
  download(`theme-builder-project-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(project, null, 2), "application/json");
}
