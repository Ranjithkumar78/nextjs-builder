import type { NodeProps, StyleMap, TBNode, NodeStyles } from "./types";
import { uid } from "./tree";

export type FieldType = "text" | "textarea" | "url" | "select" | "number" | "toggle" | "image" | "links" | "items" | "code" | "color" | "datafilter";

/** What a "datafilter" field lists, read from the event's live data. */
export type DataFacet = "ticketCategory" | "sponsorTier" | "sessionTrack" | "sessionDay";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  placeholder?: string;
  help?: string;
  /** For "datafilter" fields. */
  facet?: DataFacet;
  /** Show the field only when this returns true (e.g. options that only apply to one layout). */
  when?: (props: NodeProps) => boolean;
}

export type Category = "Event data" | "Layout" | "Basic" | "Media" | "Forms" | "Navigation";

export interface ComponentDef {
  type: string;
  label: string;
  category: Category;
  icon: string;
  container?: boolean;
  /** Text-bearing components can be edited inline on the canvas. */
  inlineText?: boolean;
  defaultProps: NodeProps;
  defaultStyles: StyleMap;
  defaultHover?: StyleMap;
  fields: FieldDef[];
}

export function placeholderImage(label = "Image", w = 800, h = 500, bg = "#e2e8f0", fg = "#64748b"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="${bg}"/><g fill="none" stroke="${fg}" stroke-width="6" stroke-linejoin="round" transform="translate(${w / 2 - 60} ${h / 2 - 60})"><rect x="0" y="10" width="120" height="90" rx="8"/><path d="M0 85l35-35 25 25 20-20 40 40"/><circle cx="88" cy="38" r="10"/></g><text x="50%" y="${h / 2 + 90}" fill="${fg}" font-family="system-ui,sans-serif" font-size="26" text-anchor="middle">${label}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const tagOptions = (tags: string[]) => tags.map((t) => ({ label: t, value: t }));

const ACCENT_FIELD: FieldDef = {
  key: "accentColor",
  label: "Accent color for *text* in stars",
  type: "color",
  help: "Wrap words in *stars* for an italic accent and **double stars** for bold.",
};

const LINK_FIELDS: FieldDef[] = [
  { key: "href", label: "Link URL", type: "url", placeholder: "/about or https://…" },
  { key: "newTab", label: "Open in new tab", type: "toggle" },
];

export const COMPONENTS: ComponentDef[] = [
  // ---------------- Layout
  {
    type: "section",
    label: "Section",
    category: "Layout",
    icon: "section",
    container: true,
    defaultProps: { tag: "section" },
    defaultStyles: { padding: "64px 24px", width: "100%" },
    fields: [{ key: "tag", label: "HTML tag", type: "select", options: tagOptions(["section", "div", "header", "footer", "nav", "main", "aside", "article"]) }],
  },
  {
    type: "container",
    label: "Container",
    category: "Layout",
    icon: "container",
    container: true,
    defaultProps: {},
    defaultStyles: { width: "100%", maxWidth: "var(--tb-container)", marginLeft: "auto", marginRight: "auto", display: "flex", flexDirection: "column", gap: "16px" },
    fields: [],
  },
  {
    type: "row",
    label: "Row / Columns",
    category: "Layout",
    icon: "row",
    container: true,
    defaultProps: {},
    defaultStyles: { display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "24px", width: "100%", alignItems: "stretch" },
    fields: [],
  },
  {
    type: "column",
    label: "Column",
    category: "Layout",
    icon: "column",
    container: true,
    defaultProps: {},
    defaultStyles: { flex: "1 1 0", minWidth: "220px", display: "flex", flexDirection: "column", gap: "12px" },
    fields: [],
  },
  {
    type: "grid",
    label: "Grid",
    category: "Layout",
    icon: "grid",
    container: true,
    defaultProps: {},
    defaultStyles: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "24px", width: "100%" },
    fields: [],
  },
  {
    type: "box",
    label: "Box / Card",
    category: "Layout",
    icon: "card",
    container: true,
    defaultProps: { tag: "div" },
    defaultStyles: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "24px",
      backgroundColor: "var(--tb-surface)",
      borderRadius: "var(--tb-radius)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "var(--tb-border)",
    },
    fields: [{ key: "tag", label: "HTML tag", type: "select", options: tagOptions(["div", "article", "aside", "figure", "li"]) }],
  },
  {
    type: "spacer",
    label: "Spacer",
    category: "Layout",
    icon: "spacer",
    defaultProps: {},
    defaultStyles: { height: "48px", width: "100%" },
    fields: [],
  },
  {
    type: "divider",
    label: "Divider",
    category: "Layout",
    icon: "divider",
    defaultProps: {},
    defaultStyles: { width: "100%", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "var(--tb-border)", marginTop: "8px", marginBottom: "8px" },
    fields: [],
  },
  // ---------------- Basic
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
  // ---------------- Media
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
  // ---------------- Forms
  {
    type: "form",
    label: "Form",
    category: "Forms",
    icon: "form",
    container: true,
    defaultProps: { action: "", method: "post" },
    defaultStyles: { display: "flex", flexDirection: "column", gap: "16px", width: "100%" },
    fields: [
      { key: "action", label: "Submit URL", type: "url", placeholder: "https://formspree.io/f/…" },
      { key: "method", label: "Method", type: "select", options: tagOptions(["post", "get"]) },
    ],
  },
  {
    type: "input",
    label: "Input",
    category: "Forms",
    icon: "input",
    defaultProps: { label: "Email", name: "email", inputType: "email", placeholder: "you@example.com", required: true },
    defaultStyles: { width: "100%" },
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "name", label: "Field name", type: "text" },
      { key: "inputType", label: "Type", type: "select", options: tagOptions(["text", "email", "tel", "number", "date", "password", "url"]) },
      { key: "placeholder", label: "Placeholder", type: "text" },
      { key: "required", label: "Required", type: "toggle" },
    ],
  },
  {
    type: "textarea",
    label: "Text area",
    category: "Forms",
    icon: "textarea",
    defaultProps: { label: "Message", name: "message", placeholder: "How can we help?", rows: 5, required: false },
    defaultStyles: { width: "100%" },
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "name", label: "Field name", type: "text" },
      { key: "placeholder", label: "Placeholder", type: "text" },
      { key: "rows", label: "Rows", type: "number" },
      { key: "required", label: "Required", type: "toggle" },
    ],
  },
  {
    type: "select",
    label: "Dropdown",
    category: "Forms",
    icon: "list",
    defaultProps: { label: "Topic", name: "topic", items: ["General", "Sales", "Support"] },
    defaultStyles: { width: "100%" },
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "name", label: "Field name", type: "text" },
      { key: "items", label: "Options", type: "items" },
    ],
  },
  {
    type: "submit",
    label: "Submit button",
    category: "Forms",
    icon: "submit",
    inlineText: true,
    defaultProps: { text: "Send message" },
    defaultStyles: {
      alignSelf: "flex-start",
      padding: "12px 28px",
      backgroundColor: "var(--tb-primary)",
      color: "var(--tb-background)",
      fontWeight: "600",
      borderRadius: "var(--tb-radius)",
      cursor: "pointer",
      transition: "all .2s ease",
    },
    defaultHover: { backgroundColor: "var(--tb-secondary)" },
    fields: [{ key: "text", label: "Label", type: "text" }],
  },
  // ---------------- Navigation
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


