"use client";

import type { DropTarget } from "../../../types";
import { useBuilder } from "../../../store";
import { dropAction } from "../../../dnd";

/** Drop whatever is being dragged at a position in the layers tree. */
export function useLayerDrop(): (target: DropTarget) => void {
  const { dispatch } = useBuilder();
  return (target) => {
    const action = dropAction(target);
    if (action) dispatch(action);
  };
}
