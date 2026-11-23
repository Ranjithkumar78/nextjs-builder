"use client";

import type { StyleState } from "../../types";
import { useBuilder } from "../../store";
import { nodeClass } from "../../css";
import { Field, Section, TextInput, Toggle } from "../../ui/controls";
import { Note } from "../../ui/common";
import { useStyleEditor } from "./StyleEditor";

/** HTML id and classes, visibility, raw CSS for this state, and element info. */
export function AdvancedTab() {
  const { dispatch } = useBuilder();
  const { node, styleState, own, set, setProp } = useStyleEditor();
  const hideOn = (state: StyleState) => dispatch({ type: "UPDATE_STYLE", id: node.id, state, patch: { display: "none" } });
  return (
    <>
      <Section title="Attributes">
        <Field label="HTML id (for #anchor links)">
          <TextInput value={String(node.props.htmlId ?? "")} onChange={(v) => setProp("htmlId", v.replace(/\s+/g, "-"))} placeholder="e.g. features" />
        </Field>
        <Field label="Extra CSS classes">
          <TextInput value={String(node.props.className ?? "")} onChange={(v) => setProp("className", v)} placeholder="my-class another" />
        </Field>
        <Field label="Visibility">
          <Toggle value={!node.hidden} onChange={() => dispatch({ type: "TOGGLE_HIDDEN", id: node.id })} label={node.hidden ? "Hidden" : "Visible"} />
        </Field>
      </Section>
      <Section title={`Custom CSS · ${styleState}`}>
        <Note>Raw CSS declarations for this element. Example: border-top: 4px solid red; backdrop-filter: blur(8px);</Note>
        <TextInput multiline rows={6} mono value={own.__custom ?? ""} onChange={(v) => set({ __custom: v })} placeholder="property: value;" />
      </Section>
      <Section title="Responsive visibility">
        <div className="b-inline">
          <button className="b-btn small" onClick={() => hideOn("mobile")}>
            Hide on mobile
          </button>
          <button className="b-btn small" onClick={() => hideOn("tablet")}>
            Hide on tablet & mobile
          </button>
        </div>
        <Note>Undo with the reset (×) next to Display while editing that device.</Note>
      </Section>
      <Section title="Element info" defaultOpen={false}>
        <div className="b-kv">
          <span>Type</span>
          <code>{node.type}</code>
          <span>ID</span>
          <code>{node.id}</code>
          <span>CSS class</span>
          <code>.{nodeClass(node.id)}</code>
        </div>
      </Section>
    </>
  );
}
