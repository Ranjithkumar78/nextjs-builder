"use client";

import type { DragEvent } from "react";
import type { TBNode } from "../../../types";
import { smartTarget, useBuilder } from "../../../store";
import { startNewDrag } from "../../../dnd";

/** Props for an Add-panel item: drag it onto the canvas/layers, or click to insert after the selection. */
export function useInsert() {
  const { state, dispatch } = useBuilder();
  return (create: () => TBNode, label: string) => ({
    draggable: true,
    onDragStart: (e: DragEvent) => startNewDrag(e, create, label),
    onClick: () => dispatch({ type: "ADD_NODE", node: create(), target: smartTarget(state) }),
    title: "Drag onto the canvas or click to insert",
  });
}
