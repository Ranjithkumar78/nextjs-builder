"use client";

import { useEffect, useState } from "react";

/** The theme and page ids in the preview URL; page changes with back/forward. */
export function useUrlParams() {
  const [themeId, setThemeId] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  useEffect(() => {
    const read = () => new URLSearchParams(window.location.search);
    // Initial values come from the URL, which only exists in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeId(read().get("theme"));
    setPageId(read().get("page"));
    const onPop = () => setPageId(read().get("page"));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return { themeId, pageId, setPageId };
}
