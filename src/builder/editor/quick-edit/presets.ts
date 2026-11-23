import type { Opt } from "./controls";

/** Preset choices used by the quick-edit panels. Every choice writes normal styles. */

/** Shorthand padding presets clear the four sides first. */
export const PAD_SIDES = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];

/** Build options from [label, patch] pairs. */
export const choices = (list: [string, Opt["patch"], string?][]): Opt[] => list.map(([label, patch, title]) => ({ label, patch, title }));

/** One option per value of a single property. */
export const valueChoices = (prop: string, list: [string, string][]): Opt[] => list.map(([label, value]) => ({ label, patch: { [prop]: value } }));

export const sizeOpts = (sizes: number[], labels = ["S", "M", "L", "XL", "XXL"]): Opt[] => sizes.map((n, i) => ({ label: labels[i], patch: { fontSize: `${n}px` }, title: `${n}px` }));

export const SHAPES = valueChoices("borderRadius", [
  ["Square", "0"],
  ["Rounded", "var(--tb-radius)"],
  ["Round", "24px"],
]);

export const SHADOWS = valueChoices("boxShadow", [
  ["None", "none"],
  ["Soft", "0 8px 24px -6px rgba(0,0,0,.18)"],
  ["Strong", "0 24px 48px -12px rgba(0,0,0,.32)"],
]);

export const GAPS = choices([["0", { gap: "0" }, "No space"], ["S", { gap: "8px" }], ["M", { gap: "16px" }], ["L", { gap: "24px" }], ["XL", { gap: "40px" }]]);

export const ALIGN_TEXT = valueChoices("textAlign", [
  ["Left", "left"],
  ["Center", "center"],
  ["Right", "right"],
]);

export const WEIGHTS = valueChoices("fontWeight", [
  ["Light", "300"],
  ["Regular", "400"],
  ["Medium", "500"],
  ["Bold", "700"],
]);

export const TEXT_STYLE = choices([
  ["Normal", { fontStyle: "normal", textTransform: "none" }],
  ["Italic", { fontStyle: "italic" }],
  ["UPPER", { textTransform: "uppercase" }],
]);

const padding = (values: string[]) => valueChoices("padding", ["0", "S", "M", "L", "XL"].map((l, i) => [l, values[i]] as [string, string]));
export const SECTION_PADDING = padding(["0", "32px 24px", "64px 24px", "96px 24px", "128px 24px"]);
export const BOX_PADDING = padding(["0", "12px", "24px", "36px", "48px"]);

export const BOX_BORDERS = choices([
  ["None", { borderWidth: "0" }],
  ["Thin", { borderWidth: "1px", borderStyle: "solid", borderColor: "var(--tb-border)" }],
  ["Accent", { borderWidth: "2px", borderStyle: "solid", borderColor: "var(--tb-primary)" }],
]);
