import { str as s } from "../lib/values";
import type { EventDataMap, EventSource, SessionPerson, Ticket } from "./types";

// Turns the microsite API's replies into the shapes the blocks render.
type Raw = Record<string, unknown>;
const n = (v: unknown): number | null => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v));
const list = (v: unknown): Raw[] => (Array.isArray(v) ? (v as Raw[]) : []);

function results(json: unknown): Raw[] {
  const r = (json as { results?: unknown } | null)?.results ?? json;
  if (Array.isArray(r)) return r as Raw[];
  const data = (r as { data?: unknown } | null)?.data;
  return Array.isArray(data) ? (data as Raw[]) : [];
}

const person = (p: Raw): SessionPerson => ({ id: s(p.id), name: s(p.name), photo: s(p.profile_picture ?? p.photo) });

function ticket(t: Raw, category: string): Ticket {
  const remaining = n(t.remaining_ticket_count);
  const status = s(t.ticket_status);
  const offer = (t.offer ?? {}) as Raw;
  return {
    id: s(t.id),
    title: s(t.title),
    description: s(t.description),
    price: n(t.price),
    basePrice: n(t.base_price) ?? 0,
    offer: s(offer.name),
    dateRange: s(t.date_range),
    startDate: s(t.start_date),
    endDate: s(t.end_date),
    status,
    remaining,
    total: n(t.total_ticket_count),
    soldOut: remaining === 0 || /sold/i.test(status),
    category,
  };
}

export const NORMALIZE: { [K in EventSource]: (json: unknown) => EventDataMap[K] } = {
  speakers: (json) =>
    results(json).map((r) => ({
      id: s(r.id),
      name: s(r.name),
      photo: s(r.photo),
      designation: s(r.designation),
      organisation: s(r.organisation),
      bio: s(r.bio),
    })),
  sponsors: (json) =>
    results(json).map((r) => ({
      id: s(r.id),
      name: s(r.name),
      logo: s(r.profile_picture),
      industry: s(r.industry),
      website: s(r.website),
      description: s(r.description),
      tier: s(r.sponsor_tier),
    })),
  tickets: (json) => results(json).map((c) => ({ id: s(c.id), name: s(c.name), tickets: list(c.tickets).map((t) => ticket(t, s(c.name))) })),
  sessions: (json) =>
    results(json).map((d) => ({
      day: s(d.day),
      label: s(d.label),
      sessions: list(d.sessions).map((x) => ({
        id: s(x.id),
        title: s(x.title),
        description: s(x.description),
        start: s(x.start_time),
        end: s(x.end_time),
        duration: n(x.duration) ?? 0,
        track: s(x.track_name),
        trackColor: s(x.track_color),
        hall: [s(x.hall_name), s(x.hall_location)].filter(Boolean).join(" · "),
        speakers: list(x.speakers).map(person),
        moderators: list(x.moderators).map(person),
      })),
    })),
};
