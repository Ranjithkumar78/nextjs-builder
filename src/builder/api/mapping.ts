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
  pages: ApiPage[];
}

export interface ApiAsset {
  id: string;
  url: string;
}

const list = <T>(v: T[] | undefined | null): T[] => (Array.isArray(v) ? v : []);

function fromApiPage(p: ApiPage): Page {
  return { id: p.id, name: p.name, slug: p.slug ?? "", nodes: list(p.nodes), showHeader: !!p.show_header, showFooter: !!p.show_footer };
}

export function fromApiTheme(t: ApiTheme): Theme {
  const tokens = (t.tokens ?? {}) as ThemeTokens;
  return {
    id: t.id,
    name: t.name,
    eventId: t.event_id ?? "",
    tokens: { ...tokens, colors: fullColors(tokens.colors ?? {}) },
    header: list(t.header),
    footer: list(t.footer),
    customCss: t.custom_css ?? "",
    pages: [...(t.pages ?? [])].sort((a, b) => a.sort - b.sort).map(fromApiPage),
  };
}

/** Structured fields are sent as JSON strings so the API's input trimming never touches their text. */
export function toApiPayload(t: Theme, sort: number) {
  return {
    name: t.name,
    event_id: t.eventId?.trim() || null,
    tokens: JSON.stringify(t.tokens),
    header: JSON.stringify(t.header),
    footer: JSON.stringify(t.footer),
    custom_css: t.customCss ?? "",
    sort,
    pages: t.pages.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug ?? "",
      nodes: JSON.stringify(p.nodes),
      show_header: p.showHeader,
      show_footer: p.showFooter,
    })),
  };
}
