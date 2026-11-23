"use client";

import { useState } from "react";
import { useBuilder } from "../../../store";
import { Icon } from "../../../ui/Icon";
import { Hint, Panel } from "../../../ui/common";
import { NewPageForm } from "./NewPageForm";
import { PageRow } from "./PageRow";

/** The theme's pages: add, open, rename, reorder, duplicate and delete. */
export function PagesTab() {
  const { theme } = useBuilder();
  const [adding, setAdding] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const head = (
    <>
      <div className="b-panel-title">
        Pages <span className="b-count">{theme.pages.length}</span>
      </div>
      <button className="b-btn small primary" onClick={() => setAdding(!adding)}>
        <Icon name="plus" size={13} /> New page
      </button>
    </>
  );
  return (
    <Panel head={head}>
      {adding ? <NewPageForm onDone={() => setAdding(false)} /> : null}
      <div className="b-list">
        {theme.pages.map((p, i) => (
          <PageRow key={p.id} p={p} isHome={i === 0} renaming={renaming === p.id} onRename={setRenaming} />
        ))}
      </div>
      <Hint>
        The header and footer are <strong>global</strong>: edit them on any page and every page in this theme updates. Turn them off per page in page settings (click empty canvas space).
      </Hint>
    </Panel>
  );
}
