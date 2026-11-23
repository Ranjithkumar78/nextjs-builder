"use client";

import { useCallback, useMemo, useRef, useState, type DragEvent, type MouseEvent } from "react";
import { useBuilder } from "../../store";
import { DEVICE_WIDTH } from "../../css";
import { ThemeStyles } from "../../render";
import { startMoveDrag } from "../../dnd";
import { getDef } from "../../registry";
import { locate, pageNodes } from "../../tree";
import { nodeIdFrom } from "./geometry";
import { useHoverBox } from "./useHoverBox";
import { useSelectionBox } from "./useSelectionBox";
import { useCanvasDrop } from "./useCanvasDrop";
import { CanvasZone } from "./CanvasZone";
import { Overlays } from "./Overlays";
import { DeviceLabel } from "./DeviceLabel";
import { useEditRenderCtx } from "./useEditRenderCtx";

/** The editable page: click to select, double-click to edit text, drag to move or add. */
export function Canvas() {
  const { state, dispatch, theme, page } = useBuilder();
  const { ui } = state;
  const frameRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const hover = useHoverBox(frameRef, ui.selectedId);
  const selBox = useSelectionBox(frameRef, ui.selectedId, state.project, ui.device, editingId);
  const drop = useCanvasDrop(frameRef);
  const { header, footer } = theme;
  // Only header, page and footer changes rebuild the node list (not token edits).
  const nodes = useMemo(() => pageNodes({ header, footer }, page), [header, footer, page]);
  const select = (id: string | null) => dispatch({ type: "UI", patch: { selectedId: id } });

  const stopEditing = useCallback(() => setEditingId(null), []);
  const rc = useEditRenderCtx(editingId, stopEditing);

  const onClick = (e: MouseEvent) => {
    const id = nodeIdFrom(e.target);
    if (editingId && id === editingId) return;
    e.preventDefault();
    if (id !== ui.selectedId) select(id);
  };

  const onDoubleClick = (e: MouseEvent) => {
    const id = nodeIdFrom(e.target);
    const loc = id ? locate(theme, page, id) : null;
    if (!id || !loc || !getDef(loc.node.type).inlineText) return;
    e.preventDefault();
    select(id);
    setEditingId(id);
  };

  const onDragStart = (e: DragEvent) => {
    const id = nodeIdFrom(e.target);
    if (!id || editingId) return e.preventDefault();
    startMoveDrag(e, id);
    select(id);
  };

  const sel = ui.selectedId ? locate(theme, page, ui.selectedId) : null;
  const width = DEVICE_WIDTH[ui.device];
  return (
    <div className="b-canvas-scroll" onClick={(e) => e.target === e.currentTarget && select(null)}>
      <ThemeStyles theme={theme} nodes={nodes} mode={ui.device} />
      <div className={`b-device b-device-${ui.device}`} style={{ width: width ? width : "100%" }}>
        <DeviceLabel device={ui.device} width={width} />
        <div
          ref={frameRef}
          className="b-frame"
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onMouseOver={hover.onMouseOver}
          onMouseLeave={hover.clear}
          onDragStart={onDragStart}
          onDragOver={(e) => {
            drop.onDragOver(e);
            hover.clear();
          }}
          onDrop={drop.onDrop}
          onDragLeave={drop.onDragLeave}
        >
          <div className="tb-root b-root">
            {page.showHeader ? <CanvasZone zone="header" nodes={theme.header} rc={rc.header} /> : null}
            <CanvasZone zone="page" nodes={page.nodes} rc={rc.page} />
            {page.showFooter ? <CanvasZone zone="footer" nodes={theme.footer} rc={rc.footer} /> : null}
          </div>
          <Overlays hover={hover.box} selBox={selBox} sel={sel} indicator={drop.indicator} />
        </div>
      </div>
    </div>
  );
}
