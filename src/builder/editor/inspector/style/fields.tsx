"use client";

import type { ReactNode } from "react";
import { ColorInput, Field, Segmented, SelectInput, TextInput, UnitInput, type SegmentOption } from "../../../ui/controls";
import type { Option } from "../../../ui/controls/SelectInput";
import { useStyleEditor } from "../StyleEditor";

/** Style-tab fields: each edits one CSS property of the selected node and shows its own reset (×). */

type Base = { k: string; label: string; full?: boolean };

function StyleField({ k, label, full, children }: Base & { children: ReactNode }) {
  const { isSet, reset } = useStyleEditor();
  return (
    <Field label={label} set={isSet(k)} onReset={reset(k)} full={full}>
      {children}
    </Field>
  );
}

export function StyleUnit({ k, label, placeholder, unit = "px", step }: Base & { placeholder?: string; unit?: string; step?: number }) {
  const { get, ph, set } = useStyleEditor();
  return (
    <StyleField k={k} label={label}>
      <UnitInput value={get(k)} onChange={(v) => set({ [k]: v })} placeholder={ph(k) || placeholder} unit={unit} step={step} />
    </StyleField>
  );
}

export function StyleSelect({ k, label, options, full, placeholder }: Base & { options: Option[]; placeholder?: string }) {
  const { get, ph, set } = useStyleEditor();
  return (
    <StyleField k={k} label={label} full={full}>
      <SelectInput value={get(k)} onChange={(v) => set({ [k]: v })} options={options} placeholder={placeholder ?? (ph(k) ? `Inherit (${ph(k)})` : "Default")} />
    </StyleField>
  );
}

export function StyleColor({ k, label }: Base) {
  const { get, set, colors } = useStyleEditor();
  return (
    <StyleField k={k} label={label}>
      <ColorInput value={get(k) || ""} onChange={(v) => set({ [k]: v })} colors={colors} />
    </StyleField>
  );
}

export function StyleText({ k, label, placeholder, full }: Base & { placeholder?: string }) {
  const { get, ph, set } = useStyleEditor();
  return (
    <StyleField k={k} label={label} full={full}>
      <TextInput value={get(k)} onChange={(v) => set({ [k]: v })} placeholder={ph(k) || placeholder} />
    </StyleField>
  );
}

export function StyleSegmented({ k, label, options, full }: Base & { options: SegmentOption[] }) {
  const { get, set } = useStyleEditor();
  return (
    <StyleField k={k} label={label} full={full}>
      <Segmented value={get(k)} onChange={(v) => set({ [k]: v })} options={options} />
    </StyleField>
  );
}

export { StyleField };
