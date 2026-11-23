"use client";

import type { TBNode } from "../../../types";
import type { FieldDef } from "../../../registry";
import { useBuilder } from "../../../store";
import { isEventSource, type EventSource } from "../../../eventData";
import { str } from "../../../lib/values";
import { Icon } from "../../../ui/Icon";
import { Field, Section } from "../../../ui/controls";
import { Note } from "../../../ui/common";
import { useStyleEditor } from "../StyleEditor";
import { EventDataStatus } from "./EventDataStatus";
import { FieldEditor } from "./FieldEditor";

/** The node's content settings (text, links, images, data options), as defined in the registry. */
export function ContentFields({ node, fields }: { node: TBNode; fields: FieldDef[] }) {
  const { theme } = useBuilder();
  const { setProp, colors } = useStyleEditor();
  const isEventBlock = isEventSource(node.type);
  const eventId = str(node.props.eventId).trim() || str(theme.eventId).trim();
  if (!fields.length)
    return (
      <div className="b-empty-note">
        <Icon name="settings" size={22} />
        This element has no content settings. Use the Style tab to design it, or drop components inside it.
      </div>
    );
  return (
    <Section title={isEventBlock ? "Data & layout" : "Content"}>
      {isEventBlock ? <EventDataStatus source={node.type as EventSource} eventId={eventId} /> : null}
      {fields
        .filter((f) => !f.when || f.when(node.props))
        .map((f) => (
          <Field key={f.key} label={f.label} full>
            <FieldEditor field={f} value={node.props[f.key]} onChange={(v) => setProp(f.key, v)} pages={theme.pages} colors={colors} eventId={eventId} isImageNode={node.type === "image"} />
            {f.help ? <Note>{f.help}</Note> : null}
          </Field>
        ))}
    </Section>
  );
}
