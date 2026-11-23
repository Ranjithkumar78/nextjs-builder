import { FONT_OPTIONS, THEME_FONT_VARS } from "../../../css";
import { sameOptions as opts } from "../../../lib/values";

/** Option lists used by the Style tab. */
export const FONT_SELECT = [...THEME_FONT_VARS, ...FONT_OPTIONS].map((f) => ({ label: f.label, value: f.value }));

export const WEIGHTS = [
  { label: "100 Thin", value: "100" },
  { label: "200 Extra light", value: "200" },
  { label: "300 Light", value: "300" },
  { label: "400 Regular", value: "400" },
  { label: "500 Medium", value: "500" },
  { label: "600 Semi bold", value: "600" },
  { label: "700 Bold", value: "700" },
  { label: "800 Extra bold", value: "800" },
  { label: "900 Black", value: "900" },
];

export const SHADOWS = [
  { label: "None", value: "none" },
  { label: "Small", value: "0 1px 3px rgba(0,0,0,.12)" },
  { label: "Medium", value: "0 8px 24px -6px rgba(0,0,0,.18)" },
  { label: "Large", value: "0 24px 48px -12px rgba(0,0,0,.28)" },
  { label: "Glow (primary)", value: "0 0 0 4px color-mix(in srgb, var(--tb-primary) 25%, transparent)" },
  { label: "Inner", value: "inset 0 2px 6px rgba(0,0,0,.15)" },
];

export const GRADIENTS = [
  { label: "Primary → Secondary", value: "linear-gradient(135deg, var(--tb-primary), var(--tb-secondary))" },
  { label: "Sunset", value: "linear-gradient(135deg, #f97316, #ec4899)" },
  { label: "Ocean", value: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
  { label: "Night", value: "linear-gradient(180deg, #0f172a, #1e293b)" },
  { label: "Dark overlay", value: "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55))" },
];

export const ASPECT_RATIOS = [
  { label: "1:1 Square", value: "1 / 1" },
  { label: "4:3", value: "4 / 3" },
  { label: "3:2", value: "3 / 2" },
  { label: "16:9", value: "16 / 9" },
  { label: "21:9", value: "21 / 9" },
  { label: "3:4 Portrait", value: "3 / 4" },
  { label: "9:16", value: "9 / 16" },
];

export const TEXT_ALIGN = [
  { value: "left", icon: "alignLeft" },
  { value: "center", icon: "alignCenter" },
  { value: "right", icon: "alignRight" },
  { value: "justify", icon: "alignJustify" },
];

export const FONT_STYLE = [
  { value: "normal", label: "Aa" },
  { value: "italic", label: "𝐼" },
];

export const DECORATION = [
  { value: "none", label: "—", title: "None" },
  { value: "underline", label: "U", title: "Underline" },
  { value: "line-through", label: "S", title: "Strike" },
];

export const DIRECTION = [
  { value: "row", label: "→ Row" },
  { value: "column", label: "↓ Col" },
];

/** CSS value lists (label = value). */
export const V = {
  transform: opts(["none", "uppercase", "lowercase", "capitalize"]),
  objectFit: opts(["cover", "contain", "fill", "none", "scale-down"]),
  overflow: opts(["visible", "hidden", "auto", "scroll"]),
  display: opts(["block", "flex", "grid", "inline-block", "inline-flex", "inline", "none"]),
  justify: opts(["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"]),
  flexAlign: opts(["stretch", "flex-start", "center", "flex-end", "baseline"]),
  wrap: opts(["nowrap", "wrap", "wrap-reverse"]),
  gridAlign: opts(["stretch", "start", "center", "end"]),
  alignSelf: opts(["auto", "flex-start", "center", "flex-end", "stretch"]),
  bgSize: opts(["cover", "contain", "auto", "100% 100%"]),
  bgPosition: opts(["center", "top", "bottom", "left", "right"]),
  bgRepeat: opts(["no-repeat", "repeat", "repeat-x", "repeat-y"]),
  bgAttachment: opts(["scroll", "fixed"]),
  borderStyle: opts(["none", "solid", "dashed", "dotted", "double"]),
  cursor: opts(["auto", "pointer", "default", "text", "not-allowed"]),
  position: opts(["static", "relative", "absolute", "fixed", "sticky"]),
};
