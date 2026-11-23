"use client";

import { Icon } from "../../ui/Icon";
import { uploadImage } from "../../ui/common";
import { useStyleEditor } from "../inspector/StyleEditor";
import { QuickChoice, QuickColor, Row } from "./controls";
import { Swatches } from "./Swatches";
import { BoxArrange } from "./BoxArrange";
import { BOX_BORDERS, BOX_PADDING, GAPS, PAD_SIDES, SECTION_PADDING, SHADOWS, SHAPES, valueChoices } from "./presets";

const WIDTHS = valueChoices("maxWidth", [
  ["Narrow", "760px"],
  ["Normal", "var(--tb-container)"],
  ["Full", "none"],
]);

/** Background color, image upload and image/gradient removal. */
function BoxBackground() {
  const { merged, set, colors } = useStyleEditor();
  const bgImage = merged.backgroundImage ?? "";
  const hasImage = /url\(/.test(bgImage);
  return (
    <Row label="Background">
      <Swatches value={merged.backgroundColor ?? ""} onChange={(v) => set({ backgroundColor: v, ...(hasImage ? {} : { backgroundImage: "" }) })} colors={colors} />
      <div className="q-inline">
        <button className="b-btn small" onClick={() => uploadImage((d) => set({ backgroundImage: `url("${d}")`, backgroundSize: "cover", backgroundPosition: "center" }))}>
          <Icon name="image" size={13} /> {hasImage ? "Change image" : "Add image"}
        </button>
        {bgImage ? (
          <button className="b-btn small ghost" onClick={() => set({ backgroundImage: "none" })}>
            Remove image/gradient
          </button>
        ) : null}
      </div>
    </Row>
  );
}

/** Sections, containers, rows, columns, grids, boxes and forms. */
export function BoxQuick() {
  const { node } = useStyleEditor();
  const isSection = node.type === "section";
  return (
    <>
      <BoxBackground />
      <QuickColor label="Text color" k="color" />
      <QuickChoice label="Inner space" options={isSection ? SECTION_PADDING : BOX_PADDING} clear={PAD_SIDES} />
      <QuickChoice label="Space between items" options={GAPS} />
      <BoxArrange />
      {node.type === "container" ? <QuickChoice label="Width" options={WIDTHS} /> : null}
      {!isSection ? (
        <>
          <QuickChoice label="Corners" options={SHAPES} />
          <QuickChoice label="Border" options={BOX_BORDERS} />
          <QuickChoice label="Shadow" options={SHADOWS} />
        </>
      ) : null}
    </>
  );
}
