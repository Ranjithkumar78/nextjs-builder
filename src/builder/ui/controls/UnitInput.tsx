"use client";

import type { KeyboardEvent } from "react";
import { useDraft } from "../hooks/useDraft";

const UNIT_RE = /^(-?\d*\.?\d+)([a-z%]*)$/i;

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  unit?: string;
  step?: number;
  min?: number;
}

/** "12" -> "12px": bare numbers get the default unit. */
function withUnit(v: string, unit: string): string {
  const t = v.trim();
  return /^-?\d*\.?\d+$/.test(t) && unit ? t + unit : t;
}

/** Size input: adds the unit to bare numbers and steps with ↑/↓ (Shift ×10, Alt ÷10). */
export function UnitInput({ value, onChange, placeholder, unit = "px", step = 1, min }: Props) {
  const { draft, setDraft, focusProps } = useDraft(value, (d, setD) => {
    const n = withUnit(d, unit);
    if (n !== d) setD(n);
    if (n !== value) onChange(n);
  });
  const update = (next: string) => {
    setDraft(next);
    onChange(next);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
      if (e.key === "Enter") e.currentTarget.blur();
      return;
    }
    const m = (draft || placeholder || "0").trim().match(UNIT_RE);
    if (!m) return;
    e.preventDefault();
    const s = e.shiftKey ? step * 10 : e.altKey ? step / 10 : step;
    let n = parseFloat(m[1]) + (e.key === "ArrowUp" ? s : -s);
    if (min !== undefined) n = Math.max(min, n);
    update(`${Math.round(n * 100) / 100}${m[2] || (unit ?? "")}`);
  };
  return <input className="b-input" value={draft} placeholder={placeholder} {...focusProps} onKeyDown={onKey} onChange={(e) => update(e.target.value)} title="Tip: use ↑/↓ to adjust (Shift = ×10)" />;
}
