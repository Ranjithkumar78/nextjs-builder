import type { NodeProps, NodeStyles, StyleMap, TBNode } from "../types";
import type { Category, ComponentDef } from "./types";
import { uid } from "../tree/mutate";
import { deepClone } from "../lib/values";
import { placeholderImage } from "./fields";
import { LAYOUT_COMPONENTS } from "./components/layout";
import { TEXT_COMPONENTS } from "./components/text";
import { ACTION_COMPONENTS } from "./components/actions";
import { CONTENT_COMPONENTS } from "./components/content";
import { MEDIA_COMPONENTS } from "./components/media";
import { FORM_COMPONENTS } from "./components/forms";
import { NAVIGATION_COMPONENTS } from "./components/navigation";
import { SPEAKERS } from "./events/speakers";
import { SPONSORS } from "./events/sponsors";
import { TICKETS } from "./events/tickets";
import { SESSIONS } from "./events/sessions";

export type * from "./types";
export { placeholderImage };

export const CATEGORIES: Category[] = ["Event data", "Layout", "Basic", "Media", "Forms", "Navigation"];

export const COMPONENTS: ComponentDef[] = [
  ...LAYOUT_COMPONENTS,
  ...TEXT_COMPONENTS,
  ...ACTION_COMPONENTS,
  ...CONTENT_COMPONENTS,
  ...MEDIA_COMPONENTS,
  ...FORM_COMPONENTS,
  ...NAVIGATION_COMPONENTS,
  SPEAKERS,
  SPONSORS,
  TICKETS,
  SESSIONS,
];

export const COMPONENT_MAP: Record<string, ComponentDef> = Object.fromEntries(COMPONENTS.map((c) => [c.type, c]));

export function getDef(type: string): ComponentDef {
  return COMPONENT_MAP[type] ?? COMPONENT_MAP.box;
}

export function isContainer(type: string): boolean {
  return !!COMPONENT_MAP[type]?.container;
}

/** Create a node from the registry, merging optional overrides. */
export function createNode(type: string, props: NodeProps = {}, styles: StyleMap = {}, children?: TBNode[], extra: Partial<NodeStyles> & { name?: string } = {}): TBNode {
  const def = getDef(type);
  const baseProps: NodeProps = deepClone(def.defaultProps);
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
  if (def.container) node.children = children ?? def.defaultChildren?.(createNode) ?? [];
  return node;
}
