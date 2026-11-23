"use client";

import { useRef } from "react";
import type { ThemeColors } from "../../types";
import { COLOR_TOKENS, tokenOf } from "../../css";
import { hexOrGrey } from "../../ui/controls";

/** Theme colors as one-click swatches, plus "none" and a custom picker. */
export function Swatches({ value, onChange, colors, allowNone = true }: { value: string; onChange: (v: string) => void; colors: ThemeColors; allowNone?: boolean }) {
  const pickRef = useRef<HTMLInputElement>(null);
  const token = tokenOf(value || "");
  const custom = value && !token && value !== "transparent";
  return (
    <div className="q-swatches">
      {COLOR_TOKENS.map((t) => (
        <button key={t.key} title={`${t.label} — ${t.hint}`} className={token === t.key ? "on" : ""} onClick={() => onChange(`var(${t.css})`)}>
          <span style={{ background: colors[t.key] }} />
        </button>
      ))}
      {allowNone ? (
        <button title="None / transparent" className={value === "transparent" ? "on" : ""} onClick={() => onChange("transparent")}>
          <span className="q-none" />
        </button>
      ) : null}
      <button title="Custom color" className={custom ? "on" : ""} onClick={() => pickRef.current?.click()}>
        <span className="q-custom" style={custom ? { background: value } : undefined} />
      </button>
      <input ref={pickRef} type="color" hidden value={hexOrGrey(value)} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
