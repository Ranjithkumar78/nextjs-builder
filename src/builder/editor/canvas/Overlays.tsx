import type { Indicator } from "../../dnd";
import type { Located } from "../../tree";
import { boxStyle, type Box } from "./geometry";
import { SelectionToolbar } from "./SelectionToolbar";

/** Hover outline, selection outline + toolbar, or the drop indicator while dragging. */
export function Overlays({ hover, selBox, sel, indicator }: { hover: Box | null; selBox: Box | null; sel: Located | null; indicator: Indicator | null }) {
  if (indicator) return <div className={indicator.mode === "box" ? "b-ov b-ov-dropbox" : "b-ov b-ov-line"} style={boxStyle(indicator)} />;
  return (
    <>
      {hover ? <div className="b-ov b-ov-hover" style={boxStyle(hover)} /> : null}
      {selBox && sel ? (
        <>
          <div className="b-ov b-ov-sel" style={boxStyle(selBox)} />
          <SelectionToolbar box={selBox} sel={sel} />
        </>
      ) : null}
    </>
  );
}
