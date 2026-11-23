"use client";

import type { Page, Theme, TBNode, ThemeTokens } from "./types";
import { fullColors } from "./css";

export const AUTOSAVE_DELAY_MS = Number(process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS ?? 1500) || 1500;

const BASE = "/api/theme-builder";

// ---------------------------------------------------------------- API shapes
interface ApiPage {
  id: string;
  name: string;
  slug: string;
  nodes: TBNode[];
  show_header: boolean;
  show_footer: boolean;
  sort: number;
}

interface ApiTheme {
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

interface ApiAsset {
  id: string;
  url: string;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, { ...init, headers: { Accept: "application/json", ...(init?.headers ?? {}) } });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}
  if (!res.ok) {
    const d = data as { message?: string; error?: string; errors?: Record<string, string[]> } | null;
    const first = d?.errors ? Object.values(d.errors)[0]?.[0] : undefined;
    throw new ApiError(first ?? d?.message ?? d?.error ?? `Request failed (${res.status})`, res.status);
  }
  return ((data as { results?: T } | null)?.results ?? data) as T;
}

// ---------------------------------------------------------------- mapping
function fromApiPage(p: ApiPage): Page {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug ?? "",
    nodes: Array.isArray(p.nodes) ? p.nodes : [],
    showHeader: !!p.show_header,
    showFooter: !!p.show_footer,
  };
}

function fromApiTheme(t: ApiTheme): Theme {
  const tokens = (t.tokens ?? {}) as ThemeTokens;
  return {
    id: t.id,
    name: t.name,
    eventId: t.event_id ?? "",
    tokens: { ...tokens, colors: fullColors(tokens.colors ?? {}) },
    header: Array.isArray(t.header) ? t.header : [],
    footer: Array.isArray(t.footer) ? t.footer : [],
    customCss: t.custom_css ?? "",
    pages: [...(t.pages ?? [])].sort((a, b) => a.sort - b.sort).map(fromApiPage),
  };
}

/** Structured fields are sent as JSON strings so the API's input trimming never touches their text. */
function toApiPayload(t: Theme, sort: number) {
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

// ---------------------------------------------------------------- calls
export async function fetchThemes(): Promise<Theme[]> {
  const list = await request<ApiTheme[]>("custom-themes");
  return (Array.isArray(list) ? list : []).map(fromApiTheme);
}

export async function saveTheme(theme: Theme, sort: number): Promise<void> {
  await request(`custom-themes/${theme.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiPayload(theme, sort)),
  });
}

export async function deleteTheme(id: string): Promise<void> {
  try {
    await request(`custom-themes/${id}`, { method: "DELETE" });
  } catch (e) {
    // already gone on the server
    if (e instanceof ApiError && e.status === 404) return;
    throw e;
  }
}

/** Uploads an image the user picked and returns its URL, or null (after telling the user) if the upload failed. */
export async function imageUrlFor(file: File): Promise<string | null> {
  try {
    const form = new FormData();
    form.append("file", file);
    const asset = await request<ApiAsset>("custom-theme-assets", { method: "POST", body: form });
    if (asset?.url) return asset.url;
    throw new Error("the server did not return an image URL");
  } catch (e) {
    alert(`The image could not be uploaded (${e instanceof Error ? e.message : "unknown error"}).`);
    return null;
  }
}
