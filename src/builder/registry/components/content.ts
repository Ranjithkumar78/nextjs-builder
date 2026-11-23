import type { ComponentDef } from "../types";

export const CONTENT_COMPONENTS: ComponentDef[] = [
  {
    type: "list",
    label: "List",
    category: "Basic",
    icon: "list",
    defaultProps: { items: ["First item", "Second item", "Third item"], ordered: false },
    defaultStyles: { paddingLeft: "22px", listStyleType: "disc", display: "flex", flexDirection: "column", gap: "6px", color: "var(--tb-text)" },
    fields: [
      { key: "items", label: "Items", type: "items" },
      { key: "ordered", label: "Numbered list", type: "toggle" },
    ],
  },
  {
    type: "quote",
    label: "Quote",
    category: "Basic",
    icon: "quote",
    inlineText: true,
    defaultProps: { text: "This builder changed the way our team ships pages.", cite: "Jane Cooper, CEO" },
    defaultStyles: { borderLeftWidth: "4px", borderLeftStyle: "solid", borderLeftColor: "var(--tb-primary)", paddingLeft: "20px", fontSize: "20px", fontStyle: "italic", color: "var(--tb-text)" },
    fields: [
      { key: "text", label: "Quote", type: "textarea" },
      { key: "cite", label: "Author", type: "text" },
    ],
  },
  {
    type: "badge",
    label: "Badge",
    category: "Basic",
    icon: "badge",
    inlineText: true,
    defaultProps: { text: "New" },
    defaultStyles: {
      display: "inline-flex",
      alignSelf: "flex-start",
      padding: "4px 12px",
      borderRadius: "999px",
      backgroundColor: "var(--tb-surface)",
      color: "var(--tb-primary)",
      fontSize: "13px",
      fontWeight: "600",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "var(--tb-border)",
    },
    fields: [{ key: "text", label: "Text", type: "text" }],
  },
];
