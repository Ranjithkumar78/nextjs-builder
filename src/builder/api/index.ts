"use client";

import type { Page, Theme } from "../types";
import { errorText } from "../lib/values";
import { ApiError, request } from "./request";
import { fromApiTheme, pagePayload, themePayload, type ApiAsset, type ApiTheme, type Versions } from "./mapping";

export { ApiError, getJson } from "./request";
export type { Versions } from "./mapping";

export const AUTOSAVE_DELAY_MS = Number(process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS ?? 1500) || 1500;

/** Every theme with its pages, plus the saved version of each theme and page. */
export async function fetchThemesWithVersions(): Promise<{ themes: Theme[]; versions: Versions }> {
  const versions: Versions = new Map();
  const list = await request<ApiTheme[]>("custom-themes");
  return { themes: (Array.isArray(list) ? list : []).map((t) => fromApiTheme(t, versions)), versions };
}

export async function fetchThemes(): Promise<Theme[]> {
  return (await fetchThemesWithVersions()).themes;
}

const putJson = <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

/** Theme settings only (pages are saved one by one). Returns the new version; throws ApiError 409 on a stale version. */
export async function saveThemeSettings(theme: Theme, sort: number, version: number | null): Promise<number> {
  return (await putJson<{ version: number }>(`custom-themes/${theme.id}`, themePayload(theme, sort, version))).version;
}

export async function savePage(themeId: string, page: Page, sort: number, version: number | null): Promise<number> {
  return (await putJson<{ version: number }>(`custom-themes/${themeId}/pages/${page.id}`, pagePayload(page, sort, version))).version;
}

/** Delete; a 404 means it is already gone, which is fine. */
async function remove(path: string): Promise<void> {
  try {
    await request(path, { method: "DELETE" });
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return;
    throw e;
  }
}

export const deleteTheme = (id: string) => remove(`custom-themes/${id}`);
export const deletePage = (themeId: string, pageId: string) => remove(`custom-themes/${themeId}/pages/${pageId}`);

/** Uploads an image the user picked and returns its URL, or null (after telling the user) if the upload failed. */
export async function imageUrlFor(file: File): Promise<string | null> {
  try {
    const form = new FormData();
    form.append("file", file);
    const asset = await request<ApiAsset>("custom-theme-assets", { method: "POST", body: form });
    if (asset?.url) return asset.url;
    throw new Error("the server did not return an image URL");
  } catch (e) {
    alert(`The image could not be uploaded (${errorText(e)}).`);
    return null;
  }
}
