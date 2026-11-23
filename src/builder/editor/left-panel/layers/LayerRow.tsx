"use client";

import { useState } from "react";
import type { TBNode, Zone } from "../../../types";
import { useBuilder } from "../../../store";
import { getDef } from "../../../registry";
import { startMoveDrag } from "../../../dnd";
import { Icon } from "../../../ui/Icon";
import { IconButton } from "../../../ui/common";
import { useRowDrop } from "./useRowDrop";

/** Types whose text is previewed next to the layer name. */
const TEXT_PREVIEW = new Set(["heading", "text", "button"]);

/** A node in the layers tree (and, when expanded, its children). */
export function LayerRow({ node, zone, parentId, index, depth }: { node: TBNode; zone: Zone; parentId: string | null; index: number; depth: number }) {
  const { state, dispatch } = useBuilder();
  const [open, setOpen] = useState(depth < 1);
  const def = getDef(node.type);
  const container = !!def.container;
  const { pos, ...dropProps } = useRowDrop(node, zone, parentId, index, container, () => setOpen(true));
  const selected = state.ui.selectedId === node.id;

  return (
    <>
      <div
        className={`b-layer ${selected ? "sel" : ""} ${node.hidden ? "hidden" : ""} ${pos ? "drop-" + pos : ""}`}
        style={{ paddingLeft: 8 + depth * 14 }}
        draggable
        onDragStart={(e) => startMoveDrag(e, node.id)}
        {...dropProps}
        onClick={() => dispatch({ type: "UI", patch: { selectedId: node.id } })}
      >
        {container ? (
          <IconButton
            icon={open ? "chevronDown" : "chevronRight"}
            title={open ? "Collapse" : "Expand"}
            size={12}
            className="b-layer-caret"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          />
        ) : (
          <span className="b-layer-caret" />
        )}
        <Icon name={def.icon} size={13} />
        <span className="b-layer-name">{node.name || def.label}</span>
        {TEXT_PREVIEW.has(node.type) ? <span className="b-layer-sub">{String(node.props.text ?? "").slice(0, 24)}</span> : null}
        <IconButton
          icon={node.hidden ? "eyeOff" : "eye"}
          title={node.hidden ? "Show" : "Hide"}
          size={12}
          className="b-layer-eye"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "TOGGLE_HIDDEN", id: node.id });
          }}
        />
      </div>
      {container && open ? (node.children ?? []).map((c, i) => <LayerRow key={c.id} node={c} zone={zone} parentId={node.id} index={i} depth={depth + 1} />) : null}
    </>
  );
}
