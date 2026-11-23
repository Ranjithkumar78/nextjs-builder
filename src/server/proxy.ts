import { NextResponse } from "next/server";
import { themeApi } from "./themeApi";

/** JSON error reply in the shape the builder's API client reads. */
export function jsonError(message: string, status: number): Response {
  return NextResponse.json({ message }, { status });
}

/**
 * Forward a request to the Stutzee API and pass its reply through unchanged.
 * Network failures and timeouts become 502/504 replies that name the API (`label`).
 */
export async function forwardTo(url: string, init: RequestInit, label: string): Promise<Response> {
  try {
    const res = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(themeApi.timeoutMs) });
    return new Response(await res.arrayBuffer(), {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (e) {
    const timedOut = e instanceof Error && e.name === "TimeoutError";
    return jsonError(timedOut ? `The ${label} did not respond in time.` : `Could not reach the ${label}.`, timedOut ? 504 : 502);
  }
}
