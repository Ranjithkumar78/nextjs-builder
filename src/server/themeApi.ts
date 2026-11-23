/** Server-side settings for the Stutzee theme API. Never imported by client code. */
export const themeApi = {
  baseUrl: (process.env.THEME_API_BASE_URL ?? "").replace(/\/+$/, ""),
  /** Public event data (speakers, sponsors, tickets, sessions). */
  micrositeUrl: (process.env.THEME_MICROSITE_API_BASE_URL ?? "").replace(/\/+$/, ""),
  timeoutMs: Number(process.env.THEME_API_TIMEOUT_MS ?? 10000) || 10000,
};

/** Only these API paths can be reached through the proxy. */
const ALLOWED = /^(custom-themes|custom-theme-assets)(\/[A-Za-z0-9_-]+)?$/;

export function isAllowedPath(path: string): boolean {
  return ALLOWED.test(path);
}
