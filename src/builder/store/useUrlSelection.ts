"use client";

import { useEffect } from "react";

/** Keep the URL (?theme=…&page=…) pointing at the open theme and page. */
export function useUrlSelection(ready: boolean, themeId: string, pageId: string): void {
  useEffect(() => {
    if (!ready) return;
    const q = new URLSearchParams(window.location.search);
    if (q.get("theme") === themeId && q.get("page") === pageId) return;
    q.set("theme", themeId);
    q.set("page", pageId);
    window.history.replaceState(null, "", `${window.location.pathname}?${q}`);
  }, [ready, themeId, pageId]);
}
