"use client";

import { UnitInput } from "../../ui/controls";
import { useStyleEditor } from "../inspector/StyleEditor";
import { Choice, QuickChoice, QuickColor, Row } from "./controls";
import { Swatches } from "./Swatches";
import { ALIGN_TEXT, GAPS, TEXT_STYLE, WEIGHTS, sizeOpts } from "./presets";

function sizesFor(type: string) {
  if (type === "heading") return sizeOpts([24, 36, 48, 64, 88]);
  if (type === "logo") return sizeOpts([18, 24, 34]);
  if (type === "badge") return sizeOpts([12, 13, 15]);
  return sizeOpts([14, 16, 18, 22, 26]);
}

/** Headings, paragraphs, badges, links, quotes, lists, logo, menus and social links. */
export function TextQuick() {
  const { node, merged, set, colors, setProp } = useStyleEditor();
  const t = node.type;
  const isNav = t === "navmenu" || t === "socials";
  return (
    <>
      <Row label="Text size">
        <Choice options={sizesFor(t)} />
        <div className="q-exact">
          <UnitInput value={merged.fontSize ?? ""} onChange={(v) => set({ fontSize: v })} placeholder="inherit" />
        </div>
      </Row>
      <QuickColor label="Text color" k="color" />
      {t === "heading" || t === "text" ? (
        <Row label="*Accent* color">
          <Swatches value={String(node.props.accentColor ?? "")} onChange={(v) => setProp("accentColor", v)} colors={colors} allowNone={false} />
          <div className="q-hint">Wrap words in *stars* in the text to use this color.</div>
        </Row>
      ) : null}
      <QuickChoice label="Weight" options={WEIGHTS} />
      {!isNav ? <QuickChoice label="Align" options={ALIGN_TEXT} /> : null}
      <QuickChoice label="Style" options={TEXT_STYLE} />
      {t === "badge" ? <QuickColor label="Background" k="backgroundColor" allowNone /> : null}
      {isNav ? <QuickChoice label="Spacing" options={GAPS} /> : null}
    </>
  );
}