// ---------------- Event data (live from the Stutzee API)
const opts = (pairs: [string, string][]) => pairs.map(([value, label]) => ({ value, label }));
const is = (key: string, ...values: string[]) => (p: NodeProps) => values.includes(String(p[key] ?? ""));
const not = (key: string, ...values: string[]) => (p: NodeProps) => !values.includes(String(p[key] ?? ""));

const CARD_STYLE: FieldDef = {
  key: "cardStyle",
  label: "Card style",
  type: "select",
  options: opts([["elevated", "Shadow"], ["bordered", "Border"], ["filled", "Filled"], ["flat", "Plain"]]),
};
const ALIGN: FieldDef = { key: "align", label: "Text alignment", type: "select", options: opts([["center", "Center"], ["left", "Left"]]) };
const COLUMNS = (when?: FieldDef["when"]): FieldDef => ({ key: "columns", label: "Columns (max)", type: "number", help: "Fewer columns are used on small screens.", when });
const LIMIT: FieldDef = { key: "limit", label: "Show at most", type: "number", help: "0 shows all." };
const EVENT_OVERRIDE: FieldDef = {
  key: "eventId",
  label: "Event ID (optional)",
  type: "text",
  placeholder: "Uses the theme's event",
  help: "Leave empty to use the event set for this theme (Themes tab → Event data).",
};
const EMPTY_TEXT: FieldDef = { key: "emptyText", label: "Text when there is nothing to show", type: "text" };

