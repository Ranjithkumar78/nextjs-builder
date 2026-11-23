"use client";

import { useState } from "react";
import type { Page, Theme } from "../types";
import { Options } from "../ui/controls/SelectInput";

/** Floating bar: page switcher and a link back to the editor. Can be hidden. */
export function PreviewBar({ theme, page, onPage }: { theme: Theme; page: Page; onPage: (id: string) => void }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="pv-bar">
      <strong>Preview</strong>
      <select value={page.id} onChange={(e) => onPage(e.target.value)}>
        <Options options={theme.pages.map((p) => ({ value: p.id, label: p.name }))} />
      </select>
      <a href={`/?theme=${theme.id}&page=${page.id}`}>Back to editor</a>
      <button onClick={() => setOpen(false)} title="Hide this bar">
        ×
      </button>
    </div>
  );
}
