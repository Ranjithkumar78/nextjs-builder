const BASE = "/api/theme-builder";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** Reads a JSON body without failing on empty or invalid replies. */
export async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

/** The first validation error, message or error text in an API error reply. */
function errorMessage(data: unknown, status: number): string {
  const d = data as { message?: string; error?: string; errors?: Record<string, string[]> } | null;
  const first = d?.errors ? Object.values(d.errors)[0]?.[0] : undefined;
  return first ?? d?.message ?? d?.error ?? `Request failed (${status})`;
}

/** Calls the builder's API proxy and unwraps `{ results }` replies. */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, { ...init, headers: { Accept: "application/json", ...(init?.headers ?? {}) } });
  const data = await readJson(res);
  if (!res.ok) throw new ApiError(errorMessage(data, res.status), res.status);
  return ((data as { results?: T } | null)?.results ?? data) as T;
}

/** GET a builder API path whose reply is used as-is (no unwrapping). */
export async function getJson(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}/${path}`, { headers: { Accept: "application/json" } });
  const data = await readJson(res);
  if (!res.ok) throw new ApiError(errorMessage(data, res.status), res.status);
  return data;
}
