import type { ComponentDef } from "../types";

const STACK = { display: "flex", flexDirection: "column", gap: "12px", width: "100%" };

/** Accordion (FAQ) and tabs. Their items/panels are containers, so they can hold any components. */
export const INTERACTIVE_COMPONENTS: ComponentDef[] = [
  {
    type: "accordion",
    label: "Accordion",
    category: "Interactive",
    icon: "accordion",
    container: true,
    defaultProps: { single: true },
    defaultStyles: STACK,
    fields: [{ key: "single", label: "Only one item open at a time", type: "toggle" }],
    defaultChildren: (make) =>
      [1, 2, 3].map((n) => make("accordion-item", { title: `Question ${n}`, open: n === 1 }, {}, [make("text", { text: "Write the answer here. You can drop any components into this item." })])),
  },
  {
    type: "accordion-item",
    label: "Accordion item",
    category: "Interactive",
    icon: "chevronDown",
    container: true,
    inlineText: true,
    defaultProps: { title: "Question", open: false },
    defaultStyles: { borderWidth: "1px", borderStyle: "solid", borderColor: "var(--tb-border)", borderRadius: "var(--tb-radius)", backgroundColor: "var(--tb-background)", overflow: "hidden" },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "open", label: "Open when the page loads", type: "toggle", help: "Items are always open while editing." },
    ],
  },
  {
    type: "tabs",
    label: "Tabs",
    category: "Interactive",
    icon: "tabs",
    container: true,
    defaultProps: {},
    defaultStyles: { width: "100%" },
    fields: [],
    defaultChildren: (make) => [1, 2, 3].map((n) => make("tab", { title: `Tab ${n}` }, {}, [make("text", { text: `Content of tab ${n}.` })])),
  },
  {
    type: "tab",
    label: "Tab panel",
    category: "Interactive",
    icon: "file",
    container: true,
    defaultProps: { title: "New tab" },
    defaultStyles: {},
    fields: [{ key: "title", label: "Tab title", type: "text", help: "Click a tab title on the canvas to edit its panel. Up to 12 tabs." }],
  },
];
