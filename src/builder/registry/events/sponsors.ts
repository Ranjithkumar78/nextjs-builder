import type { ComponentDef } from "../types";
import { pairOptions as opts } from "../../lib/values";
import { ALIGN, CARD_STYLE, COLUMNS, EMPTY_TEXT, EVENT_OVERRIDE, LIMIT, is, not } from "./fields";

export const SPONSORS: ComponentDef = {
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
};
