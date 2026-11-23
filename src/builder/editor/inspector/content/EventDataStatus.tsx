"use client";

import { useBuilder } from "../../../store";
import { SOURCE_NOUN, itemCount, refreshEventData, useEventData, type EventSource } from "../../../eventData";
import { Icon } from "../../../ui/Icon";
import { IconButton } from "../../../ui/common";

/** Shows where an event-data block gets its data and lets the user reload it. */
export function EventDataStatus({ source, eventId }: { source: EventSource; eventId: string }) {
  const { dispatch } = useBuilder();
  const state = useEventData(source, eventId);
  const [one, many] = SOURCE_NOUN[source];
  let text: string;
  if (!eventId) text = "No event chosen yet.";
  else if (state.status === "ready") {
    const count = itemCount(source, state.data);
    text = `${count} ${count === 1 ? one : many} loaded from the event.`;
  } else if (state.status === "error") text = `Could not load ${many}: ${state.error}`;
  else text = `Loading ${many}…`;
  return (
    <div className={`b-data-status${state.status === "error" ? " error" : ""}`}>
      <Icon name={state.status === "error" ? "close" : "globe"} size={14} />
      <span>{text}</span>
      {eventId ? (
        <IconButton icon="refresh" title="Reload data from the API" size={14} className="b-icon-btn" onClick={() => refreshEventData()} />
      ) : (
        <button className="b-btn small" onClick={() => dispatch({ type: "UI", patch: { leftTab: "themes", selectedId: null } })}>
          Choose event
        </button>
      )}
    </div>
  );
}
