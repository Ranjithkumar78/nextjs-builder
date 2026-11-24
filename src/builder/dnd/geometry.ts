import type { DropTarget, Zone } from "../types";

// Works out where a drop lands on the canvas, and where to draw the drop indicator.
export interface Indicator {
  mode: "line" | "box";
  x: number;
  y: number;
  w: number;
  h: number;
}

export type DropResult = { target: DropTarget; indicator: Indicator };

type Flow = "row" | "col" | "grid";

function flowOf(el: Element): Flow {
  const cs = getComputedStyle(el);
  if (cs.display.includes("grid")) return "grid";
  if (cs.display.includes("flex") && cs.flexDirection.startsWith("row")) return "row";
  return "col";
}

function nodeChildren(el: Element): HTMLElement[] {
  return Array.from(el.children).filter((c): c is HTMLElement => c instanceof HTMLElement && c.hasAttribute("data-node-id"));
}

function rel(r: DOMRect, origin: DOMRect) {
  return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
}

function lineFor(r: DOMRect, origin: DOMRect, side: "before" | "after", flow: Flow): Indicator {
  const b = rel(r, origin);
  const T = 3;
  if (flow === "row" || flow === "grid") {
    return { mode: "line", x: side === "before" ? b.x - T / 2 : b.x + b.w - T / 2, y: b.y, w: T, h: b.h };
  }
  return { mode: "line", x: b.x, y: side === "before" ? b.y - T / 2 : b.y + b.h - T / 2, w: b.w, h: T };
}

/** Choose the insertion index inside a container element based on pointer position. */
function indexInside(container: Element, x: number, y: number, origin: DOMRect): { index: number; indicator: Indicator } {
  const kids = nodeChildren(container);
  const flow = flowOf(container);
  if (kids.length === 0) {
    const r = container.getBoundingClientRect();
    const b = rel(r, origin);
    return { index: 0, indicator: { mode: "box", ...b } };
  }
  let best = 0;
  let bestDist = Infinity;
  kids.forEach((k, i) => {
    const r = k.getBoundingClientRect();
    const cx = Math.max(r.left, Math.min(x, r.right));
    const cy = Math.max(r.top, Math.min(y, r.bottom));
    const d = Math.hypot(x - cx, y - cy);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  const r = kids[best].getBoundingClientRect();
  const after = flow === "col" ? y > r.top + r.height / 2 : x > r.left + r.width / 2;
  return { index: best + (after ? 1 : 0), indicator: lineFor(r, origin, after ? "after" : "before", flow) };
}

export function computeDrop(target: EventTarget | null, x: number, y: number, frame: HTMLElement): DropResult | null {
  if (!(target instanceof Element)) return null;
  const origin = frame.getBoundingClientRect();
  const el = target.closest("[data-node-id], [data-zone-root]");
  if (!el || !frame.contains(el)) return null;

  if (el.hasAttribute("data-zone-root")) {
    const zone = el.getAttribute("data-zone-root") as Zone;
    const { index, indicator } = indexInside(el, x, y, origin);
    return { target: { zone, parentId: null, index }, indicator };
  }

  const id = el.getAttribute("data-node-id")!;
  const zone = el.getAttribute("data-zone") as Zone;
  const parentEl = el.parentElement?.closest("[data-node-id], [data-zone-root]");
  if (!parentEl || !el.parentElement) return null;
  const parentId = parentEl.hasAttribute("data-node-id") ? parentEl.getAttribute("data-node-id") : null;
  // Siblings live in the direct parent element, which may be a container's inner [data-kids] wrapper.
  const myIndex = nodeChildren(el.parentElement).indexOf(el as HTMLElement);
  const flow = flowOf(el.parentElement);
  const r = el.getBoundingClientRect();
  const horizontal = flow !== "col";
  const pos = horizontal ? x - r.left : y - r.top;
  const size = horizontal ? r.width : r.height;

  if (el.getAttribute("data-container") === "true") {
    const edge = Math.min(horizontal ? 22 : 14, size * 0.25);
    if (pos < edge) return { target: { zone, parentId, index: myIndex }, indicator: lineFor(r, origin, "before", flow) };
    if (pos > size - edge) return { target: { zone, parentId, index: myIndex + 1 }, indicator: lineFor(r, origin, "after", flow) };
    const inside = indexInside(el.querySelector(":scope > [data-kids]") ?? el, x, y, origin);
    return { target: { zone, parentId: id, index: inside.index }, indicator: inside.indicator };
  }
  const after = pos > size / 2;
  return { target: { zone, parentId, index: myIndex + (after ? 1 : 0) }, indicator: lineFor(r, origin, after ? "after" : "before", flow) };
}