const EVENT_COMPONENTS: ComponentDef[] = [
  {
    type: "speakers",
    label: "Speakers",
    category: "Event data",
    icon: "mic",
    defaultProps: {
      layout: "grid",
      columns: 4,
      limit: 0,
      photoShape: "circle",
      cardStyle: "elevated",
      align: "center",
      showPhoto: true,
      showDesignation: true,
      showOrganisation: true,
      showBio: false,
      eventId: "",
      emptyText: "Speakers will be announced soon.",
    },
    defaultStyles: { width: "100%" },
    fields: [
      {
        key: "layout",
        label: "Layout",
        type: "select",
        options: opts([["grid", "Grid of cards"], ["list", "List with bio"], ["spotlight", "Large photo cards"], ["compact", "Compact avatars"], ["carousel", "Scrolling row"]]),
      },
      COLUMNS(not("layout", "list", "carousel")),
      LIMIT,
      { key: "photoShape", label: "Photo shape", type: "select", options: opts([["circle", "Circle"], ["rounded", "Rounded"], ["square", "Square"]]), when: not("layout", "spotlight") },
      { ...CARD_STYLE, when: not("layout", "compact") },
      { ...ALIGN, when: not("layout", "list") },
      { key: "showPhoto", label: "Show photo", type: "toggle" },
      { key: "showDesignation", label: "Show designation", type: "toggle" },
      { key: "showOrganisation", label: "Show organisation", type: "toggle" },
      { key: "showBio", label: "Show bio", type: "toggle", when: not("layout", "compact") },
      EMPTY_TEXT,
      EVENT_OVERRIDE,
    ],
  },
  {
    type: "sponsors",
    label: "Sponsors",
    category: "Event data",
    icon: "award",
    defaultProps: {
      layout: "byTier",
      columns: 5,
      limit: 0,
      tier: "",
      logoHeight: 64,
      cardStyle: "bordered",
      align: "center",
      grayscale: false,
      showName: false,
      showIndustry: false,
      showDescription: false,
      linkWebsite: true,
      eventId: "",
      emptyText: "Sponsors will be announced soon.",
    },
    defaultStyles: { width: "100%" },
    fields: [
      {
        key: "layout",
        label: "Layout",
        type: "select",
        options: opts([["byTier", "Grouped by tier"], ["grid", "All logos grid"], ["strip", "Logo strip"], ["marquee", "Scrolling logos"], ["cards", "Cards with details"]]),
      },
      { key: "tier", label: "Only this tier", type: "datafilter", facet: "sponsorTier" },
      COLUMNS(is("layout", "byTier", "grid", "cards")),
      LIMIT,
      { key: "logoHeight", label: "Logo height (px)", type: "number" },
      { ...CARD_STYLE, when: not("layout", "strip", "marquee") },
      { ...ALIGN, when: is("layout", "byTier", "cards") },
      { key: "grayscale", label: "Grey logos (colour on hover)", type: "toggle" },
      { key: "showName", label: "Show name", type: "toggle", when: not("layout", "cards") },
      { key: "showIndustry", label: "Show industry", type: "toggle" },
      { key: "showDescription", label: "Show description", type: "toggle", when: is("layout", "cards") },
      { key: "linkWebsite", label: "Link logos to sponsor website", type: "toggle" },
      EMPTY_TEXT,
      EVENT_OVERRIDE,
    ],
  },
  {
    type: "tickets",
    label: "Tickets",
    category: "Event data",
    icon: "ticket",
    defaultProps: {
      layout: "byCategory",
      columns: 3,
      category: "",
      cardStyle: "elevated",
      align: "left",
      currency: "₹",
      showDescription: true,
      showDates: true,
      showRemaining: false,
      showSoldOut: true,
      highlight: "",
      buttonText: "Book now",
      buttonHref: "#register",
      eventId: "",
      emptyText: "Tickets are not on sale yet.",
    },
    defaultStyles: { width: "100%" },
    fields: [
      {
        key: "layout",
        label: "Layout",
        type: "select",
        options: opts([
          ["byCategory", "Grouped by category"],
          ["tabs", "Category tabs"],
          ["all", "All tickets"],
          ["pricing", "Pricing table"],
          ["list", "Compact list"],
        ]),
      },
      { key: "category", label: "Only this category", type: "datafilter", facet: "ticketCategory", when: not("layout", "tabs") },
      COLUMNS(not("layout", "list")),
      { key: "highlight", label: "Highlight ticket", type: "text", placeholder: "Part of the ticket name, e.g. VIP", help: "The first ticket whose name contains this text is highlighted.", when: not("layout", "list") },
      { ...CARD_STYLE, when: not("layout", "list") },
      { ...ALIGN, when: not("layout", "list") },
      { key: "currency", label: "Currency symbol", type: "text" },
      { key: "showDescription", label: "Show description", type: "toggle" },
      { key: "showDates", label: "Show sale dates", type: "toggle" },
      { key: "showRemaining", label: "Show tickets left", type: "toggle" },
      { key: "showSoldOut", label: "Show sold-out tickets", type: "toggle" },
      { key: "buttonText", label: "Button text", type: "text", help: "Leave empty to hide the button." },
      { key: "buttonHref", label: "Button link", type: "url", help: "Use {ticket} to insert the ticket ID." },
      EMPTY_TEXT,
      EVENT_OVERRIDE,
    ],
  },
  {
    type: "sessions",
    label: "Sessions",
    category: "Event data",
    icon: "calendar",
    defaultProps: {
      layout: "tabs",
      columns: 3,
      day: "",
      track: "",
      cardStyle: "bordered",
      showTime: true,
      showDescription: false,
      showSpeakers: true,
      showHall: true,
      showTrack: true,
      eventId: "",
      emptyText: "The agenda will be published soon.",
    },
    defaultStyles: { width: "100%" },
    fields: [
      {
        key: "layout",
        label: "Layout",
        type: "select",
        options: opts([["tabs", "Day tabs"], ["days", "All days, one after another"], ["timeline", "Timeline"], ["grid", "Grid of cards"], ["byTrack", "Grouped by track"]]),
      },
      { key: "day", label: "Only this day", type: "datafilter", facet: "sessionDay", when: not("layout", "tabs") },
      { key: "track", label: "Only this track", type: "datafilter", facet: "sessionTrack", when: not("layout", "byTrack") },
      COLUMNS(is("layout", "grid", "byTrack")),
      CARD_STYLE,
      { key: "showTime", label: "Show time", type: "toggle" },
      { key: "showDescription", label: "Show description", type: "toggle" },
      { key: "showSpeakers", label: "Show speakers", type: "toggle" },
      { key: "showHall", label: "Show hall", type: "toggle" },
      { key: "showTrack", label: "Show track", type: "toggle" },
      EMPTY_TEXT,
      EVENT_OVERRIDE,
    ],
  },
];

