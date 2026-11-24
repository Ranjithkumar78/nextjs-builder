import type { ComponentDef, FieldDef } from "../types";
import { pairOptions } from "../../lib/values";
import { SHARE_LABELS } from "../../lib/share";

/** Where a floating button sits (bottom left/right corner, distance from the bottom). */
export const FLOAT_FIELDS: FieldDef[] = [
  { key: "floating", label: "Float in the corner", type: "toggle", help: "Shown in place while editing; floats on the published page." },
  { key: "side", label: "Corner", type: "select", options: pairOptions([["right", "Bottom right"], ["left", "Bottom left"]]), when: (p) => !!p.floating },
  { key: "bottom", label: "Distance from bottom (px)", type: "number", when: (p) => !!p.floating },
];

const ROUND_BUTTON = { display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "999px", fontWeight: "600" };

/** Announcement bar and back-to-top button. */
export const ENGAGE_COMPONENTS: ComponentDef[] = [
  {
    type: "announcement",
    label: "Announcement bar",
    category: "Navigation",
    icon: "megaphone",
    inlineText: true,
    defaultProps: { text: "🎉 Early-bird tickets close on **Friday**.", linkText: "Book now →", href: "#tickets", dismissible: true },
    defaultStyles: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "12px", width: "100%", padding: "10px 48px", backgroundColor: "var(--tb-primary)", color: "var(--tb-background)", fontSize: "14px", textAlign: "center" },
    fields: [
      { key: "text", label: "Text", type: "textarea" },
      { key: "linkText", label: "Link text", type: "text", help: "Leave empty to hide the link." },
      { key: "href", label: "Link", type: "url" },
      { key: "dismissible", label: "Visitors can close it", type: "toggle" },
    ],
  },
  {
    type: "backtotop",
    label: "Back to top",
    category: "Navigation",
    icon: "up",
    defaultProps: { label: "", floating: true, side: "right", bottom: 90 },
    defaultStyles: { ...ROUND_BUTTON, width: "48px", height: "48px", backgroundColor: "var(--tb-primary)", color: "var(--tb-background)", boxShadow: "0 8px 24px -6px rgba(0,0,0,.3)" },
    fields: [{ key: "label", label: "Label (optional)", type: "text", help: "Appears after scrolling down. Leave empty for an arrow only." }, ...FLOAT_FIELDS],
  },
  {
    type: "share",
    label: "Share buttons",
    category: "Navigation",
    icon: "share",
    defaultProps: { label: "Share:", facebook: true, x: true, linkedin: true, whatsapp: true, email: true, copy: true },
    defaultStyles: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", fontSize: "14px" },
    fields: [
      { key: "label", label: "Label", type: "text" },
      ...(["facebook", "x", "linkedin", "whatsapp", "email", "copy"] as const).map((k): FieldDef => ({ key: k, label: SHARE_LABELS[k], type: "toggle" })),
    ],
  },
  {
    type: "whatsapp",
    label: "WhatsApp button",
    category: "Navigation",
    icon: "chat",
    defaultProps: { phone: "", message: "Hi! I have a question about the event.", label: "Chat with us", floating: false, side: "right", bottom: 24 },
    defaultStyles: { ...ROUND_BUTTON, gap: "8px", padding: "12px 20px", backgroundColor: "#25d366", color: "#ffffff", alignSelf: "flex-start" },
    fields: [
      { key: "phone", label: "WhatsApp number", type: "text", placeholder: "e.g. 919876543210", help: "Country code and number, digits only." },
      { key: "message", label: "Pre-filled message", type: "textarea" },
      { key: "label", label: "Button text", type: "text", help: "Leave empty for the icon only." },
      ...FLOAT_FIELDS,
    ],
  },
];
