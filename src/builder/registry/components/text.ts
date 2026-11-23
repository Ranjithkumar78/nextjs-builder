import type { ComponentDef } from "../types";
import { ACCENT_FIELD, tagOptions } from "../fields";

export const TEXT_COMPONENTS: ComponentDef[] = [
  {
    type: "heading",
    label: "Heading",
    category: "Basic",
    icon: "heading",
    inlineText: true,
    defaultProps: { text: "Your heading here", level: "h2" },
    defaultStyles: { fontFamily: "var(--tb-heading-font)", fontSize: "36px", fontWeight: "700", lineHeight: "1.2", color: "var(--tb-text)" },
    fields: [
      { key: "text", label: "Text", type: "textarea" },
      { key: "level", label: "Level", type: "select", options: tagOptions(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"]) },
      ACCENT_FIELD,
    ],
  },
  {
    type: "text",
    label: "Paragraph",
    category: "Basic",
    icon: "text",
    inlineText: true,
    defaultProps: { text: "Write something meaningful here. Double-click on the canvas to edit this text directly." },
    defaultStyles: { fontSize: "17px", lineHeight: "1.7", color: "var(--tb-muted)" },
    fields: [{ key: "text", label: "Text", type: "textarea" }, ACCENT_FIELD],
  },
];
