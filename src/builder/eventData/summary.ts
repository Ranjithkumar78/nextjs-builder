import { uniqueOptions } from "../lib/values";
import type { EventDataMap, EventSource } from "./types";

/** What a "datafilter" field lists, read from the event's live data. */
export type DataFacet = "ticketCategory" | "sponsorTier" | "sessionTrack" | "sessionDay";

export const FACET_SOURCE: Record<DataFacet, EventSource> = {
  ticketCategory: "tickets",
  sponsorTier: "sponsors",
  sessionTrack: "sessions",
  sessionDay: "sessions",
};

type Option = { label: string; value: string };

/** Ticket categories, sponsor tiers, tracks or days found in loaded data. */
export function facetOptions(facet: DataFacet, data: unknown): Option[] {
  if (facet === "ticketCategory") return uniqueOptions((data as EventDataMap["tickets"]).map((c) => c.name));
  if (facet === "sponsorTier") return uniqueOptions((data as EventDataMap["sponsors"]).map((s) => s.tier));
  const days = data as EventDataMap["sessions"];
  if (facet === "sessionTrack") return uniqueOptions(days.flatMap((d) => d.sessions.map((x) => x.track)));
  return days.map((d) => ({ value: d.day, label: d.label || `Day ${d.day}` }));
}

export const SOURCE_NOUN: Record<EventSource, [string, string]> = {
  speakers: ["speaker", "speakers"],
  sponsors: ["sponsor", "sponsors"],
  tickets: ["ticket", "tickets"],
  sessions: ["session", "sessions"],
};

/** Number of items (tickets across categories, sessions across days) in loaded data. */
export function itemCount(source: EventSource, data: unknown): number {
  if (source === "tickets") return (data as EventDataMap["tickets"]).reduce((n, c) => n + c.tickets.length, 0);
  if (source === "sessions") return (data as EventDataMap["sessions"]).reduce((n, d) => n + d.sessions.length, 0);
  return (data as unknown[]).length;
}

/** Day tab/heading label. */
export const dayLabel = (d: { day: string; label: string }): string => d.label || `Day ${d.day}`;
