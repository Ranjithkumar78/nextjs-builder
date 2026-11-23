"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import type { Project } from "./types";
import { PREVIEW_CHANNEL } from "./store";
import { fetchThemes } from "./api";
import { googleFontsUrl, themeCss } from "./css";
import { ZoneView, type RenderCtx } from "./render/NodeView";

export default function Preview() {
  const [project, setProject] = useState<Project | null>(null);
  const [themeId, setThemeId] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [bar, setBar] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    // Initial values come from the URL, which only exists in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeId(q.get("theme"));
    setPageId(q.get("page"));

    // Saved themes come from the API; unsaved edits arrive from the editor tab.
    fetchThemes()
      .then((themes) => {
        if (!themes.length) return setError("There are no themes yet.");
        setProject((cur) => cur ?? { version: 1, themes, activeThemeId: themes[0].id, activePageId: themes[0].pages[0].id });
      })
      .catch((e) => setError(`Could not load themes from the API (${e instanceof Error ? e.message : "unknown error"}).`));

    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(PREVIEW_CHANNEL) : null;
    if (channel) {
      channel.onmessage = (e: MessageEvent<Project>) => {
        if (e.data?.themes?.length) {
          setProject(e.data);
          setError(null);
        }
      };
    }
    const onPop = () => {
      const q2 = new URLSearchParams(window.location.search);
      setPageId(q2.get("page"));
    };
    window.addEventListener("popstate", onPop);
    return () => {
      channel?.close();
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  const theme = project ? project.themes.find((t) => t.id === themeId) ?? project.themes.find((t) => t.id === project.activeThemeId) ?? project.themes[0] : null;
  const page = theme ? theme.pages.find((p) => p.id === pageId) ?? theme.pages[0] : null;

  const nodes = useMemo(() => (theme && page ? [...(page.showHeader ? theme.header : []), ...page.nodes, ...(page.showFooter ? theme.footer : [])] : []), [theme, page]);
  const css = useMemo(() => (theme ? themeCss(theme, nodes, "media") : ""), [theme, nodes]);
  const fonts = useMemo(() => (theme ? googleFontsUrl(theme, nodes) : null), [theme, nodes]);

  useEffect(() => {
    if (page && theme) document.title = `${page.name} · ${theme.name}`;
  }, [page, theme]);

  if (error && !project) return <p style={{ font: "14px system-ui, sans-serif", padding: 24 }}>{error}</p>;
  if (!project || !theme || !page) return null;

  const go = (id: string) => {
    setPageId(id);
    const url = `/preview?theme=${theme.id}&page=${id}`;
    window.history.pushState(null, "", url);
    window.scrollTo(0, 0);
  };

  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element).closest("a");
    if (!a) return;
    const href = a.getAttribute("href") ?? "";
    if (href.startsWith("/")) {
      const slug = href.split("#")[0].replace(/^\/+|\/+$/g, "");
      const target = slug === "" ? theme.pages[0] : theme.pages.find((p) => p.slug === slug);
      if (target) {
        e.preventDefault();
        go(target.id);
      }
    } else if (href === "#") e.preventDefault();
  };

  const rc: RenderCtx = { edit: false, eventId: theme.eventId };

  return (
    <>
      {fonts ? <link rel="stylesheet" href={fonts} /> : null}
      <style>{`html{scroll-behavior:smooth} body{margin:0} ${css}`}</style>
      <div className="tb-root" onClick={onClick} style={{ minHeight: "100vh" }}>
        {page.showHeader ? <ZoneView nodes={theme.header} rc={rc} /> : null}
        <main>
          <ZoneView nodes={page.nodes} rc={rc} />
        </main>
        {page.showFooter ? <ZoneView nodes={theme.footer} rc={rc} /> : null}
      </div>
      {bar ? (
        <div className="pv-bar">
          <strong>Preview</strong>
          <select value={page.id} onChange={(e) => go(e.target.value)}>
            {theme.pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <a href={`/?theme=${theme.id}&page=${page.id}`}>Back to editor</a>
          <button onClick={() => setBar(false)} title="Hide this bar">
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
