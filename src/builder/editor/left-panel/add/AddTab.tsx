"use client";

import { useState } from "react";
import { Icon } from "../../../ui/Icon";
import { Hint, Panel, TabButtons } from "../../../ui/common";
import { ElementTiles } from "./ElementTiles";
import { BlockList } from "./BlockList";

type Mode = "elements" | "blocks";
const MODES = [
  { id: "elements", label: "Elements" },
  { id: "blocks", label: "Blocks" },
] as const;

/** Add tab: single elements or ready-made blocks, with search. */
export function AddTab() {
  const [mode, setMode] = useState<Mode>("elements");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const head = (
    <>
      <TabButtons tabs={MODES} value={mode} onChange={setMode} className="b-seg wide" />
      <div className="b-search">
        <Icon name="search" size={14} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${mode}…`} />
      </div>
    </>
  );
  return (
    <Panel head={head}>
      {mode === "elements" ? <ElementTiles query={query} /> : <BlockList query={query} />}
      <Hint>Tip: drag onto the canvas or the Layers tree, or click to insert after the selected element.</Hint>
    </Panel>
  );
}
