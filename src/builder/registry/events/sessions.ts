import type { ComponentDef } from "../types";
import { pairOptions as opts } from "../../lib/values";
import { CARD_STYLE, COLUMNS, EMPTY_TEXT, EVENT_OVERRIDE, is, not } from "./fields";

export const SESSIONS: ComponentDef = {
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
};
