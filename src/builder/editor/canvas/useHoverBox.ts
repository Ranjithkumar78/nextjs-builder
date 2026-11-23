"use client";

import { useCallback, useState, type MouseEvent, type RefObject } from "react";
import { boxOf, nodeIdFrom, type Box } from "./geometry";

/** Outline of the element under the mouse (not the selected one). Re-renders only when that element changes. */
export function useHoverBox(frameRef: RefObject<HTMLDivElement | null>, selectedId: string | null) {
  const [hover, setHover] = useState<{ id: string; box: Box } | null>(null);
  const onMouseOver = (e: MouseEvent) => {
    const id = nodeIdFrom(e.target);
    const target = id && id !== selectedId ? id : null;
    // mouseover fires for every child element; keep the same state while the hovered node is unchanged.
    setHover((cur) => {
      if ((cur?.id ?? null) === target) return cur;
      const box = target ? boxOf(frameRef.current, target) : null;
      return target && box ? { id: target, box } : null;
    });
  };
  const clear = useCallback(() => setHover(null), []);
  return { box: hover?.box ?? null, onMouseOver, clear };
}
