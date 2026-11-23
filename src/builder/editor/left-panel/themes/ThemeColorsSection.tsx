"use client";

import { useBuilder } from "../../../store";
import { COLOR_TOKENS, fullColors } from "../../../css";
import { Section, TextInput, hexOrGrey } from "../../../ui/controls";
import { Note } from "../../../ui/common";

function ColorRow({ k, label, hint, value, onChange }: { k: string; label: string; hint: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="t-color" data-color={k}>
      <label className="t-color-swatch" style={{ background: value }} title={`Pick ${label}`}>
        <input type="color" value={hexOrGrey(value)} onChange={(e) => onChange(e.target.value)} />
      </label>
      <div className="t-color-name">
        <strong>{label}</strong>
        <small title={hint}>{hint}</small>
      </div>
      <TextInput value={value} onChange={onChange} />
    </div>
  );
}

/** Every theme color with a picker and a text field. */
export function ThemeColorsSection() {
  const { theme, dispatch } = useBuilder();
  const colors = fullColors(theme.tokens.colors);
  return (
    <Section title="Theme colors">
      <Note>These colors are used across the whole theme. Change one here and every element that uses it updates instantly.</Note>
      <div className="t-palette">
        {COLOR_TOKENS.map((c) => (
          <ColorRow key={c.key} k={c.key} label={c.label} hint={c.hint} value={colors[c.key]} onChange={(v) => dispatch({ type: "UPDATE_TOKENS", patch: {}, colors: { [c.key]: v }, key: "color:" + c.key })} />
        ))}
      </div>
    </Section>
  );
}
