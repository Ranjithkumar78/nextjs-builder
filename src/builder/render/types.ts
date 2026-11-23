import type { ReactNode } from "react";
import type { NodeProps, TBNode, Zone } from "../types";

export interface RenderCtx {
  edit: boolean;
  zone?: Zone;
  editingId?: string | null;
  onTextCommit?: (id: string, key: string, text: string) => void;
  onTextDone?: () => void;
  mapHref?: (href: string) => string;
  /** The theme's Stutzee event, used by the Speakers, Sponsors, Tickets and Sessions blocks. */
  eventId?: string;
}

export type Attrs = Record<string, unknown>;

/** Everything a node renderer needs, prepared once by NodeView. */
export interface RenderArgs {
  node: TBNode;
  p: NodeProps;
  /** Class names, id and editor data attributes for the node's root element. */
  attrs: Attrs;
  rc: RenderCtx;
  /** The node's children (or the editor's "drop here" placeholder). */
  kids: () => ReactNode;
  /** A text element for a prop, editable in place on the canvas. */
  text: (tag: string, attrs: Attrs, key?: string) => ReactNode;
  /** A link target, rewritten for exports. */
  href: (h: unknown) => string;
}

export type Renderer = (a: RenderArgs) => ReactNode;
