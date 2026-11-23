"use client";

import { useEffect, useRef } from "react";
import { smartTarget, useBuilder } from "../store";
import { locate } from "../tree";

/** Keys typed into a field or editable text are not shortcuts. */
function isTyping(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  return t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
}

/** Undo/redo, duplicate, copy/paste, delete, select parent (Esc) and Alt+↑/↓ to reorder. */
export function useShortcuts(): void {
  const ctx = useBuilder();
  // One window listener for the editor's lifetime; it reads the latest state from this ref.
  const latestRef = useRef(ctx);
  useEffect(() => {
    latestRef.current = ctx;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const { state, dispatch, theme, page } = latestRef.current;
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
        dispatch({ type: "UI", patch: { selectedId: locate(theme, page, id)?.parent?.id ?? null } });
      } else if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown") && id) {
        e.preventDefault();
        dispatch({ type: "MOVE_SIBLING", id, dir: e.key === "ArrowUp" ? -1 : 1 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
