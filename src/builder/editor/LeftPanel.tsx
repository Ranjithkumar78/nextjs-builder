"use client";

import { useState, type DragEvent } from "react";
import { useBuilder, type State } from "../store";
import { CATEGORIES, COMPONENTS, createNode, getDef, isContainer } from "../registry";
import { BLOCKS } from "../presets";
import * as P from "../presets";
import { dragState } from "../dnd";
import { getZoneNodes, locate } from "../tree";
import { isUlid, ulid } from "../ulid";
import { refreshEventData } from "../eventData";
import { blankTheme, mahatmaTheme, newPage, starterTheme, TOKEN_PRESETS } from "../defaults";
import { COLOR_TOKENS, FONT_OPTIONS, fullColors } from "../css";
import type { DropTarget, TBNode, Theme, Zone } from "../types";
import { Icon } from "../ui/Icon";
import { Field, Section, SelectInput, TextInput, UnitInput } from "../ui/controls";

/** Where a clicked (not dragged) component should be inserted. */
export function smartTarget(state: State): DropTarget {
  const p = state.project;
  const theme = p.themes.find((t) => t.id === p.activeThemeId) ?? p.themes[0];
  const page = theme.pages.find((x) => x.id === p.activePageId) ?? theme.pages[0];
  const id = state.ui.selectedId;
  const loc = id ? locate(theme, page, id) : null;
  if (loc) {
    if (isContainer(loc.node.type)) return { zone: loc.zone, parentId: loc.node.id, index: loc.node.children?.length ?? 0 };
    return { zone: loc.zone, parentId: loc.parent?.id ?? null, index: loc.index + 1 };
  }
  return { zone: "page", parentId: null, index: page.nodes.length };
}

