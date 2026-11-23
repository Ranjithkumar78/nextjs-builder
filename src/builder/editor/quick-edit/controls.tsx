"use client";

import type { ReactNode } from "react";
import type { StyleMap } from "../../types";
import { useStyleEditor } from "../inspector/StyleEditor";
import { Swatches } from "./Swatches";

/** A quick-edit choice: a label and the styles it applies. */
export interface Opt {
  label: string;
  patch: StyleMap;
  title?: string;
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="q-row">
      <div className="q-label">{label}</div>
      <div className="q-ctl">{children}</div>
    </div>
  );
}

/** A choice is "on" when every style it sets is currently in effect. */
const isActive = (patch: StyleMap, merged: StyleMap) => Object.entries(patch).every(([k, v]) => (merged[k] ?? "") === v);

/** Preset buttons; `clear` lists properties to unset first (e.g. padding sides before a padding shorthand). */
export function Choice({ options, clear = [] }: { options: Opt[]; clear?: string[] }) {
  const { merged, set } = useStyleEditor();
  return (
    <div className="q-choice">
      {options.map((o) => (
        <button key={o.label} title={o.title ?? o.label} className={isActive(o.patch, merged) ? "on" : ""} onClick={() => set({ ...Object.fromEntries(clear.map((k) => [k, ""])), ...o.patch })}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Labelled row of preset buttons. */
export function QuickChoice({ label, options, clear }: { label: string; options: Opt[]; clear?: string[] }) {
  return (
    <Row label={label}>
      <Choice options={options} clear={clear} />
    </Row>
  );
}

/** Labelled theme-color swatches for one style property (`extra` is applied with the color). */
export function QuickColor({ label, k, allowNone = false, extra }: { label: string; k: string; allowNone?: boolean; extra?: (color: string) => StyleMap }) {
  const { merged, set, colors } = useStyleEditor();
  return (
    <Row label={label}>
      <Swatches value={merged[k] ?? ""} onChange={(v) => set({ [k]: v, ...(extra?.(v) ?? {}) })} colors={colors} allowNone={allowNone} />
    </Row>
  );
}
