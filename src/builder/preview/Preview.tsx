"use client";

import { useEffect, useMemo, type MouseEvent } from "react";
import { pageForHref, pageNodes } from "../tree/pages";
import { SiteBody, ThemeStyles, type RenderCtx } from "../render";
import { usePreviewProject } from "./usePreviewProject";
import { useUrlParams } from "./useUrlParams";
import { PreviewBar } from "./PreviewBar";

/** Full-page live preview of a theme page, with working links between pages. */
export default function Preview() {
  const { project, error } = usePreviewProject();
  const { themeId, pageId, setPageId } = useUrlParams();

  const theme = project ? (project.themes.find((t) => t.id === themeId) ?? project.themes.find((t) => t.id === project.activeThemeId) ?? project.themes[0]) : null;
  const page = theme ? (theme.pages.find((p) => p.id === pageId) ?? theme.pages[0]) : null;
  const nodes = useMemo(() => (theme && page ? pageNodes(theme, page) : []), [theme, page]);
  const eventId = theme?.eventId;
  const rc = useMemo<RenderCtx>(() => ({ edit: false, eventId }), [eventId]);

  useEffect(() => {
    if (page && theme) document.title = `${page.name} · ${theme.name}`;
  }, [page, theme]);

  if (error && !project) return <p style={{ font: "14px system-ui, sans-serif", padding: 24 }}>{error}</p>;
  if (!project || !theme || !page) return null;

  const go = (id: string) => {
    setPageId(id);
    window.history.pushState(null, "", `/preview?theme=${theme.id}&page=${id}`);
    window.scrollTo(0, 0);
  };

  // Links to other pages of the theme switch pages inside the preview; "#" links do nothing.
  const onClick = (e: MouseEvent) => {
    const href = (e.target as Element).closest("a")?.getAttribute("href");
    if (href === undefined || href === null) return;
    const target = pageForHref(theme, href);
    if (target || href === "#") e.preventDefault();
    if (target) go(target.page.id);
  };

  return (
    <>
      <ThemeStyles theme={theme} nodes={nodes} mode="media" prefix="html{scroll-behavior:smooth} body{margin:0} " />
      <SiteBody theme={theme} page={page} rc={rc} onClick={onClick} style={{ minHeight: "100vh" }} />
      <PreviewBar theme={theme} page={page} onPage={go} />
    </>
  );
}
