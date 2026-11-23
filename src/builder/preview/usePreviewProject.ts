"use client";

import { useEffect, useState } from "react";
import type { Project, Theme } from "../types";
import { PREVIEW_CHANNEL, type PreviewMessage } from "../store/types";
import { fetchThemes } from "../api";
import { errorText } from "../lib/values";

/** Put an edited theme into the project (replacing the saved copy), or start a project with it. */
function withTheme(cur: Project | null, theme: Theme): Project {
  if (!cur) return { version: 1, themes: [theme], activeThemeId: theme.id, activePageId: theme.pages[0]?.id ?? "" };
  const known = cur.themes.some((t) => t.id === theme.id);
  return { ...cur, themes: known ? cur.themes.map((t) => (t.id === theme.id ? theme : t)) : [...cur.themes, theme] };
}

/** Saved themes from the API, updated with unsaved edits broadcast from the editor tab. */
export function usePreviewProject(): { project: Project | null; error: string | null } {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchThemes()
      .then((themes) => {
        if (!themes.length) return setError("There are no themes yet.");
        const saved: Project = { version: 1, themes, activeThemeId: themes[0].id, activePageId: themes[0].pages[0].id };
        // Edits that arrived before the API answered are newer than the saved copies.
        setProject((cur) => (cur ? cur.themes.reduce<Project>(withTheme, saved) : saved));
      })
      .catch((e) => setError(`Could not load themes from the API (${errorText(e)}).`));

    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.onmessage = (e: MessageEvent<PreviewMessage>) => {
      const theme = e.data?.theme;
      if (!theme?.pages?.length) return;
      setProject((cur) => withTheme(cur, theme));
      setError(null);
    };
    return () => channel.close();
  }, []);

  return { project, error };
}
