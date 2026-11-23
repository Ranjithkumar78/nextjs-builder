"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import type { Device, Project } from "../../types";
import { boxOf, nodeElement, type Box } from "./geometry";

/**
 * Keeps the selection outline on the selected node: re-measured after every change that can move it
 * (edits, device switch, inline editing), on resize and when images in the canvas finish loading.
 */
export function useSelectionBox(frameRef: RefObject<HTMLDivElement | null>, selectedId: string | null, project: Project, device: Device, editingId: string | null): Box | null {
  const [box, setBox] = useState<Box | null>(null);

  useLayoutEffect(() => {
    // Measuring the DOM after layout is what this effect is for.
    setBox(boxOf(frameRef.current, selectedId));
  }, [frameRef, selectedId, project, device, editingId]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => setBox(boxOf(frame, selectedId));
    const ro = new ResizeObserver(update);
    ro.observe(frame);
    frame.querySelectorAll("img").forEach((img) => img.addEventListener("load", update));
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [frameRef, selectedId, project]);

  // Scroll a newly selected node into view if it is off-screen.
  useEffect(() => {
    const el = nodeElement(frameRef.current, selectedId);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.bottom < 60 || r.top > window.innerHeight - 40) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [frameRef, selectedId]);

  return box;
}
