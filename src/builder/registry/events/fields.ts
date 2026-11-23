import type { NodeProps } from "../../types";
import type { FieldDef } from "../types";
import { pairOptions as opts } from "../../lib/values";

/** Field definitions shared by the event-data components (Speakers, Sponsors, Tickets, Sessions). */
export const is = (key: string, ...values: string[]) => (p: NodeProps) => values.includes(String(p[key] ?? ""));
export const not = (key: string, ...values: string[]) => (p: NodeProps) => !values.includes(String(p[key] ?? ""));

export const CARD_STYLE: FieldDef = {
  key: "cardStyle",
  label: "Card style",
  type: "select",
  options: opts([
    ["elevated", "Shadow"],
    ["bordered", "Border"],
    ["filled", "Filled"],
    ["flat", "Plain"],
  ]),
};
export const ALIGN: FieldDef = {
  key: "align",
  label: "Text alignment",
  type: "select",
  options: opts([
    ["center", "Center"],
    ["left", "Left"],
  ]),
};
export const COLUMNS = (when?: FieldDef["when"]): FieldDef => ({ key: "columns", label: "Columns (max)", type: "number", help: "Fewer columns are used on small screens.", when });
export const LIMIT: FieldDef = { key: "limit", label: "Show at most", type: "number", help: "0 shows all." };
export const EVENT_OVERRIDE: FieldDef = {
  key: "eventId",
  label: "Event ID (optional)",
  type: "text",
  placeholder: "Uses the theme's event",
  help: "Leave empty to use the event set for this theme (Themes tab → Event data).",
};
export const EMPTY_TEXT: FieldDef = { key: "emptyText", label: "Text when there is nothing to show", type: "text" };
