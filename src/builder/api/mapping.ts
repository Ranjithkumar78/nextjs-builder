import type { Page, TBNode, Theme, ThemeTokens } from "../types";
import { fullColors } from "../css/tokens";

export interface ApiPage {
  id: string;
  name: string;
  slug: string;
  nodes: TBNode[];
  show_header: boolean;
  show_footer: boolean;
  sort: number;
  version: number;
}

export interface ApiTheme {
  id: string;
  name: string;
  event_id: string | null;
  tokens: ThemeTokens;
  header: TBNode[];
  footer: TBNode[];
  custom_css: string;
  sort: number;
  version: number;
  pages: ApiPage[];
}

export interface ApiAsset {
  id: string;
  url: string;
}

/** Saved version of each theme and page, by id (themes and pages use distinct ULIDs). */
export type Versions = Map<string, number>;

const list = <T>(v: T[] | undefined | null): T[] => (Array.isArray(v) ? v : []);

function fromApiPage(p: ApiPage): Page {
  return { id: p.id, name: p.name, slug: p.slug ?? "", nodes: list(p.nodes), showHeader: !!p.show_header, showFooter: !!p.show_footer };
}

export function fromApiTheme(t: ApiTheme, versions: Versions): Theme {
  const tokens = (t.tokens ?? {}) as ThemeTokens;
  const pages = [...(t.pages ?? [])].sort((a, b) => a.sort - b.sort);
  versions.set(t.id, t.version);
  pages.forEach((p) => versions.set(p.id, p.version));
  return {
    id: t.id,
    name: t.name,
    eventId: t.event_id ?? "",
    tokens: { ...tokens, colors: fullColors(tokens.colors ?? {}) },
    header: list(t.header),
    footer: list(t.footer),
    customCss: t.custom_css ?? "",
    pages: pages.map(fromApiPage),
  };
}

/**
 * Structured fields are sent as JSON strings so the API's input trimming never touches their text.
 * version: the saved version this change is based on (null creates the record).
 */
export function themePayload(t: Theme, sort: number, version: number | null) {
  return {
    name: t.name,
    event_id: t.eventId?.trim() || null,
    tokens: JSON.stringify(t.tokens),
    header: JSON.stringify(t.header),
    footer: JSON.stringify(t.footer),
    custom_css: t.customCss ?? "",
    sort,
    version,
  };
}

export function pagePayload(p: Page, sort: number, version: number | null) {
  return { name: p.name, slug: p.slug ?? "", nodes: JSON.stringify(p.nodes), show_header: p.showHeader, show_footer: p.showFooter, sort, version };
}
