"use client";

import type { ReactNode } from "react";
import { useStyleEditor } from "../inspector/StyleEditor";
import { TextQuick } from "./TextQuick";
import { ButtonQuick } from "./ButtonQuick";
import { BoxQuick } from "./BoxQuick";
import { MediaQuick } from "./MediaQuick";
import { SimpleQuick } from "./SimpleQuick";

/* Simple, preset-based editing. Every control writes normal styles, so the Style tab
   always shows exactly what a quick choice did. */

const TEXT_TYPES = new Set(["heading", "text", "badge", "link", "quote", "list", "logo", "navmenu", "socials"]);
const BOX_TYPES = new Set(["section", "container", "row", "column", "grid", "box", "form"]);
const MEDIA_TYPES = new Set(["image", "video", "map", "countdown", "embed"]);

/** The design panel for an element type. */
function DesignPanel({ type }: { type: string }) {
  if (type === "button" || type === "submit") return <ButtonQuick />;
  if (TEXT_TYPES.has(type)) return <TextQuick />;
  if (BOX_TYPES.has(type)) return <BoxQuick />;
  if (MEDIA_TYPES.has(type)) return <MediaQuick />;
  return <SimpleQuick />;
}

/** The Edit tab: content fields (if any), then quick design presets for the element type. */
export function QuickEdit({ content }: { content: ReactNode }) {
  const { node } = useStyleEditor();
  return (
    <div className="q-wrap">
      {content}
      <div className="q-title">Design</div>
      <DesignPanel type={node.type} />
      <div className="q-foot">
        Need finer control? Every value is in the <strong>Style</strong> tab.
      </div>
    </div>
  );
}
