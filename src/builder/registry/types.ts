import type { NodeProps, StyleMap } from "../types";
import type { DataFacet } from "../eventData/summary";

export type { DataFacet };

export type FieldType = "text" | "textarea" | "url" | "select" | "number" | "toggle" | "image" | "links" | "items" | "code" | "color" | "datafilter";

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
