import type { ComponentDef } from "../types";

export const MEDIA_COMPONENTS: ComponentDef[] = [
  {
    type: "image",
    label: "Image",
    category: "Media",
    icon: "image",
    defaultProps: { src: "", alt: "Image", href: "" },
    defaultStyles: { width: "100%", height: "auto", objectFit: "cover", borderRadius: "var(--tb-radius)" },
    fields: [
      { key: "src", label: "Image", type: "image" },
      { key: "alt", label: "Alt text", type: "text" },
      { key: "href", label: "Link (optional)", type: "url" },
    ],
  },
  {
    type: "video",
    label: "Video",
    category: "Media",
    icon: "video",
    defaultProps: { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" },
    defaultStyles: { width: "100%", aspectRatio: "16 / 9", borderRadius: "var(--tb-radius)", overflow: "hidden", backgroundColor: "#000000" },
    fields: [{ key: "url", label: "YouTube, Vimeo or .mp4 URL", type: "url" }],
  },
  {
    type: "map",
    label: "Map",
    category: "Media",
    icon: "map",
    defaultProps: { query: "Chennai, India", zoom: 13 },
    defaultStyles: { width: "100%", height: "320px", borderRadius: "var(--tb-radius)", overflow: "hidden" },
    fields: [
      { key: "query", label: "Address / place", type: "text" },
      { key: "zoom", label: "Zoom (1-20)", type: "number" },
    ],
  },
  {
    type: "countdown",
    label: "Countdown",
    category: "Media",
    icon: "clock",
    defaultProps: { target: "2026-12-27T08:00:00+05:30", showLabels: true },
    defaultStyles: { display: "flex", flexWrap: "wrap", gap: "10px", color: "var(--tb-text)" },
    fields: [
      { key: "target", label: "Count down to (date & time)", type: "text", placeholder: "2026-12-27T08:00:00+05:30", help: "Format: YYYY-MM-DDTHH:MM:SS+05:30" },
      { key: "showLabels", label: "Show labels", type: "toggle" },
    ],
  },
  {
    type: "embed",
    label: "HTML embed",
    category: "Media",
    icon: "code",
    defaultProps: { html: '<div style="padding:16px;border:1px dashed #94a3b8;border-radius:8px;text-align:center">Custom HTML</div>' },
    defaultStyles: { width: "100%" },
    fields: [{ key: "html", label: "HTML", type: "code", help: "Scripts are not run inside the editor." }],
  },
];
