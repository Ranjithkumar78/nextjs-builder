"use client";

import { useEffect, useState } from "react";
import type { TBNode } from "./types";

/** Event data that the Speakers, Sponsors, Tickets and Sessions components can show. */
export type EventSource = "speakers" | "sponsors" | "tickets" | "sessions";
export const EVENT_SOURCES: EventSource[] = ["speakers", "sponsors", "tickets", "sessions"];

export interface Speaker {
  id: string;
  name: string;
  photo: string;
  designation: string;
  organisation: string;
  bio: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  description: string;
  tier: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  /** null = free */
  price: number | null;
  basePrice: number;
  offer: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  status: string;
  remaining: number | null;
  total: number | null;
  soldOut: boolean;
  category: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  tickets: Ticket[];
}

export interface SessionPerson {
  id: string;
  name: string;
  photo: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  duration: number;
  track: string;
  trackColor: string;
  hall: string;
  speakers: SessionPerson[];
  moderators: SessionPerson[];
}

export interface SessionDay {
  day: string;
  label: string;
  sessions: Session[];
}

export interface EventDataMap {
  speakers: Speaker[];
  sponsors: Sponsor[];
  tickets: TicketCategory[];
  sessions: SessionDay[];
}

export type LoadState<T> = { status: "idle" | "loading" } | { status: "ready"; data: T } | { status: "error"; error: string };

// ---------------------------------------------------------------- normalizing API replies
type Raw = Record<string, unknown>;
const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const n = (v: unknown): number | null => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v));
const list = (v: unknown): Raw[] => (Array.isArray(v) ? (v as Raw[]) : []);

function results(json: unknown): Raw[] {
  const r = (json as { results?: unknown } | null)?.results ?? json;
  if (Array.isArray(r)) return r as Raw[];
  const data = (r as { data?: unknown } | null)?.data;
  return Array.isArray(data) ? (data as Raw[]) : [];
}

const person = (p: Raw): SessionPerson => ({ id: s(p.id), name: s(p.name), photo: s(p.profile_picture ?? p.photo) });

const NORMALIZE: { [K in EventSource]: (json: unknown) => EventDataMap[K] } = {
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
  tickets: (json) =>
    results(json).map((c) => ({
      id: s(c.id),
      name: s(c.name),
      tickets: list(c.tickets).map((t) => {
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
          category: s(c.name),
        };
      }),
    })),
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

// ---------------------------------------------------------------- loading with a shared cache
const cache = new Map<string, LoadState<unknown>>();
const inflight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();
const keyOf = (source: EventSource, eventId: string) => `${source}:${eventId}`;
const notify = () => listeners.forEach((l) => l());

export function loadEventData(source: EventSource, eventId: string, force = false): Promise<void> {
  const key = keyOf(source, eventId);
  if (!force && (cache.get(key)?.status === "ready" || inflight.has(key))) return inflight.get(key) ?? Promise.resolve();
  if (!cache.has(key)) cache.set(key, { status: "loading" });
  const job = (async () => {
    try {
      const res = await fetch(`/api/theme-builder/event-data/${source}?event=${encodeURIComponent(eventId)}`, { headers: { Accept: "application/json" } });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error((json as { message?: string } | null)?.message ?? `Request failed (${res.status})`);
      cache.set(key, { status: "ready", data: NORMALIZE[source](json) });
    } catch (e) {
      cache.set(key, { status: "error", error: e instanceof Error ? e.message : "Could not load data" });
    } finally {
      inflight.delete(key);
      notify();
    }
  })();
  inflight.set(key, job);
  notify();
  return job;
}

/** Cached data for a source, or undefined. Used for synchronous rendering (export). */
export function cachedEventData<K extends EventSource>(source: K, eventId: string): LoadState<EventDataMap[K]> {
  return (cache.get(keyOf(source, eventId)) as LoadState<EventDataMap[K]> | undefined) ?? { status: "idle" };
}

/** Reload every source that has been loaded (e.g. after the event changes in Stutzee). */
export function refreshEventData(): void {
  for (const key of [...cache.keys()]) {
    const [source, eventId] = key.split(":") as [EventSource, string];
    void loadEventData(source, eventId, true);
  }
}

export function useEventData<K extends EventSource>(source: K, eventId: string): LoadState<EventDataMap[K]> {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((x) => x + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  useEffect(() => {
    if (eventId) void loadEventData(source, eventId);
  }, [source, eventId]);
  return eventId ? cachedEventData(source, eventId) : { status: "idle" };
}

/** Load everything the given nodes need, so an export can render them without waiting. */
export async function prefetchEventData(nodes: TBNode[], themeEventId: string): Promise<void> {
  const jobs: Promise<void>[] = [];
  const walk = (list: TBNode[]) => {
    for (const node of list) {
      if ((EVENT_SOURCES as string[]).includes(node.type)) {
        const eventId = String(node.props.eventId || themeEventId || "");
        if (eventId) jobs.push(loadEventData(node.type as EventSource, eventId));
      }
      if (node.children) walk(node.children);
    }
  };
  walk(nodes);
  await Promise.all(jobs);
}

// ---------------------------------------------------------------- formatting
export function formatPrice(price: number | null, currency: string): string {
  if (price === null || price === 0) return "Free";
  const amount = Number.isInteger(price) ? price.toLocaleString("en-IN") : price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currency}${amount}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
