"use client";

import type { ThemeTokens } from "../../../types";
import { useBuilder } from "../../../store";
import { FONT_OPTIONS, FONT_SELECT_OPTIONS } from "../../../css";
import { Field, Section, SelectInput, UnitInput } from "../../../ui/controls";
import { Note } from "../../../ui/common";
import { PaletteButtons } from "./PaletteButtons";

type TokenPatch = Partial<Omit<ThemeTokens, "colors">>;

/** Theme fonts, base size, corner radius, content width, and the color/font presets. */
export function TypographySection() {
  const { theme, dispatch } = useBuilder();
  const t = theme.tokens;
  const setTok = (patch: TokenPatch, key: string) => dispatch({ type: "UPDATE_TOKENS", patch, key });
  return (
    <>
      <Section title="Fonts">
        <Field label="Headings" full>
          <SelectInput value={t.headingFont} onChange={(v) => setTok({ headingFont: v || FONT_OPTIONS[0].value }, "hf")} options={FONT_SELECT_OPTIONS} />
        </Field>
        <Field label="Body text" full>
          <SelectInput value={t.bodyFont} onChange={(v) => setTok({ bodyFont: v || FONT_OPTIONS[0].value }, "bf")} options={FONT_SELECT_OPTIONS} />
        </Field>
        <div className="b-grid2">
          <Field label="Base text size">
            <UnitInput value={t.baseFontSize} onChange={(v) => setTok({ baseFontSize: v }, "bs")} />
          </Field>
        </div>
      </Section>
      <Section title="Shape & width">
        <div className="b-grid2">
          <Field label="Corner roundness">
            <UnitInput value={t.radius} onChange={(v) => setTok({ radius: v }, "r")} />
          </Field>
          <Field label="Content width">
            <UnitInput value={t.containerWidth} onChange={(v) => setTok({ containerWidth: v }, "cw")} step={10} />
          </Field>
        </div>
      </Section>
      <Section title="Start from a color preset" defaultOpen={false}>
        <Note>Replaces this theme&apos;s colors and fonts. You can undo with Ctrl+Z.</Note>
        <PaletteButtons
          onPick={(_, tokens) => {
            const { colors, ...rest } = tokens;
            dispatch({ type: "UPDATE_TOKENS", patch: rest, colors });
          }}
        />
      </Section>
    </>
  );
}
