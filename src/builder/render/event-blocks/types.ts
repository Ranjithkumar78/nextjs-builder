import type { CSSProperties } from "react";
import type { NodeProps } from "../../types";
import { str } from "../../lib/values";

/** What every event-data block gets from NodeView. */
export interface EventBlockProps {
  nodeId: string;
  props: NodeProps;
  eventId: string;
  edit: boolean;
}

/** CSS variables read by .tb-ev-grid: max columns and the minimum card width. */
export function gridStyle(columns: number, min: number): CSSProperties {
  return { "--ev-cols": String(Math.max(1, columns)), "--ev-min": `${min}px` } as CSSProperties;
}

/** Card classes for the block's chosen card style, plus extra classes. */
export function cardClass(props: NodeProps, extra = ""): string {
  return `tb-ev-card tb-ev-card--${str(props.cardStyle, "elevated")}${extra ? " " + extra : ""}`;
}

/** Chip/dot color from an API color (e.g. a session track), or the theme primary. */
export function chipColor(color: string): CSSProperties | undefined {
  return color ? ({ "--ev-chip": color } as CSSProperties) : undefined;
}
