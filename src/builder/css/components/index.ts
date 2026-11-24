import type { QueryMode } from "../declarations";
import { menuRules } from "./menu";
import { choiceRules, engageRules } from "./engage";
import { interactiveRules, sliderRules } from "./interactive";
import { atMost } from "../responsive";
import { widgetRules } from "./widgets";
import { mediaRules } from "./media";
import { motionRules } from "./motion";

/** Stylesheet for the newer components; responsive parts follow the query mode (see atMost). */
export function componentRules(r: string, mode: QueryMode): string {
  return [menuRules(r, mode), engageRules(r), choiceRules(r), interactiveRules(r), sliderRules(r), widgetRules(r), mediaRules(r, mode), motionRules(r), atMost(mode, "mobile", `:where(${r}) .tb-slider{--tb-spv:var(--tb-spv-m,1)}`)].join("");
}