export function LeftPanel() {
  const { state, dispatch } = useBuilder();
  const tab = state.ui.leftTab;
  const tabs = [
    { id: "components", icon: "components", label: "Add" },
    { id: "layers", icon: "layers", label: "Layers" },
    { id: "pages", icon: "pages", label: "Pages" },
    { id: "themes", icon: "palette", label: "Themes" },
  ] as const;
  return (
    <aside className="b-left">
      <nav className="b-rail">
        {tabs.map((t) => (
          <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => dispatch({ type: "UI", patch: { leftTab: t.id } })} title={t.label}>
            <Icon name={t.icon} size={19} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
      <div className="b-left-body">
        {tab === "components" ? <ComponentsTab /> : tab === "layers" ? <LayersTab /> : tab === "pages" ? <PagesTab /> : <ThemesTab />}
      </div>
    </aside>
  );
}

// ------------------------------------------------------------------ Components
function ComponentsTab() {
  const { state, dispatch } = useBuilder();
  const [mode, setMode] = useState<"elements" | "blocks">("elements");
  const [q, setQ] = useState("");
  const add = (create: () => TBNode) => dispatch({ type: "ADD_NODE", node: create(), target: smartTarget(state) });
  const startDrag = (e: DragEvent, create: () => TBNode, label: string) => {
    dragState.set({ kind: "new", create, label });
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", label);
  };
  const query = q.trim().toLowerCase();
  return (
    <div className="b-panel">
      <div className="b-panel-head">
        <div className="b-seg wide">
          <button className={mode === "elements" ? "on" : ""} onClick={() => setMode("elements")}>
            Elements
          </button>
          <button className={mode === "blocks" ? "on" : ""} onClick={() => setMode("blocks")}>
            Blocks
          </button>
        </div>
        <div className="b-search">
          <Icon name="search" size={14} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${mode}…`} />
        </div>
      </div>
      <div className="b-panel-scroll">
        {mode === "elements" ? (
          CATEGORIES.map((cat) => {
            const items = COMPONENTS.filter((c) => c.category === cat && (!query || c.label.toLowerCase().includes(query)));
            if (!items.length) return null;
            return (
              <div key={cat} className="b-cat">
                <div className="b-cat-title">{cat}</div>
                <div className="b-tiles">
                  {items.map((c) => (
                    <button
                      key={c.type}
                      className="b-tile"
                      draggable
                      onDragStart={(e) => startDrag(e, () => createNode(c.type), c.label)}
                      onClick={() => add(() => createNode(c.type))}
                      title={`Drag onto the canvas or click to insert`}
                    >
                      <Icon name={c.icon} size={20} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="b-blocks">
            {BLOCKS.filter((b) => !query || b.label.toLowerCase().includes(query)).map((b) => (
              <button key={b.id} className="b-block" draggable onDragStart={(e) => startDrag(e, b.build, b.label)} onClick={() => add(b.build)} title="Drag onto the canvas or click to insert">
                <span className="b-block-icon">
                  <Icon name={b.icon} size={18} />
                </span>
                <span>{b.label}</span>
                <Icon name="plus" size={14} className="b-block-plus" />
              </button>
            ))}
          </div>
        )}
        <div className="b-hint">Tip: drag onto the canvas or the Layers tree, or click to insert after the selected element.</div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Layers
type DropPos = "before" | "after" | "inside";

function LayersTab() {
  const { theme, page } = useBuilder();
  const zones: { zone: Zone; label: string; icon: string; show: boolean }[] = [
    { zone: "header", label: "Header (global)", icon: "header", show: page.showHeader },
    { zone: "page", label: `Page · ${page.name}`, icon: "file", show: true },
    { zone: "footer", label: "Footer (global)", icon: "footer", show: page.showFooter },
  ];
  return (
    <div className="b-panel">
      <div className="b-panel-head">
        <div className="b-panel-title">Layers</div>
      </div>
      <div className="b-panel-scroll b-layers">
        {zones
          .filter((z) => z.show)
          .map((z) => (
            <LayerZone key={z.zone} zone={z.zone} label={z.label} icon={z.icon} nodes={getZoneNodes(theme, page, z.zone)} />
          ))}
      </div>
    </div>
  );
}

function useLayerDrop() {
  const { dispatch } = useBuilder();
  return (target: DropTarget) => {
    const p = dragState.get();
    dragState.clear();
    if (!p) return;
    if (p.kind === "new") dispatch({ type: "ADD_NODE", node: p.create(), target });
    else dispatch({ type: "MOVE_NODE", id: p.id, target });
  };
}

function LayerZone({ zone, label, icon, nodes }: { zone: Zone; label: string; icon: string; nodes: TBNode[] }) {
  const drop = useLayerDrop();
  const [over, setOver] = useState(false);
  return (
    <div className="b-layer-zone">
      <div
        className={`b-layer-zone-head ${over ? "drop-inside" : ""}`}
        onDragOver={(e) => {
          if (!dragState.get()) return;
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          drop({ zone, parentId: null, index: nodes.length });
        }}
      >
        <Icon name={icon} size={13} /> {label}
      </div>
      {nodes.length === 0 ? <div className="b-layer-empty">Empty — drop here</div> : null}
      {nodes.map((n, i) => (
        <LayerRow key={n.id} node={n} zone={zone} parentId={null} index={i} depth={0} />
      ))}
    </div>
  );
}

function LayerRow({ node, zone, parentId, index, depth }: { node: TBNode; zone: Zone; parentId: string | null; index: number; depth: number }) {
  const { state, dispatch } = useBuilder();
  const [open, setOpen] = useState(depth < 1);
  const [pos, setPos] = useState<DropPos | null>(null);
  const drop = useLayerDrop();
  const def = getDef(node.type);
  const selected = state.ui.selectedId === node.id;
  const container = !!def.container;
  const kids = node.children ?? [];

  const calc = (e: DragEvent<HTMLDivElement>): DropPos => {
    const r = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - r.top) / r.height;
    if (container) return y < 0.28 ? "before" : y > 0.72 ? "after" : "inside";
    return y < 0.5 ? "before" : "after";
  };

  return (
    <>
      <div
        className={`b-layer ${selected ? "sel" : ""} ${node.hidden ? "hidden" : ""} ${pos ? "drop-" + pos : ""}`}
        style={{ paddingLeft: 8 + depth * 14 }}
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          dragState.set({ kind: "move", id: node.id });
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", node.id);
        }}
        onDragOver={(e) => {
          const p = dragState.get();
          if (!p || (p.kind === "move" && p.id === node.id)) return;
          e.preventDefault();
          e.stopPropagation();
          setPos(calc(e));
        }}
        onDragLeave={() => setPos(null)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const where = calc(e);
          setPos(null);
          if (where === "inside") {
            setOpen(true);
            drop({ zone, parentId: node.id, index: kids.length });
          } else drop({ zone, parentId, index: index + (where === "after" ? 1 : 0) });
        }}
        onClick={() => dispatch({ type: "UI", patch: { selectedId: node.id } })}
      >
        {container ? (
          <button
            className="b-layer-caret"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <Icon name={open ? "chevronDown" : "chevronRight"} size={12} />
          </button>
        ) : (
          <span className="b-layer-caret" />
        )}
        <Icon name={def.icon} size={13} />
        <span className="b-layer-name">{node.name || def.label}</span>
        {node.type === "heading" || node.type === "text" || node.type === "button" ? <span className="b-layer-sub">{String(node.props.text ?? "").slice(0, 24)}</span> : null}
        <button
          className="b-layer-eye"
          title={node.hidden ? "Show" : "Hide"}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "TOGGLE_HIDDEN", id: node.id });
          }}
        >
          <Icon name={node.hidden ? "eyeOff" : "eye"} size={12} />
        </button>
      </div>
      {container && open ? kids.map((c, i) => <LayerRow key={c.id} node={c} zone={zone} parentId={node.id} index={i} depth={depth + 1} />) : null}
    </>
  );
}

// ------------------------------------------------------------------ Pages
const PAGE_TEMPLATES: { id: string; label: string; build: (name: string) => TBNode[] }[] = [
  { id: "blank", label: "Blank page", build: () => [] },
  { id: "title", label: "Title + content", build: (n) => [P.pageTitle(n, "Describe what this page is about."), P.aboutContent()] },
  { id: "landing", label: "Landing page", build: () => [P.heroCentered(), P.features(), P.testimonials(), P.cta()] },
  { id: "pricing", label: "Pricing page", build: (n) => [P.pageTitle(n, "Plans for every team."), P.pricing(), P.faq()] },
  { id: "contact", label: "Contact page", build: (n) => [P.pageTitle(n, "Get in touch."), P.contact()] },
];

function PagesTab() {
  const { theme, page, dispatch } = useBuilder();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [tpl, setTpl] = useState("blank");
  const [renaming, setRenaming] = useState<string | null>(null);

  const create = () => {
    const n = name.trim() || `Page ${theme.pages.length + 1}`;
    let slug = n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "page";
    while (theme.pages.some((p) => p.slug === slug)) slug += "-2";
    const t = PAGE_TEMPLATES.find((x) => x.id === tpl) ?? PAGE_TEMPLATES[0];
    dispatch({ type: "ADD_PAGE", page: newPage(n, slug, t.build(n)) });
    setAdding(false);
    setName("");
  };

  return (
    <div className="b-panel">
      <div className="b-panel-head">
        <div className="b-panel-title">
          Pages <span className="b-count">{theme.pages.length}</span>
        </div>
        <button className="b-btn small primary" onClick={() => setAdding(!adding)}>
          <Icon name="plus" size={13} /> New page
        </button>
      </div>
      <div className="b-panel-scroll">
        {adding ? (
          <div className="b-card">
            <Field label="Page name" full>
              <TextInput value={name} onChange={setName} placeholder="e.g. Services" />
            </Field>
            <Field label="Start from" full>
              <select className="b-input" value={tpl} onChange={(e) => setTpl(e.target.value)}>
                {PAGE_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="b-inline">
              <button className="b-btn small primary" onClick={create}>
                Create page
              </button>
              <button className="b-btn small ghost" onClick={() => setAdding(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}
        <div className="b-list">
          {theme.pages.map((p, i) => (
            <div key={p.id} className={`b-list-item ${p.id === page.id ? "on" : ""}`} onClick={() => dispatch({ type: "SET_PAGE", id: p.id })}>
              <Icon name={i === 0 ? "home" : "file"} size={15} />
              {renaming === p.id ? (
                <input
                  className="b-input"
                  autoFocus
                  defaultValue={p.name}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => {
                    dispatch({ type: "UPDATE_PAGE", id: p.id, patch: { name: e.target.value || p.name } });
                    setRenaming(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                />
              ) : (
                <div className="b-list-text">
                  <strong>{p.name}</strong>
                  <small>/{p.slug === "home" ? "" : p.slug}</small>
                </div>
              )}
              <div className="b-list-actions" onClick={(e) => e.stopPropagation()}>
                <button title="Rename" onClick={() => setRenaming(p.id)}>
                  <Icon name="edit" size={13} />
                </button>
                <button title="Move up" onClick={() => dispatch({ type: "MOVE_PAGE", id: p.id, dir: -1 })}>
                  <Icon name="up" size={13} />
                </button>
                <button title="Duplicate" onClick={() => dispatch({ type: "DUPLICATE_PAGE", id: p.id })}>
                  <Icon name="copy" size={13} />
                </button>
                <button
                  title="Delete"
                  className="danger"
                  disabled={theme.pages.length <= 1}
                  onClick={() => confirm(`Delete page "${p.name}"?`) && dispatch({ type: "DELETE_PAGE", id: p.id })}
                >
                  <Icon name="trash" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="b-hint">
          The header and footer are <strong>global</strong>: edit them on any page and every page in this theme updates. Turn them off per page in page settings (click empty canvas space).
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Themes
function ThemeColorRow({ k, label, hint, value, onChange }: { k: string; label: string; hint: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="t-color" data-color={k}>
      <label className="t-color-swatch" style={{ background: value }} title={`Pick ${label}`}>
        <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#888888"} onChange={(e) => onChange(e.target.value)} />
      </label>
      <div className="t-color-name">
        <strong>{label}</strong>
        <small title={hint}>{hint}</small>
      </div>
      <TextInput value={value} onChange={onChange} />
    </div>
  );
}

function ThemesTab() {
  const { state, theme, dispatch } = useBuilder();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState<"starter" | "blank" | "copy" | "mahatma">("starter");
  const [palette, setPalette] = useState("light");
  const t = theme.tokens;
  const colors = fullColors(t.colors);
  const setTok = (patch: Partial<Omit<Theme["tokens"], "colors">>, key: string) => dispatch({ type: "UPDATE_TOKENS", patch, key });

  const create = () => {
    const n = name.trim() || `Theme ${state.project.themes.length + 1}`;
    if (content === "copy") {
      dispatch({ type: "DUPLICATE_THEME", id: theme.id });
      return setCreating(false);
    }
    if (content === "mahatma") {
      dispatch({ type: "ADD_THEME", theme: { ...mahatmaTheme(), name: name.trim() || "Mahatma Alumni Meetup 2026" } });
      return setCreating(false);
    }
    const th = content === "starter" ? starterTheme(n, palette) : blankTheme(n, palette);
    if (content === "blank") {
      th.header = [P.navbar()];
      th.footer = [P.simpleFooter()];
    }
    dispatch({ type: "ADD_THEME", theme: { ...th, id: ulid() } });
    setCreating(false);
    setName("");
  };

  const dots = (c: Partial<Theme["tokens"]["colors"]>) => (
    <span className="b-dots">
      {(["primary", "secondary", "background", "text"] as const).map((k) => (
        <i key={k} style={{ background: c[k] }} />
      ))}
    </span>
  );

  return (
    <div className="b-panel">
      <div className="b-panel-head">
        <div className="b-panel-title">
          <Icon name="palette" size={15} /> {theme.name}
        </div>
      </div>
      <div className="b-panel-scroll">
        <Section title="Theme colors">
          <div className="b-note">These colors are used across the whole theme. Change one here and every element that uses it updates instantly.</div>
          <div className="t-palette">
            {COLOR_TOKENS.map((c) => (
              <ThemeColorRow
                key={c.key}
                k={c.key}
                label={c.label}
                hint={c.hint}
                value={colors[c.key]}
                onChange={(v) => dispatch({ type: "UPDATE_TOKENS", patch: {}, colors: { [c.key]: v }, key: "color:" + c.key })}
              />
            ))}
          </div>
        </Section>
        <Section title="Fonts">
          <Field label="Headings" full>
            <SelectInput value={t.headingFont} onChange={(v) => setTok({ headingFont: v || FONT_OPTIONS[0].value }, "hf")} options={FONT_OPTIONS.map((f) => ({ label: f.label, value: f.value }))} />
          </Field>
          <Field label="Body text" full>
            <SelectInput value={t.bodyFont} onChange={(v) => setTok({ bodyFont: v || FONT_OPTIONS[0].value }, "bf")} options={FONT_OPTIONS.map((f) => ({ label: f.label, value: f.value }))} />
          </Field>
          <div className="b-grid2">
            <Field label="Base text size">
              <UnitInput value={t.baseFontSize} onChange={(v) => setTok({ baseFontSize: v }, "bs")} />
            </Field>
          </div>
        </Section>
        <Section title="Shape & width">
          <div className="b-grid2">
            <Field label="Corner roundness">
              <UnitInput value={t.radius} onChange={(v) => setTok({ radius: v }, "r")} />
            </Field>
            <Field label="Content width">
              <UnitInput value={t.containerWidth} onChange={(v) => setTok({ containerWidth: v }, "cw")} step={10} />
            </Field>
          </div>
        </Section>
        <Section title="Start from a color preset" defaultOpen={false}>
          <div className="b-note">Replaces this theme&apos;s colors and fonts. You can undo with Ctrl+Z.</div>
          <div className="b-palettes">
            {TOKEN_PRESETS.map((p) => (
              <button
                key={p.id}
                className="b-palette"
                onClick={() => {
                  const { colors: pc, ...rest } = p.tokens;
                  dispatch({ type: "UPDATE_TOKENS", patch: rest, colors: pc });
                }}
              >
                {dots(p.tokens.colors)}
                {p.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title={`All themes (${state.project.themes.length})`}>
          <div className="b-list">
            {state.project.themes.map((th) => (
              <div key={th.id} className={`b-list-item ${th.id === theme.id ? "on" : ""}`} onClick={() => dispatch({ type: "SET_THEME", id: th.id })}>
                {dots(th.tokens.colors)}
                <div className="b-list-text">
                  <strong>{th.name}</strong>
                  <small>{th.pages.length} pages</small>
                </div>
                <div className="b-list-actions" onClick={(e) => e.stopPropagation()}>
                  <button title="Duplicate" onClick={() => dispatch({ type: "DUPLICATE_THEME", id: th.id })}>
                    <Icon name="copy" size={13} />
                  </button>
                  <button
                    title="Delete"
                    className="danger"
                    disabled={state.project.themes.length <= 1}
                    onClick={() => confirm(`Delete theme "${th.name}" and all its pages?`) && dispatch({ type: "DELETE_THEME", id: th.id })}
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Field label="Rename this theme" full>
            <TextInput value={theme.name} onChange={(v) => dispatch({ type: "RENAME_THEME", id: theme.id, name: v })} />
          </Field>
          {!creating ? (
            <button className="b-btn small primary" style={{ marginTop: 10 }} onClick={() => setCreating(true)}>
              <Icon name="plus" size={13} /> New theme
            </button>
          ) : (
            <div className="b-card" style={{ marginTop: 10 }}>
              <Field label="Theme name" full>
                <TextInput value={name} onChange={setName} placeholder="e.g. Summer Sale" />
              </Field>
              <Field label="Content" full>
                <select className="b-input" value={content} onChange={(e) => setContent(e.target.value as typeof content)}>
                  <option value="starter">Starter site (3 pages)</option>
                  <option value="blank">Blank (header, footer, empty home)</option>
                  <option value="mahatma">Alumni homecoming (Mahatma)</option>
                  <option value="copy">Copy of current theme</option>
                </select>
              </Field>
              {content !== "copy" && content !== "mahatma" ? (
                <Field label="Color & font style" full>
                  <div className="b-palettes">
                    {TOKEN_PRESETS.map((p) => (
                      <button key={p.id} className={`b-palette ${palette === p.id ? "on" : ""}`} onClick={() => setPalette(p.id)}>
                        {dots(p.tokens.colors)}
                        {p.label}
                      </button>
                    ))}
                  </div>
                </Field>
              ) : null}
              <div className="b-inline">
                <button className="b-btn small primary" onClick={create}>
                  Create theme
                </button>
                <button className="b-btn small ghost" onClick={() => setCreating(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>
        <Section title="Event data">
          <div className="b-note">The Speakers, Sponsors, Tickets and Sessions elements show live data from this Stutzee event.</div>
          <Field label="Stutzee event ID" full>
            <TextInput value={theme.eventId ?? ""} onChange={(v) => dispatch({ type: "SET_EVENT_ID", eventId: v.trim() })} placeholder="e.g. 01JXXXXXXXXXXXXXXXXXXXXXXX" />
          </Field>
          {theme.eventId && !isUlid(theme.eventId) ? <div className="b-note error">An event ID is 26 letters and digits.</div> : null}
          {theme.eventId && isUlid(theme.eventId) ? (
            <button className="b-btn small" onClick={() => refreshEventData()}>
              <Icon name="refresh" size={13} /> Reload event data
            </button>
          ) : null}
        </Section>
        <Section title="Global custom CSS" defaultOpen={false}>
          <div className="b-note">Applied to every page of this theme. Elements have classes like .tb-t-button and .tb-n-ID.</div>
          <TextInput multiline mono rows={8} value={theme.customCss} onChange={(v) => dispatch({ type: "SET_CUSTOM_CSS", css: v })} placeholder=".tb-t-button { letter-spacing: .5px; }" />
        </Section>
      </div>
    </div>
  );
}
