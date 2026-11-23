import { NextResponse, type NextRequest } from "next/server";
import { isAllowedPath, themeApi } from "@/server/themeApi";

// Proxies the builder's requests to the Stutzee API (same-origin for the browser, so no CORS setup is needed).
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };

async function forward(req: NextRequest, ctx: Ctx): Promise<Response> {
  const { path } = await ctx.params;
  const apiPath = path.join("/");

  if (!themeApi.baseUrl) {
    return NextResponse.json({ message: "THEME_API_BASE_URL is not set in .env" }, { status: 500 });
  }
  if (!isAllowedPath(apiPath)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const headers = new Headers({ Accept: "application/json" });
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const url = `${themeApi.baseUrl}/${apiPath}${req.nextUrl.search}`;

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(themeApi.timeoutMs),
    });
    const body = await res.arrayBuffer();
    return new Response(body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (e) {
    const timedOut = e instanceof Error && e.name === "TimeoutError";
    return NextResponse.json(
      { message: timedOut ? "The theme API did not respond in time." : "Could not reach the theme API." },
      { status: timedOut ? 504 : 502 },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const DELETE = forward;
