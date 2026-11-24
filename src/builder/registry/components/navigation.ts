import type { ComponentDef } from "../types";
import { pairOptions } from "../../lib/values";

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
      mobileMenu: true,
      collapseAt: "mobile",
    },
    defaultStyles: { display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "center", fontWeight: "500", color: "var(--tb-text)" },
    fields: [
      { key: "links", label: "Menu links", type: "links", links: { nested: true }, help: "Add sub-links to a link to make it a dropdown." },
      { key: "mobileMenu", label: "Collapse into a ☰ menu on small screens", type: "toggle" },
      {
        key: "collapseAt",
        label: "Collapse on",
        type: "select",
        options: pairOptions([
          ["mobile", "Mobile (≤640px)"],
          ["tablet", "Tablet and mobile (≤1024px)"],
        ]),
        when: (p) => !!p.mobileMenu,
      },
    ],
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
    fields: [
      { key: "links", label: "Links", type: "links", links: { icons: true } },
      { key: "iconsOnly", label: "Show icons only", type: "toggle", help: "Links without an icon still show their label." },
    ],
  },
];
