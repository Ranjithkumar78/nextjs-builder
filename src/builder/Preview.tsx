"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import type { Project } from "./types";
import { loadProject, STORAGE_KEY } from "./store";
import { defaultProject } from "./defaults";
import { googleFontsUrl, themeCss } from "./css";
import { ZoneView, type RenderCtx } from "./render/NodeView";

export default function Preview() {
  const [project, setProject] = useState<Project | null>(null);
  const [themeId, setThemeId] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [bar, setBar] = useState(true);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setThemeId(q.get("theme"));
    setPageId(q.get("page"));
    setProject(loadProject() ?? defaultProject());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const p = loadProject();
        if (p) setProject(p);
      }
    };
    const onPop = () => {
      const q2 = new URLSearchParams(window.location.search);
      setPageId(q2.get("page"));
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("storage", onStorage);
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

  const rc: RenderCtx = { edit: false };

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
          <a href="/">Back to editor</a>
          <button onClick={() => setBar(false)} title="Hide this bar">
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
