"use client";

import { Section } from "../../../ui/controls";
import { useStyleEditor } from "../StyleEditor";
import { StyleColor, StyleSegmented, StyleSelect, StyleUnit } from "./fields";
import { DECORATION, FONT_SELECT, FONT_STYLE, TEXT_ALIGN, V, WEIGHTS } from "./options";

export function TypographySection() {
  const { ph } = useStyleEditor();
  return (
    <Section title="Typography">
      <div className="b-grid2">
        <StyleSelect k="fontFamily" label="Font" options={FONT_SELECT} full placeholder={ph("fontFamily") ? "Inherit" : "Inherit from parent"} />
        <StyleUnit k="fontSize" label="Size" placeholder="inherit" />
        <StyleSelect k="fontWeight" label="Weight" options={WEIGHTS} />
        <StyleUnit k="lineHeight" label="Line height" unit="" step={0.1} placeholder="normal" />
        <StyleUnit k="letterSpacing" label="Letter spacing" step={0.5} placeholder="normal" />
        <StyleColor k="color" label="Text color" />
        <StyleSelect k="textTransform" label="Transform" options={V.transform} />
        <StyleSegmented k="textAlign" label="Align" options={TEXT_ALIGN} full />
        <StyleSegmented k="fontStyle" label="Style" options={FONT_STYLE} />
        <StyleSegmented k="textDecoration" label="Decoration" options={DECORATION} />
      </div>
    </Section>
  );
}
