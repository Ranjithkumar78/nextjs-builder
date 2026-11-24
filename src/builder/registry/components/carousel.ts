import type { ComponentDef } from "../types";

/** Slider (with slides) and popup. */
export const CAROUSEL_COMPONENTS: ComponentDef[] = [
  {
    type: "slider",
    label: "Slider",
    category: "Interactive",
    icon: "slider",
    container: true,
    defaultProps: { perView: 1, perViewMobile: 1, gap: 16, autoplay: 0, arrows: true, dots: true },
    defaultStyles: { width: "100%" },
    fields: [
      { key: "perView", label: "Slides visible (desktop)", type: "number" },
      { key: "perViewMobile", label: "Slides visible (mobile)", type: "number" },
      { key: "gap", label: "Space between slides (px)", type: "number" },
      { key: "autoplay", label: "Autoplay every (seconds)", type: "number", help: "0 turns autoplay off. Pauses while the mouse is over the slider." },
      { key: "arrows", label: "Show arrows", type: "toggle" },
      { key: "dots", label: "Show dots", type: "toggle" },
    ],
    defaultChildren: (make) => [1, 2, 3].map((n) => make("slide", {}, {}, [make("heading", { text: `Slide ${n}`, level: "h3" }), make("text", { text: "Drop any components into this slide." })])),
  },
  {
    type: "slide",
    label: "Slide",
    category: "Interactive",
    icon: "card",
    container: true,
    defaultProps: {},
    defaultStyles: { display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px", minHeight: "240px", padding: "32px", backgroundColor: "var(--tb-surface)", borderRadius: "var(--tb-radius)" },
    fields: [],
  },
  {
    type: "popup",
    label: "Popup",
    category: "Interactive",
    icon: "popup",
    container: true,
    defaultProps: { htmlId: "popup", closeButton: true },
    defaultStyles: { maxWidth: "560px" },
    fields: [
      { key: "htmlId", label: "Popup ID", type: "text", help: "Any button or link to #ID opens this popup (e.g. #popup)." },
      { key: "closeButton", label: "Show close (×) button", type: "toggle" },
    ],
    defaultChildren: (make) => [make("heading", { text: "Register your interest", level: "h3" }, { fontSize: "26px" }), make("text", { text: "Add a form, a video or anything else here." })],
  },
];
