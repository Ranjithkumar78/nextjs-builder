"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type DragEvent, type MouseEvent } from "react";
import { useBuilder } from "../store";
import { DEVICE_WIDTH, googleFontsUrl, themeCss } from "../css";
import { ZoneView, type RenderCtx } from "../render/NodeView";
import { computeDrop, dragState, type Indicator } from "../dnd";
import { getDef } from "../registry";
import { containsId, locate } from "../tree";
import type { Zone } from "../types";
import { Icon } from "../ui/Icon";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function Canvas() {
  const { state, dispatch, theme, page } = useBuilder();
  const { ui } = state;
  const frameRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [hoverBox, setHoverBox] = useState<Box | null>(null);
  const [selBox, setSelBox] = useState<Box | null>(null);

  const allNodes = useMemo(
    () => [...(page.showHeader ? theme.header : []), ...page.nodes, ...(page.showFooter ? theme.footer : [])],
    [theme.header, theme.footer, page]
  );
  const css = useMemo(() => themeCss(theme, allNodes, ui.device), [theme, allNodes, ui.device]);
  const fonts = useMemo(() => googleFontsUrl(theme, allNodes), [theme, allNodes]);

  const rc = useCallback(
    (zone: Zone): RenderCtx => ({
      edit: true,
      zone,
      eventId: theme.eventId,
      editingId,
      onTextCommit: (id, key, text) => dispatch({ type: "UPDATE_PROPS", id, props: { [key]: text } }),
      onTextDone: () => setEditingId(null),
    }),
    [editingId, dispatch, theme.eventId]
  );

  const boxOf = useCallback((id: string | null): Box | null => {
    const frame = frameRef.current;
    if (!frame || !id) return null;
    const el = frame.querySelector(`[data-node-id="${id}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const o = frame.getBoundingClientRect();
    return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
  }, []);

  // keep the selection overlay in sync with layout changes
  useLayoutEffect(() => {
    setSelBox(boxOf(ui.selectedId));
  }, [ui.selectedId, state.project, ui.device, boxOf, editingId]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => setSelBox(boxOf(ui.selectedId));
    const ro = new ResizeObserver(update);
    ro.observe(frame);
    frame.querySelectorAll("img").forEach((img) => img.addEventListener("load", update));
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ui.selectedId, boxOf, state.project]);

  // scroll a newly selected node into view if it is off-screen
  useEffect(() => {
    if (!ui.selectedId) return;
    const el = frameRef.current?.querySelector(`[data-node-id="${ui.selectedId}"]`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.bottom < 60 || r.top > window.innerHeight - 40) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [ui.selectedId]);

  const nodeIdFrom = (t: EventTarget | null): string | null => {
    if (!(t instanceof Element)) return null;
    return t.closest("[data-node-id]")?.getAttribute("data-node-id") ?? null;
  };

  const onClick = (e: MouseEvent) => {
    const id = nodeIdFrom(e.target);
    if (editingId && id === editingId) return;
    e.preventDefault();
    if (id !== ui.selectedId) dispatch({ type: "UI", patch: { selectedId: id } });
  };

  const onDoubleClick = (e: MouseEvent) => {
    const id = nodeIdFrom(e.target);
    if (!id) return;
    const loc = locate(theme, page, id);
    if (loc && getDef(loc.node.type).inlineText) {
      e.preventDefault();
      dispatch({ type: "UI", patch: { selectedId: id } });
      setEditingId(id);
    }
  };

  const onMouseOver = (e: MouseEvent) => {
    const id = nodeIdFrom(e.target);
    setHoverBox(id && id !== ui.selectedId ? boxOf(id) : null);
  };

  const onDragStart = (e: DragEvent) => {
    const id = nodeIdFrom(e.target);
    if (!id || editingId) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    dragState.set({ kind: "move", id });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    dispatch({ type: "UI", patch: { selectedId: id } });
  };

  const onDragOver = (e: DragEvent) => {
    const payload = dragState.get();
    if (!payload || !frameRef.current) return;
    const res = computeDrop(e.target, e.clientX, e.clientY, frameRef.current);
    if (!res) {
      setIndicator(null);
      return;
    }
    if (payload.kind === "move") {
      const loc = locate(theme, page, payload.id);
      if (loc && res.target.parentId && containsId(loc.node, res.target.parentId)) {
        setIndicator(null);
        return;
      }
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = payload.kind === "move" ? "move" : "copy";
    setIndicator(res.indicator);
    setHoverBox(null);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const payload = dragState.get();
    setIndicator(null);
    if (!payload || !frameRef.current) return;
    const res = computeDrop(e.target, e.clientX, e.clientY, frameRef.current);
    dragState.clear();
    if (!res) return;
    if (payload.kind === "new") dispatch({ type: "ADD_NODE", node: payload.create(), target: res.target });
    else dispatch({ type: "MOVE_NODE", id: payload.id, target: res.target });
  };

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

  const selected = ui.selectedId ? locate(theme, page, ui.selectedId) : null;
  const width = DEVICE_WIDTH[ui.device];

  const zone = (z: Zone, label: string, nodes: typeof page.nodes) => (
    <div className={`b-zone b-zone-${z}`} data-zone-root={z}>
      {z !== "page" ? (
        <span className="b-zone-tag">
          <Icon name={z === "header" ? "header" : "footer"} size={11} /> {label} · shared on all pages
        </span>
      ) : null}
      {nodes.length === 0 ? (
        <div className="b-zone-empty">
          <Icon name="plus" size={18} />
          <span>{z === "page" ? "Drag components or blocks here to build this page" : `Drop blocks here to create the ${label.toLowerCase()}`}</span>
        </div>
      ) : (
        <ZoneView nodes={nodes} rc={rc(z)} />
      )}
    </div>
  );

  return (
    <div
      className="b-canvas-scroll"
      onClick={(e) => {
        if (e.target === e.currentTarget) dispatch({ type: "UI", patch: { selectedId: null } });
      }}
    >
      {fonts ? <link rel="stylesheet" href={fonts} /> : null}
      <style>{css}</style>
      <div className={`b-device b-device-${ui.device}`} style={{ width: width ? width : "100%" }}>
        {ui.device !== "desktop" ? (
          <div className="b-device-label">
            {ui.device === "tablet" ? "Tablet" : "Mobile"} · {width}px — styles you edit now apply only to {ui.device} and smaller
          </div>
        ) : null}
        <div
          ref={frameRef}
          className="b-frame"
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onMouseOver={onMouseOver}
          onMouseLeave={() => setHoverBox(null)}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragLeave={(e) => {
            if (!frameRef.current?.contains(e.relatedTarget as Node)) setIndicator(null);
          }}
        >
          <div className="tb-root b-root">
            {page.showHeader ? zone("header", "Header", theme.header) : null}
            {zone("page", "Page", page.nodes)}
            {page.showFooter ? zone("footer", "Footer", theme.footer) : null}
          </div>

          {hoverBox && !indicator ? <div className="b-ov b-ov-hover" style={{ left: hoverBox.x, top: hoverBox.y, width: hoverBox.w, height: hoverBox.h }} /> : null}
          {selBox && selected && !indicator ? (
            <>
              <div className="b-ov b-ov-sel" style={{ left: selBox.x, top: selBox.y, width: selBox.w, height: selBox.h }} />
              <SelectionToolbar box={selBox} id={selected.node.id} label={selected.node.name || getDef(selected.node.type).label} global={selected.zone !== "page"} hidden={!!selected.node.hidden} hasParent={!!selected.parent} parentId={selected.parent?.id ?? null} />
            </>
          ) : null}
          {indicator ? (
            <div
              className={indicator.mode === "box" ? "b-ov b-ov-dropbox" : "b-ov b-ov-line"}
              style={{ left: indicator.x, top: indicator.y, width: indicator.w, height: indicator.h }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SelectionToolbar({
  box,
  id,
  label,
  global,
  hidden,
  hasParent,
  parentId,
}: {
  box: Box;
  id: string;
  label: string;
  global: boolean;
  hidden: boolean;
  hasParent: boolean;
  parentId: string | null;
}) {
  const { dispatch } = useBuilder();
  const top = box.y >= 34 ? box.y - 30 : box.h < 140 ? box.y + box.h + 4 : box.y + 4;
  const act = (e: MouseEvent, fn: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    fn();
  };
  return (
    <div className="b-seltool" style={{ left: Math.max(0, box.x), top }} onClick={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()}>
      <span
        className="b-seltool-drag"
        draggable
        title="Drag to move"
        onDragStart={(e) => {
          e.stopPropagation();
          dragState.set({ kind: "move", id });
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", id);
        }}
      >
        <Icon name="drag" size={13} />
        {label}
        {global ? <em>global</em> : null}
      </span>
      {hasParent ? (
        <button title="Select parent" onClick={(e) => act(e, () => dispatch({ type: "UI", patch: { selectedId: parentId } }))}>
          <Icon name="parent" size={13} />
        </button>
      ) : null}
      <button title="Move up" onClick={(e) => act(e, () => dispatch({ type: "MOVE_SIBLING", id, dir: -1 }))}>
        <Icon name="up" size={13} />
      </button>
      <button title="Move down" onClick={(e) => act(e, () => dispatch({ type: "MOVE_SIBLING", id, dir: 1 }))}>
        <Icon name="down" size={13} />
      </button>
      <button title="Duplicate (Ctrl+D)" onClick={(e) => act(e, () => dispatch({ type: "DUPLICATE_NODE", id }))}>
        <Icon name="copy" size={13} />
      </button>
      <button title={hidden ? "Show" : "Hide"} onClick={(e) => act(e, () => dispatch({ type: "TOGGLE_HIDDEN", id }))}>
        <Icon name={hidden ? "eyeOff" : "eye"} size={13} />
      </button>
      <button title="Delete (Del)" className="danger" onClick={(e) => act(e, () => dispatch({ type: "DELETE_NODE", id }))}>
        <Icon name="trash" size={13} />
      </button>
    </div>
  );
}
