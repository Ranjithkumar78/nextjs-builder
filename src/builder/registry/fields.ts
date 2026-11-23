import type { FieldDef } from "./types";
import { sameOptions } from "../lib/values";

/** Field definitions shared by several components. */
export const tagOptions = sameOptions;

export const ACCENT_FIELD: FieldDef = {
  key: "accentColor",
  label: "Accent color for *text* in stars",
  type: "color",
  help: "Wrap words in *stars* for an italic accent and **double stars** for bold.",
};

export const LINK_FIELDS: FieldDef[] = [
  { key: "href", label: "Link URL", type: "url", placeholder: "/about or https://…" },
  { key: "newTab", label: "Open in new tab", type: "toggle" },
];

export function placeholderImage(label = "Image", w = 800, h = 500, bg = "#e2e8f0", fg = "#64748b"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="${bg}"/><g fill="none" stroke="${fg}" stroke-width="6" stroke-linejoin="round" transform="translate(${w / 2 - 60} ${h / 2 - 60})"><rect x="0" y="10" width="120" height="90" rx="8"/><path d="M0 85l35-35 25 25 20-20 40 40"/><circle cx="88" cy="38" r="10"/></g><text x="50%" y="${h / 2 + 90}" fill="${fg}" font-family="system-ui,sans-serif" font-size="26" text-anchor="middle">${label}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
