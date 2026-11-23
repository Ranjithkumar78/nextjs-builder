"use client";

import type { StyleMap } from "../../types";
import { useStyleEditor } from "../inspector/StyleEditor";
import { QuickChoice, QuickColor, Row } from "./controls";
import { Swatches } from "./Swatches";
import { PAD_SIDES, choices, valueChoices } from "./presets";

type ButtonStyle = "filled" | "outline" | "text";
const STYLE_LABELS: Record<ButtonStyle, string> = { filled: "Filled", outline: "Outline", text: "Text only" };

/** Filled (background), outline (border) or text-only, read from the current styles. */
function buttonStyle(m: StyleMap): ButtonStyle {
  const bg = m.backgroundColor ?? "";
  const bw = m.borderWidth ?? "";
  if (bg === "transparent" || bg === "") return bw && bw !== "0" && bw !== "0px" ? "outline" : bg === "" ? "filled" : "text";
  return "filled";
}

const SIZES = choices([
  ["Small", { padding: "8px 16px", fontSize: "14px" }],
  ["Medium", { padding: "12px 24px", fontSize: "16px" }],
  ["Large", { padding: "16px 32px", fontSize: "18px" }],
]);
const SHAPES = valueChoices("borderRadius", [
  ["Square", "0"],
  ["Rounded", "var(--tb-radius)"],
  ["Pill", "999px"],
]);
const POSITIONS = valueChoices("alignSelf", [
  ["Left", "flex-start"],
  ["Center", "center"],
  ["Right", "flex-end"],
  ["Full width", "stretch"],
]);

/** Buttons and submit buttons: style, color, size, shape and position. */
export function ButtonQuick() {
  const { merged, set, colors } = useStyleEditor();
  const style = buttonStyle(merged);
  const main = style === "filled" ? merged.backgroundColor || "var(--tb-primary)" : merged.color || "var(--tb-primary)";
  const apply = (s: ButtonStyle, color = main) => {
    const noBorder = { borderWidth: "0", borderStyle: "", borderColor: "" };
    if (s === "filled") set({ backgroundColor: color, color: merged.color && style === "filled" ? merged.color : "#ffffff", ...noBorder });
    if (s === "outline") set({ backgroundColor: "transparent", color, borderWidth: "2px", borderStyle: "solid", borderColor: color });
    if (s === "text") set({ backgroundColor: "transparent", color, ...noBorder });
  };
  return (
    <>
      <Row label="Button style">
        <div className="q-choice">
          {(Object.keys(STYLE_LABELS) as ButtonStyle[]).map((s) => (
            <button key={s} className={style === s ? "on" : ""} onClick={() => apply(s)}>
              {STYLE_LABELS[s]}
            </button>
          ))}
        </div>
      </Row>
      <Row label="Button color">
        <Swatches value={main} onChange={(v) => apply(style, v)} colors={colors} allowNone={false} />
      </Row>
      {style === "filled" ? <QuickColor label="Label color" k="color" /> : null}
      <QuickChoice label="Size" options={SIZES} clear={PAD_SIDES} />
      <QuickChoice label="Shape" options={SHAPES} />
      <QuickChoice label="Position" options={POSITIONS} />
    </>
  );
}
