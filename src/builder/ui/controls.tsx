"use client";

import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from "react";
import { Icon } from "./Icon";
import { COLOR_TOKENS } from "../css";
import type { ThemeColors } from "../types";

export function Section({ title, children, defaultOpen = true, badge }: { title: string; children: ReactNode; defaultOpen?: boolean; badge?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`b-sec ${open ? "open" : ""}`}>
      <button className="b-sec-head" onClick={() => setOpen(!open)}>
        <Icon name={open ? "chevronDown" : "chevronRight"} size={14} />
        <span>{title}</span>
        {badge}
      </button>
      {open ? <div className="b-sec-body">{children}</div> : null}
    </div>
  );
}

export function Field({ label, children, set, onReset, full }: { label: string; children: ReactNode; set?: boolean; onReset?: () => void; full?: boolean }) {
  return (
    <div className={`b-field ${full ? "full" : ""}`}>
      <label className="b-field-label">
        <span className={set ? "is-set" : ""} title={set ? "Set on this element/state" : undefined}>
          {label}
        </span>
        {set && onReset ? (
          <button className="b-reset" title="Reset" onClick={onReset}>
            <Icon name="close" size={10} />
          </button>
        ) : null}
      </label>
      {children}
    </div>
  );
}

/** Keeps a local draft while focused, so typing is never interrupted by store updates. */
function useDraft(value: string) {
  const [draft, setDraft] = useState(value);
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setDraft(value);
  }, [value]);
  return { draft, setDraft, focused };
}

export function TextInput({ value, onChange, placeholder, multiline, rows = 3, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; rows?: number; mono?: boolean }) {
  const { draft, setDraft, focused } = useDraft(value);
  const common = {
    className: `b-input ${mono ? "mono" : ""}`,
    value: draft,
    placeholder,
    onFocus: () => (focused.current = true),
    onBlur: () => {
      focused.current = false;
      if (draft !== value) onChange(draft);
    },
  };
  if (multiline)
    return (
      <textarea
        {...common}
        rows={rows}
        onChange={(e) => {
          setDraft(e.target.value);
          onChange(e.target.value);
        }}
      />
    );
  return (
    <input
      {...common}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(e.target.value);
      }}
    />
  );
}

const UNIT_RE = /^(-?\d*\.?\d+)([a-z%]*)$/i;

export function UnitInput({ value, onChange, placeholder, unit = "px", step = 1, min }: { value: string; onChange: (v: string) => void; placeholder?: string; unit?: string; step?: number; min?: number }) {
  const { draft, setDraft, focused } = useDraft(value);
  const normalize = (v: string) => {
    const t = v.trim();
    if (/^-?\d*\.?\d+$/.test(t) && unit) return t + unit;
    return t;
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
      if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      return;
    }
    const m = (draft || placeholder || "0").trim().match(UNIT_RE);
    if (!m) return;
    e.preventDefault();
    const s = e.shiftKey ? step * 10 : e.altKey ? step / 10 : step;
    let n = parseFloat(m[1]) + (e.key === "ArrowUp" ? s : -s);
    if (min !== undefined) n = Math.max(min, n);
    const next = `${Math.round(n * 100) / 100}${m[2] || (unit ?? "")}`;
    setDraft(next);
    onChange(next);
  };
  return (
    <input
      className="b-input"
      value={draft}
      placeholder={placeholder}
      onFocus={() => (focused.current = true)}
      onBlur={() => {
        focused.current = false;
        const n = normalize(draft);
        if (n !== draft) setDraft(n);
        if (n !== value) onChange(n);
      }}
      onKeyDown={onKey}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(e.target.value);
      }}
      title="Tip: use ↑/↓ to adjust (Shift = ×10)"
    />
  );
}

