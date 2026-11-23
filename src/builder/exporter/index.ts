"use client";

import type { Page, Project, Theme } from "../types";
import { prefetchEventData } from "../eventData/cache";
import { download } from "../lib/download";
import { slugify } from "../lib/values";
import { makeZip } from "../lib/zip";
import { pageFileName, pageHtml } from "./html";

export { pageFileName, pageHtml };

const fileBase = (theme: Theme) => slugify(theme.name, "theme");

/** Event data is fetched first so speakers, tickets etc. are written into the HTML. */
async function prefetchFor(theme: Theme, pages: Page[]) {
  await prefetchEventData([...theme.header, ...theme.footer, ...pages.flatMap((p) => p.nodes)], theme.eventId ?? "");
}

export async function exportPage(theme: Theme, page: Page) {
  await prefetchFor(theme, [page]);
  download(`${fileBase(theme)}-${pageFileName(page, theme)}`, pageHtml(theme, page), "text/html");
}

export async function exportThemeZip(theme: Theme) {
  await prefetchFor(theme, theme.pages);
  const files = theme.pages.map((p) => ({ name: pageFileName(p, theme), content: pageHtml(theme, p) }));
  files.push({ name: "theme.json", content: JSON.stringify(theme, null, 2) });
  download(`${fileBase(theme)}-site.zip`, makeZip(files));
}

export function exportProjectJson(project: Project) {
  download(`theme-builder-project-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(project, null, 2), "application/json");
}
