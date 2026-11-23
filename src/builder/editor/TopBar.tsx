"use client";

import { useEffect, useRef, useState } from "react";
import { isValidProject, reIdTheme, useBuilder, withUlidIds } from "../store";
import { Icon } from "../ui/Icon";
import { exportPage, exportProjectJson, exportThemeZip } from "../exporter";
import type { Device } from "../types";

export function TopBar() {
  const { state, dispatch, theme, page, retrySync } = useBuilder();
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [menu]);

  const devices: { id: Device; icon: string; label: string }[] = [
    { id: "desktop", icon: "desktop", label: "Desktop" },
    { id: "tablet", icon: "tablet", label: "Tablet (820px)" },
    { id: "mobile", icon: "mobile", label: "Mobile (390px)" },
  ];

  const { sync } = state;

  return (
    <header className="b-top">
      <div className="b-top-left">
        <div className="b-logo">
          <span className="b-logo-mark">
            <Icon name="palette" size={16} />
          </span>
          Theme Builder
        </div>
        <div className="b-top-sep" />
        <label className="b-top-select" title="Active theme">
          <Icon name="palette" size={14} />
          <select value={theme.id} onChange={(e) => dispatch({ type: "SET_THEME", id: e.target.value })}>
            {state.project.themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="b-top-select" title="Active page">
          <Icon name="file" size={14} />
          <select value={page.id} onChange={(e) => dispatch({ type: "SET_PAGE", id: e.target.value })}>
            {theme.pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="b-top-center">
        <div className="b-seg">
          {devices.map((d) => (
            <button key={d.id} className={state.ui.device === d.id ? "on" : ""} title={d.label} onClick={() => dispatch({ type: "UI", patch: { device: d.id } })}>
              <Icon name={d.icon} size={16} />
            </button>
          ))}
        </div>
      </div>

      <div className="b-top-right">
        <button className="b-top-palette" title="Edit theme colors & fonts" onClick={() => dispatch({ type: "UI", patch: { leftTab: "themes", selectedId: null } })}>
          <span className="b-dots">
            {(["primary", "secondary", "accent", "background", "text"] as const).map((k) => (
              <i key={k} style={{ background: theme.tokens.colors[k] }} />
            ))}
          </span>
          Theme colors
        </button>
        {sync.status === "error" ? (
          <button className="b-saved error" title={`${sync.message ?? "Not saved"} — click to try again`} onClick={retrySync}>
            <Icon name="close" size={13} /> Not saved · Retry
          </button>
        ) : (
          <span className="b-saved" title={sync.status === "saving" ? "Saving to the server…" : "All changes are saved to the server"}>
            {sync.status === "saving" ? <span className="b-spinner tiny" /> : <Icon name="check" size={13} />} {sync.status === "saving" ? "Saving…" : "Saved"}
          </span>
        )}
        <button className="b-icon-btn" title="Undo (Ctrl+Z)" disabled={!state.past.length} onClick={() => dispatch({ type: "UNDO" })}>
          <Icon name="undo" size={16} />
        </button>
        <button className="b-icon-btn" title="Redo (Ctrl+Shift+Z)" disabled={!state.future.length} onClick={() => dispatch({ type: "REDO" })}>
          <Icon name="redo" size={16} />
        </button>
        <div className="b-menu-wrap" ref={menuRef}>
          <button className="b-btn" onClick={() => setMenu(!menu)}>
            <Icon name="download" size={14} /> Export
          </button>
          {menu ? (
            <div className="b-menu">
              <button
                onClick={() => {
                  void exportPage(theme, page);
                  setMenu(false);
                }}
              >
                <Icon name="file" size={14} /> This page as HTML
              </button>
              <button
                onClick={() => {
                  void exportThemeZip(theme);
                  setMenu(false);
                }}
              >
                <Icon name="download" size={14} /> Whole theme as ZIP site
              </button>
              <button
                onClick={() => {
                  exportProjectJson(state.project);
                  setMenu(false);
                }}
              >
                <Icon name="code" size={14} /> Backup all themes (JSON)
              </button>
              <div className="b-menu-sep" />
              <button onClick={() => fileRef.current?.click()}>
                <Icon name="upload" size={14} /> Import backup (JSON)
              </button>
            </div>
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              try {
                const data = JSON.parse(await f.text());
                if (isValidProject(data)) {
                  dispatch({ type: "LOAD", project: withUlidIds(data) });
                } else if (data && Array.isArray(data.pages) && Array.isArray(data.header)) {
                  // a single theme.json from a ZIP export
                  dispatch({ type: "ADD_THEME", theme: reIdTheme(data) });
                } else alert("This file is not a Theme Builder backup.");
              } catch {
                alert("Could not read this file.");
              }
              setMenu(false);
            }}
          />
        </div>
        <a
          className="b-btn primary"
          href={`/preview?theme=${theme.id}&page=${page.id}`}
          target="_blank"
          rel="noreferrer"
          title="Opens a live preview in a new tab — it updates as you edit"
        >
          <Icon name="play" size={13} /> Preview
        </a>
      </div>
    </header>
  );
}
