import type { Page, TBNode, Theme } from "../types";
import { ulid } from "../ulid";

/** Every node rendered on a page: the global header and footer (when shown) around the page's own nodes. */
export function pageNodes(theme: Theme, page: Page): TBNode[] {
  return [...(page.showHeader ? theme.header : []), ...page.nodes, ...(page.showFooter ? theme.footer : [])];
}

/** The link that points at a page inside the site ("/" for the home page). */
export function pageHref(p: Page): string {
  return p.slug === "home" || p.slug === "index" ? "/" : `/${p.slug}`;
}

/** The page a site-relative link ("/about#team") points at, if any. */
export function pageForHref(theme: Theme, href: string): { page: Page; hash: string } | null {
  if (!href.startsWith("/")) return null;
  const [path, hash = ""] = href.split("#");
  const slug = path.replace(/^\/+|\/+$/g, "");
  const page = slug === "" ? theme.pages[0] : theme.pages.find((p) => p.slug === slug);
  return page ? { page, hash } : null;
}

export function newPage(name: string, slug: string, nodes: TBNode[] = []): Page {
  return { id: ulid(), name, slug, nodes, showHeader: true, showFooter: true };
}
