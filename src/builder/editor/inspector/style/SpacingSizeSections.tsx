"use client";

import { BoxModel, Section } from "../../../ui/controls";
import { useStyleEditor } from "../StyleEditor";
import { boxSides } from "../boxShorthand";
import { StyleSelect, StyleUnit } from "./fields";
import { ASPECT_RATIOS, V } from "./options";

/** Margin and padding (box model) and the gap between children. */
export function SpacingSection() {
  const { own, inherited, set } = useStyleEditor();
  const box = boxSides(own, inherited);
  return (
    <Section title="Spacing">
      <BoxModel get={box.get} set={(patch) => set(box.patch(patch))} placeholderOf={box.placeholder} />
      <div className="b-grid2" style={{ marginTop: 10 }}>
        <StyleUnit k="gap" label="Gap (between children)" />
      </div>
    </Section>
  );
}

export function SizeSection() {
  return (
    <Section title="Size">
      <div className="b-grid2">
        <StyleUnit k="width" label="Width" placeholder="auto" />
        <StyleUnit k="height" label="Height" placeholder="auto" />
        <StyleUnit k="minWidth" label="Min width" />
        <StyleUnit k="maxWidth" label="Max width" placeholder="none" />
        <StyleUnit k="minHeight" label="Min height" />
        <StyleUnit k="maxHeight" label="Max height" placeholder="none" />
        <StyleSelect k="aspectRatio" label="Aspect ratio" options={ASPECT_RATIOS} />
        <StyleSelect k="objectFit" label="Object fit" options={V.objectFit} />
        <StyleSelect k="overflow" label="Overflow" options={V.overflow} />
      </div>
    </Section>
  );
}
