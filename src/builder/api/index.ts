"use client";

import type { Theme } from "../types";
import { errorText } from "../lib/values";
import { ApiError, request } from "./request";
import { fromApiTheme, toApiPayload, type ApiAsset, type ApiTheme } from "./mapping";

export { ApiError, getJson } from "./request";

export const AUTOSAVE_DELAY_MS = Number(process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS ?? 1500) || 1500;

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
    alert(`The image could not be uploaded (${errorText(e)}).`);
    return null;
  }
}
