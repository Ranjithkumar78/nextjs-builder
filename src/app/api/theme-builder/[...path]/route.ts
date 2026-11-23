import type { NextRequest } from "next/server";
import { isAllowedPath, themeApi } from "@/server/themeApi";
import { forwardTo, jsonError } from "@/server/proxy";

// Proxies the builder's requests to the Stutzee API (same-origin for the browser, so no CORS setup is needed).
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };

async function forward(req: NextRequest, ctx: Ctx): Promise<Response> {
  const { path } = await ctx.params;
  const apiPath = path.join("/");

  if (!themeApi.baseUrl) return jsonError("THEME_API_BASE_URL is not set in .env", 500);
  if (!isAllowedPath(apiPath)) return jsonError("Not found", 404);

  const headers = new Headers({ Accept: "application/json" });
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  return forwardTo(`${themeApi.baseUrl}/${apiPath}${req.nextUrl.search}`, { method: req.method, headers, body: hasBody ? await req.arrayBuffer() : undefined }, "theme API");
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const DELETE = forward;
