import { NextResponse } from "next/server";
import { themeApi } from "./themeApi";

/** JSON error reply in the shape the builder's API client reads. */
export function jsonError(message: string, status: number): Response {
  return NextResponse.json({ message }, { status });
}

/**
 * Forward a request to the Stutzee API and stream its reply back unchanged.
 * The timeout covers waiting for the API to answer; once it does, the body streams without a limit.
 * Network failures and timeouts become 502/504 replies that name the API (`label`).
 */
export async function forwardTo(url: string, init: RequestInit, label: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException("timeout", "TimeoutError")), themeApi.timeoutMs);
  try {
    const res = await fetch(url, { ...init, cache: "no-store", signal: controller.signal });
    return new Response(res.body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (e) {
    const timedOut = e instanceof Error && e.name === "TimeoutError";
    return jsonError(timedOut ? `The ${label} did not respond in time.` : `Could not reach the ${label}.`, timedOut ? 504 : 502);
  } finally {
    clearTimeout(timer);
  }
}
