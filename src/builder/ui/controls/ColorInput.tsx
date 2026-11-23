"use client";

import { useCallback, useRef, useState } from "react";
import type { ThemeColors } from "../../types";
import { COLOR_TOKENS, tokenOf } from "../../css/tokens";
import { useDismiss } from "../hooks/useDismiss";
import { ColorPopover } from "./ColorPopover";
import { popoverPosition, swatchBg } from "./color";

const POPOVER_W = 240;
const POPOVER_H = 330;

/** Color field: shows the current color and opens a picker with theme and quick colors. */
export function ColorInput({ value, onChange, colors, allowTokens = true }: { value: string; onChange: (v: string) => void; colors: ThemeColors; allowTokens?: boolean }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close, true);

  const toggle = () => {
    if (!open && ref.current) setPos(popoverPosition(ref.current.getBoundingClientRect(), POPOVER_W, POPOVER_H));
    setOpen(!open);
  };
  const token = tokenOf(value);
  const tokenLabel = token ? COLOR_TOKENS.find((t) => t.key === token)?.label : null;
  return (
    <div className="b-color" ref={ref}>
      <button className="b-color-btn" onClick={toggle}>
        <span className="b-swatch" style={{ background: token ? colors[token] : swatchBg(value) }} />
        <span className="b-color-text">{tokenLabel ? `Theme · ${tokenLabel}` : value || "Default"}</span>
      </button>
      {open ? <ColorPopover value={value} onChange={onChange} colors={colors} allowTokens={allowTokens} pos={pos} /> : null}
    </div>
  );
}
