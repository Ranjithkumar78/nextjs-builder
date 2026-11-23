"use client";

import type { ReactNode } from "react";
import { useEventData } from "../../eventData/cache";
import type { EventDataMap, EventSource } from "../../eventData/types";
import { num, str } from "../../lib/values";
import { Note, Skeleton } from "./parts";
import type { EventBlockProps } from "./types";

interface Props<K extends EventSource> {
  source: K;
  block: EventBlockProps;
  isEmpty: (data: EventDataMap[K]) => boolean;
  children: (data: EventDataMap[K]) => ReactNode;
}

/** Loads the data and handles the "no event / loading / error / empty" states. */
export function WithData<K extends EventSource>({ source, block, isEmpty, children }: Props<K>): ReactNode {
  const state = useEventData(source, block.eventId);
  if (!block.eventId) {
    return block.edit ? (
      <Note>
        <strong>Live {source}</strong> — choose the event for this theme in <em>Themes → Event data</em> to show its {source} here.
      </Note>
    ) : null;
  }
  if (state.status === "idle" || state.status === "loading") return <Skeleton columns={Math.min(4, num(block.props.columns, 4))} />;
  if (state.status === "error") return block.edit ? <Note tone="error">Could not load {source}: {state.error}</Note> : null;
  // TypeScript cannot narrow the generic load state, but only "ready" is left here.
  const data = (state as { data: EventDataMap[K] }).data;
  if (isEmpty(data)) {
    const text = str(block.props.emptyText);
    return text ? <p className="tb-ev-empty">{text}</p> : null;
  }
  return children(data);
}
