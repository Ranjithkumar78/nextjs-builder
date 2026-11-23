import type { ThemeTokens } from "../../../types";
import { TOKEN_PRESETS } from "../../../defaults";
import { ColorDots } from "../../../ui/common";

/** The built-in color & font presets as buttons (the selected one is highlighted). */
export function PaletteButtons({ selected, onPick }: { selected?: string; onPick: (id: string, tokens: ThemeTokens) => void }) {
  return (
    <div className="b-palettes">
      {TOKEN_PRESETS.map((p) => (
        <button key={p.id} className={`b-palette ${selected === p.id ? "on" : ""}`.trim()} onClick={() => onPick(p.id, p.tokens)}>
          <ColorDots colors={p.tokens.colors} />
          {p.label}
        </button>
      ))}
    </div>
  );
}
