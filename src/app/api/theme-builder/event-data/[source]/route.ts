import type { NextRequest } from "next/server";
import { themeApi } from "@/server/themeApi";
import { forwardTo, jsonError } from "@/server/proxy";

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

  if (!path) return jsonError("Unknown data source", 404);
  if (!/^[0-9A-HJKMNP-TV-Z]{26}$/i.test(eventId)) return jsonError("A valid event ID is required", 422);
  if (!themeApi.micrositeUrl) return jsonError("THEME_MICROSITE_API_BASE_URL is not set in .env", 500);

  return forwardTo(`${themeApi.micrositeUrl}/${path}?per_page=-1`, { headers: { Accept: "application/json", "X-STUTZEE-EVENT-ID": eventId } }, "event API");
}
