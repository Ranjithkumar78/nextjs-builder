import type { ThemeColors } from "../../types";
import { COLOR_TOKENS, tokenOf } from "../../css/tokens";
import { TextInput } from "./TextInput";
import { QUICK_COLORS, toHex } from "./color";

interface Props {
  value: string;
  onChange: (v: string) => void;
  colors: ThemeColors;
  allowTokens: boolean;
  pos: { left: number; top: number };
}

/** The open color picker: native picker + text, theme colors, quick colors and clear. */
export function ColorPopover({ value, onChange, colors, allowTokens, pos }: Props) {
  const token = tokenOf(value);
  return (
    <div className="b-pop" style={{ position: "fixed", left: pos.left, top: pos.top }}>
      <div className="b-pop-row">
        <input type="color" value={toHex(value, colors)} onChange={(e) => onChange(e.target.value)} />
        <TextInput value={value} onChange={onChange} placeholder="#hex, rgb(), var()" />
      </div>
      {allowTokens ? (
        <>
          <div className="b-pop-title">Theme colors</div>
          <div className="b-swatches">
            {COLOR_TOKENS.map((t) => (
              <button key={t.key} title={`${t.label} (${colors[t.key]})`} className={token === t.key ? "on" : ""} onClick={() => onChange(`var(${t.css})`)}>
                <span className="b-swatch" style={{ background: colors[t.key] }} />
              </button>
            ))}
          </div>
        </>
      ) : null}
      <div className="b-pop-title">Quick colors</div>
      <div className="b-swatches">
        {QUICK_COLORS.map((c) => (
          <button key={c} title={c} className={value === c ? "on" : ""} onClick={() => onChange(c)}>
            <span className={`b-swatch ${c === "transparent" ? "checker" : ""}`} style={{ background: c === "transparent" ? undefined : c }} />
          </button>
        ))}
      </div>
      <button className="b-btn small ghost" onClick={() => onChange("")}>
        Clear
      </button>
    </div>
  );
}