export function SelectInput({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[]; placeholder?: string }) {
  const known = options.some((o) => o.value === value);
  return (
    <select className="b-input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder ?? "Default"}</option>
      {!known && value ? <option value={value}>{value}</option> : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label?: string; icon?: string; title?: string }[] }) {
  return (
    <div className="b-seg">
      {options.map((o) => (
        <button key={o.value} className={value === o.value ? "on" : ""} title={o.title ?? o.label ?? o.value} onClick={() => onChange(value === o.value ? "" : o.value)}>
          {o.icon ? <Icon name={o.icon} size={14} /> : o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="b-toggle">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span className="b-toggle-track">
        <span className="b-toggle-thumb" />
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}

export function RangeInput({ value, onChange, min = 0, max = 1, step = 0.05 }: { value: string; onChange: (v: string) => void; min?: number; max?: number; step?: number }) {
  const n = value === "" ? max : parseFloat(value);
  return (
    <div className="b-range">
      <input type="range" min={min} max={max} step={step} value={isNaN(n) ? max : n} onChange={(e) => onChange(e.target.value)} />
      <span>{value || "—"}</span>
    </div>
  );
}

/** "var(--tb-on-dark)" -> "onDark" */
export function tokenOf(v: string): keyof ThemeColors | null {
  const m = v.trim().match(/^var\((--tb-[\w-]+)\)$/);
  if (!m) return null;
  return COLOR_TOKENS.find((t) => t.css === m[1])?.key ?? null;
}

/** Resolve a value (hex or theme variable) to a displayable color. */
export function resolveColor(v: string, colors: ThemeColors): string {
  const k = tokenOf(v);
  return k ? colors[k] ?? v : v;
}

function toHex(v: string, colors: ThemeColors): string {
  v = resolveColor(v, colors);
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  if (/^#[0-9a-f]{3}$/i.test(v)) return "#" + v.slice(1).split("").map((c) => c + c).join("");
  const rgb = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgb) return "#" + [rgb[1], rgb[2], rgb[3]].map((x) => Number(x).toString(16).padStart(2, "0")).join("");
  return "#000000";
}

export function swatchBg(v: string): string {
  return v || "transparent";
}

const QUICK = ["#ffffff", "#f8fafc", "#e2e8f0", "#94a3b8", "#475569", "#0f172a", "#000000", "#ef4444", "#f97316", "#f59e0b", "#22c55e", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "transparent"];

export function ColorInput({ value, onChange, colors, allowTokens = true }: { value: string; onChange: (v: string) => void; colors: ThemeColors; allowTokens?: boolean }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onScroll = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);
  const toggle = () => {
    if (!open && ref.current) {
      const r = ref.current.getBoundingClientRect();
      const W = 240;
      const H = 330;
      const left = Math.max(8, Math.min(r.right - W, window.innerWidth - W - 8));
      const top = r.bottom + 6 + H > window.innerHeight ? Math.max(8, r.top - H - 6) : r.bottom + 6;
      setPos({ left, top });
    }
    setOpen(!open);
  };
  const token = tokenOf(value);
  const tokenLabel = token ? COLOR_TOKENS.find((t) => t.key === token)?.label : null;
  return (
    <div className="b-color" ref={ref}>
      <button className="b-color-btn" onClick={toggle}>
        <span className="b-swatch" style={{ background: token ? colors[token] : swatchBg(value) }} />
        <span className="b-color-text">{tokenLabel ? `Theme · ${tokenLabel}` : value || "Default"}</span>
      </button>
      {open ? (
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
            {QUICK.map((c) => (
              <button key={c} title={c} className={value === c ? "on" : ""} onClick={() => onChange(c)}>
                <span className={`b-swatch ${c === "transparent" ? "checker" : ""}`} style={{ background: c === "transparent" ? undefined : c }} />
              </button>
            ))}
          </div>
          <button className="b-btn small ghost" onClick={() => onChange("")}>
            Clear
          </button>
        </div>
      ) : null}
    </div>
  );
}

type Side = "Top" | "Right" | "Bottom" | "Left";
const SIDES: Side[] = ["Top", "Right", "Bottom", "Left"];

/** Visual box-model editor for margin + padding. */
export function BoxModel({ get, set, placeholderOf }: { get: (prop: string) => string; set: (patch: Record<string, string>) => void; placeholderOf: (prop: string) => string }) {
  const [linked, setLinked] = useState<{ margin: boolean; padding: boolean }>({ margin: false, padding: false });
  const input = (kind: "margin" | "padding", side: Side) => {
    const prop = kind + side;
    return (
      <SmallUnit
        value={get(prop)}
        placeholder={placeholderOf(prop) || "0"}
        onChange={(v) => {
          if (linked[kind]) set(Object.fromEntries(SIDES.map((s) => [kind + s, v])));
          else set({ [prop]: v });
        }}
      />
    );
  };
  return (
    <div className="b-boxmodel">
      <div className="b-bm-margin">
        <span className="b-bm-tag">
          margin
          <button className={linked.margin ? "on" : ""} title="Link all sides" onClick={() => setLinked({ ...linked, margin: !linked.margin })}>
            <Icon name="link2" size={11} />
          </button>
        </span>
        <div className="b-bm-top">{input("margin", "Top")}</div>
        <div className="b-bm-mid">
          {input("margin", "Left")}
          <div className="b-bm-padding">
            <span className="b-bm-tag">
              padding
              <button className={linked.padding ? "on" : ""} title="Link all sides" onClick={() => setLinked({ ...linked, padding: !linked.padding })}>
                <Icon name="link2" size={11} />
              </button>
            </span>
            <div className="b-bm-top">{input("padding", "Top")}</div>
            <div className="b-bm-mid">
              {input("padding", "Left")}
              <div className="b-bm-core" />
              {input("padding", "Right")}
            </div>
            <div className="b-bm-top">{input("padding", "Bottom")}</div>
          </div>
          {input("margin", "Right")}
        </div>
        <div className="b-bm-top">{input("margin", "Bottom")}</div>
      </div>
    </div>
  );
}

function SmallUnit({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="b-bm-input">
      <UnitInput value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}
