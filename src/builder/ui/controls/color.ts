import type { ThemeColors } from "../../types";
import { resolveColor } from "../../css/tokens";

/** Colors offered as one-click swatches in the color picker. */
export const QUICK_COLORS = ["#ffffff", "#f8fafc", "#e2e8f0", "#94a3b8", "#475569", "#0f172a", "#000000", "#ef4444", "#f97316", "#f59e0b", "#22c55e", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "transparent"];

/** Any color (hex, rgb() or theme variable) as #rrggbb for <input type="color">. */
export function toHex(v: string, colors: ThemeColors): string {
  v = resolveColor(v, colors);
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  if (/^#[0-9a-f]{3}$/i.test(v)) return "#" + v.slice(1).split("").map((c) => c + c).join("");
  const rgb = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgb) return "#" + [rgb[1], rgb[2], rgb[3]].map((x) => Number(x).toString(16).padStart(2, "0")).join("");
  return "#000000";
}

/** A 6-digit hex value as-is, anything else as a neutral grey (for native color inputs). */
export const hexOrGrey = (v: string): string => (/^#[0-9a-f]{6}$/i.test(v) ? v : "#888888");

export function swatchBg(v: string): string {
  return v || "transparent";
}

/** Where to open a popover of the given size next to an anchor, kept inside the window. */
export function popoverPosition(anchor: DOMRect, w: number, h: number): { left: number; top: number } {
  const left = Math.max(8, Math.min(anchor.right - w, window.innerWidth - w - 8));
  const top = anchor.bottom + 6 + h > window.innerHeight ? Math.max(8, anchor.top - h - 6) : anchor.bottom + 6;
  return { left, top };
}
