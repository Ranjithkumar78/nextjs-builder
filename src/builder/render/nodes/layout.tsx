import { createElement } from "react";
import { str } from "../../lib/values";
import type { Renderer } from "../types";

/** Layout containers, spacer and divider. */
const div: Renderer = ({ attrs, kids }) => createElement("div", attrs, kids());

export const LAYOUT_RENDERERS: Record<string, Renderer> = {
  section: ({ p, attrs, kids }) => createElement(str(p.tag, "section") || "section", attrs, kids()),
  box: ({ p, attrs, kids }) => createElement(str(p.tag, "div") || "div", attrs, kids()),
  container: div,
  row: div,
  column: div,
  grid: div,
  spacer: ({ attrs }) => createElement("div", { ...attrs, "aria-hidden": true }),
  divider: ({ attrs }) => createElement("hr", attrs),
};
