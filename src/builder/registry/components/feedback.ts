import type { ComponentDef } from "../types";
import { pairOptions } from "../../lib/values";

/** Star rating, alert box and table. */
export const FEEDBACK_COMPONENTS: ComponentDef[] = [
  {
    type: "rating",
    label: "Star rating",
    category: "Basic",
    icon: "star",
    defaultProps: { value: 4.5, max: 5, label: "4.5 from 120 reviews" },
    defaultStyles: { display: "inline-flex", alignItems: "center", gap: "8px", alignSelf: "flex-start", fontSize: "20px", color: "#f59e0b" },
    fields: [
      { key: "value", label: "Rating", type: "number", help: "Halves and decimals are shown as partly filled stars." },
      { key: "max", label: "Number of stars", type: "number" },
      { key: "label", label: "Text after the stars", type: "text" },
    ],
  },
  {
    type: "alert",
    label: "Alert box",
    category: "Basic",
    icon: "info",
    inlineText: true,
    defaultProps: { tone: "info", title: "Good to know", text: "Gates open at **8:00 AM**. Please carry a photo ID.", dismissible: false },
    defaultStyles: { display: "flex", alignItems: "flex-start", gap: "12px", width: "100%", padding: "14px 44px 14px 18px", borderRadius: "var(--tb-radius)", fontSize: "15px" },
    fields: [
      {
        key: "tone",
        label: "Type",
        type: "select",
        options: pairOptions([
          ["info", "Information"],
          ["success", "Success"],
          ["warning", "Warning"],
          ["error", "Error"],
        ]),
      },
      { key: "title", label: "Title", type: "text" },
      { key: "text", label: "Message", type: "textarea" },
      { key: "dismissible", label: "Visitors can close it", type: "toggle" },
    ],
  },
  {
    type: "table",
    label: "Table",
    category: "Basic",
    icon: "table",
    defaultProps: { rows: "Time | Session | Hall\n9:00 AM | Opening keynote | Hall A\n10:30 AM | Panel discussion | Hall B", header: true, striped: true },
    defaultStyles: { width: "100%", fontSize: "15px", color: "var(--tb-text)" },
    fields: [
      { key: "rows", label: "Rows", type: "textarea", help: "One row per line; separate cells with |" },
      { key: "header", label: "First row is the header", type: "toggle" },
      { key: "striped", label: "Striped rows", type: "toggle" },
    ],
  },
];
