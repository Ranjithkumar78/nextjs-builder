import type { DragEvent } from "react";
import type { DropTarget, TBNode } from "../types";
import type { Action } from "../store/types";

export type DragPayload = { kind: "new"; create: () => TBNode; label: string } | { kind: "move"; id: string };

/** What is being dragged right now (only one drag at a time, shared by canvas, layers and the Add panel). */
let payload: DragPayload | null = null;
export const dragState = {
  set(p: DragPayload) {
    payload = p;
  },
  get(): DragPayload | null {
    return payload;
  },
  clear() {
    payload = null;
  },
};

/** Start dragging an existing node (canvas, selection handle, layers tree). */
export function startMoveDrag(e: DragEvent, id: string): void {
  e.stopPropagation();
  dragState.set({ kind: "move", id });
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", id);
}

/** Start dragging a new component or block from the Add panel. */
export function startNewDrag(e: DragEvent, create: () => TBNode, label: string): void {
  dragState.set({ kind: "new", create, label });
  e.dataTransfer.effectAllowed = "copy";
  e.dataTransfer.setData("text/plain", label);
}

/** The action that drops the current payload at a target (or null when nothing is being dragged). */
export function dropAction(target: DropTarget): Action | null {
  const p = dragState.get();
  dragState.clear();
  if (!p) return null;
  return p.kind === "new" ? { type: "ADD_NODE", node: p.create(), target } : { type: "MOVE_NODE", id: p.id, target };
}
