/** Server-side settings for the theme builder API (Laravel). Never imported by client code. */
export const themeApi = {
  baseUrl: (process.env.THEME_API_BASE_URL ?? "").replace(/\/+$/, ""),
  timeoutMs: Number(process.env.THEME_API_TIMEOUT_MS ?? 10000) || 10000,
};

/**
 * Only these API paths can be reached through the proxy:
 * custom-themes[/ID[/pages/ID]], custom-theme-assets, event-data/(speakers|sponsors|tickets|sessions).
 */
const ALLOWED = /^(custom-themes(\/[0-9A-Za-z]{26}(\/pages\/[0-9A-Za-z]{26})?)?|custom-theme-assets|event-data\/(speakers|sponsors|tickets|sessions))$/;

export function isAllowedPath(path: string): boolean {
  return ALLOWED.test(path);
}
