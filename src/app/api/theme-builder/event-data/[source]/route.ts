import { NextResponse, type NextRequest } from "next/server";
import { themeApi } from "@/server/themeApi";

// Reads public event data (speakers, sponsors, tickets, sessions) from the Stutzee microsite API.
export const dynamic = "force-dynamic";

const SOURCES: Record<string, string> = {
  speakers: "speakers/get-event-speakers",
  sponsors: "sponsors/get-event-sponsors",
  tickets: "tickets",
  sessions: "sessions",
};

type Ctx = { params: Promise<{ source: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { source } = await ctx.params;
  const path = SOURCES[source];
  const eventId = req.nextUrl.searchParams.get("event") ?? "";

  if (!path) return NextResponse.json({ message: "Unknown data source" }, { status: 404 });
  if (!/^[0-9A-HJKMNP-TV-Z]{26}$/i.test(eventId)) return NextResponse.json({ message: "A valid event ID is required" }, { status: 422 });
  if (!themeApi.micrositeUrl) return NextResponse.json({ message: "THEME_MICROSITE_API_BASE_URL is not set in .env" }, { status: 500 });

  try {
    const res = await fetch(`${themeApi.micrositeUrl}/${path}?per_page=-1`, {
      headers: { Accept: "application/json", "X-STUTZEE-EVENT-ID": eventId },
      cache: "no-store",
      signal: AbortSignal.timeout(themeApi.timeoutMs),
    });
    return new Response(await res.arrayBuffer(), {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (e) {
    const timedOut = e instanceof Error && e.name === "TimeoutError";
    return NextResponse.json(
      { message: timedOut ? "The event API did not respond in time." : "Could not reach the event API." },
      { status: timedOut ? 504 : 502 },
    );
  }
}
