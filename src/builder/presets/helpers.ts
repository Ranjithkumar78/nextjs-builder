import type { StyleMap, TBNode } from "../types";
import { createNode as c } from "../registry";

/** Building blocks shared by the block presets. */
export const section = (children: TBNode[], styles: StyleMap = {}, name?: string, mobile?: StyleMap) =>
  c("section", {}, styles, children, { name, mobile });
export const container = (children: TBNode[], styles: StyleMap = {}) => c("container", {}, styles, children);
export const centerHeader = (eyebrow: string, title: string, sub: string) => [
  c("badge", { text: eyebrow }, { alignSelf: "center" }),
  c("heading", { text: title, level: "h2" }, { fontSize: "40px", textAlign: "center" }, undefined, { mobile: { fontSize: "30px" } }),
  c("text", { text: sub }, { textAlign: "center", maxWidth: "620px", alignSelf: "center", marginBottom: "24px" }),
];
export const grid = (cols: number, children: TBNode[], styles: StyleMap = {}) =>
  c("grid", {}, { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, ...styles }, children, {
    tablet: { gridTemplateColumns: `repeat(${Math.min(cols, 2)}, minmax(0, 1fr))` },
    mobile: { gridTemplateColumns: "minmax(0, 1fr)" },
  });
