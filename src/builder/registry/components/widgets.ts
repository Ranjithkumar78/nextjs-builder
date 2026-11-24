import type { ComponentDef } from "../types";

/** Icon, icon list, counter and progress bar. */
export const WIDGET_COMPONENTS: ComponentDef[] = [
  {
    type: "icon",
    label: "Icon",
    category: "Basic",
    icon: "sparkle",
    defaultProps: { icon: "star", label: "", href: "" },
    defaultStyles: { display: "inline-flex", alignSelf: "flex-start", fontSize: "32px", color: "var(--tb-primary)" },
    fields: [
      { key: "icon", label: "Icon", type: "icon" },
      { key: "label", label: "Description (for screen readers)", type: "text" },
      { key: "href", label: "Link (optional)", type: "url" },
    ],
  },
  {
    type: "iconlist",
    label: "Icon list",
    category: "Basic",
    icon: "iconlist",
    defaultProps: { items: ["Free parking at the venue", "Lunch and refreshments", "Certificate of participation"], icon: "checkCircle", iconColor: "var(--tb-primary)" },
    defaultStyles: { display: "flex", flexDirection: "column", gap: "10px", color: "var(--tb-text)" },
    fields: [
      { key: "items", label: "Items", type: "items" },
      { key: "icon", label: "Icon", type: "icon" },
      { key: "iconColor", label: "Icon color", type: "color" },
    ],
  },
  {
    type: "counter",
    label: "Counter",
    category: "Basic",
    icon: "hash",
    defaultProps: { start: 0, end: 500, prefix: "", suffix: "+", duration: 2000, separator: true },
    defaultStyles: { fontFamily: "var(--tb-heading-font)", fontSize: "48px", fontWeight: "700", lineHeight: "1", color: "var(--tb-primary)" },
    fields: [
      { key: "end", label: "Number", type: "number" },
      { key: "start", label: "Count up from", type: "number" },
      { key: "prefix", label: "Before the number", type: "text", placeholder: "e.g. ₹" },
      { key: "suffix", label: "After the number", type: "text", placeholder: "e.g. + or %" },
      { key: "duration", label: "Animation length (ms)", type: "number", help: "Counts up when it scrolls into view." },
      { key: "separator", label: "Thousands separator", type: "toggle" },
    ],
  },
  {
    type: "progress",
    label: "Progress bar",
    category: "Basic",
    icon: "progress",
    defaultProps: { label: "Seats filled", value: 75, showValue: true, barColor: "var(--tb-primary)" },
    defaultStyles: { display: "flex", flexDirection: "column", gap: "8px", width: "100%", fontSize: "14px", fontWeight: "600", color: "var(--tb-text)" },
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "value", label: "Value (0–100)", type: "number" },
      { key: "showValue", label: "Show the percentage", type: "toggle" },
      { key: "barColor", label: "Bar color", type: "color" },
    ],
  },
];
