"use client";

import { useLayoutEffect, useRef, type ElementType, type FocusEvent, type KeyboardEvent } from "react";
import { richHtml } from "../lib/html";
import type { Attrs } from "./types";

interface Props {
  tag: string;
  attrs: Attrs;
  text: string;
  editing: boolean;
  singleLine: boolean;
  onCommit: (t: string) => void;
  onDone: () => void;
}

/** Text element whose content is managed through a ref so it can be edited with contentEditable. */
export function EditableText({ tag, attrs, text, editing, singleLine, onCommit, onDone }: Props) {
  const elRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (editing) el.innerText = text;
    else el.innerHTML = richHtml(text);
  }, [text, editing]);

  // Start editing with all of the text selected.
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el || !editing) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [editing]);

  function finish(e: FocusEvent<HTMLElement>) {
    const value = e.currentTarget.innerText.replace(/\u00a0/g, " ").replace(/\n$/, "");
    if (value !== text) onCommit(value);
    onDone();
  }

  // Escape cancels. Enter saves single-line text; multi-line text is saved with Ctrl/Cmd+Enter (or by clicking away).
  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    e.stopPropagation();
    const el = e.currentTarget;
    if (e.key === "Escape") {
      el.innerText = text;
      el.blur();
    } else if (e.key === "Enter" && (singleLine || !e.shiftKey) && (singleLine || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      el.blur();
    }
  }

  const Tag = tag as ElementType;
  return (
    <Tag
      {...attrs}
      ref={elRef}
      contentEditable={editing ? true : undefined}
      suppressContentEditableWarning
      spellCheck={editing ? true : undefined}
      data-editing={editing ? "true" : undefined}
      onBlur={editing ? finish : undefined}
      onKeyDown={editing ? onKeyDown : undefined}
    />
  );
}
