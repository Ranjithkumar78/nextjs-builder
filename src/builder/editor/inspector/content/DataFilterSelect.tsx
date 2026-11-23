"use client";

import { FACET_SOURCE, facetOptions, useEventData, type DataFacet } from "../../../eventData";
import { Options } from "../../../ui/controls/SelectInput";

/** A select whose options (ticket categories, sponsor tiers, tracks, days) come from the event's live data. */
export function DataFilterSelect({ facet, eventId, value, onChange }: { facet: DataFacet; eventId: string; value: string; onChange: (v: string) => void }) {
  const state = useEventData(FACET_SOURCE[facet], eventId);
  let options = state.status === "ready" ? facetOptions(facet, state.data) : [];
  // Keep a saved choice visible even if the event no longer has it.
  if (value && !options.some((o) => o.value === value)) options = [{ value, label: value }, ...options];
  return (
    <select className="b-input" value={value} onChange={(e) => onChange(e.target.value)} disabled={!eventId}>
      <option value="">{state.status === "loading" ? "Loading…" : "All"}</option>
      <Options options={options} />
    </select>
  );
}
