import type { ComponentDef } from "../types";
import { pairOptions as opts } from "../../lib/values";
import { ALIGN, CARD_STYLE, COLUMNS, EMPTY_TEXT, EVENT_OVERRIDE, LIMIT, not } from "./fields";

export const SPEAKERS: ComponentDef = {
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
};
