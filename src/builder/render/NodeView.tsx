"use client";

import { createElement, memo, type ReactNode } from "react";
import type { TBNode } from "../types";
import { nodeClass } from "../css/declarations";
import { getDef } from "../registry";
import { str } from "../lib/values";
import { InlineText } from "./InlineText";
import type { Attrs, RenderArgs, RenderCtx, Renderer } from "./types";
import { LAYOUT_RENDERERS } from "./nodes/layout";
import { TEXT_RENDERERS } from "./nodes/text";
import { MEDIA_RENDERERS } from "./nodes/media";
import { FORM_RENDERERS } from "./nodes/forms";
import { EVENT_RENDERERS } from "./nodes/events";
import { NAVIGATION_RENDERERS } from "./nodes/navigation";
import { ENGAGE_RENDERERS } from "./nodes/engage";
import { INTERACTIVE_RENDERERS } from "./nodes/interactive";
import { CAROUSEL_RENDERERS } from "./nodes/carousel";
import { WIDGET_RENDERERS } from "./nodes/widgets";
import { FEEDBACK_RENDERERS } from "./nodes/feedback";
import { MEDIA_EXTRA_RENDERERS } from "./nodes/media-extra";
import { FORM_EXTRA_RENDERERS } from "./nodes/forms-extra";
import { CALENDAR_RENDERERS } from "./nodes/calendar";

const RENDERERS: Record<string, Renderer> = { ...LAYOUT_RENDERERS, ...TEXT_RENDERERS, ...MEDIA_RENDERERS, ...FORM_RENDERERS, ...EVENT_RENDERERS, ...NAVIGATION_RENDERERS, ...ENGAGE_RENDERERS, ...INTERACTIVE_RENDERERS, ...CAROUSEL_RENDERERS, ...WIDGET_RENDERERS, ...FEEDBACK_RENDERERS, ...MEDIA_EXTRA_RENDERERS, ...FORM_EXTRA_RENDERERS, ...CALENDAR_RENDERERS };

/** Text-bearing types where Enter finishes editing instead of adding a line. */
const SINGLE_LINE = new Set(["button", "link", "badge", "submit", "logo"]);

/** Class names, id and (in the editor) the data attributes the canvas uses to find, drag and drop nodes. */
function rootAttrs(node: TBNode, rc: RenderCtx, container: boolean): Attrs {
  const extraClass = str(node.props.className).trim();
  const attrs: Attrs = { className: `${nodeClass(node.id)} tb-t-${node.type}${extraClass ? " " + extraClass : ""}` };
  if (node.props.htmlId) attrs.id = str(node.props.htmlId);
  if (rc.edit) {
    attrs["data-node-id"] = node.id;
    attrs["data-zone"] = rc.zone;
    attrs["data-type"] = node.type;
    attrs.draggable = rc.editingId !== node.id;
    if (container) attrs["data-container"] = "true";
    if (node.hidden) attrs["data-hidden"] = "true";
  }
  const anim = str(node.props.animation);
  if (anim && anim !== "none") {
    attrs["data-tb-anim"] = anim;
    if (node.props.animationDelay) attrs["data-tb-delay"] = str(node.props.animationDelay);
  }
  return attrs;
}

/**
 * Renders one node and its children. Memoized: edits keep unchanged nodes as the same objects,
 * so only the edited branch re-renders (the render context must be stable too).
 */
export const NodeView = memo(function NodeView({ node, rc }: { node: TBNode; rc: RenderCtx }): ReactNode {
  if (node.hidden && !rc.edit) return null;
  const def = getDef(node.type);
  const args: RenderArgs = {
    node,
    p: node.props,
    rc,
    attrs: rootAttrs(node, rc, !!def.container),
    href: (h) => {
      const v = str(h, "#") || "#";
      return rc.mapHref ? rc.mapHref(v) : v;
    },
    text: (tag, attrs, key = "text") => <InlineText node={node} rc={rc} tag={tag} attrs={attrs} textKey={key} singleLine={SINGLE_LINE.has(node.type)} />,
    kids: () => {
      const children = node.children ?? [];
      if (rc.edit && children.length === 0)
        return (
          <div className="b-empty-drop" data-empty-for={node.id}>
            Drop components here
          </div>
        );
      return children.map((c) => <NodeView key={c.id} node={c} rc={rc} />);
    },
  };
  const render = RENDERERS[node.type];
  return render ? render(args) : createElement("div", args.attrs, def.container ? args.kids() : null);
});

export const ZoneView = memo(function ZoneView({ nodes, rc }: { nodes: TBNode[]; rc: RenderCtx }) {
  return (
    <>
      {nodes.map((n) => (
        <NodeView key={n.id} node={n} rc={rc} />
      ))}
    </>
  );
});
