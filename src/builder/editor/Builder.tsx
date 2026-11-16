"use client";

import { useEffect } from "react";
import { BuilderProvider, useBuilder } from "../store";
import { locate } from "../tree";
import { TopBar } from "./TopBar";
import { LeftPanel, smartTarget } from "./LeftPanel";
import { Canvas } from "./Canvas";
import { Inspector } from "./Inspector";

function isTyping(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  return t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
}

function Shortcuts() {
  const { state, dispatch, theme, page } = useBuilder();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const mod = e.metaKey || e.ctrlKey;
      const id = state.ui.selectedId;
      const key = e.key.toLowerCase();
      if (mod && key === "z") {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? "REDO" : "UNDO" });
      } else if (mod && key === "y") {
        e.preventDefault();
        dispatch({ type: "REDO" });
      } else if (mod && key === "d" && id) {
        e.preventDefault();
        dispatch({ type: "DUPLICATE_NODE", id });
      } else if (mod && key === "c" && id) {
        dispatch({ type: "COPY", id });
      } else if (mod && key === "v" && state.ui.clipboard) {
        e.preventDefault();
        dispatch({ type: "PASTE", target: smartTarget(state) });
      } else if ((e.key === "Delete" || e.key === "Backspace") && id) {
        e.preventDefault();
        dispatch({ type: "DELETE_NODE", id });
      } else if (e.key === "Escape" && id) {
        const loc = locate(theme, page, id);
        dispatch({ type: "UI", patch: { selectedId: loc?.parent?.id ?? null } });
      } else if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown") && id) {
        e.preventDefault();
        dispatch({ type: "MOVE_SIBLING", id, dir: e.key === "ArrowUp" ? -1 : 1 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, dispatch, theme, page]);
  return null;
}

function Shell() {
  const { state } = useBuilder();
  if (!state.ready) {
    return (
      <div className="b-loading">
        <div className="b-spinner" />
        Loading your themes…
      </div>
    );
  }
  return (
    <div className="b-app">
      <Shortcuts />
      <TopBar />
      <div className="b-main">
        <LeftPanel />
        <main className="b-center">
          <Canvas />
        </main>
        <aside className="b-right">
          <Inspector />
        </aside>
      </div>
    </div>
  );
}

export default function Builder() {
  return (
    <BuilderProvider>
      <Shell />
    </BuilderProvider>
  );
}
