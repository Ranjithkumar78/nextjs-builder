"use client";

import { useRef, type ReactNode } from "react";
import type { StyleMap, TBNode, ThemeColors } from "../types";
import { COLOR_TOKENS } from "../css";
import { tokenOf, UnitInput } from "../ui/controls";
import { Icon } from "../ui/Icon";

/* Simple, preset-based editing. Every control writes normal styles, so the Design tab
   always shows exactly what a quick choice did. */

interface Opt {
  label: string;
  patch: StyleMap;
  title?: string;
}

interface QuickProps {
  node: TBNode;
  merged: StyleMap;
  colors: ThemeColors;
  set: (patch: StyleMap) => void;
  setProp: (key: string, value: unknown) => void;
}

// ---------------------------------------------------------------- building blocks
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="q-row">
      <div className="q-label">{label}</div>
      <div className="q-ctl">{children}</div>
    </div>
  );
}

function isActive(patch: StyleMap, merged: StyleMap) {
  return Object.entries(patch).every(([k, v]) => (merged[k] ?? "") === v);
}

function Choice({ options, merged, set, clear = [] }: { options: Opt[]; merged: StyleMap; set: (p: StyleMap) => void; clear?: string[] }) {
  return (
    <div className="q-choice">
      {options.map((o) => (
        <button
          key={o.label}
          title={o.title ?? o.label}
          className={isActive(o.patch, merged) ? "on" : ""}
          onClick={() => set({ ...Object.fromEntries(clear.map((k) => [k, ""])), ...o.patch })}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Theme colors as one-click swatches, plus "none" and a custom picker. */
export function Swatches({ value, onChange, colors, allowNone = true }: { value: string; onChange: (v: string) => void; colors: ThemeColors; allowNone?: boolean }) {
  const pick = useRef<HTMLInputElement>(null);
  const token = tokenOf(value || "");
  const custom = value && !token && value !== "transparent";
  return (
    <div className="q-swatches">
      {COLOR_TOKENS.map((t) => (
        <button key={t.key} title={`${t.label} — ${t.hint}`} className={token === t.key ? "on" : ""} onClick={() => onChange(`var(${t.css})`)}>
          <span style={{ background: colors[t.key] }} />
        </button>
      ))}
      {allowNone ? (
        <button title="None / transparent" className={value === "transparent" ? "on" : ""} onClick={() => onChange("transparent")}>
          <span className="q-none" />
        </button>
      ) : null}
      <button title="Custom color" className={custom ? "on" : ""} onClick={() => pick.current?.click()}>
        <span className="q-custom" style={custom ? { background: value } : undefined} />
      </button>
      <input ref={pick} type="color" hidden value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#888888"} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function uploadTo(cb: (data: string) => void) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = () => {
    const f = input.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => cb(String(r.result));
    r.readAsDataURL(f);
  };
  input.click();
}

const PAD_SIDES = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];

// ---------------------------------------------------------------- presets
const SHAPES: Opt[] = [
  { label: "Square", patch: { borderRadius: "0" } },
  { label: "Rounded", patch: { borderRadius: "var(--tb-radius)" } },
  { label: "Round", patch: { borderRadius: "24px" } },
];
const SHADOWS: Opt[] = [
  { label: "None", patch: { boxShadow: "none" } },
  { label: "Soft", patch: { boxShadow: "0 8px 24px -6px rgba(0,0,0,.18)" } },
  { label: "Strong", patch: { boxShadow: "0 24px 48px -12px rgba(0,0,0,.32)" } },
];
const GAPS: Opt[] = [
  { label: "0", patch: { gap: "0" }, title: "No space" },
  { label: "S", patch: { gap: "8px" } },
  { label: "M", patch: { gap: "16px" } },
  { label: "L", patch: { gap: "24px" } },
  { label: "XL", patch: { gap: "40px" } },
];
const ALIGN_TEXT: Opt[] = [
  { label: "Left", patch: { textAlign: "left" } },
  { label: "Center", patch: { textAlign: "center" } },
  { label: "Right", patch: { textAlign: "right" } },
];
const WEIGHTS: Opt[] = [
  { label: "Light", patch: { fontWeight: "300" } },
  { label: "Regular", patch: { fontWeight: "400" } },
  { label: "Medium", patch: { fontWeight: "500" } },
  { label: "Bold", patch: { fontWeight: "700" } },
];

const sizeOpts = (sizes: number[], labels = ["S", "M", "L", "XL", "XXL"]): Opt[] => sizes.map((n, i) => ({ label: labels[i], patch: { fontSize: `${n}px` }, title: `${n}px` }));

const TEXT_TYPES = new Set(["heading", "text", "badge", "link", "quote", "list", "logo", "navmenu", "socials"]);
const BOX_TYPES = new Set(["section", "container", "row", "column", "grid", "box", "form"]);

// ---------------------------------------------------------------- panels
function TextQuick({ node, merged, colors, set, setProp }: QuickProps) {
  const t = node.type;
  const sizes =
    t === "heading" ? sizeOpts([24, 36, 48, 64, 88]) : t === "logo" ? sizeOpts([18, 24, 34]) : t === "badge" ? sizeOpts([12, 13, 15]) : sizeOpts([14, 16, 18, 22, 26]);
  return (
    <>
      <Row label="Text size">
        <Choice options={sizes} merged={merged} set={set} />
        <div className="q-exact">
          <UnitInput value={merged.fontSize ?? ""} onChange={(v) => set({ fontSize: v })} placeholder="inherit" />
        </div>
      </Row>
      <Row label="Text color">
        <Swatches value={merged.color ?? ""} onChange={(v) => set({ color: v })} colors={colors} allowNone={false} />
      </Row>
      {t === "heading" || t === "text" ? (
        <Row label="*Accent* color">
          <Swatches value={String(node.props.accentColor ?? "")} onChange={(v) => setProp("accentColor", v)} colors={colors} allowNone={false} />
          <div className="q-hint">Wrap words in *stars* in the text to use this color.</div>
        </Row>
      ) : null}
      <Row label="Weight">
        <Choice options={WEIGHTS} merged={merged} set={set} />
      </Row>
      {t !== "navmenu" && t !== "socials" ? (
        <Row label="Align">
          <Choice options={ALIGN_TEXT} merged={merged} set={set} />
        </Row>
      ) : null}
      <Row label="Style">
        <Choice
          options={[
            { label: "Normal", patch: { fontStyle: "normal", textTransform: "none" } },
            { label: "Italic", patch: { fontStyle: "italic" } },
            { label: "UPPER", patch: { textTransform: "uppercase" } },
          ]}
          merged={merged}
          set={set}
        />
      </Row>
      {t === "badge" ? (
        <Row label="Background">
          <Swatches value={merged.backgroundColor ?? ""} onChange={(v) => set({ backgroundColor: v })} colors={colors} />
        </Row>
      ) : null}
      {t === "navmenu" || t === "socials" ? (
        <Row label="Spacing">
          <Choice options={GAPS} merged={merged} set={set} />
        </Row>
      ) : null}
    </>
  );
}

function buttonStyle(m: StyleMap): "filled" | "outline" | "text" {
  const bg = m.backgroundColor ?? "";
  const bw = m.borderWidth ?? "";
  if (bg === "transparent" || bg === "") return bw && bw !== "0" && bw !== "0px" ? "outline" : bg === "" ? "filled" : "text";
  return "filled";
}

function ButtonQuick({ merged, colors, set }: QuickProps) {
  const style = buttonStyle(merged);
  const main = style === "filled" ? merged.backgroundColor || "var(--tb-primary)" : merged.color || "var(--tb-primary)";
  const apply = (s: typeof style, color = main) => {
    if (s === "filled") set({ backgroundColor: color, color: merged.color && style === "filled" ? merged.color : "#ffffff", borderWidth: "0", borderStyle: "", borderColor: "" });
    if (s === "outline") set({ backgroundColor: "transparent", color, borderWidth: "2px", borderStyle: "solid", borderColor: color });
    if (s === "text") set({ backgroundColor: "transparent", color, borderWidth: "0", borderStyle: "", borderColor: "" });
  };
  return (
    <>
      <Row label="Button style">
        <div className="q-choice">
          {(["filled", "outline", "text"] as const).map((s) => (
            <button key={s} className={style === s ? "on" : ""} onClick={() => apply(s)}>
              {s === "filled" ? "Filled" : s === "outline" ? "Outline" : "Text only"}
            </button>
          ))}
        </div>
      </Row>
      <Row label="Button color">
        <Swatches value={main} onChange={(v) => apply(style, v)} colors={colors} allowNone={false} />
      </Row>
      {style === "filled" ? (
        <Row label="Label color">
          <Swatches value={merged.color ?? ""} onChange={(v) => set({ color: v })} colors={colors} allowNone={false} />
        </Row>
      ) : null}
      <Row label="Size">
        <Choice
          options={[
            { label: "Small", patch: { padding: "8px 16px", fontSize: "14px" } },
            { label: "Medium", patch: { padding: "12px 24px", fontSize: "16px" } },
            { label: "Large", patch: { padding: "16px 32px", fontSize: "18px" } },
          ]}
          merged={merged}
          set={set}
          clear={PAD_SIDES}
        />
      </Row>
      <Row label="Shape">
        <Choice
          options={[
            { label: "Square", patch: { borderRadius: "0" } },
            { label: "Rounded", patch: { borderRadius: "var(--tb-radius)" } },
            { label: "Pill", patch: { borderRadius: "999px" } },
          ]}
          merged={merged}
          set={set}
        />
      </Row>
      <Row label="Position">
        <Choice
          options={[
            { label: "Left", patch: { alignSelf: "flex-start" } },
            { label: "Center", patch: { alignSelf: "center" } },
            { label: "Right", patch: { alignSelf: "flex-end" } },
            { label: "Full width", patch: { alignSelf: "stretch" } },
          ]}
          merged={merged}
          set={set}
        />
      </Row>
    </>
  );
}

function BoxQuick({ node, merged, colors, set }: QuickProps) {
  const t = node.type;
  const isSection = t === "section";
  const pad = isSection
    ? [
        { label: "0", patch: { padding: "0" } },
        { label: "S", patch: { padding: "32px 24px" } },
        { label: "M", patch: { padding: "64px 24px" } },
        { label: "L", patch: { padding: "96px 24px" } },
        { label: "XL", patch: { padding: "128px 24px" } },
      ]
    : [
        { label: "0", patch: { padding: "0" } },
        { label: "S", patch: { padding: "12px" } },
        { label: "M", patch: { padding: "24px" } },
        { label: "L", patch: { padding: "36px" } },
        { label: "XL", patch: { padding: "48px" } },
      ];
  const bgImage = merged.backgroundImage ?? "";
  const hasImage = /url\(/.test(bgImage);
  return (
    <>
      <Row label="Background">
        <Swatches value={merged.backgroundColor ?? ""} onChange={(v) => set({ backgroundColor: v, ...(hasImage ? {} : { backgroundImage: "" }) })} colors={colors} />
        <div className="q-inline">
          <button className="b-btn small" onClick={() => uploadTo((d) => set({ backgroundImage: `url("${d}")`, backgroundSize: "cover", backgroundPosition: "center" }))}>
            <Icon name="image" size={13} /> {hasImage ? "Change image" : "Add image"}
          </button>
          {bgImage ? (
            <button className="b-btn small ghost" onClick={() => set({ backgroundImage: "none" })}>
              Remove image/gradient
            </button>
          ) : null}
        </div>
      </Row>
      <Row label="Text color">
        <Swatches value={merged.color ?? ""} onChange={(v) => set({ color: v })} colors={colors} allowNone={false} />
      </Row>
      <Row label="Inner space">
        <Choice options={pad} merged={merged} set={set} clear={PAD_SIDES} />
      </Row>
      <Row label="Space between items">
        <Choice options={GAPS} merged={merged} set={set} />
      </Row>
      {t === "grid" ? (
        <Row label="Columns">
          <Choice options={[1, 2, 3, 4, 5, 6].map((n) => ({ label: String(n), patch: { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` } }))} merged={merged} set={set} />
        </Row>
      ) : t === "row" ? (
        <>
          <Row label="Line up">
            <Choice
              options={[
                { label: "Top", patch: { alignItems: "flex-start" } },
                { label: "Middle", patch: { alignItems: "center" } },
                { label: "Bottom", patch: { alignItems: "flex-end" } },
                { label: "Stretch", patch: { alignItems: "stretch" } },
              ]}
              merged={merged}
              set={set}
            />
          </Row>
          <Row label="Spread">
            <Choice
              options={[
                { label: "Start", patch: { justifyContent: "flex-start" } },
                { label: "Center", patch: { justifyContent: "center" } },
                { label: "Spread out", patch: { justifyContent: "space-between" } },
              ]}
              merged={merged}
              set={set}
            />
          </Row>
        </>
      ) : (
        <>
          <Row label="Arrange items">
            <Choice
              options={[
                { label: "Stacked", patch: { display: "flex", flexDirection: "column" } },
                { label: "Side by side", patch: { display: "flex", flexDirection: "row", flexWrap: "wrap" } },
              ]}
              merged={merged}
              set={set}
            />
          </Row>
          <Row label="Align items">
            <Choice
              options={
                (merged.flexDirection ?? "").startsWith("row")
                  ? [
                      { label: "Top", patch: { alignItems: "flex-start" } },
                      { label: "Middle", patch: { alignItems: "center" } },
                      { label: "Bottom", patch: { alignItems: "flex-end" } },
                    ]
                  : [
                      { label: "Left", patch: { alignItems: "flex-start" } },
                      { label: "Center", patch: { alignItems: "center" } },
                      { label: "Right", patch: { alignItems: "flex-end" } },
                      { label: "Full", patch: { alignItems: "stretch" } },
                    ]
              }
              merged={merged}
              set={set}
            />
          </Row>
        </>
      )}
      {t === "container" ? (
        <Row label="Width">
          <Choice
            options={[
              { label: "Narrow", patch: { maxWidth: "760px" } },
              { label: "Normal", patch: { maxWidth: "var(--tb-container)" } },
              { label: "Full", patch: { maxWidth: "none" } },
            ]}
            merged={merged}
            set={set}
          />
        </Row>
      ) : null}
      {!isSection ? (
        <>
          <Row label="Corners">
            <Choice options={SHAPES} merged={merged} set={set} />
          </Row>
          <Row label="Border">
            <Choice
              options={[
                { label: "None", patch: { borderWidth: "0" } },
                { label: "Thin", patch: { borderWidth: "1px", borderStyle: "solid", borderColor: "var(--tb-border)" } },
                { label: "Accent", patch: { borderWidth: "2px", borderStyle: "solid", borderColor: "var(--tb-primary)" } },
              ]}
              merged={merged}
              set={set}
            />
          </Row>
          <Row label="Shadow">
            <Choice options={SHADOWS} merged={merged} set={set} />
          </Row>
        </>
      ) : null}
    </>
  );
}

function MediaQuick({ node, merged, colors, set }: QuickProps) {
  const t = node.type;
  return (
    <>
      {t === "image" ? (
        <Row label="Shape">
          <Choice
            options={[
              { label: "Auto", patch: { aspectRatio: "" } },
              { label: "Square", patch: { aspectRatio: "1 / 1" } },
              { label: "4:3", patch: { aspectRatio: "4 / 3" } },
              { label: "16:9", patch: { aspectRatio: "16 / 9" } },
              { label: "Portrait", patch: { aspectRatio: "3 / 4" } },
            ]}
            merged={merged}
            set={set}
          />
        </Row>
      ) : null}
      {t === "image" ? (
        <Row label="Fit">
          <Choice
            options={[
              { label: "Fill (crop)", patch: { objectFit: "cover" } },
              { label: "Show whole", patch: { objectFit: "contain" } },
            ]}
            merged={merged}
            set={set}
          />
        </Row>
      ) : null}
      {t === "map" ? (
        <Row label="Height">
          <Choice
            options={[
              { label: "S", patch: { height: "240px" } },
              { label: "M", patch: { height: "320px" } },
              { label: "L", patch: { height: "460px" } },
            ]}
            merged={merged}
            set={set}
          />
        </Row>
      ) : null}
      {t === "countdown" ? (
        <>
          <Row label="Size">
            <Choice options={sizeOpts([12, 16, 22], ["S", "M", "L"])} merged={merged} set={set} />
          </Row>
          <Row label="Color">
            <Swatches value={merged.color ?? ""} onChange={(v) => set({ color: v })} colors={colors} allowNone={false} />
          </Row>
        </>
      ) : null}
      <Row label="Corners">
        <Choice options={[{ label: "Square", patch: { borderRadius: "0" } }, ...SHAPES.slice(1)]} merged={merged} set={set} />
      </Row>
      <Row label="Shadow">
        <Choice options={SHADOWS} merged={merged} set={set} />
      </Row>
    </>
  );
}

function SimpleQuick({ node, merged, colors, set }: QuickProps) {
  if (node.type === "spacer")
    return (
      <Row label="Height">
        <Choice
          options={[
            { label: "S", patch: { height: "16px" } },
            { label: "M", patch: { height: "32px" } },
            { label: "L", patch: { height: "64px" } },
            { label: "XL", patch: { height: "96px" } },
          ]}
          merged={merged}
          set={set}
        />
      </Row>
    );
  if (node.type === "divider")
    return (
      <>
        <Row label="Color">
          <Swatches value={merged.borderTopColor ?? ""} onChange={(v) => set({ borderTopColor: v, borderTopStyle: "solid" })} colors={colors} allowNone={false} />
        </Row>
        <Row label="Thickness">
          <Choice
            options={[
              { label: "Thin", patch: { borderTopWidth: "1px" } },
              { label: "Medium", patch: { borderTopWidth: "2px" } },
              { label: "Thick", patch: { borderTopWidth: "4px" } },
            ]}
            merged={merged}
            set={set}
          />
        </Row>
      </>
    );
  return (
    <Row label="Width">
      <Choice
        options={[
          { label: "Half", patch: { width: "50%" } },
          { label: "Full", patch: { width: "100%" } },
        ]}
        merged={merged}
        set={set}
      />
    </Row>
  );
}

export function QuickEdit(p: QuickProps & { content: ReactNode }) {
  const t = p.node.type;
  const body =
    t === "button" || t === "submit" ? (
      <ButtonQuick {...p} />
    ) : TEXT_TYPES.has(t) ? (
      <TextQuick {...p} />
    ) : BOX_TYPES.has(t) ? (
      <BoxQuick {...p} />
    ) : t === "image" || t === "video" || t === "map" || t === "countdown" || t === "embed" ? (
      <MediaQuick {...p} />
    ) : (
      <SimpleQuick {...p} />
    );
  return (
    <div className="q-wrap">
      {p.content}
      <div className="q-title">Design</div>
      {body}
      <div className="q-foot">
        Need finer control? Every value is in the <strong>Style</strong> tab.
      </div>
    </div>
  );
}
