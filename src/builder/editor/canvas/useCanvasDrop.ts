"use client";

import { useEffect, useState, type DragEvent, type RefObject } from "react";
import { useBuilder } from "../../store";
import { computeDrop, dragState, dropAction, type Indicator } from "../../dnd";
import { containsId, locate } from "../../tree";

/** Drag-over / drop handling for the canvas frame, with the drop indicator to draw. */
export function useCanvasDrop(frameRef: RefObject<HTMLDivElement | null>) {
  const { dispatch, theme, page } = useBuilder();
  const [indicator, setIndicator] = useState<Indicator | null>(null);

  // A drag that ends anywhere (or is dropped outside the canvas) hides the indicator.
  useEffect(() => {
    const end = () => {
      setIndicator(null);
      dragState.clear();
    };
    window.addEventListener("dragend", end);
    window.addEventListener("drop", end);
    return () => {
      window.removeEventListener("dragend", end);
      window.removeEventListener("drop", end);
    };
  }, []);

  const onDragOver = (e: DragEvent) => {
    const payload = dragState.get();
    if (!payload || !frameRef.current) return;
    const res = computeDrop(e.target, e.clientX, e.clientY, frameRef.current);
    // A node cannot be dropped into itself or its own children.
    const moving = payload.kind === "move" ? locate(theme, page, payload.id) : null;
    if (!res || (moving && res.target.parentId && containsId(moving.node, res.target.parentId))) {
      setIndicator(null);
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = payload.kind === "move" ? "move" : "copy";
    setIndicator(res.indicator);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIndicator(null);
    if (!dragState.get() || !frameRef.current) return;
    const res = computeDrop(e.target, e.clientX, e.clientY, frameRef.current);
    if (!res) return dragState.clear();
    const action = dropAction(res.target);
    if (action) dispatch(action);
  };

  const onDragLeave = (e: DragEvent) => {
    if (!frameRef.current?.contains(e.relatedTarget as Node)) setIndicator(null);
  };

  return { indicator, onDragOver, onDrop, onDragLeave };
}
