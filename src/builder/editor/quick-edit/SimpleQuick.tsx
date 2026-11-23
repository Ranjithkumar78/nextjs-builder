"use client";

import { useStyleEditor } from "../inspector/StyleEditor";
import { QuickChoice, QuickColor } from "./controls";
import { valueChoices } from "./presets";

const SPACER_HEIGHTS = valueChoices("height", [
  ["S", "16px"],
  ["M", "32px"],
  ["L", "64px"],
  ["XL", "96px"],
]);
const THICKNESS = valueChoices("borderTopWidth", [
  ["Thin", "1px"],
  ["Medium", "2px"],
  ["Thick", "4px"],
]);
const WIDTHS = valueChoices("width", [
  ["Half", "50%"],
  ["Full", "100%"],
]);

/** Spacer, divider and anything else without its own panel. */
export function SimpleQuick() {
  const t = useStyleEditor().node.type;
  if (t === "spacer") return <QuickChoice label="Height" options={SPACER_HEIGHTS} />;
  if (t === "divider")
    return (
      <>
        <QuickColor label="Color" k="borderTopColor" extra={() => ({ borderTopStyle: "solid" })} />
        <QuickChoice label="Thickness" options={THICKNESS} />
      </>
    );
  return <QuickChoice label="Width" options={WIDTHS} />;
}
