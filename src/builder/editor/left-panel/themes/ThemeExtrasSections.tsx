"use client";

import { useBuilder } from "../../../store";
import { isUlid } from "../../../ulid";
import { refreshEventData } from "../../../eventData";
import { Icon } from "../../../ui/Icon";
import { Field, Section, TextInput } from "../../../ui/controls";
import { Note } from "../../../ui/common";

/** The Stutzee event whose live data the event blocks show. */
export function EventDataSection() {
  const { theme, dispatch } = useBuilder();
  const eventId = theme.eventId ?? "";
  return (
    <Section title="Event data">
      <Note>The Speakers, Sponsors, Tickets and Sessions elements show live data from this Stutzee event.</Note>
      <Field label="Stutzee event ID" full>
        <TextInput value={eventId} onChange={(v) => dispatch({ type: "SET_EVENT_ID", eventId: v.trim() })} placeholder="e.g. 01JXXXXXXXXXXXXXXXXXXXXXXX" />
      </Field>
      {eventId && !isUlid(eventId) ? <Note error>An event ID is 26 letters and digits.</Note> : null}
      {eventId && isUlid(eventId) ? (
        <button className="b-btn small" onClick={() => refreshEventData()}>
          <Icon name="refresh" size={13} /> Reload event data
        </button>
      ) : null}
    </Section>
  );
}

/** CSS added to every page of the theme. */
export function CustomCssSection() {
  const { theme, dispatch } = useBuilder();
  return (
    <Section title="Global custom CSS" defaultOpen={false}>
      <Note>Applied to every page of this theme. Elements have classes like .tb-t-button and .tb-n-ID.</Note>
      <TextInput multiline mono rows={8} value={theme.customCss} onChange={(v) => dispatch({ type: "SET_CUSTOM_CSS", css: v })} placeholder=".tb-t-button { letter-spacing: .5px; }" />
    </Section>
  );
}
