"use client";

import { useCallback, useRef, useState } from "react";
import { useBuilder } from "../../store";
import { exportPage, exportProjectJson, exportThemeZip } from "../../exporter";
import { useDismiss } from "../../ui/hooks/useDismiss";
import { Icon } from "../../ui/Icon";
import { useImportBackup } from "./useImportBackup";

/** Export the page/theme as HTML, back up or restore all themes as JSON. */
export function ExportMenu() {
  const { state, theme, page } = useBuilder();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);
  const importBackup = useImportBackup();

  const items: { icon: string; label: string; run: () => void }[] = [
    { icon: "file", label: "This page as HTML", run: () => void exportPage(theme, page) },
    { icon: "download", label: "Whole theme as ZIP site", run: () => void exportThemeZip(theme) },
    { icon: "code", label: "Backup all themes (JSON)", run: () => exportProjectJson(state.project) },
  ];
  return (
    <div className="b-menu-wrap" ref={ref}>
      <button className="b-btn" onClick={() => setOpen(!open)}>
        <Icon name="download" size={14} /> Export
      </button>
      {open ? (
        <div className="b-menu">
          {items.map((it) => (
            <button
              key={it.label}
              onClick={() => {
                it.run();
                close();
              }}
            >
              <Icon name={it.icon} size={14} /> {it.label}
            </button>
          ))}
          <div className="b-menu-sep" />
          <button
            onClick={() => {
              importBackup();
              close();
            }}
          >
            <Icon name="upload" size={14} /> Import backup (JSON)
          </button>
        </div>
      ) : null}
    </div>
  );
}
