"use client";

import type { MouseEvent } from "react";
import { useBuilder } from "../../store";
import { startMoveDrag } from "../../dnd";
import type { Located } from "../../tree";
import { getDef } from "../../registry";
import { Icon } from "../../ui/Icon";
import { IconButton } from "../../ui/common";
import type { Box } from "./geometry";

/** Label (drag handle) and quick actions shown above the selected node. */
export function SelectionToolbar({ box, sel }: { box: Box; sel: Located }) {
  const { dispatch } = useBuilder();
  const { node, parent } = sel;
  const id = node.id;
  // Above the node when there is room, otherwise below small nodes or inside tall ones.
  const top = box.y >= 34 ? box.y - 30 : box.h < 140 ? box.y + box.h + 4 : box.y + 4;
  const act = (fn: () => void) => (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    fn();
  };
  const stop = (e: MouseEvent) => e.stopPropagation();
  return (
    <div className="b-seltool" style={{ left: Math.max(0, box.x), top }} onClick={stop} onDoubleClick={stop}>
      <span className="b-seltool-drag" draggable title="Drag to move" onDragStart={(e) => startMoveDrag(e, id)}>
        <Icon name="drag" size={13} />
        {node.name || getDef(node.type).label}
        {sel.zone !== "page" ? <em>global</em> : null}
      </span>
      {parent ? <IconButton icon="parent" title="Select parent" onClick={act(() => dispatch({ type: "UI", patch: { selectedId: parent.id } }))} /> : null}
      <IconButton icon="up" title="Move up" onClick={act(() => dispatch({ type: "MOVE_SIBLING", id, dir: -1 }))} />
      <IconButton icon="down" title="Move down" onClick={act(() => dispatch({ type: "MOVE_SIBLING", id, dir: 1 }))} />
      <IconButton icon="copy" title="Duplicate (Ctrl+D)" onClick={act(() => dispatch({ type: "DUPLICATE_NODE", id }))} />
      <IconButton icon={node.hidden ? "eyeOff" : "eye"} title={node.hidden ? "Show" : "Hide"} onClick={act(() => dispatch({ type: "TOGGLE_HIDDEN", id }))} />
      <IconButton icon="trash" title="Delete (Del)" className="danger" onClick={act(() => dispatch({ type: "DELETE_NODE", id }))} />
    </div>
  );
}
