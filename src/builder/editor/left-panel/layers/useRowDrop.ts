"use client";

import { useState, type DragEvent } from "react";
import type { TBNode, Zone } from "../../../types";
import { dragState } from "../../../dnd";
import { useLayerDrop } from "./useLayerDrop";

export type DropPos = "before" | "after" | "inside";

/**
 * Drag-over / drop on a layer row: the top or bottom part drops before/after the node,
 * the middle of a container drops inside it.
 */
export function useRowDrop(node: TBNode, zone: Zone, parentId: string | null, index: number, container: boolean, onDropInside: () => void) {
  const [pos, setPos] = useState<DropPos | null>(null);
  const drop = useLayerDrop();
  const calc = (e: DragEvent<HTMLDivElement>): DropPos => {
    const r = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - r.top) / r.height;
    if (container) return y < 0.28 ? "before" : y > 0.72 ? "after" : "inside";
    return y < 0.5 ? "before" : "after";
  };
  return {
    pos,
    onDragOver: (e: DragEvent<HTMLDivElement>) => {
      const p = dragState.get();
      if (!p || (p.kind === "move" && p.id === node.id)) return;
      e.preventDefault();
      e.stopPropagation();
      setPos(calc(e));
    },
    onDragLeave: () => setPos(null),
    onDrop: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const where = calc(e);
      setPos(null);
      if (where === "inside") {
        onDropInside();
        drop({ zone, parentId: node.id, index: node.children?.length ?? 0 });
      } else drop({ zone, parentId, index: index + (where === "after" ? 1 : 0) });
    },
  };
}
