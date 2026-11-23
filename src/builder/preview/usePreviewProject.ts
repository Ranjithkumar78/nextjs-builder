"use client";

import { useEffect, useState } from "react";
import type { Project } from "../types";
import { PREVIEW_CHANNEL } from "../store/types";
import { fetchThemes } from "../api";
import { errorText } from "../lib/values";

/** Saved themes from the API, replaced by unsaved edits broadcast from the editor tab. */
export function usePreviewProject(): { project: Project | null; error: string | null } {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchThemes()
      .then((themes) => {
        if (!themes.length) return setError("There are no themes yet.");
        setProject((cur) => cur ?? { version: 1, themes, activeThemeId: themes[0].id, activePageId: themes[0].pages[0].id });
      })
      .catch((e) => setError(`Could not load themes from the API (${errorText(e)}).`));

    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.onmessage = (e: MessageEvent<Project>) => {
      if (e.data?.themes?.length) {
        setProject(e.data);
        setError(null);
      }
    };
    return () => channel.close();
  }, []);

  return { project, error };
}
