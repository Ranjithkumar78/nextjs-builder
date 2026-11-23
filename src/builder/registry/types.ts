import type { NodeProps, StyleMap, TBNode } from "../types";
import type { DataFacet } from "../eventData/summary";

export type { DataFacet };

export type FieldType = "text" | "textarea" | "url" | "select" | "number" | "toggle" | "image" | "images" | "icon" | "links" | "items" | "code" | "color" | "datafilter";

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
  /** For "links" fields: pick an icon per link, and/or add dropdown sub-links. */
  links?: { icons?: boolean; nested?: boolean };
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
  /** Children a new node starts with (e.g. the panels of a tabs element). Gets the node factory to avoid an import cycle. */
  defaultChildren?: (make: NodeFactory) => TBNode[];
}

export type NodeFactory = (type: string, props?: NodeProps, styles?: StyleMap, children?: TBNode[]) => TBNode;
