import type { ThemeColors } from "../../types";

type DotKey = keyof ThemeColors;

/** A theme's main colors as a row of dots. */
export function ColorDots({ colors, keys = ["primary", "secondary", "background", "text"] }: { colors: Partial<ThemeColors>; keys?: DotKey[] }) {
  return (
    <span className="b-dots">
      {keys.map((k) => (
        <i key={k} style={{ background: colors[k] }} />
      ))}
    </span>
  );
}
