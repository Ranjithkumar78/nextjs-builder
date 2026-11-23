import type { ComponentDef } from "../types";
import { LINK_FIELDS } from "../fields";

export const ACTION_COMPONENTS: ComponentDef[] = [
  {
    type: "button",
    label: "Button",
    category: "Basic",
    icon: "button",
    inlineText: true,
    defaultProps: { text: "Get started", href: "#", newTab: false },
    defaultStyles: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
      padding: "12px 24px",
      backgroundColor: "var(--tb-primary)",
      color: "var(--tb-background)",
      fontWeight: "600",
      fontSize: "16px",
      borderRadius: "var(--tb-radius)",
      transition: "all .2s ease",
      cursor: "pointer",
    },
    defaultHover: { backgroundColor: "var(--tb-secondary)", transform: "translateY(-1px)" },
    fields: [{ key: "text", label: "Label", type: "text" }, ...LINK_FIELDS],
  },
  {
    type: "link",
    label: "Text link",
    category: "Basic",
    icon: "link",
    inlineText: true,
    defaultProps: { text: "Learn more →", href: "#", newTab: false },
    defaultStyles: { color: "var(--tb-primary)", fontWeight: "600", textDecoration: "none", alignSelf: "flex-start" },
    defaultHover: { textDecoration: "underline" },
    fields: [{ key: "text", label: "Text", type: "text" }, ...LINK_FIELDS],
  },
];
