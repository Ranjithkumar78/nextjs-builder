"use client";

import { useStyleEditor } from "../inspector/StyleEditor";
import { QuickChoice, QuickColor } from "./controls";
import { SHADOWS, SHAPES, sizeOpts, valueChoices } from "./presets";

const IMAGE_SHAPES = valueChoices("aspectRatio", [
  ["Auto", ""],
  ["Square", "1 / 1"],
  ["4:3", "4 / 3"],
  ["16:9", "16 / 9"],
  ["Portrait", "3 / 4"],
]);
const IMAGE_FIT = valueChoices("objectFit", [
  ["Fill (crop)", "cover"],
  ["Show whole", "contain"],
]);
const MAP_HEIGHTS = valueChoices("height", [
  ["S", "240px"],
  ["M", "320px"],
  ["L", "460px"],
]);

/** Images, videos, maps, countdowns and embeds. */
export function MediaQuick() {
  const t = useStyleEditor().node.type;
  return (
    <>
      {t === "image" ? (
        <>
          <QuickChoice label="Shape" options={IMAGE_SHAPES} />
          <QuickChoice label="Fit" options={IMAGE_FIT} />
        </>
      ) : null}
      {t === "map" ? <QuickChoice label="Height" options={MAP_HEIGHTS} /> : null}
      {t === "countdown" ? (
        <>
          <QuickChoice label="Size" options={sizeOpts([12, 16, 22], ["S", "M", "L"])} />
          <QuickColor label="Color" k="color" />
        </>
      ) : null}
      <QuickChoice label="Corners" options={SHAPES} />
      <QuickChoice label="Shadow" options={SHADOWS} />
    </>
  );
}
