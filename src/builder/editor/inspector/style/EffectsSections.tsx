"use client";

import { RangeInput, Section, SelectInput } from "../../../ui/controls";
import { useStyleEditor } from "../StyleEditor";
import { StyleColor, StyleField, StyleSelect, StyleText, StyleUnit } from "./fields";
import { SHADOWS, V } from "./options";

const RADIUS_PRESETS = [
  { label: "Theme radius", value: "var(--tb-radius)" },
  { label: "Pill", value: "999px" },
  { label: "Square", value: "0" },
];

export function BorderSection() {
  const { set } = useStyleEditor();
  return (
    <Section title="Border" defaultOpen={false}>
      <div className="b-grid2">
        <StyleUnit k="borderWidth" label="Width" />
        <StyleSelect k="borderStyle" label="Style" options={V.borderStyle} />
        <StyleColor k="borderColor" label="Color" />
        <StyleUnit k="borderRadius" label="Radius" />
      </div>
      <div className="b-inline" style={{ marginTop: 8 }}>
        {RADIUS_PRESETS.map((r) => (
          <button key={r.label} className="b-btn small" onClick={() => set({ borderRadius: r.value })}>
            {r.label}
          </button>
        ))}
      </div>
    </Section>
  );
}

export function EffectsSection() {
  const { get, set } = useStyleEditor();
  return (
    <Section title="Effects" defaultOpen={false}>
      <div className="b-grid2">
        <StyleField k="boxShadow" label="Shadow" full>
          <SelectInput value={get("boxShadow")} onChange={(v) => set({ boxShadow: v })} options={SHADOWS} />
        </StyleField>
        <StyleField k="opacity" label="Opacity" full>
          <RangeInput value={get("opacity")} onChange={(v) => set({ opacity: v })} />
        </StyleField>
        <StyleText k="transform" label="Transform" placeholder="e.g. scale(1.05)" />
        <StyleText k="transition" label="Transition" placeholder="all .2s ease" />
        <StyleSelect k="cursor" label="Cursor" options={V.cursor} />
        <StyleText k="filter" label="Filter" placeholder="e.g. blur(2px)" />
      </div>
    </Section>
  );
}

export function PositionSection() {
  return (
    <Section title="Position" defaultOpen={false}>
      <div className="b-grid2">
        <StyleSelect k="position" label="Position" options={V.position} />
        <StyleUnit k="zIndex" label="Z-index" unit="" />
        <StyleUnit k="top" label="Top" />
        <StyleUnit k="right" label="Right" />
        <StyleUnit k="bottom" label="Bottom" />
        <StyleUnit k="left" label="Left" />
      </div>
    </Section>
  );
}
