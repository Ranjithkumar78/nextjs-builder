"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { TBNode } from "../types";
import { getJson } from "../api/request";
import { errorText } from "../lib/values";
import { EVENT_SOURCES, type EventDataMap, type EventSource, type LoadState } from "./types";
import { NORMALIZE } from "./normalize";

// Loaded event data is shared by every block (and the exporter) through one cache.
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
      const json = await getJson(`event-data/${source}?event=${encodeURIComponent(eventId)}`);
      cache.set(key, { status: "ready", data: NORMALIZE[source](json) });
    } catch (e) {
      cache.set(key, { status: "error", error: errorText(e, "Could not load data") });
    } finally {
      inflight.delete(key);
      notify();
    }
  })();
  inflight.set(key, job);
  notify();
  return job;
}

/** Cached data for a source, or idle. Used for synchronous rendering (export). */
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

const IDLE: LoadState<never> = { status: "idle" };

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Live data for a block. Re-renders only when this source's cache entry changes. */
export function useEventData<K extends EventSource>(source: K, eventId: string): LoadState<EventDataMap[K]> {
  useEffect(() => {
    if (eventId) void loadEventData(source, eventId);
  }, [source, eventId]);
  const snapshot = useCallback(() => (eventId ? (cache.get(keyOf(source, eventId)) as LoadState<EventDataMap[K]> | undefined) ?? IDLE : IDLE), [source, eventId]);
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

export function isEventSource(type: string): type is EventSource {
  return (EVENT_SOURCES as string[]).includes(type);
}

/** Load everything the given nodes need, so an export can render them without waiting. */
export async function prefetchEventData(nodes: TBNode[], themeEventId: string): Promise<void> {
  const jobs: Promise<void>[] = [];
  const walk = (list: TBNode[]) => {
    for (const node of list) {
      if (isEventSource(node.type)) {
        const eventId = String(node.props.eventId || themeEventId || "");
        if (eventId) jobs.push(loadEventData(node.type, eventId));
      }
      if (node.children) walk(node.children);
    }
  };
  walk(nodes);
  await Promise.all(jobs);
}
