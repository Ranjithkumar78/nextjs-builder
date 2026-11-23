import type { StyleMap } from "../../types";

const SIDES = ["Top", "Right", "Bottom", "Left"];

/** "8px 16px" -> ["8px", "16px", "8px", "16px"] (top, right, bottom, left). */
export function expandShorthand(v: string): [string, string, string, string] {
  const p = v.trim().split(/\s+(?![^(]*\))/);
  if (p.length === 1) return [p[0], p[0], p[0], p[0]];
  if (p.length === 2) return [p[0], p[1], p[0], p[1]];
  if (p.length === 3) return [p[0], p[1], p[2], p[1]];
  return [p[0], p[1], p[2], p[3]];
}

const kindOf = (prop: string) => (prop.startsWith("margin") ? "margin" : "padding");
const sideIndex = (prop: string) => SIDES.indexOf(prop.slice(kindOf(prop).length));

/**
 * Margin/padding side editing when the element may use the shorthand ("padding: 8px 16px").
 * `own` are the styles set on this state, `inherited` those from larger screens.
 */
export function boxSides(own: StyleMap, inherited: StyleMap) {
  return {
    /** The side's own value, or its part of the own shorthand. */
    get(prop: string): string {
      if (own[prop]) return own[prop];
      const kind = kindOf(prop);
      return own[kind] ? expandShorthand(own[kind])[sideIndex(prop)] : "";
    },
    /** What the side shows when empty: inherited side or shorthand value. */
    placeholder(prop: string): string {
      if (own[prop]) return "";
      if (inherited[prop]) return inherited[prop];
      const kind = kindOf(prop);
      const sh = own[kind] || inherited[kind];
      return sh ? expandShorthand(sh)[sideIndex(prop)] : "";
    },
    /** Patch that sets sides, turning an own shorthand into the four side values first. */
    patch(patch: StyleMap): StyleMap {
      const kind = kindOf(Object.keys(patch)[0]);
      const full: StyleMap = { ...patch };
      if (own[kind]) {
        const parts = expandShorthand(own[kind]);
        SIDES.forEach((s, i) => {
          if (!(kind + s in full)) full[kind + s] = parts[i];
        });
        full[kind] = "";
      }
      return full;
    },
  };
}