COMPONENTS.push(...EVENT_COMPONENTS);

export const COMPONENT_MAP: Record<string, ComponentDef> = Object.fromEntries(COMPONENTS.map((c) => [c.type, c]));

export function getDef(type: string): ComponentDef {
  return COMPONENT_MAP[type] ?? COMPONENT_MAP.box;
}

export function isContainer(type: string): boolean {
  return !!COMPONENT_MAP[type]?.container;
}

/** Create a node from the registry, merging optional overrides. */
export function createNode(
  type: string,
  props: NodeProps = {},
  styles: StyleMap = {},
  children?: TBNode[],
  extra: Partial<NodeStyles> & { name?: string } = {}
): TBNode {
  const def = getDef(type);
  const baseProps: NodeProps = JSON.parse(JSON.stringify(def.defaultProps));
  if (type === "image" && !props.src && !baseProps.src) baseProps.src = placeholderImage();
  const node: TBNode = {
    id: uid(),
    type,
    props: { ...baseProps, ...props },
    styles: {
      desktop: { ...def.defaultStyles, ...styles },
      ...(def.defaultHover || extra.hover ? { hover: { ...(def.defaultHover ?? {}), ...(extra.hover ?? {}) } } : {}),
      ...(extra.tablet ? { tablet: extra.tablet } : {}),
      ...(extra.mobile ? { mobile: extra.mobile } : {}),
    },
  };
  if (extra.name) node.name = extra.name;
  if (def.container) node.children = children ?? [];
  return node;
}

export const CATEGORIES: Category[] = ["Event data", "Layout", "Basic", "Media", "Forms", "Navigation"];
