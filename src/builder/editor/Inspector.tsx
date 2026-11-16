"use client";

import { useRef, type ReactNode } from "react";
import { activeTheme, useBuilder } from "../store";
import { locate } from "../tree";
import { getDef, placeholderImage, type FieldDef } from "../registry";
import { FONT_OPTIONS, THEME_FONT_VARS, mergedStyle } from "../css";
import type { LinkItem, StyleMap, StyleState, TBNode, ThemeColors, Page } from "../types";
import { BoxModel, ColorInput, Field, RangeInput, Section, Segmented, SelectInput, TextInput, Toggle, UnitInput } from "../ui/controls";
import { Icon } from "../ui/Icon";
import { QuickEdit } from "./QuickEdit";

const opts = (vals: string[]) => vals.map((v) => ({ label: v, value: v }));

const FONT_SELECT = [...THEME_FONT_VARS, ...FONT_OPTIONS].map((f) => ({ label: f.label, value: f.value }));
const WEIGHTS = [
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
const SHADOWS = [
  { label: "None", value: "none" },
  { label: "Small", value: "0 1px 3px rgba(0,0,0,.12)" },
  { label: "Medium", value: "0 8px 24px -6px rgba(0,0,0,.18)" },
  { label: "Large", value: "0 24px 48px -12px rgba(0,0,0,.28)" },
  { label: "Glow (primary)", value: "0 0 0 4px color-mix(in srgb, var(--tb-primary) 25%, transparent)" },
  { label: "Inner", value: "inset 0 2px 6px rgba(0,0,0,.15)" },
];
const GRADIENTS = [
  { label: "Primary → Secondary", value: "linear-gradient(135deg, var(--tb-primary), var(--tb-secondary))" },
  { label: "Sunset", value: "linear-gradient(135deg, #f97316, #ec4899)" },
  { label: "Ocean", value: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
  { label: "Night", value: "linear-gradient(180deg, #0f172a, #1e293b)" },
  { label: "Dark overlay", value: "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55))" },
];

function expandShorthand(v: string): [string, string, string, string] {
  const p = v.trim().split(/\s+(?![^(]*\))/);
  if (p.length === 1) return [p[0], p[0], p[0], p[0]];
  if (p.length === 2) return [p[0], p[1], p[0], p[1]];
  if (p.length === 3) return [p[0], p[1], p[2], p[1]];
  return [p[0], p[1], p[2], p[3]];
}
const SIDES = ["Top", "Right", "Bottom", "Left"];

function readFile(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export function UploadButton({ onData, label = "Upload" }: { onData: (dataUrl: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button className="b-btn small" onClick={() => ref.current?.click()}>
        <Icon name="upload" size={13} /> {label}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (f.size > 1.5 * 1024 * 1024 && !confirm("This image is larger than 1.5 MB and will be stored in your browser. Continue?")) return;
          onData(await readFile(f));
          e.target.value = "";
        }}
      />
    </>
  );
}

let styleClipboard: StyleMap | null = null;

export function Inspector() {
  const { state, dispatch, theme, page } = useBuilder();
  const { ui } = state;
  const sel = ui.selectedId ? locate(theme, page, ui.selectedId) : null;
  if (!sel) return <PageSettings page={page} />;

  const node = sel.node;
  const def = getDef(node.type);
  const styleState: StyleState = ui.hoverState ? "hover" : ui.device;
  const own: StyleMap = node.styles[styleState] ?? {};
  const inherited: StyleMap =
    styleState === "desktop" ? {} : styleState === "hover" ? node.styles.desktop : styleState === "tablet" ? node.styles.desktop : mergedStyle(node.styles, "tablet");
  const merged = { ...inherited, ...own };

  const get = (k: string) => own[k] ?? "";
  const ph = (k: string) => inherited[k] ?? "";
  const set = (patch: StyleMap) => dispatch({ type: "UPDATE_STYLE", id: node.id, state: styleState, patch, key: `style:${node.id}:${styleState}:${Object.keys(patch).join(",")}` });
  const reset = (...keys: string[]) => () => set(Object.fromEntries(keys.map((k) => [k, ""])));
  const isSet = (...keys: string[]) => keys.some((k) => !!own[k]);

  const setBox = (patch: StyleMap) => {
    const kind = Object.keys(patch)[0].startsWith("margin") ? "margin" : "padding";
    const full: StyleMap = { ...patch };
    if (own[kind]) {
      const parts = expandShorthand(own[kind]);
      SIDES.forEach((s, i) => {
        if (!(kind + s in full)) full[kind + s] = parts[i];
      });
      full[kind] = "";
    }
    set(full);
  };
  const boxPlaceholder = (prop: string) => {
    if (own[prop]) return "";
    const kind = prop.startsWith("margin") ? "margin" : "padding";
    const side = prop.slice(kind.length);
    if (inherited[prop]) return inherited[prop];
    const sh = own[kind] || inherited[kind];
    if (sh) return expandShorthand(sh)[SIDES.indexOf(side)];
    return "";
  };
  const boxGet = (prop: string) => {
    if (own[prop]) return own[prop];
    const kind = prop.startsWith("margin") ? "margin" : "padding";
    if (own[kind]) return expandShorthand(own[kind])[SIDES.indexOf(prop.slice(kind.length))];
    return "";
  };

  const colors = theme.tokens.colors;
  const unit = (k: string, label: string, opt: { placeholder?: string; unit?: string; step?: number } = {}) => (
    <Field label={label} set={isSet(k)} onReset={reset(k)}>
      <UnitInput value={get(k)} onChange={(v) => set({ [k]: v })} placeholder={ph(k) || opt.placeholder} unit={opt.unit ?? "px"} step={opt.step} />
    </Field>
  );
  const select = (k: string, label: string, options: { label: string; value: string }[]) => (
    <Field label={label} set={isSet(k)} onReset={reset(k)}>
      <SelectInput value={get(k)} onChange={(v) => set({ [k]: v })} options={options} placeholder={ph(k) ? `Inherit (${ph(k)})` : "Default"} />
    </Field>
  );
  const color = (k: string, label: string) => (
    <Field label={label} set={isSet(k)} onReset={reset(k)}>
      <ColorInput value={get(k) || ""} onChange={(v) => set({ [k]: v })} colors={colors} />
    </Field>
  );
  const text = (k: string, label: string, placeholder?: string, full = false) => (
    <Field label={label} set={isSet(k)} onReset={reset(k)} full={full}>
      <TextInput value={get(k)} onChange={(v) => set({ [k]: v })} placeholder={ph(k) || placeholder} />
    </Field>
  );

  const display = merged.display ?? "";
  const isFlex = display.includes("flex");
  const isGrid = display.includes("grid");

  return (
    <div className="b-inspector">
      <div className="b-insp-head">
        <div className="b-insp-title">
          <Icon name={def.icon} size={16} />
          <input className="b-insp-name" value={node.name ?? ""} placeholder={def.label} onChange={(e) => dispatch({ type: "RENAME_NODE", id: node.id, name: e.target.value })} />
          {sel.zone !== "page" ? <span className="b-chip">Global {sel.zone}</span> : null}
        </div>
        <div className="b-statebar">
          <span>Editing</span>
          <Segmented
            value={ui.device}
            onChange={(v) => dispatch({ type: "UI", patch: { device: (v || "desktop") as typeof ui.device } })}
            options={[
              { value: "desktop", icon: "desktop", title: "Desktop styles" },
              { value: "tablet", icon: "tablet", title: "Tablet overrides (≤1024px)" },
              { value: "mobile", icon: "mobile", title: "Mobile overrides (≤640px)" },
            ]}
          />
          <button className={`b-btn small ${ui.hoverState ? "primary" : ""}`} onClick={() => dispatch({ type: "UI", patch: { hoverState: !ui.hoverState } })} title="Edit the hover state">
            :hover
          </button>
        </div>
        {styleState !== "desktop" ? (
          <div className="b-note">
            {styleState === "hover" ? "Hover styles apply when the mouse is over this element." : `Changes apply to ${styleState} screens only. Empty fields inherit from larger screens (shown in grey).`}
          </div>
        ) : null}
        <div className="b-tabs">
          {(
            [
              ["edit", "Edit"],
              ["style", "Style"],
              ["advanced", "Advanced"],
            ] as const
          ).map(([t, label]) => (
            <button key={t} className={ui.rightTab === t || (t === "edit" && ui.rightTab === "content") ? "on" : ""} onClick={() => dispatch({ type: "UI", patch: { rightTab: t } })}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="b-insp-body">
        {ui.rightTab === "edit" || ui.rightTab === "content" ? (
          <QuickEdit
            node={node}
            merged={merged}
            colors={colors}
            set={set}
            setProp={(k, v) => dispatch({ type: "UPDATE_PROPS", id: node.id, props: { [k]: v }, key: `props:${node.id}:${k}` })}
            content={def.fields.length ? <ContentFields node={node} fields={def.fields.filter((f) => f.key !== "accentColor")} pages={theme.pages} /> : null}
          />
        ) : ui.rightTab === "advanced" ? (
          <Advanced node={node} styleState={styleState} own={own} set={set} />
        ) : (
          <>
            <Section title="Typography">
              <div className="b-grid2">
                <Field label="Font" set={isSet("fontFamily")} onReset={reset("fontFamily")} full>
                  <SelectInput value={get("fontFamily")} onChange={(v) => set({ fontFamily: v })} options={FONT_SELECT} placeholder={ph("fontFamily") ? "Inherit" : "Inherit from parent"} />
                </Field>
                {unit("fontSize", "Size", { placeholder: "inherit" })}
                {select("fontWeight", "Weight", WEIGHTS)}
                {unit("lineHeight", "Line height", { unit: "", step: 0.1, placeholder: "normal" })}
                {unit("letterSpacing", "Letter spacing", { step: 0.5, placeholder: "normal" })}
                {color("color", "Text color")}
                {select("textTransform", "Transform", opts(["none", "uppercase", "lowercase", "capitalize"]))}
                <Field label="Align" set={isSet("textAlign")} onReset={reset("textAlign")} full>
                  <Segmented
                    value={get("textAlign")}
                    onChange={(v) => set({ textAlign: v })}
                    options={[
                      { value: "left", icon: "alignLeft" },
                      { value: "center", icon: "alignCenter" },
                      { value: "right", icon: "alignRight" },
                      { value: "justify", icon: "alignJustify" },
                    ]}
                  />
                </Field>
                <Field label="Style" set={isSet("fontStyle")} onReset={reset("fontStyle")}>
                  <Segmented value={get("fontStyle")} onChange={(v) => set({ fontStyle: v })} options={[{ value: "normal", label: "Aa" }, { value: "italic", label: "𝐼" }]} />
                </Field>
                <Field label="Decoration" set={isSet("textDecoration")} onReset={reset("textDecoration")}>
                  <Segmented
                    value={get("textDecoration")}
                    onChange={(v) => set({ textDecoration: v })}
                    options={[
                      { value: "none", label: "—", title: "None" },
                      { value: "underline", label: "U", title: "Underline" },
                      { value: "line-through", label: "S", title: "Strike" },
                    ]}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Spacing">
              <BoxModel get={boxGet} set={setBox} placeholderOf={boxPlaceholder} />
              <div className="b-grid2" style={{ marginTop: 10 }}>
                {unit("gap", "Gap (between children)")}
              </div>
            </Section>

            <Section title="Size">
              <div className="b-grid2">
                {unit("width", "Width", { placeholder: "auto" })}
                {unit("height", "Height", { placeholder: "auto" })}
                {unit("minWidth", "Min width")}
                {unit("maxWidth", "Max width", { placeholder: "none" })}
                {unit("minHeight", "Min height")}
                {unit("maxHeight", "Max height", { placeholder: "none" })}
                {select("aspectRatio", "Aspect ratio", [
                  { label: "1:1 Square", value: "1 / 1" },
                  { label: "4:3", value: "4 / 3" },
                  { label: "3:2", value: "3 / 2" },
                  { label: "16:9", value: "16 / 9" },
                  { label: "21:9", value: "21 / 9" },
                  { label: "3:4 Portrait", value: "3 / 4" },
                  { label: "9:16", value: "9 / 16" },
                ])}
                {select("objectFit", "Object fit", opts(["cover", "contain", "fill", "none", "scale-down"]))}
                {select("overflow", "Overflow", opts(["visible", "hidden", "auto", "scroll"]))}
              </div>
            </Section>

            <Section title="Layout">
              <div className="b-grid2">
                {select("display", "Display", opts(["block", "flex", "grid", "inline-block", "inline-flex", "inline", "none"]))}
                {isFlex ? (
                  <>
                    <Field label="Direction" set={isSet("flexDirection")} onReset={reset("flexDirection")}>
                      <Segmented
                        value={get("flexDirection")}
                        onChange={(v) => set({ flexDirection: v })}
                        options={[
                          { value: "row", label: "→ Row" },
                          { value: "column", label: "↓ Col" },
                        ]}
                      />
                    </Field>
                    {select("justifyContent", "Justify", opts(["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"]))}
                    {select("alignItems", "Align items", opts(["stretch", "flex-start", "center", "flex-end", "baseline"]))}
                    {select("flexWrap", "Wrap", opts(["nowrap", "wrap", "wrap-reverse"]))}
                  </>
                ) : null}
                {isGrid ? (
                  <>
                    <Field label="Columns" set={isSet("gridTemplateColumns")} onReset={reset("gridTemplateColumns")} full>
                      <div className="b-inline">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <button
                            key={n}
                            className={`b-btn small ${merged.gridTemplateColumns === `repeat(${n}, minmax(0, 1fr))` ? "primary" : ""}`}
                            onClick={() => set({ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` })}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <TextInput value={get("gridTemplateColumns")} onChange={(v) => set({ gridTemplateColumns: v })} placeholder={ph("gridTemplateColumns") || "e.g. 2fr 1fr"} />
                    </Field>
                    {select("alignItems", "Align items", opts(["stretch", "start", "center", "end"]))}
                    {select("justifyItems", "Justify items", opts(["stretch", "start", "center", "end"]))}
                  </>
                ) : null}
              </div>
              <div className="b-subtitle">As a child of its parent</div>
              <div className="b-grid2">
                {text("flex", "Flex", "e.g. 1 1 0")}
                {select("alignSelf", "Align self", opts(["auto", "flex-start", "center", "flex-end", "stretch"]))}
                {unit("order", "Order", { unit: "" })}
                {text("gridColumn", "Grid column", "e.g. span 2")}
              </div>
            </Section>

            <Section title="Background">
              <div className="b-grid2">
                {color("backgroundColor", "Color")}
                <Field label="Image / gradient" set={isSet("backgroundImage")} onReset={reset("backgroundImage")} full>
                  {get("backgroundImage") ? <div className="b-bgprev" style={{ backgroundImage: get("backgroundImage"), backgroundSize: "cover", backgroundPosition: "center" }} /> : null}
                  <div className="b-inline">
                    <UploadButton onData={(d) => set({ backgroundImage: `url("${d}")`, backgroundSize: get("backgroundSize") || "cover", backgroundPosition: get("backgroundPosition") || "center" })} />
                    <SelectInput value="" onChange={(v) => v && set({ backgroundImage: v })} options={GRADIENTS} placeholder="Gradient presets…" />
                  </div>
                  <TextInput
                    value={get("backgroundImage").startsWith('url("data:') ? "(uploaded image)" : get("backgroundImage")}
                    onChange={(v) => {
                      if (v === "(uploaded image)") return;
                      set({ backgroundImage: /^https?:\/\//.test(v.trim()) ? `url("${v.trim()}")` : v });
                    }}
                    placeholder={ph("backgroundImage") ? "Inherited" : "Paste image URL or CSS gradient"}
                  />
                </Field>
                {select("backgroundSize", "Size", opts(["cover", "contain", "auto", "100% 100%"]))}
                {select("backgroundPosition", "Position", opts(["center", "top", "bottom", "left", "right"]))}
                {select("backgroundRepeat", "Repeat", opts(["no-repeat", "repeat", "repeat-x", "repeat-y"]))}
                {select("backgroundAttachment", "Attachment", opts(["scroll", "fixed"]))}
              </div>
            </Section>

            <Section title="Border" defaultOpen={false}>
              <div className="b-grid2">
                {unit("borderWidth", "Width")}
                {select("borderStyle", "Style", opts(["none", "solid", "dashed", "dotted", "double"]))}
                {color("borderColor", "Color")}
                {unit("borderRadius", "Radius")}
              </div>
              <div className="b-inline" style={{ marginTop: 8 }}>
                <button className="b-btn small" onClick={() => set({ borderRadius: "var(--tb-radius)" })}>
                  Theme radius
                </button>
                <button className="b-btn small" onClick={() => set({ borderRadius: "999px" })}>
                  Pill
                </button>
                <button className="b-btn small" onClick={() => set({ borderRadius: "0" })}>
                  Square
                </button>
              </div>
            </Section>

            <Section title="Effects" defaultOpen={false}>
              <div className="b-grid2">
                <Field label="Shadow" set={isSet("boxShadow")} onReset={reset("boxShadow")} full>
                  <SelectInput value={get("boxShadow")} onChange={(v) => set({ boxShadow: v })} options={SHADOWS} />
                </Field>
                <Field label="Opacity" set={isSet("opacity")} onReset={reset("opacity")} full>
                  <RangeInput value={get("opacity")} onChange={(v) => set({ opacity: v })} />
                </Field>
                {text("transform", "Transform", "e.g. scale(1.05)")}
                {text("transition", "Transition", "all .2s ease")}
                {select("cursor", "Cursor", opts(["auto", "pointer", "default", "text", "not-allowed"]))}
                {text("filter", "Filter", "e.g. blur(2px)")}
              </div>
            </Section>

            <Section title="Position" defaultOpen={false}>
              <div className="b-grid2">
                {select("position", "Position", opts(["static", "relative", "absolute", "fixed", "sticky"]))}
                {unit("zIndex", "Z-index", { unit: "" })}
                {unit("top", "Top")}
                {unit("right", "Right")}
                {unit("bottom", "Bottom")}
                {unit("left", "Left")}
              </div>
            </Section>

            <div className="b-insp-actions">
              <button
                className="b-btn small"
                onClick={() => {
                  styleClipboard = { ...own };
                }}
              >
                <Icon name="copy" size={13} /> Copy styles
              </button>
              <button className="b-btn small" onClick={() => styleClipboard && set(styleClipboard)}>
                Paste styles
              </button>
              <button className="b-btn small ghost" onClick={() => dispatch({ type: "CLEAR_STYLE", id: node.id, state: styleState })}>
                Reset {styleState}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Advanced({ node, styleState, own, set }: { node: TBNode; styleState: StyleState; own: StyleMap; set: (p: StyleMap) => void }) {
  const { dispatch } = useBuilder();
  const prop = (k: string, v: string) => dispatch({ type: "UPDATE_PROPS", id: node.id, props: { [k]: v }, key: `props:${node.id}:${k}` });
  return (
    <>
      <Section title="Attributes">
        <Field label="HTML id (for #anchor links)">
          <TextInput value={String(node.props.htmlId ?? "")} onChange={(v) => prop("htmlId", v.replace(/\s+/g, "-"))} placeholder="e.g. features" />
        </Field>
        <Field label="Extra CSS classes">
          <TextInput value={String(node.props.className ?? "")} onChange={(v) => prop("className", v)} placeholder="my-class another" />
        </Field>
        <Field label="Visibility">
          <Toggle value={!node.hidden} onChange={() => dispatch({ type: "TOGGLE_HIDDEN", id: node.id })} label={node.hidden ? "Hidden" : "Visible"} />
        </Field>
      </Section>
      <Section title={`Custom CSS · ${styleState}`}>
        <div className="b-note">Raw CSS declarations for this element. Example: border-top: 4px solid red; backdrop-filter: blur(8px);</div>
        <TextInput multiline rows={6} mono value={own.__custom ?? ""} onChange={(v) => set({ __custom: v })} placeholder="property: value;" />
      </Section>
      <Section title="Responsive visibility">
        <div className="b-inline">
          <button className="b-btn small" onClick={() => dispatch({ type: "UPDATE_STYLE", id: node.id, state: "mobile", patch: { display: "none" } })}>
            Hide on mobile
          </button>
          <button className="b-btn small" onClick={() => dispatch({ type: "UPDATE_STYLE", id: node.id, state: "tablet", patch: { display: "none" } })}>
            Hide on tablet & mobile
          </button>
        </div>
        <div className="b-note">Undo with the reset (×) next to Display while editing that device.</div>
      </Section>
      <Section title="Element info" defaultOpen={false}>
        <div className="b-kv">
          <span>Type</span>
          <code>{node.type}</code>
          <span>ID</span>
          <code>{node.id}</code>
          <span>CSS class</span>
          <code>.tb-n-{node.id}</code>
        </div>
      </Section>
    </>
  );
}

export function pageHref(p: Page): string {
  return p.slug === "home" || p.slug === "index" ? "/" : `/${p.slug}`;
}

function LinkPicker({ value, onChange, pages }: { value: string; onChange: (v: string) => void; pages: Page[] }) {
  return (
    <div className="b-linkpick">
      <TextInput value={value} onChange={onChange} placeholder="/page, #section or https://…" />
      <select className="b-input b-linkpick-sel" value="" onChange={(e) => e.target.value && onChange(e.target.value)} title="Link to a page">
        <option value="">Pages…</option>
        {pages.map((p) => (
          <option key={p.id} value={pageHref(p)}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ContentFields({ node, fields, pages }: { node: TBNode; fields: FieldDef[]; pages: Page[] }) {
  const { dispatch, theme } = useBuilder();
  const colors = theme.tokens.colors;
  if (!fields.length)
    return (
      <div className="b-empty-note">
        <Icon name="settings" size={22} />
        This element has no content settings. Use the Style tab to design it, or drop components inside it.
      </div>
    );
  const set = (k: string, v: unknown) => dispatch({ type: "UPDATE_PROPS", id: node.id, props: { [k]: v }, key: `props:${node.id}:${k}` });
  const val = (k: string) => node.props[k];
  const editor = (f: FieldDef): ReactNode => {
    const v = val(f.key);
    switch (f.type) {
      case "textarea":
        return <TextInput multiline rows={4} value={String(v ?? "")} onChange={(x) => set(f.key, x)} placeholder={f.placeholder} />;
      case "code":
        return <TextInput multiline mono rows={8} value={String(v ?? "")} onChange={(x) => set(f.key, x)} placeholder={f.placeholder} />;
      case "url":
        return <LinkPicker value={String(v ?? "")} onChange={(x) => set(f.key, x)} pages={pages} />;
      case "number":
        return <TextInput value={String(v ?? "")} onChange={(x) => set(f.key, x === "" ? "" : Number(x) || 0)} />;
      case "select":
        return (
          <select className="b-input" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)}>
            {(f.options ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
      case "toggle":
        return <Toggle value={!!v} onChange={(x) => set(f.key, x)} />;
      case "color":
        return <ColorInput value={String(v ?? "")} onChange={(x) => set(f.key, x)} colors={colors} />;
      case "image":
        return (
          <div className="b-imgfield">
            {v ? <img src={String(v)} alt="" /> : <div className="b-imgfield-empty">No image</div>}
            <div className="b-inline">
              <UploadButton onData={(d) => set(f.key, d)} />
              <button className="b-btn small ghost" onClick={() => set(f.key, node.type === "image" ? placeholderImage() : "")}>
                {node.type === "image" ? "Placeholder" : "Remove"}
              </button>
            </div>
            <TextInput value={String(v ?? "").startsWith("data:") ? "" : String(v ?? "")} onChange={(x) => set(f.key, x)} placeholder="…or paste an image URL" />
          </div>
        );
      case "items": {
        const items = Array.isArray(v) ? (v as string[]) : [];
        return (
          <div className="b-listed">
            {items.map((it, i) => (
              <div className="b-listed-row" key={i}>
                <TextInput value={String(it)} onChange={(x) => set(f.key, items.map((y, j) => (j === i ? x : y)))} />
                <button className="b-icon-btn" title="Remove" onClick={() => set(f.key, items.filter((_, j) => j !== i))}>
                  <Icon name="trash" size={13} />
                </button>
              </div>
            ))}
            <button className="b-btn small" onClick={() => set(f.key, [...items, "New item"])}>
              <Icon name="plus" size={13} /> Add item
            </button>
          </div>
        );
      }
      case "links": {
        const links = Array.isArray(v) ? (v as LinkItem[]) : [];
        const upd = (i: number, patch: Partial<LinkItem>) => set(f.key, links.map((l, j) => (j === i ? { ...l, ...patch } : l)));
        const move = (i: number, d: number) => {
          const to = i + d;
          if (to < 0 || to >= links.length) return;
          const copy = [...links];
          const [m] = copy.splice(i, 1);
          copy.splice(to, 0, m);
          set(f.key, copy);
        };
        return (
          <div className="b-listed">
            {links.map((l, i) => (
              <div className="b-linkrow" key={i}>
                <div className="b-linkrow-top">
                  <TextInput value={l.label} onChange={(x) => upd(i, { label: x })} placeholder="Label" />
                  <button className="b-icon-btn" title="Up" onClick={() => move(i, -1)}>
                    <Icon name="up" size={12} />
                  </button>
                  <button className="b-icon-btn" title="Down" onClick={() => move(i, 1)}>
                    <Icon name="down" size={12} />
                  </button>
                  <button className="b-icon-btn" title="Remove" onClick={() => set(f.key, links.filter((_, j) => j !== i))}>
                    <Icon name="trash" size={12} />
                  </button>
                </div>
                <LinkPicker value={l.href} onChange={(x) => upd(i, { href: x })} pages={pages} />
              </div>
            ))}
            <button className="b-btn small" onClick={() => set(f.key, [...links, { label: "New link", href: "#" }])}>
              <Icon name="plus" size={13} /> Add link
            </button>
          </div>
        );
      }
      default:
        return <TextInput value={String(v ?? "")} onChange={(x) => set(f.key, x)} placeholder={f.placeholder} />;
    }
  };
  return (
    <Section title="Content">
      {fields.map((f) => (
        <Field key={f.key} label={f.label} full>
          {editor(f)}
          {f.help ? <div className="b-note">{f.help}</div> : null}
        </Field>
      ))}
    </Section>
  );
}

function PageSettings({ page }: { page: Page }) {
  const { state, dispatch } = useBuilder();
  const theme = activeTheme(state.project);
  return (
    <div className="b-inspector">
      <div className="b-insp-head">
        <div className="b-insp-title">
          <Icon name="file" size={16} />
          <strong>Page · {page.name}</strong>
        </div>
      </div>
      <div className="b-insp-body">
        <Section title="Page settings">
          <Field label="Page name" full>
            <TextInput value={page.name} onChange={(v) => dispatch({ type: "UPDATE_PAGE", id: page.id, patch: { name: v } })} />
          </Field>
          <Field label="URL slug" full>
            <TextInput value={page.slug} onChange={(v) => dispatch({ type: "UPDATE_PAGE", id: page.id, patch: { slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") } })} />
          </Field>
          <Field label="Show global header" full>
            <Toggle value={page.showHeader} onChange={(v) => dispatch({ type: "UPDATE_PAGE", id: page.id, patch: { showHeader: v } })} />
          </Field>
          <Field label="Show global footer" full>
            <Toggle value={page.showFooter} onChange={(v) => dispatch({ type: "UPDATE_PAGE", id: page.id, patch: { showFooter: v } })} />
          </Field>
        </Section>
        <Section title="Quick theme colors">
          <div className="b-grid2">
            {(Object.keys(theme.tokens.colors) as (keyof ThemeColors)[]).slice(0, 4).map((k) => (
              <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                <ColorInput allowTokens={false} value={theme.tokens.colors[k]} colors={theme.tokens.colors} onChange={(v) => dispatch({ type: "UPDATE_TOKENS", patch: {}, colors: { [k]: v }, key: "color:" + k })} />
              </Field>
            ))}
          </div>
          <button className="b-btn small" onClick={() => dispatch({ type: "UI", patch: { leftTab: "themes" } })}>
            All theme settings →
          </button>
        </Section>
        <div className="b-tips">
          <strong>Tips</strong>
          <ul>
            <li>Click any element on the canvas to style it.</li>
            <li>Double-click text to edit it in place.</li>
            <li>Drag elements to reorder; use the ⠿ handle on the selection label to move a parent.</li>
            <li>Switch to tablet or mobile to add responsive overrides.</li>
            <li>Shortcuts: Ctrl+Z undo, Ctrl+Shift+Z redo, Ctrl+D duplicate, Ctrl+C / Ctrl+V copy & paste, Del delete, Esc select parent.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
