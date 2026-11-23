/** A rectangle relative to the canvas frame. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The node element with this id inside the frame. */
export function nodeElement(frame: HTMLElement | null, id: string | null): Element | null {
  return frame && id ? frame.querySelector(`[data-node-id="${id}"]`) : null;
}

/** Where a node sits inside the frame, or null if it is not rendered. */
export function boxOf(frame: HTMLElement | null, id: string | null): Box | null {
  const el = nodeElement(frame, id);
  if (!frame || !el) return null;
  const r = el.getBoundingClientRect();
  const o = frame.getBoundingClientRect();
  return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
}

/** The id of the node an event happened on. */
export function nodeIdFrom(t: EventTarget | null): string | null {
  if (!(t instanceof Element)) return null;
  return t.closest("[data-node-id]")?.getAttribute("data-node-id") ?? null;
}

/** Absolute position style for an overlay box. */
export const boxStyle = (b: Box) => ({ left: b.x, top: b.y, width: b.w, height: b.h });
