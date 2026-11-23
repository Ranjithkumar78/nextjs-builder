"use client";

import type { Page, ThemeColors } from "../../types";
import { useBuilder } from "../../store";
import { Icon } from "../../ui/Icon";
import { ColorInput, Field, Section, TextInput, Toggle } from "../../ui/controls";

const TIPS = [
  "Click any element on the canvas to style it.",
  "Double-click text to edit it in place.",
  "Drag elements to reorder; use the ⠿ handle on the selection label to move a parent.",
  "Switch to tablet or mobile to add responsive overrides.",
  "Shortcuts: Ctrl+Z undo, Ctrl+Shift+Z redo, Ctrl+D duplicate, Ctrl+C / Ctrl+V copy & paste, Del delete, Esc select parent.",
];

/** First four theme colors, editable here without leaving the page. */
function QuickThemeColors() {
  const { theme, dispatch } = useBuilder();
  const colors = theme.tokens.colors;
  return (
    <Section title="Quick theme colors">
      <div className="b-grid2">
        {(Object.keys(colors) as (keyof ThemeColors)[]).slice(0, 4).map((k) => (
          <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
            <ColorInput allowTokens={false} value={colors[k]} colors={colors} onChange={(v) => dispatch({ type: "UPDATE_TOKENS", patch: {}, colors: { [k]: v }, key: "color:" + k })} />
          </Field>
        ))}
      </div>
      <button className="b-btn small" onClick={() => dispatch({ type: "UI", patch: { leftTab: "themes" } })}>
        All theme settings →
      </button>
    </Section>
  );
}

/** Shown in the inspector when nothing is selected: the page's name, slug and header/footer switches. */
export function PageSettings({ page }: { page: Page }) {
  const { dispatch } = useBuilder();
  const update = (patch: Partial<Omit<Page, "id" | "nodes">>) => dispatch({ type: "UPDATE_PAGE", id: page.id, patch });
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
            <TextInput value={page.name} onChange={(v) => update({ name: v })} />
          </Field>
          <Field label="URL slug" full>
            <TextInput value={page.slug} onChange={(v) => update({ slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
          </Field>
          <Field label="Show global header" full>
            <Toggle value={page.showHeader} onChange={(v) => update({ showHeader: v })} />
          </Field>
          <Field label="Show global footer" full>
            <Toggle value={page.showFooter} onChange={(v) => update({ showFooter: v })} />
          </Field>
        </Section>
        <QuickThemeColors />
        <div className="b-tips">
          <strong>Tips</strong>
          <ul>
            {TIPS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
