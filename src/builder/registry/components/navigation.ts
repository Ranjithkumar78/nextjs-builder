import type { ComponentDef } from "../types";

export const NAVIGATION_COMPONENTS: ComponentDef[] = [
  {
    type: "logo",
    label: "Logo",
    category: "Navigation",
    icon: "logo",
    inlineText: true,
    defaultProps: { text: "Brand", src: "", href: "/" },
    defaultStyles: { fontFamily: "var(--tb-heading-font)", fontSize: "22px", fontWeight: "800", color: "var(--tb-text)", display: "inline-flex", alignItems: "center", gap: "8px" },
    fields: [
      { key: "text", label: "Text", type: "text" },
      { key: "src", label: "Logo image (optional)", type: "image" },
      { key: "href", label: "Link", type: "url" },
    ],
  },
  {
    type: "navmenu",
    label: "Menu",
    category: "Navigation",
    icon: "nav",
    defaultProps: {
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    defaultStyles: { display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "center", fontWeight: "500", color: "var(--tb-text)" },
    fields: [{ key: "links", label: "Menu links", type: "links" }],
  },
  {
    type: "socials",
    label: "Social links",
    category: "Navigation",
    icon: "socials",
    defaultProps: {
      links: [
        { label: "Twitter", href: "https://twitter.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
        { label: "Instagram", href: "https://instagram.com" },
      ],
    },
    defaultStyles: { display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "14px", color: "var(--tb-muted)" },
    fields: [{ key: "links", label: "Links", type: "links" }],
  },
];
