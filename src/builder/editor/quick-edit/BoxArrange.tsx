"use client";

import { useStyleEditor } from "../inspector/StyleEditor";
import { QuickChoice } from "./controls";
import { choices, valueChoices } from "./presets";

const COLUMNS = [1, 2, 3, 4, 5, 6].map((n) => ({ label: String(n), patch: { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` } }));
const ROW_LINE_UP = valueChoices("alignItems", [
  ["Top", "flex-start"],
  ["Middle", "center"],
  ["Bottom", "flex-end"],
  ["Stretch", "stretch"],
]);
const ROW_SPREAD = valueChoices("justifyContent", [
  ["Start", "flex-start"],
  ["Center", "center"],
  ["Spread out", "space-between"],
]);
const ARRANGE = choices([
  ["Stacked", { display: "flex", flexDirection: "column" }],
  ["Side by side", { display: "flex", flexDirection: "row", flexWrap: "wrap" }],
]);
const ALIGN_IN_ROW = valueChoices("alignItems", [
  ["Top", "flex-start"],
  ["Middle", "center"],
  ["Bottom", "flex-end"],
]);
const ALIGN_IN_COLUMN = valueChoices("alignItems", [
  ["Left", "flex-start"],
  ["Center", "center"],
  ["Right", "flex-end"],
  ["Full", "stretch"],
]);

/** How a container lays out its children: grid columns, row alignment, or stacked/side-by-side. */
export function BoxArrange() {
  const { node, merged } = useStyleEditor();
  if (node.type === "grid") return <QuickChoice label="Columns" options={COLUMNS} />;
  if (node.type === "row")
    return (
      <>
        <QuickChoice label="Line up" options={ROW_LINE_UP} />
        <QuickChoice label="Spread" options={ROW_SPREAD} />
      </>
    );
  return (
    <>
      <QuickChoice label="Arrange items" options={ARRANGE} />
      <QuickChoice label="Align items" options={(merged.flexDirection ?? "").startsWith("row") ? ALIGN_IN_ROW : ALIGN_IN_COLUMN} />
    </>
  );
}
