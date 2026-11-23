import { createElement } from "react";
import { str } from "../../lib/values";
import type { EventSource } from "../../eventData/types";
import { EVENT_BLOCKS } from "../event-blocks";
import type { Renderer } from "../types";

/** Speakers, Sponsors, Tickets and Sessions: live data from the node's event, or the theme's event. */
const eventBlock: Renderer = ({ node, p, attrs, rc }) =>
  createElement(
    "div",
    attrs,
    createElement(EVENT_BLOCKS[node.type as EventSource], { nodeId: node.id, props: p, eventId: str(p.eventId).trim() || str(rc.eventId).trim(), edit: rc.edit }),
  );

export const EVENT_RENDERERS: Record<string, Renderer> = {
  speakers: eventBlock,
  sponsors: eventBlock,
  tickets: eventBlock,
  sessions: eventBlock,
};
